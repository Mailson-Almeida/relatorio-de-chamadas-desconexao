const { intervalConversations } = require('../functions/get-table-conversations')
const createCsvWriter = require ('csv-writer').createObjectCsvWriter;


async function gerarCSV() {
    const dados =  await intervalConversations(); // Obter os dados usando a função
    const csvWriter = createCsvWriter({
      path: 'output.csv',
      header: [
        { id: 'id_genesys', title: 'id_genesys' },
        { id: 'data', title: 'Data' },
        { id: 'desconexao', title: 'Desconexao'},
        { id: 'nome_agente', title: 'Nome do Agente'},
        { id: 'fila', title: 'Fila'},
        { id: 'direcao', title: 'Direcao'},
        { id: 'telefone_cliente', title: 'Telefone do Cliente'},
        { id: 'duracao_chamada', title: 'Duracao da Chamada'}
      ]
    });
  
    csvWriter
      .writeRecords(dados)
      .then(() => console.log('CSV file gravado com sucesso'))
      .catch((err) => console.error('Erro ao gravar o CSV file', err));
  }

  module.exports = gerarCSV;



