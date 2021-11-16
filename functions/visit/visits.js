/* global Twilio Runtime */
'use strict';

module.exports.handler = async (context, event, callback) => {
  let response = new Twilio.Response();
  response.setBody({ result: "it is valid" });
  return callback(null, response);
};
