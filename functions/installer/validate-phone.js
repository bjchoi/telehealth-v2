exports.handler = async function(context, event, callback) {
    console.log("IN Twilio func validate phone");
    const client = context.getTwilioClient();

    const response = new Twilio.Response();
    const to_phone = await client.lookups.v1.phoneNumbers(event.ADMINISTRATOR_PHONE)
        .fetch({countryCode: 'US'})
        .then(phone => {
            if (phone.hasOwnProperty("phoneNumber")) {
                response.setStatusCode(200);
                response.setBody({
                    phone: phone.phoneNumber
                });
                return callback(null,response);
            } else{
                console.log("No property");
                throw Error("error");
            }

        })
        .catch(err => {
            console.log("ERROR",err);
            response.setStatusCode(400);
            response.setBody({error: err})
            return callback(null,response);

        })
}


