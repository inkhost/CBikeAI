// perfil.js - Módulo de gerenciamento do perfil CBikeAI (responsivo)
window.ProfileManager = (function() {
    // Dados padrão
    let currentUser = {
        name: 'Ciclista CBike',
        email: 'ciclista@cbikeai.com',
        avatar: null,
        preferences: {
            bikeType: 'Urbana',
            experience: 'Intermediário',
            preferredDistance: '10-20 km',
            notifications: true
        },
        memberSince: new Date().toLocaleDateString('pt-BR'),
        stats: {
            totalKm: 347,
            routesCount: 12,
            daysActive: 28,
            friends: 5
        }
    };
    
    let routes = [];
    let chartInstance = null;
    let mapInstance = null;
    let currentMarker = null;
    
    // Carregar dados salvos
    function loadData() {
        const storedUser = localStorage.getItem('cbikeai_user_profile');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                currentUser = { ...currentUser, ...parsed };
            } catch(e) {}
        }
        const storedRoutes = localStorage.getItem('cbikeai_routes');
        if (storedRoutes) {
            routes = JSON.parse(storedRoutes);
        } else {
            routes = [
                { id: '1', name: 'Trilha do Lago', distance: 15.2, lat: -21.067, lng: -48.662, description: 'Percurso plano' },
                { id: '2', name: 'Circuito Urbano', distance: 8.5, lat: -21.082, lng: -48.645, description: 'Ruas centrais' }
            ];
            saveRoutes();
        }
        updateStatsFromRoutes();
    }
    
    function saveUser() {
        localStorage.setItem('cbikeai_user_profile', JSON.stringify(currentUser));
    }
    function saveRoutes() {
        localStorage.setItem('cbikeai_routes', JSON.stringify(routes));
        updateStatsFromRoutes();
    }
    function updateStatsFromRoutes() {
        const totalKm = routes.reduce((sum, r) => sum + (r.distance || 0), 0);
        currentUser.stats.totalKm = Math.round(totalKm);
        currentUser.stats.routesCount = routes.length;
        saveUser();
    }
    
    // Escape HTML
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Renderizar gráfico
    function renderChart() {
        const ctx = document.getElementById('performanceChart')?.getContext('2d');
        if (!ctx) return;
        if (chartInstance) chartInstance.destroy();
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const kmData = [42, 58, 73, 91, 112, currentUser.stats.totalKm % 130 || 87];
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: { labels: months, datasets: [{ label: 'Km percorridos', data: kmData, backgroundColor: '#09e331', borderRadius: 8 }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: 'white' } } } }
        });
    }
    
    // Renderizar UI principal
    function renderProfile() {
        const container = document.getElementById('profile-container');
        if (!container) return;
        
        const avatarUrl = currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=09e331&color=000&size=130`;
        
        container.innerHTML = `
            <div class="profile-header">
                <img src="${avatarUrl}" alt="Avatar" class="avatar-large" id="avatarImg" style="cursor:pointer">
                <h2 class="profile-name">${escapeHtml(currentUser.name)}</h2>
                <p class="profile-email">${escapeHtml(currentUser.email)}</p>
                <div class="profile-badges">
                    <span class="user-badge"><i class="fas fa-check-circle"></i> Verificado</span>
                    <span class="premium-badge"><i class="fas fa-crown"></i> Premium</span>
                </div>
                <button class="btn-outline edit-main-btn" id="editProfileBtn" style="margin-top:1rem"><i class="fas fa-user-edit"></i> Editar Perfil</button>
            </div>
            
            <div class="stats-grid" id="statsGrid">
                <div class="stat-card"><div class="stat-number">${currentUser.stats.totalKm}</div><div class="stat-label">Km Totais</div></div>
                <div class="stat-card"><div class="stat-number">${currentUser.stats.routesCount}</div><div class="stat-label">Rotas Salvas</div></div>
                <div class="stat-card"><div class="stat-number">${currentUser.stats.daysActive}</div><div class="stat-label">Dias de Uso</div></div>
                <div class="stat-card"><div class="stat-number">${currentUser.stats.friends}</div><div class="stat-label">Amigos</div></div>
            </div>
            
            <div class="info-card">
                <h3 class="section-title"><i class="fas fa-bicycle"></i> Preferências de Ciclismo</h3>
                <div class="preferences-row">
                    <div class="preference-item"><span>🚲 Bicicleta</span><span class="preference-value">${escapeHtml(currentUser.preferences.bikeType)}</span></div>
                    <div class="preference-item"><span>📈 Nível</span><span class="preference-value">${escapeHtml(currentUser.preferences.experience)}</span></div>
                    <div class="preference-item"><span>📍 Distância</span><span class="preference-value">${escapeHtml(currentUser.preferences.preferredDistance)}</span></div>
                    <div class="preference-item"><span>🔔 Notificações</span><span class="preference-value">${currentUser.preferences.notifications ? 'Ativas' : 'Desativadas'}</span></div>
                </div>
                <button class="btn-neon" id="openPrefModalBtn" style="margin-top:1rem"><i class="fas fa-sliders-h"></i> Personalizar Preferências</button>
            </div>
            
            <div class="info-card">
                <h3 class="section-title"><i class="fas fa-route"></i> Minhas Rotas</h3>
                <div id="routesList" class="routes-list"></div>
                <button class="add-route-btn" id="addRouteBtn"><i class="fas fa-plus"></i> Nova Rota</button>
            </div>
            
            <div class="info-card">
                <h3 class="section-title"><i class="fas fa-chart-line"></i> Estatísticas de Desempenho</h3>
                <canvas id="performanceChart" width="400" height="200" style="max-height:250px; width:100%"></canvas>
            </div>
            
            <div class="profile-actions">
                <a href="../index.html" class="action-btn"><i class="fas fa-home"></i> Início</a>
                <button class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Sair</button>
            </div>
        `;
        
        // Preencher lista de rotas
        const routesDiv = document.getElementById('routesList');
        if (routesDiv) {
            if (routes.length === 0) {
                routesDiv.innerHTML = '<p class="muted" style="color:#aaa;">Nenhuma rota salva ainda.</p>';
            } else {
                routesDiv.innerHTML = routes.map(route => `
                    <div class="route-item" data-id="${route.id}">
                        <div>
                            <div class="route-name">${escapeHtml(route.name)}</div>
                            <div class="route-distance">${route.distance} km</div>
                        </div>
                        <div class="route-actions">
                            <button class="view-route-btn" data-id="${route.id}" title="Ver no mapa"><i class="fas fa-map-marker-alt"></i></button>
                            <button class="delete-route-btn" data-id="${route.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        renderChart();
        attachEvents();
    }
    
    function attachEvents() {
        document.getElementById('editProfileBtn')?.addEventListener('click', openProfileModal);
        document.getElementById('openPrefModalBtn')?.addEventListener('click', openPreferencesModal);
        document.getElementById('addRouteBtn')?.addEventListener('click', openRouteModal);
        document.getElementById('avatarImg')?.addEventListener('click', uploadAvatar);
        document.getElementById('logoutBtn')?.addEventListener('click', () => { localStorage.clear(); window.location.href = '../pages/login.html'; });
        
        document.querySelectorAll('.delete-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                deleteRoute(id);
            });
        });
        document.querySelectorAll('.view-route-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                viewRouteOnMap(id);
            });
        });
    }
    
    // Modais (com estrutura responsiva)
    function openProfileModal() {
        const modalHtml = `
            <div class="modal-overlay" id="profileModalOverlay">
                <div class="modal-container">
                    <h3>Editar Perfil</h3>
                    <label>Nome</label>
                    <input type="text" id="editName" value="${escapeHtml(currentUser.name)}">
                    <label>E-mail</label>
                    <input type="email" id="editEmail" value="${escapeHtml(currentUser.email)}">
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
            currentUser.name = document.getElementById('editName').value;
            currentUser.email = document.getElementById('editEmail').value;
            saveUser();
            overlay.remove();
            renderProfile();
        };
    }
    
    function openPreferencesModal() {
        const modalHtml = `
            <div class="modal-overlay" id="prefModalOverlay">
                <div class="modal-container">
                    <h3>Preferências de Ciclismo</h3>
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
                    <label><input type="checkbox" id="prefNotifCheck" ${currentUser.preferences.notifications ? 'checked' : ''}> Ativar notificações</label>
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
    }
    
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
            if (!name || isNaN(dist)) { alert('Preencha nome e distância válida'); return; }
            const newRoute = {
                id: Date.now().toString(),
                name: name,
                distance: dist,
                lat: selectedLat,
                lng: selectedLng,
                description: document.getElementById('routeDesc').value
            };
            routes.push(newRoute);
            saveRoutes();
            overlay.remove();
            renderProfile();
        };
    }
    
    function deleteRoute(id) {
        if (confirm('Remover esta rota?')) {
            routes = routes.filter(r => r.id !== id);
            saveRoutes();
            renderProfile();
        }
    }
    
    function viewRouteOnMap(id) {
        const route = routes.find(r => r.id === id);
        if (!route) return;
        const modalMap = `
            <div class="modal-overlay" id="viewMapOverlay">
                <div class="modal-container" style="max-width:700px">
                    <h3>${escapeHtml(route.name)} - ${route.distance} km</h3>
                    <div class="map-container" id="singleMap" style="height:300px"></div>
                    <button class="btn-neon" id="closeViewMap" style="margin-top:1rem">Fechar</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalMap);
        const overlay = document.getElementById('viewMapOverlay');
        overlay.classList.add('active');
        const mapDiv = document.getElementById('singleMap');
        const map = L.map(mapDiv).setView([route.lat, route.lng], 14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        L.marker([route.lat, route.lng]).addTo(map).bindPopup(route.name).openPopup();
        document.getElementById('closeViewMap').onclick = () => overlay.remove();
    }
    
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
                    saveUser();
                    renderProfile();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
    
    function init() {
        loadData();
        renderProfile();
        window.addEventListener('resize', () => { if(chartInstance) chartInstance.resize(); });
    }
    
    return { init };
})();
