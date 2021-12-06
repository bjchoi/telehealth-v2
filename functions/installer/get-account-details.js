exports.handler = function(context, event, callback) {

    const response = new Twilio.Response();

    getAccountDetails(context)
        .then(
            account_details => {
                response.setStatusCode(200);
                response.setBody({
                    account_details
                });
                return callback(null, response);

            }
        )
        .catch(
            error => {
                response.setStatusCode(error.status);
                response.setBody({
                    error
                });
                return callback(null, response);

            }
        )
};
// -----------------------------------------------------------------------------

async function getAccountDetails(context) {
//     const accountSid = process.env.ACCOUNT_SID;
//     const authToken = process.env.AUTH_TOKEN;
//     const client = require('twilio')(accountSid, authToken);
    const client = context.getTwilioClient();
    const account = await client.api.accounts(process.env.ACCOUNT_SID).fetch();
    account_name = account.friendlyName;
    const phoneNumberList = await client.api.accounts(process.env.ACCOUNT_SID).incomingPhoneNumbers.list();
    const phoneList = phoneNumberList.map(phone =>  phone["phoneNumber"]+ ":" + phone['friendlyName']);
    return {
        account_name,
        phoneList
    }
}
