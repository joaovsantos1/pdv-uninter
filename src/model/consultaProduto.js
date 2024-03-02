async function consultaProdutos() {
    const produtoPesquisa = document.getElementById('produtoPesquisa').value;
  
    
    try {
      const response = await fetch(`/consulta-produtos?nome=${produtoPesquisa}`);
      const data = await response.json();
  
      if (data.success) {
        // Limpa a tabela
        const tbody = document.querySelector('#produtosTable tbody');
        tbody.innerHTML = '';
  
      
        data.produtos.forEach(produto => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${produto.id}</td>
                           <td>${produto.nome}</td>
                           <td>${produto.quantidade}</td>
                           <td>${produto.valor}</td>
                           <td>${produto.tipo}</td>
                           <td>${produto.marca}</td>`;
          tbody.appendChild(row);
        });
      } else {
        console.error('Erro ao pesquisar produtos:', data.message);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  }

  async function pesquisarProduto() {
    let nome = document.getElementById("nomeProduto").value;
  
    try {
        // Envie uma solicitação para o servidor
        const response = await fetch('/buscar-produto?nome=' + encodeURIComponent(nome));
        const data = await response.json();
  
        if (data) {
            // Preencha os campos com os dados recuperados
            document.getElementById("quantidade").value = data.quantidade;
            document.getElementById("valor").value = data.valor;
            document.getElementById("tipo").value = data.tipo;
            document.getElementById("marca").value = data.marca;
            document.getElementById("produtoId").value = data.id;
        } else {
            alert("Produto não encontrado.");
        }
    } catch (error) {
        console.error('Erro na solicitação:', error);
    }
  }
  