// autenticacao-login.js - Validação de formulário para login CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    
    // Elementos de mensagem de erro
    const emailError = document.getElementById('login-email-error');
    const passwordError = document.getElementById('login-password-error');
    
    // Botões de login social
    const googleLoginBtn = document.getElementById('google-login');
    const facebookLoginBtn = document.getElementById('facebook-login');
    const appleLoginBtn = document.getElementById('apple-login');
    
    // Elementos toast
    const successToast = document.getElementById('success-toast');
    const errorToast = document.getElementById('error-toast');
    
    // Inicialização
    initValidation();
    
    function initValidation() {
        // Adicionar event listeners para validação em tempo real
        emailInput.addEventListener('blur', validateEmail);
        passwordInput.addEventListener('blur', validatePassword);
        
        // Event listener para mostrar/ocultar senha
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
        
        // Event listener para o formulário
        loginForm.addEventListener('submit', handleFormSubmit);
        
        // Event listeners para login social
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', handleGoogleLogin);
        }
        
        if (facebookLoginBtn) {
            facebookLoginBtn.addEventListener('click', handleFacebookLogin);
        }
        
        if (appleLoginBtn) {
            appleLoginBtn.addEventListener('click', handleAppleLogin);
        }
    }
    
    // Validação do e-mail
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const formGroup = emailInput.closest('.form-group');
        
        if (email === '') {
            showError(emailError, 'Por favor, informe seu e-mail.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError(emailError, 'Por favor, informe um e-mail válido.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        hideError(emailError);
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        return true;
    }
    
    // Validação da senha
    function validatePassword() {
        const password = passwordInput.value;
        const formGroup = passwordInput.closest('.form-group');
        
        if (password === '') {
            showError(passwordError, 'Por favor, informe sua senha.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        if (password.length < 6) {
            showError(passwordError, 'A senha deve ter pelo menos 6 caracteres.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        hideError(passwordError);
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        return true;
    }
    
    // Mostrar/ocultar senha
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
    
    // Manipular envio do formulário
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validar todos os campos
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        // Se todos os campos são válidos, enviar formulário
        if (isEmailValid && isPasswordValid) {
            simulateLogin();
        } else {
            scrollToFirstError();
        }
    }
    
    // Simular login
    function simulateLogin() {
        // Mostrar estado de carregamento
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Entrando...</span>';
        submitBtn.disabled = true;
        
        // Simular chamada à API (substituir por implementação real)
        setTimeout(() => {
            // Aqui você faria a chamada real para sua API
            // Por enquanto, apenas simulamos sucesso
            showSuccessToast('Login realizado com sucesso!');
            
            // Redirecionar para a página do perfil
            setTimeout(() => {
                window.location.href = '../pages/perfil.html';
            }, 1500);
            
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    // Login com Google
    function handleGoogleLogin() {
        // Mostrar estado de carregamento
        const originalText = googleLoginBtn.innerHTML;
        googleLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Conectando...</span>';
        googleLoginBtn.disabled = true;
        
        // Simular autenticação com Google (substituir por implementação real)
        setTimeout(() => {
            showSuccessToast('Login com Google realizado com sucesso!');
            
            // Restaurar botão
            googleLoginBtn.innerHTML = originalText;
            googleLoginBtn.disabled = false;
            
            // Registrar evento no Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'login', {
                    'method': 'Google'
                });
            }
        }, 1500);
    }
    
    // Login com Facebook
    function handleFacebookLogin() {
        const originalText = facebookLoginBtn.innerHTML;
        facebookLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Conectando...</span>';
        facebookLoginBtn.disabled = true;
        
        setTimeout(() => {
            showSuccessToast('Login com Facebook realizado com sucesso!');
            
            facebookLoginBtn.innerHTML = originalText;
            facebookLoginBtn.disabled = false;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'login', {
                    'method': 'Facebook'
                });
            }
        }, 1500);
    }
    
    // Login com Apple
    function handleAppleLogin() {
        const originalText = appleLoginBtn.innerHTML;
        appleLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Conectando...</span>';
        appleLoginBtn.disabled = true;
        
        setTimeout(() => {
            showSuccessToast('Login com Apple realizado com sucesso!');
            
            appleLoginBtn.innerHTML = originalText;
            appleLoginBtn.disabled = false;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'login', {
                    'method': 'Apple'
                });
            }
        }, 1500);
    }
    
    // Mostrar toast de sucesso
    function showSuccessToast(message) {
        const toastText = successToast.querySelector('.toast-text');
        toastText.textContent = message;
        successToast.classList.add('show');
        
        setTimeout(() => {
            successToast.classList.remove('show');
        }, 3000);
    }
    
    // Mostrar toast de erro
    function showErrorToast(message) {
        const toastText = errorToast.querySelector('.toast-text');
        toastText.textContent = message;
        errorToast.classList.add('show');
        
        setTimeout(() => {
            errorToast.classList.remove('show');
        }, 3000);
    }
    
    // Utilitários para mostrar/ocultar erros
    function showError(errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    function hideError(errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    // Rolar para o primeiro campo com erro
    function scrollToFirstError() {
        const firstError = document.querySelector('.error-message[style="display: block;"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

