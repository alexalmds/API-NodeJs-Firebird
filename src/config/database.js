import firebird from "node-firebird";  //Importa o modulo de conexão com banco de dados do Firebird (Não vamos utilizar ese modulo aqui)

//Constante para carregar as opções de conexão com o banco de dados com formato JSON
const dbOptions = {
    host : 'localhost',
    port : 3050,
    database : 'C:\\SEU\\CAMINHO\\DO\\BANCO_AQUI.FDB',
    user : 'SYSDBA',
    password : 'masterkey',
    lowercase_keys : false, //Por padrão, seta tudo como MAIUSCULO
    role : null, //Regras do seu banco de dados, Default: null           
    pageSize : 4096  //Default value      
}


//Função de executar query no banco de dados
function executeQuery(ssql, params, callback){
    firebird.attach(dbOptions, function(err, db) { //Esta linha tras a conexão com o banco de dados, e chama um callback para caso aconteça um ero ou o banco esteja conectado

        if (err) {  //Se acontecer erro ao conectar ele trás a execução de um bloco de comando que ficará logo abaixo
           console.log("Ocorreu um erro:", err)  //Printa no console e trás as informações do erro
            return callback(err, []);  
        } 
            
        //Se não aconteceu nenhum erro anteriormente o código abaixo é executado
        db.query(ssql, params, function(err, result) {  //Linha que executa a ação dentro do banco de dados
            // IMPORTANTE - Sempre fechar a conexão com banco de dados[]
            db.detach(); //Encerra conexão com banco de dados

            if (err) {
                return callback(err, []) //Se acontecer erro, retorna para o callback e finaliza execução do código
            } else {
                return callback(undefined, result) //Se passar, fará a execução do bloco de código a seguir
            }
        });
    
    });
}
//Vamos exportar essa constante para ser acesada de outros arquivos
export {executeQuery}
