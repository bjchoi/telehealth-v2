/*
 * --------------------------------------------------------------------------------
 * include token validation function using:
 *    const {path} = Runtime.getFunctions()["authentication-helper"];
 *    const {isValidAppToken} = require(path);
 *
 * --------------------------------------------------------------------------------
 *
 *  helper functions to be used only by authentication.js twilio function
 *
 * isValidPassword(password,context)
 * createMfaToken(context,key)
 * createAppToken(issuer,context)
 * checkDisableAuthForLocalhost(context)
 * getVerifyServiceId(context)
 * isValidAppToken(token,context)
 * isValidMfaToken(token,context)
 * isValidRefreshToken

 * --------------------------------------------------------------------------------
 */

const jwt = require('jsonwebtoken');

const MFA_TOKEN_DURATION = 5 * 60;
const APP_TOKEN_DURATION = 30 * 60;
const REFRESH_TOKEN_DURATION = 24 * 60 * 60;
const USER_TOKEN_DURATION = 30 * 24 * 60 * 60;
const AUTH_HEADER_TYPE = "Bearer";

function isValidPassword(password, context) {
    return (checkDisableAuthForLocalhost(context) ||
        password === context.APPLICATION_PASSWORD);
}

// --------------------------------------------------------
function createUserToken(context, role, id, visitId) {
    return createToken(context, 'app', { role, id, visitId }, USER_TOKEN_DURATION);
}

function createAppToken(context) {
    return createToken(context, 'app', { role: 'administrator' }, APP_TOKEN_DURATION);
}

// --------------------------------------------------------
function createRefreshToken(issuer, context) {
    return createToken(context, 'refresh', { role: 'administrator' }, REFRESH_TOKEN_DURATION);
}

// --------------------------------------------------------

function createMfaToken(issuer, context) {
    if (checkDisableAuthForLocalhost(context)) {
        return createAppToken(issuer, context);
    }
    return createToken(context, 'mfa', { role: 'administrator' }, MFA_TOKEN_DURATION);
}

// --------------------------------------------------------
function checkDisableAuthForLocalhost(context) {
    return (
        context.DOMAIN_NAME &&
        context.DOMAIN_NAME.startsWith('localhost') &&
        context.DISABLE_AUTH_FOR_LOCALHOST &&
        context.DISABLE_AUTH_FOR_LOCALHOST === 'true'
    );
}

/* -----------------------------------------------------------------------
 * This function returns Verify Service SID that matches VERIFY_SERVICE_NAME.
 * If does not exists it creates a new service.

 * VERIFY_SERVICE_NAME is included in the text message to identify the sender.
 * It is recommended that the customer use their name as VERIFY_SERVICE_NAME
 */
async function getVerifyServiceId(context) {
    const client = context.getTwilioClient();
    if (!context.VERIFY_SERVICE_NAME) {
        context.VERIFY_SERVICE_NAME = context.CUSTOMER_NAME;
        console.log("using CUSTOMER_NAME for VERIFY_SERVICE_NAME");
    }
    const services = await client.verify.services.list();
    const service = services.find(s => s.friendlyName === context.VERIFY_SERVICE_NAME);
    if (service) return service.sid;

    console.log(`create verfiy service named: ${context.VERIFY_SERVICE_NAME}`);
    const si = await client.verify.services.create({friendlyName: context.VERIFY_SERVICE_NAME});
    if (si) return si.sid;
}
// -----------------------------------------------------

function isValidMfaToken(token, context) {
    try {
        return (
            checkDisableAuthForLocalhost(context) ||
            jwt.verify(token, context.TWILIO_API_KEY_SECRET, { audience: 'mfa' })
        );
    } catch (err) {
        return false;
    }
}

// ---------------------------------------------------------
function isValidAppToken(token, context) {
    try {
        return (
            checkDisableAuthForLocalhost(context) ||
            jwt.verify(token, context.TWILIO_API_KEY_SECRET, { audience: 'app' })
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

// ---------------------------------------------------------
function isValidRefreshToken(token, context) {
    try {
        return (
            checkDisableAuthForLocalhost(context) ||
            jwt.verify(token, context.TWILIO_API_KEY_SECRET, { audience: 'refresh' })
        );
    } catch (err) {
        console.log(err);
        return false;
    }
}

function createToken(context, tokenType, payload, duration) {
  const { ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET } = context;
    return jwt.sign(payload, TWILIO_API_KEY_SECRET, {
        expiresIn: duration,
        audience: tokenType,
        issuer: TWILIO_API_KEY_SID,
        subject: ACCOUNT_SID,
    });
}

function validateAndDecodeAppToken(context, event, roles) {
    let token = null;
    let response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    if(event.token) {
        token = event.token;
    } else {
        const authHeader = event.request.headers.authorization;
        if (!authHeader || !authHeader.startsWith(AUTH_HEADER_TYPE)) {
            response.setStatusCode(401);
            response.setBody({
              error: {
                message: `Authorization Header should not be emty and should start with ${AUTH_HEADER_TYPE}`,
                explanation:
                  `Please provide Authorization Header in a form of '${AUTH_HEADER_TYPE} _jwt-token_'`,
              },
            });
            return { response };
        }
        token = authHeader.replace(`${AUTH_HEADER_TYPE} `, "");
    }  
  
    if (!token) {
      response.setStatusCode(401);
      response.setBody({
        error: {
          message: `Authorization Token is Empty`,
          explanation:
            `Please provide Authorization Header in a form of '${AUTH_HEADER_TYPE} _jwt-token_' or token parameter as a part of query string/body`,
        },
      });
      return { response };
    }
  
    if(!isValidAppToken(token, context)) {
      response.setStatusCode(403);
      response.setBody({
        error: {
          message: `Authorization Token is not valid`
        },
      });
      return { response };
    }

    var decoded = jwt.decode(token);

    if(roles) {
        if(!roles.find(r => decoded.role === r)) {
            response.setStatusCode(403);
            response.setBody({
                error: {
                message: `Role ${decoded.role} is not authorized to perform this operation`
                },
            });
            return { response };
        }
    }

    console.log("Decoded Token");
    console.log(decoded);
    return { decoded };
}

// ---------------------------------------------------------
module.exports = {
    isValidPassword,
    createMfaToken,
    createAppToken,
    createRefreshToken,
    createUserToken,
    isValidMfaToken,
    getVerifyServiceId,
    isValidAppToken,
    isValidRefreshToken,
    checkDisableAuthForLocalhost,
    validateAndDecodeAppToken
}