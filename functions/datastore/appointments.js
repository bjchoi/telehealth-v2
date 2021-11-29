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
const FHIR_APPOINTMENT = '/datastore/FHIR/Appointments.json';

const assert = require("assert");
const fs = require("fs");
const { getParam, fetchJsonAsset } = require(Runtime.getFunctions()['helpers'].path);

// --------------------------------------------------------------------------------
async function read_fhir(resourceType, simulate = true) {
  if (!simulate) throw new Error('live retrieval from EHR not implemented');

  const openFile = Runtime.getAssets()[resourceType].open;
  const bundle = JSON.parse(openFile());
  assert(bundle.total === bundle.entry.length, 'bundle checksum error!!!');

  return bundle.entry;
}

// --------------------------------------------------------------------------------
async function save_fhir(resourceType, resources, simulate = true) {
  if (!simulate) throw new Error('live saving to EHR not implemented');

  const bundle = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: resources.length,
    entry: resources,
  }
  await fs.writeFileSync(Runtime.getAssets()[resourceType].path, JSON.stringify(bundle));

  return true;
}

// --------------------------------------------------------------------------------
function transform_fhir_to_appointment(fhir_appointment) {
  const r = fhir_appointment;
  const appointment = {
    appointment_id: r.id,
    appointment_type: r.appointmentType.coding[0].code,
    appointment_start_datetime_utc: r.start,
    appointment_end_datetime_utc: r.end,
    appointment_reason: r.reasonCode.length === 1 ? r.reasonCode[0].text : null,
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
        const openFile = Runtime.getAssets()[PROTOTYPE].open;
        const prototype = JSON.parse(openFile());
        delete prototype.appointment_type;
        delete prototype.appointment_start_datetime_utc;
        delete prototype.appointment_end_datetime_utc;

        const usage = {
          action: 'valid values for appointments function',
          USAGE: {
            description: 'returns function signature, default action',
            parameters: {},
          },
          SCHEMA: {
            description: 'returns json schema for appointment',
            parameters: {},
          },
          PROTOTYPE: {
            description: 'returns prototype of appointment',
            parameters: {},
          },
          GET: {
            description: 'returns array of appointment',
            parameters: {
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
        const openFile = Runtime.getAssets()[SCHEMA].open;
        const schema = JSON.parse(openFile());
        return callback(null, schema);
      }
        break;

      case 'PROTOTYPE': {
        const openFile = Runtime.getAssets()[PROTOTYPE].open;
        const prototype = JSON.parse(openFile());
        return callback(null, prototype);
      }
        break;

      case 'GET': {
        const resources = await read_fhir(FHIR_APPOINTMENT);

        let by_patient = null;
        if (event.patient_id) {
          const pid = 'Patient/' + event.patient_id;
          by_patient = resources.filter(r => r.participant.find(e => e.actor.reference === pid));
        } else {
          by_patient = resources;
        }

        let by_provider = null;
        if (event.provider_id) {
          const pid = 'Practitioner/' + event.provider_id;
          by_provider = by_patient.filter(r => r.participant.find(e => e.actor.reference === pid));
        } else {
          by_provider = by_patient;
        }
        filtered = by_provider;

        const appointments = filtered.map(r => {
          return transform_fhir_to_appointment(r);
        });

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

      case 'GET': {
        const resources = await read_fhir(FHIR_APPOINTMENT);

        let filtered_resources = null;
        if (event.provider_id) {
          const pid = 'Practitioner/' + event.provider_id;
          filtered_resources = resources.filter(r => r.context.related.find(e => e.reference === (pid)));
        } else {
          filtered_resources = resources;
        }

        const appointments = filtered_resources.map(r => {
          return transform_fhir_to_appointment(r, event.provider_id);
        });

        console.log(THIS, `retrieved ${appointments.length} appointments for ${event.provider_id ? event.provider_id : " all providers"}`);
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

        appointment.appointment_type = 'WALKIN';
        const now = new Date();
        appointment.appointment_start_datetime_utc = now.toISOString();
        appointment.appointment_en_datetime_utc = new Date(now.getTime() + 1000*60*30).toISOString();

        const fhir_appointment = transform_appointment_to_fhir(appointment);

        const resources = await read_fhir(FHIR_APPOINTMENT);
        resources.push(fhir_appointment);

        save_fhir(FHIR_APPOINTMENT, resources);

        console.log(THIS, `added appointment ${appointment.appointment_id}`);
        return callback(null, { appointment_id : appointment.appointment_id });
      }
        break;

      case 'REMOVE': {
        assert(event.appointment_id, 'Mssing event.appointment_id!!!');

        const resources = await read_fhir(FHIR_APPOINTMENT);
        const remainder = resources.filter(r => r.id != event.appointment_id);
        save_fhir(FHIR_APPOINTMENT, remainder);

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

