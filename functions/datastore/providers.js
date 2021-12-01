/*
 * --------------------------------------------------------------------------------
 * manage providers including storage to EHR
 *
 * event parameters:
 * .action: USAGE|SCHEMA|PROTOTYPE|GET, default USAGE
 * --------------------------------------------------------------------------------
 */

const SCHEMA = '/datastore/provider-schema.json';
const PROTOTYPE = '/datastore/provider-prototype.json';
const FHIR_PRACTITIONER = 'Practitioners';
const FHIR_PRACTITIONER_ROLE = 'PractitionerRoles';

const assert = require("assert");
const { getParam, fetchPublicJsonAsset } = require(Runtime.getFunctions()['helpers'].path);
const { selectSyncDocument } = require(Runtime.getFunctions()['datastore/datastore-helpers'].path);

// --------------------------------------------------------------------------------
async function read_fhir(context, resourceType, simulate = true) {
  if (!simulate) throw new Error('live retrieval from EHR not implemented');
  const TWILIO_SYNC_SID = await getParam(context, 'TWILIO_SYNC_SID');

  const bundle = await selectSyncDocument(context, TWILIO_SYNC_SID, resourceType);
  assert(bundle.total === bundle.entry.length, 'bundle checksum error!!!');

  return bundle.entry;
}

// --------------------------------------------------------------------------------
function transform_fhir_to_provider(fhir_practitioner, fhir_practitioner_roles) {
  const r = fhir_practitioner;

  const pid = 'Practitioner/' + r.id;
  const match = fhir_practitioner_roles.find(e => e.practitioner.reference === pid);
  const provider = {
    provider_id: r.id,
    provider_name: r.name[0].text,
    provider_phone: r.telecom[0].value,
    provider_on_call: match ? true : false,
  };
  return provider;
}

// --------------------------------------------------------------------------------
exports.handler = async function(context, event, callback) {
  const THIS = 'providers:';
  console.time(THIS);

  const { getParam } = require(Runtime.getFunctions()['helpers'].path);
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

        const usage = {
          action: 'valid values for providers function',
          USAGE: {
            description: 'returns function signature, default action',
            parameters: {},
          },
          SCHEMA: {
            description: 'returns json schema for provider',
            parameters: {},
          },
          PROTOTYPE: {
            description: 'returns prototype of provider',
            parameters: {},
          },
          GET: {
            description: 'returns array of provider',
            parameters: {
              provider_id: 'optional, filters for specified provider',
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
        const resources = await read_fhir(context, FHIR_PRACTITIONER);
        const practitioner_roles = await read_fhir(context, FHIR_PRACTITIONER_ROLE);

        let filtered = null;
        if (event.provider_id)
          filtered = resources.filter(r => r.id === event.provider_id);
        else
          filtered = resources;

        const providers = filtered.map(r => {
          return transform_fhir_to_provider(r, practitioner_roles);
        });

        console.log(THIS, `retrieved ${providers.length} providers`);
        return callback(null, providers);
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
};
