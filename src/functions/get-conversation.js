const platformClient = require ('purecloud-platform-client-v2');
const getYesterdayInterval = require('./get-yesterday');
const conversationApi = new platformClient.ConversationsApi();

async function getConversations (){

  let pageNumber = 1;
  let pageCount = 0;
  let dayConversationList = [];

    let body = {
        
        "paging": {
            "pageSize": 100,
            "pageNumber": pageNumber
          },
          "order": "asc",
          "interval": getYesterdayInterval(),
          "conversationFilters": [
            {
              "clauses": [
                {
                  "predicates": [
                    {
                      "metric": "tHandle",
                      "operator": "exists"
                    }
                  ],
                  "type": "and"
                }
              ],
              "type": "and"
            }
          ]
    };
    
    try {
        const conversations = await conversationApi.postAnalyticsConversationsDetailsQuery(body);
        pageCount = Math.ceil(conversations.totalHits/body.paging.pageSize);
        while(pageNumber <= pageCount){
            dayConversationList.push(...conversations.conversations || []);
            pageNumber = pageNumber + 1
            body.pageNumber = pageNumber
        }
        
        return dayConversationList

    } catch (error) {
    
        console.log("There was a failure calling converstations");
        console.error(error.message);
    }

    

    
}

module.exports = getConversations;