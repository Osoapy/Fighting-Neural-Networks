const DIRECOES = ["frente", "costas", "esquerda", "direita"];
const ringue = document.getElementById("ringue");
const log = document.getElementById("log");

function criarLutador(id, x, y) {
    const lutador = {
        id,
        x,
        y,
        direcao: "frente",
        pontos: 0,
        elemento: document.createElement("img"),
        aprendizado: 0.5 // fator de aprendizado (probabilidade de mudar estratégia após derrota)
    };

    lutador.elemento.src = "https://opengameart.org/sites/default/files/export_move.gif";
    lutador.elemento.classList.add("lutador");
    ringue.appendChild(lutador.elemento);
    atualizarPosicao(lutador);

    return lutador;
}

function atualizarPosicao(lutador) {
    lutador.elemento.style.left = `${lutador.x * 100}px`;
    lutador.elemento.style.top = `${lutador.y * 100}px`;
}

function virar(lutador, direcao) {
    const index = DIRECOES.indexOf(lutador.direcao);
    lutador.direcao = direcao === "esquerda" ? DIRECOES[(index + 2) % 4] : DIRECOES[(index + 1) % 4];
    lutador.elemento.style.transform = `rotate(${(DIRECOES.indexOf(lutador.direcao) * 90)}deg)`;
    logar(`Lutador ${lutador.id} virou para ${lutador.direcao}`);
}

function andar(lutador) {
    let { x, y, direcao } = lutador;

    if (direcao === "frente") y -= 1;
    if (direcao === "costas") y += 1;
    if (direcao === "esquerda") x -= 1;
    if (direcao === "direita") x += 1;

    if (x >= 0 && x <= 2 && y >= 0 && y <= 2) {
        lutador.x = x;
        lutador.y = y;
        atualizarPosicao(lutador);
        logar(`Lutador ${lutador.id} moveu para (${x}, ${y})`);
    } else {
        logar(`Lutador ${lutador.id} tentou sair do ringue!`);
    }
}

function logar(mensagem) {
    const entry = document.createElement("div");
    entry.classList.add("log-entry");
    entry.textContent = mensagem;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight; // Rolagem automática para o final
}

let lutador1 = criarLutador(1, 0, 0);
let lutador2 = criarLutador(2, 2, 2);

async function lutar() {
    // Reposicionando os lutadores
    lutador1.x = 0;
    lutador1.y = 0;
    atualizarPosicao(lutador1);

    lutador2.x = 2;
    lutador2.y = 2;
    atualizarPosicao(lutador2);

    lutador2.elemento.style.display = "block";
    lutador1.elemento.style.display = "block";

    let endend = false;
    let vencedor = null;

    while (!endend) {
        let acao1 = Math.floor(Math.random() * 3);
        let acao2 = Math.floor(Math.random() * 3);

        if (acao1 === 0) virar(lutador1, "esquerda");
        else if (acao1 === 1) virar(lutador1, "direita");
        else andar(lutador1);

        if (acao2 === 0) virar(lutador2, "esquerda");
        else if (acao2 === 1) virar(lutador2, "direita");
        else andar(lutador2);

        // Verifica se os lutadores estão na mesma posição
        if (lutador1.x === lutador2.x && lutador1.y === lutador2.y) {
            vencedor = Math.random() < 0.5 ? lutador1 : lutador2;
            logar(`Lutador ${vencedor.id} venceu a luta!`);

            if (vencedor === lutador1) {
                lutador2.elemento.style.display = "none"; // O lutador 2 perdeu
            } else {
                lutador1.elemento.style.display = "none"; // O lutador 1 perdeu
            }

            // Aprendizado
            if (vencedor === lutador1) {
                lutador1.aprendizado += 0.1;
                lutador2.aprendizado -= 0.1;
            } else {
                lutador1.aprendizado -= 0.1;
                lutador2.aprendizado += 0.1;
            }
            
            endend = true;
        }

        // Ajusta a probabilidade de ação com base no aprendizado
        if (Math.random() > lutador1.aprendizado) virar(lutador1, DIRECOES[Math.floor(Math.random() * 4)]);
        if (Math.random() > lutador2.aprendizado) virar(lutador2, DIRECOES[Math.floor(Math.random() * 4)]);

        await new Promise(r => setTimeout(r, 1000)); // Pausa entre as ações
    }

    // Exibe o vencedor no log ao final da luta
    logar(`A luta terminou! O vencedor foi o Lutador ${vencedor.id}`);
}