async function atualizarCliente() {
  let clienteId = document.getElementById("clienteId").value;
  let nome = document.getElementById("nome").value;
  let sobrenome = document.getElementById("sobrenome").value;
  let endereco = document.getElementById("endereco").value;
  let bairro = document.getElementById("bairro").value;
  let cidade = document.getElementById("cidade").value;
  let estado = document.getElementById("estado").value;
  let cep = document.getElementById("cep").value;


   
    console.log('ID do cliente:', clienteId);
    
    try {
      // Envie uma solicitação para o servidor para atualizar os dados do cliente
      const response = await fetch('/atualizar-cliente', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clienteId: clienteId,
          nome: nome,
          sobrenome: sobrenome,
          endereco: endereco,
          bairro: bairro,
          cidade: cidade,
          estado: estado,
          cep: cep
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na solicitação: ' + response.status);
      }

      const data = await response.json();
      console.log(data); // Adicione esta linha para imprimir os dados no console
      alert("Cliente atualizado com sucesso!");
    } catch (error) {
      console.error('Erro na solicitação:', error);
    }
  } 
