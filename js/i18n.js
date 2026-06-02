// i18n.js - Gerenciamento de idiomas para CBikeAI
const translations = {
    pt: {
        page_title: "CBikeAI - Home",
        nav_home: "Início",
        nav_about: "Quem Somos",
        nav_contact: "Contato",
        nav_login: "Login",
        nav_profile: "Meu Perfil",
        nav_logout: "Sair",
        hero_title: "Inovação e tecnologia para suas pedaladas!",
        hero_subtitle: "O farol inteligente para bicicletas que combina IA, GPS e sensores para maior segurança e praticidade.",
        hero_btn_start: "Começar Agora",
        hero_btn_more: "Saiba Mais",
        features_title: "Por que escolher o CBikeAI?",
        feature1_title: "Inteligência Artificial",
        feature1_desc: "Nosso sistema de IA adapta automaticamente a iluminação conforme as condições do ambiente e sua velocidade.",
        feature2_title: "GPS Integrado",
        feature2_desc: "Rastreamento em tempo real e rotas inteligentes para suas aventuras sobre duas rodas.",
        feature3_title: "Segurança Total",
        feature3_desc: "Sensores de proximidade e detecção de veículos para garantir sua segurança nas ruas.",
        feature4_title: "Bateria de Longa Duração",
        feature4_desc: "Até 15 horas de autonomia no modo econômico e carregamento rápido por USB-C.",
        cta_title: "Pronto para revolucionar suas pedaladas?",
        cta_subtitle: "Junte-se a milhares de ciclistas que já experimentaram a segurança e tecnologia CBikeAI.",
        cta_btn_account: "Criar Minha Conta",
        cta_btn_sales: "Falar com Vendas",
        testimonials_title: "O que nossos ciclistas dizem",
        testimonial1_text: "\"A CBikeAI mudou completamente minhas pedaladas noturnas. A sensação de segurança é incomparável!\"",
        testimonial1_name: "Carlos Silva",
        testimonial1_role: "Ciclista Urbano",
        testimonial2_text: "\"Comprei achando que era mais um farol chinês genérico. Me enganei feio. Qualidade de marca premium por preço de entrada.\"",
        testimonial2_name: "Ana Rodrigues",
        testimonial2_role: "Ciclista Urbana",
        testimonial3_text: "\"Resumo da ópera: pedalo mais, pedalo mais longe, pedalo mais feliz e chego vivo. A CBikeAi é item de sobrevivência.\"",
        testimonial3_name: "Pedro Santos",
        testimonial3_role: "Ciclista Urbano",
        testimonial4_text: "\"Melhor presente que já dei para mim mesma. Todo pedal agora é mais seguro e tranquilo.\"",
        testimonial4_name: "Luiza Barbosa",
        testimonial4_role: "Ciclista Urbana",
        testimonial5_text: "\"Como ciclista profissional, exijo o melhor em equipamentos. A CBikeAI superou todas as expectativas!\"",
        testimonial5_name: "Ricardo Mendes",
        testimonial5_role: "Ciclista Profissional",
        testimonial6_text: "\"Sério, parece besteira até você precisar. Depois que você tem, nunca mais quer sair sem.\"",
        testimonial6_name: "Fernanda Costa",
        testimonial6_role: "Ciclista Amadora",
        testimonial7_text: "\"A conectividade com o smartphone é fantástica. Consigo ver todas as estatísticas dos meus trajetos.\"",
        testimonial7_name: "Lucas Torres",
        testimonial7_role: "Ciclista Amador",
        testimonial8_text: "\"Simplesmente o melhor custo-benefício do mercado. Recomendo a todos!\"",
        testimonial8_name: "Mariana Alves",
        testimonial8_role: "Ciclista Amadora",
        testimonial9_text: "\"A resistência à água é impressionante! Já passei por várias chuvas fortes e o farol continua perfeito.\"",
        testimonial9_name: "Rafael Souza",
        testimonial9_role: "Ciclista Amador",
        footer_company: "CBikeAI",
        footer_description: "Revolucionando a segurança no ciclismo através da tecnologia e inovação.",
        footer_quick_links: "Links Rápidos",
        footer_home: "Início",
        footer_about: "Quem Somos",
        footer_contact: "Contato",
        footer_terms: "Termos de Serviço",
        footer_privacy: "Política de Privacidade",
        footer_cookies: "Política de Cookies",
        footer_contact_title: "Contato",
        footer_copyright: "© 2026 CBikeAI. Todos os direitos reservados."
    },
    en: {
        page_title: "CBikeAI - Home",
        nav_home: "Home",
        nav_about: "About Us",
        nav_contact: "Contact",
        nav_login: "Login",
        nav_profile: "My Profile",
        nav_logout: "Logout",
        hero_title: "Innovation and technology for your rides!",
        hero_subtitle: "The smart bike light combining AI, GPS and sensors for greater safety and convenience.",
        hero_btn_start: "Get Started",
        hero_btn_more: "Learn More",
        features_title: "Why choose CBikeAI?",
        feature1_title: "Artificial Intelligence",
        feature1_desc: "Our AI system automatically adjusts lighting according to environmental conditions and your speed.",
        feature2_title: "Integrated GPS",
        feature2_desc: "Real-time tracking and smart routes for your two-wheeled adventures.",
        feature3_title: "Total Security",
        feature3_desc: "Proximity sensors and vehicle detection to ensure your safety on the streets.",
        feature4_title: "Long-lasting Battery",
        feature4_desc: "Up to 15 hours of autonomy in economy mode and fast USB-C charging.",
        cta_title: "Ready to revolutionize your rides?",
        cta_subtitle: "Join thousands of cyclists who have already experienced CBikeAI safety and technology.",
        cta_btn_account: "Create My Account",
        cta_btn_sales: "Talk to Sales",
        testimonials_title: "What our cyclists say",
        testimonial1_text: "\"CBikeAI completely changed my night rides. The feeling of safety is unmatched!\"",
        testimonial1_name: "Carlos Silva",
        testimonial1_role: "Urban Cyclist",
        testimonial2_text: "\"I thought it was just another generic Chinese light. I was so wrong. Premium quality for an entry price.\"",
        testimonial2_name: "Ana Rodrigues",
        testimonial2_role: "Urban Cyclist",
        testimonial3_text: "\"Long story short: I ride more, I ride farther, I ride happier and I arrive alive. CBikeAI is survival gear.\"",
        testimonial3_name: "Pedro Santos",
        testimonial3_role: "Urban Cyclist",
        testimonial4_text: "\"Best gift I've ever given myself. Every ride is safer, smoother and even more beautiful.\"",
        testimonial4_name: "Luiza Barbosa",
        testimonial4_role: "Urban Cyclist",
        testimonial5_text: "\"As a professional cyclist, I demand the best equipment. CBikeAI exceeded all expectations!\"",
        testimonial5_name: "Ricardo Mendes",
        testimonial5_role: "Professional Cyclist",
        testimonial6_text: "\"Seriously, it sounds silly until you need it. Once you have it, you never want to ride without it.\"",
        testimonial6_name: "Fernanda Costa",
        testimonial6_role: "Amateur Cyclist",
        testimonial7_text: "\"The smartphone connectivity is fantastic. I can see all my route statistics.\"",
        testimonial7_name: "Lucas Torres",
        testimonial7_role: "Amateur Cyclist",
        testimonial8_text: "\"Simply the best value for money on the market. I recommend it to everyone!\"",
        testimonial8_name: "Mariana Alves",
        testimonial8_role: "Amateur Cyclist",
        testimonial9_text: "\"Water resistance is impressive! I've been through heavy rain and the light works perfectly.\"",
        testimonial9_name: "Rafael Souza",
        testimonial9_role: "Amateur Cyclist",
        footer_company: "CBikeAI",
        footer_description: "Revolutionizing cycling safety through technology and innovation.",
        footer_quick_links: "Quick Links",
        footer_home: "Home",
        footer_about: "About Us",
        footer_contact: "Contact",
        footer_terms: "Terms of Service",
        footer_privacy: "Privacy Policy",
        footer_cookies: "Cookie Policy",
        footer_contact_title: "Contact",
        footer_copyright: "© 2026 CBikeAI. All rights reserved."
    },
    es: {
        page_title: "CBikeAI - Inicio",
        nav_home: "Inicio",
        nav_about: "Quiénes Somos",
        nav_contact: "Contacto",
        nav_login: "Iniciar Sesión",
        nav_profile: "Mi Perfil",
        nav_logout: "Cerrar Sesión",
        hero_title: "¡Innovación y tecnología para tus pedaladas!",
        hero_subtitle: "La luz inteligente para bicicletas que combina IA, GPS y sensores para mayor seguridad y practicidad.",
        hero_btn_start: "Comenzar Ahora",
        hero_btn_more: "Saber Más",
        features_title: "¿Por qué elegir CBikeAI?",
        feature1_title: "Inteligencia Artificial",
        feature1_desc: "Nuestro sistema de IA ajusta automáticamente la iluminación según las condiciones ambientales y tu velocidad.",
        feature2_title: "GPS Integrado",
        feature2_desc: "Seguimiento en tiempo real y rutas inteligentes para tus aventuras sobre dos ruedas.",
        feature3_title: "Seguridad Total",
        feature3_desc: "Sensores de proximidad y detección de vehículos para garantizar tu seguridad en las calles.",
        feature4_title: "Batería de Larga Duración",
        feature4_desc: "Hasta 15 horas de autonomía en modo económico y carga rápida USB-C.",
        cta_title: "¿Listo para revolucionar tus pedaladas?",
        cta_subtitle: "Únete a miles de ciclistas que ya han experimentado la seguridad y tecnología de CBikeAI.",
        cta_btn_account: "Crear mi Cuenta",
        cta_btn_sales: "Hablar con Ventas",
        testimonials_title: "Lo que dicen nuestros ciclistas",
        testimonial1_text: "\"CBikeAI cambió completamente mis salidas nocturnas. ¡La sensación de seguridad es incomparable!\"",
        testimonial1_name: "Carlos Silva",
        testimonial1_role: "Ciclista Urbano",
        testimonial2_text: "\"Pensé que era otra luz china genérica. Estaba muy equivocado. Calidad premium a precio de entrada.\"",
        testimonial2_name: "Ana Rodrigues",
        testimonial2_role: "Ciclista Urbana",
        testimonial3_text: "\"En resumen: pedaleo más, pedaleo más lejos, pedaleo más feliz y llego vivo. CBikeAi es equipo de supervivencia.\"",
        testimonial3_name: "Pedro Santos",
        testimonial3_role: "Ciclista Urbano",
        testimonial4_text: "\"El mejor regalo que me he hecho. Cada paseo es más seguro, suave y hermoso.\"",
        testimonial4_name: "Luiza Barbosa",
        testimonial4_role: "Ciclista Urbana",
        testimonial5_text: "\"Como ciclista profesional, exijo el mejor equipo. ¡CBikeAI superó todas las expectativas!\"",
        testimonial5_name: "Ricardo Mendes",
        testimonial5_role: "Ciclista Profesional",
        testimonial6_text: "\"En serio, parece una tontería hasta que lo necesitas. Una vez que lo tienes, nunca quieres salir sin él.\"",
        testimonial6_name: "Fernanda Costa",
        testimonial6_role: "Ciclista Amateur",
        testimonial7_text: "\"La conectividad con el smartphone es fantástica. Puedo ver todas las estadísticas de mis rutas.\"",
        testimonial7_name: "Lucas Torres",
        testimonial7_role: "Ciclista Amateur",
        testimonial8_text: "\"Simplemente la mejor relación calidad-precio del mercado. ¡Lo recomiendo a todos!\"",
        testimonial8_name: "Mariana Alves",
        testimonial8_role: "Ciclista Amateur",
        testimonial9_text: "\"¡La resistencia al agua es impresionante! He pasado por fuertes lluvias y la luz sigue perfecta.\"",
        testimonial9_name: "Rafael Souza",
        testimonial9_role: "Ciclista Amateur",
        footer_company: "CBikeAI",
        footer_description: "Revolucionando la seguridad en el ciclismo a través de la tecnología e innovación.",
        footer_quick_links: "Enlaces Rápidos",
        footer_home: "Inicio",
        footer_about: "Quiénes Somos",
        footer_contact: "Contacto",
        footer_terms: "Términos de Servicio",
        footer_privacy: "Política de Privacidad",
        footer_cookies: "Política de Cookies",
        footer_contact_title: "Contacto",
        footer_copyright: "© 2026 CBikeAI. Todos los derechos reservados."
    }
};

let currentLang = localStorage.getItem('cbikeai_lang') || 'pt';

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('cbikeai_lang', lang);
    
    // Atualizar o texto do botão seletor
    const currentLabel = document.getElementById('currentLangLabel');
    if (currentLabel) {
        if (lang === 'pt') currentLabel.innerText = 'PT';
        else if (lang === 'en') currentLabel.innerText = 'EN';
        else if (lang === 'es') currentLabel.innerText = 'ES';
    }
    
    // Percorre todos os elementos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.innerHTML = translations[lang][key];
            }
        }
    });
    
    // Atualizar o título da página
    if (translations[lang].page_title) {
        document.title = translations[lang].page_title;
    }
}

// Inicializa o idioma ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    
    // Configurar o dropdown de idioma
    const selector = document.getElementById('languageSelector');
    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn && selector) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selector.classList.toggle('active');
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                selector.classList.remove('active');
            }
        });
        
        // Opções de idioma
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                const lang = opt.getAttribute('data-lang');
                setLanguage(lang);
                selector.classList.remove('active');
            });
        });
    }
});