/*
 * --------------------------------------------------------------------------------
 * manage patients including storage to EHR
 *
 * event parameters:
 * .action: USAGE|SCHEMA|PROTOTYPE|GET|ADD, default USAGE
 * --------------------------------------------------------------------------------
 */

const SCHEMA = '/datastore/patient-schema.json';
const PROTOTYPE = '/datastore/patient-prototype.json';
const FHIR_PATIENT = 'Patients';
const FHIR_MEDICATION_STATEMENT = 'MedicationStatements';
const FHIR_CONDITION = 'Conditions';

const assert = require("assert");
const { getParam, fetchPublicJsonAsset } = require(Runtime.getFunctions()['helpers'].path);
const { selectSyncDocument, upsertSyncDocument } = require(Runtime.getFunctions()['datastore/datastore-helpers'].path);

// --------------------------------------------------------------------------------
async function read_fhir(context, resourceType, simulate=true) {
  if (!simulate) throw new Error('live retrieval from EHR not implemented');
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

  const bundle = await selectSyncDocument(context, TWILIO_SYNC_SID, resourceType);
  assert(bundle.total === bundle.entry.length, 'bundle checksum error!!!');

  return bundle.entry;
}

// --------------------------------------------------------------------------------
async function save_fhir(context, resourceType, resources, simulate = true) {
  if (!simulate) throw new Error('live saving to EHR not implemented');
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

  const bundle = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: resources.length,
    entry: resources,
  }
  const document = await upsertSyncDocument(context, TWILIO_SYNC_SID, resourceType, bundle);

  return document ? document.sid : null;
}

// --------------------------------------------------------------------------------
function transform_fhir_to_patient(fhir_patient, fhir_medication_statements, fhir_conditions) {
  const r = fhir_patient;

  const pid = 'Patient/' + r.id;

  const patient = {
    patient_id: r.id,
    patient_name: r.name[0].text,
    patient_family_name: r.name[0].family,
    patient_given_name: r.name[0].given[0],
    patient_phone: r.telecom[0].value,
    patient_gender: r.gender.charAt(0).toUpperCase() + r.gender.slice(1),
    patient_language: r.communication[0].language.text,
    patient_medications: fhir_medication_statements
      .filter(e => e.subject.reference === pid)
      .map(m => m.medicationCodeableConcept.text),
    patient_conditions: fhir_conditions
      .filter(e => e.subject.reference === pid)
      .map(m => m.code.text)
  };

  return patient;
}

// --------------------------------------------------------------------------------
function transform_patient_to_fhir(patient) {
  const p = patient;
  const pid = 'Patient/' + p.patient_id;

  const fhir_patient = {
    resourceType: 'Patient',
    id: p.patient_id,
    name: [
      {
        use: 'official',
        text: p.patient_name,
        family: p.patient_family_name,
        given: [ p.patient_given_name ]
      }
    ],
    telecom: [
      {
        system: 'sms',
        value: p.patient_phone,
        use: 'mobile'
      },
      // ...(p.patient_email !== undefined
      //   && {
      //     system: 'email',
      //     value: p.patient_email,
      //     use: 'home'
      //   }
      // ),
    ],
    gender: p.patient_gender,
    communication: [
      {
        language: {
          text: p.patient_language
        },
        preferred: true
      }
    ]
  };

  const fhir_medication_statements = p.patient_medications.map(e => {
    return {
      resourceType: 'MedicationStatement',
      medicationCodeableConcept: {
        text: e
      },
      status: 'active',
      subject: {
        reference: pid
      }
    };
  });

  const fhir_conditions = p.patient_conditions.map(e => {
    return {
      resourceType: 'Condition',
      code: {
        text: e
      },
      subject: {
        reference: pid
      }
    };
  });

  console.log(fhir_patient);
  console.log(fhir_medication_statements);
  console.log(fhir_conditions);
  return {
    fhir_patient,
    fhir_medication_statements,
    fhir_conditions,
  }
}


// --------------------------------------------------------------------------------
exports.handler = async function(context, event, callback) {
  const THIS = 'patients:';
  console.time(THIS);

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
    const action = event.action ? event.action : 'USAGE'; // default action

    switch (action) {

      case 'USAGE': {
        const openFile = Runtime.getAssets()[PROTOTYPE].open;
        const prototype = JSON.parse(openFile());

        const usage = {
          action: 'valid values for patients function',
          USAGE: {
            description: 'returns function signature, default action',
            parameters: {},
          },
          SCHEMA: {
            description: 'returns json schema for patient',
            parameters: {},
          },
          PROTOTYPE: {
            description: 'returns prototype of patient',
            parameters: {},
          },
          GET: {
            description: 'returns array of patient',
            parameters: {
              patient_id: 'optional, filters for specified patient',
            },
          },
          ADD: {
            description: 'add a new patient',
            parameters: {
              patient: prototype,
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
        const resources = await read_fhir(context, FHIR_PATIENT);
        const medication_statements = await read_fhir(context, FHIR_MEDICATION_STATEMENT);
        const conditions = await read_fhir(context, FHIR_CONDITION);

        let filtered = null;
        if (event.patient_id)
          filtered = resources.filter(r => r.id === event.patient_id);
        else
          filtered = resources;

        const patients = filtered.map(r => {
          return transform_fhir_to_patient(r, medication_statements, conditions);
        });

        console.log(THIS, `retrieved ${patients.length} patients`);
        return callback(null, patients);
      }
        break;

      case 'ADD': {
        assert(event.patient, 'Mssing event.patient!!!');
        const patient = JSON.parse(event.patient);
        console.log(patient);
        assert(patient.patient_id, 'Mssing patient_id!!!');
        assert(patient.patient_name, 'Mssing patient_name!!!');
        assert(patient.patient_family_name, 'Mssing patient_family_name!!!');
        assert(patient.patient_given_name, 'Mssing patient_given_name!!!');
        assert(patient.patient_phone, 'Mssing patient_phone!!!');
        assert(patient.patient_gender, 'Mssing patient_gender!!!');
        assert(patient.patient_language, 'Mssing patient_language!!!');
        assert(patient.patient_medications, 'Mssing patient_medications!!!');
        assert(patient.patient_conditions, 'Mssing patient_conditions!!!');

        const added = transform_patient_to_fhir(patient);

        const current_patients = await read_fhir(context, FHIR_PATIENT);
        const current_medications = await read_fhir(context, FHIR_MEDICATION_STATEMENT);
        const current_conditions = await read_fhir(context, FHIR_CONDITION);

        new_patients = current_patients.concat(added.fhir_patient);
        new_medications = current_medications.concat(added.fhir_medication_statements);
        new_conditions = current_conditions.concat(added.fhir_conditions);

        await save_fhir(context, FHIR_PATIENT, new_patients);
        await save_fhir(context, FHIR_MEDICATION_STATEMENT, new_medications);
        await save_fhir(context, FHIR_CONDITION, new_conditions);

        console.log(THIS, `added content ${patient.patient_id}`);
        return callback(null, { patient_id : patient.patient_id });
      }
        break;

      case 'REMOVE': {
        assert(event.patient_id, 'Mssing event.patient_id!!!');

        const current_patients = await read_fhir(context, FHIR_PATIENT);
        const current_medications = await read_fhir(context, FHIR_MEDICATION_STATEMENT);
        const current_conditions = await read_fhir(context, FHIR_CONDITION);

        const pid = 'Patient/' + event.patient_id;
        const new_patients = current_patients.filter(r => r.id != event.patient_id);
        const new_medications = current_medications.filter(r => r.subject.reference != pid);
        const new_conditions = current_conditions.filter(r => r.subject.reference != pid);

        await save_fhir(context, FHIR_PATIENT, new_patients);
        await save_fhir(context, FHIR_MEDICATION_STATEMENT, new_medications);
        await save_fhir(context, FHIR_CONDITION, new_conditions);

        console.log(THIS, `removed patient ${event.patient_id}`);
        return callback(null, { patient_id : event.patient_id });
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
};
