document.addEventListener('DOMContentLoaded', function () {
    const personagens = document.querySelectorAll('.personagem');
    const contador = document.getElementById('contador-selecao');
    const confirmarBtn = document.getElementById('confirmar-selecao');
    const mensagemErro = document.getElementById('mensagem-erro');

    let selecionados = [];
    const limiteSelecao = 5;

    // Função para mostrar erro
    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = 'block';
        setTimeout(() => {
            mensagemErro.style.display = 'none';
        }, 3000);
    }

    // Seleção de personagens
    personagens.forEach(personagem => {
        personagem.addEventListener('click', function() {
            const nome = this.getAttribute('data-nome');
            
            if (this.classList.contains('selecionado')) {
                // Desselecionar
                this.classList.remove('selecionado');
                selecionados = selecionados.filter(item => item !== nome);
            } else {
                // Selecionar (se não atingiu o limite)
                if (selecionados.length < limiteSelecao) {
                    this.classList.add('selecionado');
                    selecionados.push(nome);
                }
            }
            
            // Atualizar contador
            contador.textContent = `${selecionados.length}/${limiteSelecao}`;
            
            // Ativar/desativar botões
            confirmarBtn.disabled = selecionados.length !== limiteSelecao;
        });
    });

    // Botão Confirmar Seleção
    confirmarBtn.addEventListener('click', function() {
        if (selecionados.length === limiteSelecao) {          // Enviar o deck para o servidor
            enviarDeckParaServidor();
        } else {
            mostrarErro('Selecione exatamente 5 personagens!');
        }
    });

    // Função para enviar os personagens ao servidor
    function enviarDeckParaServidor() {
        // Salvar localmente as cartas selecionadas para uso posterior
        localStorage.setItem('cartasSelecionadas', JSON.stringify(selecionados));
        
        fetch('/salvar-deck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ personagens: selecionados })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Deck salvo com sucesso:', selecionados);
                // Redirecionar para a página de sorteio após salvar com sucesso
                window.location.href = '/jogo';
            } else {
                mostrarErro('Erro ao salvar deck: ' + data.message);
            }
        })
        .catch(error => {
            mostrarErro('Erro de conexão com o servidor');
            console.error('Erro:', error);
        });
    }
});
