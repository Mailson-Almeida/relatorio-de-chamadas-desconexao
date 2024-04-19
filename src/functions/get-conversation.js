const platformClient = require ('purecloud-platform-client-v2');
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
          "interval": "2024-04-08T00:00:00.000Z/2024-04-08T23:59:59.000Z",
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

module.exports = getConversations;