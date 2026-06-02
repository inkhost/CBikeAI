// ===== GERENCIAMENTO DE COOKIES E GOOGLE ANALYTICS =====
const STORAGE_KEY = 'cbikeai_cookie_consent';

function loadGoogleAnalytics() {
    if (window.gaLoaded) return;
    window.gaLoaded = true;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7C6KGFMFV6';
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-7C6KGFMFV6');
}

function removeGoogleAnalytics() {
    if (window.gtag) window.gtag = function(){};
    // Remove cookies do GA
    document.cookie.split(";").forEach(c => {
        const name = c.split("=")[0].trim();
        if (name.startsWith('_ga') || name.startsWith('_gid') || name === '_gat') {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
    });
    window.gaLoaded = false;
}

function applyConsent(consent) {
    if (consent.analytics) loadGoogleAnalytics();
    else removeGoogleAnalytics();
}

function getConsent() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
}

function setConsent(consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    applyConsent(consent);
    hideBannerAndModal();
}

function hideBannerAndModal() {
    const banner = document.getElementById('cookieBanner');
    const modal = document.getElementById('preferencesModal');
    if (banner) banner.style.display = 'none';
    if (modal) modal.style.display = 'none';
}

function showBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'flex';
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const existing = getConsent();
    if (existing) {
        applyConsent(existing);
        hideBannerAndModal();
    } else {
        showBanner();
    }
    
    // Botões do banner
    document.getElementById('acceptAllBtn')?.addEventListener('click', () => {
        setConsent({ analytics: true, functional: true, marketing: true });
    });
    document.getElementById('rejectAllBtn')?.addEventListener('click', () => {
        setConsent({ analytics: false, functional: false, marketing: false });
    });
    document.getElementById('customizeBtn')?.addEventListener('click', () => {
        const curr = getConsent() || { analytics: false, functional: true, marketing: false };
        document.getElementById('analyticsCheckbox').checked = curr.analytics;
        document.getElementById('functionalCheckbox').checked = curr.functional;
        document.getElementById('marketingCheckbox').checked = curr.marketing;
        document.getElementById('preferencesModal').style.display = 'flex';
    });
    
    // Fechar modal
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('preferencesModal').style.display = 'none';
    });
    
    // Salvar preferências personalizadas
    document.getElementById('savePreferencesBtn')?.addEventListener('click', () => {
        const newConsent = {
            analytics: document.getElementById('analyticsCheckbox').checked,
            functional: document.getElementById('functionalCheckbox').checked,
            marketing: document.getElementById('marketingCheckbox').checked
        };
        setConsent(newConsent);
    });
    
    // Botão "Gerenciar preferências" dentro da página
    document.getElementById('openPreferencesBtn')?.addEventListener('click', () => {
        const curr = getConsent() || { analytics: false, functional: true, marketing: false };
        document.getElementById('analyticsCheckbox').checked = curr.analytics;
        document.getElementById('functionalCheckbox').checked = curr.functional;
        document.getElementById('marketingCheckbox').checked = curr.marketing;
        document.getElementById('preferencesModal').style.display = 'flex';
    });
});
