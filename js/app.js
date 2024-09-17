document.addEventListener('DOMContentLoaded', function() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyEdzEdirfxXLsIU5-v5DWwJvzcaIbeb6_cfhtQLcFrAW_sOQCpDeGDfzvDcbJZKjOQUg/exec'; // URL do Google Apps Script
    const form = document.forms['form-dtmgold'];

    // Verifica se o formulário e a div com o botão existem
    if (!form) {
        console.error("Formulário não encontrado. Verifique o nome do formulário.");
        return;
    }

    const buttonContainer = document.querySelector('#button-container'); // Substitua pela classe ou ID da div que contém o input
    const submitButton = buttonContainer ? buttonContainer.querySelector('input[type="submit"]') : null;

    if (!submitButton) {
        console.error("Botão de envio não encontrado. Verifique a classe ou ID do botão.");
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio imediato do formulário

        submitButton.disabled = true; // Desativa o botão
        submitButton.classList.add('loading'); // Adiciona a classe de loading, se necessário

        // Verifica se o reCAPTCHA foi carregado corretamente
        if (typeof grecaptcha !== "undefined") {
            grecaptcha.ready(function() {
                grecaptcha.execute('6Lc--UAqAAAAABtMCFoedz2_mQyepCUsMHb0yoqa', {action: 'submit'}).then(function(token) {
                    console.log("Token gerado:", token); // Debug: Exibe o token gerado no console
                    
                    let recaptchaResponse = document.createElement('input');
                    recaptchaResponse.setAttribute('type', 'hidden');
                    recaptchaResponse.setAttribute('name', 'g-recaptcha-response');
                    recaptchaResponse.setAttribute('value', token);
                    form.appendChild(recaptchaResponse);

                    // Simula o tempo de exibição "Enviando..." de 5 segundos
                    setTimeout(function() {
                        // Envia o formulário após 5 segundos de espera
                        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                // Exibe a notificação push após o envio
                                showPushNotification('Formulário enviado com sucesso!');
                                
                                // Simula o redirecionamento após a notificação
                                setTimeout(function () {
                                    window.location.replace("https://chat.whatsapp.com/Hp3UISJ76NP7igiLg961y2");
                                }, 2000); // Reduzido para 2 segundos
                            })
                            .catch(error => {
                                console.error('Error!', error.message);
                                showPushNotification('Ocorreu um erro ao enviar o formulário.');
                            })
                            .finally(() => {
                                submitButton.disabled = false; // Reativa o botão
                                submitButton.classList.remove('loading'); // Remove a classe de loading, se necessário
                            });
                    }, 5000); // Tempo de envio de formulário (5 segundos)
                });
            });
        } else {
            console.error("grecaptcha não foi definido. Verifique se o script do reCAPTCHA foi carregado corretamente.");
            submitButton.disabled = false; // Reativa o botão em caso de erro
            submitButton.classList.remove('loading'); // Remove a classe de loading, se necessário
        }
    });

    // Formatação do campo de telefone
    document.getElementById('phone').addEventListener('input', function (event) {
        let inputValue = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        inputValue = inputValue.substring(0, 11); // Limita a 11 caracteres (9 dígitos + 2 pontos)

        if (inputValue.length > 10) {
            inputValue = inputValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            inputValue = inputValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }

        event.target.value = inputValue;
    });

    // Função para exibir a notificação push
    function showPushNotification(message) {
        const pushNotification = document.createElement('div');
        pushNotification.classList.add('push-notification');
        pushNotification.innerHTML = message;
        document.body.appendChild(pushNotification);

        // Exibe a notificação
        setTimeout(() => {
            pushNotification.classList.add('show');
        }, 100); // Pequeno atraso para garantir a transição

        // Remove a notificação após 3 segundos
        setTimeout(() => {
            pushNotification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(pushNotification);
            }, 500); // Tempo para a transição de saída
        }, 3000);
    }
});
