// login.js - Sistema de autenticação e login para CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // ===== ELEMENTOS DO DOM =====
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Elementos de erro
    const emailError = document.getElementById('login-email-error');
    const passwordError = document.getElementById('login-password-error');
    
    // Botões sociais
    const googleLoginBtn = document.getElementById('google-login');
    const stravaLoginBtn = document.getElementById('strava-login');
    
    // Elementos de feedback
    const successToast = document.getElementById('success-toast');
    const errorToast = document.getElementById('error-toast');
    const GOOGLE_CLIENT_ID = '383981809594-fhdkg696bnu3dns13hj1mup4gd510tvq.apps.googleusercontent.com';

    // ===== ESTADO =====
    let isLoading = false;

    // ===== INICIALIZAÇÃO =====
    function initLoginSystem() {
        loadSavedCredentials();
        setupEventListeners();
        setupAccessibility();
        initializeGoogleSignIn();
        setupSocialButtons();
        checkAutoLogin();
    }

    // ===== AUTO LOGIN =====
    function checkAutoLogin() {
        if (window.CBikeAuth?.isAuthenticated()) {
            window.location.href = '../pages/perfil.html';
        }
    }

    // ===== CARREGAR CREDENCIAIS SALVAS =====
    function loadSavedCredentials() {
        const savedEmail = localStorage.getItem('savedEmail');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (rememberMe && savedEmail) {
            emailInput.value = savedEmail;
            rememberMeCheckbox.checked = true;
            
            // Focar no campo de senha para facilitar o login
            setTimeout(() => passwordInput.focus(), 100);
        }
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Validação em tempo real
        emailInput.addEventListener('blur', () => validateEmail());
        passwordInput.addEventListener('blur', () => validatePassword());
        
        // Validação ao digitar (feedback imediato)
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error') || emailInput.classList.contains('success')) {
                validateEmail();
            }
        });
        
        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('error') || passwordInput.classList.contains('success')) {
                validatePassword();
            }
        });
        
        // Submit do formulário
        loginForm.addEventListener('submit', handleFormSubmit);
        
        // Mostrar/ocultar senha
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        
        // Teclado shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Prevenir múltiplos envios
        loginForm.addEventListener('submit', preventMultipleSubmit);
    }

    // ===== BOTÕES SOCIAIS =====
    function initializeGoogleSignIn() {
        if (!window.google?.accounts?.id || !GOOGLE_CLIENT_ID) {
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            context: 'signin'
        });
    }

    function setGoogleButtonLoading(loading) {
        if (!googleLoginBtn) return;

        googleLoginBtn.disabled = loading;
        const icon = googleLoginBtn.querySelector('i');
        const label = googleLoginBtn.querySelector('span');

        if (!icon || !label) return;

        if (loading) {
            icon.className = 'fas fa-spinner fa-spin';
            label.textContent = 'Conectando...';
        } else {
            icon.className = 'fab fa-google';
            label.textContent = 'Entrar com Google';
        }
    }

    async function handleGoogleCredentialResponse(response) {
        if (!response?.credential) {
            setGoogleButtonLoading(false);
            showErrorToast('Não foi possível concluir o login com o Google.');
            return;
        }

        setGoogleButtonLoading(true);

        try {
            const result = await fetch('/auth/google/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credential: response.credential,
                    provider: 'google',
                    action: 'signin'
                })
            });

            const data = await result.json();

            if (!result.ok || !data?.ok) {
                throw new Error(data?.error || 'Erro ao validar o login com o Google.');
            }

            const userProfile = {
                id: data.user?.id || data.user?.sub || `google-${Date.now()}`,
                name: data.user?.name || data.user?.given_name || data.user?.email?.split('@')[0] || 'Usuário Google',
                email: data.user?.email || '',
                phone: '',
                avatar: data.user?.picture || '',
                provider: 'google'
            };

            if (window.CBikeAuth?.signInWithGoogle) {
                await window.CBikeAuth.signInWithGoogle(userProfile);
            } else {
                saveUserData({
                    id: userProfile.id,
                    name: userProfile.name,
                    email: userProfile.email,
                    phone: '',
                    avatar: userProfile.avatar
                }, data.token || 'google-session');
                localStorage.setItem('cbikeai_user', JSON.stringify({
                    id: userProfile.id,
                    name: userProfile.name,
                    email: userProfile.email,
                    avatar: userProfile.avatar,
                    phone: ''
                }));
                localStorage.setItem('cbikeai_token', data.token || 'google-session');
                localStorage.setItem('loginMethod', 'google');
            }

            logLoginEvent('google', true);
            showSuccessToast(`Bem-vindo, ${userProfile.name}! 🚴‍♂️`);
            setTimeout(() => {
                window.location.href = '../pages/perfil.html';
            }, 1200);
        } catch (error) {
            console.error('Erro no login com Google:', error);
            logLoginEvent('google', false);
            showErrorToast(error.message || 'Não foi possível entrar com o Google.');
        } finally {
            setGoogleButtonLoading(false);
        }
    }

    function promptGoogleSignIn() {
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'http:'
            ? window.location.origin
            : 'http://localhost:3000';

        window.location.href = `${baseUrl}/auth/google/redirect`;
    }

    function setupSocialButtons() {
        googleLoginBtn.addEventListener('click', function() {
            promptGoogleSignIn();
        });
        
        stravaLoginBtn.addEventListener('click', function() {
            showErrorToast('Login com Strava em breve!');
            logLoginEvent('strava', false);
        });
    }

    // ===== ACESSIBILIDADE =====
    function setupAccessibility() {
        emailInput.setAttribute('aria-describedby', 'login-email-error');
        passwordInput.setAttribute('aria-describedby', 'login-password-error');
        
        emailInput.addEventListener('invalid', () => {
            emailInput.setAttribute('aria-invalid', 'true');
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.getAttribute('aria-invalid') === 'true') {
                emailInput.setAttribute('aria-invalid', 'false');
            }
        });
    }

    // ===== VALIDAÇÕES =====
    function validateEmail() {
        const email = emailInput.value.trim();
        const formGroup = emailInput.closest('.form-group');
        clearFieldState(formGroup);
        
        if (!email) {
            showFieldError(emailError, 'Por favor, informe seu e-mail.', formGroup);
            return false;
        }
        if (!isValidEmail(email)) {
            showFieldError(emailError, 'Por favor, informe um e-mail válido.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;
        const formGroup = passwordInput.closest('.form-group');
        clearFieldState(formGroup);
        
        if (!password) {
            showFieldError(passwordError, 'Por favor, informe sua senha.', formGroup);
            return false;
        }
        if (password.length < 6) {
            showFieldError(passwordError, 'A senha deve ter pelo menos 6 caracteres.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== MOSTRAR/OCULTAR SENHA =====
    function togglePasswordVisibility() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
    }

    // ===== SUBMIT =====
    function handleFormSubmit(e) {
        e.preventDefault();
        if (isLoading) return;
        
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isEmailValid && isPasswordValid) {
            processLogin();
        } else {
            scrollToFirstError();
            showErrorToast('Por favor, corrija os erros antes de continuar.');
        }
    }

    // ===== PROCESSAR LOGIN =====
    function processLogin() {
        isLoading = true;
        setLoadingState(true);
        
        const loginData = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
            rememberMe: rememberMeCheckbox.checked
        };
        
        window.CBikeAuth?.signIn(loginData.email, loginData.password)
            .then(handleLoginSuccess)
            .catch(handleLoginError)
            .finally(() => {
                isLoading = false;
                setLoadingState(false);
            });
    }

    // ===== SUCESSO =====
    function handleLoginSuccess(response) {
        const userData = response?.user;
        const displayName = userData?.user_metadata?.full_name || userData?.user_metadata?.name || userData?.email || 'Usuário CBikeAI';

        if (rememberMeCheckbox.checked) {
            localStorage.setItem('savedEmail', userData.email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('rememberMe');
        }
        
        logLoginEvent('email', true);
        showSuccessToast(`Bem-vindo de volta, ${displayName}! 🚴‍♂️`);
        updateNavigationAfterLogin();
        
        setTimeout(() => {
            window.location.href = '../pages/perfil.html';
        }, 1500);
    }

    // ===== ERRO =====
    function handleLoginError(error) {
        logLoginEvent('email', false);
        showErrorToast(error.message || 'Erro ao fazer login. Tente novamente.');
        
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.add('error'));
    }

    // ===== SALVAR DADOS =====
    function saveUserData(user, token) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user?.name || user?.email || 'Usuário CBikeAI');
        localStorage.setItem('userEmail', user?.email || '');
        localStorage.setItem('userAvatar', user?.avatar || '');
        localStorage.setItem('authToken', token || '');
        localStorage.setItem('loginMethod', 'email');
        localStorage.setItem('memberSince', new Date().toLocaleDateString('pt-BR'));
        localStorage.setItem('lastLogin', new Date().toISOString());
    }

    // ===== ATUALIZAR NAVEGAÇÃO =====
    function updateNavigationAfterLogin() {
        const loginLink = document.getElementById('login-link');
        const profileLink = document.getElementById('profile-link');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (loginLink) loginLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'inline';
        if (logoutBtn) logoutBtn.style.display = 'inline';
    }

    // ===== SHORTCUTS =====
    function handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    }

    function preventMultipleSubmit(e) {
        if (isLoading) {
            e.preventDefault();
            return false;
        }
    }

    // ===== ESTADO DE CARREGAMENTO =====
    function setLoadingState(loading) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        if (loading) {
            btnText.textContent = 'Entrando...';
            btnIcon.className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;
        } else {
            btnText.textContent = 'Entrar';
            btnIcon.className = 'fas fa-arrow-right';
            submitBtn.disabled = false;
        }
    }

    // ===== UTILITÁRIOS DE UI =====
    function showFieldError(errorElement, message, formGroup) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        if (formGroup) formGroup.classList.add('error');
    }

    function clearFieldState(formGroup) {
        const errorElement = formGroup?.querySelector('.error-message');
        if (errorElement) errorElement.style.display = 'none';
        if (formGroup) formGroup.classList.remove('error', 'success');
    }

    function showFieldSuccess(formGroup) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    }

    function showSuccessToast(message) {
        showToast(successToast, message);
    }

    function showErrorToast(message) {
        showToast(errorToast, message);
    }

    function showToast(toastElement, message) {
        const toastText = toastElement.querySelector('.toast-text');
        toastText.textContent = message;
        toastElement.classList.add('show');
        
        announceToScreenReader(message);
        
        setTimeout(() => {
            toastElement.classList.remove('show');
        }, 5000);
    }

    function announceToScreenReader(message) {
        const announcer = document.getElementById('aria-announcer') || createAriaAnnouncer();
        announcer.textContent = message;
    }

    function createAriaAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'aria-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        return announcer;
    }

    function scrollToFirstError() {
        const firstError = document.querySelector('.error-message[style*="display: block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // ===== ANALYTICS =====
    function logLoginEvent(method, success) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'login', {
                'method': method,
                'success': success
            });
        }
        console.log(`Login attempt: ${method}, Success: ${success}`);
    }

    // ===== INICIALIZAR =====
    initLoginSystem();
});

// ===== CSS PARA SCREEN READERS =====
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);