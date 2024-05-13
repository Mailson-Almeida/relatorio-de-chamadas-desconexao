require('dotenv').config();
const authentication = require('../proxies/authenticateApi');
const CronJob = require("cron").CronJob;
const {select, insertNoRepondingConversations, insertDataBanch} = require('./data/query-builder-db');
const {insertTrasferredConversation } = require('./data/query-builder-db');
const { getStep } = require('./disconnection-report');
const getConversations = require('./functions/get-conversation');
const { getObjectDisconnection, getAlertDisconnection } = require('./functions/get-conversation-detail');
const getYesterdayInterval = require('./functions/get-yesterday');
const gerarCSV = require('./utilities/csv-mod');


const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const orgRegion = process.env.ORG_REGION;

const disconnetionRport  = async () => {

  const token = await authentication.authenticate(clientId, clientSecret, orgRegion);


//   try {

//   await insertNoRepondingConversations()
//   .then(() =>{
//    console.log('Todos os dados de chamadas não respondidas foram inseridos.');
//    process.exit(0);
//   })
//  .catch((error) =>{
//    console.error('Erro ao inserir os dados de chamadas não respondidas:', error);
//    process.exit(1); 
//  });
 
//  await insertTrasferredConversation()
//  .then(() =>{
//    console.log('Todos os dados de chamadas transferidas foram inseridos.');
//    process.exit(0);
//   })
//  .catch((error) =>{
//    console.error('Erro ao inserir os dados de chamadas transferidas:', error);
//    process.exit(1); 
//  });

//  await insertDataBanch()
//  .then(() => {
//    console.log('Todos os dados de chamadas por divisão foram inseridos.');
//    process.exit(0); 
//  })
//  .catch((error) => {
//    console.error('Erro ao inserir os dados de chamadas por divisão:', error);
//    process.exit(1); 
//  });
    
//   } catch (error) {
//     console.log(error.message)
//   }
  // await insertNoRepondingConversations();
//   .then(() =>{
//    console.log('Todos os dados de chamadas não respondidas foram inseridos.');
//    process.exit(0);
//   })
//  .catch((error) =>{
//    console.error('Erro ao inserir os dados de chamadas não respondidas:', error);
//    process.exit(1); 
//  });
 
//  await insertTrasferredConversation();
//  .then(() =>{
//    console.log('Todos os dados de chamadas transferidas foram inseridos.');
//    process.exit(0);
//   })
//  .catch((error) =>{
//    console.error('Erro ao inserir os dados de chamadas transferidas:', error);
//    process.exit(1); 
//  });

//  await insertDataBanch()
//  .then(() => {
//    console.log('Todos os dados de chamadas por divisão foram inseridos.');
//    process.exit(0); 
//  })
//  .catch((error) => {
//    console.error('Erro ao inserir os dados de chamadas por divisão:', error);
//    process.exit(1); 
//  });
// console.log(await intervalConversations());
// console.log(await transferredConversations());
// console.log(await alertConversations());
// console.log(await getAlertDisconnection())
// 
// await gerarCSV();
// await insertDataBanch();
// console.log(await select());
// console.log(await getConversations());
  // setInterval(await insertDataBanch(await intervalConversations()), 5000);
// // console.log(getYesterdayInterval());
// const conversas = await getConversations();

// console.log(getObjectDisconnection(conversas));
console.log(await getStep());
}

disconnetionRport();
// const job = new CronJob("0 5 * * *", disconnetionRport());
// job.start();
