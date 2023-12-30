async function cadastroProduto() {
    let nomeProduto = document.getElementById("nomeProduto").value;
    let quantidade = document.getElementById("quantidade").value;
    let valor = document.getElementById("valor").value;
    let tipo = document.getElementById("tipo").value;
    let marca = document.getElementById("marca").value;

    try {
        const response = await fetch('/cadastro-produto', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nomeProduto: nomeProduto,
              quantidade: quantidade,
              valor: valor,
              tipo: tipo,
              marca: marca
            }),
          });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                alert('Produto cadastrado com sucesso!');
                // Limpar campos de entrada ou realizar outras ações, se necessário
            } else {
                alert(`Erro: ${data.error || 'Erro desconhecido.'}`);
            }
        } else {
            alert('Erro ao tentar cadastrar o produto. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro durante a requisição:', error);
        alert('Erro ao tentar cadastrar o produto. Por favor, tente novamente.');
    }
}