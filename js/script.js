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

// ... (mantenha o código de Navbar e Scroll acima)

// Função do formulário corrigida para JGAutomações.AI
document.getElementById('leadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const btn = document.getElementById('btnSubmit');
    const successMsg = document.getElementById('successMessage');
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Feedback visual imediato
    btn.innerHTML = "⌛ Processando sua solicitação...";
    btn.disabled = true;

    // 1️⃣ ENVIAR PARA N8N (Webhook de Produção)
    fetch('https://webhook.jg.jardelguimaraes.com.br/webhook/leads-jg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: data.nome,
            email: data.email,
            whatsapp: data.whatsapp,
            servico: data.servico,
            origem: 'Site - Formulário',
            timestamp: new Date().toISOString()
        })
    })
    .then(response => {
        if (response.ok) {
            // Sucesso: Esconde botão e mostra mensagem
            btn.style.display = 'none';
            successMsg.style.display = 'block';              
            event.target.reset();
        } else {
            throw new Error('Erro no servidor');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        btn.innerHTML = "❌ Erro ao enviar. Tente novamente.";
        btn.disabled = false;
    });
});
