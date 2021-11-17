
/**
 * Generates Provider Token
 * Token to be used to verify Visit Link for Provider
 * 
 */
module.exports.handler = async (context, event, callback) => {
  const { provider_identity, provider_name } = event;
  const { path } = Runtime.getFunctions()["token-helper"];
  const { createIdentityToken } = require(path);
  const role = "provider";

  let response = new Twilio.Response();

  if (!provider_identity || !provider_name) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing body parameter(s)',
        explanation: 'The provider_identity or provider_name parameter is missing.',
      },
    });
    return callback(null, response);
  }

  const token = createIdentityToken(provider_identity, context);
  const identityGrant = {
    key: "provider",
    toPayload: () => ({ role: role, name: provider_identity})
  }
  token.addGrant(identityGrant);
  
  // Return token
  response.setStatusCode(200);
  response.setBody({ token: token.toJwt() });
  return callback(null, response);
};