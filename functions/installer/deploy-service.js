exports.handler = async function(context, event, callback) {    
  try {
    console.log(context);
    console.log(event);
    console.log(__dirname);
    console.log(process.cwd());
    // const accountSid = process.env.TWILIO_ACCOUNT_SID;
    // const authToken = process.env.TWILIO_AUTH_TOKEN;
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');

    const twilioClient = require('twilio')(event.accountSid, event.authToken);
    const functions = Runtime.getFunctions();
    console.log(functions);
    const installerHelperPath = Runtime.getFunctions()["installer/installer-helpers"].path;
    console.log(installerHelperPath);
   
    const { getAppInfo, deploy, verifyAppDirectory } = require(installerHelperPath);  


    /*const appDirectory = process.env.APP_DIRECTORY;
    if (appDirectory) {
        try {
          verifyAppDirectory(appDirectory);
        } catch (err) {
          console.log(err.message);
          response.setStatusCode(500);
          response.setBody({message: err});
          return callback(null, response);
        }
    }*/
  
      appInfo = await getAppInfo(twilioClient, event.appName);
      console.log("App Info:");
      console.log(appInfo);
      await deploy(twilioClient, event, appInfo);
      appInfo = await getAppInfo(twilioClient, event.appName);
      response.setStatusCode(200);
      response.setBody({ status: "success", sid: appInfo.sid, url: appInfo.url });
      return callback(response, null);
  }
  catch(err) {
    console.log(err);
    response.setStatusCode(500);
    response.setBody({message: err });
    return callback(null, response);
  }
}