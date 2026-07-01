import { Auth } from './auth.js';
import { Main } from './main.js';
import { API } from './api.js';

export const UI = {
    lang: 'es',
    translations: {
        es: {
            'market-status': 'MERCADO EN VIVO',
            'theme-lite': 'EDICIÓN LITE',
            'theme-amber': 'EDICIÓN AMBER',
            'welcome-pre': 'Hub Financiero ',
            'welcome-post': '',
            'welcome-default': 'Personalizado',
            'welcome-desc': 'Procesamiento de divisas inteligente en tiempo real con precisión de nivel bancario.',
            'from-label': 'ORIGEN',
            'to-label': 'DESTINO',
            'execute-btn': 'Ejecutar Transferencia ➔',
            'activity-title': 'Actividad de Conversión',
            'sync-msg': 'SINCRONIZACIÓN CON DB ACTIVA',
            'sync-offline': 'USANDO DATOS OFFLINE (CACHE)',
            'auth-login': 'INICIAR SESIÓN',
            'auth-register': 'REGISTRARSE',
            'auth-signin': 'ENTRAR',
            'auth-signup': 'REGISTRARSE',
            'field-name': 'Nombre Completo',
            'field-email': 'Correo Electrónico',
            'field-pass': 'Contraseña',
            'field-pic': 'FOTO DE PERFIL',
            'opt-url': 'OPCIÓN 1: URL WEB',
            'opt-file': 'OPCIÓN 2: ARCHIVO LOCAL',
            'btn-upload': 'SUBIR DESDE DISPOSITIVO',
            'lbl-interbank': 'TASA INTERBANCARIA',
            'lbl-daily-range': 'RANGO DIARIO',
            'title-trends': 'TENDENCIA DE RENDIMIENTO',
            'title-sessions': 'ESTADO DE SESIÓN DE MERCADO',
            'lbl-monthly-insight': 'INSIGHT MENSUAL',
            'lbl-exchanged': 'INTERCAMBIADO',
            'link-analytics': 'INFORME ANALÍTICO',
            'lbl-savings': 'AHORROS',
            'copyright': '© 2026 SISTEMAS CURRENCYHUB',
            'system-online': 'SISTEMA EN LÍNEA',
            'modal-title': 'Configuración de Usuario',
            'lbl-edit-name': 'Nombre Completo',
            'lbl-edit-email': 'Correo Electrónico',
            'lbl-edit-pass': 'Contraseña',
            'lbl-edit-pic': 'FOTO DE PERFIL',
            'lbl-edit-opt-url': 'OPCIÓN 1: URL WEB',
            'lbl-edit-opt-file': 'OPCIÓN 2: ARCHIVO LOCAL',
            'close-modal': 'Cancelar',
            'btn-save-profile': 'Guardar Cambios',
            'auth-footer-text': 'PROTEGIDO POR PROTOCOLOS DE SEGURIDAD Y ENCRIPTACIÓN DE GRADO BANCARIO',
            'search-placeholder': 'Buscar moneda...',
            'logout-title': 'Cerrar Sesión',
            'edit-profile-title': 'Editar Perfil',
            'city-london': 'Londres',
            'city-newyork': 'Nueva York',
            'city-tokyo': 'Tokio',
            'status-open': 'ABIERTO',
            'status-closed': 'CERRADO',
            'placeholder-name': 'Juan Pérez',
            'placeholder-email': 'juan@ejemplo.com',
            'placeholder-url': 'Introduce URL de la imagen',
            'clear-history-title': 'Vaciar Historial'
        },
        en: {
            'market-status': 'MARKET LIVE',
            'theme-lite': 'LITE EDITION',
            'theme-amber': 'AMBER EDITION',
            'welcome-pre': '',
            'welcome-post': ' Financial Hub',
            'welcome-default': 'Personalized',
            'welcome-desc': 'Intelligent real-time currency processing with bank-grade precision.',
            'from-label': 'FROM SOURCE',
            'to-label': 'TO DESTINATION',
            'execute-btn': 'Execute Transfer ➔',
            'activity-title': 'Conversion Activity',
            'sync-msg': 'DATABASE SYNC SECURED',
            'sync-offline': 'USING OFFLINE DATA (CACHED)',
            'auth-login': 'LOGIN',
            'auth-register': 'REGISTER',
            'auth-signin': 'SIGN IN',
            'auth-signup': 'SIGN UP',
            'field-name': 'Full Name',
            'field-email': 'Email Address',
            'field-pass': 'Password',
            'field-pic': 'PROFILE PICTURE',
            'opt-url': 'OPTION 1: WEB URL',
            'opt-file': 'OPTION 2: LOCAL FILE',
            'btn-upload': 'UPLOAD FROM DEVICE',
            'lbl-interbank': 'INTERBANK RATE',
            'lbl-daily-range': 'DAILY RANGE',
            'title-trends': 'PERFORMANCE TREND',
            'title-sessions': 'MARKET SESSION STATUS',
            'lbl-monthly-insight': 'MONTHLY INSIGHT',
            'lbl-exchanged': 'EXCHANGED',
            'link-analytics': 'ANALYTICS REPORT',
            'lbl-savings': 'SAVINGS',
            'copyright': '© 2026 CURRENCYHUB SYSTEMS',
            'system-online': 'SYSTEM ONLINE',
            'modal-title': 'User Settings',
            'lbl-edit-name': 'Full Name',
            'lbl-edit-email': 'Email Address',
            'lbl-edit-pass': 'Password',
            'lbl-edit-pic': 'PROFILE PICTURE',
            'lbl-edit-opt-url': 'OPTION 1: WEB URL',
            'lbl-edit-opt-file': 'OPTION 2: LOCAL FILE',
            'close-modal': 'Cancel',
            'btn-save-profile': 'Save Changes',
            'auth-footer-text': 'PROTECTED BY BANK-GRADE ENCRYPTION & SECURITY PROTOCOLS',
            'search-placeholder': 'Search currency...',
            'logout-title': 'Logout',
            'edit-profile-title': 'Edit Profile',
            'city-london': 'London',
            'city-newyork': 'New York',
            'city-tokyo': 'Tokyo',
            'status-open': 'OPEN',
            'status-closed': 'CLOSED',
            'placeholder-name': 'John Doe',
            'placeholder-email': 'john@example.com',
            'placeholder-url': 'Paste Image URL',
            'clear-history-title': 'Clear History'
        }
    },

    convertToWebp(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const webpBase64 = canvas.toDataURL('image/webp', 0.8);
                    resolve(webpBase64);
                };
                img.onerror = error => reject(error);
                img.src = event.target.result;
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    },

    init() {
        this.attachEvents();
    },

    attachEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        const langToggle = document.getElementById('lang-toggle');
        const logoutBtn = document.getElementById('logout-btn');
        const editProfileBtn = document.getElementById('edit-profile');

        if (themeToggle) themeToggle.addEventListener('click', () => this.toggleTheme());
        if (langToggle) langToggle.addEventListener('click', () => this.toggleLang());
        if (logoutBtn) logoutBtn.addEventListener('click', () => Auth.logout());
        if (editProfileBtn) editProfileBtn.addEventListener('click', () => this.showProfileEdit());
    },

    showDashboard() {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        document.getElementById('user-controls').classList.remove('hidden');

        // Load dashboard specifics
        this.applyTranslations(); // Refresh UI with user data
        Main.initDashboard();
    },

    showAuth() {
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('dashboard-section').classList.add('hidden');
        document.getElementById('user-controls').classList.add('hidden');
    },

    async toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', newTheme);
        document.getElementById('theme-label').textContent = newTheme === 'light' ? 'LITE EDITION' : 'AMBER EDITION';
        
        if (Auth.currentUser) {
            Auth.currentUser.theme = newTheme;
            try {
                await API.put('/user/preferences', { theme: newTheme });
            } catch (e) {
                console.error('Error guardando tema', e);
            }
        }
    },

    loadTheme() {
        const savedTheme = (Auth.currentUser && Auth.currentUser.theme) ? Auth.currentUser.theme : 'light';
        document.body.setAttribute('data-theme', savedTheme);
        this.updateThemeLabels(savedTheme);
    },

    updateThemeLabels(theme) {
        const label = document.getElementById('theme-label');
        if (label) {
            label.textContent = theme === 'light' ? this.translations[this.lang]['theme-lite'] : this.translations[this.lang]['theme-amber'];
        }
    },

    async toggleLang() {
        this.lang = this.lang === 'es' ? 'en' : 'es';
        
        if (Auth.currentUser) {
            Auth.currentUser.lang = this.lang;
            try {
                await API.put('/user/preferences', { lang: this.lang });
            } catch (e) {
                console.error('Error guardando idioma', e);
            }
        }
        this.applyTranslations();
    },

    loadLang() {
        this.lang = (Auth.currentUser && Auth.currentUser.lang) ? Auth.currentUser.lang : 'es';
        this.applyTranslations();
    },

    applyTranslations() {
        const t = this.translations[this.lang];

        // Header & Global
        document.getElementById('market-status').textContent = t['market-status'];
        this.updateThemeLabels(document.body.getAttribute('data-theme'));

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) logoutBtn.title = t['logout-title'];

        const editProfileBtn = document.getElementById('edit-profile');
        if (editProfileBtn) editProfileBtn.title = t['edit-profile-title'];

        // Welcome Section
        const welcome = document.getElementById('welcome-title');
        if (welcome) {
            const fullName = (Auth.currentUser && Auth.currentUser.name) ? Auth.currentUser.name : '';
            const userName = fullName ? fullName.split(' ')[0] : t['welcome-default'];

            // Safe Clear
            while (welcome.firstChild) {
                welcome.removeChild(welcome.firstChild);
            }

            if (t['welcome-pre']) {
                welcome.appendChild(document.createTextNode(t['welcome-pre']));
            }
            
            const span = document.createElement('span');
            span.className = 'highlight';
            span.textContent = userName;
            welcome.appendChild(span);

            if (t['welcome-post']) {
                welcome.appendChild(document.createTextNode(t['welcome-post']));
            }
        }
        const desc = document.querySelector('.welcome-msg p');
        if (desc) desc.textContent = t['welcome-desc'];

        // Conversion Card
        const labels = document.querySelectorAll('.selector-group label');
        if (labels.length >= 2) {
            labels[0].textContent = t['from-label'];
            labels[1].textContent = t['to-label'];
        }

        const placeholders = ['search-from', 'search-to'];
        placeholders.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.placeholder = t['search-placeholder'];
        });

        const exeBtn = document.getElementById('execute-btn');
        if (exeBtn) exeBtn.textContent = t['execute-btn'];

        const interbankLbl = document.getElementById('lbl-interbank');
        if (interbankLbl) interbankLbl.textContent = t['lbl-interbank'];

        const dailyRangeLbl = document.getElementById('lbl-daily-range');
        if (dailyRangeLbl) dailyRangeLbl.textContent = t['lbl-daily-range'];

        // Dashboard Sections
        const trendTitle = document.getElementById('title-trends');
        if (trendTitle) trendTitle.textContent = t['title-trends'];

        const sessionTitle = document.getElementById('title-sessions');
        if (sessionTitle) sessionTitle.textContent = t['title-sessions'];

        // Let the Dynamic Engine handle session labels based on new language
        if (typeof Main !== 'undefined' && Main.updateMarketSessions) {
            Main.updateMarketSessions();
        }

        const activityTitle = document.querySelector('.card-header__title h2');
        if (activityTitle) activityTitle.textContent = t['activity-title'];

        const syncMsg = document.querySelector('.card-header__title p');
        if (syncMsg) syncMsg.textContent = t['sync-msg'];

        const clearBtn = document.getElementById('clear-history');
        if (clearBtn) clearBtn.title = t['clear-history-title'];

        const monthlyLbl = document.getElementById('lbl-monthly-insight');
        if (monthlyLbl) monthlyLbl.textContent = t['lbl-monthly-insight'];

        const exchangedLbl = document.getElementById('lbl-exchanged');
        if (exchangedLbl) exchangedLbl.textContent = t['lbl-exchanged'];

        const savingsLbl = document.getElementById('lbl-savings');
        if (savingsLbl) savingsLbl.textContent = t['lbl-savings'];

        const analyticsLink = document.getElementById('link-analytics');
        if (analyticsLink) analyticsLink.textContent = t['link-analytics'];

        // Footer
        const copyright = document.getElementById('copyright');
        if (copyright) copyright.textContent = t['copyright'];


        const systemOnline = document.getElementById('system-online');
        if (systemOnline) systemOnline.textContent = Auth.currentUser ? t['system-online'] : t['system-online']; // Keep as is or refine logic

        // Modals (Edit Profile)
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) modalTitle.textContent = t['modal-title'];

        const editLabels = {
            'lbl-edit-name': 'lbl-edit-name',
            'lbl-edit-email': 'lbl-edit-email',
            'lbl-edit-pass': 'lbl-edit-pass',
            'lbl-edit-pic': 'lbl-edit-pic',
            'lbl-edit-opt-url': 'lbl-edit-opt-url',
            'lbl-edit-opt-file': 'lbl-edit-opt-file'
        };
        Object.entries(editLabels).forEach(([id, key]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = t[key];
        });

        const cancelBtn = document.getElementById('close-modal');
        if (cancelBtn) cancelBtn.textContent = t['close-modal'];

        const saveBtn = document.getElementById('btn-save-profile');
        if (saveBtn) saveBtn.textContent = t['btn-save-profile'];

        const editBtnUpload = document.getElementById('edit-btn-upload');
        if (editBtnUpload) editBtnUpload.textContent = t['btn-upload'];

        // Edit Modal Placeholders
        const editName = document.getElementById('edit-name');
        if (editName) editName.placeholder = t['placeholder-name'];
        const editEmail = document.getElementById('edit-email');
        if (editEmail) editEmail.placeholder = t['placeholder-email'];
        const editPicUrl = document.getElementById('edit-pic-url');
        if (editPicUrl) editPicUrl.placeholder = t['placeholder-url'];

        // Nav Avatar
        const navAvatar = document.getElementById('nav-avatar');
        if (navAvatar) {
            // Safe Clear
            while (navAvatar.firstChild) {
                navAvatar.removeChild(navAvatar.firstChild);
            }

            if (Auth.currentUser && Auth.currentUser.picUrl) {
                const img = document.createElement('img');
                img.src = Auth.currentUser.picUrl;
                img.alt = Auth.currentUser.name || 'User';
                img.onerror = () => {
                    // Fallback to icon
                    while (navAvatar.firstChild) navAvatar.removeChild(navAvatar.firstChild);
                    const icon = document.createElement('i');
                    icon.className = 'icon-avatar';
                    navAvatar.appendChild(icon);
                };
                navAvatar.appendChild(img);
            } else {
                const icon = document.createElement('i');
                icon.className = 'icon-avatar';
                navAvatar.appendChild(icon);
            }
        }

        // Auth form
        const authSection = document.getElementById('auth-section');
        if (authSection && !authSection.classList.contains('hidden')) {
            const footerText = document.getElementById('auth-footer-text');
            if (footerText) footerText.textContent = t['auth-footer-text'];

            document.getElementById('tab-login').textContent = t['auth-login'];
            document.getElementById('tab-register').textContent = t['auth-register'];
            Auth.switchTab(Auth.isLogin);
        } else {
            // Refresh chart to update labels if dashboard is visible
            if (typeof Main !== 'undefined' && Main.initTrendChart) {
                Main.initTrendChart();
            }
        }
    },

    showProfileEdit() {
        const modal = document.getElementById('profile-modal');
        const user = Auth.currentUser;
        if (!modal || !user) return;

        this.lastFocusedElement = document.activeElement; // Save for return
        const t = this.translations[this.lang];

        // Fill current data
        document.getElementById('edit-name').value = user.name || '';
        document.getElementById('edit-email').value = user.email || '';
        document.getElementById('edit-pass').value = ''; // Privacy: Do not pre-fill plain password or hash
        document.getElementById('edit-pic-url').value = user.picUrl || '';

        // Reset and handle preview
        const preview = document.getElementById('edit-pic-preview');
        this.updateEditPreview(user.picUrl);

        modal.classList.remove('hidden');
        
        // Focus first input
        setTimeout(() => document.getElementById('edit-name').focus(), 100);

        // Focus Trap logic
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        this.modalKeyHandler = (e) => {
            if (e.key === 'Escape') {
                closeBtn.click();
            }
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        };
        modal.addEventListener('keydown', this.modalKeyHandler);

        // Handle URL Preview in Edit Modal
        const urlInput = document.getElementById('edit-pic-url');
        urlInput.oninput = (e) => this.updateEditPreview(e.target.value);

        // Handle Password Strength Feedback (Optional but recommended)
        const passInput = document.getElementById('edit-pass');
        passInput.oninput = (e) => this.handlePasswordValidation(e.target.value, 'edit-pass-feedback');

        // Handle File Upload in Edit Modal
        const uploadBtn = document.getElementById('edit-btn-upload');
        const fileInput = document.getElementById('edit-file-input');
        uploadBtn.onclick = () => fileInput.click();

        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const base64 = await this.convertToWebp(file);
                this.updateEditPreview(base64);
                this.tempEditPic = base64;
            } catch (error) {
                console.error("Error al convertir la imagen a WEBP:", error);
            }
        };

        const closeModalCleanup = () => {
            modal.classList.add('hidden');
            this.tempEditPic = null;
            this.clearFeedback('edit-pass-feedback');
            modal.removeEventListener('keydown', this.modalKeyHandler);
            if (this.lastFocusedElement) this.lastFocusedElement.focus();
        };

        // Close logic
        const closeBtn = document.getElementById('close-modal');
        closeBtn.onclick = closeModalCleanup;

        const form = document.getElementById('profile-form');
        form.onsubmit = async (e) => {
            e.preventDefault();

            const newName = document.getElementById('edit-name').value;
            const newEmail = document.getElementById('edit-email').value;
            const newPass = document.getElementById('edit-pass').value;
            const newPicUrl = this.tempEditPic || document.getElementById('edit-pic-url').value;

            // Simple validation
            if (!newName || !newEmail) return;

            const updatedData = {
                name: newName,
                email: newEmail,
                picUrl: newPicUrl
            };

            // Only include password if the user typed a new one
            if (newPass) {
                if (newPass.length < 8) {
                    this.showNotification(this.lang === 'es' ? 'La nueva contraseña debe tener al menos 8 caracteres.' : 'New password must be at least 8 characters.', 'error');
                    return;
                }
                updatedData.pass = newPass;
            }

            // Use Auth engine to update and persist (now async)
            const success = await Auth.updateUser(user.email, updatedData);

            if (success) {
                closeModalCleanup();
                this.showNotification(this.lang === 'es' ? 'Perfil actualizado con éxito.' : 'Profile updated successfully.', 'success');
                this.applyTranslations(); // Refresh UI (name and avatar)
            }
        };
    },

    updateEditPreview(url) {
        const preview = document.getElementById('edit-pic-preview');
        if (!preview) return;
        
        // Remove existing children safely
        while (preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }

        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Preview';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            preview.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = 'icon-avatar';
            preview.appendChild(icon);
        }
    },

    showNotification(message, type = 'success') {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.setAttribute('aria-live', 'assertive');
            container.style.position = 'fixed';
            container.style.top = '2rem';
            container.style.right = '2rem';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `notification ${type}`;
        
        const icon = document.createElement('span');
        icon.textContent = type === 'success' ? '✓' : (type === 'error' ? '⚠' : 'ℹ');
        
        const text = document.createElement('span');
        text.textContent = message;

        toast.appendChild(icon);
        toast.appendChild(text);
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    handlePasswordValidation(password, containerId) {
        let container = document.getElementById(containerId);
        if (!container) {
            // Find parent form-group to append feedback if it doesn't exist
            const activeInput = document.activeElement;
            if (activeInput && activeInput.type === 'password') {
                container = document.createElement('div');
                container.id = containerId;
                container.className = 'pass-feedback';
                activeInput.parentNode.appendChild(container);
            } else {
                return;
            }
        }

        // Safe Clear
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        if (!password) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';

        const requirements = [
            { regex: /.{8,}/, es: 'Mínimo 8 caracteres', en: 'Min 8 characters' },
            { regex: /[A-Z]/, es: 'Una mayúscula', en: 'One uppercase' },
            { regex: /[0-9]/, es: 'Un número', en: 'One number' }
        ];

        requirements.forEach(req => {
            const isValid = req.regex.test(password);
            const item = document.createElement('div');
            item.className = `req-item ${isValid ? 'valid' : 'invalid'}`;
            
            const dot = document.createElement('span');
            dot.className = 'req-dot';
            
            const text = document.createElement('span');
            text.textContent = this.lang === 'es' ? req.es : req.en;
            
            item.appendChild(dot);
            item.appendChild(text);
            container.appendChild(item);
        });
    },

    clearFeedback(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.style.display = 'none';
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    }
};

