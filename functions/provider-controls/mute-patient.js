// Used to mute and unmute patient using Twilio Sync
// TODO: Will need to get rid of this since DataTrack API is the 
// right way to handle this

const { getParam } = require(Runtime.getFunctions()['helpers'].path);
const { fetchSyncMapItem, insertSyncMapItem, updateSyncMapItem } = require(Runtime.getFunctions()["datastore/datastore-helpers"].path);

exports.handler = async function(context, event, callback) {
  try {
    const response = new Twilio.Response();
    const MUTE_PATIENT = "mutePatient";
    const MUTE_NAME = "MP0d42872f9df64ccdadddc1f5e8fbb392";
    const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');
    const client = context.getTwilioClient();

    response.appendHeader('Content-Type', 'application/json');
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    const documentData = { mutePatient: !event.mutePatient }

    const mapItem = await fetchSyncMapItem(client, TWILIO_SYNC_SID, MUTE_NAME, MUTE_PATIENT);
    response.setStatusCode(200);

    if (mapItem) {
      const value = mapItem.data.mutePatient;
      console.log("value: ", value, "mutePatient: ",event.mutePatient)
      if (value !== event.mutePatient) {
        await updateSyncMapItem(client, TWILIO_SYNC_SID, MUTE_NAME, MUTE_PATIENT, {mutePatient: event.mutePatient});
        response.setBody(documentData);
        return callback(null, response);
      }
      console.log("valueddddd: ", value, "mutePatient: ",event.mutePatient)
      response.setBody(documentData);
      return callback(null, response)
    } else {
      await insertSyncMapItem(client, TWILIO_SYNC_SID, MUTE_NAME, MUTE_PATIENT, documentData);
      console.log("insert Item: ",await fetchSyncMapItem(client, TWILIO_SYNC_SID, MUTE_NAME, MUTE_PATIENT));
      response.setBody(documentData);
      return callback(null, response);
    }
  } catch (err) {
    console.log(err);
    response.setBody(400)
    response.setBody({message: "Error calling Sync REST APIs"})
    return callback(err, response);
  }
}