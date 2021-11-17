/**
 * Generates Patient/Visitor Token for the Visit
 * Token should be used to generate Visit Link
 * 
 * 
 */
module.exports.handler = async (context, event, callback) => {
  const { path } = Runtime.getFunctions()["token-helper"];
  const { createIdentityToken } = require(path);

  // const authHandler = require(Runtime.getAssets()['/auth-handler.js'].path);
  // authHandler(context, event, callback);

  const { patient_identity, visit_id, patient_name } = event;
  const role = "patient";

  let response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!patient_identity) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing user_identity',
        explanation: 'The user_identity parameter is missing.',
      },
    });
    return callback(null, response);
  }

  const token = createIdentityToken(patient_identity, context);
  const patientGrant = { 
      key: "patient",
      toPayload: () => ({ visitId: visit_id, role: role, name: patient_name })
    };
  token.addGrant(patientGrant);

  // Return token
  response.setStatusCode(200);
  response.setBody({ token: token.toJwt() });
  return callback(null, response);
};