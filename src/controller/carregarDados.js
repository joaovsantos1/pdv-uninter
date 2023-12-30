async function adicionarLinha() {
    var nomeCliente = $("#nomeCliente").val();
    var nomeProduto = $("#nomeProduto").val();
    var quantidade = parseInt($("#quantidade").val());

    // Verifique se todos os campos estão preenchidos
    if (!nomeCliente || !nomeProduto || isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, preencha todos os campos e insira uma quantidade válida.");
        return;
    }

    try {
        // Use fetch com async/await para obter informações do produto do servidor
        const response = await fetch(`/obter-produto?nome=${nomeProduto}`);

        if (!response.ok) {
            throw new Error("Erro ao obter informações do produto.");
        }

        const produto = await response.json();
        console.log(produto);

        if (produto) {
            // Verifique se a quantidade total na tabela é maior do que a quantidade em estoque
            var quantidadeTotalNaTabela = obterQuantidadeTotalNaTabela();
            
            if (quantidadeTotalNaTabela + quantidade > produto.quantidade) {
                alert("Quantidade total na tabela excede a quantidade em estoque. Estoque disponível: " + produto.quantidade);
                return;
            }

            // Verifique se já existe uma linha para este produto
            var linhaExistente = $("#tabelaProdutos tbody tr:contains('" + produto.nome + "')");

            if (linhaExistente.length > 0) {
                // Se existir, atualize a quantidade
                var quantidadeAtual = parseInt(linhaExistente.find("td:eq(3)").text());
                linhaExistente.find("td:eq(3)").text(quantidadeAtual + quantidade);
            } else {
                // Se não existir, adicione uma nova linha à tabela com as informações do produto e quantidade
                var newRow = $("<tr>");
                newRow.append("<td>" + produto.idproduto + "</td>");
                newRow.append("<td>" + produto.nome + "</td>");
                newRow.append("<td>" + produto.valor + "</td>");
                newRow.append("<td>" + quantidade + "</td>");
                $("#tabelaProdutos tbody").append(newRow);
            }

            // Atualizar o subtotal
            atualizarSubtotal();
        } else {
            alert("Produto não encontrado!");
        }
    } catch (error) {
        console.error("Erro durante a solicitação fetch:", error);
        alert("Erro ao obter informações do produto.");
    }
}

function obterQuantidadeTotalNaTabela() {
    var linhas = $("#tabelaProdutos tbody tr");
    var quantidadeTotal = 0;

    // Iterar sobre as linhas da tabela e somar as quantidades
    linhas.each(function () {
        quantidadeTotal += parseInt($(this).find("td:eq(3)").text());
    });

    return quantidadeTotal;
}

function atualizarSubtotal() {
    let linhas = $("#tabelaProdutos tbody tr");
    let subtotal = 0;

    // Iterar sobre as linhas da tabela e calcular o subtotal
    linhas.each(function () {
        let valorUnitario = parseFloat($(this).find("td:eq(2)").text());
        let quantidade = parseInt($(this).find("td:eq(3)").text());

        console.log("Valor Unitário:", valorUnitario);
        console.log("Quantidade:", quantidade);
        subtotal += quantidade * valorUnitario;
    });
    
    let desconto = parseFloat($("#desconto").val()) || 0;
    
    // Aplicar o desconto ao subtotal
    let subtotalComDesconto = subtotal - desconto;
    
    // Exibir o subtotal com desconto na caixa de texto desativada
    $("#valorTotal").val(subtotalComDesconto.toFixed(2));
}
