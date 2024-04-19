require('dotenv').config();
const authentication = require('../proxies/authenticateApi');
const getConversations = require('./functions/get-conversation');
const { getObjectDisconnection, getAlertDisconnection, getTransferredDisconnection } = require('./functions/get-conversation-detail');
const getNoRepondingConversations = require('./functions/get-no-reponding-conversatios');
const getTrasnferredConversations = require('./functions/get-transferred-conversations');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const orgRegion = process.env.ORG_REGION;

const disconnetionRport  = async () => {
  
  const token = await authentication.authenticate(clientId, clientSecret, orgRegion);
//   console.log(await getConversations());
//   console.log(await getActiveUsers());
//   console.log(await getConversationId())
//   console.log(await getValidConversation())
// console.log(await getObjectDisconnection())
// console.log(await getNoRepondingConversations())
// console.log(await getTrasnferredConversations())
// console.log(await getAlertDisconnection())
// console.log(await getTransferredDisconnection())
}

disconnetionRport();