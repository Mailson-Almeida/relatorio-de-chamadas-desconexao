const knex = require("./connections/connection");
const getStep = require('./disconnection-report')

const executeRPA = async () => {
        const startTime = new Date();
        startTime.setTime(startTime.getTime() - (3 * 60 * 60 * 1000));
        const disconnectTypeAgents = require('./disconnection-report');
    try {

        console.log("Executando automação RPA...");

        await disconnectTypeAgents();
        const endTime = new Date();
        endTime.setTime(endTime.getTime() - (3 * 60 * 60 * 1000)); // Ajustando para o fuso do banco
        const executionTime = endTime.getTime() - startTime.getTime();
        const log_erro = {
            id_rpa: "5",
            concluido: true,
            data_inicio: startTime,
            data_fim: endTime,
            tempo_exec_segundos: executionTime
        }
        await knex('tabelas_padrao.log_execucoes').insert(log_erro).returning();
        console.log("Automação RPA concluída!");
    } catch (error) {
        const endTime = new Date()
        endTime.setTime(endTime.getTime() - (3 * 60 * 60 * 1000)); // Ajustando para o fuso do banco
        const executionTime = endTime.getTime() - startTime.getTime(); // milissegundos 
        const log_execucao = {
            id_rpa: "5",
            concluido: false,
            data_inicio: startTime,
            data_fim: endTime,
            tempo_exec_segundos: executionTime,
        }
        await knex('tabelas_padrao.log_execucoes').insert(log_execucao).returning();
        const log_erro = {
            id_log_execucao: this.tempo_exec_segundos,
            erro: error,
            etapa: getStep(),
            subetapa: ''
        }
        await knex('tabelas_padrao.log_erros').insert(log_erro);
        console.error("Erro na execução da automação RPA:", error);
    }finally{
        const endTime = Date.now(); // Captura o tempo de fim da execução
        const executionTime = (endTime - startTime) / 1000; // Calcula o tempo de execução em segundos

        console.log(`Tempo de execução: ${executionTime} segundos`);
        console.log("Conclusão da execução da automação RPA.");
    }
};

(async () => {
    await executeRPA();
})();