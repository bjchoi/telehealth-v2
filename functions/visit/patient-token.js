/* global Twilio Runtime */
'use strict';
/**
 * Generates Patient/Visitor Token for the Visit
 * Token should be used to generate Visit Link
 * 
 * 
 */
 const AccessToken = Twilio.jwt.AccessToken;
 const MAX_ALLOWED_SESSION_DURATION = 14400;

module.exports.handler = async (context, event, callback) => {
  const { ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET } = context;

  // TODO: Add Provider/Admin Auth Handler

  // const authHandler = require(Runtime.getAssets()['/auth-handler.js'].path);
  // authHandler(context, event, callback);

  const { patient_identity, visit_id, patient_name } = event;

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

  // Create token
  const token = new AccessToken(ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });

  // Add participant's identity to token
  token.identity = patient_identity;
  const patientGrant = { 
      key: "patient",
      toPayload: () => ({ visitId: visit_id, role: "patient", name: patient_name })
    };
  token.addGrant(patientGrant);

  // Return token
  response.setStatusCode(200);
  response.setBody({ token: token.toJwt() });
  return callback(null, response);
};