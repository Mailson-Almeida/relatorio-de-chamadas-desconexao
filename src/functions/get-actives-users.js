const platformClient = require ('purecloud-platform-client-v2');
const usersApi = new platformClient.UsersApi();

async function getActiveUsers (){

    let pageNumber = 1
    let pageCount = 1
    let activeUsersList = []
  
    let opts = {
        "pageSize": 200, // Number | Page size
        "pageNumber": pageNumber, // Number | Page number
        "sortOrder": "ASC", // String | Ascending or descending sort order
        "expand":  ["groups"], // [String] | Which fields, if any, to expand
        "state": "active" // String | Only list users of this state
    };
    
    try {
      while (pageNumber <= pageCount) {
        const activeUsers = await usersApi.getUsers(opts)
        activeUsersList.push(...activeUsers.entities)
  
        pageNumber = activeUsers.pageNumber + 1
        pageCount = activeUsers.pageCount
        opts.pageNumber = pageNumber
      }
      return activeUsersList
    } catch (e) {
      console.log("There was a failure calling getUsers");
      console.error(e.message);
    }
}




function getUsersName (id, users){

const result = users.filter(userName =>{
  if(userName.id === id){
    return userName
  }
}).map(nome => {
  if(nome.name){
    return nome.name;
  }
})[0]

return result
};



module.exports = { getActiveUsers, getUsersName }