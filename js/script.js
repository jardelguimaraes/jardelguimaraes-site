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

// Função do formulário (já está no HTML)
function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    const mensagem = `Olá Jardel! Vim do site jardelguimaraes.com.br

📋 Meus dados:
Nome: ${data.nome}
Email: ${data.email}
WhatsApp: ${data.whatsapp}
Interesse: ${data.servico}

Gostaria de saber mais sobre suas automações!`;
    
    const whatsappUrl = `https://wa.me/5537999351826?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
    
    alert('Redirecionando para o WhatsApp! 🚀');
    event.target.reset();
}
