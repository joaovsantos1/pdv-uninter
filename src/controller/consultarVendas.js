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

    
    dataVendas.forEach((item) => {
        
    const dataCompra = new Date(item.data_compra);

    
    const dataFormatada = dataCompra.toLocaleDateString('pt-BR', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit',second: '2-digit'});
        const row = `<tr>
                        <td>${item.id}</td>
                        <td>${dataFormatada}</td>
                        <td>${item.id_produto}</td>
                        <td>${item.produto}</td>
                        <td>${item.valor_unitario}</td>
                        <td>${item.quantidade}</td>
                        <td>${item.forma_pagamento}</td>
                        <td>${item.desconto}</td>
                        <td>${item.valor_total}</td>                        
                    </tr>`;
        salesBody.innerHTML += row;
    });
}
