/*
 * --------------------------------------------------------------------------------
 * common helper function used by functions
 *
 * getParam(context, key)
 * getParam(context, key)
 * setParam(context, key, value)
 *
 * include via:
 *   const path = Runtime.getFunctions()['helper'].path;
 *   const { getParam, setParam } = require(path);
 * and call functions directly
 *
 * --------------------------------------------------------------------------------
 */

const SERVER_START_TIMESTAMP = new Date().toISOString().replace(/.\d+Z$/g, "Z");

/*
 * --------------------------------------------------------------------------------
 * sets environment variable
 * --------------------------------------------------------------------------------
 */
const assert = require("assert");
const https = require("https");
const http = require("http");

async function setParam(context, key, value) {
  const onLocalhost = Boolean(
    context.DOMAIN_NAME && context.DOMAIN_NAME.startsWith('localhost')
  );
  console.debug('Runtime environment is localhost:', onLocalhost);

  const client = context.getTwilioClient();
  const service_sid = await getParam(context, 'TWILIO_SERVICE_SID');
  const environment_sid = await getParam(context, 'TWILIO_ENVIRONMENT_SID');

  const variables = await client.serverless
    .services(service_sid)
    .environments(environment_sid)
    .variables.list();
  let variable = variables.find(v => v.key === key);
  let variable_sid = variable.sid;

  if (variable_sid === null) {
    await client.serverless
      .services(service_sid)
      .environments(environment_sid)
      .variables.create({ key, value })
      .then((v) => console.log('Created variable', v.key));
  } else {
    await client.serverless
      .services(service_sid)
      .environments(environment_sid)
      .variables(variable_sid)
      .update({ value })
      .then((v) => console.log('Updated variable', v.key));
  }
  console.log('setParam', key, '=', value);
}

/*
 * --------------------------------------------------------------------------------
 * retrieve environment variable from
 *
 * - service environment (aka context)
 * - os for local development (via os.process)
 * - per resource-specific logic
 *   . TWILIO_SERVICE_SID from context, otherwise matching application name
 *   . TWILIO_ENVIRONMENT_SID from TWILIO_SERVICE_SID
 *   . TWILIO_ENVIRONMENT_DOMAIN_NAME from TWILIO_SERVICE_SID
 * --------------------------------------------------------------------------------
 */
async function getParam(context, key) {
  const CONSTANTS = {
    APPLICATION_NAME: 'telehealth-v2',
  };

  // first return context non-null context value
  if (context[key]) return context[key];

  // second return CONSTANTS value
  if (CONSTANTS[key]) {
    context[key] = CONSTANTS[key];
    return context[key];
  }

  const client = context.getTwilioClient();
  // ----------------------------------------------------------------------
  try {
    switch (key) {
      case 'SERVER_START_TIMESTAMP': {
        return SERVER_START_TIMESTAMP;
      }

      case 'IS_LOCALHOST': {
        const domain_name = context['DOMAIN_NAME'];
        return domain_name.startsWith('localhost:');
      }

      case 'TWILIO_ACCOUNT_SID': {
        return getParam(context, 'ACCOUNT_SID');
      }

      case 'TWILIO_AUTH_TOKEN': {
        return getParam(context, 'AUTH_TOKEN');
      }

      case 'TWILIO_ENVIRONMENT_SID': {
        const service_sid = await getParam(context, 'TWILIO_SERVICE_SID');
        if (service_sid === null) {
          return null; // service not yet deployed
        }
        const environments = await client.serverless
          .services(service_sid)
          .environments.list({limit : 1});

        return environments.length > 0 ? environments[0].sid : null;
      }

      case 'TWILIO_ENVIRONMENT_DOMAIN': {
        const service_sid = await getParam(context, 'TWILIO_SERVICE_SID');
        if (service_sid === null) {
          return null; // service not yet deployed
        }
        const environments = await client.serverless
          .services(service_sid)
          .environments.list({limit : 1});

        return environments.length > 0 ? environments[0].domainName: null;
      }

      case 'TWILIO_FLOW_SID': {
        // context.friendlyName required, returns null if not supplied
        if (! context.flowName) return null;

        const flows = await client.studio.flows.list();
        const flow = flows.find(f => f.friendlyName === context.flowName);

        return flow ? flow.sid : null;
      }

      case 'TWILIO_SERVICE_SID': {
        const services = await client.serverless.services.list();
        const service = services.find(s => s.uniqueName === CONSTANTS.APPLICATION_NAME);

        return service ? service.sid : null;
      }

      case 'TWILIO_VERIFY_SID': {
        const services = await client.verify.services.list();
        const service = services.find(s => s.friendlyName === context.CUSTOMER_NAME);
        if (service) return service.sid;

        console.log('Verify service not found so creating a new verify service...');
        let verify_sid = null;
        await client.verify.services
          .create({ friendlyName: context.CUSTOMER_NAME })
          .then((result) => {
            console.log(result);
            console.log(result.sid);
            verify_sid = result.sid;
          });
        if (verify_sid) return verify_sid;

        console.log('Unable to create a Twilio Verify Service!!! ABORTING!!! ');
        return null;
      }

      case 'TWILIO_SYNC_SID': {
        const services = await client.sync.services.list();
        const service = services.find(s => s.friendlyName === context.APPLICATION_NAME);
        if (service) return service.sid;

        console.log('Sync service not found so creating a new sync service...');
        let sync_sid = null;
        await client.sync.services
          .create({ friendlyName: context.APPLICATION_NAME })
          .then((result) => {
            sync_sid = result.sid;
          });
        if (sync_sid) return sync_sid;

        console.log('Unable to create a Twilio Sync Service!!! ABORTING!!! ');
        return null;
      }

      default:
        throw new Error(`Undefined variable ${key}!!!`);
    }
  } catch (err) {
    console.log(err);
    console.log(`Unexpected error in getParam for ${key}!!!`);
    throw err;
  }
}


// --------------------------------------------------------------------------------
module.exports = {
  getParam,
  setParam,
};
