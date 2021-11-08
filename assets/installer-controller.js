let accountName = null;
let configParams = null;

$(document).ready(function () {
    $("button.get-twilio-phone").click(function () {
        window.open("https://console.twilio.com/");
    })
    getAccountDetails();
    getEnvParams();

});

// -----------------------------------------------------------------------------
async function getEnvParams() {
    fetch('/installer/get-configuration-parameters', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            return response;
        })
        .then((response) => response.json())
        .then((r) => {
            configParams = r;
            addFields();
        })
        .catch((err) => console.log(err));
}

// -----------------------------------------------------------------------------
function addFields() {
    let fieldList = configParams['parsed']['variables'];
    var originalElement = $('div.clone-original')
    var formats = {
        "secret": "password",
        "phone_number": "text",
        "text": "text"
    }

    for (fieldKey in fieldList) {
        field = fieldList[fieldKey];
        if (field['key'] === "TWILIO_PHONE_NUMBER")
            continue;

        clonedElement = originalElement.clone().insertBefore(originalElement);
        clonedElement.removeClass("clone-original");
        clonedElement.addClass("clone-for-" + field["key"]);

        label = field["key"].toLowerCase().split('_').map(word => word[0].toUpperCase() + word.substr(1)).join(' ');
        (field['required'] === true) ? clonedElement.find('.star').show() : clonedElement.find('.star').hide();
        clonedElement.find(".configure-label").text(label);

        clonedElement.find('input').attr("id", field['key'].toLowerCase());
        clonedElement.find('input').attr("name", field['key'].toLowerCase());
        clonedElement.find('input').val(field['default'] == null ? '' : field['default']);
        // clonedElement.find('input').attr("placeholder", (field['default'] == null ? ' ' : field['default']));
        clonedElement.find('.tooltip').text(field['description']);
        clonedElement.find('input').attr("type", (formats.hasOwnProperty(field['format']) ? formats[field['format']] : "text"));

        if (field['configurable'] === true) {
            clonedElement.show();
        }
    }
    // delete the original div after cloning
    originalElement.remove();
}

// -----------------------------------------------------------------------------
async function getAccountDetails() {
    fetch('/installer/get-account-details', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                response.json().then(json => {
                    const messageTarget = $('.configure-error-login');
                    messageTarget.text("Could not login with the provided Twilio credentials.");
                    messageTarget.show();
                })
                throw Error(response.statusText)
            }

            return response;
        })
        .then((response) => response.json())
        .then((r) => {
            r = r.account_details;
            accountName = r.account_name;
            phonenumberList = r.phoneList;
            $('#account_name').val(accountName);
            populatePhoneNumbers(phonenumberList);
        })
        .catch((err) => {
            if (err.error.status === 401) {
                $(".configure-error-login").text("Your Twilio authentication failed. Please try again with correct credentials");
                $(".configure-error-login").show();
            }
        });
}

// -----------------------------------------------------------------------------
function populatePhoneNumbers(phonenumberList) {
    if (phonenumberList.length === 0)
        $(".configure-error-twilio-phone-number").show();
    phonenumberList.forEach(
        phone => {
            phoneComponents = phone.split(":");
            $('#twilio_phone_number').append('<option value="' + phoneComponents[0] + '">' + phoneComponents[1] + '</option>');
        }
    )
}

// -----------------------------------------------------------------------------
async function selectPhone() {
    const selectedPhone = $('#twilio_phone_number').val();
    return selectedPhone;

}

// ----------------------------------------------------------------------------
async function formSubmit(e) {
    e.preventDefault();

    $(".configure-error").text("");
    $(".configure-error").hide("");
    validationOk = true;

    let fieldList = configParams['parsed']['variables'];

    for (fieldKey in fieldList) {
        field = fieldList[fieldKey];

        if (field['key'] === "TWILIO_PHONE_NUMBER")
            continue;

        label = field["key"].toLowerCase().split('_').map(word => word[0].toUpperCase() + word.substr(1)).join(' ');
        value = $("#" + field['key'].toLowerCase()).val().trim();
        if (field['required'] === true && (value === undefined || value === "")) {
            $(".clone-for-" + field["key"]).find(".configure-error").text("This field is required");
            $(".clone-for-" + field["key"]).find(".configure-error").show();
            validationOk = false;
        }

        if (field['format'] === "phone_number" && value !== undefined && value !== "") {
            validPhone = await validateAdministratorPhone(field["key"], value);
            if (!validPhone){
                validationOk = false;
            }
        }
    }
    if (validationOk){
        displayFormFields();
    }
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


// --------------------------------------------------------------------
function displayFormFields() {
    let fieldList = configParams['parsed']['variables'];
    let formFieldObject = {};
    for (fieldKey in fieldList) {
        field = fieldList[fieldKey];

        if (field['key'] === "TWILIO_PHONE_NUMBER")
            selectPhone();

        id = "#" + field["key"].toLowerCase();
        formFieldObject[field['key']] = $.trim($(id).val());
    }
    console.log("Customer Input ", formFieldObject);
}

