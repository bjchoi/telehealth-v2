/* global Twilio Runtime */
'use strict';
/*
 * --------------------------------------------------------------------------------
 * include helper function in another file via:
 *    const { path } = Runtime.getFunctions()["token-helper"];
 *    const { createIdentityToken } = require(path);
 *
 * --------------------------------------------------------------------------------
 *
 *  helper functions to be used only by patient-token.js and provider-token.js 
 *  twilio functions
 *  
 *  createIdentityToken
 *
 * --------------------------------------------------------------------------------
 */
const AccessToken = Twilio.jwt.AccessToken;
const MAX_ALLOWED_SESSION_DURATION = 14400;

function createIdentityToken(identity, context) {
  const { ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET } = context;
  const token = new AccessToken(ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  return token;
}

module.exports = {
  createIdentityToken
}