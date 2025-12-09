// criar-conta.js - Sistema de criação de conta para CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const signupForm = document.getElementById('signup-form');
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const acceptTerms = document.getElementById('accept-terms');
    
    // Elementos de erro
    const nameError = document.getElementById('signup-name-error');
    const emailError = document.getElementById('signup-email-error');
    const passwordError = document.getElementById('signup-password-error');
    const confirmPasswordError = document.getElementById('signup-confirm-password-error');
    
    // Elementos de força da senha
    const passwordStrengthFill = document.getElementById('password-strength-fill');
    const passwordStrengthText = document.getElementById('password-strength-text');
    
    // Botões de mostrar/ocultar senha
    const toggleSignupPasswordBtn = document.getElementById('toggle-signup-password');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
    
    // Elementos de feedback
    const successToast = document.getElementById('success-toast');
    const errorToast = document.getElementById('error-toast');

    // Estado da aplicação
    let isLoading = false;
    let passwordStrength = {
        score: 0,
        text: 'Fraca'
    };

    /**
     * Inicializa o sistema de cadastro
     */
    function initSignupSystem() {
        setupEventListeners();
        setupAccessibility();
        setupPasswordStrengthMeter();
    }

    /**
     * Configura todos os event listeners
     */
    function setupEventListeners() {
        // Validação em tempo real
        nameInput.addEventListener('blur', () => validateName());
        emailInput.addEventListener('blur', () => validateEmail());
        passwordInput.addEventListener('input', handlePasswordInput);
        confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword());
        acceptTerms.addEventListener('change', () => validateTerms());
        
        // Mostrar/ocultar senha
        toggleSignupPasswordBtn.addEventListener('click', () => togglePasswordVisibility(passwordInput, toggleSignupPasswordBtn));
        toggleConfirmPasswordBtn.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn));
        
        // Submit do formulário
        signupForm.addEventListener('submit', handleFormSubmit);
        
        // Teclado shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    /**
     * Configura melhorias de acessibilidade
     */
    function setupAccessibility() {
        // Labels como aria-describedby para errors e dicas
        nameInput.setAttribute('aria-describedby', 'signup-name-error');
        emailInput.setAttribute('aria-describedby', 'signup-email-error');
        passwordInput.setAttribute('aria-describedby', 'signup-password-error password-strength-text');
        confirmPasswordInput.setAttribute('aria-describedby', 'signup-confirm-password-error');
        
        // Atributos adicionais para força da senha
        passwordStrengthText.id = 'password-strength-text';
        passwordStrengthText.setAttribute('aria-live', 'polite');
        passwordStrengthText.setAttribute('aria-atomic', 'true');
    }

    /**
     * Configura o medidor de força da senha
     */
    function setupPasswordStrengthMeter() {
        updatePasswordStrengthDisplay();
    }

    /**
     * Valida o campo de nome
     */
    function validateName() {
        const name = nameInput.value.trim();
        const formGroup = nameInput.closest('.form-group');
        
        clearFieldState(formGroup);
        
        if (!name) {
            showFieldError(nameError, 'Por favor, informe seu nome completo.', formGroup);
            return false;
        }
        
        if (name.length < 2) {
            showFieldError(nameError, 'O nome deve ter pelo menos 2 caracteres.', formGroup);
            return false;
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(name)) {
            showFieldError(nameError, 'O nome deve conter apenas letras e espaços.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    /**
     * Valida o campo de e-mail
     */
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
        
        // Verificar se e-mail já existe (simulação)
        if (isEmailAlreadyRegistered(email)) {
            showFieldError(emailError, 'Este e-mail já está cadastrado. Tente fazer login.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    /**
     * Manipula a entrada de senha (validação em tempo real)
     */
    function handlePasswordInput() {
        validatePassword();
        validateConfirmPassword(); // Revalidar confirmação quando a senha mudar
    }

    /**
     * Valida o campo de senha
     */
    function validatePassword() {
        const password = passwordInput.value;
        const formGroup = passwordInput.closest('.form-group');
        
        clearFieldState(formGroup);
        
        if (!password) {
            showFieldError(passwordError, 'Por favor, informe uma senha.', formGroup);
            updatePasswordStrength(0, 'Fraca');
            return false;
        }
        
        // Calcular força da senha
        const strength = calculatePasswordStrength(password);
        passwordStrength = strength;
        updatePasswordStrengthDisplay();
        
        if (password.length < 8) {
            showFieldError(passwordError, 'A senha deve ter pelo menos 8 caracteres.', formGroup);
            return false;
        }
        
        if (strength.score < 3) {
            showFieldError(passwordError, 'Sua senha é muito fraca. Use letras maiúsculas, minúsculas, números e símbolos.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    /**
     * Valida o campo de confirmação de senha
     */
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const formGroup = confirmPasswordInput.closest('.form-group');
        
        clearFieldState(formGroup);
        
        if (!confirmPassword) {
            showFieldError(confirmPasswordError, 'Por favor, confirme sua senha.', formGroup);
            return false;
        }
        
        if (password !== confirmPassword) {
            showFieldError(confirmPasswordError, 'As senhas não coincidem.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    /**
     * Valida os termos de serviço
     */
    function validateTerms() {
        const termsContainer = acceptTerms.closest('.checkbox-container');
        
        if (!acceptTerms.checked) {
            termsContainer.classList.add('terms-error');
            return false;
        }
        
        termsContainer.classList.remove('terms-error');
        return true;
    }

    /**
     * Calcula a força da senha
     */
    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Critérios de força
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isLongEnough = password.length >= 8;
        const isVeryLong = password.length >= 12;
        
        // Pontuação
        if (isLongEnough) score += 1;
        if (hasLowercase) score += 1;
        if (hasUppercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChars) score += 1;
        if (isVeryLong) score += 1;
        
        // Determinar texto descritivo
        let text = 'Fraca';
        if (score >= 5) {
            text = 'Muito Forte';
        } else if (score >= 4) {
            text = 'Forte';
        } else if (score >= 3) {
            text = 'Média';
        }
        
        return { 
            score: Math.min(score, 5), 
            text: text
        };
    }

    /**
     * Atualiza o display da força da senha
     */
    function updatePasswordStrengthDisplay() {
        const strength = passwordStrength;
        
        // Limpar classes anteriores
        passwordStrengthFill.className = 'strength-fill';
        
        // Definir cor e largura baseado na força
        let width = '0%';
        let colorClass = '';
        let ariaLabel = '';
        
        switch(strength.score) {
            case 0:
            case 1:
                width = '20%';
                colorClass = 'strength-weak';
                ariaLabel = 'Força da senha: Fraca';
                break;
            case 2:
                width = '40%';
                colorClass = 'strength-weak';
                ariaLabel = 'Força da senha: Fraca';
                break;
            case 3:
                width = '60%';
                colorClass = 'strength-medium';
                ariaLabel = 'Força da senha: Média';
                break;
            case 4:
                width = '80%';
                colorClass = 'strength-strong';
                ariaLabel = 'Força da senha: Forte';
                break;
            case 5:
                width = '100%';
                colorClass = 'strength-strong';
                ariaLabel = 'Força da senha: Muito Forte';
                break;
        }
        
        // Aplicar estilos
        passwordStrengthFill.style.width = width;
        passwordStrengthFill.classList.add(colorClass);
        passwordStrengthText.textContent = `Força da senha: ${strength.text}`;
        passwordStrengthText.setAttribute('aria-label', ariaLabel);
        
        // Atualizar cor do texto baseado na força
        passwordStrengthText.className = `strength-text ${colorClass}`;
    }

    /**
     * Mostrar/ocultar senha
     */
    function togglePasswordVisibility(passwordInput, toggleBtn) {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = toggleBtn.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        
        // Feedback para screen readers
        toggleBtn.setAttribute('aria-label', 
            isPassword ? 'Ocultar senha' : 'Mostrar senha');
    }

    /**
     * Manipula o envio do formulário
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (isLoading) return;
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsAccepted = validateTerms();
        
        if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsAccepted) {
            processSignup();
        } else {
            scrollToFirstError();
            showErrorToast('Por favor, corrija os erros antes de continuar.');
        }
    }

    /**
     * Processa o cadastro do usuário
     */
    function processSignup() {
        isLoading = true;
        setLoadingState(true);
        
        const signupData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            termsAccepted: true,
            signupDate: new Date().toISOString()
        };
        
        // Simular chamada à API (substituir por implementação real)
        simulateAPISignup(signupData)
            .then(handleSignupSuccess)
            .catch(handleSignupError)
            .finally(() => {
                isLoading = false;
                setLoadingState(false);
            });
    }

    /**
     * Simula cadastro via API (substituir por implementação real)
     */
    function simulateAPISignup(signupData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulação: sempre bem-sucedido para e-mails válidos
                if (isValidEmail(signupData.email)) {
                    resolve({
                        success: true,
                        user: {
                            id: 'user_' + Date.now(),
                            name: signupData.name,
                            email: signupData.email,
                            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(signupData.name)}&background=09e331&color=000&size=200`
                        },
                        token: 'simulated_jwt_token_' + Date.now(),
                        message: 'Conta criada com sucesso!'
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Erro ao criar conta. Tente novamente.'
                    });
                }
            }, 2000);
        });
    }

    /**
     * Manipula cadastro bem-sucedido
     */
    function handleSignupSuccess(response) {
        // Salvar dados do usuário (auto-login)
        saveUserData(response.user, response.token);
        
        // Registrar evento de analytics
        logSignupEvent('email', true);
        
        // Mostrar tela de sucesso
        showSuccessScreen(response.user);
    }

    /**
     * Manipula erro no cadastro
     */
    function handleSignupError(error) {
        logSignupEvent('email', false);
        showErrorToast(error.message || 'Erro ao criar conta. Tente novamente.');
    }

    /**
     * Mostra tela de sucesso após cadastro
     */
    function showSuccessScreen(user) {
        const authContainer = document.querySelector('.auth-container');
        
        authContainer.innerHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h3>Conta criada com sucesso!</h3>
                <p>Bem-vindo(a) à CBikeAI, <strong>${user.name}</strong>! 🎉</p>
                <p>Enviamos um e-mail de confirmação para <strong>${user.email}</strong>. 
                   Verifique sua caixa de entrada para ativar sua conta.</p>
                <div class="success-actions">
                    <button id="continue-btn" class="btn btn-primary">
                        <span class="btn-text">Explorar CBikeAI</span>
                        <i class="fas fa-arrow-right btn-icon"></i>
                    </button>
                    <button id="go-to-profile" class="btn btn-secondary">
                        <i class="fas fa-user"></i>
                        <span class="btn-text">Ver Meu Perfil</span>
                    </button>
                </div>
            </div>
        `;
        
        // Event listeners para os novos botões
        document.getElementById('continue-btn').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        document.getElementById('go-to-profile').addEventListener('click', () => {
            window.location.href = '../pages/perfil.html';
        });
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
            signupForm.dispatchEvent(new Event('submit'));
        }
    }

    /**
     * Utilitários de validação
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isEmailAlreadyRegistered(email) {
        // Simulação: verificar se e-mail já existe
        // Em implementação real, isso viria da API
        const registeredEmails = ['admin@cbikeai.com', 'teste@cbikeai.com'];
        return registeredEmails.includes(email.toLowerCase());
    }

    /**
     * Utilitários de interface
     */
    function setLoadingState(loading) {
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        if (loading) {
            btnText.textContent = 'Criando conta...';
            btnIcon.className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;
        } else {
            btnText.textContent = 'Criar conta';
            btnIcon.className = 'fas fa-arrow-right';
            submitBtn.disabled = false;
        }
    }

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
        
        setTimeout(() => {
            toastElement.classList.remove('show');
        }, 5000);
    }

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
     * Registra eventos de cadastro para analytics
     */
    function logSignupEvent(method, success) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', {
                'method': method,
                'success': success
            });
        }
    }

    // Inicializar o sistema
    initSignupSystem();
});

// Estilos adicionais para a tela de sucesso
const successStyles = document.createElement('style');
successStyles.textContent = `
    .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 2rem;
    }
    
    .strength-text.strength-weak {
        color: var(--error-color);
    }
    
    .strength-text.strength-medium {
        color: #ffa500;
    }
    
    .strength-text.strength-strong {
        color: var(--success-color);
    }
    
    @media (max-width: 480px) {
        .success-actions {
            flex-direction: column;
        }
        
        .success-actions .btn {
            width: 100%;
        }
    }
`;
document.head.appendChild(successStyles);