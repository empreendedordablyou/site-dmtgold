document.addEventListener('DOMContentLoaded', function () {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyEdzEdirfxXLsIU5-v5DWwJvzcaIbeb6_cfhtQLcFrAW_sOQCpDeGDfzvDcbJZKjOQUg/exec'; // URL do Google Apps Script
    const form = document.forms['form-dtmgold'];
    const button = document.getElementById('confirm');

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

    // Modifica a função de submissão do formulário
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Impede o envio imediato do formulário
        button.disabled = true;
        button.classList.add('loading');

        // Verifica se o reCAPTCHA foi carregado corretamente
        if (typeof grecaptcha !== "undefined") {
            grecaptcha.ready(function () {
                grecaptcha.execute('6Lc--UAqAAAAABtMCFoedz2_mQyepCUsMHb0yoqa', { action: 'submit' }).then(function (token) {
                    console.log("Token gerado:", token); // Debug: Exibe o token gerado no console

                    let recaptchaResponse = document.createElement('input');
                    recaptchaResponse.setAttribute('type', 'hidden');
                    recaptchaResponse.setAttribute('name', 'g-recaptcha-response');
                    recaptchaResponse.setAttribute('value', token);
                    form.appendChild(recaptchaResponse);

                    // Exibe a notificação push
                    showPushNotification('Formulário enviado com sucesso!');

                    // Simula o tempo de exibição "Enviando..." de 2 segundos
                    setTimeout(function () {
                        // Envia o formulário após 2 segundos de espera
                        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                            .then(response => {
                                alert("Você está Cadastrado. > Acesse o grupo a seguir e se mantenha atualizado!");
                                window.location.replace("https://chat.whatsapp.com/Hp3UISJ76NP7igiLg961y2");
                            })
                            .catch(error => console.error('Error!', error.message))
                            .finally(() => {
                                button.disabled = false;
                                button.classList.remove('loading');
                            });
                    }, 2000); // Reduzido para 2 segundos
                });
            });
        } else {
            console.error("grecaptcha não foi definido. Verifique se o script do reCAPTCHA foi carregado corretamente.");
            button.disabled = false;
            button.classList.remove('loading');
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
});
