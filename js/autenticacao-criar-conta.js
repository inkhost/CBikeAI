// autenticacao-criar-conta.js - Validação de formulário para criação de conta CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const signupForm = document.getElementById('signup-form');
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const acceptTerms = document.getElementById('accept-terms');
    
    // Elementos de mensagem de erro
    const nameError = document.getElementById('signup-name-error');
    const emailError = document.getElementById('signup-email-error');
    const passwordError = document.getElementById('signup-password-error');
    const confirmPasswordError = document.getElementById('signup-confirm-password-error');
    
    // Elementos de força da senha
    const passwordStrengthFill = document.getElementById('password-strength-fill');
    const passwordStrengthText = document.getElementById('password-strength-text');
    
    // Botão de cadastro com Google
    const googleSignupBtn = document.getElementById('google-signup');
    
    // Inicialização
    initValidation();
    
    function initValidation() {
        // Adicionar event listeners para validação em tempo real
        nameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        passwordInput.addEventListener('input', validatePassword);
        confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
        
        // Event listener para o formulário
        signupForm.addEventListener('submit', handleFormSubmit);
        
        // Event listener para cadastro com Google
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', handleGoogleSignup);
        }
    }
    
    // Validação do nome
    function validateName() {
        const name = nameInput.value.trim();
        const formGroup = nameInput.closest('.form-group');
        
        if (name === '') {
            showError(nameError, 'Por favor, informe seu nome completo.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        if (name.length < 2) {
            showError(nameError, 'O nome deve ter pelo menos 2 caracteres.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(name)) {
            showError(nameError, 'O nome deve conter apenas letras e espaços.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        hideError(nameError);
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        return true;
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
            showError(passwordError, 'Por favor, informe uma senha.');
            updatePasswordStrength(0, 'Fraca');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        // Verificar força da senha
        const strength = calculatePasswordStrength(password);
        
        if (password.length < 8) {
            showError(passwordError, 'A senha deve ter pelo menos 8 caracteres.');
            updatePasswordStrength(strength.score, strength.text);
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        hideError(passwordError);
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        updatePasswordStrength(strength.score, strength.text);
        return true;
    }
    
    // Validação da confirmação de senha
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const formGroup = confirmPasswordInput.closest('.form-group');
        
        if (confirmPassword === '') {
            showError(confirmPasswordError, 'Por favor, confirme sua senha.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError(confirmPasswordError, 'As senhas não coincidem.');
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            return false;
        }
        
        hideError(confirmPasswordError);
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        return true;
    }
    
    // Calcular força da senha
    function calculatePasswordStrength(password) {
        let score = 0;
        let text = 'Fraca';
        
        // Critérios de força
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        // Pontuação baseada em critérios atendidos
        if (password.length >= 8) score += 1;
        if (hasLowercase) score += 1;
        if (hasUppercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChars) score += 1;
        
        // Determinar força com base na pontuação
        if (score >= 4) {
            text = 'Forte';
        } else if (score >= 3) {
            text = 'Média';
        }
        
        return { score: score, text: text };
    }
    
    // Atualizar indicador visual de força da senha
    function updatePasswordStrength(score, text) {
        // Limpar classes anteriores
        passwordStrengthFill.className = 'strength-fill';
        
        // Definir cor e largura com base na força
        let width = '0%';
        let colorClass = '';
        
        switch(score) {
            case 0:
            case 1:
                width = '20%';
                colorClass = 'strength-weak';
                break;
            case 2:
                width = '40%';
                colorClass = 'strength-weak';
                break;
            case 3:
                width = '60%';
                colorClass = 'strength-medium';
                break;
            case 4:
                width = '80%';
                colorClass = 'strength-strong';
                break;
            case 5:
                width = '100%';
                colorClass = 'strength-strong';
                break;
        }
        
        // Aplicar estilos
        passwordStrengthFill.style.width = width;
        passwordStrengthFill.classList.add(colorClass);
        passwordStrengthText.textContent = `Força da senha: ${text}`;
    }
    
    // Validação dos termos
    function validateTerms() {
        if (!acceptTerms.checked) {
            // Destacar visualmente o checkbox
            acceptTerms.parentElement.classList.add('terms-error');
            return false;
        }
        
        acceptTerms.parentElement.classList.remove('terms-error');
        return true;
    }
    
    // Manipular envio do formulário
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validar todos os campos
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsAccepted = validateTerms();
        
        // Se todos os campos são válidos, enviar formulário
        if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsAccepted) {
            // Simular envio de formulário (substituir por chamada real à API)
            simulateFormSubmission();
        } else {
            // Rolar para o primeiro erro
            scrollToFirstError();
        }
    }
    
    // Simular envio do formulário
    function simulateFormSubmission() {
        // Mostrar estado de carregamento
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Criando conta...</span>';
        submitBtn.disabled = true;
        
        // Simular chamada à API (substituir por implementação real)
        setTimeout(() => {
            // Aqui você faria a chamada real para sua API
            // Por enquanto, apenas simulamos sucesso
            showSuccessMessage();
            
            // Restaurar botão
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    // Mostrar mensagem de sucesso
    function showSuccessMessage() {
        // Criar elemento de mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Conta criada com sucesso!</h3>
            <p>Enviamos um e-mail de confirmação para <strong>${emailInput.value}</strong>. Verifique sua caixa de entrada.</p>
            <button id="continue-btn" class="btn btn-primary">
                <span class="btn-text">Continuar</span>
                <i class="fas fa-arrow-right btn-icon"></i>
            </button>
        `;
        
        // Substituir formulário por mensagem de sucesso
        const authContainer = document.querySelector('.auth-container');
        authContainer.innerHTML = '';
        authContainer.appendChild(successMessage);
        
        // Adicionar evento ao botão de continuar
        document.getElementById('continue-btn').addEventListener('click', function() {
            window.location.href = '../pages/login.html';
        });
        
        // Registrar evento de conversão no Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                'method': 'Email'
            });
        }
    }
    
    // Cadastro com Google
    function handleGoogleSignup() {
        // Mostrar estado de carregamento
        const originalText = googleSignupBtn.innerHTML;
        googleSignupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="btn-text">Conectando...</span>';
        googleSignupBtn.disabled = true;
        
        // Simular autenticação com Google (substituir por implementação real)
        setTimeout(() => {
            alert('Funcionalidade de cadastro com Google será implementada em breve.');
            
            // Restaurar botão
            googleSignupBtn.innerHTML = originalText;
            googleSignupBtn.disabled = false;
            
            // Registrar evento no Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'sign_up', {
                    'method': 'Google'
                });
            }
        }, 1500);
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