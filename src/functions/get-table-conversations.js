const platformClient = require('purecloud-platform-client-v2');
const { getAlertDisconnection, getTransferredDisconnection, tagDisconnection, getObjectDisconnection } = require('./get-conversation-detail');
const { getUsersName, getActiveUsers } = require('./get-actives-users');
const {formatISO} = require('date-fns');
const { getQueues, getQueueName } = require('../utilities/get-flow-name');




function alertConversations(arrayConversation, users, flowList) {
    
   const alertConversations =  arrayConversation;
   const activeUsers = users;
   const queuesList = flowList;
   
  const result = 
    alertConversations.map(conversation => {
      return {
        id_genesys: conversation.idConversation_genesys,
        telefone_cliente: conversation.client,
        nome_agente: getUsersName(conversation.agent_id, activeUsers),
        data: formatISO(conversation.date, { representation: 'date' }),
        direcao: conversation.direction,
        fila: getQueueName(conversation.flow, queuesList),
        duracao_chamada: conversation.duration,
        desconexao: conversation.disconnectType === "alert" ? "Alerta Genesys": "N/A"
      };
    })
  ;

  return result;
}


function transferredConversations(arrayConversation, users, flowList) {
    
    const alertConversations =  arrayConversation;
    const activeUsers = users;
    const queuesList = flowList;
    
   const result = 
     alertConversations.map(conversation => {
       return {
         id_genesys: conversation.idConversation_genesys,
         telefone_cliente: conversation.client,
         nome_agente: getUsersName(conversation.agent_id, activeUsers),
         data: formatISO(conversation.date, { representation: 'date' }),
         direcao: conversation.direction,
         fila: getQueueName(conversation.flow, queuesList),
         duracao_chamada: conversation.duration,
         desconexao: conversation.disconnectType === "transfer" ? "Transferência" : "N/A"
       };
     })
   ;
 
   return result;
 }

 function intervalConversations(arrayConversation, users, flowList) {
    // utilizar os paramentros após para criar a execução d aRPA
    const alertConversations =  arrayConversation
    const activeUsers = users
    const queuesList = flowList
    
   const result = 
     alertConversations.map(conversation => {
       return {
         id_genesys: conversation.idConversation_genesys,
         telefone_cliente: conversation.client,
         nome_agente: getUsersName(conversation.agent_id, activeUsers),
         data: formatISO(conversation.date, { representation: 'date' }),
         direcao: conversation.direction,
         fila: getQueueName(conversation.flow, queuesList),
         duracao_chamada: conversation.duration,
         desconexao: tagDisconnection(conversation.disconnectType)
       };
     })
   ;
 
   return result;
 }

module.exports = {alertConversations, transferredConversations, intervalConversations}