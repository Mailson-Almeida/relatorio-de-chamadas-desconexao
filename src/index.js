require('dotenv').config();
const authentication = require('../proxies/authenticateApi');
const {select} = require('./data/query-builder-db');
const { getUsersName, getActiveUsers } = require('./functions/get-actives-users');
const getConversations = require('./functions/get-conversation');
const { getObjectDisconnection, getAlertDisconnection, getTransferredDisconnection } = require('./functions/get-conversation-detail');
const getNoRepondingConversations = require('./functions/get-no-reponding-conversatios');
const {alertConversations, transferredConversations, intervalConversations} = require('./functions/get-table-conversations');
const getTrasnferredConversations = require('./functions/get-transferred-conversations');
const {insertTrasferredConversation } = require('./data/query-builder-db');
const getYesterdayInterval = require('./functions/get-yesterday');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const orgRegion = process.env.ORG_REGION;

const disconnetionRport  = async () => {
  
  const token = await authentication.authenticate(clientId, clientSecret, orgRegion);
//   console.log(await getConversations());
  // console.log(await getActiveUsers());
//   console.log(await getConversationId())
//   console.log(await getValidConversation())
// console.log((await getTransferredDisconnection()).map( user =>{
  // return user.agent_id;
// }))
// console.log(await getNoRepondingConversations())
// console.log(await getTrasnferredConversations());
// console.log(await getAlertDisconnection())
// console.log(await getTransferredDisconnection())
// 

// console.log(await alertConversations())
console.log((await transferredConversations()))
// console.log(await intervalConversations())
// console.log(await getObjectDisconnection())

// console.log(await select());

// console.log(await insertTrasferredConversation());

// console.log( getUsersName("c480d1c5-17c8-4741-8103-29431d826d19"))

// console.log (getYesterdayInterval())
}

disconnetionRport();