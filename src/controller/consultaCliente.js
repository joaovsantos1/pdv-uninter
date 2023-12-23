async function pesquisarClientes() {
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