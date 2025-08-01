// Deck 1 - Velocidade Relâmpago
const deck1 = [
  { habilidade: "Ataques rápidos", personagem: "XLR8", descricao: "Ataques rápidos que confundem inimigos, com chance de atordoamento." },
  { habilidade: "Dreno de energia", personagem: "Fantasmático", descricao: "Atravessa objetos e inimigos, aplicando dreno de energia em contato." },
  { habilidade: "Ilusões rápidas", personagem: "Ultra T", descricao: "Movimentos tão rápidos que criam ilusões e contra-ataques automáticos." },
  { habilidade: "Agilidade surpresa", personagem: "Macaco Aranha", descricao: "Movimento ágil entre estruturas com ataques de surpresa." },
  { habilidade: "Adaptação cromática", personagem: "Cromático", descricao: "Assume propriedades de materiais próximos para vantagem situacional." }
];

// Deck 2 - Força Alienígena
const deck2 = [
  { habilidade: "Golpes poderosos", personagem: "Quatro Braços", descricao: "Golpes poderosos que podem quebrar defesas e causar atordoamento." },
  { habilidade: "Manipulação da realidade", personagem: "Alien X", descricao: "Manipulação da realidade em pequena escala com alto custo de energia." },
  { habilidade: "Ataques elétricos", personagem: "Choque Squad", descricao: "Ataques elétricos em área que paralisam múltiplos inimigos." },
  { habilidade: "Ataques giratórios", personagem: "Tarta Gira", descricao: "Ataques giratórios que causam dano contínuo e repelem projéteis." },
  { habilidade: "Congelamento", personagem: "Friagem", descricao: "Congela inimigos e cria estruturas defensivas de gelo." }
];

// Deck 3 - Equilíbrio Tático
const deck3 = [
  { habilidade: "Armazenar energia", personagem: "Feedback", descricao: "Armazena energia recebida e libera em um ataque concentrado." },
  { habilidade: "Manipulação de água", personagem: "Aquático", descricao: "Manipulação de água para ataques e defesa, com cura em ambientes aquáticos." },
  { habilidade: "Congelamento", personagem: "Friagem", descricao: "Congela inimigos e cria estruturas defensivas de gelo." },
  { habilidade: "Adaptação cromática", personagem: "Cromático", descricao: "Assume propriedades de materiais próximos para vantagem situacional." },
  { habilidade: "Prisão paralisante", personagem: "Cipó Selvagem", descricao: "Prende inimigos em vinhas e libera esporos paralisantes após 3 segundos." }
];

// Deck 4 - Defesa Impenetrável
const deck4 = [
  { habilidade: "Ataques giratórios", personagem: "Tarta Gira", descricao: "Ataques giratórios que causam dano contínuo e repelem projéteis." },
  { habilidade: "Absorção de impacto", personagem: "Gosma", descricao: "Corpo gelatinoso que pode absorver impactos." },
  { habilidade: "Manipulação de água", personagem: "Aquático", descricao: "Manipulação de água para ataques e defesa, com cura em ambientes aquáticos." },
  { habilidade: "Congelamento", personagem: "Friagem", descricao: "Congela inimigos e cria estruturas defensivas de gelo." },
  { habilidade: "Análise rápida", personagem: "Massa Cinzenta", descricao: "Analisa e encontra fraquezas em segundos, aumentando eficiência de ataques aliados." }
];

// Deck 5 - Estratégia Suprema
const deck5 = [
  { habilidade: "Manipulação da realidade", personagem: "Alien X", descricao: "Manipulação da realidade em pequena escala com alto custo de energia." },
  { habilidade: "Análise rápida", personagem: "Massa Cinzenta", descricao: "Analisa e encontra fraquezas em segundos, aumentando eficiência de ataques aliados." },
  { habilidade: "Dreno de energia", personagem: "Fantasmático", descricao: "Atravessa objetos e inimigos, aplicando dreno de energia em contato." },
  { habilidade: "Armazenar energia", personagem: "Feedback", descricao: "Armazena energia recebida e libera em um ataque concentrado." },
  { habilidade: "Ilusões rápidas", personagem: "Ultra T", descricao: "Movimentos tão rápidos que criam ilusões e contra-ataques automáticos." }
];

const decksPredefinidos = {
    "Velocidade Relâmpago": deck1,
    "Força Alienígena": deck2,
    "Equilíbrio Tático": deck3,
    "Defesa Impenetrável": deck4,
    "Estratégia Suprema": deck5
};

// Função para obter as cartas de um deck específico (agora retorna objetos)
function getDeckCartas(nomeDeck) {
    return decksPredefinidos[nomeDeck] || [];
}
