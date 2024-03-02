async function cadastroCliente() {
    let nome = document.getElementById("nome").value;
    let sobrenome = document.getElementById("sobrenome").value;
    let endereco = document.getElementById("endereco").value;
    let bairro = document.getElementById("bairro").value;
    let cidade = document.getElementById("cidade").value;
    let estado = document.getElementById("estado").value;
    let cep = document.getElementById("cep").value;
  
      try {
        
        const response = await fetch('cadastro-cliente', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: nome,
            sobrenome: sobrenome,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            estado: estado,
            cep: cep
          }),
        });
  
        if (!response.ok) {
          throw new Error('Erro na solicitação: ' + response.status);
        }
  
        const data = await response.json();
        console.log(data); // Adicione esta linha para imprimir os dados no console
        alert("Cliente cadastrado com sucesso!");
      } catch (error) {
        console.error('Erro na solicitação:', error);
      }
    } 
  