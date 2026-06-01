// Validação do formulário de contato com limites de caracteres e envio real via FormSubmit
document.addEventListener('DOMContentLoaded', function() {
    setupCharCounters();
    setupPhoneFormatting();
    setupFAQ();
    setupFormValidation();
    setupInputLimits();
});

// Configurar limites físicos nos campos de entrada
function setupInputLimits() {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const mensagemInput = document.getElementById('mensagem');
    
    if (nomeInput) nomeInput.setAttribute('maxlength', '50');
    if (emailInput) emailInput.setAttribute('maxlength', '100');
    if (telefoneInput) telefoneInput.setAttribute('maxlength', '20');
    if (mensagemInput) mensagemInput.setAttribute('maxlength', '500');
}

// Configurar contadores de caracteres em tempo real
function setupCharCounters() {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const mensagemInput = document.getElementById('mensagem');
    
    if (nomeInput) {
        nomeInput.addEventListener('input', () => updateCharCounter(nomeInput, 'nome', 50));
    }
    if (emailInput) {
        emailInput.addEventListener('input', () => updateCharCounter(emailInput, 'email', 100));
    }
    if (telefoneInput) {
        telefoneInput.addEventListener('input', () => updateCharCounter(telefoneInput, 'telefone', 20));
    }
    if (mensagemInput) {
        mensagemInput.addEventListener('input', () => updateCharCounter(mensagemInput, 'mensagem', 500));
        mensagemInput.addEventListener('input', function() {
            const length = this.value.length;
            const maxLength = 500;
            if (length >= maxLength) {
                showCharLimitMessage('mensagem', `Limite de ${maxLength} caracteres atingido.`);
            } else {
                hideCharLimitMessage('mensagem');
            }
        });
    }
}

function updateCharCounter(input, fieldId, maxLength) {
    const length = input.value.length;
    const counter = document.getElementById(`${fieldId}-counter`);
    if (counter) {
        counter.textContent = `${length}/${maxLength}`;
        counter.classList.remove('warning', 'error');
        if (length > maxLength * 0.8 && length < maxLength) {
            counter.classList.add('warning');
        }
        if (length >= maxLength) {
            counter.classList.add('error');
        }
    }
}

function showCharLimitMessage(fieldId, message) {
    hideCharLimitMessage(fieldId);
    const inputElement = document.getElementById(fieldId);
    const formGroup = inputElement.closest('.form-group');
    const limitMessage = document.createElement('div');
    limitMessage.className = 'char-limit-message';
    limitMessage.id = `${fieldId}-limit-message`;
    limitMessage.textContent = message;
    limitMessage.style.color = 'var(--error-color)';
    limitMessage.style.fontSize = '0.85rem';
    limitMessage.style.marginTop = '5px';
    limitMessage.style.fontWeight = '600';
    limitMessage.style.animation = 'fadeIn 0.3s ease';
    formGroup.appendChild(limitMessage);
}

function hideCharLimitMessage(fieldId) {
    const existingMessage = document.getElementById(`${fieldId}-limit-message`);
    if (existingMessage) existingMessage.remove();
}

// Formatação de telefone
function setupPhoneFormatting() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value;
                } else if (value.length <= 7) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3');
                }
            }
            e.target.value = value;
            updateCharCounter(e.target, 'telefone', 20);
        });
        telefoneInput.addEventListener('keydown', function(e) {
            if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        telefoneInput.addEventListener('paste', function(e) {
            const pastedData = e.clipboardData.getData('text');
            if (!/^\d+$/.test(pastedData)) e.preventDefault();
        });
    }
}

// FAQ interativo
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = button.querySelector('i');
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

// Validação e envio real do formulário via FormSubmit (AJAX)
function setupFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Capturar valores
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const assunto = document.getElementById('assunto').value;
        const mensagem = document.getElementById('mensagem').value.trim();
        let isValid = true;

        // Resetar mensagens de erro
        document.getElementById('nome-error').style.display = 'none';
        document.getElementById('email-error').style.display = 'none';
        document.getElementById('telefone-error').style.display = 'none';
        document.getElementById('assunto-error').style.display = 'none';
        document.getElementById('mensagem-error').style.display = 'none';
        document.getElementById('form-message').style.display = 'none';

        document.getElementById('nome').classList.remove('error');
        document.getElementById('email').classList.remove('error');
        document.getElementById('telefone').classList.remove('error');
        document.getElementById('assunto').classList.remove('error');
        document.getElementById('mensagem').classList.remove('error');

        // Validações
        if (!nome) {
            showError('nome', 'Por favor, digite seu nome.');
            isValid = false;
        } else if (nome.length > 50) {
            showError('nome', 'O nome deve ter no máximo 50 caracteres.');
            isValid = false;
        }

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

        const telefoneNumeros = telefone.replace(/\D/g, '');
        if (telefone && telefoneNumeros.length > 0) {
            if (telefoneNumeros.length < 10) {
                showError('telefone', 'O telefone deve ter pelo menos 10 dígitos.');
                isValid = false;
            } else if (telefoneNumeros.length > 11) {
                showError('telefone', 'O telefone deve ter no máximo 11 dígitos.');
                isValid = false;
            }
        }

        if (!assunto) {
            showError('assunto', 'Selecione um assunto.');
            isValid = false;
        }

        if (!mensagem) {
            showError('mensagem', 'Por favor, escreva sua mensagem.');
            isValid = false;
        } else if (mensagem.length > 500) {
            showError('mensagem', 'A mensagem deve ter no máximo 500 caracteres.');
            isValid = false;
        }

        if (!isValid) return;

        // Preparar envio
        const formMessageDiv = document.getElementById('form-message');
        formMessageDiv.style.display = 'block';
        formMessageDiv.textContent = 'Enviando mensagem...';
        formMessageDiv.className = 'form-message';

        // Preencher o campo _replyto com o e-mail do usuário
        document.getElementById('replyto').value = email;

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formMessageDiv.textContent = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
                formMessageDiv.classList.add('form-message-success');
                contactForm.reset();
                resetCharCounters();
                hideCharLimitMessage('mensagem');
                setTimeout(() => {
                    formMessageDiv.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Falha no envio');
            }
        } catch (error) {
            formMessageDiv.textContent = '❌ Erro ao enviar. Tente novamente mais tarde ou envie diretamente para claudiofelipe6@gmail.com';
            formMessageDiv.classList.add('form-message-error');
            console.error('Erro no envio:', error);
            setTimeout(() => {
                formMessageDiv.style.display = 'none';
            }, 6000);
        }
    });
}

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

function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
    }
}
