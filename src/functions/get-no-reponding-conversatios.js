
const platformClient = require ("purecloud-platform-client-v2");
const conversationApi = new platformClient.AnalyticsApi();

      async function getNoRepondingConversations (){

        let pageNumber = 1;
        let pageCount = 0;
        let dayConversationList = [];
      
          let body = {
            "interval": "2024-04-08T00:00:00.000Z/2024-04-08T23:59:59.000Z",
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
              pageCount = conversations.totalHits/100
              while(pageNumber <= pageCount){
                  dayConversationList.push(...conversations.conversations);
                  pageNumber = pageNumber + 1
                  body.pageNumber = pageNumber
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