const cartasInfo = {
    'Fantasmático': {
        imagem: '../static/assets/Fantasmatico.png',
        vida: 100,
        ataques: [
            { nome: "Toque Espectral", dano: 30, efeito: 'veneno' },
            { nome: "Possessão", dano: 60 }
        ],
        habilidade: "Dreno de energia",
        descricao: "Atravessa objetos e inimigos, aplicando dreno de energia em contato."
    },
    'XLR8': {
        imagem: '../static/assets/XLR8.png',
        vida: 90,
        ataques: [
            { nome: "Ataque Veloz", dano: 40 },
            { nome: "Ciclone Kinet", dano: 70 }
        ],
        habilidade: "Ataques rápidos",
        descricao: "Ataques rápidos que confundem inimigos, com chance de atordoamento."
    },
    'Gosma': {
        imagem: '../static/assets/Gosma.png',
        vida: 120,
        ataques: [
            { nome: "Jato Ácido", dano: 20 },
            { nome: "Abraço Pegajoso", dano: 50 }
        ],
        habilidade: "Absorção de impacto",
        descricao: "Corpo gelatinoso que pode absorver impactos."
    },
    'Quatro Braços': {
        imagem: '../static/assets/quatrobraços.png',
        vida: 130,
        ataques: [
            { nome: "Soco Duplo", dano: 50 },
            { nome: "Onda de Choque", dano: 80 }
        ],
        habilidade: "Golpes poderosos",
        descricao: "Golpes poderosos que podem quebrar defesas e causar atordoamento."
    },
    'Alien X': {
        imagem: '../static/assets/Alien_X.png',
        vida: 200,
        ataques: [
            { nome: "Pulso Cósmico", dano: 70 },
            { nome: "Manipular Realidade", dano: 120 }
        ],
        habilidade: "Manipulação da realidade",
        descricao: "Manipulação da realidade em pequena escala com alto custo de energia."
    },
    'Aquático': {
        imagem: '../static/assets/Aquatico.png',
        vida: 110,
        ataques: [
            { nome: "Jato d'Água", dano: 40 },
            { nome: "Mordida Feroz", dano: 75 }
        ],
        habilidade: "Manipulação de água",
        descricao: "Manipulação de água para ataques e defesa, com cura em ambientes aquáticos."
    },
    'Tarta Gira': {
        imagem: '../static/assets/Tarta Gira.png',
        vida: 140,
        ataques: [
            { nome: "Giro Defensivo", dano: 30 },
            { nome: "Investida Tornado", dano: 65 }
        ],
        habilidade: "Ataques giratórios",
        descricao: "Ataques giratórios que causam dano contínuo e repelem projéteis."
    },
    'Macaco Aranha': {
        imagem: '../static/assets/Macaco Aranha.png',
        vida: 100,
        ataques: [
            { nome: "Tiro de Teia", dano: 35 },
            { nome: "Ataque Acrobático", dano: 70 }
        ],
        habilidade: "Agilidade surpresa",
        descricao: "Movimento ágil entre estruturas com ataques de surpresa."
    },
    'Cromático': {
        imagem: '../static/assets/Cromatico.png',
        vida: 110,
        ataques: [
            { nome: "Raio Prismático", dano: 45 },
            { nome: "Absorver Energia", dano: 70 }
        ],
        habilidade: "Adaptação cromática",
        descricao: "Assume propriedades de materiais próximos para vantagem situacional."
    },
    'Insectóide': {
        imagem: '../static/assets/Insectoide.png',
        vida: 90,
        ataques: [
            { nome: "Gosma Grudenta", dano: 30 },
            { nome: "Picada Supersônica", dano: 60 }
        ],
        habilidade: "", // Título não fornecido
        descricao: "" // Descrição não fornecida
    },
    'Feedback': {
        imagem: '../static/assets/Feedback.png',
        vida: 120,
        ataques: [
            { nome: "Absorção Elétrica", dano: 40 },
            { nome: "Descarga Condutora", dano: 80 }
        ],
        habilidade: "Armazenar energia",
        descricao: "Armazena energia recebida e libera em um ataque concentrado."
    },
    'Friagem': {
        imagem: '../static/assets/Friagem.png',
        vida: 100,
        ataques: [
            { nome: "Sopro Congelante", dano: 35 },
            { nome: "Intangibilidade", dano: 65 }
        ],
        habilidade: "Congelamento",
        descricao: "Congela inimigos e cria estruturas defensivas de gelo."
    },
    'Choque Squad': {
        imagem: '../static/assets/Choque Squad.png',
        vida: 130,
        ataques: [
            { nome: "Investida Rochosa", dano: 50 },
            { nome: "Terremoto Localizado", dano: 75 }
        ],
        habilidade: "Ataques elétricos",
        descricao: "Ataques elétricos em área que paralisam múltiplos inimigos."
    },
    'Ultra T': {
        imagem: '../static/assets/Ultra T.png',
        vida: 110,
        ataques: [
            { nome: "Raio Óptico", dano: 45 },
            { nome: "Tecno-Transformação", dano: 70 }
        ],
        habilidade: "Ilusões rápidas",
        descricao: "Movimentos tão rápidos que criam ilusões e contra-ataques automáticos."
    },
    'Cipó Selvagem': {
        imagem: '../static/assets/cipoo.png',
        vida: 120,
        ataques: [
            { nome: "Chicote de Vinhas", dano: 40 },
            { nome: "Bomba de Esporos", dano: 60, efeito: 'veneno' }
        ],
        habilidade: "Prisão paralisante",
        descricao: "Prende inimigos em vinhas e libera esporos paralisantes após 3 segundos."
    },
    'Eco Eco': {
        imagem: '../static/assets/eco_eco.png',
        vida: 90,
        ataques: [
            { nome: "Grito Sônico", dano: 30 },
            { nome: "Multiplicar", dano: 55 }
        ],
        habilidade: "", // Título não fornecido
        descricao: "" // Descrição não fornecida
    },
    'Massa Cinzenta': {
        imagem: '../static/assets/Massa Cinzenta.png',
        vida: 80,
        ataques: [
            { nome: "Cálculo Rápido", dano: 20 },
            { nome: "Pulso Mental", dano: 50 }
        ],
        habilidade: "Análise rápida",
        descricao: "Analisa e encontra fraquezas em segundos, aumentando eficiência de ataques aliados."
    }
};

// Aliases (mantidos para compatibilidade, caso algum nome esteja diferente em decks.js)
cartasInfo['Geama'] = cartasInfo['Gosma'];
cartasInfo['Quatro Braços'] = cartasInfo['Quatro Braços'];
cartasInfo['Gromático'] = cartasInfo['Cromático'];
cartasInfo['Uthra T'] = cartasInfo['Ultra T'];
cartasInfo['Massa Cinzenta'] = cartasInfo['Massa Cinzenta'];
cartasInfo['Éco Éco'] = cartasInfo['Eco Eco'];
