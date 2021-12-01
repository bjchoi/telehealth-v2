/**
 * Generates Patient/Visitor Token for the Visit
 * Token should be used to generate Visit Link
 * 
 * 
 */
async function getPasscode(context, event, response) {
  const { createPatientToken } = require(Runtime.getFunctions()["datastore/patient-tokens"].path);

  if (!event.patient_identity) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing patient_identity',
        explanation: 'The patient_identity parameter is missing.',
      },
    });
    return response;
  }

  const tokenData = await createPatientToken(context, event);
  // Return token
  response.setStatusCode(200);
  response.setBody(tokenData);
  return response;
};

async function getToken(context, event, response) {
  const { getPatientToken } = require(Runtime.getFunctions()["datastore/patient-tokens"].path);

  if (!event.passcode) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing passcode',
        explanation: 'The passcode parameter is missing.',
      },
    });
    return response;
  }

  const tokenData = await getPatientToken(context, event.passcode);
  // Return token
  response.setStatusCode(200);
  response.setBody(tokenData);
  return response;
};

module.exports.handler = async (context, event, callback) => {

  const { patient_identity, visit_id, patient_name } = event;

  let response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  if(event.action === 'PASSCODE') {
    await getPasscode(context, event, response);
  } else if (event.action === 'TOKEN') {
    await getToken(context, event, response);
  } else {
    response.setStatusCode(400);
    response.setBody({error: "Unknown Action: ''. Expecting PASSCODE or TOKEN"});
  }    
  return callback(null, response);
};