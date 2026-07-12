// perfil.js - Módulo de gerenciamento do perfil CBikeAI

window.ProfileManager = (function() {
    // ===== DADOS DO USUÁRIO (CARREGADOS DO LOCALSTORAGE) =====
    let currentUser = {
        name: '',
        email: '',
        avatar: null,
        phone: '',
        memberSince: new Date().toLocaleDateString('pt-BR'),
        preferences: {
            bikeType: 'Urbana',
            experience: 'Intermediário',
            preferredDistance: '10-20 km',
            notifications: true
        },
        stats: {
            totalKm: 0,
            routesCount: 0,
            daysActive: 0,
            friends: 0
        }
    };

    let routes = [];
    let chartInstance = null;
    let mapInstance = null;
    let currentMarker = null;

    // ===== CARREGAR DADOS DO LOCALSTORAGE =====
    function loadData() {
        // ===== CARREGAR DADOS DO USUÁRIO =====
        // O nome DEVE ser exatamente o que foi salvo no cadastro
        const userName = localStorage.getItem('userName') || 'Usuário CBikeAI';
        const userEmail = localStorage.getItem('userEmail') || 'usuario@cbikeai.com';
        const userPhone = localStorage.getItem('userPhone') || '';
        const userAvatar = localStorage.getItem('userAvatar') || null;
        const memberSince = localStorage.getItem('memberSince') || new Date().toLocaleDateString('pt-BR');

        // ===== APLICAR NOME E EMAIL EXATOS DO CADASTRO =====
        currentUser.name = userName;
        currentUser.email = userEmail;
        currentUser.phone = userPhone;
        currentUser.avatar = userAvatar;
        currentUser.memberSince = memberSince;

        // Carregar preferências salvas
        const storedPrefs = localStorage.getItem('userPreferences');
        if (storedPrefs) {
            try {
                const parsed = JSON.parse(storedPrefs);
                currentUser.preferences = { ...currentUser.preferences, ...parsed };
            } catch(e) {}
        }

        // ===== TODOS OS DADOS ZERADOS =====
        currentUser.stats.totalKm = 0;
        currentUser.stats.routesCount = 0;
        currentUser.stats.daysActive = 0;
        currentUser.stats.friends = 0;

        // Rotas sempre vazias
        routes = [];
        saveRoutes();
        saveUser();
    }

    // ===== SALVAR DADOS =====
    function saveUser() {
        localStorage.setItem('userPreferences', JSON.stringify(currentUser.preferences));
    }

    function saveRoutes() {
        localStorage.setItem('cbikeai_routes', JSON.stringify(routes));
        currentUser.stats.totalKm = 0;
        currentUser.stats.routesCount = 0;
    }

    // ===== ESCAPE HTML =====
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    // ===== RENDERIZAR GRÁFICO (ZERADO) =====
    function renderChart() {
        const ctx = document.getElementById('performanceChart')?.getContext('2d');
        if (!ctx) return;
        if (chartInstance) chartInstance.destroy();

        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const kmData = [0, 0, 0, 0, 0, 0];

        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Km percorridos',
                    data: kmData,
                    backgroundColor: '#444',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#666',
                            font: { size: 12 }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: { color: '#666' },
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    x: {
                        ticks: { color: '#666' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // ===== RENDERIZAR UI PRINCIPAL =====
    function renderProfile() {
        const container = document.getElementById('profile-container');
        if (!container) return;

        // ===== NOME E EMAIL EXATOS DO CADASTRO =====
        // Nome: exatamente como foi salvo (ex: "Claudio Felipe")
        // Email: exatamente como foi salvo (ex: "claudiofelipe6@gmail.com")
        const displayName = currentUser.name || 'Usuário CBikeAI';
        const displayEmail = currentUser.email || 'usuario@cbikeai.com';

        // Avatar: usa a imagem salva ou gera com base no NOME (não no email)
        const avatarUrl = currentUser.avatar || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=09e331&color=000&size=150`;

        container.innerHTML = `
            <!-- ===== CABEÇALHO DO PERFIL ===== -->
            <div class="profile-header">
                <div class="avatar-container">
                    <img src="${avatarUrl}" alt="Avatar de ${escapeHtml(displayName)}" class="avatar-large" id="avatarImg">
                    <button class="avatar-edit-btn" id="avatarEditBtn" aria-label="Alterar foto">
                        <i class="fas fa-camera"></i>
                    </button>
                </div>
                <!-- NOME COMPLETO (ex: Claudio Felipe) -->
                <h2 class="profile-name">${escapeHtml(displayName)}</h2>
                <!-- EMAIL ABAIXO DO NOME (ex: claudiofelipe6@gmail.com) -->
                <p class="profile-email">${escapeHtml(displayEmail)}</p>
                <p class="profile-member-since">
                    <i class="fas fa-calendar-alt"></i>
                    Membro desde ${currentUser.memberSince || '2026'}
                </p>
                <div class="profile-badges">
                    <span class="user-badge"><i class="fas fa-check-circle"></i> Verificado</span>
                    <span class="premium-badge"><i class="fas fa-crown"></i> Premium</span>
                </div>
                <div class="profile-actions-top">
                    <button class="btn-outline" id="editProfileBtn">
                        <i class="fas fa-user-edit"></i> Editar Perfil
                    </button>
                </div>
            </div>

            <!-- ===== ESTATÍSTICAS (ZERADAS) ===== -->
            <div class="stats-grid" id="statsGrid">
                <div class="stat-card">
                    <div class="stat-number zero">0</div>
                    <div class="stat-label">Km Totais</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number zero">0</div>
                    <div class="stat-label">Rotas Salvas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number zero">0</div>
                    <div class="stat-label">Dias de Uso</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number zero">0</div>
                    <div class="stat-label">Amigos</div>
                </div>
            </div>

            <!-- ===== PREFERÊNCIAS ===== -->
            <div class="info-card">
                <h3 class="section-title"><i class="fas fa-bicycle"></i> Preferências de Ciclismo</h3>
                <div class="preferences-row">
                    <div class="preference-item">
                        <span>🚲 Bicicleta</span>
                        <span class="preference-value">${escapeHtml(currentUser.preferences.bikeType)}</span>
                    </div>
                    <div class="preference-item">
                        <span>📈 Nível</span>
                        <span class="preference-value">${escapeHtml(currentUser.preferences.experience)}</span>
                    </div>
                    <div class="preference-item">
                        <span>📍 Distância</span>
                        <span class="preference-value">${escapeHtml(currentUser.preferences.preferredDistance)}</span>
                    </div>
                    <div class="preference-item">
                        <span>🔔 Notificações</span>
                        <span class="preference-value">${currentUser.preferences.notifications ? 'Ativas' : 'Desativadas'}</span>
                    </div>
                </div>
                <button class="btn-neon" id="openPrefModalBtn" style="margin-top:1rem">
                    <i class="fas fa-sliders-h"></i> Personalizar Preferências
                </button>
            </div>

            <!-- ===== MINHAS ROTAS (ZERADAS) ===== -->
            <div class="info-card">
                <h3 class="section-title"><i class="fas fa-route"></i> Minhas Rotas</h3>
                <div id="routesList" class="routes-list">
                    <div class="empty-routes">
                        <i class="fas fa-map-signs" style="font-size:2rem; color:#444; display:block; margin-bottom:0.5rem;"></i>
                        Nenhuma rota salva ainda.<br>
                        <span style="font-size:0.85rem; color:#555;">Clique em "Nova Rota" para começar!</span>
                    </div>
                </div>
                <button class="add-route-btn" id="addRouteBtn">
                    <i class="fas fa-plus"></i> Nova Rota
                </button>
            </div>

            <!-- ===== GRÁFICO (ZERADO) ===== -->
            <div class="info-card">
                <h3 class="section-title"><i class="fas fa-chart-line"></i> Estatísticas de Desempenho</h3>
                <div class="chart-container">
                    <canvas id="performanceChart"></canvas>
                </div>
                <p style="text-align:center; color:#555; font-size:0.85rem; margin-top:0.5rem;">
                    <i class="fas fa-info-circle"></i> Comece a pedalar para ver suas estatísticas aqui!
                </p>
            </div>

            <!-- ===== AÇÕES ===== -->
            <div class="profile-actions">
                <a href="../index.html" class="action-btn">
                    <i class="fas fa-home"></i> Início
                </a>
                <button class="logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </button>
            </div>
        `;

        renderChart();
        attachEvents();
    }

    // ===== EVENTOS =====
    function attachEvents() {
        document.getElementById('editProfileBtn')?.addEventListener('click', openProfileModal);
        document.getElementById('openPrefModalBtn')?.addEventListener('click', openPreferencesModal);
        document.getElementById('addRouteBtn')?.addEventListener('click', openRouteModal);
        document.getElementById('avatarImg')?.addEventListener('click', uploadAvatar);
        document.getElementById('avatarEditBtn')?.addEventListener('click', uploadAvatar);
        document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

        document.getElementById('logout-header')?.addEventListener('click', handleLogout);
    }

    // ===== LOGOUT =====
    async function handleLogout(e) {
        e.preventDefault();
        if (confirm('Tem certeza que deseja sair?')) {
            if (window.CBikeAuth?.signOut) {
                await window.CBikeAuth.signOut();
            }
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userPreferences');
            localStorage.removeItem('cbikeai_routes');
            window.location.href = '../pages/login.html';
        }
    }

    // ===== MODAL EDITAR PERFIL =====
    function openProfileModal() {
        // Usa o nome e email atuais para preencher o formulário
        const currentName = currentUser.name || '';
        const currentEmail = currentUser.email || '';

        const modalHtml = `
            <div class="modal-overlay" id="profileModalOverlay">
                <div class="modal-container">
                    <h3><i class="fas fa-user-edit"></i> Editar Perfil</h3>
                    <label>Nome completo</label>
                    <input type="text" id="editName" value="${escapeHtml(currentName)}" placeholder="Digite seu nome completo">
                    <label>E-mail</label>
                    <input type="email" id="editEmail" value="${escapeHtml(currentEmail)}" placeholder="seu@email.com">
                    <div class="modal-actions">
                        <button class="btn-outline" id="closeProfileModal">Cancelar</button>
                        <button class="btn-neon" id="saveProfileBtn">Salvar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const overlay = document.getElementById('profileModalOverlay');
        overlay.classList.add('active');

        document.getElementById('closeProfileModal').onclick = () => overlay.remove();
        document.getElementById('saveProfileBtn').onclick = () => {
            const newName = document.getElementById('editName').value.trim();
            const newEmail = document.getElementById('editEmail').value.trim();

            // ===== SALVAR NOME E EMAIL EXATOS =====
            if (newName) {
                currentUser.name = newName;
                localStorage.setItem('userName', newName);
            }
            if (newEmail) {
                currentUser.email = newEmail;
                localStorage.setItem('userEmail', newEmail);
            }

            saveUser();
            overlay.remove();
            renderProfile();
        };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    // ===== MODAL PREFERÊNCIAS =====
    function openPreferencesModal() {
        const modalHtml = `
            <div class="modal-overlay" id="prefModalOverlay">
                <div class="modal-container">
                    <h3><i class="fas fa-sliders-h"></i> Preferências de Ciclismo</h3>
                    <label>Tipo de bicicleta</label>
                    <select id="prefBikeSelect">
                        <option ${currentUser.preferences.bikeType === 'Urbana' ? 'selected' : ''}>Urbana</option>
                        <option ${currentUser.preferences.bikeType === 'Mountain Bike' ? 'selected' : ''}>Mountain Bike</option>
                        <option ${currentUser.preferences.bikeType === 'Speed' ? 'selected' : ''}>Speed</option>
                        <option ${currentUser.preferences.bikeType === 'Elétrica' ? 'selected' : ''}>Elétrica</option>
                    </select>
                    <label>Nível de experiência</label>
                    <select id="prefExpSelect">
                        <option ${currentUser.preferences.experience === 'Iniciante' ? 'selected' : ''}>Iniciante</option>
                        <option ${currentUser.preferences.experience === 'Intermediário' ? 'selected' : ''}>Intermediário</option>
                        <option ${currentUser.preferences.experience === 'Avançado' ? 'selected' : ''}>Avançado</option>
                    </select>
                    <label>Distância preferida</label>
                    <select id="prefDistSelect">
                        <option ${currentUser.preferences.preferredDistance === '5-10 km' ? 'selected' : ''}>5-10 km</option>
                        <option ${currentUser.preferences.preferredDistance === '10-20 km' ? 'selected' : ''}>10-20 km</option>
                        <option ${currentUser.preferences.preferredDistance === '20-40 km' ? 'selected' : ''}>20-40 km</option>
                        <option ${currentUser.preferences.preferredDistance === '40+ km' ? 'selected' : ''}>40+ km</option>
                    </select>
                    <label style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;">
                        <input type="checkbox" id="prefNotifCheck" ${currentUser.preferences.notifications ? 'checked' : ''}>
                        Ativar notificações
                    </label>
                    <div class="modal-actions">
                        <button class="btn-outline" id="closePrefModal">Cancelar</button>
                        <button class="btn-neon" id="savePrefBtn">Salvar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const overlay = document.getElementById('prefModalOverlay');
        overlay.classList.add('active');

        document.getElementById('closePrefModal').onclick = () => overlay.remove();
        document.getElementById('savePrefBtn').onclick = () => {
            currentUser.preferences.bikeType = document.getElementById('prefBikeSelect').value;
            currentUser.preferences.experience = document.getElementById('prefExpSelect').value;
            currentUser.preferences.preferredDistance = document.getElementById('prefDistSelect').value;
            currentUser.preferences.notifications = document.getElementById('prefNotifCheck').checked;
            saveUser();
            overlay.remove();
            renderProfile();
        };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

    // ===== MODAL ROTAS =====
    function openRouteModal() {
        const modalHtml = `
            <div class="modal-overlay" id="routeModalOverlay">
                <div class="modal-container" style="max-width:700px">
                    <h3><i class="fas fa-plus-circle"></i> Adicionar Nova Rota</h3>
                    <label>Nome da rota</label>
                    <input type="text" id="routeName" placeholder="Ex: Parque Central">
                    <label>Distância (km)</label>
                    <input type="number" id="routeDistance" step="0.1" placeholder="12.5">
                    <label>Descrição (opcional)</label>
                    <textarea id="routeDesc" rows="2" placeholder="Detalhes do percurso..."></textarea>
                    <label>Localização (clique no mapa)</label>
                    <div class="map-container" id="routeMapContainer"></div>
                    <div class="modal-actions">
                        <button class="btn-outline" id="closeRouteModal">Cancelar</button>
                        <button class="btn-neon" id="saveRouteBtn">Salvar Rota</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const overlay = document.getElementById('routeModalOverlay');
        overlay.classList.add('active');

        const mapDiv = document.getElementById('routeMapContainer');
        mapDiv.style.height = '250px';
        if (mapInstance) mapInstance.remove();
        mapInstance = L.map(mapDiv).setView([-21.067, -48.662], 13);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        }).addTo(mapInstance);

        let selectedLat = -21.067, selectedLng = -48.662;
        if (currentMarker) mapInstance.removeLayer(currentMarker);
        currentMarker = L.marker([selectedLat, selectedLng]).addTo(mapInstance);

        mapInstance.on('click', (e) => {
            selectedLat = e.latlng.lat;
            selectedLng = e.latlng.lng;
            currentMarker.setLatLng([selectedLat, selectedLng]);
        });

        document.getElementById('closeRouteModal').onclick = () => { overlay.remove(); if(mapInstance) mapInstance.remove(); };
        document.getElementById('saveRouteBtn').onclick = () => {
            const name = document.getElementById('routeName').value.trim();
            const dist = parseFloat(document.getElementById('routeDistance').value);
            if (!name || isNaN(dist) || dist <= 0) {
                alert('Preencha nome e distância válida (maior que 0).');
                return;
            }
            showToast('Rota adicionada com sucesso! 🎉');
            overlay.remove();
            renderProfile();
        };

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if(mapInstance) mapInstance.remove();
            }
        });
    }

    // ===== TOAST =====
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // ===== UPLOAD AVATAR =====
    function uploadAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    currentUser.avatar = ev.target.result;
                    localStorage.setItem('userAvatar', ev.target.result);
                    renderProfile();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    // ===== INICIALIZAR =====
    function init() {
        loadData();
        renderProfile();
        window.addEventListener('resize', () => {
            if (chartInstance) chartInstance.resize();
        });
    }

    return { init };
})();