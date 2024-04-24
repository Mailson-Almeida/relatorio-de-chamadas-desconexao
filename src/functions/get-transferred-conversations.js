const platformClient = require ("purecloud-platform-client-v2");
const conversationApi = new platformClient.AnalyticsApi();
const getYesterdayInterval = require('./get-yesterday')

      async function getTrasnferredConversations (){

        let pageNumber = 1;
        let pageCount = 0;
        let dayConversationList = [];
      
          let body = {
            "order": "asc",
            "orderBy": "conversationStart",
            "paging": {
              "pageSize": 100,
              "pageNumber": 1
            },
            "conversationFilters": [
              {
                "type": "and",
                "clauses": [
                  {
                    "type": "and",
                    "predicates": [
                      {
                        "metric": "nTransferred",
                        "operator": "exists"
                      }
                    ]
                  }
                ]
              }
            ],
            "interval": getYesterdayInterval(),
          };
          
          try {
              const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
              pageCount = Math.ceil(conversations.totalHits/body.paging.pageSize);
              while(pageNumber <= pageCount){
                  dayConversationList.push(...(conversations.conversations) || []);
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