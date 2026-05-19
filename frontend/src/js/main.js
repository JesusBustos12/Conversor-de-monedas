import { API } from './api.js';
import { Auth } from './auth.js';
import { UI } from './ui.js';

export const Main = {
    rates: {},
    baseCurrency: 'USD',

    async initDashboard() {
        this.initFlagObserver();
        this.initGlobalImageErrorHandler();
        await this.fetchRates();
        this.setupCustomDropdowns(); // Asegurar dropdowns antes de eventos
        this.attachConversionEvents();
        this.startAutoRefresh();
        this.updateMarketSessions();
        this.initTrendChart();
        await this.renderHistory();
        this.calculateInsights();
        this.attachActivityEvents();

        // Listen for real-time connection changes
        window.addEventListener('online', () => this.fetchRates());
        window.addEventListener('offline', () => this.updateOnlineStatus(false));

        // Global click to close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
            }
        });

        // Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW: Status Active', reg.scope))
                    .catch(err => console.error('SW: Failed', err));
            });
        }
    },

    initGlobalImageErrorHandler() {
        // Manejo global de errores de imágenes para evitar handlers inline (violación de CSP)
        // Usamos el evento 'error' en fase de captura porque no burbujea.
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' && e.target.classList.contains('flag-icon')) {
                const fallback = 'https://flagcdn.com/un.svg';
                if (e.target.src !== fallback) {
                    e.target.src = fallback;
                }
            }
        }, true);
    },

    initFlagObserver() {
        this.flagObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    this.flagObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });
    },

    startAutoRefresh() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(() => {
            this.fetchRates().then(() => this.convert());
        }, 300000);

        if (this.sessionInterval) clearInterval(this.sessionInterval);
        this.sessionInterval = setInterval(() => {
            this.updateMarketSessions();
        }, 60000);
    },

    getMarketStatus(city) {
        const now = new Date();
        const utcHour = now.getUTCHours();

        const sessions = {
            'london': { open: 8, close: 16 },
            'newyork': { open: 13, close: 21 },
            'tokyo': { open: 0, close: 9 }
        };

        const session = sessions[city.toLowerCase()];
        if (!session) return 'closed';

        const isOpen = utcHour >= session.open && utcHour < session.close;
        return isOpen ? 'open' : 'closed';
    },

    updateMarketSessions() {
        ['london', 'newyork', 'tokyo'].forEach(city => {
            const status = this.getMarketStatus(city);
            const statusEl = document.getElementById(`status-${city}`);
            if (statusEl) {
                const isEs = (typeof UI !== 'undefined' && UI.lang === 'es');
                statusEl.textContent = status === 'open' ?
                    (isEs ? 'ABIERTO' : 'OPEN') :
                    (isEs ? 'CERRADO' : 'CLOSED');

                statusEl.className = `badge ${status === 'open' ? 'success' : 'muted'}`;
            }
        });
    },

    async calculateInsights() {
        try {
            const history = await API.get('/history');
            if (history.length === 0) {
                const totalEl = document.getElementById('insight-total-amount');
                if (totalEl) totalEl.textContent = '$0';
                const savingsEl = document.getElementById('insight-savings-amount');
                if (savingsEl) savingsEl.textContent = '$0.00';
                return;
            }

            let totalUSD = 0;
            history.forEach(item => {
                const amount = parseFloat(item.amount);
                if (item.from === 'USD') {
                    totalUSD += amount;
                } else if (this.rates[item.from]) {
                    totalUSD += amount / this.rates[item.from];
                }
            });

            const totalEl = document.getElementById('insight-total-amount');
            if (totalEl) {
                totalEl.textContent = `$${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }

            const savings = totalUSD * 0.021;
            const savingsEl = document.getElementById('insight-savings-amount');
            if (savingsEl) {
                savingsEl.textContent = `$${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            }
        } catch (error) {
            console.error('Failed to calculate insights:', error);
        }
    },

    async fetchRates(retryCount = 0) {
        const API_URL = 'https://cdn.moneyconvert.net/api/latest.json';
        const LOCAL_API_PATH = 'assets/data/latest.json';
        const retryDelays = [10000, 30000, 60000];

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            this.rates = data.rates;
            this.updateOnlineStatus(true);
        } catch (error) {
            console.warn(`API fetch failed (attempt ${retryCount + 1}):`, error);

            if (!this.rates || Object.keys(this.rates).length === 0) {
                await this.fetchLocalRates(LOCAL_API_PATH);
            }

            if (retryCount < retryDelays.length) {
                setTimeout(() => this.fetchRates(retryCount + 1), retryDelays[retryCount]);
            }

            this.updateOnlineStatus(false);
        }
        
        if (this.rates) this.setupCustomDropdowns();
    },

    async fetchLocalRates(path) {
        try {
            const response = await fetch(path);
            const data = await response.json();
            this.rates = data.rates;
        } catch (error) {
            console.error('Failed to load local rates:', error);
        }
    },

    updateOnlineStatus(isOnline) {
        const statusText = document.getElementById('market-status');
        const systemStatus = document.getElementById('system-online');
        const liveDot = document.querySelector('.status-badge__dot');
        const syncStatusText = document.getElementById('sync-status');
        const t = UI.translations[UI.lang];

        if (isOnline) {
            if (statusText) statusText.textContent = t['market-status'];
            if (systemStatus) systemStatus.textContent = t['system-online'];
            if (liveDot) liveDot.style.backgroundColor = '#2ECC71';
            if (syncStatusText) syncStatusText.textContent = t['sync-msg'];
        } else {
            if (statusText) statusText.textContent = UI.lang === 'es' ? 'MODO OFFLINE' : 'OFFLINE MODE';
            if (systemStatus) systemStatus.textContent = UI.lang === 'es' ? 'MODO RESILIENTE' : 'RESILIENT MODE';
            if (liveDot) liveDot.style.backgroundColor = '#FFB700';
            if (syncStatusText) syncStatusText.textContent = t['sync-offline'];
        }
    },

    renderDashboard() {
        const dashboard = document.getElementById('dashboard-section');
        if (!dashboard) return;

        this.setupCustomDropdowns();
        this.convert();
        this.initTrendChart();
    },

    initTrendChart() {
        const canvas = document.getElementById('trend-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        const data = [1.082, 1.085, 1.084, 1.089, 1.092, 1.091, 1.095].map(v => v + (Math.random() - 0.5) * 0.005);
        const min = Math.min(...data) * 0.999;
        const max = Math.max(...data) * 1.001;
        const getY = (val) => height - ((val - min) / (max - min) * (height * 0.7) + (height * 0.15));
        const getX = (i) => (i / (data.length - 1)) * width;

        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#FFB700';
        
        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, primaryColor + '26');
        gradient.addColorStop(1, primaryColor + '00');

        ctx.beginPath();
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.moveTo(getX(0), getY(data[0]));

        for (let i = 0; i < data.length - 1; i++) {
            const x1 = getX(i);
            const y1 = getY(data[i]);
            const x2 = getX(i + 1);
            const y2 = getY(data[i + 1]);
            const cp1x = x1 + (x2 - x1) / 2;
            const y_cp = y1;
            const cp2x = x1 + (x2 - x1) / 2;
            const y_cp2 = y2;
            ctx.bezierCurveTo(cp1x, y_cp, cp2x, y_cp2, x2, y2);
        }
        
        ctx.stroke();
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fillStyle = gradient;
        ctx.fill();
    },

    getCountryCode(currencyCode) {
        const mapping = {
            'USD': 'us', 'EUR': 'eu', 'GBP': 'gb', 'JPY': 'jp', 'CAD': 'ca', 'MXN': 'mx', 'AUD': 'au',
            'BRL': 'br', 'CHF': 'ch', 'CNY': 'cn', 'INR': 'in', 'KRW': 'kr', 'RUB': 'ru', 'SAR': 'sa',
            'ZAR': 'za', 'TRY': 'tr', 'HKD': 'hk', 'SGD': 'sg', 'NZD': 'nz', 'ARS': 'ar', 'CLP': 'cl',
            'COP': 'co', 'PEN': 'pe', 'UYU': 'uy', 'VES': 've', 'ILS': 'il', 'AED': 'ae', 'THB': 'th',
            'MYR': 'my', 'PHP': 'ph', 'IDR': 'id', 'VND': 'vn', 'TWD': 'tw', 'DKK': 'dk', 'NOK': 'no',
            'SEK': 'se', 'PLN': 'pl', 'CZK': 'cz', 'HUF': 'hu', 'RON': 'ro', 'UAH': 'ua'
        };
        return mapping[currencyCode] || currencyCode.substring(0, 2).toLowerCase();
    },

    setupCustomDropdowns() {
        if (!this.rates || Object.keys(this.rates).length === 0) return;

        const allCurrencies = Object.keys(this.rates).map(code => ({
            code: code,
            flag: this.getCountryCode(code),
            name: code
        })).sort((a, b) => a.code.localeCompare(b.code));

        this.initDropdown('from', allCurrencies, 'USD');
        this.initDropdown('to', allCurrencies, 'EUR');
    },

    initDropdown(type, currencies, defaultCode) {
        const dropdown = document.getElementById(`dropdown-${type}`);
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const list = document.getElementById(`list-${type}`);
        const searchInput = document.getElementById(`search-${type}`);
        const flagEl = document.getElementById(`selected-${type}-flag`);
        const codeEl = document.getElementById(`selected-${type}-code`);

        const renderList = (filtered) => {
            while (list.firstChild) list.removeChild(list.firstChild);

            filtered.forEach(c => {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                item.dataset.code = c.code;
                item.dataset.flag = `https://flagcdn.com/${c.flag}.svg`;
                item.role = 'option';
                item.tabIndex = -1;

                const img = document.createElement('img');
                img.dataset.src = `https://flagcdn.com/${c.flag}.svg`;
                img.src = 'https://flagcdn.com/un.svg';
                img.className = 'flag-icon';
                img.onerror = () => { img.src = 'https://flagcdn.com/un.svg'; };
                
                if (this.flagObserver) this.flagObserver.observe(img);

                const span = document.createElement('span');
                span.className = 'currency-code';
                span.textContent = c.code;

                item.appendChild(img);
                item.appendChild(span);

                item.onclick = (e) => {
                    e.stopPropagation();
                    flagEl.src = item.dataset.flag;
                    codeEl.textContent = item.dataset.code;
                    dropdown.dataset.value = item.dataset.code;
                    dropdown.classList.remove('active');
                    this.convert();
                };

                list.appendChild(item);
            });
        };

        renderList(currencies);

        if (searchInput) {
            searchInput.oninput = (e) => {
                const term = e.target.value.toUpperCase();
                const filtered = currencies.filter(c => c.code.includes(term));
                renderList(filtered);
            };
            searchInput.onclick = (e) => e.stopPropagation();
        }

        trigger.onclick = () => {
            dropdown.classList.toggle('active');
            if (dropdown.classList.contains('active') && searchInput) searchInput.focus();
        };

        if (!dropdown.dataset.value) {
            dropdown.dataset.value = defaultCode;
            flagEl.src = `https://flagcdn.com/${this.getCountryCode(defaultCode)}.svg`;
            codeEl.textContent = defaultCode;
        }
    },

    attachConversionEvents() {
        const amountInput = document.getElementById('amount');
        const swapBtn = document.getElementById('swap-currencies');
        const executeBtn = document.getElementById('execute-btn');

        if (amountInput) {
            amountInput.addEventListener('input', () => this.convert());
        }

        if (swapBtn) {
            swapBtn.onclick = () => {
                const fromDropdown = document.getElementById('dropdown-from');
                const toDropdown = document.getElementById('dropdown-to');
                const fromFlag = document.getElementById('selected-from-flag');
                const toFlag = document.getElementById('selected-to-flag');
                const fromCode = document.getElementById('selected-from-code');
                const toCode = document.getElementById('selected-to-code');

                // Guardar valores actuales
                const tempValue = fromDropdown.dataset.value;
                const tempFlagSrc = fromFlag.src;
                const tempCodeText = fromCode.textContent;

                // Intercambiar
                fromDropdown.dataset.value = toDropdown.dataset.value;
                fromFlag.src = toFlag.src;
                fromCode.textContent = toCode.textContent;

                toDropdown.dataset.value = tempValue;
                toFlag.src = tempFlagSrc;
                toCode.textContent = tempCodeText;

                this.convert();
            };
        }

        if (executeBtn) executeBtn.onclick = () => this.executeTransfer();
    },

    convert() {
        const amount = parseFloat(document.getElementById('amount')?.value || 0);
        const from = document.getElementById('dropdown-from')?.dataset.value;
        const to = document.getElementById('dropdown-to')?.dataset.value;

        if (!amount || !from || !to || !this.rates[from] || !this.rates[to]) return;

        const rate = this.rates[to] / this.rates[from];
        const result = amount * rate;
        
        // Almacenar valores brutos para la API (sin formato de miles/comas)
        this.lastRawResult = result;
        this.lastRawRate = rate;

        const resultElement = document.getElementById('result-amount');
        const currentRateElement = document.getElementById('current-rate');

        if (resultElement) resultElement.textContent = result.toLocaleString(undefined, { minimumFractionDigits: 2 });
        if (currentRateElement) currentRateElement.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    },

    async executeTransfer() {
        const amount = document.getElementById('amount')?.value;
        const from = document.getElementById('dropdown-from')?.dataset.value;
        const to = document.getElementById('dropdown-to')?.dataset.value;
        
        // Usar valores brutos almacenados en lugar del texto del DOM (que tiene comas)
        const result = this.lastRawResult;
        const rateText = document.getElementById('current-rate')?.textContent;

        if (!amount || !from || !to || result === undefined) return;

        try {
            await API.post('/history', { 
                from, 
                to, 
                amount, 
                result: result.toFixed(4), // Enviar como string numérico puro
                rate: rateText 
            });
            await this.renderHistory();
            this.calculateInsights();
            UI.showNotification(UI.lang === 'es' ? '¡Transferencia Exitosa!' : 'Transfer Successful!', 'success');
        } catch (error) {
            UI.showNotification(error.message, 'error');
        }
    },

    async renderHistory() {
        const listContainer = document.getElementById('activity-list');
        if (!listContainer) return;

        while (listContainer.firstChild) listContainer.removeChild(listContainer.firstChild);

        try {
            const history = await API.get('/history');
            const isEs = UI.lang === 'es';

            if (history.length === 0) {
                const p = document.createElement('p');
                p.className = 'empty-msg';
                p.textContent = isEs ? 'No hay actividad aún.' : 'No activity yet.';
                listContainer.appendChild(p);
                return;
            }

            history.slice(0, 6).forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';

                const dot = document.createElement('div');
                dot.className = 'timeline-dot';

                const content = document.createElement('div');
                content.className = 'timeline-content';

                const timestamp = document.createElement('p');
                timestamp.className = 'timestamp';
                timestamp.textContent = `${item.date}, ${item.timestamp} `;
                const badge = document.createElement('span');
                badge.className = 'badge success';
                badge.textContent = 'OK';
                timestamp.appendChild(badge);

                const conversion = document.createElement('p');
                conversion.className = 'conversion-text';
                conversion.textContent = `${item.amount} ${item.from} ➔ `;
                const highlight = document.createElement('span');
                highlight.className = 'highlight';
                highlight.textContent = `${item.result} ${item.to}`;
                conversion.appendChild(highlight);

                const rateLine = document.createElement('p');
                rateLine.className = 'rate-muted';
                rateLine.textContent = item.rate;

                content.appendChild(timestamp);
                content.appendChild(conversion);
                content.appendChild(rateLine);

                timelineItem.appendChild(dot);
                timelineItem.appendChild(content);

                listContainer.appendChild(timelineItem);
            });
        } catch (error) {
            console.error('History Error:', error);
        }
    },

    attachActivityEvents() {
        const clearBtn = document.getElementById('clear-history');
        if (clearBtn) {
            clearBtn.onclick = async () => await this.clearHistory();
        }
    },

    async clearHistory() {
        try {
            await API.request('/history', { method: 'DELETE' });
            await this.renderHistory();
            this.calculateInsights();
            UI.showNotification(UI.lang === 'es' ? 'Historial vaciado' : 'History cleared', 'success');
        } catch (error) {
            UI.showNotification(error.message, 'error');
        }
    }
};

// Punto de entrada único para la aplicación
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
    UI.init();
});
