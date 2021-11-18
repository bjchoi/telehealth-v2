/*
 * --------------------------------------------------------------------------------
 * checks existence of service in target Twilio account.
 *
 * NOTE: that this function can only be run on localhost
 *
 * - service identified via unique_name = APPLICATION_NAME in helpers.private.js
 *
 * event:
 * . n/a
 *
 * returns:
 * - SERVICE_SID, if found
 * - NOT-DEPLOYED, if not deployed
 * - status_code = 404, if not running locally
 * --------------------------------------------------------------------------------
 */

const assert = require('assert');
const path_helper = Runtime.getFunctions()['helpers'].path;
const { getParam } = require(path_helper);

exports.handler = async function (context, event, callback) {
  const path = require('path');
  const prefix = __filename.match(/.+functions\//)[0];
  const suffix = __filename.match(/\.(private\.|protected\.)*js/)[0];
  console.log(__filename);
  console.log(prefix);
  console.log(suffix);
  const file = path.relative(prefix, __filename);
  const fname = file.replace(suffix, '');
  console.log(file);
  console.log(fname);
  const THIS = 'installer/check-service -';
  console.time(THIS);
  try {

    const domain_name = await getParam(context, 'DOMAIN_NAME');
    const is_localhost = await getParam(context, 'IS_LOCALHOST');
    const app_name = await getParam(context, 'APPLICATION_NAME');
    const service_sid = await getParam(context, 'TWILIO_SERVICE_SID');

    console.log(THIS, `SERVICE_SID for APPLICATION_NAME (${app_name}): ${service_sid}`);
    if (service_sid) {
      return callback(null, service_sid);
    } else {
      return callback(null, 'NOT-DEPLOYED');
    }
  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
}
