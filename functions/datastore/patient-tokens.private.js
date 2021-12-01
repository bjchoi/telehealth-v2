const PATIENT_TOKENS_MAP="PatientTokens"
const { createIdentityToken } = require(Runtime.getFunctions()["token-helper"].path);
const { fetchSyncMapItem, insertSyncMapItem } = require(Runtime.getFunctions()["datastore/datastore-helpers"].path);
const { getParam } = require(Runtime.getFunctions()['helpers'].path);

async function createPatientToken(context, visit) {
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');
  const token = createIdentityToken(visit.patient_identity, context);
  const patientGrant = { 
      key: "patient",
      toPayload: () => ({ visitId: visit.visit_id, role: "patient", name: visit.patient_name })
    };
  token.addGrant(patientGrant);
  jwtToken = token.toJwt();
  passcode = jwtToken.split('.')[2];
  const client = context.getTwilioClient();
  await insertSyncMapItem(client, TWILIO_SYNC_SID, PATIENT_TOKENS_MAP, passcode, { token: jwtToken });
  return { passcode, token: jwtToken };
}

async function getPatientToken(context, passcode) {
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');
  const client = context.getTwilioClient();
  const item = await fetchSyncMapItem(client, TWILIO_SYNC_SID, PATIENT_TOKENS_MAP, passcode);
  return item.data;
}

module.exports = {
  createPatientToken,
  getPatientToken
}