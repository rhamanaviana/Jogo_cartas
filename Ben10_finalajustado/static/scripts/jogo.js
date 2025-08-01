const timePerRound = 30;
let currentTime = timePerRound;
let currentPlayerTurn = Math.random() < 0.5 ? 1 : 2; // Sorteia quem começa: 1 para oponente, 2 para jogador
let actionTaken = false; // Controla se uma ação principal (ataque ou troca) já foi feita no turno
let timerInterval;
let isFirstRound = true;

// Status de veneno
let player1Poisoned = false;
let player1PoisonTurns = 0;
let player2Poisoned = false;
let player2PoisonTurns = 0;
const POISON_DAMAGE = 5;
const POISON_DURATION = 3;

// Elemento para exibir o turno atual
let turnDisplayElement = null;

// Mapeamento das cartas
const cartasInfo = {
    'Fantasmático': {
        imagem: '../static/assets/Fantasmatico.png',
        vida: 100,
        ataques: [
            { nome: "Espectral", dano: 30, efeito: 'veneno' },
            { nome: "Possessão", dano: 60 }
        ]
    },
    'XLR8': {
        imagem: '../static/assets/XLR8.png',
        vida: 90,
        ataques: [
            { nome: "Veloz", dano: 40 },
            { nome: "Ciclone", dano: 70 }
        ]
    },
    'Gosma': {
        imagem: '../static/assets/Gosma.png',
        vida: 120,
        ataques: [
            { nome: "Ácido", dano: 20 },
            { nome: "Pegajoso", dano: 50 }
        ]
    },
    'Quatro Braços': {
        imagem: '/static/assets/quatrobraços.png',
        vida: 130,
        ataques: [
            { nome: "Soco", dano: 50 },
            { nome: "Choque", dano: 80 }
        ]
    },
    'Alien X': {
        imagem: '../static/assets/Alien_X.png',
        vida: 200,
        ataques: [
            { nome: "Pulso", dano: 70 },
            { nome: "Realidade", dano: 120 }
        ]
    },
    'Aquático': {
        imagem: '../static/assets/Aquatico.png',
        vida: 110,
        ataques: [
            { nome: "Jato", dano: 40 },
            { nome: "Mordida", dano: 75 }
        ]
    },
    'Tarta Gira': {
        imagem: '../static/assets/Tarta Gira.png',
        vida: 140,
        ataques: [
            { nome: "Giro", dano: 30 },
            { nome: "Tornado", dano: 65 }
        ]
    },
    'Macaco Aranha': {
        imagem: '../static/assets/Macaco Aranha.png',
        vida: 100,
        ataques: [
            { nome: "Teia", dano: 35 },
            { nome: "Acrobacia", dano: 70 }
        ]
    },
    'Cromático': {
        imagem: '../static/assets/Cromatico.png',
        vida: 110,
        ataques: [
            { nome: "Prisma", dano: 45 },
            { nome: "Absorção", dano: 70 }
        ]
    },
    'Insectóide': {
        imagem: '../static/assets/Insectoide.png',
        vida: 90,
        ataques: [
            { nome: "Gosma", dano: 30 },
            { nome: "Picada", dano: 60 }
        ]
    },
    'Feedback': {
        imagem: '../static/assets/Feedback.png',
        vida: 120,
        ataques: [
            { nome: "Elétrica", dano: 40 },
            { nome: "Descarga", dano: 80 }
        ]
    },
    'Friagem': {
        imagem: '../static/assets/Friagem.png',
        vida: 100,
        ataques: [
            { nome: "Sopro", dano: 35 },
            { nome: "Intangível", dano: 65 }
        ]
    },
    'Choque Squad': {
        imagem: '../static/assets/Choque Squad.png',
        vida: 130,
        ataques: [
            { nome: "Investida", dano: 50 },
            { nome: "Terremoto", dano: 75 }
        ]
    },
    'Ultra T': {
        imagem: '../static/assets/Ultra T.png',
        vida: 110,
        ataques: [
            { nome: "Raio", dano: 45 },
            { nome: "Transformação", dano: 70 }
        ]
    },
    'Cipó Selvagem': {
        imagem: '../static/assets/cipoo.png',
        vida: 120,
        ataques: [
            { nome: "Chicote", dano: 40 },
            { nome: "Esporos", dano: 60, efeito: 'veneno' }
        ]
    },
    'Eco Eco': {
        imagem: '../static/assets/eco_eco.png',
        vida: 90,
        ataques: [
            { nome: "Grito", dano: 30 },
            { nome: "Multiplicar", dano: 55 }
        ]
    },
    'Massa Cinzenta': {
        imagem: '../static/assets/Massa Cinzenta.png',
        vida: 80,
        ataques: [
            { nome: "Cálculo", dano: 20 },
            { nome: "Mental", dano: 50 }
        ]
    }
};
// Aliases
cartasInfo['Gosma'] = cartasInfo['Gosma'];
cartasInfo['Quatro Braças'] = cartasInfo['Quatro Braços'];
cartasInfo['Cromático'] = cartasInfo['Cromático'];
cartasInfo['Ultra T'] = cartasInfo['Ultra T'];
cartasInfo['Massa Cinzenta'] = cartasInfo['Massa Cinzenta'];    
cartasInfo['Éco Éco'] = cartasInfo['Eco Eco'];

// --- Variáveis Globais ---
let cartasSelecionadas = [];
let cartasNaBatalha = []; // { player, elemento, nome, vidaAtual, vidaMax, ataques, efeitoCarta, indexOrigem }
let cartasBancoJogador = []; // Elementos DOM das cartas no banco
let cartasBancoOponente = []; // Elementos DOM
let bancoExpandido = false; // Controla se o banco do jogador está expandido
let modoTrocaAtivo = false; // Controla se o jogador está no processo de troca

// --- Inicialização ---
try {
    const cartasSalvas = localStorage.getItem('cartasSelecionadas');
    if (cartasSalvas) {
        cartasSelecionadas = JSON.parse(cartasSalvas);
        console.log('Cartas carregadas:', cartasSelecionadas);
        document.addEventListener('DOMContentLoaded', inicializarJogo);
    } else {
        console.log('Nenhuma carta encontrada no localStorage.');
        alert("Nenhum deck selecionado! Volte e escolha um deck.");
        // window.location.href = '/predefinicoes'; // Idealmente redirecionar
    }
} catch (error) {
    console.error('Erro ao carregar cartas:', error);
}

function inicializarJogo() {
    // Explicitamente limpa os slots de batalha para garantir que comecem vazios
    document.querySelectorAll('.batalha .card-select').forEach(slot => slot.innerHTML = '');

    // Cria o elemento de exibição de turno
    criarElementoExibicaoTurno();

    carregarCartasJogador();
    carregarCartasOponente();
    const botaoTrocar = document.getElementById("trocarCartaBtn");
    if (botaoTrocar) {
        botaoTrocar.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentPlayerTurn !== 2) return; // Só funciona no turno do jogador

            if (modoTrocaAtivo) {
                cancelarTroca();
            } else {
                // Verifica se há uma carta na batalha para poder iniciar a troca
                const cartaAtualJogadorData = cartasNaBatalha.find(c => c.player === 2);
                const cartasDisponiveisBanco = cartasBancoJogador.length > 0;

                if (!cartaAtualJogadorData) {
                    exibirMensagemTemporaria("Você precisa ter uma carta na batalha para trocar.", "erro");
                    return;
                }
                if (!cartasDisponiveisBanco) {
                    exibirMensagemTemporaria("Você não tem cartas no banco para trocar.", "erro");
                    return;
                }
                iniciarTroca();
            }
        });
    }
    criarCronometroVisual();

    // Sorteio inicial de quem começa
    realizarSorteioInicial();

    // Mostra o aviso de turno inicial com destaque
    exibirAvisoTurno(true); // true indica que é o primeiro turno
}

function criarElementoExibicaoTurno() {
    turnDisplayElement = document.createElement('div');
    turnDisplayElement.id = 'turn-display';
    turnDisplayElement.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: #00FF00;
        padding: 8px 15px;
        border-radius: 5px;
        font-size: 1.1rem;
        font-weight: bold;
        z-index: 100;
        border: 1px solid #00FF00;
        box-shadow: 0 0 8px #00FF00;
        display: none; /* Começa escondido */
        transition: opacity 0.5s ease;
    `;
    document.querySelector('.gaming-mat').appendChild(turnDisplayElement);
}

function exibirAvisoTurno(isFirst = false) {
    if (!turnDisplayElement) return;

    const jogadorTurno = currentPlayerTurn === 1 ? "OPONENTE" : "JOGADOR";
    turnDisplayElement.textContent = `TURNO DO ${jogadorTurno}`;
    turnDisplayElement.style.display = 'block';
    turnDisplayElement.style.opacity = '1';

    // Esconde após um tempo, exceto se for o primeiro turno (que já tem um delay maior)
    if (!isFirst) {
        setTimeout(() => {
            turnDisplayElement.style.opacity = '0';
            setTimeout(() => { turnDisplayElement.style.display = 'none'; }, 500); // Esconde após fade out
        }, 2000); // Mantém visível por 2 segundos
    }

    // Lógica original do timeWarning (adaptada)
    const timeWarning = document.getElementById('timeWarning'); // Mantém o original para compatibilidade, se houver
    if (timeWarning && isFirst) {
        timeWarning.querySelector('h1').textContent = `TURNO DO ${jogadorTurno}`;
        timeWarning.style.display = 'flex';
        setTimeout(() => {
            timeWarning.style.display = 'none';
            turnDisplayElement.style.opacity = '0'; // Esconde o novo display também
             setTimeout(() => { turnDisplayElement.style.display = 'none'; }, 500);
            startTimer();
            updateTurnUI();
            if (currentPlayerTurn === 1) {
                setTimeout(jogadaOponente, 1500);
            }
        }, 3000); // Delay inicial maior
    } else if (!isFirst) {
         startTimer();
         updateTurnUI();
         if (currentPlayerTurn === 1) {
             setTimeout(jogadaOponente, 1500);
         }
    }
}


// Função para realizar o sorteio inicial de quem começa
function realizarSorteioInicial() {
    // Sorteia aleatoriamente quem começa (1 para oponente, 2 para jogador)
    currentPlayerTurn = Math.random() < 0.5 ? 1 : 2;
    console.log(`Sorteio inicial: ${currentPlayerTurn === 1 ? 'Oponente' : 'Jogador'} começa!`);

    // Cria um elemento visual para mostrar o resultado do sorteio
    const sorteioElement = document.createElement('div');
    sorteioElement.className = 'sorteio-inicial';
    sorteioElement.innerHTML = `
        <h2>SORTEIO INICIAL</h2>
        <p>${currentPlayerTurn === 1 ? 'OPONENTE' : 'JOGADOR'} COMEÇA!</p>
    `;
    sorteioElement.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 128, 0, 0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        text-align: center;
        z-index: 2000;
        border: 3px solid #00FF00;
        box-shadow: 0 0 25px #00FF00;
    `;

    document.body.appendChild(sorteioElement);

    // Remove o elemento após alguns segundos
    setTimeout(() => {
        sorteioElement.style.opacity = '0';
        sorteioElement.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => sorteioElement.remove(), 500);
    }, 2500);
}

// --- Carregamento de Cartas ---
function carregarCartasJogador() {
    const containerBanco = document.getElementById('player-cards');
    containerBanco.innerHTML = '';
    cartasBancoJogador = [];

    cartasSelecionadas.forEach((nomeCarta, index) => {
        const cartaInfo = cartasInfo[nomeCarta] || {
            imagem: '../static/assets/fundo_carta.png',
            vida: 50,
            ataques: [{ nome: "Ataque Básico", dano: 10 }]
        };
        if (!cartaInfo.vida) cartaInfo.vida = 100;

        const cardElement = criarElementoCarta(nomeCarta, cartaInfo, index, 2);
        containerBanco.appendChild(cardElement);
        cartasBancoJogador.push(cardElement);

        // Evento de clique inicial (mover para batalha ou trocar)
        adicionarListenerCartaBanco(cardElement);
    });
}

function adicionarListenerCartaBanco(cardElement) {
    cardElement.removeEventListener('click', handleCliqueCartaBanco);
    cardElement.addEventListener('click', handleCliqueCartaBanco);
}

function handleCliqueCartaBanco() {
    const cartaElement = this;
    if (modoTrocaAtivo && currentPlayerTurn === 2) {
        // Executar troca
        executarTroca(cartaElement);
    } else if (currentPlayerTurn === 2 && !document.querySelector('.batalha .card-select:nth-child(2) .carta-batalha')) {
        // Mover para batalha se o slot estiver vazio
        moverCartaParaBatalha(cartaElement, 2);
        // Esconder o banco se estava expandido (após mover a primeira carta)
        if (bancoExpandido) {
            toggleBancoJogador(false);
        }
    }
}

function carregarCartasOponente() {
    const containerBancoOponente = document.querySelector('.player-zone.top .card-row');
    containerBancoOponente.innerHTML = '';
    cartasBancoOponente = [];
    const nomesCartasOponente = Object.keys(cartasInfo).sort(() => 0.5 - Math.random()).slice(0, 5);

    nomesCartasOponente.forEach((nomeCarta, index) => {
        const cartaInfo = cartasInfo[nomeCarta];
        if (!cartaInfo.vida) cartaInfo.vida = 100;
        const cardElement = criarElementoCarta(nomeCarta, cartaInfo, index, 1);
        cardElement.style.opacity = '0.7'; // Mantém oponente um pouco opaco
        cardElement.style.pointerEvents = 'none';
        containerBancoOponente.appendChild(cardElement);
        cartasBancoOponente.push(cardElement);
    });
}

function criarElementoCarta(nome, info, index, player) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.nome = nome;
    cardElement.dataset.vidaAtual = info.vida;
    cardElement.dataset.vidaMax = info.vida;
    cardElement.dataset.index = index;
    cardElement.dataset.player = player;
    cardElement.dataset.ataques = JSON.stringify(info.ataques || []);
    if (info.efeito) {
        cardElement.dataset.efeitoCarta = info.efeito;
    }

    // Cabeçalho no estilo da página "cartas"
    const headerElement = document.createElement('div');
    headerElement.className = 'header';

    const titleElement = document.createElement('div');
    titleElement.className = 'title';
    titleElement.textContent = nome;
    headerElement.appendChild(titleElement);

    const psElement = document.createElement('div');
    psElement.className = 'ps';
    psElement.textContent = `PS ${info.vida}`;
    headerElement.appendChild(psElement);

    cardElement.appendChild(headerElement);

    const img = document.createElement('img');
    img.src = info.imagem;
    img.alt = nome;
    cardElement.appendChild(img);

    const vidaContainer = document.createElement('div');
    vidaContainer.className = 'vida-container';
    const vidaBarra = document.createElement('div');
    vidaBarra.className = 'vida-barra';
    vidaBarra.style.width = '100%';
    vidaContainer.appendChild(vidaBarra);
    const vidaTexto = document.createElement('span');
    vidaTexto.className = 'vida-texto';
    vidaTexto.textContent = `${info.vida}/${info.vida}`;
    vidaContainer.appendChild(vidaTexto);
    cardElement.appendChild(vidaContainer);

    const ataquesContainer = document.createElement('div');
    ataquesContainer.className = 'ataques-container';
    ataquesContainer.style.display = 'none';
    cardElement.appendChild(ataquesContainer);

    return cardElement;
}

// --- Lógica de Batalha ---
function moverCartaParaBatalha(cartaElement, player) {
    const slotBatalhaIndex = player === 1 ? 0 : 1; // 0 para oponente (esquerda), 1 para jogador (direita)
    const cardSelect = document.querySelectorAll('.batalha .card-select')[slotBatalhaIndex];

    if (cardSelect.querySelector('.carta-batalha')) {
        console.warn('Tentativa de mover carta para slot de batalha já ocupado.');
        return; // Não move se já houver uma carta
    }

    // Remove a carta do array do banco correspondente
    if (player === 2) {
        cartasBancoJogador = cartasBancoJogador.filter(bancoCard => bancoCard !== cartaElement);
    } else {
        cartasBancoOponente = cartasBancoOponente.filter(bancoCard => bancoCard !== cartaElement);
    }

    cartaElement.classList.add('carta-batalha');
    cartaElement.style.display = 'flex';
    cartaElement.style.opacity = '1';
    cardSelect.appendChild(cartaElement);

    const ataques = JSON.parse(cartaElement.dataset.ataques || '[]');
    cartasNaBatalha.push({
        player: player,
        elemento: cartaElement,
        nome: cartaElement.dataset.nome,
        vidaAtual: parseInt(cartaElement.dataset.vidaAtual),
        vidaMax: parseInt(cartaElement.dataset.vidaMax),
        ataques: ataques,
        efeitoCarta: cartaElement.dataset.efeitoCarta,
        indexOrigem: cartaElement.dataset.index // Mantém o índice original se precisar retornar
    });

    mostrarAtaquesNaCarta(cartaElement, ataques, player);
    console.log(`Jogador ${player} moveu ${cartaElement.dataset.nome} para a batalha.`);

    // Se o jogador moveu a carta, esconde o banco se estava expandido
    if (player === 2 && bancoExpandido) {
        toggleBancoJogador(false);
    }
}

function mostrarAtaquesNaCarta(cartaElement, ataques, player) {
    const ataquesContainer = cartaElement.querySelector('.ataques-container');
    if (!ataquesContainer) return;

    ataquesContainer.innerHTML = '';
    ataquesContainer.style.display = 'flex'; // Garante que está visível

    ataques.forEach((ataque, index) => {
        const ataqueBtn = document.createElement('button');
        ataqueBtn.className = 'botao-ataque';
        ataqueBtn.textContent = `${ataque.nome} (${ataque.dano})`;
        // Habilita botão apenas se for o turno do jogador E for a carta do jogador
        if (player === currentPlayerTurn && player === 2) {
            ataqueBtn.disabled = false;
            ataqueBtn.onclick = (e) => {
                e.stopPropagation(); // Previne que o clique propague para a carta
                if (!actionTaken) {
                    attack(player, 1, index); // Jogador (2) ataca Oponente (1)
                }
            };
        } else {
            ataqueBtn.disabled = true;
        }
        ataquesContainer.appendChild(ataqueBtn);
    });
}

function attack(attackerPlayer, targetPlayer, attackIndex) {
    if (actionTaken) {
        console.log("Ação já realizada neste turno.");
        return;
    }

    const attackerData = cartasNaBatalha.find(c => c.player === attackerPlayer);
    const targetData = cartasNaBatalha.find(c => c.player === targetPlayer);

    if (!attackerData) {
        alert(`Jogador ${attackerPlayer}, mova uma carta para a batalha primeiro!`);
        return;
    }
    if (!targetData) {
        alert(`Oponente (Jogador ${targetPlayer}) não tem carta na batalha!`);
        return;
    }

    const ataqueEscolhido = attackerData.ataques[attackIndex];
    if (!ataqueEscolhido) {
        console.error(`Ataque inválido (índice ${attackIndex}) para ${attackerData.nome}`);
        return;
    }

    actionTaken = true; // Marca que a ação foi feita
    disableActionButtons(); // Desabilita botões após ação
    clearInterval(timerInterval); // Para o cronômetro imediatamente

    const attackerCardElement = attackerData.elemento;
    const targetCardElement = targetData.elemento;
    const poderAtaque = parseInt(ataqueEscolhido.dano) || 10;
    const variacao = Math.random() * 0.2 + 0.9; // Variação de 90% a 110%
    const damage = Math.floor(poderAtaque * variacao);

    console.log(`Jogador ${attackerPlayer} (${attackerData.nome}) usa ${ataqueEscolhido.nome} em ${targetData.nome} (${targetData.vidaAtual} HP) causando ${damage} de dano.`);

    // Aplica o dano
    targetData.vidaAtual = Math.max(0, targetData.vidaAtual - damage);
    atualizarVidaCarta(targetCardElement, targetData.vidaAtual, targetData.vidaMax);
    showEffect(targetCardElement, `-${damage}`, 'damage-effect');
    targetCardElement.classList.add('dano-sofrido');
    setTimeout(() => targetCardElement.classList.remove('dano-sofrido'), 400);

    // Aplica efeito de veneno, se houver
    if (ataqueEscolhido.efeito === 'veneno') {
        aplicarVeneno(targetPlayer, targetCardElement);
    }

    // Animação de ataque
    attackerCardElement.classList.add('atacando');
    setTimeout(() => attackerCardElement.classList.remove('atacando'), 500);

    // Verifica se a carta alvo foi derrotada
    if (targetData.vidaAtual <= 0) {
        console.log(`Carta ${targetData.nome} do Jogador ${targetPlayer} foi derrotada!`);
        tratarCartaDerrotada(targetData);
        if (verificarFimDeJogo()) return; // Se o jogo acabou, não passa o turno
    }

    // Passa o turno após um pequeno delay para visualização
    setTimeout(endTurn, 1000); // Passa o turno após 1 segundo
}

function aplicarVeneno(targetPlayer, targetCardElement) {
    if (targetPlayer === 1 && !player1Poisoned) {
        player1Poisoned = true;
        player1PoisonTurns = POISON_DURATION;
        targetCardElement.classList.add('envenenada');
        showEffect(targetCardElement, 'Envenenado!', 'status-effect');
        console.log(`Jogador 1 (${targetCardElement.dataset.nome}) envenenado por ${POISON_DURATION} turnos.`);
    } else if (targetPlayer === 2 && !player2Poisoned) {
        player2Poisoned = true;
        player2PoisonTurns = POISON_DURATION;
        targetCardElement.classList.add('envenenada');
        showEffect(targetCardElement, 'Envenenado!', 'status-effect');
        console.log(`Jogador 2 (${targetCardElement.dataset.nome}) envenenado por ${POISON_DURATION} turnos.`);
    }
}

function handlePoisonDamage(player) {
    const targetData = cartasNaBatalha.find(c => c.player === player);
    if (!targetData) return;

    let poisonTurnsLeft = 0;
    let isPoisoned = false;

    if (player === 1 && player1Poisoned) {
        isPoisoned = true;
        targetData.vidaAtual = Math.max(0, targetData.vidaAtual - POISON_DAMAGE);
        player1PoisonTurns--;
        poisonTurnsLeft = player1PoisonTurns;
        console.log(`Jogador 1 (${targetData.nome}) sofre ${POISON_DAMAGE} dano veneno. Restam: ${poisonTurnsLeft}`);
        if (poisonTurnsLeft <= 0) {
            player1Poisoned = false;
            targetData.elemento.classList.remove('envenenada');
            console.log(`Jogador 1 (${targetData.nome}) curado do veneno.`);
        }
    } else if (player === 2 && player2Poisoned) {
        isPoisoned = true;
        targetData.vidaAtual = Math.max(0, targetData.vidaAtual - POISON_DAMAGE);
        player2PoisonTurns--;
        poisonTurnsLeft = player2PoisonTurns;
        console.log(`Jogador 2 (${targetData.nome}) sofre ${POISON_DAMAGE} dano veneno. Restam: ${poisonTurnsLeft}`);
        if (poisonTurnsLeft <= 0) {
            player2Poisoned = false;
            targetData.elemento.classList.remove('envenenada');
            console.log(`Jogador 2 (${targetData.nome}) curado do veneno.`);
        }
    }

    if (isPoisoned) {
        atualizarVidaCarta(targetData.elemento, targetData.vidaAtual, targetData.vidaMax);
        showEffect(targetData.elemento, `-${POISON_DAMAGE} (Veneno)`, 'poison-effect');

        if (targetData.vidaAtual <= 0) {
            console.log(`Carta ${targetData.nome} do Jogador ${player} derrotada por veneno!`);
            tratarCartaDerrotada(targetData);
            verificarFimDeJogo(); // Verifica fim de jogo após dano de veneno
            return true; // Indica que a carta foi derrotada por veneno
        }
    }
    return false; // Indica que a carta não foi derrotada por veneno
}

function tratarCartaDerrotada(cartaDerrotadaData) {
    const { player, elemento, nome } = cartaDerrotadaData;
    console.log(`Removendo ${nome} do Jogador ${player} da batalha.`);

    elemento.style.opacity = '0.5';
    elemento.style.pointerEvents = 'none';
    elemento.classList.remove('carta-batalha', 'envenenada', 'pode-trocar');
    const ataquesContainer = elemento.querySelector('.ataques-container');
    if (ataquesContainer) ataquesContainer.style.display = 'none';

    // Apenas remove do array `cartasNaBatalha`, não do DOM imediatamente
    // A carta será removida do slot de batalha quando a próxima for movida
    cartasNaBatalha = cartasNaBatalha.filter(c => c !== cartaDerrotadaData);

    // Limpa o slot de batalha correspondente
    const slotBatalhaIndex = player === 1 ? 0 : 1;
    const cardSelect = document.querySelectorAll('.batalha .card-select')[slotBatalhaIndex];
    cardSelect.innerHTML = ''; // Limpa o slot

    // Limpa veneno associado
    if (player === 1 && player1Poisoned) {
        player1Poisoned = false; player1PoisonTurns = 0;
    }
    if (player === 2 && player2Poisoned) {
        player2Poisoned = false; player2PoisonTurns = 0;
    }

    // Verifica cartas restantes no banco
    const banco = player === 1 ? cartasBancoOponente : cartasBancoJogador;
    const containerBanco = player === 1 ? document.querySelector('.player-zone.top .card-row') : document.getElementById('player-cards');
    const cartasRestantesBanco = (player === 1 ? cartasBancoOponente : cartasBancoJogador).length > 0;

    if (cartasRestantesBanco) {
        if (player === 1) {
            // Oponente precisa escolher a próxima carta
            setTimeout(() => moverProximaCartaOponente(), 1000);
        } else {
            // Jogador precisa escolher a próxima carta
            alert("Sua carta foi derrotada! Escolha outra carta do seu banco.");
            toggleBancoJogador(true, true); // Mostra o banco expandido para escolher
            highlightPlayerActions(); // Destaca ações possíveis (mover carta)
        }
    } else {
        console.log(`Jogador ${player} não tem mais cartas no banco.`);
        // Fim de jogo será verificado em verificarFimDeJogo()
    }
}

function moverProximaCartaOponente() {
    const bancoOponente = document.querySelector('.player-zone.top .card-row');
    // Encontra a primeira carta no array de elementos do banco do oponente
    const proximaCartaElement = cartasBancoOponente.length > 0 ? cartasBancoOponente[0] : null;

    if (proximaCartaElement) {
        moverCartaParaBatalha(proximaCartaElement, 1);
    } else {
        console.log("Oponente não tem mais cartas para mover.");
        verificarFimDeJogo(); // Verifica se o jogo acabou
    }
}

function verificarFimDeJogo() {
    const temCartaJogadorBatalha = cartasNaBatalha.some(c => c.player === 2);
    const temCartaJogadorBanco = cartasBancoJogador.length > 0;
    const cartasRestantesJogador = temCartaJogadorBatalha || temCartaJogadorBanco;

    const temCartaOponenteBatalha = cartasNaBatalha.some(c => c.player === 1);
    const temCartaOponenteBanco = cartasBancoOponente.length > 0;
    const cartasRestantesOponente = temCartaOponenteBatalha || temCartaOponenteBanco;

    console.log(`Verificando Fim: Jogador Restantes=${cartasRestantesJogador}, Oponente Restantes=${cartasRestantesOponente}`);

    if (!cartasRestantesJogador) {
        fimDeJogo("Oponente Venceu!");
        return true;
    }
    if (!cartasRestantesOponente) {
        fimDeJogo("Jogador Venceu!");
        return true;
    }
    return false;
}

function fimDeJogo(mensagem) {
    clearInterval(timerInterval);
    console.log("Fim de Jogo!", mensagem);
    const overlay = document.createElement('div');
    overlay.id = 'fim-jogo-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.85); color: white;
        display: flex; flex-direction: column; justify-content: center; align-items: center;
        font-size: 3rem; z-index: 1000; text-align: center;
    `;
    overlay.innerHTML = `
        <h1>${mensagem}</h1>
        <button id="btn-reiniciar">Jogar Novamente</button>
    `;
    overlay.querySelector('#btn-reiniciar').style.cssText = `
        margin-top: 30px; padding: 15px 30px; font-size: 1.5rem; cursor: pointer;
        background-color: #08a341; color: black; border: none; border-radius: 5px;
    `;
    overlay.querySelector('#btn-reiniciar').onclick = () => window.location.reload();
    document.body.appendChild(overlay);
}

// --- Funções Auxiliares e UI ---
function atualizarVidaCarta(cardElement, vidaAtual, vidaMax) {
    const vidaBarra = cardElement.querySelector('.vida-barra');
    const vidaTexto = cardElement.querySelector('.vida-texto');
    const psElement = cardElement.querySelector('.ps'); // Atualiza o PS no header também
    if (!vidaBarra || !vidaTexto) return;
    const percentualVida = vidaMax > 0 ? (vidaAtual / vidaMax) * 100 : 0;

    vidaBarra.style.width = `${percentualVida}%`;
    vidaTexto.textContent = `${vidaAtual}/${vidaMax}`;
    if (psElement) {
        psElement.textContent = `PS ${vidaAtual}`;
    }

    // Muda cor da barra de vida
    if (percentualVida < 30) vidaBarra.style.backgroundColor = 'red';
    else if (percentualVida < 60) vidaBarra.style.backgroundColor = 'orange';
    else vidaBarra.style.backgroundColor = '#00FF00'; // Verde padrão

    cardElement.dataset.vidaAtual = vidaAtual;
}

function showEffect(targetElement, text, effectClass) {
    const effectDiv = document.createElement('div');
    effectDiv.className = `effect ${effectClass}`;
    effectDiv.textContent = text;
    document.body.appendChild(effectDiv);

    const rect = targetElement.getBoundingClientRect();
    effectDiv.style.position = 'absolute';
    // Posiciona o efeito um pouco acima do centro da carta
    effectDiv.style.top = `${rect.top + rect.height * 0.3}px`;
    effectDiv.style.left = `${rect.left + rect.width * 0.5}px`;
    effectDiv.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => effectDiv.remove(), 1200);
}

function configurarBotoesAcao() {
    const btnVerCartas = document.getElementById('verCartasBtn');
    const btnTrocarCarta = document.getElementById('trocarCartaBtn');

    if (btnVerCartas) {
        btnVerCartas.addEventListener('click', (e) => {
            e.preventDefault(); // Previne comportamento padrão do link
            if (currentPlayerTurn === 2) {
                toggleBancoJogador(); // Alterna a visibilidade/expansão
            }
        });
    }

    if (btnTrocarCarta) {
        btnTrocarCarta.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPlayerTurn === 2 && !actionTaken) {
                iniciarTroca();
            } else if (actionTaken) {
                alert("Você já realizou uma ação neste turno (Ataque ou Troca).");
            } else {
                alert("Não é seu turno.");
            }
        });
    }
}

// --- Lógica de Troca de Cartas ---
function iniciarTroca() {
    const cartaAtualJogadorData = cartasNaBatalha.find(c => c.player === 2);
    const cartasDisponiveisBanco = cartasBancoJogador.length > 0;

    if (!cartaAtualJogadorData) {
        alert("Você precisa ter uma carta na batalha para poder trocar.");
        return;
    }
    if (!cartasDisponiveisBanco) {
        alert("Você não tem cartas no banco para trocar.");
        return;
    }

    modoTrocaAtivo = true;
    console.log("Modo de troca ativado. Escolha uma carta do banco.");
    toggleBancoJogador(true, true); // Força expansão do banco

    // Destacar cartas no banco que podem ser trocadas
    cartasBancoJogador.forEach(cartaElement => {
        cartaElement.classList.add('pode-trocar'); // Adiciona classe para feedback visual
        // O listener de clique já está configurado para chamar handleCliqueCartaBanco
    });

    // Opcional: Desabilitar ataques enquanto troca
    disableActionButtons(true); // Passa flag para manter botões de troca/ver ativos
    alert("Modo de troca ativo: Clique na carta do banco que deseja mover para a batalha.");
}

function executarTroca(cartaDoBancoElement) {
    if (!modoTrocaAtivo) return;

    console.log(`Jogador escolheu ${cartaDoBancoElement.dataset.nome} para trocar.`);

    const cartaAtualJogadorData = cartasNaBatalha.find(c => c.player === 2);
    if (!cartaAtualJogadorData) {
        console.error("Erro: Não foi possível encontrar a carta atual na batalha para trocar.");
        cancelarTroca();
        return;
    }

    // 1. Retorna a carta da batalha para o banco
    retornarCartaParaBanco(cartaAtualJogadorData);

    // 2. Move a carta escolhida do banco para a batalha
    moverCartaParaBatalha(cartaDoBancoElement, 2);

    // 3. Finaliza o modo de troca
    modoTrocaAtivo = false;
    actionTaken = true; // Troca conta como ação do turno
    clearInterval(timerInterval); // Para o cronômetro após a troca
    toggleBancoJogador(false); // Recolhe o banco

    // Remove destaque das cartas do banco
    const containerBanco = document.getElementById('player-cards');
    Array.from(containerBanco.children).forEach(carta => carta.classList.remove('pode-trocar'));

    // Desabilita ações após a troca
    disableActionButtons();

    console.log("Troca realizada com sucesso. Turno encerrado.");

    // Passa o turno após um pequeno delay
    setTimeout(endTurn, 1000);
}

function cancelarTroca() {
    modoTrocaAtivo = false;
    toggleBancoJogador(false); // Recolhe o banco
    const containerBanco = document.getElementById('player-cards');
    Array.from(containerBanco.children).forEach(carta => carta.classList.remove('pode-trocar'));
    enableActionButtons(); // Reabilita botões se a troca foi cancelada
    console.log("Modo de troca cancelado.");
}

function retornarCartaParaBanco(cartaData) {
    const { elemento, player } = cartaData;
    const containerBanco = player === 1 ? document.querySelector('.player-zone.top .card-row') : document.getElementById('player-cards');

    elemento.classList.remove('carta-batalha', 'envenenada');
    elemento.style.opacity = '1'; // Garante visibilidade normal no banco
    const ataquesContainer = elemento.querySelector('.ataques-container');
    if (ataquesContainer) ataquesContainer.style.display = 'none'; // Esconde ataques

    // Adiciona de volta ao array do banco
    if (player === 2) {
        cartasBancoJogador.push(elemento);
    } else {
        cartasBancoOponente.push(elemento);
    }

    // Adiciona ao DOM do banco
    containerBanco.appendChild(elemento);

    // Remove do array de batalha
    cartasNaBatalha = cartasNaBatalha.filter(c => c !== cartaData);

    // Limpa o slot de batalha
    const slotBatalhaIndex = player === 1 ? 0 : 1;
    const cardSelect = document.querySelectorAll('.batalha .card-select')[slotBatalhaIndex];
    cardSelect.innerHTML = '';

    // Readiciona listener se for carta do jogador
    if (player === 2) {
        adicionarListenerCartaBanco(elemento);
    }

    console.log(`${cartaData.nome} retornou para o banco do Jogador ${player}.`);
}

// --- Controle de Turno e Cronômetro ---
function startTimer() {
    clearInterval(timerInterval);
    currentTime = timePerRound;
    updateTimerDisplay();
    const progresso = document.getElementById('cronometro-progresso');
    const circunferencia = 2 * Math.PI * 45; // 2 * PI * raio
    progresso.style.strokeDasharray = circunferencia;
    progresso.style.strokeDashoffset = 0; // Começa cheio

    timerInterval = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        const offset = circunferencia - (currentTime / timePerRound) * circunferencia;
        progresso.style.strokeDashoffset = offset;

        if (currentTime <= 0) {
            console.log("Tempo esgotado!");
            endTurn();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const texto = document.getElementById('cronometro-texto');
    if (texto) {
        texto.textContent = currentTime;
    }
}

function endTurn() {
    clearInterval(timerInterval);
    console.log(`Fim do turno do Jogador ${currentPlayerTurn}`);
    actionTaken = false; // Reseta a flag de ação para o próximo turno

    // Aplica dano de veneno no final do turno do jogador afetado
    let cartaDerrotadaPorVeneno = false;
    if (currentPlayerTurn === 1 && player1Poisoned) {
        cartaDerrotadaPorVeneno = handlePoisonDamage(1);
    } else if (currentPlayerTurn === 2 && player2Poisoned) {
        cartaDerrotadaPorVeneno = handlePoisonDamage(2);
    }

    // Se a carta foi derrotada por veneno, o fim de jogo já foi verificado em handlePoisonDamage
    // Se não, verifica o fim de jogo normalmente
    if (!cartaDerrotadaPorVeneno && verificarFimDeJogo()) {
        return; // Jogo acabou
    }

    // Troca o turno
    currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;
    console.log(`Início do turno do Jogador ${currentPlayerTurn}`);
    startTurn(); // Inicia o próximo turno
}

function startTurn() {
    isFirstRound = false; // Marca que não é mais o primeiro round
    exibirAvisoTurno(); // Mostra o aviso do turno atual
    // A lógica de startTimer, updateUI e jogadaOponente foi movida para dentro de exibirAvisoTurno
}

function updateTurnUI() {
    console.log("Atualizando UI para o turno:", currentPlayerTurn);
    // Habilita/Desabilita botões de ação e ataques
    enableActionButtons();
    highlightPlayerActions();

    // Atualiza botões de ataque nas cartas em batalha
    cartasNaBatalha.forEach(cartaData => {
        mostrarAtaquesNaCarta(cartaData.elemento, cartaData.ataques, cartaData.player);
    });
}

function disableActionButtons(keepSwapViewButtons = false) {
    // Desabilita botões de ataque em todas as cartas
    document.querySelectorAll('.botao-ataque').forEach(btn => btn.disabled = true);

    if (!keepSwapViewButtons) {
        const btnTrocar = document.getElementById('trocarCartaBtn');
        const btnVer = document.getElementById('verCartasBtn');
        if (btnTrocar) btnTrocar.style.opacity = '0.5'; // Indica visualmente desabilitado
        if (btnVer) btnVer.style.opacity = '0.5';
    }
    console.log("Botões de ação desabilitados.");
}

function enableActionButtons() {
    // Habilita botões de ataque apenas para a carta do jogador atual em batalha
    const jogadorAtualCarta = cartasNaBatalha.find(c => c.player === 2 && currentPlayerTurn === 2);
    if (jogadorAtualCarta) {
        const ataquesContainer = jogadorAtualCarta.elemento.querySelector('.ataques-container');
        if (ataquesContainer) {
            ataquesContainer.querySelectorAll('.botao-ataque').forEach(btn => btn.disabled = actionTaken); // Desabilita se ação já foi feita
        }
    }

    // Habilita botões gerais do jogador se for o turno dele
    const btnTrocar = document.getElementById('trocarCartaBtn');
    const btnVer = document.getElementById('verCartasBtn');
    if (currentPlayerTurn === 2) {
        if (btnTrocar) btnTrocar.style.opacity = actionTaken ? '0.5' : '1';
        if (btnVer) btnVer.style.opacity = '1';
    } else {
        if (btnTrocar) btnTrocar.style.opacity = '0.5';
        if (btnVer) btnVer.style.opacity = '0.5';
    }
    console.log("Botões de ação habilitados/atualizados para o turno.");
}

function highlightPlayerActions() {
    // Lógica para destacar visualmente as ações possíveis para o jogador
    // Ex: destacar carta no banco se o slot de batalha estiver vazio, destacar botões de ataque/troca
    const jogadorCartaBatalha = cartasNaBatalha.find(c => c.player === 2);
    const slotJogadorVazio = !jogadorCartaBatalha;

    if (currentPlayerTurn === 2) {
        if (slotJogadorVazio) {
            // Destacar cartas no banco para serem movidas
            cartasBancoJogador.forEach(card => card.classList.add('pode-mover')); // Adicionar estilo CSS para .pode-mover
            console.log("Destaque: Mover carta do banco para batalha.");
        } else {
            // Remover destaque de mover
            cartasBancoJogador.forEach(card => card.classList.remove('pode-mover'));
            // Destacar botões de ataque e troca se ação não foi feita
            if (!actionTaken) {
                const ataquesContainer = jogadorCartaBatalha.elemento.querySelector('.ataques-container');
                if (ataquesContainer) {
                    ataquesContainer.querySelectorAll('.botao-ataque').forEach(btn => btn.classList.add('acao-possivel')); // Adicionar estilo CSS
                }
                const btnTrocar = document.getElementById('trocarCartaBtn');
                if (btnTrocar && cartasBancoJogador.length > 0) {
                    btnTrocar.classList.add('acao-possivel');
                }
                console.log("Destaque: Atacar ou Trocar.");
            }
        }
    } else {
        // Remover todos os destaques do jogador
        cartasBancoJogador.forEach(card => card.classList.remove('pode-mover'));
        document.querySelectorAll('.acao-possivel').forEach(el => el.classList.remove('acao-possivel'));
    }
}

// --- Jogada do Oponente (IA Simples) ---
function jogadaOponente() {
    if (currentPlayerTurn !== 1 || verificarFimDeJogo()) return;
    console.log("Turno do Oponente.");

    const oponenteCartaBatalhaData = cartasNaBatalha.find(c => c.player === 1);
    const jogadorCartaBatalhaData = cartasNaBatalha.find(c => c.player === 2);

    // 1. Se não tem carta na batalha, move uma do banco
    if (!oponenteCartaBatalhaData) {
        moverProximaCartaOponente();
        // A jogada continua após a carta ser movida (se houver uma)
        // Adiciona um pequeno delay para a próxima decisão após mover
        setTimeout(() => {
             if (cartasNaBatalha.some(c => c.player === 1)) { // Confirma que moveu
                 jogadaOponente(); // Tenta atacar/trocar após mover
             } else {
                 endTurn(); // Passa o turno se não conseguiu mover
             }
        }, 1000);
        return;
    }

    // 2. Se tem carta na batalha e o jogador também, decide atacar
    if (jogadorCartaBatalhaData) {
        // Escolhe um ataque aleatório
        const numAtaques = oponenteCartaBatalhaData.ataques.length;
        const ataqueIndex = Math.floor(Math.random() * numAtaques);
        console.log(`Oponente (${oponenteCartaBatalhaData.nome}) decide atacar com ataque ${ataqueIndex}.`);
        attack(1, 2, ataqueIndex); // Oponente (1) ataca Jogador (2)
    } else {
        // Jogador não tem carta, oponente espera (ou poderia ter outra lógica)
        console.log("Oponente espera, jogador sem carta na batalha.");
        setTimeout(endTurn, 1500); // Passa o turno após esperar um pouco
    }
    // A função attack ou a espera já chamam endTurn
}

// --- UI Banco do Jogador ---
function toggleBancoJogador(forceOpen = false, forceClose = false) {
    const playerZoneBottom = document.querySelector('.player-zone.bottom');
    const cardRow = document.getElementById('player-cards');

    if (forceClose) {
        bancoExpandido = false;
    } else if (forceOpen) {
        bancoExpandido = true;
    } else {
        bancoExpandido = !bancoExpandido;
    }

    if (bancoExpandido) {
        playerZoneBottom.classList.add('expanded');
        cardRow.style.transform = 'scale(1)'; // Mostra em tamanho maior
        // Adicionar lógica para reorganizar cartas se necessário (ex: flex-wrap)
        console.log("Banco do jogador expandido.");
    } else {
        playerZoneBottom.classList.remove('expanded');
        cardRow.style.transform = 'scale(0.8)'; // Volta ao tamanho normal/menor
        console.log("Banco do jogador recolhido.");
    }

    // Remover destaque de troca se o banco for fechado
    if (!bancoExpandido && modoTrocaAtivo) {
        cancelarTroca();
    }
}

// --- Funções do Cronômetro Visual (já existentes, verificar se precisam de ajuste)
function criarCronometroVisual() {
    // Código para criar o SVG do cronômetro, se não existir no HTML
    // Aparentemente já existe no HTML, então esta função pode ser vazia ou só garantir referências
    const cronometro = document.querySelector('.cronometro-redondo');
    if (!cronometro) {
        console.error("Elemento .cronometro-redondo não encontrado!");
    }
}

// --- Inicialização ao carregar o DOM ---
// document.addEventListener('DOMContentLoaded', inicializarJogo); // Chamada já está no bloco try/catch inicial





// --- Lógica de Troca de Cartas (Integrada de troca_modificada.js) ---
function iniciarTroca() {
    const cartaAtualJogadorData = cartasNaBatalha.find(c => c.player === 2);
    const containerBanco = document.getElementById('player-cards');
    const cartasDisponiveisBanco = cartasBancoJogador.length > 0; // Checa se o array tem elementos

    // Revalidação das condições (já feita no listener, mas bom ter aqui)
    if (!cartaAtualJogadorData) {
        exibirMensagemTemporaria("Você precisa ter uma carta na batalha para trocar.", "erro");
        return;
    }
    if (!cartasDisponiveisBanco) {
        exibirMensagemTemporaria("Você não tem cartas no banco para trocar.", "erro");
        return;
    }

    modoTrocaAtivo = true;
    console.log("Modo de troca ativado. Escolha uma carta do banco.");
    
    // Atualiza o botão para "Cancelar Troca"
    const botaoTrocar = document.getElementById("trocarCartaBtn");
    if(botaoTrocar) {
        botaoTrocar.textContent = "Cancelar Troca";
        botaoTrocar.classList.add('cancelar'); // Adiciona classe para estilo
    }

    // Expande o banco se não estiver expandido
    if (!bancoExpandido) {
         toggleBancoJogador(true, true); // Força expansão
    }

    // Destacar cartas no banco que podem ser trocadas
    cartasBancoJogador.forEach(carta => {
        carta.classList.add('pode-trocar'); // Adiciona classe para feedback visual
        // O listener handleCliqueCartaBanco já está configurado para chamar executarTroca
    });

    exibirMensagemTemporaria("Modo de troca ativo: Clique na carta do banco que deseja usar.", "info");

    // Desabilitar ataques enquanto troca (opcional, mas pode ser bom)
    // disableActionButtons(true); // Passa flag para manter botões de troca/ver ativos
}

function executarTroca(cartaDoBancoElement) {
    if (!modoTrocaAtivo || currentPlayerTurn !== 2) return;

    console.log(`Jogador escolheu ${cartaDoBancoElement.dataset.nome} para trocar.`);

    const cartaAtualJogadorData = cartasNaBatalha.find(c => c.player === 2);
    if (!cartaAtualJogadorData) {
        console.error("Erro: Não foi possível encontrar a carta atual na batalha para trocar.");
        cancelarTroca();
        return;
    }

    // 1. Retorna a carta da batalha para o banco
    retornarCartaParaBanco(cartaAtualJogadorData);

    // 2. Move a carta escolhida do banco para a batalha
    moverCartaParaBatalha(cartaDoBancoElement, 2);

    // 3. Finaliza o modo de troca
    modoTrocaAtivo = false;
    actionTaken = true; // Trocar conta como a ação do turno
    
    // Recolhe o banco se ele foi expandido pela troca
    if (bancoExpandido) {
        toggleBancoJogador(false);
    }

    // Atualiza o botão de volta para "Trocar"
    const botaoTrocar = document.getElementById("trocarCartaBtn");
    if(botaoTrocar) {
        botaoTrocar.textContent = "Trocar";
        botaoTrocar.classList.remove('cancelar');
    }

    // Remove destaque das cartas do banco
    const containerBanco = document.getElementById('player-cards');
    cartasBancoJogador.forEach(carta => carta.classList.remove('pode-trocar'));

    // Habilita os botões de ataque da nova carta e desabilita o botão trocar (pois ação já foi feita)
    enableActionButtons(); // Habilita ataques
    if(botaoTrocar) botaoTrocar.disabled = true; // Desabilita troca neste turno

    exibirMensagemTemporaria(`Carta trocada para ${cartaDoBancoElement.dataset.nome}! Ação do turno concluída.`, "sucesso");
    console.log("Troca realizada com sucesso. Ação do turno utilizada.");
    
    // Não passa o turno automaticamente, espera o tempo ou outra ação
    // setTimeout(endTurn, 1500); 
}

function cancelarTroca() {
    modoTrocaAtivo = false;
    
    // Recolhe o banco se ele foi expandido pela troca
    if (bancoExpandido) {
        toggleBancoJogador(false);
    }

    // Restaura o botão
    const botaoTrocar = document.getElementById("trocarCartaBtn");
    if(botaoTrocar) {
        botaoTrocar.textContent = "Trocar";
        botaoTrocar.classList.remove('cancelar');
    }

    // Remove destaque das cartas do banco
    const containerBanco = document.getElementById('player-cards');
    cartasBancoJogador.forEach(carta => carta.classList.remove('pode-trocar'));
    
    // Reabilita botões de ataque se a troca foi cancelada (se foram desabilitados)
    // enableActionButtons(); 
    exibirMensagemTemporaria("Modo de troca cancelado.", "info");
    console.log("Modo de troca cancelado.");
}

// Função auxiliar para exibir mensagens temporárias
function exibirMensagemTemporaria(texto, tipo = 'info') {
    const mensagemId = 'mensagem-status-jogo';
    let mensagemElement = document.getElementById(mensagemId);

    if (!mensagemElement) {
        mensagemElement = document.createElement('div');
        mensagemElement.id = mensagemId;
        mensagemElement.style.cssText = `
            position: fixed;
            bottom: 20px; /* Posição na parte inferior */
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 2000;
            text-align: center;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        document.body.appendChild(mensagemElement);
    }

    mensagemElement.textContent = texto;
    // Define a cor baseada no tipo
    if (tipo === 'erro') {
        mensagemElement.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        mensagemElement.style.color = 'white';
    } else if (tipo === 'sucesso') {
        mensagemElement.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
        mensagemElement.style.color = 'white';
    } else { // info
        mensagemElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        mensagemElement.style.color = '#00FF00';
    }

    // Mostra a mensagem
    mensagemElement.style.opacity = '1';

    // Esconde após 3 segundos
    setTimeout(() => {
        mensagemElement.style.opacity = '0';
    }, 3000);
}

// Função para retornar carta da batalha para o banco (precisa ser criada ou ajustada)
function retornarCartaParaBanco(cartaData) {
    if (!cartaData || !cartaData.elemento) return;

    const cartaElement = cartaData.elemento;
    const player = cartaData.player;
    const containerBanco = document.getElementById('player-cards'); // Assumindo que só o jogador troca

    // Remove a carta do array de batalha
    cartasNaBatalha = cartasNaBatalha.filter(c => c.elemento !== cartaElement);

    // Limpa o slot de batalha
    const slotBatalha = cartaElement.parentElement;
    if (slotBatalha && slotBatalha.classList.contains('card-select')) {
        slotBatalha.innerHTML = ''; // Limpa o slot
    }

    // Adiciona a carta de volta ao array do banco do jogador
    // (A carta já existe como elemento, apenas a movemos e adicionamos ao array lógico)
    if (player === 2) {
        // Readiciona o listener de clique do banco
        adicionarListenerCartaBanco(cartaElement);
        // Remove classes/estilos específicos da batalha
        cartaElement.classList.remove('carta-batalha');
        cartaElement.querySelector('.ataques-container').style.display = 'none';
        // Adiciona ao container do banco
        containerBanco.appendChild(cartaElement);
        // Adiciona ao array lógico do banco
        cartasBancoJogador.push(cartaElement);
    }
    console.log(`${cartaData.nome} retornou para o banco.`);
}

// Modificar toggleBancoJogador para aceitar um parâmetro 'force'
function toggleBancoJogador(expandir, force = false) {
    const containerBanco = document.getElementById('player-cards');
    const isCurrentlyExpanded = containerBanco.classList.contains('expanded');

    if (force) {
        if (expandir) {
            containerBanco.classList.add('expanded');
            bancoExpandido = true;
        } else {
            containerBanco.classList.remove('expanded');
            bancoExpandido = false;
        }
    } else {
        if (expandir === undefined) { // Comportamento toggle padrão
            containerBanco.classList.toggle('expanded');
            bancoExpandido = !bancoExpandido;
        } else if (expandir && !isCurrentlyExpanded) { // Expandir se não estiver
            containerBanco.classList.add('expanded');
            bancoExpandido = true;
        } else if (!expandir && isCurrentlyExpanded) { // Recolher se estiver
            containerBanco.classList.remove('expanded');
            bancoExpandido = false;
        }
    }
    console.log(`Banco do jogador ${bancoExpandido ? 'expandido' : 'recolhido'}`);
}

// Garantir que enable/disableActionButtons existam e funcionem
function disableActionButtons(keepSwapEnabled = false) {
    const cartaJogador = cartasNaBatalha.find(c => c.player === 2);
    if (cartaJogador && cartaJogador.elemento) {
        const attackButtons = cartaJogador.elemento.querySelectorAll('.ataque-btn');
        attackButtons.forEach(btn => btn.disabled = true);
    }
    const swapButton = document.getElementById('trocarCartaBtn');
    if (swapButton && !keepSwapEnabled) {
        swapButton.disabled = true;
    }
}

function enableActionButtons() {
    const cartaJogador = cartasNaBatalha.find(c => c.player === 2);
    if (cartaJogador && cartaJogador.elemento) {
        const attackButtons = cartaJogador.elemento.querySelectorAll('.ataque-btn');
        // Habilita botões de ataque apenas se não for a vez do oponente e nenhuma ação foi tomada
        attackButtons.forEach(btn => btn.disabled = (currentPlayerTurn !== 2 || actionTaken));
    }
    const swapButton = document.getElementById('trocarCartaBtn');
    if (swapButton) {
        // Habilita botão de troca apenas se for turno do jogador e nenhuma ação foi tomada
        swapButton.disabled = (currentPlayerTurn !== 2 || actionTaken);
    }
}


