const platformClient = require('purecloud-platform-client-v2');
const getConversations = require('./get-conversation');
const getNoRepondingConversations = require('./get-no-reponding-conversatios');
const getTrasnferredConversations = require('./get-transferred-conversations');

async function getObjectDisconnection (){
    const conversationsObject = await getConversations();
    const objectConstrution = conversationsObject.map(objConversation => {
        return {
            idConversation_genesys: objConversation.conversationId,
            date: objConversation.conversationStart,
            client: objConversation.participants[0].sessions[0].ani,
            agent_id: objConversation.participants
            .filter((participant) => participant.purpose === 'agent')
            .reverse()[0].userId,
            direction: objConversation.originatingDirection,
            flow: objConversation.participants.filter(flow =>{
                return flow.purpose ==='acd'
            }).map(flowName =>{
                if(flowName.participantName){
                    return flowName.participantName
                }
            })[0],
            duration: objConversation.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            })[0].sessions[0].metrics.filter(metric =>{
                return metric.name === 'tHandle'
            })[0].value,
            disconnectType: objConversation.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            })[0].sessions[0].segments.filter(type =>{
                return type.segmentType === 'wrapup'
            })[0].disconnectType,
            tab: objConversation.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            })[0].sessions[0].segments.filter(type =>{
                return type.segmentType === 'wrapup'
            })[0].wrapUpCode
        }
    })
    return objectConstrution
}

async function getAlertDisconnection (){

    const alertConversations = await getNoRepondingConversations();

    const objAlertConversation = alertConversations.map(ObjConversationAlert =>{

        return {
            idConversation_genesys: ObjConversationAlert.conversationId,
            date: ObjConversationAlert.conversationStart,
            client: ObjConversationAlert.participants[0].sessions[0].ani,
            agent_id: ObjConversationAlert.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            }).filter(agent =>{
                if(agent.sessions[0].metrics[1].name === 'tNotResponding'){
                    return agent
                }
            })[0].userId,
            direction: ObjConversationAlert.originatingDirection,
            flow: ObjConversationAlert.participants.filter(flow =>{
                return flow.purpose ==='acd'
            }).map(flowName =>{
                if(flowName.participantName){
                    return flowName.participantName
                }
            })[0],
            duration: parseInt("00:00:00"),
            disconnectType: ObjConversationAlert.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            })[0].sessions[0].metrics.map(alert =>{
                if(alert.name === 'tNotResponding'){
                    return true
                }
                return 'alert'
            })[0],
            tab: 'N/A'

        }
    })

    return objAlertConversation
}

async function getTransferredDisconnection (){

    const transferredConversations = await getTrasnferredConversations();

    const objTransferredConversations = transferredConversations.map(objConversationsTransfered =>{
        
        return {
            idConversation_genesys: objConversationsTransfered.conversationId,
            date: objConversationsTransfered.conversationStart,
            client: objConversationsTransfered.participants[0].sessions[0].ani,
            agent_id: objConversationsTransfered.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            }).filter(agent =>{
                if(agent.sessions[0].segments.some(segment =>{
                    if(segment.disconnectType === 'transfer' && segment.segmentType === "wrapup"){
                        return true
                    }
                })){
                    return agent
                }
            })[0].userId,
            direction: objConversationsTransfered.originatingDirection,
            flow: objConversationsTransfered.participants.filter(flow =>{
                return flow.purpose ==='acd'
            }).map(flowName =>{
                if(flowName.participantName){
                    return flowName.participantName
                }
            })[0],
            duration: objConversationsTransfered.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            }).filter(agent =>{
                if(agent.sessions[0].segments.some(segment =>{
                    if(segment.disconnectType === 'transfer' && segment.segmentType === "wrapup"){
                        return true
                    }
                })){
                    return agent
                }
            })[0].sessions[0].metrics.filter(metric =>{
                if(metric.name === 'tHandle'){
                    return metric.value
                }
            })[0].value,
            disconnectType: objConversationsTransfered.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            }).filter(agent =>{
                if(agent.sessions[0].segments.some(segment =>{
                    if(segment.disconnectType === 'transfer' && segment.segmentType === "wrapup"){
                        return true
                    }
                })){
                    return agent
                }
            })[0].sessions[0].segments.filter(wrapCode =>{
                if(wrapCode.segmentType === 'wrapup'){
                    return wrapCode.wrapUpCode
                }
            })[0].disconnectType,
            tab: objConversationsTransfered.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            }).filter(agent =>{
                if(agent.sessions[0].segments.some(segment =>{
                    if(segment.disconnectType === 'transfer' && segment.segmentType === "wrapup"){
                        return true
                    }
                })){
                    return agent
                }
            })[0].sessions[0].segments.filter(wrapCode =>{
                if(wrapCode.segmentType === 'wrapup'){
                    return wrapCode.wrapUpCode
                }
            })[0].wrapUpCode

        }
    })

    return objTransferredConversations
}

function tagDisconnection (disconnectionType){
    
    if(disconnectionType ==='peer'){
        return 'Cliente'
    }

    if(disconnectionType === 'client'){
        return 'Agente'
    }

    if(disconnectionType === 'endpoint'){
        return 'Erro'
    }


}

module.exports = {getObjectDisconnection, getAlertDisconnection, getTransferredDisconnection, tagDisconnection}
