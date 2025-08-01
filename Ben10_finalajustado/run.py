from flask import Flask, request, json, jsonify, render_template
import os

app = Flask(__name__)

# Configuração para recarregar templates automaticamente
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def home():
    return render_template("index.html")

# Rota original para escolher cartas (mantida caso seja usada em outro lugar, mas o fluxo principal vai para /predefinicoes)
@app.route("/escolher-cartas")
def escolher_cartas():
    template_path = os.path.join(app.template_folder, "escolher_cartas.html")
    if not os.path.exists(template_path):
        return "Erro: Template escolher_cartas.html não encontrado", 404
    return render_template("escolher_cartas.html")

@app.route("/jogo")
def jogo():
    # Obtém quem começa do parâmetro da URL, default para player1 se não especificado
    starter = request.args.get("starter", "player1")
    return render_template("jogo.html", starter=starter)

# Rota para a tela de cara ou coroa (sorteio)

# Rota para salvar deck customizado (mantida, mas não usada no fluxo de decks predefinidos)
@app.route("/salvar-deck", methods=["POST"])
def salvar_deck():
    dados = request.json
    if "personagens" not in dados or not isinstance(dados["personagens"], list) or len(dados["personagens"]) != 5:
        return jsonify({"status": "error", "message": "Você deve escolher exatamente 5 personagens!"}), 400
    # Salva em decks.json (usado para decks customizados, não predefinidos)
    with open("decks.json", "w") as f:
        json.dump(dados["personagens"], f)
    return jsonify({"status": "success", "message": "Deck salvo com sucesso!"})

# Rota para a tela de seleção de decks predefinidos
@app.route("/predefinicoes")
def deck_predefinicoes():
    return render_template("predefinicoes.html")

# Rotas adicionais (mantidas como estavam)
@app.route("/api/deck-conteudo")
def deck_conteudo():
    return render_template("deck_conteudo.html")

@app.route("/cartas")
def cartas():
    return render_template("cartas.html")

@app.route("/teste")
def teste():
    return render_template("teste.html")

if __name__ == "__main__":
    # Roda em modo debug na porta 5000
    app.run(debug=True, host="0.0.0.0", port=5000)

