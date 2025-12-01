// perfil.js - Gerenciamento da página de perfil do usuário CBikeAI

document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais da página
    const profileContent = document.getElementById('profile-content');
    
    // Estado do usuário
    let isLoggedIn = false;
    let userData = null;

    // Inicialização da página
    initProfilePage();

    /**
     * Inicializa a página de perfil verificando o estado de login
     * e carregando os dados do usuário
     */
    function initProfilePage() {
        checkLoginStatus();
        loadUserData();
        renderProfileContent();
        setupEventListeners();
    }

    /**
     * Verifica se o usuário está logado através do localStorage
     */
    function checkLoginStatus() {
        isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        // Se não estiver logado, redireciona para login após 3 segundos
        if (!isLoggedIn) {
            setTimeout(() => {
                if (!isLoggedIn) {
                    window.location.href = '../pages/login.html';
                }
            }, 3000);
        }
    }

    /**
     * Carrega os dados do usuário do localStorage
     */
    function loadUserData() {
        if (isLoggedIn) {
            userData = {
                name: localStorage.getItem('userName') || 'Usuário',
                email: localStorage.getItem('userEmail') || 'email@exemplo.com',
                avatar: localStorage.getItem('userAvatar') || getDefaultAvatar(),
                memberSince: localStorage.getItem('memberSince') || getCurrentDate(),
                loginMethod: detectLoginMethod(),
                preferences: getUserPreferences()
            };
        }
    }

    /**
     * Detecta o método de login baseado no e-mail ou dados salvos
     */
    function detectLoginMethod() {
        const email = userData.email;
        if (email.includes('@google')) return 'Google';
        if (email.includes('@facebook')) return 'Facebook';
        if (email.includes('@apple')) return 'Apple';
        return localStorage.getItem('loginMethod') || 'E-mail';
    }

    /**
     * Obtém as preferências do usuário do localStorage
     */
    function getUserPreferences() {
        return {
            bikeType: localStorage.getItem('bikeType') || 'Urbana',
            experienceLevel: localStorage.getItem('experienceLevel') || 'Intermediário',
            preferredDistance: localStorage.getItem('preferredDistance') || '10-20 km',
            notifications: localStorage.getItem('notifications') || 'Ativas'
        };
    }

    /**
     * Gera um avatar padrão baseado no nome do usuário
     */
    function getDefaultAvatar() {
        const name = userData?.name || 'Usuário';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=09e331&color=000&size=200`;
    }

    /**
     * Obtém a data atual formatada
     */
    function getCurrentDate() {
        const now = new Date();
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return `${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    /**
     * Renderiza o conteúdo do perfil baseado no estado de login
     */
    function renderProfileContent() {
        if (!isLoggedIn) {
            renderNotLoggedIn();
        } else {
            renderUserProfile();
        }
    }

    /**
     * Renderiza a interface quando o usuário não está logado
     */
    function renderNotLoggedIn() {
        profileContent.innerHTML = `
            <div class="not-logged">
                <div class="not-logged-icon">
                    <i class="fas fa-user-lock"></i>
                </div>
                <h2>Acesso Restrito</h2>
                <p>Faça login para acessar seu perfil personalizado e todos os recursos da CBikeAI.</p>
                <div class="not-logged-actions">
                    <a href="../pages/login.html" class="btn btn-primary">
                        <i class="fas fa-sign-in-alt"></i>
                        Fazer Login
                    </a>
                    <a href="../pages/criar-conta.html" class="btn btn-secondary">
                        <i class="fas fa-user-plus"></i>
                        Criar Conta
                    </a>
                </div>
                <p class="redirect-notice">Você será redirecionado para a página de login em instantes...</p>
            </div>
        `;
    }

    /**
     * Renderiza o perfil completo do usuário
     */
    function renderUserProfile() {
        profileContent.innerHTML = `
            <div class="profile-header">
                <button class="edit-profile-btn" id="edit-profile-btn" aria-label="Editar perfil">
                    <i class="fas fa-edit"></i>
                    Editar Perfil
                </button>
                
                <div class="avatar-container" id="avatar-container" role="button" aria-label="Alterar foto do perfil">
                    <img src="${userData.avatar}" 
                         alt="Foto do perfil de ${userData.name}" 
                         class="profile-avatar"
                         onerror="this.src='${getDefaultAvatar()}'">
                    <div class="avatar-overlay">
                        <i class="fas fa-camera"></i>
                    </div>
                </div>
                
                <h1 class="profile-name">${userData.name}</h1>
                <p class="profile-email">${userData.email}</p>
                <div class="profile-badges">
                    <span class="user-badge">
                        <i class="fas fa-check-circle"></i> Verificado
                    </span>
                    <span class="premium-badge">
                        <i class="fas fa-crown"></i> Premium
                    </span>
                </div>
            </div>

            <div class="profile-stats">
                <div class="stat-card">
                    <span class="stat-number" id="saved-routes">12</span>
                    <span class="stat-label">Rotas Salvas</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" id="total-distance">347</span>
                    <span class="stat-label">Km Percorridos</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" id="usage-days">28</span>
                    <span class="stat-label">Dias de Uso</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number" id="friends-count">5</span>
                    <span class="stat-label">Amigos</span>
                </div>
            </div>

            <div class="profile-info">
                <div class="info-section">
                    <h3 class="section-title">
                        <i class="fas fa-user-circle"></i> Informações Pessoais
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">
                                <i class="fas fa-envelope"></i>
                                E-mail
                            </span>
                            <span class="info-value">${userData.email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">
                                <i class="fas fa-calendar-alt"></i>
                                Membro desde
                            </span>
                            <span class="info-value">${userData.memberSince}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">
                                <i class="fas fa-sign-in-alt"></i>
                                Método de login
                            </span>
                            <span class="info-value">
                                ${userData.loginMethod}
                                ${userData.loginMethod !== 'E-mail' ? 
                                    '<i class="fas fa-check verified-icon" aria-label="Verificado"></i>' : ''}
                            </span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">
                                <i class="fas fa-shield-alt"></i>
                                Status da conta
                            </span>
                            <span class="info-value status-active">
                                <i class="fas fa-circle"></i>
                                Ativa
                            </span>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3 class="section-title">
                        <i class="fas fa-bicycle"></i> Preferências de Ciclismo
                    </h3>
                    <div class="preferences-grid">
                        <div class="preference-item">
                            <span class="preference-label">Tipo de bicicleta</span>
                            <span class="preference-value">${userData.preferences.bikeType}</span>
                        </div>
                        <div class="preference-item">
                            <span class="preference-label">Nível de experiência</span>
                            <span class="preference-value">${userData.preferences.experienceLevel}</span>
                        </div>
                        <div class="preference-item">
                            <span class="preference-label">Distância preferida</span>
                            <span class="preference-value">${userData.preferences.preferredDistance}</span>
                        </div>
                        <div class="preference-item">
                            <span class="preference-label">Notificações</span>
                            <span class="preference-value">${userData.preferences.notifications}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="profile-features">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-route"></i>
                    </div>
                    <h4 class="feature-title">Minhas Rotas</h4>
                    <p class="feature-description">Acesse e gerencie suas rotas salvas e histórico de percursos.</p>
                    <button class="btn btn-outline" id="view-routes-btn">
                        <i class="fas fa-eye"></i>
                        Ver Rotas
                    </button>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h4 class="feature-title">Estatísticas</h4>
                    <p class="feature-description">Acompanhe seu progresso e métricas de desempenho.</p>
                    <button class="btn btn-outline" id="view-stats-btn">
                        <i class="fas fa-chart-bar"></i>
                        Ver Estatísticas
                    </button>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <h4 class="feature-title">Configurações</h4>
                    <p class="feature-description">Personalize suas preferências e configurações da conta.</p>
                    <button class="btn btn-outline" id="settings-btn">
                        <i class="fas fa-sliders-h"></i>
                        Configurar
                    </button>
                </div>
            </div>

            <div class="profile-actions">
                <a href="../index.html" class="action-btn">
                    <i class="fas fa-home"></i>
                    Voltar ao Início
                </a>
                <button class="action-btn" id="preferences-btn">
                    <i class="fas fa-user-cog"></i>
                    Preferências
                </button>
                <button class="logout-btn" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Sair da Conta
                </button>
            </div>
        `;
    }

    /**
     * Configura todos os event listeners da página
     */
    function setupEventListeners() {
        if (!isLoggedIn) return;

        // Logout
        document.getElementById('logout-btn').addEventListener('click', handleLogout);

        // Editar perfil
        document.getElementById('edit-profile-btn').addEventListener('click', handleEditProfile);

        // Alterar avatar
        document.getElementById('avatar-container').addEventListener('click', handleAvatarChange);

        // Botões de funcionalidades
        document.getElementById('view-routes-btn').addEventListener('click', () => showFeatureMessage('Rotas'));
        document.getElementById('view-stats-btn').addEventListener('click', () => showFeatureMessage('Estatísticas'));
        document.getElementById('settings-btn').addEventListener('click', () => showFeatureMessage('Configurações'));
        document.getElementById('preferences-btn').addEventListener('click', () => showFeatureMessage('Preferências'));

        // Teclado accessibility
        setupKeyboardAccessibility();
    }

    /**
     * Manipula o logout do usuário
     */
    function handleLogout() {
        if (confirm('Tem certeza que deseja sair da sua conta?')) {
            // Limpar dados sensíveis, manter preferências
            const preferences = userData.preferences;
            
            localStorage.clear();
            
            // Restaurar preferências
            Object.keys(preferences).forEach(key => {
                localStorage.setItem(key, preferences[key]);
            });
            
            // Registrar evento de logout
            if (typeof gtag !== 'undefined') {
                gtag('event', 'logout');
            }
            
            // Redirecionar para login
            window.location.href = '../pages/login.html';
        }
    }

    /**
     * Manipula a edição do perfil
     */
    function handleEditProfile() {
        showFeatureMessage('Edição de Perfil');
        // Em implementação futura, abrir modal de edição
    }

    /**
     * Manipula a alteração do avatar
     */
    function handleAvatarChange() {
        showFeatureMessage('Alteração de Foto');
        // Em implementação futura, abrir seletor de arquivos
    }

    /**
     * Mostra mensagem de funcionalidade em desenvolvimento
     */
    function showFeatureMessage(featureName) {
        alert(`🎯 ${featureName} - Funcionalidade em desenvolvimento!\n\nEsta feature estará disponível em breve.`);
        
        // Registrar interesse na feature
        if (typeof gtag !== 'undefined') {
            gtag('event', 'feature_interest', {
                'feature_name': featureName
            });
        }
    }

    /**
     * Configura acessibilidade via teclado
     */
    function setupKeyboardAccessibility() {
        document.addEventListener('keydown', function(e) {
            // Logout com Ctrl + L
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                handleLogout();
            }
            
            // Editar perfil com Ctrl + E
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                handleEditProfile();
            }
        });
    }

    /**
     * Atualiza estatísticas do usuário (simulação)
     */
    function updateUserStats() {
        // Em implementação real, buscaríamos esses dados de uma API
        const stats = {
            savedRoutes: Math.floor(Math.random() * 20) + 5,
            totalDistance: Math.floor(Math.random() * 500) + 100,
            usageDays: Math.floor(Math.random() * 60) + 10,
            friendsCount: Math.floor(Math.random() * 10) + 1
        };

        // Atualizar DOM
        Object.keys(stats).forEach(stat => {
            const element = document.getElementById(stat.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                animateValue(element, 0, stats[stat], 1000);
            }
        });
    }

    /**
     * Anima a transição de valores numéricos
     */
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Public methods para possível uso externo
    return {
        refreshProfile: () => {
            loadUserData();
            renderProfileContent();
            setupEventListeners();
        },
        
        updatePreferences: (newPreferences) => {
            Object.keys(newPreferences).forEach(key => {
                localStorage.setItem(key, newPreferences[key]);
            });
            loadUserData();
            renderProfileContent();
        },
        
        getUserData: () => userData
    };
});