/* global Twilio */
'use strict';
const jwt = require("jsonwebtoken");

const authHeaderType = "Bearer";

module.exports = async (context, event, callback) => {
  const { ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET } = context;
  console.log(event);
  const authHeader = event.request.headers.authorization;
  let response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');

  if (!authHeader || !authHeader.startsWith(authHeaderType)) {
    response.setStatusCode(401);
    response.setBody({
      error: {
        message: `Authorization Header should not be emty and should start with ${authHeaderType}`,
        explanation:
          `Please provide Authorization Header in a form of '${authHeaderType} _jwt-token_'`,
      },
    });
    return { response };
  }
  const token = authHeader.replace(`${authHeaderType} `, "");

  if (!token) {
    response.setStatusCode(401);
    response.setBody({
      error: {
        message: `Authorization Token is Empty`,
        explanation:
          `Please provide Authorization Header in a form of '${authHeaderType} _jwt-token_'`,
      },
    });
    return { response };
  }

  try {
    var decoded = jwt.verify(token, TWILIO_API_KEY_SECRET, { issuer: TWILIO_API_KEY_SID, subject: ACCOUNT_SID });
    console.log("Decoded Token");
    console.log(decoded);
    return { decoded };
  } catch(err) {
    response.setStatusCode(403);
    response.setBody({
      error: {
        message: `Authorization Token is not valid`,
        explanation: err,
      },
    });
    return { response };
  }
};
