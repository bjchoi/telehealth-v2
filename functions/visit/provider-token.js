
/**
 * Generates Provider Token
 * Token to be used to verify Visit Link for Provider
 * 
 */
module.exports.handler = async (context, event, callback) => {
  const { practitioner_identity, practitioner_name } = event;
  const { path } = Runtime.getFunctions()["token-helper"];
  const { createIdentityToken } = require(path);
  const role = "practitioner";

  let response = new Twilio.Response();

  if (!practitioner_identity || !practitioner_name) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing body parameter(s)',
        explanation: 'The practitioner_identity or practitioner_name parameter is missing.',
      },
    });
    return callback(null, response);
  }

  const token = createIdentityToken(practitioner_identity, context);
  const identityGrant = {
    key: "practitioner",
    toPayload: () => ({ role: role, name: practitioner_name})
  }
  token.addGrant(identityGrant);

  // Return token
  response.setStatusCode(200);
  response.setBody({ token: token.toJwt() });
  return callback(null, response);
};