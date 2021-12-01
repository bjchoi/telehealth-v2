/*
 * ----------------------------------------------------------------------------------------------------
 * helper functions for datastore functions
 * - manages persistent storage using Twilio Sync
 *
 * depends on:
 *   SYNC_SERVICE_SID: Sync service sid, automatically procured in helpers.private.js
 * ----------------------------------------------------------------------------------------------------
 */

const assert = require('assert');

/*
 * ----------------------------------------------------------------------------------------------------
 * seclt a Sync document
 *
 * parameters:
 * - context: Twilio runtime context
 * - syncServiceSid: Sync service SID
 * - syncDocumentName: unique Sync document name
 *
 * returns: select object, null if document does not exist
 * ----------------------------------------------------------------------------------------------------
 */
async function _fetchSyncDocument(client, syncServiceSid, syncDocumentName) {
  const documents = await client.sync
    .services(syncServiceSid)
    .documents
    .list();
  const document = documents.find(d => d.uniqueName === syncDocumentName);

  return document; // will be 'undefined' is not found
}


/*
 * ----------------------------------------------------------------------------------------------------
 * select a Sync document
 *
 * parameters:
 * - context: Twilio runtime context
 * - syncServiceSid: Sync service SID
 * - syncDocumentName: unique Sync document name
 *
 * returns: select object, null if document does not exist
 * ----------------------------------------------------------------------------------------------------
 */
async function selectSyncDocument(context, syncServiceSid, syncDocumentName) {
  assert(context, 'missing parameter: context!!!');
  assert(syncServiceSid, 'missing parameter: syncServiceSid!!!');
  assert(syncDocumentName, 'missing parameter: syncDocumentName!!!');

  const client = context.getTwilioClient();

  const document = await _fetchSyncDocument(client, syncServiceSid, syncDocumentName)

  return document ? document.data : null;
}


/*
 * ----------------------------------------------------------------------------------------------------
 * insert/update a new Sync document
 *
 * parameters
 * - context: Twilio runtime context
 * - syncServiceSid: Sync service SID
 * - syncDocumentName: unique Sync document name
 * - documentData: document data object
 *
 * returns: document SID if successful
 * ----------------------------------------------------------------------------------------------------
 */
async function upsertSyncDocument(context, syncServiceSid, syncDocumentName, syncDocumentData) {
  assert(context, 'missing parameter: context!!!');
  assert(syncServiceSid, 'missing parameter: syncServiceSid!!!');
  assert(syncDocumentName, 'missing parameter: syncDocumentName!!!');
  assert(syncDocumentData, 'missing parameter: syncDocumentData!!!');

  const client = context.getTwilioClient();

  let document = await _fetchSyncDocument(client, syncServiceSid, syncDocumentName)

  if (document) {
    console.log('updating document:', document.uniqueName, document.sid);
    document = await client.sync
      .services(syncServiceSid)
      .documents(document.sid)
      .update({
        data: syncDocumentData,
      });
  } else {
    console.log('creating document:', syncDocumentName);
    document = await client.sync
      .services(syncServiceSid)
      .documents.create({
        data: syncDocumentData,
        uniqueName: syncDocumentName,
      });
  }
  return document.sid;
}

/*
 * ----------------------------------------------------------------------------------------------------
 * delete an existing Sync document
 *
 * parameters
 * - context: Twilio runtime context
 * - syncServiceSid: Sync service SID
 * - syncDocumentName: unique Sync document name
 *
 * returns: document SID if successful, null if nothing was delete
 * ----------------------------------------------------------------------------------------------------
 */
async function deleteSyncDocument(context, syncServiceSid, syncDocumentName) {
  assert(context, 'missing parameter: context!!!');
  assert(syncServiceSid, 'missing parameter: syncServiceSid!!!');
  assert(syncDocumentName, 'missing parameter: syncDocumentName!!!');

  const client = context.getTwilioClient();

  const document = await _fetchSyncDocument(client, syncServiceSid, syncDocumentName)

  if (document) {
    await client.sync
      .services(syncServiceSid)
      .documents(document.sid).remove();
    return document.sid;
  } else {
    return null;
  }
}

function __ensureSyncMapCreated(client, syncServiceSid, syncMapName) {
  return client.sync
    .services(syncServiceSid)
    .syncMaps(syncMapName)
    .fetch()
    .catch(err => {
      console.log(err);
      if(err.status === 404) {
        return client.sync
        .services(syncServiceSid)
        .syncMaps
        .create({uniqueName: syncMapName});
      }

      return Promise.resolve();
    });
}

async function fetchSyncMapItem(client, syncServiceSid, syncMapName, syncMapItemKey) {
  return await __ensureSyncMapCreated(client, syncServiceSid, syncMapName)
    .then(() => client.sync
      .services(syncServiceSid)
      .syncMaps(syncMapName)
      .syncMapItems(syncMapItemKey)
      .fetch());
}

async function insertSyncMapItem(client, syncServiceSid, syncMapName, syncMapItemKey, data) {
  await __ensureSyncMapCreated(client, syncServiceSid, syncMapName)
  .then(() => client.sync
    .services(syncServiceSid)
    .syncMaps(syncMapName)
    .syncMapItems
    .create({key: syncMapItemKey, data })
    .then(mapItem => console.log(mapItem.key)));
}


// --------------------------------------------------------------------------------
module.exports = {
  selectSyncDocument,
  upsertSyncDocument,
  deleteSyncDocument,
  fetchSyncMapItem,
  insertSyncMapItem
};
