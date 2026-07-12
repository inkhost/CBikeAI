// criar-conta.js - Sistema de criação de conta para CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // ===== ELEMENTOS DO DOM =====
    const signupForm = document.getElementById('signup-form');
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const phoneInput = document.getElementById('signup-phone');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const acceptTerms = document.getElementById('accept-terms');
    
    // Elementos de erro
    const nameError = document.getElementById('signup-name-error');
    const emailError = document.getElementById('signup-email-error');
    const phoneError = document.getElementById('signup-phone-error');
    const passwordError = document.getElementById('signup-password-error');
    const confirmPasswordError = document.getElementById('signup-confirm-password-error');
    const termsError = document.getElementById('terms-error');
    
    // Elementos de força da senha
    const passwordStrengthFill = document.getElementById('password-strength-fill');
    const passwordStrengthText = document.getElementById('password-strength-text');
    const passwordCriteria = document.getElementById('password-criteria');
    
    // Botões de mostrar/ocultar senha
    const toggleSignupPasswordBtn = document.getElementById('toggle-signup-password');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
    
    // Botões sociais
    const googleSignupBtn = document.getElementById('google-signup');
    const stravaSignupBtn = document.getElementById('strava-signup');
    
    // Elementos de feedback
    const successToast = document.getElementById('success-toast');
    const errorToast = document.getElementById('error-toast');

    // ===== ESTADO =====
    let isLoading = false;
    let passwordStrength = { score: 0, text: 'Fraca' };
    let isPhoneValid = false;

    // ===== MÁSCARA DE TELEFONE CORRIGIDA =====
    function maskPhone(value) {
        // Remove tudo que não é número
        let digits = value.replace(/\D/g, '');
        
        // Limita a 11 dígitos (DDD + 9 + 8 dígitos)
        if (digits.length > 11) {
            digits = digits.slice(0, 11);
        }
        
        // Aplica a máscara progressivamente
        let masked = '';
        
        if (digits.length === 0) {
            masked = '';
        } else if (digits.length <= 2) {
            masked = '(' + digits;
        } else if (digits.length <= 6) {
            masked = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
        } else if (digits.length <= 10) {
            masked = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6);
        } else {
            masked = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7, 11);
        }
        
        return masked;
    }

    // ===== APLICAR MÁSCARA CORRIGIDA =====
    phoneInput.addEventListener('input', function(e) {
        // Salva a posição atual do cursor
        const cursorPos = this.selectionStart;
        
        // Pega o valor atual sem máscara
        const rawValue = this.value.replace(/\D/g, '');
        
        // Aplica a máscara
        const masked = maskPhone(rawValue);
        
        // Se o valor mudou, atualiza
        if (this.value !== masked) {
            this.value = masked;
            
            // Calcula a nova posição do cursor
            let newCursorPos = cursorPos;
            
            // Ajusta a posição baseado nos caracteres adicionados
            const rawLength = rawValue.length;
            const maskedLength = masked.length;
            
            // Se adicionou um caractere de formatação (parêntese, espaço ou traço)
            if (maskedLength > rawLength) {
                // Verifica quantos caracteres de formatação foram adicionados
                const diff = maskedLength - rawLength;
                newCursorPos = cursorPos + diff;
            }
            
            // Se removeu um caractere (backspace)
            if (maskedLength < rawLength) {
                newCursorPos = cursorPos - 1;
            }
            
            // Garante que o cursor não ultrapasse os limites
            newCursorPos = Math.max(0, Math.min(newCursorPos, masked.length));
            
            // Aplica a nova posição do cursor
            this.setSelectionRange(newCursorPos, newCursorPos);
        }
    });

    // ===== INICIALIZAÇÃO =====
    function initSignupSystem() {
        setupEventListeners();
        setupAccessibility();
        setupPasswordStrengthMeter();
        setupSocialButtons();
    }

    // ===== EVENT LISTENERS =====
    function setupEventListeners() {
        // Validação em tempo real
        nameInput.addEventListener('blur', () => validateName());
        emailInput.addEventListener('blur', () => validateEmail());
        phoneInput.addEventListener('blur', () => validatePhone());
        phoneInput.addEventListener('input', () => {
            // Validação em tempo real enquanto digita
            const formGroup = phoneInput.closest('.form-group');
            const phone = phoneInput.value.trim();
            const digits = phone.replace(/\D/g, '');
            
            if (digits.length >= 10) {
                validatePhone();
            } else {
                clearFieldState(formGroup);
            }
        });
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

    // ===== ACESSIBILIDADE =====
    function setupAccessibility() {
        nameInput.setAttribute('aria-describedby', 'signup-name-error');
        emailInput.setAttribute('aria-describedby', 'signup-email-error');
        phoneInput.setAttribute('aria-describedby', 'signup-phone-error');
        passwordInput.setAttribute('aria-describedby', 'signup-password-error password-strength-text');
        confirmPasswordInput.setAttribute('aria-describedby', 'signup-confirm-password-error');
        
        passwordStrengthText.id = 'password-strength-text';
        passwordStrengthText.setAttribute('aria-live', 'polite');
        passwordStrengthText.setAttribute('aria-atomic', 'true');
    }

    // ===== BOTÕES SOCIAIS =====
    function setupSocialButtons() {
        googleSignupBtn.addEventListener('click', function() {
            showErrorToast('Cadastro com Google em breve!');
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_signup', { method: 'google' });
            }
        });
        
        stravaSignupBtn.addEventListener('click', function() {
            showErrorToast('Cadastro com Strava em breve!');
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_signup', { method: 'strava' });
            }
        });
    }

    // ===== VALIDAÇÕES =====
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
        if (isEmailAlreadyRegistered(email)) {
            showFieldError(emailError, 'Este e-mail já está cadastrado. Tente fazer login.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        const formGroup = phoneInput.closest('.form-group');
        clearFieldState(formGroup);
        
        if (!phone) {
            showFieldError(phoneError, 'Por favor, informe seu WhatsApp.', formGroup);
            return false;
        }
        
        // Remove máscara e verifica se tem 10 ou 11 dígitos
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 11) {
            showFieldError(phoneError, 'Por favor, informe um telefone válido com DDD.', formGroup);
            return false;
        }
        
        // Verifica DDD (primeiros 2 dígitos) - de 11 a 99
        const ddd = digits.slice(0, 2);
        if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
            showFieldError(phoneError, 'DDD inválido. Informe um DDD válido (11 a 99).', formGroup);
            return false;
        }
        
        // Verifica se começa com 9 (celular) e tem 11 dígitos, ou fixo com 10
        if (digits.length === 11 && digits.charAt(2) !== '9') {
            showFieldError(phoneError, 'Número de celular deve começar com 9.', formGroup);
            return false;
        }
        
        isPhoneValid = true;
        showFieldSuccess(formGroup);
        return true;
    }

    function handlePasswordInput() {
        validatePassword();
        validateConfirmPassword();
    }

    function validatePassword() {
        const password = passwordInput.value;
        const formGroup = passwordInput.closest('.form-group');
        clearFieldState(formGroup);
        
        if (!password) {
            showFieldError(passwordError, 'Por favor, informe uma senha.', formGroup);
            updatePasswordStrength(0, 'Fraca');
            return false;
        }
        
        const strength = calculatePasswordStrength(password);
        passwordStrength = strength;
        updatePasswordStrengthDisplay();
        updatePasswordCriteria(password);
        
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

    function validateTerms() {
        const termsContainer = acceptTerms.closest('.checkbox-container');
        
        if (!acceptTerms.checked) {
            termsContainer.classList.add('terms-error');
            showFieldError(termsError, 'Você precisa concordar com os Termos de Serviço.', null);
            return false;
        }
        
        termsContainer.classList.remove('terms-error');
        termsError.style.display = 'none';
        return true;
    }

    // ===== CRITÉRIOS DA SENHA =====
    function updatePasswordCriteria(password) {
        const criteria = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        
        const items = passwordCriteria.querySelectorAll('.criteria-item');
        items.forEach(item => {
            const rule = item.dataset.rule;
            const isValid = criteria[rule];
            item.classList.toggle('valid', isValid);
            item.classList.toggle('invalid', !isValid && password.length > 0);
            
            const icon = item.querySelector('i');
            if (isValid) {
                icon.className = 'fas fa-check-circle';
            } else if (password.length > 0) {
                icon.className = 'fas fa-times-circle';
            } else {
                icon.className = 'fas fa-circle';
            }
        });
    }

    // ===== FORÇA DA SENHA =====
    function calculatePasswordStrength(password) {
        let score = 0;
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isLongEnough = password.length >= 8;
        const isVeryLong = password.length >= 12;
        
        if (isLongEnough) score += 1;
        if (hasLowercase) score += 1;
        if (hasUppercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSpecialChars) score += 1;
        if (isVeryLong) score += 1;
        
        let text = 'Fraca';
        if (score >= 5) text = 'Muito Forte';
        else if (score >= 4) text = 'Forte';
        else if (score >= 3) text = 'Média';
        
        return { score: Math.min(score, 5), text: text };
    }

    function updatePasswordStrengthDisplay() {
        const strength = passwordStrength;
        
        passwordStrengthFill.className = 'strength-fill';
        
        let width = '0%';
        let colorClass = '';
        
        switch(strength.score) {
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
        
        passwordStrengthFill.style.width = width;
        passwordStrengthFill.classList.add(colorClass);
        passwordStrengthText.textContent = `Força da senha: ${strength.text}`;
        passwordStrengthText.className = `strength-text ${colorClass}`;
    }

    // ===== MOSTRAR/OCULTAR SENHA =====
    function togglePasswordVisibility(input, toggleBtn) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        
        const icon = toggleBtn.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        toggleBtn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
    }

    // ===== SUBMIT =====
    function handleFormSubmit(e) {
        e.preventDefault();
        if (isLoading) return;
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsAccepted = validateTerms();
        
        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid && isTermsAccepted) {
            processSignup();
        } else {
            scrollToFirstError();
            showErrorToast('Por favor, corrija os erros antes de continuar.');
        }
    }

    // ===== PROCESSAR CADASTRO =====
    function processSignup() {
        isLoading = true;
        setLoadingState(true);
        
        const signupData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            password: passwordInput.value,
            termsAccepted: true,
            signupDate: new Date().toISOString()
        };
        
        // Simulação de cadastro (substituir pelo Supabase depois)
        simulateSignup(signupData)
            .then(handleSignupSuccess)
            .catch(handleSignupError)
            .finally(() => {
                isLoading = false;
                setLoadingState(false);
            });
    }

    // ===== SIMULAÇÃO DE CADASTRO =====
    function simulateSignup(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulação: sempre bem-sucedido
                resolve({
                    success: true,
                    user: {
                        id: 'user_' + Date.now(),
                        email: data.email,
                        user_metadata: {
                            full_name: data.name,
                            phone: data.phone
                        }
                    },
                    session: {
                        access_token: 'simulated_token_' + Date.now()
                    }
                });
            }, 1500);
        });
    }

    // ===== SUCESSO =====
    function handleSignupSuccess(response) {
        const user = response?.user;
        saveUserData({
            name: user?.user_metadata?.full_name || nameInput.value.trim(),
            email: user?.email || emailInput.value.trim(),
            phone: user?.user_metadata?.phone || phoneInput.value.trim(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nameInput.value.trim())}&background=09e331&color=000&size=200`
        }, response?.session?.access_token || '');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', { method: 'email', success: true });
        }
        
        showSuccessScreen({
            name: nameInput.value.trim(),
            email: emailInput.value.trim()
        });
    }

    // ===== ERRO =====
    function handleSignupError(error) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'sign_up', { method: 'email', success: false });
        }
        showErrorToast(error.message || 'Erro ao criar conta. Tente novamente.');
    }

    // ===== TELA DE SUCESSO =====
    function showSuccessScreen(user) {
        const authContainer = document.querySelector('.auth-container');
        
        authContainer.innerHTML = `
            <div class="success-screen">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h3>Conta criada com sucesso!</h3>
                <p>Bem-vindo(a) à CBikeAI, <strong>${user.name}</strong>! 🎉</p>
                <p>Enviamos um e-mail de confirmação para <strong>${user.email}</strong>.</p>
                <p>Verifique sua caixa de entrada e <strong>ative sua conta</strong>.</p>
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
        
        document.getElementById('continue-btn').addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        
        document.getElementById('go-to-profile').addEventListener('click', () => {
            window.location.href = '../pages/perfil.html';
        });
    }

    // ===== SALVAR DADOS =====
    function saveUserData(user, token) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPhone', user.phone);
        localStorage.setItem('userAvatar', user.avatar);
        localStorage.setItem('authToken', token);
        localStorage.setItem('loginMethod', 'email');
        localStorage.setItem('memberSince', new Date().toLocaleDateString('pt-BR'));
    }

    // ===== UTILITÁRIOS =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isEmailAlreadyRegistered(email) {
        const registeredEmails = ['admin@cbikeai.com', 'teste@cbikeai.com'];
        return registeredEmails.includes(email.toLowerCase());
    }

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
        
        setTimeout(() => {
            toastElement.classList.remove('show');
        }, 5000);
    }

    function scrollToFirstError() {
        const firstError = document.querySelector('.error-message[style*="display: block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            signupForm.dispatchEvent(new Event('submit'));
        }
    }

    // ===== INICIALIZAR =====
    initSignupSystem();
});