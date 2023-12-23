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
  res.sendFile(__dirname + '/src/view/forms/produto.html');
});

app.get('/consulta-cliente', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/consultaCliente.html');
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
app.post('/cadastro-produto', (req, res) => {
  const nomeProduto = req.body.nomeProduto;
  const quantidade = req.body.quantidade;
  const valor = req.body.valor;
  const tipo = req.body.tipo;
  const marca = req.body.marca;

  // Executa a consulta SQL para inserir dados no banco
  const sql = 'INSERT INTO produto (produto, quantidade, valor, tipo, marca) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [nomeProduto, quantidade, valor, tipo, marca], (error, results) => {
    if (error) throw error;

  console.log('Cliente cadastrado com sucesso!');
  });
});


app.get('/consulta-clientes', (req, res) => {
  const nomePesquisa = req.query.nome || ''; // Obtém o parâmetro de consulta nome (ou uma string vazia se não fornecido)
  let sql = 'SELECT * FROM cliente';

  // Adiciona o filtro LIKE apenas se houver um valor de pesquisa
  const params = [];
  if (nomePesquisa) {
    sql += ' WHERE nome_cli LIKE ?';
    params.push(`%${nomePesquisa}%`);
  }

  connection.query(sql, params, (error, results) => {
    if (error) {
      console.error('Erro ao consultar clientes:', error);
      res.json({ success: false, message: 'Erro ao consultar clientes.' });
      return;
    }

    // Mapeia os resultados para um formato mais adequado
    const clientes = results.map(cliente => ({
      id: cliente.idcliente,
      nome: cliente.nome_cli,
      sobrenome: cliente.sobrenome,
      endereco: cliente.endereco,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      // Adicione outras colunas conforme necessário
    }));

    res.json({ success: true, clientes });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
