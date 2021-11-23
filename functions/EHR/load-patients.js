/*
 * --------------------------------------------------------------------------------
 * load patients from EHR
 *
 * event parameters:
 * .generate_sample: if true, will return sample output
 *
 * returns: array of patient information
 * --------------------------------------------------------------------------------
 */

/* --------------------------------------------------------------------------------
 * read Practitioners from EHR
 *
 * execute search against EHR FHIR endpoint and returns transformed results
 *
 * parameter:
 * - simulate: true/false, default true
 *
 * returns: array of transformed object, see below for transformation
 * --------------------------------------------------------------------------------
 */
const fs = require("fs");

async function search_patients(simulate=true) {
  const fs = require('fs');

  if (simulate) {
    const path = Runtime.getAssets()['/EHR/Patients.json'].path;

    const payload = fs.readFileSync(path).toString('utf-8');
    const bundle = JSON.parse(payload);

    const transformed = bundle.entry.map((resource) => {
      return {
        patient_id: resource.id,
        patient_name: resource.name[0].text,
        patient_phone: resource.telecom[0].value,
        patient_gender: resource.gender.charAt(0).toUpperCase() + resource.gender.slice(1),
        patient_language: resource.communication[0].language.coding[0].display
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
 * read MedicationStatement from EHR
 *
 * execute search against EHR FHIR endpoint and returns transformed results
 *
 * parameter:
 * - simulate: true/false, default true
 *
 * returns: array of transformed object, see below for transformation
 * --------------------------------------------------------------------------------
 */
async function search_medication_statements(simulate=true) {
  const fs = require('fs');

  if (simulate) {
    const path = Runtime.getAssets()['/EHR/MedicationStatements.json'].path;

    const payload = fs.readFileSync(path).toString('utf-8');
    const bundle = JSON.parse(payload);

    const transformed = bundle.entry.map((resource) => {
      return {
        patient_id: resource.subject.reference.replace('Patient/', ''),
        patient_medication: resource.medicationCodeableConcept.text,
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
 * read Condition from EHR
 *
 * execute search against EHR FHIR endpoint and returns transformed results
 *
 * parameter:
 * - simulate: true/false, default true
 *
 * returns: array of
 * - patient_id:
 * - patient_condition:
 * --------------------------------------------------------------------------------
 */
async function search_conditions(simulate=true) {
  const fs = require('fs');

  if (simulate) {
    const path = Runtime.getAssets()['/EHR/Conditions.json'].path;

    const payload = fs.readFileSync(path).toString('utf-8');
    const bundle = JSON.parse(payload);

    const transformed = bundle.entry.map((resource) => {
      return {
        patient_id: resource.subject.reference.replace('Patient/', ''),
        patient_condition: resource.code.text,
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
  const THIS = 'load-patients:';
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
          patient_id: "<PatientID>",
          patient_name: "<PatientDisplayName>",
          patient_phone: "<PatientMobilePhone in E.164 format>",
          patient_gender: "<Male|Female|Other|Unknown>",
          patient_language: "<PatientPreferredLanguage>",
          patient_medication: [
            "<PatientMedication1>",
            "<PatientMedication2>",
          ],
          patinet_condition: [
            "<PatientCondition1>",
            "<PatientCondition2>",
          ]
        }
      ];
      return callback(null, sample);
    }

    const patient = await search_patients(simulate = true);
    //console.log(THIS, patient);
    console.log(THIS, `loaded ${patient.length} patients`);

    const medication = await search_medication_statements(simulate = true);
    const condition = await search_conditions(simulate = true);

    patient.forEach(p => {
      p.patient_medication = medication
        .filter(e => e.patient_id === p.patient_id)
        .map(m => m.patient_medication);
      p.patinet_condition = condition
        .filter(e => e.patient_id === p.patient_id)
        .map(m => m.patient_condition);
    });

    return callback(null, patient);

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
};
