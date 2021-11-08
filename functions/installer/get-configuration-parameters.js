
exports.handler = function(context, event, callback) {
    const path = require('path')

    const path0 = Runtime.getFunctions()["installer/get-configuration-parameters"].path;
    const path1 = path.join(path0,"../../../.env")

    const fs = require('fs')
    let filecontents;
    try {
        filecontents = fs.readFileSync(path1, 'utf8')
        // console.log(filecontents)
    } catch (err) {
        console.error(err)
    }
    const response = new Twilio.Response();

    const configure = require("configure-env")

    parsed = configure.parser.parse(filecontents)

    response.setStatusCode(200);
    response.setBody({
        parsed
    });
    return callback(null, response);
};
