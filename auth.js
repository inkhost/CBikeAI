/* ============================================================= */
/*  auth.js – Login normal + Google + Facebook + Apple */
/* ============================================================= */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const emailError = document.getElementById('login-email-error');
    const passwordInput = document.getElementById('login-password');
    const passwordError = document.getElementById('login-password-error');
    const togglePassword = document.querySelector('.toggle-password');
    const googleLoginBtn = document.getElementById('google-login');
    const facebookLoginBtn = document.getElementById('facebook-login');
    const appleLoginBtn = document.getElementById('apple-login');

    const strengthContainer = document.getElementById('password-strength');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    // IDs das APIs (substitua!)
    const GOOGLE_CLIENT_ID = googleLoginBtn ? googleLoginBtn.dataset.clientId : '';
    const FACEBOOK_APP_ID = facebookLoginBtn ? facebookLoginBtn.dataset.appId : '';
    const APPLE_SERVICES_ID = appleLoginBtn ? appleLoginBtn.dataset.servicesId : '';

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
    const requirements = [
        { regex: /.{8,}/, text: 'Pelo menos 8 caracteres', icon: 'check' },
        { regex: /[A-Z]/, text: 'Uma letra maiúscula', icon: 'check' },
        { regex: /[a-z]/, text: 'Uma letra minúscula', icon: 'check' },
        { regex: /[0-9]/, text: 'Um número', icon: 'check' },
        { regex: /[^A-Za-z0-9]/, text: 'Um caractere especial (!@#$% etc)', icon: 'check' }
    ];

    // Cria lista de requisitos
    const reqList = document.createElement('ul');
    reqList.className = 'requirement-list';
    requirements.forEach(req => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-${req.icon}"></i> ${req.text}`;
        li.dataset.valid = 'false';
        reqList.appendChild(li);
    });
    strengthContainer.appendChild(reqList);

    function validatePassword() {
        const value = passwordInput.value;
        let validCount = 0;

        requirements.forEach((req, i) => {
            const ok = req.regex.test(value);
            const li = reqList.children[i];
            if (ok) {
                li.classList.add('valid');
                li.dataset.valid = 'true';
                validCount++;
            } else {
                li.classList.remove('valid');
                li.dataset.valid = 'false';
            }
        });

        strengthContainer.classList.toggle('active', value !== '');
        strengthFill.className = 'strength-fill';

        if (value === '') {
            strengthContainer.classList.remove('active');
            return;
        }

        if (validCount === 5) {
            strengthContainer.classList.add('strength-strong');
            strengthText.textContent = 'Senha forte!';
        } else if (validCount >= 3) {
            strengthContainer.classList.add('strength-good');
            strengthText.textContent = 'Senha boa. Adicione mais variedade.';
        } else if (validCount >= 2) {
            strengthContainer.classList.add('strength-fair');
            strengthText.textContent = 'Senha razoável. Melhore a segurança.';
        } else {
            strengthContainer.classList.add('strength-weak');
            strengthText.textContent = 'Senha fraca. Atenda aos requisitos.';
        }
    }

    passwordInput.addEventListener('input', validatePassword);
    passwordInput.addEventListener('focus', validatePassword);

    /* ---------- OLHO (mostrar/esconder senha) ---------- */
    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    /* ---------- LOGIN NORMAL ---------- */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailOk = validateEmail();
            const passwordOk = requirements.every(r => r.regex.test(passwordInput.value));

            passwordError.textContent = '';
            passwordError.style.display = 'none';

            if (!emailOk) {
                emailInput.focus();
                return;
            }

            if (!passwordOk) {
                passwordError.textContent = 'A senha não atende aos requisitos de segurança.';
                passwordError.style.display = 'block';
                passwordInput.focus();
                return;
            }

            // Simula login bem-sucedido
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', emailInput.value);
            localStorage.setItem('userName', emailInput.value.split('@')[0]); // Nome simples

            console.log('Login normal bem-sucedido!');
            window.location.href = 'perfil.html';
        });
    }

    /* ---------- LOGIN COM GOOGLE ---------- */
    if (googleLoginBtn && GOOGLE_CLIENT_ID) {
        // Carrega a biblioteca do Google
        const googleScript = document.createElement('script');
        googleScript.src = 'https://accounts.google.com/gsi/client';
        googleScript.async = true;
        googleScript.defer = true;
        document.head.appendChild(googleScript);

        googleScript.onload = function() {
            // Inicializa o Google Sign-In
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleSignIn,
                auto_select: false,
                cancel_on_tap_outside: false
            });

            // Renderiza o botão
            window.google.accounts.id.renderButton(
                googleLoginBtn,
                { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with' }
            );
        };
    }

    // Callback do Google
    function handleGoogleSignIn(response) {
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', payload.email);
        localStorage.setItem('userName', payload.name);
        localStorage.setItem('userAvatar', payload.picture);
        console.log('Login Google bem-sucedido!', payload);
        window.location.href = 'perfil.html';
    }

    /* ---------- LOGIN COM FACEBOOK ---------- */
    if (facebookLoginBtn && FACEBOOK_APP_ID) {
        // Carrega a SDK do Facebook
        window.fbAsyncInit = function() {
            FB.init({
                appId: FACEBOOK_APP_ID,
                cookie: true,
                xfbml: true,
                version: 'v20.0'
            });

            FB.AppEvents.logPageView();

            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    console.log('Usuário já logado no Facebook');
                }
            });
        };

        // Carrega o script da SDK
        (function(d, s, id) {
            const fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            const js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/pt_BR/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Event listener para o botão Facebook
        facebookLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            FB.login(function(response) {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    FB.api('/me', { fields: 'name,email,picture.type(large)' }, function(userResponse) {
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userEmail', userResponse.email);
                        localStorage.setItem('userName', userResponse.name);
                        localStorage.setItem('userAvatar', userResponse.picture.data.url);
                        console.log('Login Facebook bem-sucedido!', userResponse);
                        window.location.href = 'perfil.html';
                    });
                } else {
                    console.log('Login Facebook cancelado');
                }
            }, { scope: 'public_profile,email' });
        });
    }

    /* ---------- LOGIN COM APPLE ---------- */
    if (appleLoginBtn && APPLE_SERVICES_ID) {
        // Carrega a SDK do Apple
        const appleScript = document.createElement('script');
        appleScript.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        appleScript.async = true;
        document.head.appendChild(appleScript);

        appleScript.onload = function() {
            // Configura o Apple Sign In
            AppleID.auth.init({
                clientId: APPLE_SERVICES_ID,
                scope: 'name email',
                redirectURI: window.location.origin + '/callback',  // Ajuste se necessário
                usePopup: true  // Popup em vez de redirect
            });

            // Event listener para o botão Apple
            appleLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                AppleID.auth.signIn().then(function(response) {
                    // Extrai dados do usuário
                    const userEmail = response.user.email;
                    const userName = (response.user.name && response.user.name.firstName) ? 
                        `${response.user.name.firstName} ${response.user.name.lastName || ''}`.trim() : 'Usuário Apple';
                    const userPicture = 'https://via.placeholder.com/120?text=Apple';  // Placeholder, pois Apple não fornece foto

                    // Simula login
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', userEmail);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('userAvatar', userPicture);

                    console.log('Login Apple bem-sucedido!', response.user);
                    window.location.href = 'perfil.html';
                }).catch(function(error) {
                    console.log('Login Apple cancelado ou erro:', error);
                });
            });
        };
    }
});
