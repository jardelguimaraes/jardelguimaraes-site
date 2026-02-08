function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const nome = form.nome.value;
    const email = form.email.value;
    const servico = form.servico.value;

    const texto = `Olá! Vim do site e gostaria de agendar uma consultoria.\n\n*Nome:* ${nome}\n*E-mail:* ${email}\n*Serviço de Interesse:* ${servico}`;
    const whatsappLink = `https://wa.me/5537999351826?text=${encodeURIComponent(texto)}`;

    window.open(whatsappLink, '_blank');
}