const TOKENS_MAP="Tokens"
const { createUserToken } = require(Runtime.getFunctions()["authentication-helper"].path);
const { fetchSyncMapItem, insertSyncMapItem } = require(Runtime.getFunctions()["datastore/datastore-helpers"].path);
const { getParam } = require(Runtime.getFunctions()['helpers'].path);

async function createToken(context, role, user) {
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');
  const token = createUserToken(context, role, user.id, user.visit_id);
  passcode = token.split('.')[2];
  const client = context.getTwilioClient();
  await insertSyncMapItem(client, TWILIO_SYNC_SID, TOKENS_MAP, passcode, { token });
  return { passcode, token };
}

async function getToken(context, passcode) {
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');
  const client = context.getTwilioClient();
  const item = await fetchSyncMapItem(client, TWILIO_SYNC_SID, TOKENS_MAP, passcode);
  return item.data;
}

module.exports = {
  createToken,
  getToken
}