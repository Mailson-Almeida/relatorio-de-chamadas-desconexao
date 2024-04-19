const platformClient = require ("purecloud-platform-client-v2");
const conversationApi = new platformClient.AnalyticsApi();

      async function getTrasnferredConversations (){

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
                    "metric": "nTransferred",
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

      module.exports = getTrasnferredConversations