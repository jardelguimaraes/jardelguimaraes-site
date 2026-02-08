function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const nome = form.nome.value;
    const email = form.email.value;
    const servico = form.servico.value;

    const mailtoLink = `mailto:contato@jardelguimaraes.com.br?subject=Agendamento de Consultoria - ${nome}&body=Olá, meu nome é ${nome} e meu e-mail é ${email}. Tenho interesse no serviço de ${servico}.`;

    window.location.href = mailtoLink;
}