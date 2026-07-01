import { API } from './api.js';
import { UI } from './ui.js';

/**
 * auth.js - Handles authentication and session management via API
 */
export const Auth = {
    currentUser: null,
    isLogin: true,

    init() {
        this.checkSession();
        this.renderForm();
        this.attachEvents();

        // Performance: Pre-fetch rates while user is on login screen
        if (typeof Main !== 'undefined' && Main.fetchRates) {
            Main.fetchRates();
        }
    },

    async checkSession() {
        try {
            // Siempre intentamos obtener la sesión del servidor (usará la cookie)
            const data = await API.get('/user/me');
            this.currentUser = data.user;
            UI.loadTheme();
            UI.loadLang();
            UI.showDashboard();
        } catch (error) {
            // No hay sesión activa o es inválida
            this.currentUser = null;
            UI.loadTheme();
            UI.loadLang();
        }
    },

    attachEvents() {
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        const authForm = document.getElementById('auth-form');

        if (tabLogin) {
            tabLogin.addEventListener('click', () => this.switchTab(true));
        }
        if (tabRegister) {
            tabRegister.addEventListener('click', () => this.switchTab(false));
        }
        if (authForm) {
            authForm.addEventListener('submit', async (e) => await this.handleSubmit(e));
        }
    },

    switchTab(isLogin) {
        this.isLogin = isLogin;
        const t = UI.translations[UI.lang];
        document.getElementById('tab-login').classList.toggle('active', isLogin);
        document.getElementById('tab-register').classList.toggle('active', !isLogin);
        document.getElementById('auth-submit').textContent = isLogin ? t['auth-signin'] : t['auth-signup'];
        this.renderForm();
    },

    renderForm() {
        const fieldsContainer = document.getElementById('form-fields');
        if (!fieldsContainer) return;

        // Safe Clear
        while (fieldsContainer.firstChild) {
            fieldsContainer.removeChild(fieldsContainer.firstChild);
        }
        
        const t = UI.translations[UI.lang];

        if (!this.isLogin) {
            this.createInputField(fieldsContainer, 'text', 'reg-name', t['field-name'], t['placeholder-name'], 'user');
        }

        this.createInputField(fieldsContainer, 'email', 'auth-email', t['field-email'], t['placeholder-email'], 'mail');
        this.createInputField(fieldsContainer, 'password', 'auth-pass', t['field-pass'], '••••••••••••', 'lock');

        if (!this.isLogin) {
            // Profile Picture Section
            const picGroup = document.createElement('div');
            picGroup.className = 'form-group profile-pic-group';
            
            const label = document.createElement('label');
            label.textContent = t['field-pic'];
            
            const selectorDiv = document.createElement('div');
            selectorDiv.className = 'pic-selector';
            
            const previewDiv = document.createElement('div');
            previewDiv.className = 'pic-preview';
            previewDiv.id = 'pic-preview';
            
            const icon = document.createElement('i');
            icon.className = 'icon-avatar';
            previewDiv.appendChild(icon);
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'pic-options';
            
            const p1 = document.createElement('p');
            p1.textContent = t['opt-url'];
            
            const urlInput = document.createElement('input');
            urlInput.type = 'url';
            urlInput.id = 'pic-url';
            urlInput.placeholder = t['placeholder-url'];
            
            const p2 = document.createElement('p');
            p2.textContent = t['opt-file'];
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'file-input';
            fileInput.accept = 'image/*';
            fileInput.className = 'hidden';
            
            const uploadBtn = document.createElement('button');
            uploadBtn.type = 'button';
            uploadBtn.className = 'btn-secondary';
            uploadBtn.id = 'btn-upload';
            uploadBtn.textContent = t['btn-upload'];
            
            // Append options
            optionsDiv.appendChild(p1);
            optionsDiv.appendChild(urlInput);
            optionsDiv.appendChild(p2);
            optionsDiv.appendChild(fileInput);
            optionsDiv.appendChild(uploadBtn);
            
            // Append selector
            selectorDiv.appendChild(previewDiv);
            selectorDiv.appendChild(optionsDiv);
            
            // Append to group
            picGroup.appendChild(label);
            picGroup.appendChild(selectorDiv);
            
            fieldsContainer.appendChild(picGroup);

            // Handle URL Preview
            const urlInputEl = document.getElementById('pic-url');
            if (urlInputEl) {
                urlInputEl.addEventListener('input', (e) => this.handleUrlPreview(e.target.value));
            }

            // Handle File Upload
            const uploadBtnEl = document.getElementById('btn-upload');
            const fileInputEl = document.getElementById('file-input');

            if (uploadBtnEl && fileInputEl) {
                uploadBtnEl.onclick = () => fileInputEl.click();
                fileInputEl.onchange = (e) => this.handleFileSelect(e);
            }
        }
    },

    handleUrlPreview(url) {
        const preview = document.getElementById('pic-preview');
        if (!preview) return;

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

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            this.handleUrlPreview(base64);
            this.tempPic = base64;
        };
        reader.readAsDataURL(file);
    },

    createInputField(parent, type, id, labelText, placeholder, icon) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', id);
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.placeholder = placeholder;
        input.required = true;

        if (type === 'password' && !this.isLogin) {
            input.oninput = (e) => UI.handlePasswordValidation(e.target.value, 'auth-pass-feedback');
            input.onblur = () => {
                if (!input.value) UI.clearFeedback('auth-pass-feedback');
            };
        }

        group.appendChild(label);
        group.appendChild(input);
        parent.appendChild(group);
    },

    async handleSubmit(e) {
        e.preventDefault();

        const emailInput = document.getElementById('auth-email');
        const passInput = document.getElementById('auth-pass');
        const submitBtn = document.getElementById('auth-submit');

        if (!emailInput || !passInput) return;

        const email = emailInput.value;
        const pass = passInput.value;

        // Visual loading effect
        let originalText = '';
        if (submitBtn) {
            submitBtn.disabled = true;
            originalText = submitBtn.textContent;
            submitBtn.textContent = UI.lang === 'es' ? 'Procesando...' : 'Processing...';
            submitBtn.classList.add('loading');
        }

        try {
            if (this.isLogin) {
                await this.login(email, pass);
            } else {
                const nameInput = document.getElementById('reg-name');
                if (!nameInput) return;

                const name = nameInput.value;
                const picUrlFromInput = document.getElementById('pic-url')?.value || '';
                const finalPic = this.tempPic || picUrlFromInput;

                if (!name || !email || !pass) {
                    if (typeof UI !== 'undefined' && UI.showNotification) {
                        UI.showNotification(UI.lang === 'es' ? 'Por favor, rellena todos los campos.' : 'Please fill in all fields.', 'error');
                    }
                    return;
                }

                // Strict validation
                const hasUpper = /[A-Z]/.test(pass);
                const hasNum = /[0-9]/.test(pass);
                if (pass.length < 8 || !hasUpper || !hasNum) {
                    if (typeof UI !== 'undefined' && UI.showNotification) {
                        UI.showNotification(UI.lang === 'es' ? 'La contraseña no cumple los requisitos.' : 'Password does not meet requirements.', 'error');
                    }
                    return;
                }

                await this.register(name, email, pass, finalPic);
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('loading');
            }
        }
    },

    async login(email, pass) {
        try {
            const data = await API.post('/auth/login', { email, pass });
            
            this.currentUser = data.user;
            UI.loadTheme();
            UI.loadLang();
            
            UI.showDashboard();
            
            if (typeof Main !== 'undefined' && Main.init) {
                Main.renderHistory();
                Main.calculateInsights();
            }
        } catch (error) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(error.message, 'error');
            }
        }
    },

    async register(name, email, pass, picUrl) {
        try {
            await API.post('/auth/register', { name, email, pass, picUrl });
            
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(UI.lang === 'es' ? '¡Registro exitoso! Redirigiendo a Login...' : 'Registration successful! Redirecting to Login...', 'success');
            }
            
            // Redirigir a inicio de sesión tras un breve delay
            setTimeout(() => {
                this.switchTab(true);
                // Rellenar el email para conveniencia del usuario
                const emailInput = document.getElementById('auth-email');
                if (emailInput) emailInput.value = email;
                
                const passInput = document.getElementById('auth-pass');
                if (passInput) passInput.focus();
            }, 2000);
        } catch (error) {
            // Inteligencia Enterprise: Si el usuario ya existe, facilitar el login
            if (error.message.includes('ya existe') || error.message.includes('already exists')) {
                if (typeof UI !== 'undefined' && UI.showNotification) {
                    UI.showNotification(UI.lang === 'es' ? 'Este usuario ya existe. Redirigiendo a Login...' : 'User already exists. Redirecting to Login...', 'info');
                }
                
                // Cambiar a pestaña de login tras un breve delay para que el usuario vea el mensaje
                setTimeout(() => {
                    this.switchTab(true);
                    // Mantener el email para conveniencia del usuario
                    const emailInput = document.getElementById('auth-email');
                    if (emailInput) emailInput.value = email;
                    
                    const passInput = document.getElementById('auth-pass');
                    if (passInput) passInput.focus();
                }, 1500);
            } else {
                if (typeof UI !== 'undefined' && UI.showNotification) {
                    UI.showNotification(error.message, 'error');
                }
            }
        }
    },

    async logout() {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            console.error('Error al hacer logout', error);
        }
        this.currentUser = null;
        UI.loadTheme();
        UI.loadLang();
        UI.showAuth();
    },

    async updateUser(oldEmail, updatedData) {
        try {
            await API.put('/user/profile', updatedData);
            
            // Re-fetch current session info or update local
            this.currentUser = { ...this.currentUser, ...updatedData };
            return true;
        } catch (error) {
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(error.message, 'error');
            }
            return false;
        }
    }
};
