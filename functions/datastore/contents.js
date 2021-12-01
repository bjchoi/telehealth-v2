/*
 * --------------------------------------------------------------------------------
 * manage waiting room contents including storage to EHR/CMS
 *
 * event parameters:
 * .action: USAGE|SCHEMA|PROTOTYPE|GET|ADD|REMOVE|ASSIGN|UNASSIGN, default USAGE
 * --------------------------------------------------------------------------------
 */

const SCHEMA = '/datastore/content-schema.json';
const PROTOTYPE = '/datastore/content-prototype.json';
const FHIR_DOCUMENT_REFERENCE = 'DocumentReferences';

const assert = require("assert");
const { getParam, fetchPublicJsonAsset } = require(Runtime.getFunctions()['helpers'].path);
const { selectSyncDocument, upsertSyncDocument } = require(Runtime.getFunctions()['datastore/datastore-helpers'].path);

// --------------------------------------------------------------------------------
async function read_fhir(context, resourceType, simulate = true) {
  if (!simulate) throw new Error('live retrieval from EHR/CMS not implemented');
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

  const bundle = await selectSyncDocument(context, TWILIO_SYNC_SID, resourceType);
  assert(bundle.total === bundle.entry.length, 'bundle checksum error!!!');

  return bundle.entry;
}

// --------------------------------------------------------------------------------
async function save_fhir(context, resourceType, resources, simulate = true) {
  if (!simulate) throw new Error('live saving to EHR/CMS not implemented');
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

  const bundle = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: resources.length,
    entry: resources,
  }
  const document = await upsertSyncDocument(context, TWILIO_SYNC_SID, resourceType, bundle);

  return document ? document.sid : null;
}

// --------------------------------------------------------------------------------
function transform_fhir_to_content(fhir_document_reference, provider_id) {
  const r = fhir_document_reference;
  const providers = provider_id
    ? [provider_id]
    : r.context.related
      ? r.context.related.map(e => e.reference.replace('Practitioner/', ''))
      : [];
  const content = {
    content_id: r.id,
    content_title: r.content[0].attachment.title,
    content_description: r.description,
    content_video_url: r.content[0].attachment.url,
    providers: providers,
  };
  return content;
}

// --------------------------------------------------------------------------------
function transform_content_to_fhir(content) {
  const c = content;
  const related = c.providers
    ? c.providers.map(e => { return { reference: 'Practitioner/' + e, }})
    : [];
  const fhir_document_reference = {
    resourceType: 'DocumentReference',
    id: c.content_id,
    status: 'current',
    description: c.content_description,
    content: [
      {
        attachment: {
          url: c.content_video_url,
          title: c.content_title,
        }
      }
    ],
    context: {
      related: related
    }
  };
  return fhir_document_reference;
}

// --------------------------------------------------------------------------------
exports.handler = async function(context, event, callback) {
  const THIS = 'contents:';
  console.time(THIS);

  const { isValidAppToken } = require(Runtime.getFunctions()["authentication-helper"].path);

  /* Following code checks that a valid token was sent with the API call */
  if (event.token && !isValidAppToken(event.token, context)) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    response.setStatusCode(401);
    response.setBody({message: 'Invalid or expired token'});
    return callback(null, response);
  }
  try {
    const action = event.action ? event.action : 'USAGE'; // default action

    switch (action) {

      case 'USAGE': {
        const openFile = Runtime.getAssets()[PROTOTYPE].open;
        const prototype = JSON.parse(openFile());
        delete prototype.providers;

        const usage = {
          action: 'valid values for contents function',
          USAGE: {
            description: 'returns function signature, default action',
            parameters: {},
          },
          SCHEMA: {
            description: 'returns json schema for content',
            parameters: {},
          },
          PROTOTYPE: {
            description: 'returns prototype of content',
            parameters: {},
          },
          GET: {
            description: 'returns array of content',
            parameters: {
              provider_id: 'optional, filters for specified provider_id',
            }
          },
          ADD: {
            description: 'add a new content',
            parameters: {
              content: prototype,
            },
          },
          REMOVE: {
            description: 'remove an existing content',
            parameters: {
              content_id: 'required, content_id to remove'
            },
          },
          ASSIGN: {
            description: 'assign content to a provider',
            parameters: {
              content_id: 'required, content_id to assign provider',
              provider_id: 'required, provider to assign content to'
            },
          },
          UNASSIGN: {
            description: 'assign content to a provider',
            parameters: {
              content_id: 'required, content_id to unassign provider',
              provider_id: 'required, provider to unassign content from'
            },
          },
        };
        return callback(null, usage);
      }
      break;

      case 'SCHEMA': {
        const schema = await fetchPublicJsonAsset(context, SCHEMA);
        return callback(null, schema);
      }
      break;

      case 'PROTOTYPE': {
        const prototype = await fetchPublicJsonAsset(context, PROTOTYPE);
        return callback(null, prototype);
      }
      break;

      case 'GET': {
        const resources = await read_fhir(context, FHIR_DOCUMENT_REFERENCE);

        let filtered_resources = null;
        if (event.provider_id) {
          const pid = 'Practitioner/' + event.provider_id;
          filtered_resources = resources.filter(r => r.context.related.find(e => e.reference === (pid)));
        } else {
          filtered_resources = resources;
        }

        const contents = filtered_resources.map(r => {
          return transform_fhir_to_content(r, event.provider_id);
        });

        console.log(THIS, `retrieved ${contents.length} contents for ${event.provider_id ? event.provider_id : " all providers"}`);
        return callback(null, contents);
      }
      break;

      case 'ADD': {
        assert(event.content, 'Mssing event.content!!!');
        const content = JSON.parse(event.content);
        assert(content.content_id, 'Mssing content_id!!!');
        assert(content.content_title, 'Mssing content_title!!!');
        assert(content.content_video_url, 'Mssing content_video_url!!!');

        const fhir_document_reference = transform_content_to_fhir(content);

        const resources = await read_fhir(context, FHIR_DOCUMENT_REFERENCE);
        resources.push(fhir_document_reference);

        await save_fhir(context, FHIR_DOCUMENT_REFERENCE, resources);

        console.log(THIS, `added content ${content.content_id}`);
        return callback(null, { content_id : content.content_id });
      }
      break;

      case 'REMOVE': {
        assert(event.content_id, 'Mssing event.content_id!!!');

        const resources = await read_fhir(context, FHIR_DOCUMENT_REFERENCE);
        const remainder = resources.filter(r => r.id != event.content_id);
        await save_fhir(context, FHIR_DOCUMENT_REFERENCE, remainder);

        console.log(THIS, `removed content ${event.content_id}`);
        return callback(null, { content_id : event.content_id });
      }
      break;

      case 'ASSIGN': {
        assert(event.content_id, 'Mssing event.content_id!!!');
        assert(event.provider_id, 'Mssing event.provider_id!!!');

        const resources = await read_fhir(context, FHIR_DOCUMENT_REFERENCE);
        const i = resources.findIndex(r => r.id === event.content_id);
        if (i > -1) {
          resources[i].context.related.push({reference: 'Practitioner/' + event.provider_id});
          await save_fhir(context, FHIR_DOCUMENT_REFERENCE, resources);

          console.log(THIS, `assigned content ${event.content_id} provider ${event.provider_id}`);
        } else {
          console.log(THIS, `no  content ${event.content_id}`);
        }

        return callback(null, {
          content_id : event.content_id,
          provider_id: event.provider_id,
        });
      }
      break;

      case 'UNASSIGN': {
        assert(event.content_id, 'Mssing event.content_id!!!');
        assert(event.provider_id, 'Mssing event.provider_id!!!');

        const resources = await read_fhir(context, FHIR_DOCUMENT_REFERENCE);
        const i = resources.findIndex(r => r.id === event.content_id);
        if (i > -1) {
          const providers = resources[i].context.related.filter(e => e.reference !== 'Practitioner/' + event.provider_id);
          resources[i].context.related = providers;
          await save_fhir(context, FHIR_DOCUMENT_REFERENCE, resources);

          console.log(THIS, `unassigned content ${event.content_id} provider ${event.provider_id}`);
        } else {
          console.log(THIS, `no content ${event.content_id}`);
        }

        return callback(null, {
          content_id : event.content_id,
          provider_id: event.provider_id,
        });
      }
        break;

      default: // unknown action
        throw Error(`Unknown action: ${action}!!!`);
    }

  } catch (err) {
    console.log(THIS, err);
    return callback(err);
  } finally {
    console.timeEnd(THIS);
  }
}

