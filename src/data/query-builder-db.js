const knex = require('../connections/connection');
const { transferredConversations, alertConversations, intervalConversations } = require('../functions/get-table-conversations');


async function select(){

    try {
        return knex('extracoes_diarias_genesys.relatorio_de_chamadas').debug(); 
    } catch (error) {
        console.log(error.mensagem)
    }
     
}

async function insertTrasferredConversation () {

    try {
        const regularConversation = await transferredConversations();
        const insertConversations = await knex('extracoes_diarias_genesys.relatorio_de_chamadas').insert([...regularConversation]).returning();
        return insertConversations;
    } catch (error) {
        console.log(error.message)
    }
}

async function insertNoRepondingConversations (){

    try {
        const regularConversation = await alertConversations();
        const insertConversations = await knex('extracoes_diarias_genesys.relatorio_de_chamadas').insert([...regularConversation]).returning();
        return insertConversations;
    } catch (error) {
        console.log(error.message)
    }
}

async function insertIntervalConversations (){

    try {
        const regularConversation = await intervalConversations();
        const insertConversations = await knex('extracoes_diarias_genesys.relatorio_de_chamadas').insert([...regularConversation]).returning();
        return insertConversations;
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {select, insertTrasferredConversation, insertIntervalConversations, insertNoRepondingConversations};