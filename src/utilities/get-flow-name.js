const platformClient = require ('purecloud-platform-client-v2');
const routingApi = new platformClient.RoutingApi();

async function getQueues (){

    let queueList = []
  
    let opts = {
        "pageSize": 200, // Number | Page size
        "sortOrder": "ASC", // String | Ascending or descending sort order
    };
    
    try {
        const queues = await routingApi.getRoutingQueuesDivisionviewsAll(opts)
        queueList.push(...(queues.entities || []))

        const queueListName = queueList.map(queue =>{
            return {id: queue.id , name: queue.name}
        })
      return queueListName
    } catch (e) {
      console.log("There was a failure calling getQueue");
      console.error(e.message);
    }
}




function getQueueName (id, queuesList){

const result = queuesList.filter(queues =>{
  if(queues.id === id){
    return queues
  }
})[0].name

return result
};


module.exports = {getQueues, getQueueName}