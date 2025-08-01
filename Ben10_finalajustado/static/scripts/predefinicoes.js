document.addEventListener("DOMContentLoaded", function() {
    const carrossels = document.querySelectorAll(".deck-cards-container");
    let deckSelecionado = "Velocidade Relâmpago"; // Deck inicial padrão

    // --- Carregar Cartas nos Carrosséis ---
    // Agora recebe o objeto da carta do deck (com personagem, habilidade, descricao)
    function criarElementoCartaPreview(cartaObj) {
        // Busca informações adicionais (como imagem) usando o nome do personagem
        const imgInfo = cartasInfo[cartaObj.personagem] || { 
            imagem: "../static/assets/fundo_carta.png" // Fallback image
        }; 
        const cardElement = document.createElement("div");
        cardElement.className = "card";

        // Card Header (Character Name)
        const cardHeader = document.createElement("div");
        cardHeader.className = "card-header";
        const cardTitle = document.createElement("div");
        cardTitle.className = "card-title";
        cardTitle.textContent = cartaObj.personagem; // Usa o nome do objeto
        cardHeader.appendChild(cardTitle);
        cardElement.appendChild(cardHeader);

        // Card Image
        const cardImgDiv = document.createElement("div");
        cardImgDiv.className = "card-img";
        const img = document.createElement("img");
        img.src = imgInfo.imagem; // Usa a imagem de cartasInfo
        img.alt = cartaObj.personagem;
        cardImgDiv.appendChild(img);
        cardElement.appendChild(cardImgDiv);

        // Card Ability/Description Section (Below Image)
        const cardInfoDiv = document.createElement("div");
        cardInfoDiv.className = "card-info"; // Container for title and description

        // Ability Title (Habilidade)
        const abilityTitle = document.createElement("div"); 
        abilityTitle.className = "ability-title"; // Classe para estilizar (ex: texto verde)
        abilityTitle.textContent = cartaObj.habilidade || ""; // Usa o título do objeto
        cardInfoDiv.appendChild(abilityTitle);

        // Description Text
        const descriptionText = document.createElement("p");
        descriptionText.className = "ability-description"; // Classe para estilizar (ex: texto branco)
        descriptionText.textContent = cartaObj.descricao || ""; // Usa a descrição do objeto
        cardInfoDiv.appendChild(descriptionText);

        cardElement.appendChild(cardInfoDiv); // Append the info section AFTER image

        return cardElement;
    }

    function carregarCartasDeck(deckContainer) {
        const deckCardsDiv = deckContainer.querySelector(".deck-cards");
        const deckName = deckCardsDiv.dataset.deckName;
        // Agora decksPredefinidos contém objetos
        const cartasDoDeckObjetos = decksPredefinidos[deckName]; 

        if (cartasDoDeckObjetos && deckCardsDiv) {
            deckCardsDiv.innerHTML = ""; // Limpa cartas existentes
            // Itera sobre os objetos do deck
            cartasDoDeckObjetos.forEach(cartaObj => {
                // Passa o objeto inteiro para criar o elemento
                const cartaElement = criarElementoCartaPreview(cartaObj);
                deckCardsDiv.appendChild(cartaElement);
            });
        } else {
            console.error(`Deck '${deckName}' não encontrado em decksPredefinidos ou div .deck-cards faltando.`);
        }
    }

    // Carrega as cartas para todos os decks visíveis inicialmente
    document.querySelectorAll(".deck-container").forEach(container => {
        carregarCartasDeck(container);
    });

    // --- Lógica do Carrossel (sem alterações) ---
    carrossels.forEach(container => {
        const prevBtn = container.querySelector(".prev");
        const nextBtn = container.querySelector(".next");
        const cards = container.querySelector(".deck-cards");
        const card = container.querySelector(".card"); 

        if (card && prevBtn && nextBtn && cards) {
            let cardWidth = card.offsetWidth;
            if (cardWidth === 0) { 
                const cardStyle = window.getComputedStyle(card);
                cardWidth = parseFloat(cardStyle.width) || 150; 
            }
            const gap = parseFloat(window.getComputedStyle(cards).gap) || 30; 
            const scrollAmount = cardWidth + gap;

            prevBtn.addEventListener("click", () => {
                cards.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            });
            nextBtn.addEventListener("click", () => {
                cards.scrollBy({ left: scrollAmount, behavior: "smooth" });
            });
        } else {
             console.warn("Elementos do carrossel não encontrados em:", container);
        }
    });

    // --- Lógica de Seleção de Deck (sem alterações) ---
    const deckBtns = document.querySelectorAll(".deck-btn");
    const deckContainers = document.querySelectorAll(".deck-container");
    const nomesDecks = Array.from(deckBtns).map(btn => btn.textContent.trim());

    function showDeck(deckIndex) {
        deckBtns.forEach(b => b.classList.remove("active"));
        const activeBtn = document.querySelector(`.deck-btn[data-deck-index="${deckIndex}"]`);
        if (activeBtn) activeBtn.classList.add("active");

        deckContainers.forEach(container => container.classList.remove("active"));
        const deckContainer = document.getElementById(`deck${deckIndex}`);
        if (deckContainer) {
            deckContainer.classList.add("active");
        }
        deckSelecionado = nomesDecks[deckIndex - 1];
        console.log("Deck selecionado:", deckSelecionado);
    }

    deckBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const deckIndex = btn.dataset.deckIndex;
            showDeck(deckIndex);
        });
    });

    // --- Lógica do Botão Pronto (Ajustada) ---
    const prontoBtn = document.querySelector(".botao-pronto");
    if (prontoBtn) {
        prontoBtn.addEventListener("click", (event) => {
            event.preventDefault(); 
            console.log(`Botão Pronto clicado. Deck selecionado: ${deckSelecionado}`);

            if (typeof decksPredefinidos !== "undefined" && decksPredefinidos[deckSelecionado]) {
                // Pega os objetos do deck selecionado
                const cartasDoDeckObjetos = decksPredefinidos[deckSelecionado]; 
                // Extrai apenas os nomes dos personagens para salvar no localStorage
                const nomesDasCartas = cartasDoDeckObjetos.map(carta => carta.personagem);
                console.log("Nomes das cartas a serem salvas:", nomesDasCartas);
                // Salva APENAS a lista de nomes das cartas
                localStorage.setItem("cartasSelecionadas", JSON.stringify(nomesDasCartas));
                console.log("Nomes das cartas salvos no localStorage.");
                window.location.href = "/jogo"; // Redireciona
            } else {
                console.error(`Deck '${deckSelecionado}' não encontrado em decksPredefinidos ou decks.js não carregado.`);
                alert(`Erro: Deck '${deckSelecionado}' não encontrado. Verifique se os arquivos decks.js e cartas_data.js estão carregados corretamente no HTML.`);
            }
        });
    }

    // Inicializa mostrando o primeiro deck
    showDeck(1);
});
