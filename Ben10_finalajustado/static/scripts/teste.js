const timePerRound = 30;
    let currentTime = timePerRound;
    let currentPlayerTurn = 1;
    let actionTaken = false;
    let timerInterval;
    let player1Health = 100;
    let player2Health = 100;
    let isFirstRound = true;

    const timeWarning = document.getElementById('timeWarning');
    const timeDisplay = document.getElementById('timeDisplay');
    const roundTimer = document.getElementById('roundTimer');

    const health1 = document.getElementById('health1');
    const health2 = document.getElementById('health2');
    const healthValue1 = document.getElementById('healthValue1');
    const healthValue2 = document.getElementById('healthValue2');

    const attackBtn1 = document.getElementById('attackBtn1');
    const attackBtn2 = document.getElementById('attackBtn2');
    const attackBtn3 = document.getElementById('attackBtn3');
    const attackBtn4 = document.getElementById('attackBtn4');
    const dodgeBtn1 = document.getElementById('dodgeBtn1');
    const dodgeBtn2 = document.getElementById('dodgeBtn2');
    const actions1 = document.getElementById('actions1');
    const actions2 = document.getElementById('actions2');

    updateHealth(1, player1Health);
    updateHealth(2, player2Health);

    // Mostra o alerta inicial apenas na primeira rodada
    setTimeout(() => {
    timeWarning.style.display = 'none';
    roundTimer.style.display = 'block';
    startTimer();
    updateTurnUI();
    }, 3000);

    function startTimer() {
    currentTime = timePerRound;
    actionTaken = false;
    updateDisplay();

    timerInterval = setInterval(() => {
        currentTime--;
        updateDisplay();
        if (currentTime <= 0) {
        clearInterval(timerInterval);
        endTurn();
        }
        if (currentTime <= 5) {
        timeDisplay.classList.add('warning');
        }
    }, 1000);
    }

    function updateDisplay() {
    timeDisplay.textContent = currentTime;
    }

    function endTurn() {
    clearInterval(timerInterval);
    timeDisplay.classList.remove('warning');
    currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;

    if (isFirstRound) {
        isFirstRound = false;
        startTimer();
        updateTurnUI();
        return;
    }

    timeWarning.querySelector('h1').textContent = `TURNO DO ${currentPlayerTurn === 1 ? 'JOGADOR' : 'OPONENTE'}`;
    timeWarning.querySelector('p').textContent = `Tempo por turno: ${timePerRound}s`;
    timeWarning.style.display = 'flex';

    setTimeout(() => {
        timeWarning.style.display = 'none';
        startTimer();
        updateTurnUI();
    }, 2000);
    }

    function updateTurnUI() {
    const isPlayerTurn = currentPlayerTurn === 1;
    actions1.querySelectorAll('button').forEach(btn => btn.disabled = !isPlayerTurn);
    actions2.querySelectorAll('button').forEach(btn => btn.disabled = isPlayerTurn);
    }

    function attack(attacker) {
    if (actionTaken) return;
    actionTaken = true;

    // Define o alvo como sendo o oponente
    const target = attacker === 1 ? 2 : 1;
    
    // Dano diferente para cada tipo de ataque
    let damage;
    if (attacker === 1) {
        // Ataques do jogador
        damage = event.target.id === 'attackBtn2' ? 
        Math.floor(Math.random() * 16) + 5 :  // Ataque normal
        Math.floor(Math.random() * 21) + 10;  // Ataque 2 (mais forte)
    } else {
        // Ataques do oponente
        damage = event.target.id === 'attackBtn1' ? 
        Math.floor(Math.random() * 16) + 5 :  // Ataque normal
        Math.floor(Math.random() * 21) + 10;  // Ataque 2 (mais forte)
    }

    if (target === 1) {
        player1Health = Math.max(0, player1Health - damage);
        updateHealth(1, player1Health);
        showEffect(document.getElementById('player1'), damage, 'damage');
    } else {
        player2Health = Math.max(0, player2Health - damage);
        updateHealth(2, player2Health);
        showEffect(document.getElementById('player2'), damage, 'damage');
    }

    if (player1Health <= 0 || player2Health <= 0) {
        endGame(target === 1 ? 2 : 1);
        return;
    }

    disableAllActions();
    setTimeout(endTurn, 1000);
    }

    function dodge(player) {
    if (actionTaken) return;
    actionTaken = true;
    showEffect(document.getElementById(`player${player}`), 'DESVIOU!', 'dodge');
    disableAllActions();
    setTimeout(endTurn, 1000);
    }

    function disableAllActions() {
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);
    }

    function updateHealth(player, health) {
    const bar = player === 1 ? health1 : health2;
    const val = player === 1 ? healthValue1 : healthValue2;
    const percent = (health / 100) * 100;
    bar.style.width = `${percent}%`;
    val.textContent = health;

    bar.style.background = percent < 30 ? '#f44336' : percent < 60 ? '#ff9800' : '#4CAF50';
    }

    function showEffect(target, text, type) {
    const effect = document.createElement('div');
    effect.className = type === 'damage' ? 'damage-effect' : 'dodge-effect';
    effect.textContent = type === 'damage' ? `-${text}` : text;
    target.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
    }

    function endGame(winner) {
    clearInterval(timerInterval);
    roundTimer.style.display = 'none';
    timeWarning.querySelector('h1').textContent = `${winner === 1 ? 'VOCÊ VENCEU!' : 'OPONENTE VENCEU!'}`;
    timeWarning.querySelector('p').textContent = 'Fim da batalha';
    timeWarning.style.display = 'flex';
    disableAllActions();
    }

    // Event listeners corrigidos
    attackBtn1.addEventListener('click', () => attack(2)); // Oponente ataca jogador
    attackBtn2.addEventListener('click', () => attack(1)); // Jogador ataca oponente
    attackBtn3.addEventListener('click', () => attack(2)); // Oponente ataca jogador (ataque 2)
    attackBtn4.addEventListener('click', () => attack(1)); // Jogador ataca oponente (ataque 2)
    dodgeBtn1.addEventListener('click', () => dodge(1));   // Jogador desvia
    dodgeBtn2.addEventListener('click', () => dodge(2));   // Oponente desvia
