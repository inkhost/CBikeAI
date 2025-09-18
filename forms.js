document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();
    let isValid = true;

    // Reset error messages
    document.getElementById('nome-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('mensagem-error').textContent = '';
    document.getElementById('form-message').textContent = '';

    // Validate name
    if (!nome) {
        document.getElementById('nome-error').textContent = 'Por favor, digite seu nome.';
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('email-error').textContent = 'Por favor, digite seu e-mail.';
        isValid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Por favor, digite um e-mail válido.';
        isValid = false;
    }

    // Validate message
    if (!mensagem) {
        document.getElementById('mensagem-error').textContent = 'Por favor, escreva sua mensagem.';
        isValid = false;
    }

    // If valid, submit the form
    if (isValid) {
        document.getElementById('form-message').textContent = 'Formulário enviado com sucesso!';
        // Uncomment to submit to backend
        // this.submit();
    }
});