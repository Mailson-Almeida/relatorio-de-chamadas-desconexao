const platformClient = require('purecloud-platform-client-v2');
const  getConversations  = require('../functions/get-conversation')

async function getValidConversation(){

    const conversation = await getConversations();

        const validConversation = conversation.filter(conversation => conversation.participants.some(participant => participant.purpose === 'agent')
        ) 
        return validConversation
 }

module.exports = getValidConversation