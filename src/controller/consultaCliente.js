async function consultaClientes() {
  const nomePesquisa = document.getElementById('nomePesquisa').value;

  // Faça uma requisição AJAX para obter os clientes com base no nome
  try {
    const response = await fetch(`/consulta-clientes?nome=${nomePesquisa}`);
    const data = await response.json();

    if (data.success) {
      // Limpa a tabela
      const tbody = document.querySelector('#clientesTable tbody');
      tbody.innerHTML = '';

      // Preenche a tabela com os dados dos clientes
      data.clientes.forEach(cliente => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${cliente.id}</td>
                         <td>${cliente.nome}</td>
                         <td>${cliente.sobrenome}</td>
                         <td>${cliente.endereco}</td>
                         <td>${cliente.bairro}</td>
                         <td>${cliente.cidade}</td>
                         <td>${cliente.estado}</td>
                         <td>${cliente.cep}</td>`;
        tbody.appendChild(row);
      });
    } else {
      console.error('Erro ao pesquisar clientes:', data.message);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
}

async function pesquisarCliente() {
  let nome = document.getElementById("nome").value;

  try {
      // Envie uma solicitação para o servidor
      const response = await fetch('/buscar-cliente?nome=' + encodeURIComponent(nome));
      const data = await response.json();

      if (data) {
          // Preencha os campos com os dados recuperados
          document.getElementById("sobrenome").value = data.sobrenome;
          document.getElementById("endereco").value = data.endereco;
          document.getElementById("bairro").value = data.bairro;
          document.getElementById("cidade").value = data.cidade;
          document.getElementById("estado").value = data.estado;
          document.getElementById("cep").value = data.cep;
          document.getElementById("clienteId").value = data.id;
      } else {
          alert("Cliente não encontrado.");
      }
  } catch (error) {
      console.error('Erro na solicitação:', error);
  }
}
