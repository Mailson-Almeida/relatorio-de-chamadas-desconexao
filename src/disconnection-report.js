const platformClient = require('purecloud-platform-client-v2');
const { authenticate } = require('../proxies/authenticateApi');
const { getActiveUsers } = require('./functions/get-actives-users');
const getConversations = require('./functions/get-conversation');
const { getQueues } = require('./utilities/get-flow-name');
const getNoRepondingConversations = require('./functions/get-no-reponding-conversatios');
const getTrasnferredConversations = require('./functions/get-transferred-conversations');
const { getAlertDisconnection, getTransferredDisconnection, getObjectDisconnection } = require('./functions/get-conversation-detail');
const { alertConversations, transferredConversations, intervalConversations } = require('./functions/get-table-conversations');
const { insertNoRepondingConversations, insertTrasferredConversation, insertDataBanch, insertLogErros } = require('./data/query-builder-db');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const orgRegion = process.env.ORG_REGION;

let step = '';

async function disconnectTypeAgents () {
    
/* ###############################################################################
    Início etapa de coleta de dados via API  */

this.step = 'autenticate';
const token = await authenticate(clientId, clientSecret, orgRegion);

this.step = 'getUsers';
const activeUsers =  await getActiveUsers();

this.step = 'getQueue'
const queueList = await getQueues();

this.step = 'getConversationInterval'
const conversationsInterval = await getConversations();

this.step = 'getNotRespondingConversations'
const NotRespondingConversations = await getNoRepondingConversations();

this.step = 'getTransferredConversations'
const transferedConversations = await getTrasnferredConversations();

/* ###############################################################################
   Fim da etapa de coleta de dados via API  */

/* ###############################################################################
    Início etapa de seleção e tramento dos dados coletados via API  */

this.step = 'getAlertDisconnection'
const alertDisconnection = getAlertDisconnection(NotRespondingConversations);

this.step = 'getTransferredDisconnection'
const transferDisconnection = getTransferredDisconnection(transferedConversations);

this.step = 'getObjectDisconnection'
const conversationDisconnection = getObjectDisconnection(conversationsInterval);

// /* ###############################################################################
// Fim etapa de seleção e tramento dos dados coletados via API*/


// /* ###############################################################################
// Início etapa de fromatação dos dados para inserção no banco */

this.step = 'formatedTableAlertConversation'
const alertConversationsFormated = alertConversations(alertDisconnection, activeUsers, queueList);

this.step = 'formatedTableTransferredConversations'
const transferredConversationsFormated = transferredConversations(transferDisconnection, activeUsers, queueList);

this.step = 'formatedIntervalConversations'
const intervalConversationsFormated = intervalConversations(conversationDisconnection, activeUsers, queueList);

// /* ###############################################################################
// Fim etapa de fromatação dos dados para inserção no banco */


// /* ###############################################################################
// Início etapda inserção no banco de dados*/

this.step = 'insertAlertConversationsDB'
await insertNoRepondingConversations(alertConversationsFormated);

this.step = 'insertTransfrerredConversationsDB'
await insertTrasferredConversation(transferredConversationsFormated);

this.step = 'insertIntervalConversations'
await insertDataBanch(intervalConversationsFormated);

}

function getStep  (){
    return this.step
}

module.exports = disconnectTypeAgents;
module.exports = getStep;