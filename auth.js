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
    
    const userIndex = users.findIndex(u =>
