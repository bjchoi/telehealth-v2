/*
 * main controller javascript used by administration.html
 */

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

function sendOnDemandPatientLink(e) {
  const THIS = sendOnDemandPatientLink.name;
  let i = 1;
  console.log(THIS, `${i++}. generate unique visitID`);
  console.log(THIS, `${i++}. send link to patient in-take via SMS`);
}

function sendProviderLink(e) {
  const THIS = sendProviderLink.name;
  let i = 1;
  console.log(THIS, `${i++}. get provider detail from server`);
  console.log(THIS, `${i++}. get provider token from server`);
  console.log(THIS, `${i++}. send link to provider dashboard via SMS`);
}

/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populatePatients(table_css_id) {
  const THIS = populatePatients.name;

  try {
    console.log(THIS, `load patients from server to ${table_css_id}`);

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

      patients.forEach(row => {
        $(table_css_id).append(`<tr>
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
 * content controller
 * --------------------------------------------------------------------------------------------------------------
 */
// class contentController {
//
//   construction(
//     main_table_css_id,
//     provider_table_css_id,
//     select_css_id) {
//       this.css_t0 = main_table_css_id;
//       this.css_t1 = provider_table_css_id;
//       this.css_s0 = provider_table_css_id;
//
// };


async function populateContents(table_css_id, css_t2,  select_css_id) {
  const THIS = populateContents.name;

  try {
    console.log(THIS, `load contents from server to ${table_css_id}`);

    $(table_css_id).find("tr:gt(0)").remove();
    $('#content-add').removeAttr('disabled'); // (re-)enable 'Add' button

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

    content.forEach(row => {
      console.log(`<tr>
        <td><a class="button" onclick="removeContent('${table_css_id}', '${css_t2}', '${select_css_id}', '${row.content_id}');">Remove</a></td>
        <td id="#content-${row.content_id}" hidden>${row.content_id}</td>
        <td>${row.content_title}</td>
        <td><a class="button" href="${row.content_video_url}" target="_blank">Watch Video</a></td>
        <td><small>${row.content_description}</small></td>
      </tr>`);
      $(table_css_id).append(`<tr>
        <td><a class="button" onclick="removeContent('${table_css_id}', '${css_t2}', '${select_css_id}', '${row.content_id}');">Remove</a></td>
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
async function addContent(table_css_id, css_t2, select_css_id) {
  const THIS = addContent.name;
  try {
    const content_id = 'dr' + new Date().getTime();
    console.log(THIS, table_css_id, content_id);
    console.log(THIS, `<tr>
      <td><a class="button" onclick="saveContent('${table_css_id}', '${css_t2}', '${select_css_id}', '${content_id}');">Save</a></td>
      <td><input type="text" name="content-title" id="new-content-title"></td>
      <td><input type="text" name="content-video-url" id="new-content-video-url"></td>
      <td><input type="text" name="content-description" id="new-content-description"></td>
    </tr>`);

    $(table_css_id).append(`<tr>
      <td><a class="button" onclick="saveContent('${table_css_id}', '${css_t2}', '${select_css_id}', '${content_id}');">Save</a></td>
      <td><input type="text" name="content-title" id="new-content-title"></td>
      <td><input type="text" name="content-video-url" id="new-content-video-url"></td>
      <td><input type="text" name="content-description" id="new-content-description"></td>
    </tr>`);

    $('#content-add').attr('disabled', 'disabled');    // disable 'Add' button

  } catch (err) {
    console.log(THIS, err);
  }
}

// --------------------------------------------------------------------------------------------------------------
async function saveContent(table_css_id, css_t2, select_css_id, content_id) {
  const THIS = saveContent.name;

  console.log(THIS, table_css_id, content_id);
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
      populateContents(table_css_id, css_t2, select_css_id);
      populateProviderContents(css_t2, select_css_id);
    })
    .catch((err) => {
      console.log(THIS, err);
      throw Error(err);
    });
}

// --------------------------------------------------------------------------------------------------------------
async function removeContent(table_css_id, css_t2, select_css_id, content_id) {
  const THIS = removeContent.name;

  console.log(THIS, table_css_id, content_id);

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
      populateContents(table_css_id, css_t2, select_css_id);
      populateProviderContents(css_t2, select_css_id);
    })
    .catch((err) => {
      console.log(THIS, err);
      throw Error(err);
    });
}

/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateProviders(table_css_id) {
  const THIS = populateProviders.name;

  try {
    console.log(THIS, `load providers from server to ${table_css_id}`);

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

    providers.forEach(row => {
      $(table_css_id).append(`<tr>
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
async function populateProviderSelector(select_css_id) {
  const THIS = populateProviderSelector.name;

  try {
    console.log(THIS, `load providers from server to ${select_css_id}`);

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

    providers.forEach(row => {
      $(select_css_id).append(`<option value="${row.provider_id}">${row.provider_name}</option>`);
    });

  } catch (err) {
    console.log(THIS, err);
  }
}

// --------------------------------------------------------------------------------------------------------------
async function selectProvider(select_css_id) {
  const THIS = selectProvider.name;

  const provider_id = $(select_css_id).val();
  console.log(THIS, `select provider: ${provider_id}`);
}


/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateProviderContents(table_css_id, select_css_id) {
  const THIS = populateProviderContents.name;

  try {
    const provider_id = $(select_css_id).val();
    console.log(THIS, `load contents for ${provider_id}`);

    $(table_css_id).find("tr:gt(0)").remove();

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
      $(table_css_id).append(`<tr>
      <td><input type="checkbox" ${is_assigned} onclick="assignContent2Provider('${table_css_id}', '${select_css_id}', '${row.content_id}');"></td>
      <td>${row.content_title}</td>
      <td><a class="button" href="${row.content_video_url}" target="_blank">Watch Video</a></td>
      </tr>`);
    });

  } catch (err) {
    console.log(THIS, err);
  }
}


async function assignContent2Provider(table_css_id, select_css_id, content_id) {
  const THIS = assignContent2Provider.name;

  const provider_id = $(select_css_id).val();

  console.log(THIS, `assigned ${content_id} to ${provider_id}`);
}


/* --------------------------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------------------------
 */
async function populateProviderPatientQueue(table_css_id, select_css_id) {
  const THIS = populateProviderPatientQueue.name;

  try {
    const provider_id = $(select_css_id).val();
    console.log(THIS, `load patient queue for provider ${table_css_id}`);

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
      $(table_css_id).append(`<tr>
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

  await populatePatients(table_css_id = '#patients');
  await populateContents( '#contents', '#provider-content', '#provider-selector');
  await populateProviders(table_css_id = '#providers');
  await populateProviderSelector(select_css_id = '#provider-selector');
  await populateProviderContents(table_css_id = '#provider-content', select_css_id = '#provider-selector')
  await populateProviderPatientQueue(table_css_id = '#provider-patient-queue', select_css_id = '#provider-selector')
}