// auth.js - Autenticação local simplificada

(function() {
    let currentUser = null;

    function setSession(user) {
        currentUser = user || null;
        syncLegacyAuthState();
        updateNavigation();
        document.dispatchEvent(new Event('auth:updated'));
    }

    function syncLegacyAuthState() {
        if (!currentUser) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('authToken');
            localStorage.removeItem('loginMethod');
            localStorage.removeItem('cbikeai_user');
            localStorage.removeItem('cbikeai_token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userPhone');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('memberSince');
            localStorage.removeItem('authFallback');
            localStorage.removeItem('signupFallbackReason');
            return;
        }

        const displayName = currentUser.name || currentUser.email?.split('@')[0] || 'Usuário';
        const displayEmail = currentUser.email || '';
        const displayPhone = currentUser.phone || '';
        const displayAvatar = currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=09e331&color=000&size=200`;

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', displayName);
        localStorage.setItem('userEmail', displayEmail);
        localStorage.setItem('userPhone', displayPhone);
        localStorage.setItem('userAvatar', displayAvatar);
        localStorage.setItem('authToken', currentUser.token || 'local-session');
        localStorage.setItem('loginMethod', currentUser.provider || 'local');
        localStorage.setItem('memberSince', currentUser.memberSince || new Date().toLocaleDateString('pt-BR'));

        localStorage.setItem('cbikeai_user', JSON.stringify({
            id: currentUser.id || Date.now().toString(),
            name: displayName,
            email: displayEmail,
            avatar: displayAvatar,
            phone: displayPhone
        }));
        localStorage.setItem('cbikeai_token', currentUser.token || 'local-session');
    }

    function updateNavigation() {
        const loginLink = document.getElementById('login-link');
        const profileLink = document.getElementById('profile-link');
        const logoutBtn = document.getElementById('logout-btn');
        const logoutHeader = document.getElementById('logout-header');

        const isLoggedIn = Boolean(currentUser);

        if (loginLink) {
            loginLink.style.display = isLoggedIn ? 'none' : 'inline';
        }
        if (profileLink) {
            profileLink.style.display = isLoggedIn ? 'inline' : 'none';
        }
        if (logoutBtn) {
            logoutBtn.style.display = isLoggedIn ? 'inline' : 'none';
        }
        if (logoutHeader) {
            logoutHeader.style.display = isLoggedIn ? 'inline' : 'none';
        }
    }

    function hydrateAuth() {
        const savedUser = localStorage.getItem('cbikeai_user');
        if (!savedUser) {
            setSession(null);
            return;
        }

        try {
            const parsedUser = JSON.parse(savedUser);
            setSession({
                id: parsedUser.id,
                name: parsedUser.name,
                email: parsedUser.email,
                phone: parsedUser.phone || '',
                avatar: parsedUser.avatar || '',
                token: localStorage.getItem('cbikeai_token') || 'local-session',
                memberSince: localStorage.getItem('memberSince') || new Date().toLocaleDateString('pt-BR')
            });
        } catch (error) {
            console.warn('Erro ao restaurar sessão local:', error);
            setSession(null);
        }
    }

    async function signIn(email, password) {
        const storedUsers = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
        const user = storedUsers.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);

        if (!user) {
            throw new Error('E-mail ou senha inválidos.');
        }

        const sessionUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            avatar: user.avatar || '',
            token: `local-${Date.now()}`,
            memberSince: user.memberSince || new Date().toLocaleDateString('pt-BR')
        };

        setSession(sessionUser);
        return { user: sessionUser, session: sessionUser };
    }

    async function signUp({ name, email, phone, password }) {
        const storedUsers = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
        const exists = storedUsers.some((item) => item.email.toLowerCase() === email.toLowerCase());

        if (exists) {
            throw new Error('Este e-mail já está cadastrado.');
        }

        const newUser = {
            id: `local-${Date.now()}`,
            name,
            email,
            phone,
            password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=09e331&color=000&size=200`,
            memberSince: new Date().toLocaleDateString('pt-BR')
        };

        storedUsers.push(newUser);
        localStorage.setItem('cbikeai_users', JSON.stringify(storedUsers));

        const sessionUser = {
            ...newUser,
            token: `local-${Date.now()}`
        };

        setSession(sessionUser);
        return { user: sessionUser, session: sessionUser };
    }

    async function signInWithGoogle(profile) {
        const normalizedProfile = {
            id: profile?.id || `google-${Date.now()}`,
            name: profile?.name || profile?.full_name || profile?.email?.split('@')[0] || 'Usuário Google',
            email: profile?.email || '',
            phone: profile?.phone || '',
            avatar: profile?.avatar || profile?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || profile?.email || 'Usuário Google')}&background=09e331&color=000&size=200`,
            token: `google-${Date.now()}`,
            provider: 'google',
            memberSince: new Date().toLocaleDateString('pt-BR')
        };

        const storedUsers = JSON.parse(localStorage.getItem('cbikeai_users') || '[]');
        const existingUser = storedUsers.find((item) => item.email.toLowerCase() === normalizedProfile.email.toLowerCase());

        if (!existingUser) {
            storedUsers.push({
                ...normalizedProfile,
                password: null
            });
            localStorage.setItem('cbikeai_users', JSON.stringify(storedUsers));
        }

        setSession(normalizedProfile);
        return { user: normalizedProfile, session: normalizedProfile };
    }

    async function signUpWithGoogle(profile) {
        return signInWithGoogle(profile);
    }

    async function signOut() {
        setSession(null);
    }

    function getCurrentUser() {
        return currentUser;
    }

    function isAuthenticated() {
        return Boolean(currentUser);
    }

    function getSession() {
        return currentUser;
    }

    document.addEventListener('DOMContentLoaded', () => {
        hydrateAuth();
    });

    window.CBikeAuth = {
        init: hydrateAuth,
        signIn,
        signUp,
        signInWithGoogle,
        signUpWithGoogle,
        signOut,
        getCurrentUser,
        isAuthenticated,
        updateNavigation,
        getSession
    };
})();