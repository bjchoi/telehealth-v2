/*
 * main controller javascript used by administration.html
 *
 * references html css id in the administration.html
 */
const UI = {
  patients: '#patients',
  contents: '#contents',
  content_add: '#content-add',
  providers: '#providers',
  provider_selector: '#provider-selector',
  provider_contents: '#provider-contents',
  provider_patients: '#provider-patients'
}


// --------------------------------------------------------------------------------------------------------------
async function sendScheduledPatientLink(e) {
  const THIS = sendScheduledPatientLink.name;
  try {
    e.preventDefault();
    let s = 1;
    console.log(THIS, `${s++}. get patient/visit detail from server`);
    // ---------- TODO: fetch from server
    const patient_id = 'p1000000';
    const patient_name_text = 'BJ Choi';
    const patient_name_first = 'BJ';
    const appointment_id = 'v-doe-jonson-1121';
    // ----------

    console.log(THIS, `${s++}. get patient token from server`);
    const response0 = await fetch('/visit/patient-token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_identity: patient_id,
        visit_id: appointment_id,
        patient_name: patient_name_first,
      })
    });
    const payload = await response0.json();
    const patient_token = payload.token;

    console.log(THIS, `${s++}. send link to patient waiting room via SMS`);
    const link = `${location.origin}/patient/index.html?token=${patient_token}`
    $('#scheduled-patient-link').text(link);
    console.log(THIS, link);

    const response1 = await fetch('/send-sms', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to_phone: $('#phone-scheduled-patient').val(),
        body: `Dear ${patient_name_first}, please join your telehealth visit via ${link}`,
      })
    });

  } catch (err) {
    console.log(THIS, err);
  }
}

// --------------------------------------------------------------------------------------------------------------
function sendOnDemandPatientLink(e) {
  const THIS = sendOnDemandPatientLink.name;
  let i = 1;
  console.log(THIS, `${i++}. generate unique visitID`);
  console.log(THIS, `${i++}. send link to patient in-take via SMS`);
}

// --------------------------------------------------------------------------------------------------------------
function sendProviderLink(e) {
  const THIS = sendProviderLink.name;
  let i = 1;
  console.log(THIS, `${i++}. get provider detail from server`);
  console.log(THIS, `${i++}. get provider token from server`);
  console.log(THIS, `${i++}. send link to provider dashboard via SMS`);
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
      $(UI.contents).append(`<tr>
        <td><a class="button" onclick="removeContent('${row.content_id}');">Remove</a></td>
        <td id="#content-${row.content_id}" hidden>${row.content_id}</td>
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
  const content_title = $('#new-content-title').val();
  const content_video_url = $('#new-content-video-url').val();
  const description = $('#new-content-description').val();
  const content = JSON.stringify({
    content_id: content_id,
    content_title: content_title,
    content_video_url: content_video_url,
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
      $(UI.provider_contents).append(`<tr>
      <td><input type="radio" name="content-assignment "${is_assigned} id="${id}" onclick="assignContent2Provider('#${id}', '${row.content_id}');"></td>
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