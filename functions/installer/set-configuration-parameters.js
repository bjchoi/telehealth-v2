
exports.handler = function(context, event, callback) {
    const {path} = Runtime.getFunctions()["helpers"];
    const {setParam, getParam} = require(path);

    async function setConfigParams(context, event){
        console.log(context);
        for (field in event){
            console.log(field,event[field]);
            await setParam(context,field,event[field]);
            console.log("GETTING", await getParam(context,field));
        }
        return context;
    }

    setConfigParams(context,event)
        .then(r => {
                const response = new Twilio.Response();
                response.setStatusCode(200);
                response.setBody({
                    event
                });
                return callback(null, response);
            }

        )
        .catch(
            err => {
                const response = new Twilio.Response();
                response.setStatusCode(400);
                response.setBody(err);
                return callback(null, response);
            }
        )
};

