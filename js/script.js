// Menu Mobile Toggle
const navbarToggler = document.getElementById('navbar-toggler');
const mobileMenu = document.getElementById('mobile-menu');

navbarToggler.addEventListener('click', () => {
    navbarToggler.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        navbarToggler.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Adicionar animação ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .benefit-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Função do formulário - SUBSTITUA A ANTIGA POR ESTA
function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // 1️⃣ ENVIAR PARA N8N (Webhook)
    fetch('https://webhook.jg.jardelguimaraes.com.br/webhook/leads-jg', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: data.nome,
            email: data.email,
            whatsapp: data.whatsapp,
            servico: data.servico,
            origem: 'Site - Formulário',
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log('Lead enviado para N8N:', result);
    })
    .catch(error => {
        console.error('Erro ao enviar lead:', error);
    });
    
    // 2️⃣ REDIRECIONAR PARA WHATSAPP (mantém comportamento atual)
    const mensagem = `Olá Jardel! Vim do site jardelguimaraes.com.br

📋 Meus dados:
Nome: ${data.nome}
Email: ${data.email}
WhatsApp: ${data.whatsapp}
Interesse: ${data.servico}

Gostaria de saber mais sobre suas automações!`;
    
    const whatsappUrl = `https://wa.me/5537999351826?text=${encodeURIComponent(mensagem)}`;
    
    // 3️⃣ ABRIR WHATSAPP E LIMPAR FORMULÁRIO
    window.open(whatsappUrl, '_blank');
    alert('✅ Dados enviados! Redirecionando para o WhatsApp 🚀');
    event.target.reset();
}
