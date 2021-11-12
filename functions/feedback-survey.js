exports.handler = async function (context, event, callback) {
  try {
    const sgMail = require('@sendgrid/mail');
    const API_KEY = context.SENDGRID_API_KEY;
    const ADMIN_EMAIL = context.ADMINISTRATOR_EMAIL;
    sgMail.setApiKey(API_KEY);

    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');

    if (event.selectedThumb === null || event.selectedThumb === undefined || event.selectedThumb === ""){
      response.setStatusCode(400);
      response.setBody({message: "No feedback provided."});
      return callback(null, response);
    }
    
    const message = {
      to: ADMIN_EMAIL,
      from: ADMIN_EMAIL,
      subject: 'Twilio Telehealth V2 Patient Feedback',
      templateId: 'd-49d2acfafe104c55b7af6a137ef215af', // This is a custom template from Send Grid
      dynamic_template_data: {
        feedback: event.selectedThumb,
        issues: event.selectedIssues
      }
    };
  
    await sgMail.send(message)
      .then(res => {
        console.log('Email with feedback has sent with response: ', res);
        response.setStatusCode(res[0].statusCode);
      }).catch(err => {
        console.log('Error: ', err);
        response.setStatusCode(400);
      })
    response.setBody({message});
    return callback(null, response);

  } catch(err) {
    console.log(err);
    response.setStatusCode(500);
    response.setBody({message: err });
    return callback(null, response);
  }
}