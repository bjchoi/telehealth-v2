async function deploy(e) {
    e.preventDefault();
    const mfaCode =  $('#mfa-input').val();

    fetch('/installer/deploy-service', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            command: "deploy",
            serviceName: "myServiceName"
        })
    }).then((response) => {
        if (!response.ok) {
            response.json().then(json => {
                const messageTarget = $('#mfa-error');
                messageTarget.text(json.message );
                messageTarget.show();
            })
            throw Error(response.statusText)
        }
        return response;
    }).then((response) => response.json())
        .then((r) => {
            accessToken = r.accessToken;
            refreshToken = r.refreshToken;
            $('#mfa-form').hide();
            $('#mfa-input').val('');
            $('#auth-successful').show();
            $('main').show();
            initialize();
    })
    .catch((err) => console.log(err));
}