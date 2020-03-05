// Configurando o servidor
const express = require('express')
const server = express()

//Coonfigurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar o body do formulario
server.use(express.urlencoded({ extended: true}))


//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})
// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Configurar a apresentacao da pagina
server.get("/", function(req, res) {

    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send('Erro de banco de dados')

        const donors = result.rows
        return res.render('index.html' ,{ donors })
    })

   
})

server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send('Todos os campos sao obrigatorios')
    }

    //coloco vaçores dentro do bd
    const query = 
        `INSERT INTO DONORS ("name", "email", "blood") 
        VALUES ($1, $2, $3)`


    const values = [name, email, blood]

    db.query(query, values, function(err){
        //fluxo de erro
        if(err) return res.send("erro no banco de dados")
        
        //fluxo ideal
        return res.redirect('/')
    })

})


// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log('Iniciei o servidor')
})

