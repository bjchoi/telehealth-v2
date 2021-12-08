/*
 * --------------------------------------------------------------------------------
 * returns content of .env file
 *
 * return: json array of
 * {
 *  "key",
 *  "required",
 *  "format",
 *  "description",
 *  "link",
 *  "default",
 *  "configurable",
 *  "contentKey"
 * }
 * see https://github.com/twilio-labs/configure-env/blob/main/docs/SCHEMA.md
 * --------------------------------------------------------------------------------
 */
const { getParam, assertLocalhost } = require(Runtime.getFunctions()['helpers'].path);

exports.handler = async function(context, event, callback) {
  THIS = 'get-configuration-parameters';

  console.time(THIS);
  assertLocalhost(context);
  try {
    const path = require('path')
    const path0 = Runtime.getFunctions()["installer/get-configuration-parameters"].path;
    const path1 = path.join(path0,"../../../.env");
    const path_env = path.join(process.cwd(), '.env');

    console.log(path0);
    console.log(path1);
    console.log(path_env);

    const fs = require('fs')
    const filecontents = fs.readFileSync(path1, 'utf8')

    const configure = require("configure-env")

    parsed = configure.parser.parse(filecontents)

    const response = new Twilio.Response();
    response.setStatusCode(200);
    response.setBody({
        parsed
    });
    return callback(null, response);

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
};
