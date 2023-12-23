
  function atualizarCliente() {
    // Obter os dados do formulário
    const clienteId = document.getElementById('id').value;
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const endereco = document.getElementById('endereco').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;
    // Obter os demais campos da mesma forma

    // Enviar uma requisição POST para atualizar os dados do cliente
    fetch('/atualizar-cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: clienteId,
        nome: nome,
        sobrenome: sobrenome,
        endereco: endereco,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        cep: cep
        // Enviar os demais campos da mesma forma
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao atualizar dados do cliente');
      }
      // Tratar a resposta do servidor conforme necessário
      console.log('Dados do cliente atualizados com sucesso');
      // Opcional: Redirecionar para a página de consulta ou outra página desejada
      window.location.href = '/consulta-cliente';
    })
    .catch(error => console.error('Erro ao atualizar dados do cliente', error));
  }

