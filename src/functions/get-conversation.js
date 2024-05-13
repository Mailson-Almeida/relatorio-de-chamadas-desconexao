const platformClient = require ('purecloud-platform-client-v2');
const getYesterdayInterval = require('./get-yesterday');
const conversationApi = new platformClient.ConversationsApi();

async function getConversations (){

  let pageNumber = 1;
  let pageCount = 0;
  let dayConversationList = [];

    let body = {
      
      "interval": getYesterdayInterval(),
      "paging": {
        "pageSize": 100,
        "pageNumber": pageNumber
      },
      "conversationFilters": [
        {
          "predicates": [
            {
              "metric": "tTalk",
              "operator": "exists"
            }
          ],
          "type": "and"
        }
      ],
      "order": "asc",
      "orderBy": "conversationStart",
      "segmentFilters": [
        {
          "predicates": [
            {
              "dimension": "purpose",
              "operator": "matches",
              "value": "agent"
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


module.exports = getConversations;