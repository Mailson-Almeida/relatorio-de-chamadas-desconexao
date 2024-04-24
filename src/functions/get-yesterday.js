const {startOfYesterday, endOfYesterday, formatISO } = require('date-fns');

function getYesterdayInterval (){
    
    const startInterval = startOfYesterday();
    const endInterval = endOfYesterday();

    return (`${formatISO(startInterval)}/${formatISO(endInterval)}`);
}   
module.exports = getYesterdayInterval