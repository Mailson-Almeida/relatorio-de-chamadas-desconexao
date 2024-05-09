const platformClient = require('purecloud-platform-client-v2');
const getConversations = require('./get-conversation');
const getNoRepondingConversations = require('./get-no-reponding-conversatios');
const getTrasnferredConversations = require('./get-transferred-conversations');

function getObjectDisconnection (arrayIntervalConversation){
    const conversationsObject = arrayIntervalConversation;
    const objectConstrution = conversationsObject.map(objConversation => {
        return {
            idConversation_genesys: objConversation.conversationId,
            date: objConversation.conversationStart,
            client:objConversation.participants
            .filter((participant) => participant.purpose === 'customer')
            .reverse().map(dnis => {
                if(dnis.sessions[0].direction === 'outbound'){
                    return dnis.sessions[0].dnis
                }
                if(dnis.sessions[0].direction === 'inbound'){
                    return dnis.sessions[0].ani
                }
            })[0],
            agent_id: objConversation.participants
            .filter((participant) => participant.purpose === 'agent')
            .reverse()[0].userId,
            direction: objConversation.originatingDirection,
            flow: objConversation.participants.filter(flow =>flow.purpose ==='agent').
            map(flowName =>flowName.sessions[0].segments[0])[0].queueId,
            duration: objConversation.participants.filter(participant => participant.purpose === 'agent')
            .reverse()
            .filter(agent =>{
                if(agent.sessions[0].segments.some(segment =>{
                    if(segment.segmentType === "wrapup"){
                        return true
                    }
                })){
                    return agent
                }
            })[0].sessions[0].metrics.filter(metric =>{
                if(metric.name === 'tTalk'){
                    return metric.value
                }
            })[0].value,
            disconnectType: objConversation.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            }).reverse().filter(agent =>{
                if(agent.sessions[0].segments.some(segment =>{
                    if(segment.segmentType === "wrapup"){
                        return true
                    }
                })){
                    return agent
                }
            })[0].sessions[0].segments.filter(wrapCode =>{
                if(wrapCode.segmentType === 'wrapup'){
                    return wrapCode.wrapUpCode
                }
            })[0].disconnectType
            // tab: objConversation.participants.filter(participant =>{
            //     if(participant.purpose === 'agent'){
            //         return participant
            //     }
            // })[0].sessions[0].segments.filter(type =>{
            //     return type.segmentType === 'wrapup'
            // })[0].wrapUpCode
         }
    })
    return objectConstrution
}

// async function getObjectDisconnection (){
//     const conversationsObject = [{
//         "conversationEnd": "2024-04-29T17:38:17.974Z",
//   "conversationId": "32d23263-e5bd-4567-bff3-143e38f7b095",
//   "conversationStart": "2024-04-29T17:30:43.090Z",
//   "divisionIds": [
//     "5b703b3e-b3d6-4733-994e-bf09ceecd1a1",
//     "d72e496f-c880-46a1-a9a1-964553bba379",
//     "bb150765-0427-47c1-a541-4460d0032ef0"
//   ],
//   "mediaStatsMinConversationMos": 4.311158090508609,
//   "mediaStatsMinConversationRFactor": 77.44288635253906,
//   "originatingDirection": "inbound",
//   "participants": [
//     {
//       "externalContactId": "d281ff23-af8a-48da-8ce3-7a7296405d4d",
//       "participantId": "d3d039dd-f1c5-482f-944d-90a5f184b503",
//       "participantName": "51999599880",
//       "purpose": "customer",
//       "sessions": [
//         {
//           "activeSkillIds": [
//             "f001e992-b736-49dd-bf9a-1324e1f9759e"
//           ],
//           "ani": "tel:+5551999599880",
//           "direction": "inbound",
//           "dnis": "tel:+559830208562",
//           "edgeId": "b5713e32-7dd1-4c16-a149-0e7661f2f57e",
//           "mediaType": "voice",
//           "protocolCallId": "0bd86ddf-80f1-123d-efa8-0050569c1a86",
//           "provider": "Edge",
//           "recording": true,
//           "remoteNameDisplayable": "51999599880",
//           "requestedRoutings": [
//             "Standard"
//           ],
//           "selectedAgentId": "2eb54224-120e-47b0-aab1-8c2daeac20d9",
//           "sessionDnis": "tel:+559830208562",
//           "sessionId": "cf755403-a3f3-486d-a4c2-6439ef5a4df4",
//           "usedRouting": "Standard",
//           "mediaEndpointStats": [
//             {
//               "codecs": [
//                 "audio/opus"
//               ],
//               "eventTime": "2024-04-29T17:31:47.695Z",
//               "maxLatencyMs": 30,
//               "minMos": 4.882297875211306,
//               "minRFactor": 92.4387435913086,
//               "receivedPackets": 3225
//             },
//             {
//               "codecs": [
//                 "audio/opus"
//               ],
//               "eventTime": "2024-04-29T17:32:00.130Z",
//               "maxLatencyMs": 30,
//               "minMos": 4.882857358616802,
//               "minRFactor": 92.46318817138672,
//               "receivedPackets": 620
//             },
//             {
//               "codecs": [
//                 "audio/PCMU"
//               ],
//               "eventTime": "2024-04-29T17:38:15.024Z",
//               "maxLatencyMs": 55,
//               "minMos": 4.311158090508609,
//               "minRFactor": 88.90116119384766,
//               "receivedPackets": 18964
//             },
//             {
//               "codecs": [
//                 "audio/opus"
//               ],
//               "eventTime": "2024-04-29T17:38:15.075Z",
//               "maxLatencyMs": 69,
//               "minMos": 4.874417618540903,
//               "minRFactor": 92.09935760498047,
//               "receivedPackets": 18746
//             }
//           ],
//           "metrics": [
//             {
//               "emitDate": "2024-04-29T17:30:43.320Z",
//               "name": "nConnected",
//               "value": 1
//             },
//             {
//               "emitDate": "2024-04-29T17:38:14.971Z",
//               "name": "tConnected",
//               "value": 451651
//             }
//           ],
//           "segments": [
//             {
//               "conference": false,
//               "segmentEnd": "2024-04-29T17:30:43.320Z",
//               "segmentStart": "2024-04-29T17:30:43.077Z",
//               "segmentType": "system"
//             },
//             {
//               "conference": false,
//               "disconnectType": "endpoint",
//               "q850ResponseCodes": [
//                 16
//               ],
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:38:14.971Z",
//               "segmentStart": "2024-04-29T17:30:43.320Z",
//               "segmentType": "interact"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "participantId": "01179df0-fd39-419d-ad53-9196fe03191e",
//       "participantName": "EQT Dist - Ilhas - Ouvidoria Vs 2.7",
//       "purpose": "ivr",
//       "sessions": [
//         {
//           "ani": "tel:+5551999599880",
//           "direction": "inbound",
//           "dnis": "tel:+559830208562",
//           "edgeId": "b06369a1-3831-4ff8-bcb0-2445dacc47bb",
//           "mediaType": "voice",
//           "peerId": "cf755403-a3f3-486d-a4c2-6439ef5a4df4",
//           "protocolCallId": "79258107-45f1-4b6d-85e0-481a58bb766a",
//           "provider": "Edge",
//           "remote": "51999599880",
//           "remoteNameDisplayable": "São Luís, Brazil",
//           "sessionDnis": "tel:+559830208562",
//           "sessionId": "15c2f388-0bf4-455b-8471-20489194a644",
//           "mediaEndpointStats": [
//             {
//               "codecs": [
//                 "audio/opus"
//               ],
//               "eventTime": "2024-04-29T17:31:47.677Z",
//               "maxLatencyMs": 49,
//               "minMos": 4.35977368854823,
//               "minRFactor": 77.44288635253906,
//               "receivedPackets": 3221
//             }
//           ],
//           "flow": {
//             "endingLanguage": "pt-br",
//             "entryReason": "tel:+559830208562",
//             "entryType": "dnis",
//             "exitReason": "TRANSFER",
//             "flowId": "19993269-789e-4f58-851e-502acccfe7e9",
//             "flowName": "EQT Dist - Ilhas - Ouvidoria Vs 2.7",
//             "flowType": "INBOUNDCALL",
//             "flowVersion": "5.0",
//             "startingLanguage": "pt-br",
//             "transferTargetAddress": "39988345-a7c5-4ce5-851e-334cb54efc79",
//             "transferTargetName": "EQT Dist - Ouvidoria - RS",
//             "transferType": "ACD"
//           },
//           "metrics": [
//             {
//               "emitDate": "2024-04-29T17:30:43.325Z",
//               "name": "nFlow",
//               "value": 1
//             },
//             {
//               "emitDate": "2024-04-29T17:31:47.622Z",
//               "name": "tIvr",
//               "value": 64488
//             },
//             {
//               "emitDate": "2024-04-29T17:31:47.625Z",
//               "name": "tFlow",
//               "value": 64300
//             },
//             {
//               "emitDate": "2024-04-29T17:31:47.625Z",
//               "name": "tFlowExit",
//               "value": 64300
//             }
//           ],
//           "segments": [
//             {
//               "conference": false,
//               "segmentEnd": "2024-04-29T17:30:43.134Z",
//               "segmentStart": "2024-04-29T17:30:43.090Z",
//               "segmentType": "system"
//             },
//             {
//               "conference": false,
//               "disconnectType": "transfer",
//               "segmentEnd": "2024-04-29T17:31:47.622Z",
//               "segmentStart": "2024-04-29T17:30:43.134Z",
//               "segmentType": "ivr"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "participantId": "7fb7130d-e76c-450f-8bcd-72a730bacb0a",
//       "participantName": "EQT Dist - Ouvidoria - RS",
//       "purpose": "acd",
//       "sessions": [
//         {
//           "activeSkillIds": [
//             "f001e992-b736-49dd-bf9a-1324e1f9759e"
//           ],
//           "ani": "tel:+5551999599880",
//           "destinationAddresses": [
//             "sip:simone.oliveira%40equatorialservicos.com.br@localhost"
//           ],
//           "direction": "inbound",
//           "dnis": "tel:+559830208562",
//           "edgeId": "a4e3664a-fef2-4abe-82c9-dab88a7cb1de",
//           "flowInType": "ivr",
//           "mediaType": "voice",
//           "peerId": "cf755403-a3f3-486d-a4c2-6439ef5a4df4",
//           "protocolCallId": "828040b7-736e-4e89-aa54-9c7c29a08d72",
//           "provider": "Edge",
//           "remote": "51999599880",
//           "remoteNameDisplayable": "EQT Dist - Ouvidoria - RS",
//           "requestedRoutings": [
//             "Standard"
//           ],
//           "selectedAgentId": "2eb54224-120e-47b0-aab1-8c2daeac20d9",
//           "sessionDnis": "tel:+559830208562",
//           "sessionId": "6c3f058d-27ac-4b5b-889b-aed3ec88a149",
//           "usedRouting": "Standard",
//           "mediaEndpointStats": [
//             {
//               "codecs": [
//                 "audio/opus"
//               ],
//               "eventTime": "2024-04-29T17:32:00.115Z",
//               "maxLatencyMs": 30,
//               "minMos": 4.882688926883555,
//               "minRFactor": 92.45581817626953,
//               "receivedPackets": 620
//             }
//           ],
//           "flow": {
//             "flowId": "163ef82f-d77a-43c2-a7f7-3a4c62767d02",
//             "flowName": "EQTL - Definir Prioridade de Chamada em fila Vs1",
//             "flowType": "INQUEUECALL",
//             "flowVersion": "15.0",
//             "startingLanguage": "pt-br"
//           },
//           "metrics": [
//             {
//               "emitDate": "2024-04-29T17:31:47.652Z",
//               "name": "nOffered",
//               "value": 1
//             },
//             {
//               "emitDate": "2024-04-29T17:32:00.063Z",
//               "name": "tAcd",
//               "value": 12411
//             }
//           ],
//           "segments": [
//             {
//               "conference": false,
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:31:47.652Z",
//               "segmentStart": "2024-04-29T17:31:47.638Z",
//               "segmentType": "delay"
//             },
//             {
//               "conference": false,
//               "disconnectType": "transfer",
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:32:00.063Z",
//               "segmentStart": "2024-04-29T17:31:47.652Z",
//               "segmentType": "interact",
//               "sipResponseCodes": [
//                 410
//               ]
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "participantId": "dd15dcc6-e122-49fc-9107-a8d46317e680",
//       "purpose": "agent",
//       "userId": "8dd0819f-9903-4913-85dd-22b10c388859",
//       "sessions": [
//         {
//           "activeSkillIds": [
//             "f001e992-b736-49dd-bf9a-1324e1f9759e"
//           ],
//           "ani": "tel:+5551999599880",
//           "direction": "inbound",
//           "dnis": "tel:+559830208562",
//           "edgeId": "b06369a1-3831-4ff8-bcb0-2445dacc47bb",
//           "mediaType": "voice",
//           "peerId": "cf755403-a3f3-486d-a4c2-6439ef5a4df4",
//           "protocolCallId": "c2b0d960-45a3-405e-ac2f-28c1e33eee86",
//           "provider": "Edge",
//           "remote": "51999599880",
//           "requestedRoutings": [
//             "Standard"
//           ],
//           "selectedAgentId": "2eb54224-120e-47b0-aab1-8c2daeac20d9",
//           "sessionDnis": "sip:65a5609eefe87a1b57549613+equatorial.orgspan.com;tgrp=7ec137ee-059c-4df9-9551-c135d311c6ef;trunk-context=equatorial@localhost",
//           "sessionId": "42674c26-8a14-4c48-b0be-a27ccdb128be",
//           "usedRouting": "Standard",
//           "metrics": [
//             {
//               "emitDate": "2024-04-29T17:31:55.377Z",
//               "name": "nError",
//               "value": 1
//             },
//             {
//               "emitDate": "2024-04-29T17:31:55.377Z",
//               "name": "tAlert",
//               "value": 7421
//             },
//             {
//               "emitDate": "2024-04-29T17:31:55.377Z",
//               "name": "tNotResponding",
//               "value": 7421
//             },
//             {
//               "emitDate": "2024-04-29T17:32:52.789Z",
//               "name": "tAcw",
//               "value": 57000
//             },
//             {
//               "emitDate": "2024-04-29T17:32:52.789Z",
//               "name": "tHandle",
//               "value": 57000
//             }
//           ],
//           "segments": [
//             {
//               "conference": false,
//               "disconnectType": "client",
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:31:55.377Z",
//               "segmentStart": "2024-04-29T17:31:47.956Z",
//               "segmentType": "alert"
//             },
//             {
//               "conference": false,
//               "disconnectType": "client",
//               "errorCode": "error.ininedgecontrol.session.inactive",
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:32:56.626Z",
//               "segmentStart": "2024-04-29T17:31:55.626Z",
//               "segmentType": "wrapup",
//               "wrapUpCode": "659abad8-a6ef-4f03-abde-0346b6b2e814"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "participantId": "a845c325-d129-40b2-bf7e-12e4584892c2",
//       "purpose": "agent",
//       "userId": "2eb54224-120e-47b0-aab1-8c2daeac20d9",
//       "sessions": [
//         {
//           "activeSkillIds": [
//             "f001e992-b736-49dd-bf9a-1324e1f9759e"
//           ],
//           "ani": "tel:+5551999599880",
//           "direction": "inbound",
//           "dnis": "tel:+559830208562",
//           "edgeId": "b06369a1-3831-4ff8-bcb0-2445dacc47bb",
//           "mediaType": "voice",
//           "peerId": "cf755403-a3f3-486d-a4c2-6439ef5a4df4",
//           "protocolCallId": "0c73370e-f177-4d78-9d83-95c0b01b4379",
//           "provider": "Edge",
//           "remote": "51999599880",
//           "requestedRoutings": [
//             "Standard"
//           ],
//           "selectedAgentId": "2eb54224-120e-47b0-aab1-8c2daeac20d9",
//           "sessionDnis": "sip:65a560a1e2193b1b6492d64f+equatorial.orgspan.com;tgrp=7ec137ee-059c-4df9-9551-c135d311c6ef;trunk-context=equatorial@localhost",
//           "sessionId": "ea6e6341-bc32-4ae7-86be-b00e81b754fa",
//           "usedRouting": "Standard",
//           "mediaEndpointStats": [
//             {
//               "codecs": [
//                 "audio/opus"
//               ],
//               "eventTime": "2024-04-29T17:38:15.008Z",
//               "maxLatencyMs": 50,
//               "minMos": 4.865783248046027,
//               "minRFactor": 91.73738098144531,
//               "receivedPackets": 18750
//             },
//             {
//               "codecs": [
//                 "audio/opus"
//               ],
//               "eventTime": "2024-04-29T17:38:15.013Z",
//               "maxLatencyMs": 61,
//               "minMos": 4.87860357294281,
//               "minRFactor": 92.27851104736328,
//               "receivedPackets": 18748
//             }
//           ],
//           "metrics": [
//             {
//               "emitDate": "2024-04-29T17:32:00.080Z",
//               "name": "tAlert",
//               "value": 2364
//             },
//             {
//               "emitDate": "2024-04-29T17:32:00.080Z",
//               "name": "tAnswered",
//               "value": 12411
//             },
//             {
//               "emitDate": "2024-04-29T17:38:14.974Z",
//               "name": "tTalk",
//               "value": 374894
//             },
//             {
//               "emitDate": "2024-04-29T17:38:14.974Z",
//               "name": "tTalkComplete",
//               "value": 374894
//             },
//             {
//               "emitDate": "2024-04-29T17:38:17.974Z",
//               "name": "tAcw",
//               "value": 3000
//             },
//             {
//               "emitDate": "2024-04-29T17:38:17.974Z",
//               "name": "tHandle",
//               "value": 377894
//             }
//           ],
//           "segments": [
//             {
//               "conference": false,
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:32:00.080Z",
//               "segmentStart": "2024-04-29T17:31:57.716Z",
//               "segmentType": "alert"
//             },
//             {
//               "conference": false,
//               "disconnectType": "peer",
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:38:14.974Z",
//               "segmentStart": "2024-04-29T17:32:00.080Z",
//               "segmentType": "interact"
//             },
//             {
//               "conference": false,
//               "disconnectType": "peer",
//               "q850ResponseCodes": [
//                 16
//               ],
//               "queueId": "39988345-a7c5-4ce5-851e-334cb54efc79",
//               "requestedRoutingSkillIds": [
//                 "f001e992-b736-49dd-bf9a-1324e1f9759e"
//               ],
//               "segmentEnd": "2024-04-29T17:38:17.974Z",
//               "segmentStart": "2024-04-29T17:38:14.974Z",
//               "segmentType": "wrapup",
//               "wrapUpCode": "ININ-WRAP-UP-TIMEOUT"
//             }
//           ]
//         }
//       ]
//     }
//   ]
//     }];
//     const objectConstrution = conversationsObject.map(objConversation => {
//         return {
//             idConversation_genesys: objConversation.conversationId,
//             date: objConversation.conversationStart,
//             client:objConversation.participants
//             .filter((participant) => participant.purpose === 'customer')
//             .reverse().map(dnis => {
//                 if(dnis.sessions[0].direction === 'outbound'){
//                     return dnis.sessions[0].dnis
//                 }
//                 if(dnis.sessions[0].direction === 'inbound'){
//                     return dnis.sessions[0].ani
//                 }
//             })[0],
//             agent_id: objConversation.participants
//             .filter((participant) => participant.purpose === 'agent')
//             .reverse()[0].userId,
//             direction: objConversation.originatingDirection,
//             flow: objConversation.participants.filter(flow =>flow.purpose ==='agent').
//             map(flowName =>flowName.sessions[0].segments[0])[0].queueId,
//             duration: objConversation.participants.filter(participant => participant.purpose === 'agent')
//             .reverse()
//             .filter(agent =>{
//                 if(agent.sessions[0].segments.some(segment =>{
//                     if(segment.segmentType === "wrapup"){
//                         return true
//                     }
//                 })){
//                     return agent
//                 }
//             })[0].sessions[0].metrics.filter(metric =>{
//                 if(metric.name === 'tTalk'){
//                     return metric.value
//                 }
//             })[0].value,
//             disconnectType: objConversation.participants.filter(participant =>{
//                 if(participant.purpose === 'agent'){
//                     return participant
//                 }
//             }).reverse().filter(agent =>{
//                 if(agent.sessions[0].segments.some(segment =>{
//                     if(segment.segmentType === "wrapup"){
//                         return true
//                     }
//                 })){
//                     return agent
//                 }
//             })[0].sessions[0].segments.filter(wrapCode =>{
//                 if(wrapCode.segmentType === 'wrapup'){
//                     return wrapCode.wrapUpCode
//                 }
//             })[0].disconnectType
//             // tab: objConversation.participants.filter(participant =>{
//             //     if(participant.purpose === 'agent'){
//             //         return participant
//             //     }
//             // })[0].sessions[0].segments.filter(type =>{
//             //     return type.segmentType === 'wrapup'
//             // })[0].wrapUpCode
//          }
//     })
//     return objectConstrution
// }

function getAlertDisconnection (arrayNotRespondingConversations){

    const alertConversations = arrayNotRespondingConversations;

    const objAlertConversation = alertConversations.map(ObjConversationAlert =>{

        return {
            idConversation_genesys: ObjConversationAlert.conversationId,
            date: ObjConversationAlert.conversationStart,
            client: ObjConversationAlert.conversationId,
            date: ObjConversationAlert.conversationStart,
            client: ObjConversationAlert.participants.filter(participant =>{
                if(participant.purpose === 'customer'){
                    return participant
                }
            })[0].sessions[0].dnis,
            agent_id: ObjConversationAlert.participants.filter(participant =>{
                if(participant.purpose === 'agent'){
                    return participant
                }
            }).filter(agent =>{
                if(agent.sessions[0].metrics[1].name === 'tNotResponding'){
                    return agent
                }
            }).reverse().map(idUser => {
                if(idUser.purpose === 'agent' && idUser.userId){
                    return idUser.userId
                }
            })[0],
            direction: ObjConversationAlert.originatingDirection,
            flow: ObjConversationAlert.participants.filter(flow =>flow.purpose ==='agent').
            map(flowName =>flowName.sessions[0].segments[0])[0].queueId,
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
            // tab: 'N/A'

        }
    })

    return objAlertConversation
}

function getTransferredDisconnection (arrayTransferredConversations){

    const transferredConversations = arrayTransferredConversations;

    const objTransferredConversations = transferredConversations.map(objConversationsTransfered =>{
        
        return {
            idConversation_genesys: objConversationsTransfered.conversationId,
            date: objConversationsTransfered.conversationStart,
            client: objConversationsTransfered.conversationId,
            date: objConversationsTransfered.conversationStart,
            client: objConversationsTransfered.participants.filter(participant =>{
                if(participant.purpose === 'customer'){
                    return participant
                }
            })[0].sessions[0].dnis,
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
            flow: objConversationsTransfered.participants.filter(flow =>flow.purpose ==='agent').
            map(flowName =>flowName.sessions[0].segments[0])[0].queueId,
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
                if(metric.name === 'tTalk'){
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
            // tab: objConversationsTransfered.participants.filter(participant =>{
            //     if(participant.purpose === 'agent'){
            //         return participant
            //     }
            // }).filter(agent =>{
            //     if(agent.sessions[0].segments.some(segment =>{
            //         if(segment.disconnectType === 'transfer' && segment.segmentType === "wrapup"){
            //             return true
            //         }
            //     })){
            //         return agent
            //     }
            // })[0].sessions[0].segments.filter(wrapCode =>{
            //     if(wrapCode.segmentType === 'wrapup'){
            //         return wrapCode.wrapUpCode
            //     }
            // })[0].wrapUpCode

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
