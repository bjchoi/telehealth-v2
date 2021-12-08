/* --------------------------------------------------------------------------------------------------------------
 * main controller javascript used by administration.html
 *
 * references html css id in the administration.html
 * --------------------------------------------------------------------------------------------------------------
 */

// ---------- UI element css id list used by functions

const UI = {
  patients: '#patients',
  contents: '#contents',
  content_add: '#content-add',
  new_content_title: '#new-content-title',
  new_content_video_url: '#new-content-video-url',
  new_content_description: '#new-content-description',
  providers: '#providers',
  provider_selector: '#provider-selector',
  provider_contents: '#provider-contents',
  provider_patients: '#provider-patients',
  provider_link: '#provider-link',
  provider_phone: '#provider-phone',
  scheduled_patient_link: '#scheduled-patient-link',
  scheduled_patient_phone: '#scheduled-patient-phone',
  ondemand_patient_link: '#ondemand-patient-link',
  ondemand_patient_phone: '#ondemand-patient-phone',
}


/* --------------------------------------------------------------------------------------------------------------
 * send scheduled patient link
 *
 * input:
 * . UI.scheduled_patient_phone
 * . UI.scheduled_patient_link
 *
 * output:
 * --------------------------------------------------------------------------------------------------------------
 */
async function sendScheduledPatientLink(e) {
  const THIS = sendScheduledPatientLink.name;
  try {
    e.preventDefault();
    const patient_phone = $(UI.scheduled_patient_phone).val();
    const digits = patient_phone.match(/\d+/g) ? patient_phone.match(/\d+/g).join('').length : 0;
    if (!patient_phone || digits < 10) {
      alert('Please enter a valid US phone number including area code!');
      return;
    }

    console.log(THIS, `get appointment details from server`);
    appointment_details = await fetchNextProviderAppointment();

    console.log(THIS, `get patient token from server`);
    const response0 = await fetch('/visit/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'PATIENT',
        id: appointment_details.patient.patient_id,
        visitId: 'v-doe-jonson-1121', // appointment_id, TODO: remove hard-coding once integrated
      }),
    });
    const payload = await response0.json();

    console.log(THIS, `send link to patient via SMS`);
    const url = `${location.origin}/patient/index.html?token=${payload.passcode}`
    $(UI.scheduled_patient_link).text(url);
    $(UI.scheduled_patient_link).attr('href', url);

    const response1 = await fetch('/send-sms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_phone: patient_phone,
        body: `Dear ${appointment_details.patient.patient_given_name}, please join your telehealth appointment via ${url}`,
      })
    });

  } catch (err) {
    console.log(THIS, err);
  }
}


/* --------------------------------------------------------------------------------------------------------------
 * send on-demand patient link
 *
 * input:
 * . UI.ondemand_patient_phone
 * . UI.ondemand_patient_link
 *
 * output:
 * --------------------------------------------------------------------------------------------------------------
 */
async function sendOnDemandPatientLink(e) {
  const THIS = sendOnDemandPatientLink.name;
  try {
    e.preventDefault();
    const patient_phone = $(UI.ondemand_patient_phone).val();
    const digits = patient_phone.match(/\d+/g) ? patient_phone.match(/\d+/g).join('').length : 0;
    if (!patient_phone || digits < 10) {
      alert('Please enter a valid US phone number including area code!');
      return;
    }

    console.log(THIS, `send link to patient via SMS`);
    const url = `${location.origin}/patient/ondemand/index.html`
    $(UI.ondemand_patient_link).text(url);
    $(UI.ondemand_patient_link).attr('href', url);

    const response1 = await fetch('/send-sms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_phone: patient_phone,
        body: `Please start your on-demand telehealth appointment via ${url}`,
      })
    });

  } catch (err) {
    console.log(THIS, err);
  }
}


/* --------------------------------------------------------------------------------------------------------------
 * send provider link
 *
 * input:
 * . UI.provider_phone
 * . UI.provider_link
 *
 * output:
 * --------------------------------------------------------------------------------------------------------------
 */
async function sendProviderLink(e) {
  const THIS = sendProviderLink.name;
  try {
    e.preventDefault();
    const provider_phone = $(UI.provider_phone).val();
    const digits = provider_phone.match(/\d+/g) ? provider_phone.match(/\d+/g).join('').length : 0;
    if (!provider_phone || digits < 10) {
      alert('Please enter a valid US phone number including area code!');
      return;
    }

    console.log(THIS, `get provider details from server`);
    provider = await fetchSelectedProvider();

    console.log(THIS, `get provider token from server`);
    const response0 = await fetch('/visit/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'PROVIDER',
        id: provider.provider_id,
      }),
    });
    const payload = await response0.json();

    console.log(THIS, `send link to provder via SMS`);
    const url = `${location.origin}/provider/index.html?token=${payload.passcode}`
    $(UI.provider_link).text(url);
    $(UI.provider_link).attr('href', url);

    const response1 = await fetch('/send-sms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_phone: provider_phone,
        body: `Dear ${provider.provider_name}, please join your telehealth dashboard via ${url}`,
      })
    });

  } catch (err) {
    console.log(THIS, err);
  }
}

/* --------------------------------------------------------------------------------------------------------------
 * patients
 * --------------------------------------------------------------------------------------------------------------
 */
async function populatePatients() {
  const THIS = populatePatients.name;

  try {
    {
      const parameters = new URLSearchParams({
        action: 'GET',
      });
      const response = await fetch(
        '/datastore/patients?' + parameters,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
      const patients = await response.json();
      console.log(THIS, `loaded ${patients.length} patients`);

      patients.forEach(row => {
        $(UI.patients).append(`<tr>
        <td>${row.patient_id}</td>
        <td>${row.patient_name}</td>
        <td>${row.patient_phone}</td>
      </tr>`);
      });
    }
  } catch (err) {
    console.log(THIS, err);
  }
}


/* --------------------------------------------------------------------------------------------------------------
 * contents
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateContents() {
  const THIS = populateContents.name;

  try {
    $(UI.contents).find("tr:gt(0)").remove();
    $(UI.content_add).removeAttr('disabled'); // (re-)enable 'Add' button

    const parameters =  new URLSearchParams({
      action: 'GET',
    });
    const response = await fetch(
      '/datastore/contents?' + parameters,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
    const content = await response.json();
    console.log(THIS, `loaded ${contents.length} contents`);

    content.forEach(row => {
      const content_css_id = `#content-${row.content_id}`;
      $(UI.contents).append(`<tr>
        <td><a class="button" onclick="removeContent('${row.content_id}');">Remove</a></td>
        <td id="${content_css_id}" hidden>${row.content_id}</td>
        <td>${row.content_title}</td>
        <td><a class="button" href="${row.content_video_url}" target="_blank">Watch Video</a></td>
        <td><small>${row.content_description}</small></td>
      </tr>`);
    });

  } catch (err) {
    console.log(THIS, err);
  }
}

// --------------------------------------------------------------------------------------------------------------
async function addContent() {
  const THIS = addContent.name;
  try {
    const content_id = 'dr' + new Date().getTime();
    console.log(THIS, `contentid: ${content_id}`);

    $(UI.contents).append(`<tr>
      <td><a class="button" onclick="saveContent('${content_id}');">Save</a></td>
      <td><input type="text" name="content-title" id="new-content-title"></td>
      <td><input type="text" name="content-video-url" id="new-content-video-url"></td>
      <td><input type="text" name="content-description" id="new-content-description"></td>
    </tr>`);

    $(UI.content_add).attr('disabled', 'disabled');    // disable 'Add' button

  } catch (err) {
    console.log(THIS, err);
  }
}

// --------------------------------------------------------------------------------------------------------------
async function saveContent(content_id) {
  const THIS = saveContent.name;

  console.log(THIS, 'content_id: ', content_id);
  const title = $(UI.new_content_title).val();
  const video_url = $(UI.new_content_video_url).val();
  const description = $(UI.new_content_description).val();
  const content = JSON.stringify({
    content_id: content_id,
    content_title: title,
    content_video_url: video_url,
    content_description: description,
  });
  console.log(THIS, content);

  fetch('/datastore/contents', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'ADD',
      content: content,
    })
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(THIS, result);
      populateContents();
      populateProviderContents();
    })
    .catch((err) => {
      console.log(THIS, err);
      throw Error(err);
    });
}

// --------------------------------------------------------------------------------------------------------------
async function removeContent(content_id) {
  const THIS = removeContent.name;

  console.log(THIS, 'content_id: ', content_id);

  fetch('/datastore/contents', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'REMOVE',
      content_id: content_id,
    })
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(THIS, result);
      populateContents();
      populateProviderContents();
    })
    .catch((err) => {
      console.log(THIS, err);
      throw Error(err);
    });
}

/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateProviders() {
  const THIS = populateProviders.name;

  try {
    const parameters = new URLSearchParams({
      action: 'GET',
    });
    const response = await fetch(
      '/datastore/providers?' + parameters,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
    const providers = await response.json();
    console.log(THIS, `loaded ${providers.length} providers`);

    providers.forEach(row => {
      $(UI.providers).append(`<tr>
      <td><input type="checkbox" ${row.provider_on_call ? "checked": ""} disabled></td>
      <td>${row.provider_id}</td>
      <td>${row.provider_name}</td>
      <td>${row.provider_phone}</td>
    </tr>`);
    });

  } catch (err) {
    console.log(THIS, err);
  }
}

/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateProviderSelector() {
  const THIS = populateProviderSelector.name;

  try {
    const parameters = new URLSearchParams({
      action: 'GET',
    });
    const response = await fetch(
      '/datastore/providers?' + parameters,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
    const providers = await response.json();
    console.log(THIS, `loaded ${providers.length} providers`);

    providers.forEach(row => {
      $(UI.provider_selector).append(`<option value="${row.provider_id}">${row.provider_name}</option>`);
    });

  } catch (err) {
    console.log(THIS, err);
  }
}

// --------------------------------------------------------------------------------------------------------------
async function selectProvider() {
  const THIS = selectProvider.name;

  const provider_id = $(UI.provider_selector).val();
  console.log(THIS, `select provider: ${provider_id}`);

  populateProviderContents();
  populateProviderPatients();
}


/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateProviderContents() {
  const THIS = populateProviderContents.name;

  $(UI.provider_contents).find("tr:gt(0)").remove();

  try {
    const provider_id = $(UI.provider_selector).val();
    console.log(THIS, `load contents for ${provider_id}`);

    const parameters = new URLSearchParams({
      action: 'GET',
    });
    const response = await fetch(
      '/datastore/contents?' + parameters,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      });
    const contents = await response.json();

    contents.forEach(row => {
      const is_assigned = row.providers.find(e => e === provider_id) ? 'checked' : '';
      const id = row.content_id + '-assigned';
      const css_id = `#selected-${id}`;
      $(UI.provider_contents).append(`<tr>
      <td><input type="radio" name="content-assignment "${is_assigned} id="${id}" onclick="assignContent2Provider('${css_id}', '${row.content_id}');"></td>
      <td>${row.content_title}</td>
      <td><a class="button" href="${row.content_video_url}" target="_blank">Watch Video</a></td>
      </tr>`);
    });

  } catch (err) {
    console.log(THIS, err);
  }
}


// --------------------------------------------------------------------------------------------------------------
async function assignContent2Provider(css_id, content_id) {
  const THIS = assignContent2Provider.name;

  const is_checked = $(css_id).is(':checked'); // $(css_id).prop('checked');
  const provider_id = $(UI.provider_selector).val();

  fetch('/datastore/contents', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: is_checked ? 'ASSIGN' : 'UNASSIGN',
      content_id: content_id,
      provider_id: provider_id,
    })
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(THIS, result);
      populateProviderContents();
    })
    .catch((err) => {
      console.log(THIS, err);
      throw Error(err);
    });

  if (is_checked) {
    console.log(THIS, `assigned ${content_id} to ${provider_id}`);
  } else {
    console.log(THIS, `unassigned ${content_id} to ${provider_id}`);
  }
}


/* --------------------------------------------------------------------------------------------------------------\
 * fetch next appointment details for selected provider
 *
 * input:
 * . UI.provider_selector
 *
 * output:
 * . appointment object
 * . patient object
 * . provider object
 * --------------------------------------------------------------------------------------------------------------
 */
async function fetchNextProviderAppointment() {
  const THIS =  fetchNextProviderAppointment.name;

  try {

    const output = {
      appointment: null,
      patient: null,
      provider: null,
    };

    const provider_id = $(UI.provider_selector).val();
    {
      const parameters = new URLSearchParams({
        action: 'GET',
        provider_id: provider_id,
      });
      const response = await fetch(
        '/datastore/appointments?' + parameters,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
      const appointments = await response.json();

      if (appointments.length > 0) {
        output.appointment = appointments[0];
      } else {
        console.log(THIS, `No appointment found for provider: ${provider_id}. returning...`);
        return output;
      }
    }

    {
      const parameters = new URLSearchParams({
        action: 'GET',
        patient_id: output.appointment.patient_id,
      });
      const response = await fetch(
        '/datastore/patients?' + parameters,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
      const patients = await response.json();

      if (patients.length > 0) {
        output.patient = patients[0];
      } else {
        console.log(THIS, `No appointment patient: ${output.appointment.patient_id}. returning...`);
        return output;
      }
    }

    {
      const parameters = new URLSearchParams({
        action: 'GET',
        provider_id: output.appointment.provider_id,
      });
      const response = await fetch(
        '/datastore/providers?' + parameters,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
      const providers = await response.json();

      if (providers.length > 0) {
        output.provider = providers[0];
      } else {
        console.log(THIS, `No appointment provider: ${output.appointment.provider_id}. returning...`);
        return output;
      }
    }

    console.log(THIS, `'found valid appointment: ${output.appointment.appointment_id}`);
    return output;

  } catch (err) {
    console.log(THIS, err);
  }
}

/* --------------------------------------------------------------------------------------------------------------\
 * fetch provider details for selected provider
 *
 * input:
 * . UI.provider_selector
 *
 * output:
 * . provider object
 * --------------------------------------------------------------------------------------------------------------
 */
async function fetchSelectedProvider() {
  const THIS =  fetchSelectedProvider.name;

  try {

    const provider_id = $(UI.provider_selector).val();
    let output = null;
    {
      const parameters = new URLSearchParams({
        action: 'GET',
        provider_id: provider_id,
      });
      const response = await fetch(
        '/datastore/providers?' + parameters,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
      const providers = await response.json();

      if (providers.length > 0) {
        output = providers[0];
      } else {
        console.log(THIS, `No provider: ${provider_id}. returning...`);
        return output;
      }
    }

    console.log(THIS, `'found provider: ${provider_id}`);
    return output;

  } catch (err) {
    console.log(THIS, err);
  }
}


/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateProviderPatients() {
  const THIS =  populateProviderPatients.name;

  $(UI.provider_patients).find("tr:gt(0)").remove();

  try {
    const provider_id = $(UI.provider_selector).val();

    let appointments = null;
    {
      const parameters = new URLSearchParams({
        action: 'GET',
        provider_id: provider_id,
      });
      const response = await fetch(
        '/datastore/appointments?' + parameters,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
      appointments = await response.json();
    }
    console.log(THIS, 'appointments:', appointments.length);

    let patients = null;
    {
      const parameters = new URLSearchParams({
        action: 'GET',
      });
      const response = await fetch(
        '/datastore/patients?' + parameters,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
        });
      patients = await response.json();
    }
    console.log(THIS, 'patients', patients.length);

    appointments.forEach(row => {
      const p = patients.find(e => e.patient_id === row.patient_id);
      $(UI.provider_patients).append(`<tr>
      <td>${row.appointment_type}</td>
      <td>${row.appointment_id}</td>
      <td>${p.patient_name}</td>
      <td>${row.appointment_start_datetime_utc}</td>
    </tr>`);
    });

  } catch (err) {
    console.log(THIS, err);
  }
}

/*
 * this function will be called from authentication-controller.js upon successful authentication
 */
async function initialize() {
  console.log('initialize function in administration-controller.js');

  populatePatients();
  populateContents();
  populateProviders();

  // provider selector needs to be populated first
  await populateProviderSelector();

  populateProviderContents();
  populateProviderPatients();
}