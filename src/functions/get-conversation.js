const platformClient = require ('purecloud-platform-client-v2');
const getYesterdayInterval = require('./get-yesterday');
const conversationApi = new platformClient.ConversationsApi();

async function getConversations (){

  let pageNumber = 1;
  let pageCount = 0;
  let dayConversationList = [];

    let body = {
      "interval": getYesterdayInterval(),
      "conversationFilters": [
        {
          "type": "or",
          "predicates": [
            {
              "dimension": "divisionId",
              "value": "e82455e8-5021-4e81-953e-d1c756e9770d",
              "type": "dimension"
            },
            {
              "type": "dimension",
              "dimension": "divisionId",
              "value": "5b703b3e-b3d6-4733-994e-bf09ceecd1a1"
            },
            {
              "dimension": "divisionId",
              "value": "bb150765-0427-47c1-a541-4460d0032ef0"
            },
            {
              "dimension": "divisionId",
              "value": "a5f09a0f-a0ba-4592-80a9-d380c3e84bec"
            },
            {
              "dimension": "divisionId",
              "value": "d72e496f-c880-46a1-a9a1-964553bba379"
            },
            {
              "dimension": "divisionId",
              "value": "7fee410c-0453-4922-8796-75db045998eb"
            }
          ]
        },
        {
          "type": "and",
          "clauses": [
            {
              "type": "and",
              "predicates": [
                {
                  "metric": "tTalk",
                  "operator": "exists"
                }
              ]
            }
          ]
        }
      ],
      "segmentFilters": [
        {
          "type": "and",
          "clauses": [
            {
              "type": "and",
              "predicates": [
                {
                  "dimension": "purpose",
                  "operator": "matches",
                  "value": "agent"
                }
              ]
            }
          ]
        }
      ],
      "paging": {
        "pageSize": 100,
        "pageNumber": pageNumber
      }      
    };
    
    try {
      const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
      pageCount = Math.ceil(conversations.totalHits/body.paging.pageSize);
        while(pageNumber <= pageCount){
            const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
            dayConversationList.push(...(conversations.conversations) || []);
            pageNumber = pageNumber + 1
            body.paging.pageNumber = pageNumber
        }
        return dayConversationList

    } catch (error) {
    
        console.log("There was a failure calling converstations by divisions");
        console.error(error.message);
    }

}

// async function getConversations (){

//   let pageNumber = 1;
//   let pageCount = 0;
//   let dayConversationList = [];

//     let body = {
        
//         "paging": {
//             "pageSize": 100,
//             "pageNumber": pageNumber
//           },
//           "order": "asc",
//           "interval": getYesterdayInterval(),
//           "conversationFilters": [
//             {
//               "clauses": [
//                 {
//                   "predicates": [
//                     {
//                       "metric": "tHandle",
//                       "operator": "exists"
//                     }
//                   ],
//                   "type": "and"
//                 }
//               ],
//               "type": "and"
//             }
//           ]
//     };
    
//     try {
//         const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
//         pageCount = Math.ceil(conversations.totalHits/body.paging.pageSize);
//         while(pageNumber <= pageCount){
//             dayConversationList.push(...(conversations.conversations) || []);
//             pageNumber = pageNumber + 1
//             body.pageNumber = pageNumber
//         }
//         //  console.log(yesterday)
//         return dayConversationList

//     } catch (error) {
    
//         console.log("There was a failure calling converstations");
//         console.error(error.message);
//     }

// }


// async function getConversationsByDivisions(divisionId) {

//   let pageNumber = 1;
//   let pageCount = 0;
//   let dayConversationList = [];
//   let elementId = divisionId[id];
//   let body = {
//     "interval": getYesterdayInterval(),
//     "conversationFilters": [
//       {
//         "type": "and",
//         "predicates": [
//           {
//             "dimension": "divisionId",
//             "value": elementId,
//             "type": "dimension"
//           }
//         ]
//       }
//     ],
//     "segmentFilters": [
//       {
//         "type": "and",
//         "clauses": [
//           {
//             "type": "and",
//             "predicates": [
//               {
//                 "dimension": "purpose",
//                 "operator": "matches",
//                 "value": "agent"
//               }
//             ]
//           }
//         ]
//       }
//     ],
//     "paging": {
//       "pageSize": 100,
//       "pageNumber": pageNumber
//     }
//   }

//   try {

//     for (let id = 0; id < divisionId.length; id++) {
//       elementId = divisionId[id];
//       const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
//       pageCount = Math.ceil(conversations.totalHits/body.paging.pageSize);
//       while(pageNumber <= pageCount){
//           dayConversationList.push(...(conversations.conversations) || []);
//           pageNumber = pageNumber + 1;
//           body.pageNumber = pageNumber;
//           // console.log(conversations)
//       }
//       console.log(elementId);
//     }
//     return dayConversationList;
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// async function getConversationsByDivisions(divisionId) {
//   let dayConversationList = [];
//   try {
//     for (let id = 0; id < divisionId.length; id++) {
//       let pageNumber = 1;
//       let pageCount = 0;
//       const elementId = divisionId[id];
//       let body = {
//         "interval": getYesterdayInterval(),
//         "conversationFilters": [
//           {
//             "type": "and",
//             "predicates": [
//               {
//                 "dimension": "divisionId",
//                 "value": elementId,
//                 "type": "dimension"
//               }
//             ]
//           }
//         ],
//         "segmentFilters": [
//           {
//             "type": "and",
//             "clauses": [
//               {
//                 "type": "and",
//                 "predicates": [
//                   {
//                     "dimension": "purpose",
//                     "operator": "matches",
//                     "value": "agent"
//                   }
//                 ]
//               }
//             ]
//           }
//         ],
//         "paging": {
//           "pageSize": 100,
//           "pageNumber": pageNumber
//         }
//       };

//       do {
//         const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
//         pageCount = Math.ceil(conversations.totalHits / body.paging.pageSize);
//         dayConversationList.push(...(conversations.conversations) || []);
//         pageNumber++;
//         body.paging.pageNumber = pageNumber;
//       } while (pageNumber <= pageCount);
//     }
//     return dayConversationList;
//   } catch (error) {
//     console.log(error.message);
//     return []; // Retorna uma lista vazia em caso de erro
//   }
// }

// async function getConversationsByDivisions(divisionId) {
//   let dayConversationList = [];

//   try {
//     for (const elementId of divisionId) {
//       let pageNumber = 1;
//       let pageCount = 0;

//       do {
//         const body = {
//           "interval": getYesterdayInterval(),
//           "conversationFilters": [
//             {
//               "type": "and",
//               "predicates": [
//                 {
//                   "dimension": "divisionId",
//                   "value": elementId,
//                   "type": "dimension"
//                 }
//               ]
//             }
//           ],
//           "segmentFilters": [
//             {
//               "type": "and",
//               "clauses": [
//                 {
//                   "type": "and",
//                   "predicates": [
//                     {
//                       "dimension": "purpose",
//                       "operator": "matches",
//                       "value": "agent"
//                     }
//                   ]
//                 }
//               ]
//             }
//           ],
//           "paging": {
//             "pageSize": 100,
//             "pageNumber": pageNumber
//           }
//         };

//         const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
//         pageCount = Math.ceil(conversations.totalHits / body.paging.pageSize);
//         dayConversationList.push(...(conversations.conversations) || []);
//         pageNumber++;
//       } while (pageNumber <= pageCount);
//     }

//     return dayConversationList;
//   } catch (error) {
//     console.error(error.message);
//     return []; // Retorna uma lista vazia em caso de erro
//   }
// }

// async function getConversationsByDivisions(divisionIds) {
//   const dayConversationList = [];

//   try {
//     const interval = getYesterdayInterval();
//     const pageSize = 100;

//     for (const divisionId of divisionIds) {
//       let pageNumber = 1;

//       while (true) {
//         const body = {
//           "interval": interval,
//           "conversationFilters": [
//             {
//               "type": "and",
//               "predicates": [
//                 {
//                   "dimension": "divisionId",
//                   "value": divisionId,
//                   "type": "dimension"
//                 }
//               ]
//             }
//           ],
//           "segmentFilters": [
//             {
//               "type": "and",
//               "clauses": [
//                 {
//                   "type": "and",
//                   "predicates": [
//                     {
//                       "dimension": "purpose",
//                       "operator": "matches",
//                       "value": "agent"
//                     }
//                   ]
//                 }
//               ]
//             }
//           ],
//           "paging": {
//             "pageSize": pageSize,
//             "pageNumber": pageNumber
//           }
//         };

//         const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);

//         dayConversationList.push(...(conversations.conversations || []));

//         if (conversations.totalHits <= pageNumber * pageSize) {
//           break; // Saia do loop quando não houver mais páginas a serem buscadas
//         }

//         pageNumber++;
//       }
//     }

//     return dayConversationList;
//   } catch (error) {
//     console.error(error.message);
//     return []; // Retorna uma lista vazia em caso de erro
//   }
// }

// async function getConversationsByDivisions(divisionId) {
//   const dayConversationList = [];

//   for (let id = 0; id < divisionId.length; id++) {

//   let pageNumber = 1;
//   let pageCount = 0;
//   let body = {
//     "interval": getYesterdayInterval(),
//     "conversationFilters": [
//       {
//         "type": "and",
//         "predicates": [
//           {
//             "dimension": "divisionId",
//             "value": divisionId[id],
//             "type": "dimension"
//           }
//         ]
//       }
//     ],
//     "segmentFilters": [
//       {
//         "type": "and",
//         "clauses": [
//           {
//             "type": "and",
//             "predicates": [
//               {
//                 "dimension": "purpose",
//                 "operator": "matches",
//                 "value": "agent"
//               }
//             ]
//           }
//         ]
//       }
//     ],
//     "paging": {
//       "pageSize": 100,
//       "pageNumber": pageNumber
//     }
//   }

//   try {
//       const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
//       pageCount = Math.ceil(conversations.totalHits/body.paging.pageSize);
//       while(pageNumber <= pageCount){
//           dayConversationList.push(...(conversations.conversations) || []);
//           pageNumber = pageNumber + 1;
//           body.pageNumber = pageNumber;
//       }
//     return dayConversationList.length;
  
//   } catch (error) {
//     console.log(error.message);
//   }
// }
// }

// async function getConversationsByDivisions(divisionIds) {
//   const dayConversationList = [];

//   try {
//     await Promise.all(divisionIds.map(async (divisionId) => {
//       let pageNumber = 1;
//       let pageCount = 0;
//       let body = {
//         "interval": getYesterdayInterval(),
//         "conversationFilters": [
//           {
//             "type": "and",
//             "predicates": [
//               {
//                 "dimension": "divisionId",
//                 "value": divisionId,
//                 "type": "dimension"
//               }
//             ]
//           }
//         ],
//         "segmentFilters": [
//           {
//             "type": "and",
//             "clauses": [
//               {
//                 "type": "and",
//                 "predicates": [
//                   {
//                     "dimension": "purpose",
//                     "operator": "matches",
//                     "value": "agent"
//                   }
//                 ]
//               }
//             ]
//           }
//         ],
//         "paging": {
//           "pageSize": 100,
//           "pageNumber": pageNumber
//         }
//       };

//       try {
//         const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
//         pageCount = Math.ceil(conversations.totalHits / body.paging.pageSize);
//         while (pageNumber <= pageCount) {
//           dayConversationList.push(...(conversations.conversations) || []);
//           pageNumber++;
//           body.paging.pageNumber = pageNumber;
//         }
//       } catch (error) {
//         console.log(`Erro ao buscar conversas para a divisão ${divisionId}: ${error.message}`);
//       }
//     }));

//     return dayConversationList;
//   } catch (error) {
//     console.log(error.message);
//     return 0;
//   }
// }




module.exports = getConversations;