/*
 * --------------------------------------------------------------------------------
 * checks deployment of service in target Twilio account.
 *
 * NOTE: that this function can only be run on localhost
 *
 * - service identified via unique_name = APPLICATION_NAME in helpers.private.js
 *
 * event:
 * . n/a
 *
 * returns:
 * {
 *   deploy_state: DEPLOYED|NOT-DEPLOYED
 *   service_sid : SID of deployed service
 * }
 * --------------------------------------------------------------------------------
 */
const assert = require('assert');
const { getParam, assertLocalhost } = require(Runtime.getFunctions()['helpers'].path);

exports.handler = async function (context, event, callback) {
  const THIS = 'check-application';

  console.time(THIS);
  assertLocalhost(context);
  try {

    const application_name = await getParam(context, 'APPLICATION_NAME');
    const service_sid = await getParam(context, 'SERVICE_SID');

    console.log(THIS, `SERVICE_SID for APPLICATION_NAME (${application_name}): ${service_sid}`);

    return callback(null, {
      deploy_state: service_sid ? 'DEPLOYED' : 'NOT-DEPLOYED',
      service_sid : service_sid ? service_sid : '',
    });

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
}
