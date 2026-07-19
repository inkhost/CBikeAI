// esqueci-senha.js - Sistema de recuperação de senha para CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const recoveryForm = document.getElementById('recovery-form');
    const verificationForm = document.getElementById('verification-form');
    const newPasswordForm = document.getElementById('new-password-form');
    const successMessage = document.getElementById('success-message');
    
    // Campos de entrada
    const recoveryEmailInput = document.getElementById('recovery-email');
    const verificationCodeInput = document.getElementById('verification-code');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    
    // Elementos de erro
    const recoveryEmailError = document.getElementById('recovery-email-error');
    const verificationCodeError = document.getElementById('verification-code-error');
    const newPasswordError = document.getElementById('new-password-error');
    const confirmNewPasswordError = document.getElementById('confirm-new-password-error');
    
    // Botões de toggle de senha
    const toggleNewPasswordBtn = document.getElementById('toggle-new-password');
    const toggleConfirmNewPasswordBtn = document.getElementById('toggle-confirm-new-password');
    
    // Botão de reenvio de código
    const resendCodeBtn = document.getElementById('resend-code-btn');
    
    // Elementos de timer e contador
    const countdownElement = document.getElementById('countdown');
    const timerText = document.getElementById('timer-text');
    const userEmailElement = document.getElementById('user-email');
    
    // Elementos de força da senha
    const passwordStrengthFill = document.getElementById('password-strength-fill');
    const passwordStrengthText = document.getElementById('password-strength-text');
    
    // Elementos toast
    const successToast = document.getElementById('success-toast');
    const errorToast = document.getElementById('error-toast');

    // Estado da aplicação
    let isLoading = false;
    let countdownTimer;
    let countdownTime = 300; // 5 minutos em segundos
    let userEmail = '';
    let generatedCode = '';

    /**
     * Inicializa o sistema de recuperação de senha
     */
    function initPasswordRecovery() {
        setupEventListeners();
        setupAccessibility();
        setupPasswordStrengthMeter();
    }

    /**
     * Configura todos os event listeners
     */
    function setupEventListeners() {
        // Formulário de solicitação de recuperação
        recoveryForm.addEventListener('submit', handleRecoveryRequest);
        recoveryEmailInput.addEventListener('blur', () => validateEmail(recoveryEmailInput, recoveryEmailError));
        
        // Formulário de verificação de código
        verificationForm.addEventListener('submit', handleVerificationSubmit);
        verificationCodeInput.addEventListener('input', handleCodeInput);
        verificationCodeInput.addEventListener('blur', () => validateVerificationCode());
        resendCodeBtn.addEventListener('click', handleResendCode);
        
        // Formulário de nova senha
        newPasswordForm.addEventListener('submit', handleNewPasswordSubmit);
        newPasswordInput.addEventListener('input', handlePasswordInput);
        confirmNewPasswordInput.addEventListener('blur', () => validateConfirmNewPassword());
        
        // Toggle de visibilidade de senha
        toggleNewPasswordBtn.addEventListener('click', () => togglePasswordVisibility(newPasswordInput, toggleNewPasswordBtn));
        toggleConfirmNewPasswordBtn.addEventListener('click', () => togglePasswordVisibility(confirmNewPasswordInput, toggleConfirmNewPasswordBtn));
        
        // Teclado shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    /**
     * Configura melhorias de acessibilidade
     */
    function setupAccessibility() {
        recoveryEmailInput.setAttribute('aria-describedby', 'recovery-email-error');
        verificationCodeInput.setAttribute('aria-describedby', 'verification-code-error');
        newPasswordInput.setAttribute('aria-describedby', 'new-password-error password-strength-text');
        confirmNewPasswordInput.setAttribute('aria-describedby', 'confirm-new-password-error');
    }

    /**
     * Configura o medidor de força da senha
     */
    function setupPasswordStrengthMeter() {
        updatePasswordStrengthDisplay(0, 'Fraca');
    }

    /**
     * Manipula a solicitação de recuperação de senha
     */
    function handleRecoveryRequest(e) {
        e.preventDefault();
        
        if (isLoading) return;
        
        const isEmailValid = validateEmail(recoveryEmailInput, recoveryEmailError);
        
        if (isEmailValid) {
            processRecoveryRequest();
        } else {
            scrollToFirstError();
            showErrorToast('Por favor, corrija os erros antes de continuar.');
        }
    }

    /**
     * Processa a solicitação de recuperação
     */
    function processRecoveryRequest() {
        isLoading = true;
        setLoadingState(recoveryForm, true);
        
        userEmail = recoveryEmailInput.value.trim();
        
        // Simular envio de e-mail (substituir por implementação real)
        simulateEmailSending(userEmail)
            .then(handleRecoverySuccess)
            .catch(handleRecoveryError)
            .finally(() => {
                isLoading = false;
                setLoadingState(recoveryForm, false);
            });
    }

    /**
     * Simula o envio de e-mail de recuperação
     */
    function simulateEmailSending(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Gerar código de 6 dígitos
                generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
                
                console.log(`🔐 Código de verificação para ${email}: ${generatedCode}`); // Para testes
                
                // Simulação: sempre bem-sucedido para e-mails válidos
                if (isValidEmail(email)) {
                    resolve({
                        success: true,
                        message: 'E-mail de recuperação enviado com sucesso!',
                        code: generatedCode
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Erro ao enviar e-mail de recuperação. Tente novamente.'
                    });
                }
            }, 2000);
        });
    }

    /**
     * Manipula sucesso na solicitação de recuperação
     */
    function handleRecoverySuccess(response) {
        // Mostrar formulário de verificação
        showVerificationForm();
        
        // Iniciar contador para reenvio
        startCountdown();
        
        // Registrar evento de analytics
        logRecoveryEvent('request_sent', true);
        
        showSuccessToast('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    }

    /**
     * Manipula erro na solicitação de recuperação
     */
    function handleRecoveryError(error) {
        logRecoveryEvent('request_failed', false);
        showErrorToast(error.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.');
    }

    /**
     * Mostra o formulário de verificação de código
     */
    function showVerificationForm() {
        recoveryForm.classList.add('hidden');
        verificationForm.classList.remove('hidden');
        userEmailElement.textContent = userEmail;
        
        // Focar no campo de código
        setTimeout(() => {
            verificationCodeInput.focus();
        }, 300);
    }

    /**
     * Inicia o contador para reenvio de código
     */
    function startCountdown() {
        countdownTime = 300; // Reset para 5 minutos
        updateCountdownDisplay();
        resendCodeBtn.disabled = true;
        
        clearInterval(countdownTimer);
        countdownTimer = setInterval(() => {
            countdownTime--;
            updateCountdownDisplay();
            
            if (countdownTime <= 0) {
                clearInterval(countdownTimer);
                resendCodeBtn.disabled = false;
                timerText.textContent = 'Código expirado';
            }
        }, 1000);
    }

    /**
     * Atualiza o display do contador
     */
    function updateCountdownDisplay() {
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Manipula a entrada do código de verificação
     */
    function handleCodeInput() {
        // Formatação automática: permitir apenas números e limitar a 6 dígitos
        verificationCodeInput.value = verificationCodeInput.value.replace(/\D/g, '').slice(0, 6);
        
        // Auto-submit quando completar 6 dígitos
        if (verificationCodeInput.value.length === 6) {
            validateVerificationCode();
        }
    }

    /**
     * Manipula o envio do formulário de verificação
     */
    function handleVerificationSubmit(e) {
        e.preventDefault();
        
        if (isLoading) return;
        
        const isCodeValid = validateVerificationCode();
        
        if (isCodeValid) {
            processVerification();
        } else {
            scrollToFirstError();
        }
    }

    /**
     * Processa a verificação do código
     */
    function processVerification() {
        isLoading = true;
        setLoadingState(verificationForm, true);
        
        // Simular verificação do código (substituir por implementação real)
        setTimeout(() => {
            const enteredCode = verificationCodeInput.value;
            
            if (enteredCode === generatedCode) {
                handleVerificationSuccess();
            } else {
                handleVerificationError('Código inválido. Verifique e tente novamente.');
            }
            
            isLoading = false;
            setLoadingState(verificationForm, false);
        }, 1500);
    }

    /**
     * Manipula sucesso na verificação
     */
    function handleVerificationSuccess() {
        // Mostrar formulário de nova senha
        showNewPasswordForm();
        
        // Parar o contador
        clearInterval(countdownTimer);
        
        logRecoveryEvent('code_verified', true);
        showSuccessToast('Código verificado com sucesso!');
    }

    /**
     * Manipula erro na verificação
     */
    function handleVerificationError(message) {
        logRecoveryEvent('code_invalid', false);
        showErrorToast(message);
        
        // Destacar o campo com erro
        const formGroup = verificationCodeInput.closest('.form-group');
        formGroup.classList.add('error');
    }

    /**
     * Mostra o formulário de nova senha
     */
    function showNewPasswordForm() {
        verificationForm.classList.add('hidden');
        newPasswordForm.classList.remove('hidden');
        
        // Focar no campo de nova senha
        setTimeout(() => {
            newPasswordInput.focus();
        }, 300);
    }

    /**
     * Manipula o reenvio do código
     */
    function handleResendCode() {
        if (isLoading) return;
        
        isLoading = true;
        setResendLoadingState(true);
        
        // Simular reenvio do código
        simulateEmailSending(userEmail)
            .then(() => {
                startCountdown();
                showSuccessToast('Código reenviado com sucesso!');
                logRecoveryEvent('code_resent', true);
            })
            .catch((error) => {
                showErrorToast(error.message || 'Erro ao reenviar código. Tente novamente.');
                logRecoveryEvent('code_resend_failed', false);
            })
            .finally(() => {
                isLoading = false;
                setResendLoadingState(false);
            });
    }

    /**
     * Manipula a entrada de senha (validação em tempo real)
     */
    function handlePasswordInput() {
        validateNewPassword();
        validateConfirmNewPassword(); // Revalidar confirmação quando a senha mudar
    }

    /**
     * Manipula o envio do formulário de nova senha
     */
    function handleNewPasswordSubmit(e) {
        e.preventDefault();
        
        if (isLoading) return;
        
        const isNewPasswordValid = validateNewPassword();
        const isConfirmPasswordValid = validateConfirmNewPassword();
        
        if (isNewPasswordValid && isConfirmPasswordValid) {
            processPasswordReset();
        } else {
            scrollToFirstError();
            showErrorToast('Por favor, corrija os erros antes de continuar.');
        }
    }

    /**
     * Processa a redefinição de senha
     */
    function processPasswordReset() {
        isLoading = true;
        setLoadingState(newPasswordForm, true);
        
        const newPassword = newPasswordInput.value;
        
        // Simular atualização de senha (substituir por implementação real)
        setTimeout(() => {
            // Aqui você faria a chamada real para sua API
            handlePasswordResetSuccess();
            
            isLoading = false;
            setLoadingState(newPasswordForm, false);
        }, 2000);
    }

    /**
     * Manipula sucesso na redefinição de senha
     */
    function handlePasswordResetSuccess() {
        // Mostrar mensagem de sucesso final
        showFinalSuccessMessage();
        
        logRecoveryEvent('password_reset', true);
        
        // Limpar dados temporários
        generatedCode = '';
        userEmail = '';
    }

    /**
     * Mostra a mensagem de sucesso final
     */
    function showFinalSuccessMessage() {
        newPasswordForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
    }

    /**
     * Validações
     */
    function validateEmail(input, errorElement) {
        const email = input.value.trim();
        const formGroup = input.closest('.form-group');
        
        clearFieldState(formGroup);
        
        if (!email) {
            showFieldError(errorElement, 'Por favor, informe seu e-mail.', formGroup);
            return false;
        }
        
        if (!isValidEmail(email)) {
            showFieldError(errorElement, 'Por favor, informe um e-mail válido.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    function validateVerificationCode() {
        const code = verificationCodeInput.value;
        const formGroup = verificationCodeInput.closest('.form-group');
        
        clearFieldState(formGroup);
        
        if (!code) {
            showFieldError(verificationCodeError, 'Por favor, informe o código de verificação.', formGroup);
            return false;
        }
        
        if (code.length !== 6) {
            showFieldError(verificationCodeError, 'O código deve ter 6 dígitos.', formGroup);
            return false;
        }
        
        if (!/^\d+$/.test(code)) {
            showFieldError(verificationCodeError, 'O código deve conter apenas números.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    function validateNewPassword() {
        const password = newPasswordInput.value;
        const formGroup = newPasswordInput.closest('.form-group');
        
        clearFieldState(formGroup);
        
        if (!password) {
            showFieldError(newPasswordError, 'Por favor, informe uma nova senha.', formGroup);
            updatePasswordStrengthDisplay(0, 'Fraca');
            return false;
        }
        
        // Calcular força da senha
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthDisplay(strength.score, strength.text);
        
        if (password.length < 8) {
            showFieldError(newPasswordError, 'A senha deve ter pelo menos 8 caracteres.', formGroup);
            return false;
        }
        
        if (strength.score < 3) {
            showFieldError(newPasswordError, 'Sua senha é muito fraca. Use letras maiúsculas, minúsculas, números e símbolos.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
        return true;
    }

    function validateConfirmNewPassword() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmNewPasswordInput.value;
        const formGroup = confirmNewPasswordInput.closest('.form-group');
        
        clearFieldState(formGroup);
        
        if (!confirmPassword) {
            showFieldError(confirmNewPasswordError, 'Por favor, confirme sua nova senha.', formGroup);
            return false;
        }
        
        if (password !== confirmPassword) {
            showFieldError(confirmNewPasswordError, 'As senhas não coincidem.', formGroup);
            return false;
        }
        
        showFieldSuccess(formGroup);
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
        
        return { score: Math.min(score, 5), text: text };
    }

    /**
     * Atualiza o display da força da senha
     */
    function updatePasswordStrengthDisplay(score, text) {
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
        
        passwordStrengthFill.style.width = width;
        passwordStrengthFill.className = `strength-fill ${colorClass}`;
        passwordStrengthText.textContent = `Força da senha: ${text}`;
        passwordStrengthText.className = `strength-text ${colorClass}`;
    }

    /**
     * Utilitários de interface
     */
    function togglePasswordVisibility(passwordInput, toggleBtn) {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        
        const icon = toggleBtn.querySelector('i');
        icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
        
        toggleBtn.setAttribute('aria-label', 
            isPassword ? 'Ocultar senha' : 'Mostrar senha');
    }

    function setLoadingState(form, loading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        if (loading) {
            btnText.textContent = getLoadingText(form.id);
            btnIcon.className = 'fas fa-spinner fa-spin';
            submitBtn.disabled = true;
        } else {
            btnText.textContent = getDefaultText(form.id);
            btnIcon.className = getDefaultIcon(form.id);
            submitBtn.disabled = false;
        }
    }

    function setResendLoadingState(loading) {
        if (loading) {
            resendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            resendCodeBtn.disabled = true;
        } else {
            resendCodeBtn.textContent = 'Reenviar código';
            resendCodeBtn.disabled = false;
        }
    }

    function getLoadingText(formId) {
        const texts = {
            'recovery-form': 'Enviando...',
            'verification-form': 'Verificando...',
            'new-password-form': 'Redefinindo...'
        };
        return texts[formId] || 'Processando...';
    }

    function getDefaultText(formId) {
        const texts = {
            'recovery-form': 'Enviar instruções',
            'verification-form': 'Verificar código',
            'new-password-form': 'Redefinir senha'
        };
        return texts[formId] || 'Enviar';
    }

    function getDefaultIcon(formId) {
        const icons = {
            'recovery-form': 'fas fa-paper-plane',
            'verification-form': 'fas fa-check-circle',
            'new-password-form': 'fas fa-sync-alt'
        };
        return icons[formId] || 'fas fa-arrow-right';
    }

    function showFieldError(errorElement, message, formGroup) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        formGroup.classList.add('error');
    }

    function clearFieldState(formGroup) {
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
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

    function handleKeyboardShortcuts(e) {
        // Ctrl + Enter para submit do formulário visível
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            const visibleForm = document.querySelector('.recovery-form:not(.hidden)');
            if (visibleForm) {
                visibleForm.dispatchEvent(new Event('submit'));
            }
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Registra eventos para analytics
     */
    function logRecoveryEvent(action, success) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'password_recovery', {
                'action': action,
                'success': success
            });
        }
        
        // Log para debug (remover em produção)
        console.log(`Recovery event: ${action}, Success: ${success}`);
    }

    // Inicializar o sistema
    initPasswordRecovery();
});