const platformClient = require('purecloud-platform-client-v2');
const { getAlertDisconnection, getTransferredDisconnection, tagDisconnection, getObjectDisconnection } = require('./get-conversation-detail');
const { getUsersName, getActiveUsers } = require('./get-actives-users');
const {formatISO} = require('date-fns');



async function alertConversations() {
    
   const alertConversations =  await getAlertDisconnection();
   const activeUsers = await getActiveUsers();
   
  const result = 
    alertConversations.map(conversation => {
      return {
        id_gnesys: conversation.idConversation_genesys,
        telefone_cliente: conversation.client,
        nome_agente: getUsersName(conversation.agent_id, activeUsers),
        data: formatISO(conversation.date, { representation: 'date' }),
        direcao: conversation.direction,
        fila: conversation.flow,
        duracao_chamada: conversation.duration,
        desconexao: conversation.disconnectType === "alert" ? "Alerta Genesys": "N/A"
      };
    })
  ;

  return result;
}


async function transferredConversations() {
    
    const alertConversations =  await getTransferredDisconnection();
    const activeUsers = await getActiveUsers();
    
   const result = 
     alertConversations.map(conversation => {
       return {
         id_genesys: conversation.idConversation_genesys,
         telefone_cliente: conversation.client,
         nome_agente: getUsersName(conversation.agent_id, activeUsers),
         data: formatISO(conversation.date, { representation: 'date' }),
         direcao: conversation.direction,
         fila: conversation.flow,
         duracao_chamada: conversation.duration,
         desconexao: conversation.disconnectType === "transfer" ? "Transferência" : "N/A"
       };
     })
   ;
 
   return result;
 }

 async function intervalConversations() {
    
    const alertConversations =  await getObjectDisconnection();
    const activeUsers = await getActiveUsers();
    
   const result = 
     alertConversations.map(conversation => {
       return {
         id_genesys: conversation.idConversation_genesys,
         telefone_cliente: conversation.client,
         nome_agente: getUsersName(conversation.agent_id, activeUsers),
         data: formatISO(conversation.date, { representation: 'date' }),
         direcao: conversation.direction,
         fila: conversation.flow,
         duracao_chamada: conversation.duration,
         desconexao: tagDisconnection(conversation.disconnectType)
       };
     })
   ;
 
   return result;
 }

module.exports = {alertConversations, transferredConversations, intervalConversations}