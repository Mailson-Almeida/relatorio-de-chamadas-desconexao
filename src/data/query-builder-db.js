const knex = require('../connections/connection');
const { transferredConversations, alertConversations, intervalConversations } = require('../functions/get-formatted-conversations');


async function select(){

    try {
        return knex('tabelas_padrao.log_execucoes').where('id_rpa', '4').debug(); 
    } catch (error) {
        console.log(error.mensagem)
    }
     
}

async function insertTrasferredConversation (arrayChamadas) {

    try {
        const transferConversation = arrayChamadas
        const insertConversations = await knex('extracoes_diarias_genesys.relatorio_de_chamadas').insert([...transferConversation]).returning();
        return insertConversations;
    } catch (error) {
        console.log(error.message)
    }
}

async function insertNoRepondingConversations (arrayChamadas){

    try {
        const noRespoConversation = arrayChamadas
        const insertConversations = await knex('extracoes_diarias_genesys.relatorio_de_chamadas').insert([...noRespoConversation]).returning();
        return insertConversations;
    } catch (error) {
        console.log(error.message)
    }
}

async function insertDataBanch(arrayChamadas) {
    const arrayCalls = arrayChamadas;
    const batchSize = 100; 
    let batch = [];
    
    for (let i = 0; i < arrayCalls.length; i += batchSize) {
            batch = arrayCalls.slice(i, i + batchSize);
            await knex('extracoes_diarias_genesys.relatorio_de_chamadas').insert(batch);
        }
    console.log('Inserção concluída.');  
  }
  
  
async function insertLogErros( logErro, step){
    try {

        const log_erro = {
            erro: logErro,
            etapa: step
        }

        await knex('tabelas_padrao.log_erros').insert(log_erro).returning();

        return 'Log de erro inserido';
    } catch (error) {
        console.log('Erro ao inserir dados de log', error.message);
    }
} 

module.exports = {select, insertTrasferredConversation, insertNoRepondingConversations, insertDataBanch, insertLogErros};