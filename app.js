const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configurações da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'pdv'
});

// Estabelece a conexão
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL: ' + err.stack);
    return;
  }
  console.log('Conexão bem-sucedida ao MySQL com o ID ' + connection.threadId);
});

// Configura o middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/src'));
app.use('/css', express.static(__dirname + '/src/view/css', { 'extensions': ['css'], 'index': false }));
app.use('/src/view', express.static(__dirname + '/src/view', { 'extensions': ['css'], 'index': false }));



// Rota para exibir o formulário de cliente
app.get('/cliente', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/cliente.html');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/produto', (req, res) => {
  res.sendFile(__dirname + '/produto.html');
});
// Rota para processar o formulário de cliente
app.post('/cadastro-cliente', (req, res) => {
  const nome = req.body.nome;
  const sobrenome = req.body.sobrenome;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cidade = req.body.cidade;
  const estado = req.body.estado;
  const cep = req.body.cep;

  // Executa a consulta SQL para inserir dados no banco
  const sql = 'INSERT INTO cliente (nome_cli, sobrenome, endereco, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(sql, [nome, sobrenome, endereco, bairro, cidade, estado, cep], (error, results) => {
    if (error) throw error;

  console.log('Cliente cadastrado com sucesso!');
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
