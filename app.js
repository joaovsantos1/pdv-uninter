const express = require('express');
const mysql = require('mysql2');
const path = require('path')

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
app.use(express.json())
app.use(express.static(__dirname + '/src'));
app.use('/css', express.static(__dirname + '/src/view/css', { 'extensions': ['css'], 'index': false }));
app.use('/src/view', express.static(__dirname + '/src/view', { 'extensions': ['css'], 'index': false }));
app.use('/src/controller', express.static(path.join(__dirname, 'src/controller'), { 'extensions': ['js'], 'index': false }));


// Rota para exibir o formulário
app.get('/cliente', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/cliente.html');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/produto', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/produto.html');
});
app.get('/caixa', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/caixa.html');
});
app.get('/consulta-cliente', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/consultaCliente.html');
});
app.get('/consulta-produto', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/consultaProduto.html');
});
app.get('/consulta-vendas', (req, res) => {
  res.sendFile(__dirname + '/src/view/forms/consultaVendas.html');
});
// Rota para salvar a compra no banco de dados
app.post('/finalizar-compra', (req, res) => {
  const { idCliente, formaPagamento, valorTotal, desconto, produtos } = req.body;

  // Verificar se o cliente já existe
  if (!idCliente) {
      res.status(400).send('ID do cliente é necessário para finalizar a compra.');
      return;
  }

  // Iniciar uma transação para garantir a consistência nos dados
  connection.beginTransaction((err) => {
      if (err) {
          console.error('Erro ao iniciar a transação:', err);
          res.status(500).send('Erro ao finalizar a compra.');
          return;
      }

      // Insira os dados na tabela 'compras'
      connection.query(
          'INSERT INTO compras (id_cliente, forma_pagamento, valor_total, desconto) VALUES (?, ?, ?, ?)',
          [idCliente, formaPagamento, valorTotal, desconto],
          (err, results) => {
              if (err) {
                  connection.rollback(() => {
                      console.error('Erro ao inserir compra:', err);
                      res.status(500).send('Erro ao finalizar a compra.');
                  });
                  return;
              }

              const idCompra = results.insertId;

              // Iterar sobre os produtos e inserir na tabela 'itens_compra'
              produtos.forEach((produto, index, array) => {
                  const { idProduto, quantidade, valor } = produto;

                  connection.query(
                      'INSERT INTO itens_compra (id_compra, id_produto, quantidade, valor_unitario) VALUES (?, ?, ?, ?)',
                      [idCompra, idProduto, quantidade, valor],
                      (err) => {
                          if (err) {
                              connection.rollback(() => {
                                  console.error('Erro ao inserir item de compra:', err);
                                  res.status(500).send('Erro ao finalizar a compra.');
                              });
                              return;
                          }

                          // Se for o último produto, então atualize a quantidade em estoque
                          if (index === array.length - 1) {
                              connection.query(
                                  'UPDATE produto SET quantidade = quantidade - ? WHERE idproduto = ?',
                                  [quantidade, idProduto],
                                  (err) => {
                                      if (err) {
                                          connection.rollback(() => {
                                              console.error('Erro ao atualizar a quantidade em estoque:', err);
                                              res.status(500).send('Erro ao finalizar a compra.');
                                          });
                                          return;
                                      }

                                      // Se chegou aqui, é o último callback, então faça o commit da transação
                                      connection.commit((err) => {
                                          if (err) {
                                              connection.rollback(() => {
                                                  console.error('Erro ao commitar a transação:', err);
                                                  res.status(500).send('Erro ao finalizar a compra.');
                                              });
                                              return;
                                          }

                                          res.status(200).json({ success: true, message: 'Compra finalizada com sucesso.' });
                                      });
                                  }
                              );
                          }
                      }
                  );
              });
          }
      );
  });
});

// Rota para processar o formulário
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
    if (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ error: 'Erro no cadastro do produto' });
  } else {
      res.json({ success: true });
  }
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
    if (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({ error: 'Erro no cadastro do produto' });
  } else {
      res.json({ success: true });
  }
  });
});
app.get('/consulta-produtos', (req, res) => {
  const produtoPesquisa = req.query.nome || ''; // Obtém o parâmetro de consulta nome (ou uma string vazia se não fornecido)
  let sql = 'SELECT * FROM produto';

  // Adiciona o filtro LIKE apenas se houver um valor de pesquisa
  const params = [];
  if (produtoPesquisa) {
    sql += ' WHERE produto LIKE ?';
    params.push(`%${produtoPesquisa}%`);
  }

  connection.query(sql, params, (error, results) => {
    if (error) {
      console.error('Erro ao consultar produtos:', error);
      res.json({ success: false, message: 'Erro ao consultar produtos.' });
      return;
    }

    // Mapeia os resultados para um formato mais adequado
    const produtos = results.map(produto => ({
      id: produto.idproduto,
      nome: produto.produto,
      quantidade: produto.quantidade,
      valor: produto.valor,
      tipo: produto.tipo,
      marca: produto.marca,
      
    }));

    res.json({ success: true, produtos });
  });
});
app.get('/buscar-produto', (req, res) => {
  const nomeProduto = req.query.nome;

  // Consulta SQL para buscar o cliente pelo nome
  const sql = "SELECT idproduto, quantidade, valor, tipo, marca FROM produto WHERE produto = ?";
  connection.query(sql, [nomeProduto], (error, results) => {
      if (error) {
          console.error('Erro na consulta:', error);
          res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
      } else {
          if (results.length > 0) {
              // Mapear os resultados para formatar o objeto
              const produtoEncontrado = {
                  id: results[0].idproduto,
                  quantidade: results[0].quantidade,
                  valor: results[0].valor,
                  tipo: results[0].tipo,
                  marca: results[0].marca
              };

              res.json(produtoEncontrado);
          } else {
              res.json(null); // Cliente não encontrado
          }
      }
  });
});
app.put('/atualizar-produto', (req, res) => {
  const produtoId = req.body.produtoId;
  const nome = req.body.nome;
  const quantidade = req.body.quantidade;
  const valor = req.body.valor;
  const tipo = req.body.tipo;
  const marca = req.body.marca;

  console.log('Dados recebidos:', req.body);
  console.log(produtoId, nome, quantidade, valor, tipo, marca);
  
  const sql = "UPDATE produto SET produto = ?, quantidade = ?, valor = ?, tipo = ?, marca = ? WHERE idproduto = ?";
  connection.query(sql, [nome, quantidade, valor, tipo, marca, produtoId], (error, results) => {
      if (error) {
          console.error('Erro na atualização:', error);
          res.status(500).json({ error: 'Erro na atualização do produto' });
      } else {
          res.json({ success: true });
      }
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
      
    }));

    res.json({ success: true, clientes });
  });
});
app.get('/buscar-cliente', (req, res) => {
  const nomeCliente = req.query.nome;

  // Consulta SQL para buscar o cliente pelo nome
  const sql = "SELECT idcliente, sobrenome, endereco, bairro, cidade, estado, cep FROM cliente WHERE nome_cli = ?";
  connection.query(sql, [nomeCliente], (error, results) => {
      if (error) {
          console.error('Erro na consulta:', error);
          res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
      } else {
          if (results.length > 0) {
              // Mapear os resultados para formatar o objeto
              const clienteEncontrado = {
                  id: results[0].idcliente,
                  sobrenome: results[0].sobrenome,
                  endereco: results[0].endereco,
                  bairro: results[0].bairro,
                  cidade: results[0].cidade,
                  estado: results[0].estado,
                  cep: results[0].cep
              };

              res.json(clienteEncontrado);
          } else {
              res.json(null); // Cliente não encontrado
          }
      }
  });
});
// Adicione esta rota para processar a atualização do cliente
app.put('/atualizar-cliente', (req, res) => {
  const clienteId = req.body.clienteId;
  const nome = req.body.nome;
  const sobrenome = req.body.sobrenome;
  const endereco = req.body.endereco;
  const bairro = req.body.bairro;
  const cidade = req.body.cidade;
  const estado = req.body.estado;
  const cep = req.body.cep;
  console.log('Dados recebidos:', req.body);
  console.log(clienteId, nome, sobrenome, endereco, bairro, cidade, estado, cep);
  

  // Consulta SQL para atualizar o nome e outros dados do cliente
  const sql = "UPDATE cliente SET nome_cli = ?, sobrenome = ?, endereco = ?, bairro = ?, cidade = ?, estado = ?, cep = ? WHERE idcliente = ?";
  connection.query(sql, [nome, sobrenome, endereco, bairro, cidade, estado, cep, clienteId], (error, results) => {
      if (error) {
          console.error('Erro na atualização:', error);
          res.status(500).json({ error: 'Erro na atualização do cliente' });
      } else {
          res.json({ success: true });
      }
  });
});

// Rota para obter o ID do cliente com base no nome
app.get('/obter-id-cliente', (req, res) => {
  const { nome } = req.query;

  if (!nome) {
      res.status(400).json({ error: 'Nome do cliente não fornecido.' });
      return;
  }

  connection.query('SELECT idcliente FROM cliente WHERE nome_cli = ?', [nome], (err, results) => {
      if (err) {
          console.error('Erro ao obter ID do cliente:', err);
          res.status(500).json({ error: 'Erro ao obter ID do cliente.' });
          return;
      }

      if (results.length === 0) {
          res.status(404).json({ error: 'Cliente não encontrado.' });
          return;
      }

      const idCliente = results[0].idcliente;
      res.json({ idCliente: idCliente });
  });
});

// Rota para obter informações do produto com base no nome
app.get('/obter-produto', (req, res) => {
  const nomeProduto = req.query.nome;

  // Consulta ao banco de dados para obter informações do produto
  const query = "SELECT idproduto, produto, quantidade, valor FROM produto WHERE produto = ?";
  const parametros = [nomeProduto];

  connection.query(query, parametros, (err, results) => {
      if (err) {
          console.error('Erro na consulta ao banco de dados: ' + err.stack);
          res.status(500).send('Erro interno no servidor');
          return;
      }

      if (results.length > 0) {
          const produto = {
              idproduto: results[0].idproduto,
              nome: results[0].produto,
              quantidade: results[0].quantidade,
              valor: results[0].valor
          };
          res.json(produto);
      } else {
          res.json(null); // Produto não encontrado
      }
  });
});
app.get('/detalhes-produto', (req, res) => {
  const idProduto = req.query.id;

  // Consulta SQL para buscar os detalhes do produto pelo ID
  const sql = "SELECT produto, quantidade, valor, tipo, marca FROM produto WHERE idproduto = ?";
  connection.query(sql, [idProduto], (error, results) => {
      if (error) {
          console.error('Erro na consulta:', error);
          res.status(500).json({ error: 'Erro na consulta ao banco de dados' });
      } else {
          if (results.length > 0) {
              const produtoEncontrado = {
                  nomeProduto: results[0].produto,
                  quantidade: results[0].quantidade,
                  valor: results[0].valor,
                  tipo: results[0].tipo,
                  marca: results[0].marca
              };
              res.json(produtoEncontrado);
          } else {
              res.json(null); // Produto não encontrado
          }
      }
  });
});


app.post('/consultar-vendas', (req, res) => {
  const idCliente = req.body.idCliente;

  // Realize a consulta no banco de dados para obter as vendas do cliente
  connection.query(
      'SELECT compras.id, compras.data_compra, compras.forma_pagamento, compras.valor_total, compras.desconto, itens_compra.id_produto, itens_compra.quantidade, itens_compra.valor_unitario, produto.produto FROM compras JOIN itens_compra ON compras.id = itens_compra.id_compra JOIN produto ON itens_compra.id_produto = produto.idproduto WHERE compras.id_cliente = ?',
      [idCliente],
      async (err, results) => {
          if (err) {
              console.error('Erro ao consultar vendas:', err);
              res.status(500).send('Erro ao consultar vendas.');
              return;
          }
          // Enviar os resultados atualizados como resposta
          res.status(200).json(results);
      }
  );
});




// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
