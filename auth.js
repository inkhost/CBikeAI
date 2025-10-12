// auth.js - Sistema de autenticação para CBikeAI

// Verificar se o usuário está logado
function checkAuth() {
    const user = localStorage.getItem('cbikeai_user');
    const token = localStorage.getItem('cbikeai_token');
    
    if (user && token) {
        return JSON.parse(user);
    }
    return null;
}

// Fazer login
function login(email, password, rememberMe = false) {
    // Simulação de autenticação - em um sistema real, isso seria uma chamada API
    const users = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const token = generateToken();
        localStorage.setItem('cbikeai_token', token);
        localStorage.setItem('cbikeai_user', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('cbikeai_remember', 'true');
        }
        
        // Registrar evento no Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'login', {
                'method': 'email'
            });
        }
        
        return { success: true, user };
    } else {
        return { success: false, message: 'E-mail ou senha incorretos' };
    }
}

// Cadastrar novo usuário
function signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
    
    // Verificar se o usuário já existe
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Este e-mail já está cadastrado' };
    }
    
    // Criar novo usuário
    const newUser = {
        id: generateId(),
        name,
        email,
        password, // Em um sistema real, a senha seria criptografada
        createdAt: new Date().toISOString(),
        preferences: {
            theme: 'auto',
            language: 'pt-BR',
            notifications: 'all'
        }
    };
    
    users.push(newUser);
    localStorage.setItem('cbikeai_users', JSON.stringify(users));
    
    // Registrar evento no Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'sign_up', {
            'method': 'email'
        });
    }
    
    return { success: true, user: newUser };
}

// Login com Google (simulação)
function loginWithGoogle() {
    // Em um sistema real, isso integraria com a API do Google OAuth
    const mockUser = {
        id: generateId(),
        name: 'Usuário Google',
        email: 'usuario.google@exemplo.com',
        provider: 'google',
        createdAt: new Date().toISOString()
    };
    
    const token = generateToken();
    localStorage.setItem('cbikeai_token', token);
    localStorage.setItem('cbikeai_user', JSON.stringify(mockUser));
    
    // Registrar evento no Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'login', {
            'method': 'google'
        });
    }
    
    return { success: true, user: mockUser };
}

// Recuperar senha
function resetPassword(email) {
    // Em um sistema real, isso enviaria um e-mail com link de redefinição
    const users = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (user) {
        // Simular envio de e-mail
        setTimeout(() => {
            alert(`Um link de redefinição de senha foi enviado para ${email}`);
        }, 1000);
        
        return { success: true };
    } else {
        return { success: false, message: 'E-mail não encontrado' };
    }
}

// Fazer logout
function logout() {
    localStorage.removeItem('cbikeai_token');
    localStorage.removeItem('cbikeai_user');
    window.location.href = 'index.html';
}

// Atualizar perfil do usuário
function updateProfile(userData) {
    const users = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('cbikeai_user'));
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('cbikeai_users', JSON.stringify(users));
        localStorage.setItem('cbikeai_user', JSON.stringify(users[userIndex]));
        
        return { success: true, user: users[userIndex] };
    }
    
    return { success: false, message: 'Erro ao atualizar perfil' };
}

// Alterar senha
function changePassword(currentPassword, newPassword) {
    const currentUser = JSON.parse(localStorage.getItem('cbikeai_user'));
    const users = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        if (users[userIndex].password !== currentPassword) {
            return { success: false, message: 'Senha atual incorreta' };
        }
        
        users[userIndex].password = newPassword;
        localStorage.setItem('cbikeai_users', JSON.stringify(users));
        localStorage.setItem('cbikeai_user', JSON.stringify(users[userIndex]));
        
        return { success: true };
    }
    
    return { success: false, message: 'Erro ao alterar senha' };
}

// Funções utilitárias
function generateToken() {
    return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function generateId() {
    return 'user_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // Pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

function getPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = checkAuth();
    
    // Página de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validação
            if (!validateEmail(email)) {
                showError('login-email-error', 'Por favor, insira um e-mail válido');
                return;
            }
            
            if (!password) {
                showError('login-password-error', 'Por favor, insira sua senha');
                return;
            }
            
            // Tentar fazer login
            const result = login(email, password, rememberMe);
            
            if (result.success) {
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 1500);
            } else {
                showError('login-password-error', result.message);
            }
        });
    }
    
    // Login com Google
    const googleLoginBtn = document.getElementById('google-login');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            const result = loginWithGoogle();
            if (result.success) {
                showMessage('Login com Google realizado! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 1500);
            }
        });
    }
    
    // Página de cadastro
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        const passwordInput = document.getElementById('signup-password');
        const strengthFill = document.getElementById('password-strength-fill');
        const strengthText = document.getElementById('password-strength-text');
        
        // Verificar força da senha em tempo real
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = getPasswordStrength(password);
            
            let strengthPercent = 0;
            let strengthLabel = '';
            let color = '';
            
            switch(strength) {
                case 0:
                case 1:
                    strengthPercent = 20;
                    strengthLabel = 'Muito fraca';
                    color = '#ff4d4d';
                    break;
                case 2:
                    strengthPercent = 40;
                    strengthLabel = 'Fraca';
                    color = '#ffa64d';
                    break;
                case 3:
                    strengthPercent = 60;
                    strengthLabel = 'Média';
                    color = '#ffcc00';
                    break;
                case 4:
                    strengthPercent = 80;
                    strengthLabel = 'Forte';
                    color = '#66cc66';
                    break;
                case 5:
                    strengthPercent = 100;
                    strengthLabel = 'Muito forte';
                    color = '#09e331';
                    break;
            }
            
            strengthFill.style.width = strengthPercent + '%';
            strengthFill.style.backgroundColor = color;
            strengthText.textContent = strengthLabel;
            strengthText.style.color = color;
        });
        
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const acceptTerms = document.getElementById('accept-terms').checked;
            
            // Validações
            if (!name) {
                showError('signup-name-error', 'Por favor, insira seu nome completo');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('signup-email-error', 'Por favor, insira um e-mail válido');
                return;
            }
            
            if (!validatePassword(password)) {
                showError('signup-password-error', 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('signup-confirm-password-error', 'As senhas não coincidem');
                return;
            }
            
            if (!acceptTerms) {
                alert('Você deve aceitar os Termos de Serviço e Política de Privacidade');
                return;
            }
            
            // Tentar cadastrar
            const result = signup(name, email, password);
            
            if (result.success) {
                // Fazer login automaticamente após o cadastro
                login(email, password);
                showMessage('Conta criada com sucesso! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 1500);
            } else {
                showError('signup-email-error', result.message);
            }
        });
    }
    
    // Cadastro com Google
    const googleSignupBtn = document.getElementById('google-signup');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            const result = loginWithGoogle();
            if (result.success) {
                showMessage('Cadastro com Google realizado! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 1500);
            }
        });
    }
    
    // Página de recuperação de senha
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('reset-email').value;
            
            if (!validateEmail(email)) {
                showError('reset-email-error', 'Por favor, insira um e-mail válido');
                return;
            }
            
            const result = resetPassword(email);
            
            if (result.success) {
                showMessage('Um link de redefinição foi enviado para seu e-mail!', 'success');
            } else {
                showError('reset-email-error', result.message);
            }
        });
    }
    
    // Página de perfil - navegação por abas
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remover classe active de todos os botões e conteúdos
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado e conteúdo correspondente
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Página de perfil - atualizar dados
    const profileForm = document.getElementById('profile-form');
    if (profileForm && currentUser) {
        // Preencher formulário com dados do usuário
        document.getElementById('profile-name').value = currentUser.name || '';
        document.getElementById('profile-email').value = currentUser.email || '';
        document.getElementById('profile-phone').value = currentUser.phone || '';
        document.getElementById('profile-birthdate').value = currentUser.birthdate || '';
        
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('profile-name').value,
                email: document.getElementById('profile-email').value,
                phone: document.getElementById('profile-phone').value,
                birthdate: document.getElementById('profile-birthdate').value
            };
            
            const result = updateProfile(userData);
            
            if (result.success) {
                showMessage('Perfil atualizado com sucesso!', 'success');
                // Atualizar informações exibidas
                document.getElementById('user-name').textContent = userData.name;
                document.getElementById('user-email').textContent = userData.email;
            } else {
                showMessage('Erro ao atualizar perfil: ' + result.message, 'error');
            }
        });
    }
    
    // Página de perfil - alterar senha
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;
            
            if (!currentPassword) {
                alert('Por favor, insira sua senha atual');
                return;
            }
            
            if (!validatePassword(newPassword)) {
                alert('A nova senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número');
                return;
            }
            
            if (newPassword !== confirmNewPassword) {
                alert('As novas senhas não coincidem');
                return;
            }
            
            const result = changePassword(currentPassword, newPassword);
            
            if (result.success) {
                showMessage('Senha alterada com sucesso!', 'success');
                securityForm.reset();
            } else {
                alert(result.message);
            }
        });
    }
    
    // Botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Funções auxiliares de UI
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
    
    function showMessage(message, type = 'info') {
        // Criar elemento de mensagem se não existir
        let messageEl = document.getElementById('global-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'global-message';
            messageEl.style.position = 'fixed';
            messageEl.style.top = '20px';
            messageEl.style.right = '20px';
            messageEl.style.padding = '15px 20px';
            messageEl.style.borderRadius = '8px';
            messageEl.style.zIndex = '10000';
            messageEl.style.maxWidth = '300px';
            messageEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            document.body.appendChild(messageEl);
        }
        
        // Configurar estilo baseado no tipo
        if (type === 'success') {
            messageEl.style.backgroundColor = 'var(--success-color)';
            messageEl.style.color = 'var(--background)';
        } else if (type === 'error') {
            messageEl.style.backgroundColor = 'var(--error-color)';
            messageEl.style.color = 'var(--text-color)';
        } else {
            messageEl.style.backgroundColor = 'var(--input-bg)';
            messageEl.style.color = 'var(--text-color)';
            messageEl.style.border = '1px solid var(--input-border)';
        }
        
        messageEl.textContent = message;
        messageEl.style.display = 'block';
        
        // Auto-ocultar após 5 segundos
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
});
