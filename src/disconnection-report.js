const platformClient = require('purecloud-platform-client-v2');
const { authenticate } = require('../proxies/authenticateApi');
const { getActiveUsers } = require('./functions/get-actives-users');
const getConversations = require('./functions/get-conversation');
const { getQueues } = require('./utilities/get-flow-name');
const getNoRepondingConversations = require('./functions/get-no-reponding-conversatios');
const getTrasnferredConversations = require('./functions/get-transferred-conversations');
const { getAlertDisconnection, getTransferredDisconnection, getObjectDisconnection } = require('./functions/get-conversation-detail');
const { alertConversations, transferredConversations, intervalConversations } = require('./functions/get-formatted-conversations');
const { insertNoRepondingConversations, insertTrasferredConversation, insertDataBanch, insertLogErros } = require('./data/query-builder-db');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const orgRegion = process.env.ORG_REGION;

let step = '';

async function disconnectTypeAgents () { 

///* ###############################################################################
/// Início etapa de coleta de dados via API 

step = 'autenticate';
const token = await authenticate(clientId, clientSecret, orgRegion);

step = 'getUsers';
const activeUsers =  await getActiveUsers();

step = 'getQueue'
const queueList = await getQueues();

step = 'getConversationInterval';
const conversationsInterval = await getConversations();

step = 'getNotRespondingConversations';
const NotRespondingConversations = await getNoRepondingConversations();

step = 'getTransferredConversations';
const transferedConversations = await getTrasnferredConversations();

///* ###############################################################################
/// Fim da etapa de coleta de dados via API  

///* ###############################################################################
/// Início etapa de seleção e tramento dos dados coletados via API  

step = 'getAlertDisconnection';
const alertDisconnection = getAlertDisconnection(NotRespondingConversations);

step = 'getTransferredDisconnection';
const transferDisconnection = getTransferredDisconnection(transferedConversations);

step = 'getObjectDisconnection';
const conversationDisconnection = getObjectDisconnection(conversationsInterval);


///* ###############################################################################
/// Fim etapa de seleção e tramento dos dados coletados via API*/


///* ###############################################################################
/// Início etapa de fromatação dos dados para inserção no banco */

step = 'formatedAlertConversation';
const alertConversationsFormatted = alertConversations(alertDisconnection, activeUsers, queueList);

step = 'formatedTransferredConversations';
const transferredConversationsFormatted = transferredConversations(transferDisconnection, activeUsers, queueList);

step = 'formatedIntervalConversations';
const intervalConversationsFormatted = intervalConversations(conversationDisconnection, activeUsers, queueList);

///* ###############################################################################
// Fim etapa de fromatação dos dados para inserção no banco 


///* ###############################################################################
// Início etapda inserção no banco de dados

step = 'insertAlertConversationsDB';
await insertNoRepondingConversations(alertConversationsFormatted);

step = 'insertTransfrerredConversationsDB';
await insertTrasferredConversation(transferredConversationsFormatted);

step = 'insertIntervalConversations';
await insertDataBanch(intervalConversationsFormatted);

///* ###############################################################################
// Fim etapda inserção no banco de dados
};
const getStep = async () => {
    try {
        return step;
    } catch (error) {
        console.error("Erro ao obter o passo:", error);
        throw error;
    }
};

module.exports = {disconnectTypeAgents, getStep};