async function consultarVendas() {
    const nomeCliente = document.getElementById("searchInput").value;

    // Enviar uma solicitação GET para o servidor para obter o ID do cliente
    const responseIdCliente = await fetch(`/obter-id-cliente?nome=${nomeCliente}`);

    if (!responseIdCliente.ok) {
        console.error('Erro ao obter ID do cliente:', responseIdCliente.statusText);
        return;
    }

    const dataIdCliente = await responseIdCliente.json();

    if (dataIdCliente.error) {
        console.log(dataIdCliente.message);
        return;
    }

    const idCliente = dataIdCliente.idCliente;

    // Enviar uma solicitação POST para o servidor para obter as vendas do cliente com base no ID do cliente
    const responseVendas = await fetch('/consultar-vendas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idCliente: idCliente }),
    });

    if (!responseVendas.ok) {
        console.error('Erro ao consultar vendas:', responseVendas.statusText);
        return;
    }

    const dataVendas = await responseVendas.json();

    // Limpar a tabela de vendas
    const salesBody = document.getElementById('salesBody');
    salesBody.innerHTML = '';

    // Preencher a tabela com os dados retornados
    dataVendas.forEach((item) => {
        // Criar um novo objeto de data com a data da compra
    const dataCompra = new Date(item.data_compra);

    // Formatar a data da compra para o formato desejado
    const dataFormatada = dataCompra.toLocaleDateString('pt-BR', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit',second: '2-digit'});
        const row = `<tr>
                        <td>${item.id}</td>
                        <td>${dataFormatada}</td>
                        <td>${item.forma_pagamento}</td>
                        <td>${item.valor_total}</td>
                        <td>${item.desconto}</td>
                        <td>${item.id_produto}</td>
                        <td>${item.produto}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.valor_unitario}</td>
                    </tr>`;
        salesBody.innerHTML += row;
    });
}
