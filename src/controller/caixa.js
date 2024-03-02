async function finalizarCompra() {
    const nomeCliente = document.getElementById("nomeCliente").value;
    const formaPagamentoElement = document.getElementById("formaPagamento");
    let formaPagamento;

    if (formaPagamentoElement) {
        const opcaoSelecionada = formaPagamentoElement.options[formaPagamentoElement.selectedIndex];
        formaPagamento = opcaoSelecionada ? opcaoSelecionada.text : null;
    } else {
        console.error('Elemento com ID "formaPagamento" não encontrado.');
    }

// Agora, formaPagamento contém o texto da opção selecionada
console.log(formaPagamento);

    const valorTotal = document.getElementById("valorTotal").value;
    const desconto = document.getElementById("desconto").value;

    // Obter o ID do cliente
    const idCliente = await obterIdCliente(nomeCliente);

    if (idCliente === null) {
        console.error('Cliente não encontrado.');
        return;
    }

    // Obter dados da tabela
    const linhasTabela = document.querySelectorAll("#tabelaProdutos tbody tr");
    const produtos = [];

    linhasTabela.forEach((linha) => {
        const idProduto = linha.querySelector("td:nth-child(1)").innerText;
        const nomeProduto = linha.querySelector("td:nth-child(2)").innerText;
        const valorProduto = linha.querySelector("td:nth-child(3)").innerText;
        const quantidadeProduto = linha.querySelector("td:nth-child(4)").innerText;

        produtos.push({
            idProduto: idProduto,
            nome: nomeProduto,
            valor: valorProduto,
            quantidade: quantidadeProduto,
        });
    });

    // Construir objeto com os dados a serem enviados
    const dadosCompra = {
        idCliente: idCliente,
        formaPagamento: formaPagamento,
        valorTotal: valorTotal,
        desconto: desconto,
        produtos: produtos,
    };

    // Enviar os dados ao servidor usando fetch
    fetch('/finalizar-compra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosCompra),
    })
    .then(async (response) => {
        
            const text = await response.text();
            
            try {
                const data = JSON.parse(text);
                return data;
            } catch (jsonError) {
                throw new Error(`Erro ao analisar a resposta JSON: ${jsonError.message}`);
            }
        })
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert('Compra finalizada com sucesso!');
            limparCampos();
        })
        
    .catch((error) => {
        console.error('Erro durante a requisição:', error);

        if (error instanceof SyntaxError) {
            console.log('A resposta do servidor contém uma resposta JSON malformada.');
        } else if (error instanceof Error) {
            console.log('Detalhes da resposta do servidor:', error.message);
        } else {
            console.error('Erro desconhecido ao lidar com a resposta do servidor.');
        }
    });
    
    
}

async function obterIdCliente(nomeCliente) {
    const response = await fetch(`/obter-id-cliente?nome=${nomeCliente}`);
    const data = await response.json();
    return data.idCliente;
}

function limparCampos() {
    // Limpar os inputs
    document.getElementById("nomeCliente").value = "";
    document.getElementById("nomeProduto").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("formaPagamento").selectedIndex = 0;
    document.getElementById("valorTotal").value = "";
    document.getElementById("desconto").value = "";

    // Limpar a tabela
    $("#tabelaProdutos tbody").empty();
}
