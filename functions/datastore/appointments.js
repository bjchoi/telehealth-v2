/*
 * --------------------------------------------------------------------------------
 * manage appointments including storage to EHR
 *
 * event parameters:
 * .action: USAGE|SCHEMA|PROTOTYPE|GET|GET-PATIENTS|ADD, default USAGE
 * --------------------------------------------------------------------------------
 */

const SCHEMA = '/datastore/appointment-schema.json';
const PROTOTYPE = '/datastore/appointment-prototype.json';
const FHIR_APPOINTMENT = 'Appointments';

const assert = require("assert");
const { getParam } = require(Runtime.getFunctions()['helpers'].path);
const { read_fhir, save_fhir, fetchPublicJsonAsset } = require(Runtime.getFunctions()['datastore/datastore-helpers'].path);

// --------------------------------------------------------------------------------
function transform_fhir_to_appointment(fhir_appointment) {
  const r = fhir_appointment;
  const appointment = {
    appointment_id: r.id,
    appointment_type: r.appointmentType.coding[0].code,
    appointment_start_datetime_utc: r.start,
    appointment_end_datetime_utc: r.end,
    ...(r.reasonCode.length === 1 && { appointment_reason: r.reasonCode[0].text }),
    appointment_references: r.supportingInformation.map(r => r.reference),
    patient_id: r.participant.find(e => e.actor.reference.startsWith('Patient/'))
      .actor.reference.replace('Patient/', ''),
    provider_id: r.participant.find(e => e.actor.reference.startsWith('Practitioner/'))
      .actor.reference.replace('Practitioner/', ''),
  };
  return appointment;
}

// --------------------------------------------------------------------------------
function transform_appointment_to_fhir(appointment) {
  const a = appointment;
  const fhir_appointment = {
    resourceType: 'Appointment',
    id: a.appointment_id,
    status: (a.appointment_type === 'WALKIN') ? 'arrived' : 'booked',
    appoinmentType: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v2-0276',
          code: a.appointment_type,
        }
      ]
    },
    reasonCode: [
      {
        text: a.appointment_reason,
      }
    ],
    start: a.appointment_start_datetime_utc,
    end: a.appointment_end_datetime_utc,
    participant: [
      {
        actor: {
          reference: 'Patient/' + a.patient_id
        }
      },
      {
        type: [
          {
            coding: [
              {
                system: 'http://hl7.org/fhir/ValueSet/encounter-participant-type',
                code: 'ATND,'
              }
            ]
          }
        ],
        actor: {
          reference: 'Practitioner/' + a.provider_id
        }
      }
    ],
  };
  return fhir_appointment;
}


// --------------------------------------------------------------------------------
exports.handler = async function(context, event, callback) {
  const THIS = 'appointments:';
  console.time(THIS);

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
    const action = event.action ? event.action : 'USAGE'; // default action

    switch (action) {

      case 'USAGE': {
        // json prototype for ADD
        const prototype = await fetchPublicJsonAsset(context, PROTOTYPE);
        delete prototype.appointment_type;
        delete prototype.appointment_start_datetime_utc;
        delete prototype.appointment_end_datetime_utc;

        const usage = {
          action: 'usage for appointments function',
          USAGE: {
            description: 'returns function signature, default action',
            parameters: {},
          },
          SCHEMA: {
            description: 'returns json schema for appointment in telehealth',
            parameters: {},
          },
          PROTOTYPE: {
            description: 'returns prototype of appointment in telehealth',
            parameters: {},
          },
          GET: {
            description: 'returns array of appointment',
            parameters: {
              appointment_id: 'optional, filters for specified appointment. will return zero or one',
              patient_id: 'optional, filters for specified patient',
              provider_id: 'optional, filters for specified provider',
            }
          },
          ADD: {
            description: 'add a new appointment',
            parameters: {
              appointment: prototype,
            },
          },
        };

        return callback(null, usage);
      }
      break;

      case 'SCHEMA': {
        const schema = await fetchPublicJsonAsset(context, SCHEMA);
        return callback(null, schema);
      }
        break;

      case 'PROTOTYPE': {
        const prototype = await fetchPublicJsonAsset(context, PROTOTYPE);
        return callback(null, prototype);
      }
        break;

      case 'GET': {
        const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

        let resources = await read_fhir(context, TWILIO_SYNC_SID, FHIR_APPOINTMENT);

        resources = event.appointment_id
          ? resources.filter(r => r.id === event.appointment_id)
          : resources;

        resources = event.patient_id
          ? resources.filter(r => r.participant.find(e => e.actor.reference === ('Patient/' + event.patient_id)))
          : resources;

        resources = event.provider_id
          ? resources.filter(r => r.participant.find(e => e.actor.reference === ('Practitioner/' + event.provider_id)))
          : resources;

        const appointments = resources.map(r => transform_fhir_to_appointment(r));

        console.log(THIS, `retrieved ${appointments.length} appointments for ${event.provider_id ? event.provider_id : " all providers"}`);

        // rebase time
        const base_ts = new Date(await getParam(context, 'SERVER_START_TIMESTAMP'));
        console.log(THIS, 'base datetime_utc:', base_ts);

        const first_appointment_ts = new Date(appointments[0].appointment_start_datetime_utc);
        console.log(THIS, 'first appointment datetime_utc:', first_appointment_ts);

        const diff = base_ts.getTime() - first_appointment_ts.getTime();
        appointments.forEach(a => {
          const start_ts = new Date(a.appointment_start_datetime_utc);
          const end_ts   = new Date(a.appointment_end_datetime_utc);
          a.appointment_start_datetime_utc = new Date(start_ts.getTime() + diff).toISOString();
          a.appointment_end_datetime_utc   = new Date(end_ts.getTime() + diff).toISOString();
        });

        return callback(null, appointments);
      }
        break;

      case 'ADD': {
        assert(event.appointment, 'Mssing event.appointment!!!');
        const appointment = JSON.parse(event.appointment);
        assert(appointment.appointment_id, 'Mssing appointment_id!!!');
        assert(appointment.appointment_reason, 'Mssing appointment_reason!!!');
        assert(appointment.appointment_references, 'Mssing appointment_references!!!');
        assert(appointment.patient_id, 'Mssing patient_id!!!');
        assert(appointment.provider_id, 'Mssing provider_id!!!');
        const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

        appointment.appointment_type = 'WALKIN';
        const now = new Date();
        appointment.appointment_start_datetime_utc = now.toISOString();
        appointment.appointment_en_datetime_utc = new Date(now.getTime() + 1000*60*30).toISOString();

        const fhir_appointment = transform_appointment_to_fhir(appointment);

        const resources = await read_fhir(context, TWILIO_SYNC_SID, FHIR_APPOINTMENT);
        resources.push(fhir_appointment);

        await save_fhir(context, TWILIO_SYNC_SID, FHIR_APPOINTMENT, resources);

        console.log(THIS, `added appointment ${appointment.appointment_id}`);
        return callback(null, { appointment_id : appointment.appointment_id });
      }
        break;

      case 'REMOVE': {
        assert(event.appointment_id, 'Mssing event.appointment_id!!!');
        const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

        const resources = await read_fhir(context, TWILIO_SYNC_SID, FHIR_APPOINTMENT);
        const remainder = resources.filter(r => r.id !== event.appointment_id);
        await save_fhir(context, TWILIO_SYNC_SID, FHIR_APPOINTMENT, remainder);

        console.log(THIS, `removed appointment ${event.appointment_id}`);
        return callback(null, { appointment_id : event.appointment_id });
      }
        break;

      default: // unknown action
        throw Error(`Unknown action: ${action}!!!`);
    }

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
}
