function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Envio para webhook atualizado
    fetch('https://webhook.jardelguimaraes.com.br/submit', {  // URL alterada de webhook.jg.jardelguimaraes.com.br
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Sucesso:', result);
        alert('Obrigado! Entraremos em contato em breve.');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao enviar. Tente novamente.');
    });
}