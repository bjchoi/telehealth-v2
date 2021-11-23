/*
 * --------------------------------------------------------------------------------
 * load scheduled appointment for today (localtime) from EHR
 *
 * event parameters:
 * .generate_sample: if true, will return sample output
 *
 * returns: array of today's appointment information
 * --------------------------------------------------------------------------------
 */

/* --------------------------------------------------------------------------------
 * read Appointment from EHR
 *
 * execute search against EHR FHIR endpoint and returns transformed results
 *
 * parameter:
 * - simulate: true/false, default true
 *
 * returns: array of transformed object, see below for transformation
 * --------------------------------------------------------------------------------
 */
async function search_appointments(simulate=true) {
  const fs = require('fs');

  if (simulate) {
    const path = Runtime.getAssets()['/EHR/Appointments.json'].path;

    const payload = fs.readFileSync(path).toString('utf-8');
    const bundle = JSON.parse(payload);

    const transformed = bundle.entry.map((resource) => {
      return {
        appointment_id: resource.id,
        appointment_start_datetime_utc: resource.start,
        appointment_end_datetime_utc: resource.end,
        appointment_reason: resource.reasonCode.length === 1 ? resource.reasonCode[0].text : '',
        appointment_references: resource.supportingInformation.map(r => r.reference),
        patient_id: resource.participant.find(e => e.actor.reference.startsWith('Patient/'))
          .actor.reference.replace('Patient/', ''),
        practitioner_id: resource.participant.find(e => e.actor.reference.startsWith('Practitioner/'))
          .actor.reference.replace('Practitioner/', ''),
      };
    });

    return transformed;
  }
  else
  {
    throw new Error('live GET from EHR not implemented');
  }
}


/* --------------------------------------------------------------------------------
 * handler
 * --------------------------------------------------------------------------------
 */
exports.handler = async function(context, event, callback) {
  const THIS = 'load-appointments:';
  console.time(THIS);

  const assert = require('assert');
  const { getParam } = require(Runtime.getFunctions()['helpers'].path);
  const { isValidAppToken } = require(Runtime.getFunctions()["authentication-helper"].path);

  /* Following code checks that a valid token was sent with the API call */
  if (event.token && !isValidAppToken(event.token, context)) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    response.setStatusCode(401);
    response.setBody({message: 'Invalid or expired token'});
    return callback(null, response);
  }
  try {
    const client = context.getTwilioClient();

    if (event.generate_sample) {
      const sample = [
        {
          appointment_id: '<AppointmentID>',
          appointment_start_datetime_utc: '<Appointment start datetime YYYYMMDDThh:mm:ssZ>',
          appointment_end_datetime_utc: '<Appointment end datetime YYYYMMDDThh:mm:ssZ>',
          appointment_reason: '<AppointmentReasonDescription>',
          appointment_references: [
            '<AppointmentReferenceItem (e.g., image)>'
          ],
          patient_id: "<PatientID>",
          practitioner_id: "<PractitionerID>",
        }
      ];
      return callback(null, sample);
    }


    const appointment = await search_appointments(simulate = true);
    console.log(THIS, `loaded ${appointment.length} appointments`);

    // rebase time
    const base_ts = new Date(await getParam(context, 'SERVER_START_TIMESTAMP'));
    console.log(THIS, 'base datetime_utc:', base_ts);

    const first_appointment_ts = new Date(appointment[0].appointment_start_datetime_utc);
    console.log(THIS, 'first appointment datetime_utc:', first_appointment_ts);

    const diff = base_ts.getTime() - first_appointment_ts.getTime();
    appointment.forEach(a => {
      const start_ts = new Date(a.appointment_start_datetime_utc);
      const end_ts   = new Date(a.appointment_end_datetime_utc);
      a.appointment_start_datetime_utc = new Date(start_ts.getTime() + diff).toISOString();
      a.appointment_end_datetime_utc   = new Date(end_ts.getTime() + diff).toISOString();
    });

    return callback(null, appointment);

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
};
