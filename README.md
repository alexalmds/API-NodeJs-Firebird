# API JsonWebToken + NodeJs + Firebird 3.0
Este é um projeto de estudo para desenvolvedores terem como base como funciona uma API que faz uma consulta em um banco de dados do tipo Firebird, rodando a versão 3.0

## Sobre o Projeto

Desenvolvido com o nova norma de JavaScript - Type : module - esta API é capaz de fazer uma consulta em um banco de dados do Firebird e retornar ao usuário uma lista
de todos os usuários registrados. Para isso na rota, um endpoint '/usuarios' é chamada com o método GET e após a chamada é feita uma verificação do token
atráves da 'function verifyToken'. 

## Rota com endpoint '/'
É a endpoint principal que está o servidor, pode ser acessado através do "localhost:3000" ou "127.0.0.1:3000"

## Rota com endpoint '/login'
É feita uma requisição ao servidor para que seja efetuado login do usuário onde no body da requisição é pasado informações de "user" e "password", no caso "teste" e "123"
Após feito login é gerada um TOKEN com método JWT + Codificação de base64 e assinatura digital do próprio servidor. Além dessa decodificação foi pensado e utilizado
o uso de uma 'privateKey' em RS256 de 2048 bytes para geração e codificação do TOKEN. É possivel visualizar o exemplo deste código no arquivo 'private.key'
É passada também uma validade ao token de 99999 segundos. Este valor pode ser alterado, mas para fins de testes foi utilizado este valor para teste de autenticidade e validade 
do token.

## Rota com endpoint '/usuarios'
Esta foi uma rota criada com acesso a usuários que estão devidamente autenticados, seu acesso é liberado após a validação do TOKEN, caso contrário lhe é retornado um 
status "500 Internal server error". Se o usuário foi devidamente validado e autenticado é liberada uma consulta ao banco de dados o que lhe retorna um Json com as informações 
de todos os registros de usuários presentes no banco.

## Rota com endpoint '/logout'
Apenas simula o 'logout' de um usuário do servidor retornando em seu corpo um Json com informações de "auth" : "false" - que significa que não está mais autenticado e 
"token": null - para anular o seu Token e a sua validade


# Complementar
Algumas informações complementares sobre o projeto

## database.js - Configurações do banco de dados
Neste arquivo é possível verificar que há as informações sobre a conexão do banco de dados com o NodeJs através do módulo importado "node-firebird"
Há também um padrão pra executar as querys dentro do banco de dados, onde é recebido a string com o código SQL, seus parametros, e um callback
Com isso é possível utilizar esta função de outro arquivo para execução de diferentes querys dentro do banco de dados
"executeQuery(ssql, params, callback)"



