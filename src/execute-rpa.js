const knex = require("./connections/connection");
const executeRPA = async () => {
        const startTime = new Date();
        startTime.setTime(startTime.getTime());
        const {disconnectTypeAgents, getStep} = require('./disconnection-report');
    try {

        console.log("Executando automação RPA...");

        await disconnectTypeAgents();
        const endTime = new Date();
        endTime.setTime(endTime.getTime()); // Ajustando para o fuso do banco
        const executionTime = endTime.getTime() - startTime.getTime();
        const log_erro = {
            id_rpa: "5",
            concluido: true,
            data_inicio: startTime,
            data_fim: endTime,
            tempo_exec_segundos: executionTime
        }
        await knex('tabelas_padrao.log_execucoes').insert(log_erro);
        console.log("Automação RPA concluída!");
    } catch (error) {
        console.log(await disconnectTypeAgents.step)
        const endTime = new Date()
        endTime.setTime(endTime.getTime()); // Ajustando para o fuso do banco
        const executionTime = endTime.getTime() - startTime.getTime(); // milissegundos 
        const log_execucao = {
            id_rpa: "5",
            concluido: false,
            data_inicio: startTime,
            data_fim: endTime,
            tempo_exec_segundos: executionTime,
        }
        await knex('tabelas_padrao.log_execucoes').insert(log_execucao);
        const log_erro = {
            id_execucao: log_execucao.tempo_exec_segundos,
            erro: error.message,
            etapa: await getStep(),
            subetapa: ""
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