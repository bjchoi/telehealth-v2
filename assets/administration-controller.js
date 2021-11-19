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

