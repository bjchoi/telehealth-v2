/*
 * --------------------------------------------------------------------------------
 * load practitioners from EHR
 *
 * event parameters:
 * .generate_sample: if true, will return sample output
 *
 * returns: array of practitioner information
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
async function search_practitioners(simulate=true) {
  const fs = require('fs');

  if (simulate) {
    const path = Runtime.getAssets()['/EHR/Practitioners.json'].path;

    const payload = fs.readFileSync(path).toString('utf-8');
    const bundle = JSON.parse(payload);

    const transformed = bundle.entry.map((resource) => {
      return {
        practitioner_id: resource.id,
        practitioner_name: resource.name[0].text,
        practitioner_phone: resource.telecom[0].value,
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
 * read PractitionerRoles from EHR
 *
 * execute search against EHR FHIR endpoint and returns transformed results
 *
 * parameter:
 * - simulate: true/false, default true
 *
 * returns: array of transformed object, see below for transformation
 * --------------------------------------------------------------------------------
 */
async function search_practitioner_roles(simulate=true) {
  const fs = require('fs');

  if (simulate) {
    const path = Runtime.getAssets()['/EHR/PractitionerRoles.json'].path;

    const payload = fs.readFileSync(path).toString('utf-8');
    const bundle = JSON.parse(payload);

    const transformed = bundle.entry.map((resource) => {
      return {
        practitioner_id: resource.practitioner.reference.replace('Practitioner/', ''),
        practitioner_role: resource.code[0].text,
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
  const THIS = 'load-practitioners:';
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
          practitioner_id: "<PractitionerID>",
          practitioner_name: "<PractitionerDisplayName>",
          practitioner_phone: "<PractitionerMobilePhone in E.164 format>",
          practitioner_on_call: "<PractitionerOnCallForOnDemandAppointment>",
        }
      ];
      return callback(null, sample);
    }

    const practitioner = await search_practitioners(simulate = true);
    //console.log(THIS, practitioner);
    console.log(THIS, `loaded ${practitioner.length} practitioners`);

    const role = await search_practitioner_roles(simulate = true);
    //console.log(role);
    if (role.length === 1) {
      const match = practitioner.find(p => p.practitioner_id === role[0].practitioner_id);
      if (match) {
        console.log(THIS, `found on-call practitioner: ${match.practitioner_id}`);
        match.practitioner_on_call = true;
      }
    } else {
      console.log(THIS, `no on-call practitioner set!`);
    }

    return callback(null, practitioner);

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
};
