
const platformClient = require ("purecloud-platform-client-v2");
const getYesterdayInterval = require("./get-yesterday");
const conversationApi = new platformClient.AnalyticsApi();

      async function getNoRepondingConversations (){

        let pageNumber = 1;
        let pageCount = 0;
        let dayConversationList = [];
      
          let body = {
            "interval": getYesterdayInterval(),
            "conversationFilters": [
              {
                "type": "and",
                "predicates": [
                  {
                    "metric": "tNotResponding",
                    "operator": "exists"
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
          
              console.log("There was a failure calling converstations");
              console.error(error.message);
          }
      
          
      
          
      }
module.exports = getNoRepondingConversations


/* Chamadas onde o agente não respondeu a interação  
   Essas chamadas tem um pop de alerta no cronograma da linha do tempo da interação no Painel de interação Genesys
   Essas chamadas por não terem sido respondido pelo primeiro agente, são direcionadas para outro agente
*/