let accountName = null;
let configParams = null;

// array of user input variable values are stored here
// { key, required, css_class, value, is_valid }
const variableInput = [];

$(document).ready(async function () {
    $("button.get-twilio-phone").click(function () {
        window.open("https://console.twilio.com/");
    })
    await populate();
    checkApplication();
});


// -----------------------------------------------------------------------------
async function addVariable(variable, current) {
    if (variable.key === 'TWILIO_PHONE_NUMBER') {
        // twilio phone number dropdown is handled outside, TODO: move inside
        variableInput.push({
            key: 'TWILIO_PHONE_NUMBER',
            required: variable.required,
            css_id: '#twilio_phone_number',
        });
        return;
    }
    console.log(variable.key, current ? current.value : null);

    if (! variable.configurable) return; // skip inconfiguration variables

    const originalElement = $('div.clone-original');

    const clonedElement = originalElement.clone().insertBefore(originalElement);
    clonedElement.removeClass("clone-original");
    clonedElement.addClass("clone-for-" + variable.key);

    const label = variable.key.toLowerCase().split('_').map(word => word[0].toUpperCase() + word.substr(1)).join(' ');
    (variable.required === true) ? clonedElement.find('.star').show() : clonedElement.find('.star').hide();
    clonedElement.find(".configure-label").text(label);

    css_id = `${variable.key.toLowerCase()}`;
    clonedElement.find('input').attr("id", css_id);
    clonedElement.find('input').attr("name", css_id);

    const value = current ? current.value : (variable.default ? variable.default: '');
    clonedElement.find('input').val(value);
    // clonedElement.find('input').attr("placeholder", (variable.default == null ? ' ' : variable.default));
    clonedElement.find('.tooltip').text(variable.description);
    const formats = {
        "secret": "password",
        "phone_number": "text",
        "email": "text",
        "text": "text"
    };
    clonedElement.find('input').attr("type", (formats.hasOwnProperty(variable.format) ? formats[variable.format] : "text"));

    if (variable.required === false) clonedElement.prop('disabled', true);
    if (variable.configurable === true) {
        clonedElement.show();
        variableInput.push({
            key: variable.key,
            required: variable.required,
            css_id: `#${css_id}`,
        });
    }
    // delete the original div after cloning
    //originalElement.remove();
}


// -----------------------------------------------------------------------------
async function populate() {
    const THIS = populate.name;
    try {
        const response = await fetch('/installer/get-application', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const info = await response.json();

        console.log(THIS, 'server returned:', info);
        $('#account_name').val(info.twilioAccountName);

        const phoneList = info.twilioPhoneNumbers;
        if (phoneList.length === 0)
          $(".configure-error-twilio-phone-number").show();
        phoneList.forEach(phone => {
          const html = `<option value="${phone.phoneNumber}">${phone.friendlyName}</option>`;
          $('#twilio_phone_number').append(html);
        });

        for (v of info.configurationVariables) {
          await addVariable(v, info.configurationValues.find(_v => _v.key === v.key));
        }

    } catch (err) {
        console.log(err);
        $(".configure-error-login").text("Your Twilio authentication failed. Please try again with correct credentials");
        $(".configure-error-login").show();
    }
}


// -----------------------------------------------------------------------------
async function selectPhone() {
    const selectedPhone = $('#twilio_phone_number').val();
    console.log('selected twilio phone:', selectedPhone)
    return selectedPhone;

}


async function validateAdministratorPhone(field, value) {
    return fetch('/installer/validate-phone', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ADMINISTRATOR_PHONE: value})
    })
        .then((response) => {
            if (!response.ok) {
                $(".clone-for-" + field).find(".configure-error").text("'" + value + "' is not a valid E.164 number");
                $(".clone-for-" + field).find(".configure-error").show();
                throw Error();
            }
            return response;
        })
        .then((response) => response.json())
        .then((r) => {
            $("#" + field.toLowerCase()).val(r["phone"]);
            return true;
        })
        .catch((err) => {
            return false;
        });
}

/* --------------------------------------------------------------------------------
 * check deployment of Service (by uniqueName)
 * --------------------------------------------------------------------------------
 */
function checkApplication() {
    const THIS = checkApplication.name;
    try {
         fetch('/installer/check-application', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
           .then((response) => response.json())
           .then((response) => {
               console.log(THIS, 'server returned:', response);
               $('#service-deploy .button').removeClass('loading');
               $('.service-loader').hide();
               if (response.deploy_state === 'NOT-DEPLOYED') {
                   $('#service-deploy-button-text').text('Deploy Telehealth Application');
                   $('#service-deploy').show();
               } else if (response.deploy_state === 'DEPLOYED') {
                   $('#service-deploy-button-text').text('Re-deploy Telehealth Application');
                   $('#service-deploy').show();
                   $('#service-deploying').hide();
                   $('#service-deployed').show();
                   $('#service-open').attr('href', `https://www.twilio.com/console/functions/api/start/${response.service_sid}`);
               } else {
                   throw new Error(response);
               }
           });
    } catch (err) {
        console.log(THIS, err);
    }
}


/* --------------------------------------------------------------------------------
 * validates variable input values
 *
 * input:
 * global variableInput set in populate()
 *
 * returns:
 * variableInput adding 2 attributes
 * - value
 * - isValid
 * --------------------------------------------------------------------------------
 */
function validateInput() {
    $('.configure-error').text("");
    $('.configure-error').hide("");

    //console.log(THIS, Object.keys(variableInput));
    let hasValidationError = false;
    for (v of variableInput) {
        console.log(v);
        const inputValue = $(v.css_id).val();
        console.log('input is', inputValue);
        if (v.required && !inputValue) {
            $('.clone-for-' + v.key).find(".configure-error").text("This field is required");
            $('.clone-for-' + v.key).find(".configure-error").show();
            hasValidationError = true;
        }
        v['value'] = inputValue;
        v['isValid'] = ! hasValidationError;
    }

    return variableInput;
}


/* --------------------------------------------------------------------------------
 * check deployment of Service (by uniqueName)
 * --------------------------------------------------------------------------------
 */
function deployApplication(e) {
    const THIS = deployApplication.name;

    e.preventDefault();

    const input = validateInput();
    const validated = input.every(i => i.isValid);
    if (! validated) return;
    console.log(THIS, 'variable values validated');

    const configuration = {};
    for (i of input) {
        configuration[i.key] = i.value;
    }

    $('#service-deploy .button').addClass('loading');
    $('.service-loader.button-loader').show();

    fetch('/installer/deploy-application', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ configuration: configuration }),
    })
      .then(() => {
          $('#service-deploying').hide();
          console.log(THIS, 'successfully started deployment');
//          checkApplication();
      })
      .catch ((err) => {
          console.log(THIS, err);
          $('#service-deploy .button').removeClass('loading');
          $('.service-loader.button-loader').hide();
      });
}

