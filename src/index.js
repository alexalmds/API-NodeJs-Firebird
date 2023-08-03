import express from "express"; //Importa os módulos do Expres
import cors from "cors";       //Importa os módulos do Cors
import { executeQuery } from "./config/database.js"; //Importa a função de database.js
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import fs from 'fs'

dotenv.config()

const app = express(); //Constante que não mudarar, no casso será sempre utilizado o "app" para chamar as funções do express

//MiddleWare JSON
app.use(express.json()); //Middleware para utilização do JSON

//Middleware CORS
app.use(cors()); //MiddleWare para utilizar comunicação com Delphi


//Rotas - EndPoints - GET, POST, PUSH, DELETE
app.get("/", function(req, res) {
    res.status(200).send("Servidor iniciado com NodeJs + Node-Firebird. Versão atual do Sandbox 1.0 rev 1. Todas as alterações feitas neste servidor são fictícias e não ocasionam bugs em um servidor principal!")

})

//Simulando LogOut do Usuario

app.post('/logout', function(req, res) {
    console.log("Um usuário foi desconectado do servidor")
    res.json({ auth: false, token: null }); //Retorna Auth : false e null na var token
})

//Rota pra login
app.post('/login', (req, res, next) => {
    //Lembrando que esta função seria feita atraves de uma consulta no banco de dados para retornar valores corretos
    if(req.body.user == 'teste' && req.body.password == '123'){  //Na requisicao, no body User = é setado como predefinido um usuario que eja igual a estes juntamente com a senha
       // console.log("Chegou awqui") //Para testar erros que ocorream antes de executar as linhas de codigo abaixo
      //auth ok
      const id = 1; //esse id viria do banco de dados - No caso ID e CPF
      //console.log(process.env.SECRET) //Aqui retorna o valor da SECRET KEY para utilizar na crfiação do JWT. Somente para console e uso de testes
      var privateKey = fs.readFileSync('./private.key')
      const token = jwt.sign({ id }, privateKey, { //Este é o processo para gerar o Token
        expiresIn: 99999, // expira em 5min
        algorithm:  "RS256"  // Tipo de algorítimo para fazer a decodificação das chaves com token
      });
      console.log("Um usuário fez login no servidor e foi gerado um Token com validade de 99999s")
      console.log("token gerado: ", token)
      return res.json({ auth: true, token: token }); //Aqui se deu tudo certo retona informações ao usuario de que Auth = true ou seja, está autenticado no servidor
    }
    
    console.log("Tentativa de Login Inválida no servidor")
    res.status(500).json({message: 'Login inválido!'}); //Se cair nesta tratativa, é porque as informações de credenciais estão incorretas
})

//Rota endPoint para buscar Usuarios dentro do banco de dados
app.get("/usuarios", verifyJWT, function(req, res){ 
    let filtro = []  //Filtro para SQL
    let ssql = "SELECT * FROM tb_usuarios" // Let para passar as consultas SQL
    //Essa linha chama o endpoint e tras um callback para a function onde tem dois parametros, request e response
    
    executeQuery(ssql, filtro, function(err, result){  //Padrao pra executar querys usando o modulo feito em database.js
        if(err){
            res.status(500).json(err)
        } else {
           
            console.log("Esta URL foi acessada e liberou informações de Usuarios no formato JSON!") //Mostra no console do servidor que a URL endpoint foi acessada
            res.status(200).json(result)
        }

    })
})

//Função para verificar Token para acesso em páginas que precisa de uma validação
function verifyJWT(req, res, next){
    const token = req.headers['x-access-token']; //Aqui vai pegar o token já armazenado no headers de uma requisição HTTP
    if (!token) 
    return res.status(401).json({ auth: false, message: 'Não há nenhum token vinculado à sua conta ou o token é Nulo!', }); //Se o token estiver vazio, então o usuario não esta autenticado
    //console.log("Uma chamada não autenticada foi bloqueada pelo servidor. (err: CNA101)")
    
    var publicKey = fs.readFileSync('./public.key', 'utf-8')
    console.log(publicKey)
    jwt.verify(token, publicKey, {algorithm: ["RS256"]}, function(err, decoded) { //Se há um token armazenado é feito a validação deste token, onde será decodificado e verificado ID + PublicKey . Validação do sistema JsonWebToken
      if (err) return res.status(500).json({ auth: false, message: 'Falha ao autenticar token!' }); //Se der erro ao verificar o token é retornado status 500 junto com a mensagem de que não houve autenticação e uma mensagem explicando o motivo.
      //console.log("Um usuário teve seu acesso bloqueado. MOTIVO: Token Expirado ou Falha de validação.")
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      console.log("Id: ", decoded.id)
      next();
    });
}

app.post("/newuser", function(req, res){
    let filtro = []  //Filtro para SQL
    let ssql = "insert into tb_usuarios (iduser, idusuario, cpf) values ('11', '22', '12345678900')" // Let para passar as consultas SQL
    //Essa linha chama o endpoint e tras um callback para a function onde tem dois parametros, request e response
    
    executeQuery(ssql, filtro, function(err, result){  //Padrao pra executar querys usando o modulo feito em database.js
        if(err){
            res.status(500).json(err)
        } else {
           
            console.log("Esta URL foi acessada adicionou novos Usuarios no Banco de Dados FireBird!") //Mostra no console do servidor que a URL endpoint foi acessada
            res.status(200).json(result)
        }

    })
})

app.listen(3000, function(){  //Ira escutar ou rodar na PORTA 3000 retornando callback functionn para printar no console as informações abaixo
    console.log("Servidor Inciado com suceso. SandBox 1.0 rev 1") //Mensagem que é impressa no console 
})