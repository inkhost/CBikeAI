document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    let isValid = true;

    // Limpar mensagens de erro
    document.getElementById('nome-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('mensagem-error').textContent = '';
    document.getElementById('form-message').textContent = '';

    // Validar nome
    if (!nome) {
        document.getElementById('nome-error').textContent = 'Por favor, digite seu nome.';
        isValid = false;
    }

    // Validar e-mail
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('email-error').textContent = 'Por favor, digite seu e-mail.';
        isValid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Por favor, digite um e-mail válido.';
        isValid = false;
    }

    // Validar mensagem
    if (!mensagem) {
        document.getElementById('mensagem-error').textContent = 'Por favor, escreva sua mensagem.';
        isValid = false;
    }

    // Enviar se válido
    if (isValid) {
        document.getElementById('form-message').textContent = 'Formulário enviado com sucesso!';
        // Descomente para enviar ao backend
        // this.submit();
    }
});