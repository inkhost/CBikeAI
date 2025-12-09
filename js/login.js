// login.js - Sistema de autenticação e login para CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Elementos de erro
    const emailError = document.getElementById('login-email-error');
    const passwordError = document.getElementById('login-password-error');
    
    // Elementos de feedback
    const successToast = document.getElementById('success-toast');
    const errorToast = document.getElementById('error-toast');

    // Estado da aplicação
    let isLoading = false;

    /**
     * Inicializa o sistema de login
     */
    function initLoginSystem() {
        loadSavedCredentials();
        setupEventListeners();
        setupAccessibility();
    }

    /**
     * Carrega credenciais salvas se "Lembrar-me" estava marcado
     */
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

    /**
     * Configura todos os event listeners
     */
    function setupEventListeners() {
        // Validação em tempo real
        emailInput.addEventListener('blur', () => validateEmail());
        passwordInput.addEventListener('blur', () => validatePassword());
        
        // Submit do formulário
        loginForm.addEventListener('submit', handleFormSubmit);
        
        // Mostrar/ocultar senha
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        
        // Teclado shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Prevenir múltiplos envios
        loginForm.addEventListener('submit', preventMultipleSubmit);
    }

    /**
     * Configura melhorias de acessibilidade
     */
    function setupAccessibility() {
        // Labels como aria-describedby para errors
        emailInput.setAttribute('aria-describedby', 'login-email-error');
        passwordInput.setAttribute('aria-describedby', 'login-password-error');
        
        // Melhorar feedback para screen readers
        emailInput.addEventListener('invalid', () => {
            emailInput.setAttribute('aria-invalid', 'true');
        });
        
        emailInput.addEventListener('input', () => {
            if (emailInput.getAttribute('aria-invalid') === 'true') {
                emailInput.setAttribute('aria-invalid', 'false');
            }
        });
    }

    /**
     * Valida o campo de e-mail
     */
    function validateEmail() {
        const email = emailInput.value.trim();
        const formGroup = emailInput.closest('.form-group');
        
        // Limpar estados anteriores
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

    /**
     * Valida o campo de senha
     */
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

    /**
     * Verifica se o e-mail é válido
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Mostrar/ocultar senha
     */
    function togglePasswordVisibility() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        
        // Feedback para screen readers
        togglePasswordBtn.setAttribute('aria-label', 
            isPassword ? 'Ocultar senha' : 'Mostrar senha');
    }

    /**
     * Manipula o envio do formulário
     */
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

    /**
     * Processa o login do usuário
     */
    function processLogin() {
        isLoading = true;
        setLoadingState(true);
        
        const loginData = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
            rememberMe: rememberMeCheckbox.checked
        };
        
        // Simular chamada à API (substituir por implementação real)
        simulateAPILogin(loginData)
            .then(handleLoginSuccess)
            .catch(handleLoginError)
            .finally(() => {
                isLoading = false;
                setLoadingState(false);
            });
    }

    /**
     * Simula login via API (substituir por implementação real)
     */
    function simulateAPILogin(loginData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulação: credenciais válidas se senha tem pelo menos 6 caracteres
                if (loginData.password.length >= 6) {
                    resolve({
                        success: true,
                        user: {
                            name: loginData.email.split('@')[0],
                            email: loginData.email,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(loginData.email.split('@')[0])}&background=09e331&color=000&size=200`
                        },
                        token: 'simulated_jwt_token_' + Date.now()
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Credenciais inválidas. Verifique seu e-mail e senha.'
                    });
                }
            }, 1500);
        });
    }

    /**
     * Manipula login bem-sucedido
     */
    function handleLoginSuccess(response) {
        // Salvar dados do usuário
        saveUserData(response.user, response.token);
        
        // Salvar credenciais se "Lembrar-me" estiver marcado
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('savedEmail', response.user.email);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('rememberMe');
        }
        
        // Registrar evento de analytics
        logLoginEvent('email', true);
        
        // Mostrar feedback e redirecionar
        showSuccessToast('Login realizado com sucesso!');
        
        setTimeout(() => {
            window.location.href = '../pages/perfil.html';
        }, 1500);
    }

    /**
     * Manipula erro no login
     */
    function handleLoginError(error) {
        logLoginEvent('email', false);
        showErrorToast(error.message || 'Erro ao fazer login. Tente novamente.');
        
        // Destacar campos com erro
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.add('error'));
    }

    /**
     * Salva dados do usuário no localStorage
     */
    function saveUserData(user, token) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userAvatar', user.avatar);
        localStorage.setItem('authToken', token);
        localStorage.setItem('loginMethod', 'email');
        localStorage.setItem('memberSince', new Date().toLocaleDateString('pt-BR'));
    }

    /**
     * Gerencia shortcuts de teclado
     */
    function handleKeyboardShortcuts(e) {
        // Ctrl + Enter para submit
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
        
        // Tab navigation personalizada
        if (e.key === 'Tab' && e.shiftKey) {
            // Comportamento padrão já é suficiente
        }
    }

    /**
     * Previne múltiplos envios do formulário
     */
    function preventMultipleSubmit(e) {
        if (isLoading) {
            e.preventDefault();
            return false;
        }
    }

    /**
     * Define estado de carregamento
     */
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

    /**
     * Utilitários para mostrar/ocultar erros
     */
    function showFieldError(errorElement, message, formGroup) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        formGroup.classList.add('error');
    }

    function clearFieldState(formGroup) {
        const errorElement = formGroup.querySelector('.error-message');
        errorElement.style.display = 'none';
        formGroup.classList.remove('error', 'success');
    }

    function showFieldSuccess(formGroup) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
    }

    /**
     * Mostra mensagens toast
     */
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
        
        // Anunciar para screen readers
        announceToScreenReader(message);
        
        setTimeout(() => {
            toastElement.classList.remove('show');
        }, 5000);
    }

    /**
     * Anuncia mensagens para screen readers
     */
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

    /**
     * Rola para o primeiro erro
     */
    function scrollToFirstError() {
        const firstError = document.querySelector('.error-message[style="display: block;"]');
        if (firstError) {
            firstError.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    /**
     * Registra eventos de login para analytics
     */
    function logLoginEvent(method, success) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'login', {
                'method': method,
                'success': success
            });
        }
        
        // Log para debug (remover em produção)
        console.log(`Login attempt: ${method}, Success: ${success}`);
    }

    // Inicializar o sistema
    initLoginSystem();
});

// CSS para screen readers
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