// Validação do formulário de contato com limites de caracteres
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades quando a página carregar
    setupCharCounters();
    setupPhoneFormatting();
    setupFAQ();
    setupFormValidation();
});

// Configurar contadores de caracteres em tempo real
function setupCharCounters() {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const mensagemInput = document.getElementById('mensagem');
    
    // Adicionar event listeners para atualização em tempo real
    nomeInput.addEventListener('input', () => updateCharCounter(nomeInput, 'nome', 50));
    emailInput.addEventListener('input', () => updateCharCounter(emailInput, 'email', 100));
    telefoneInput.addEventListener('input', () => updateCharCounter(telefoneInput, 'telefone', 20));
    mensagemInput.addEventListener('input', () => updateCharCounter(mensagemInput, 'mensagem', 500));
}

// Atualizar contador de caracteres
function updateCharCounter(input, fieldId, maxLength) {
    const length = input.value.length;
    const counter = document.getElementById(`${fieldId}-counter`);
    
    if (counter) {
        counter.textContent = `${length}/${maxLength}`;
        
        // Atualizar cor do contador baseado no uso
        counter.classList.remove('warning', 'error');
        if (length > maxLength * 0.8) {
            counter.classList.add('warning');
        }
        if (length > maxLength) {
            counter.classList.add('error');
        }
    }
}

// Configurar formatação automática do telefone
function setupPhoneFormatting() {
    const telefoneInput = document.getElementById('telefone');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            }
        });
    }
}

// Configurar funcionalidade do FAQ
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = button.querySelector('i');
            
            // Fechar todos os outros itens do FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherIcon = item.querySelector('i');
                    
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                    if (otherIcon) {
                        otherIcon.classList.remove('fa-chevron-up');
                        otherIcon.classList.add('fa-chevron-down');
                    }
                }
            });
            
            // Alternar item atual
            faqItem.classList.toggle('active');
            if (faqItem.classList.contains('active')) {
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            } else {
                if (answer) answer.style.maxHeight = null;
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    });
}

// Configurar validação do formulário
function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            let isValid = true;

            // Reiniciar mensagens de erro
            document.getElementById('nome-error').style.display = 'none';
            document.getElementById('email-error').style.display = 'none';
            document.getElementById('mensagem-error').style.display = 'none';
            document.getElementById('form-message').style.display = 'none';
            
            // Remover classes de erro
            document.getElementById('nome').classList.remove('error');
            document.getElementById('email').classList.remove('error');
            document.getElementById('mensagem').classList.remove('error');

            // Validar nome (máximo 50 caracteres)
            if (!nome) {
                showError('nome', 'Por favor, digite seu nome.');
                isValid = false;
            } else if (nome.length > 50) {
                showError('nome', 'O nome deve ter no máximo 50 caracteres.');
                isValid = false;
            }

            // Validar email (máximo 100 caracteres)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email) {
                showError('email', 'Por favor, digite seu e-mail.');
                isValid = false;
            } else if (!emailPattern.test(email)) {
                showError('email', 'Por favor, digite um e-mail válido.');
                isValid = false;
            } else if (email.length > 100) {
                showError('email', 'O e-mail deve ter no máximo 100 caracteres.');
                isValid = false;
            }

            // Validar telefone (máximo 20 caracteres)
            if (telefone && telefone.length > 20) {
                showError('telefone', 'O telefone deve ter no máximo 20 caracteres.');
                isValid = false;
            }

            // Validar mensagem (máximo 500 caracteres)
            if (!mensagem) {
                showError('mensagem', 'Por favor, escreva sua mensagem.');
                isValid = false;
            } else if (mensagem.length > 500) {
                showError('mensagem', 'A mensagem deve ter no máximo 500 caracteres.');
                isValid = false;
            }

            // Se tudo estiver válido, enviar o formulário
            if (isValid) {
                const formMessage = document.getElementById('form-message');
                formMessage.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                formMessage.className = 'form-message form-message-success';
                formMessage.style.display = 'block';
                
                // Reiniciar formulário
                this.reset();
                resetCharCounters();
                
                // Esconder mensagem após 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        });
    }
}

// Reiniciar todos os contadores de caracteres
function resetCharCounters() {
    const fields = [
        { id: 'nome', max: 50 },
        { id: 'email', max: 100 },
        { id: 'telefone', max: 20 },
        { id: 'mensagem', max: 500 }
    ];
    
    fields.forEach(field => {
        const counter = document.getElementById(`${field.id}-counter`);
        if (counter) {
            counter.textContent = `0/${field.max}`;
            counter.classList.remove('warning', 'error');
        }
    });
}

// Mostrar mensagem de erro
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
    }
}

// Função para verificar se elementos existem antes de manipular
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}