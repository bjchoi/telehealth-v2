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
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    console.log(accountSid,authToken);
    const client = require('twilio')(accountSid, authToken);
    const account = await client.api.accounts(accountSid).fetch();
    account_name = account.friendlyName;
    const phoneNumberList = await client.api.accounts(accountSid).incomingPhoneNumbers.list();
    console.log(phoneNumberList);
    const phoneList = phoneNumberList.map(phone =>  phone["phoneNumber"]+ ":" + phone['friendlyName']);
    return {
        account_name,
        phoneList
    }
}
