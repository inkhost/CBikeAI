/* ============================================================= */
/*  auth.js – Validação de formulário de cadastro */
/* ============================================================= */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signup-form');
    const nameInput = document.getElementById('signup-name');
    const nameError = document.getElementById('signup-name-error');
    const emailInput = document.getElementById('signup-email');
    const emailError = document.getElementById('signup-email-error');
    const passwordInput = document.getElementById('signup-password');
    const passwordError = document.getElementById('signup-password-error');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const confirmPasswordError = document.getElementById('signup-confirm-password-error');
    const passwordStrengthFill = document.getElementById('password-strength-fill');
    const passwordStrengthText = document.getElementById('password-strength-text');
    const googleSignupBtn = document.getElementById('google-signup');
    const appleSignupBtn = document.getElementById('apple-signup');
    const microsoftSignupBtn = document.getElementById('microsoft-signup');
    const acceptTerms = document.getElementById('accept-terms');
    
    // Elementos do toggle de senha
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');

    /* ---------- TOGGLE DE VISUALIZAÇÃO DE SENHA ---------- */
    function setupPasswordToggle(toggleElement, passwordInput) {
        toggleElement.addEventListener('click', function() {
            // Alterna entre tipo password e text
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Alterna a classe active no botão
            this.classList.toggle('active');
            
            // Alterna o ícone do olho
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Configura os toggles de senha
    if (togglePassword && passwordInput) {
        setupPasswordToggle(togglePassword, passwordInput);
    }
    
    if (toggleConfirmPassword && confirmPasswordInput) {
        setupPasswordToggle(toggleConfirmPassword, confirmPasswordInput);
    }

    /* ---------- VALIDAÇÃO DE NOME ---------- */
    function validateName() {
        const value = nameInput.value.trim();
        nameError.textContent = '';

        if (!value) {
            showError(nameError, 'O nome é obrigatório.');
            return false;
        }
        if (value.length < 2) {
            showError(nameError, 'O nome deve ter pelo menos 2 caracteres.');
            return false;
        }
        return true;
    }

    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('blur', validateName);

    /* ---------- VALIDAÇÃO DE E-MAIL ---------- */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateEmail() {
        const value = emailInput.value.trim();
        emailError.textContent = '';

        if (!value) {
            showError(emailError, 'O e-mail é obrigatório.');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(emailError, 'Digite um e-mail válido (ex: usuario@dominio.com).');
            return false;
        }
        return true;
    }

    function showError(el, msg) {
        el.textContent = msg;
        el.style.display = 'block';
    }

    emailInput.addEventListener('input', validateEmail);
    emailInput.addEventListener('blur', validateEmail);

    /* ---------- VALIDAÇÃO DE SENHA ---------- */
    function validatePassword() {
        const value = passwordInput.value;
        let strength = 0;
        let text = '';

        // Critérios de força
        if (value.length >= 8) strength += 25;
        if (/[A-Z]/.test(value)) strength += 25;
        if (/[a-z]/.test(value)) strength += 25;
        if (/[0-9]/.test(value)) strength += 15;
        if (/[^A-Za-z0-9]/.test(value)) strength += 10;

        // Atualizar barra de força
        passwordStrengthFill.className = 'strength-fill';
        
        if (strength <= 25) {
            passwordStrengthFill.classList.add('strength-weak');
            text = 'Senha fraca';
        } else if (strength <= 50) {
            passwordStrengthFill.classList.add('strength-fair');
            text = 'Senha razoável';
        } else if (strength <= 75) {
            passwordStrengthFill.classList.add('strength-good');
            text = 'Senha boa';
        } else {
            passwordStrengthFill.classList.add('strength-strong');
            text = 'Senha forte!';
        }
        
        passwordStrengthText.textContent = text;
    }

    passwordInput.addEventListener('input', validatePassword);
    passwordInput.addEventListener('focus', validatePassword);

    /* ---------- VALIDAÇÃO DE CONFIRMAÇÃO DE SENHA ---------- */
    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        confirmPasswordError.textContent = '';

        if (!confirmPassword) {
            showError(confirmPasswordError, 'Por favor, confirme sua senha.');
            return false;
        }
        if (password !== confirmPassword) {
            showError(confirmPasswordError, 'As senhas não coincidem.');
            return false;
        }
        return true;
    }

    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

    /* ---------- CADASTRO NORMAL ---------- */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameOk = validateName();
            const emailOk = validateEmail();
            const passwordOk = passwordInput.value.length >= 8;
            const confirmPasswordOk = validateConfirmPassword();
            const termsOk = acceptTerms.checked;

            passwordError.textContent = '';
            passwordError.style.display = 'none';

            if (!nameOk) {
                nameInput.focus();
                return;
            }

            if (!emailOk) {
                emailInput.focus();
                return;
            }

            if (!passwordOk) {
                passwordError.textContent = 'A senha deve ter pelo menos 8 caracteres.';
                passwordError.style.display = 'block';
                passwordInput.focus();
                return;
            }

            if (!confirmPasswordOk) {
                confirmPasswordInput.focus();
                return;
            }

            if (!termsOk) {
                alert('Você deve aceitar os Termos de Serviço e Política de Privacidade');
                acceptTerms.focus();
                return;
            }

            // Simula cadastro bem-sucedido
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', emailInput.value);
            localStorage.setItem('userName', nameInput.value);

            console.log('Cadastro normal bem-sucedido!');
            alert('Conta criada com sucesso! Redirecionando...');
            
            // Em um cenário real, aqui você faria uma requisição para o backend
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1000);
        });
    }

    /* ---------- CADASTRO COM GOOGLE ---------- */
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidade de cadastro com Google será implementada em breve!');
            // Implementação real viria aqui
        });
    }

    /* ---------- CADASTRO COM APPLE ---------- */
    if (appleSignupBtn) {
        appleSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidade de cadastro com Apple será implementada em breve!');
            // Implementação real viria aqui
        });
    }

    /* ---------- CADASTRO COM MICROSOFT ---------- */
    if (microsoftSignupBtn) {
        microsoftSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Funcionalidade de cadastro com Microsoft será implementada em breve!');
            // Implementação real viria aqui
        });
    }
});
