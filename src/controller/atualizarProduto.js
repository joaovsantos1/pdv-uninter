async function atualizarProduto() {
    let produtoId = document.getElementById("produtoId").value;
    let nome = document.getElementById("nomeProduto").value;
    let quantidade = document.getElementById("quantidade").value;
    let valor = document.getElementById("valor").value;
    let tipo = document.getElementById("tipo").value;
    let marca = document.getElementById("marca").value;
    
  
    
     
      console.log('ID do produto:', produtoId);
      
      try {
        
        const response = await fetch('/atualizar-produto', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            produtoId: produtoId,
            nome: nome,
            quantidade: quantidade,
            valor: valor,
            tipo: tipo,
            marca: marca
          }),
        });
  
        if (!response.ok) {
          throw new Error('Erro na solicitação: ' + response.status);
        }
  
        const data = await response.json();
        console.log(data); 
        alert("Produto atualizado com sucesso!");
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    } 
  