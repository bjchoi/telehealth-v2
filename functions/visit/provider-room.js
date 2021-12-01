/* global Twilio Runtime */
'use strict';

const AccessToken = Twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;
const MAX_ALLOWED_SESSION_DURATION = 14400;

module.exports.handler = async (context, event, callback) => {
  const { ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, ROOM_TYPE, CONVERSATIONS_SERVICE_SID } = context;

  // TODO: Add Patient Auth Handler
  const authHandler = require(Runtime.getFunctions()['auth/jwt-auth-handler'].path);
  const authResult = await authHandler(context, event, callback);
  if(authResult.response) {
      return callback(null, authResult.response);
  }

  console.log("Auth result");
  console.log(authResult);

  const { room_name } = event;
  const { identity } = authResult.decoded.grants;
  let response = new Twilio.Response();
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (!identity) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing user_identity',
        explanation: 'The user_identity parameter is missing.',
      },
    });
    return callback(null, response);
  }

  if (!room_name) {
    response.setStatusCode(400);
    response.setBody({
      error: {
        message: 'missing room_name',
        explanation: 'The room_name parameter is missing. room_name is required when create_room is true.',
      },
    });
    return callback(null, response);
  }

  let responseBody = {
    roomSid: null,
    roomAvailable: false,
    conversationAvailable: false,
    token: null,
    roomType: null
  };
  if (room_name) {
    const client = context.getTwilioClient();
    let room;

    try {
      // See if a room already exists
      room = await client.video.rooms(room_name).fetch();
    } catch (e) {
      try {
        // If room doesn't exist, create it
        room = await client.video.rooms.create({ uniqueName: room_name, type: ROOM_TYPE });
      } catch (e) {
        response.setStatusCode(500);
        response.setBody({
          error: {
            message: 'error creating room',
            explanation: 'Something went wrong when creating a room.',
          },
        });
        return callback(null, response);
      }
    }

    if (room) {
      responseBody.roomSid = room.sid;
      responseBody.roomAvailable = true;
      const conversationsClient = client.conversations.services(CONVERSATIONS_SERVICE_SID);
      // TODO: Add Conversation service later
      try {
        // See if conversation already exists
        await conversationsClient.conversations(room.sid).fetch();
      } catch (e) {
        try {
          // If conversation doesn't exist, create it.
          // Here we add a timer to close the conversation after the maximum length of a room (24 hours).
          // This helps to clean up old conversations since there is a limit that a single participant
          // can not be added to more than 1,000 open conversations.
          await conversationsClient.conversations.create({ uniqueName: room.sid, 'timers.closed': 'P1D' });
        } catch (e) {
          response.setStatusCode(500);
          response.setBody({
            error: {
              message: 'error creating conversation',
              explanation: 'Something went wrong when creating a conversation.',
            },
          });
          return callback(null, response);
        }
      }

      try {
        // Add participant to conversation
        await conversationsClient.conversations(room.sid).participants.create({ identity: identity });
      } catch (e) {
        // Ignore "Participant already exists" error (50433)
        if (e.code !== 50433) {
          response.setStatusCode(500);
          response.setBody({
            error: {
              message: 'error creating conversation participant',
              explanation: 'Something went wrong when creating a conversation participant.',
            },
          });
          return callback(null, response);
        }
      }
    }
  }

  // Create token
  const token = new AccessToken(ACCOUNT_SID, TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });

  // Add participant's identity to token
  token.identity = identity;

  // Add video grant to token
  const videoGrant = new VideoGrant({ room: room_name });
  token.addGrant(videoGrant);

  // Add chat grant to token
  const chatGrant = new ChatGrant({ serviceSid: CONVERSATIONS_SERVICE_SID });
  token.addGrant(chatGrant);

  // Return token
  response.setStatusCode(200);
  responseBody.token = token.toJwt();
  responseBody.roomType = ROOM_TYPE;
  responseBody.conversationAvailable = true;
  responseBody.roomAvailable = true;
  response.setBody(responseBody);
  return callback(null, response);
};
