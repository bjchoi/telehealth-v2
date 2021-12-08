'use strict';
exports.handler = function(context, event, callback) {
  const response = new Twilio.Response();
  response.setStatusCode(200);
  response.setBody({message: "hello World"});

  const client = context.getTwilioClient();

  client.messages
      .create(
        {
          body: 'Hi there', 
          from: '+18086989926', 
          to: '+14088025050'
        })
      .then(message => console.log(message.sid));
  return callback(null, response);
};