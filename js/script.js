// ===============================
// PRODUTOS DA LOJA
// ===============================

// ===============================
// PRODUTOS DA LOJA
// ===============================

const produtos = [

    {
        id: 1,
        nome: "Acessórios",
        preco: 49.90,
        imagem: "img/produto1.jpeg.jpeg",
        categoria: "Acessórios",
        descricao: "Kit de acessórios elegante e versátil para complementar seu estilo."
    },

    {
        id: 2,
        nome: "Colar",
        preco: 29.90,
        imagem: "img/produto2.jpeg",
        categoria: "Colares",
        descricao: "Brinco delicado e elegante para complementar diferentes looks."
    },

    {
        id: 3,
        nome: "Brincos",
        preco: 32.90,
        imagem: "img/brinco.jpeg",
        categoria: "Brincos",
        descricao: "Brincos modernos e charmosos para deixar seu visual ainda mais bonito."
    },

    {
        id: 4,
        nome: "Anel",
        preco: 40.50,
        imagem: "img/anel.jpeg",
        categoria: "Anéis",
        descricao: "Anel delicado e elegante para complementar seu estilo."
    },

    {
        id: 5,
        nome: "Colar",
        preco: 35.90,
        imagem: "img/colar.jpeg",
        categoria: "Colares",
        descricao: "Colar delicado e versátil para combinar com diferentes looks."
    },

    {
        id: 6,
        nome: "Biquini - Anitta",
        preco: 35.90,
        imagem: "img/biquini.jpeg",
        categoria: "Biquini",
        descricao: "Biquíni moderno e estiloso para você aproveitar seus momentos de lazer."
    }

   

];
// =====================================
// PRODUTOS CADASTRADOS NO ADMIN
// =====================================

function obterProdutosDaLoja() {

    const produtosCadastrados =
        JSON.parse(
            localStorage.getItem("produtosADAcessorios")
        ) || [];

    return produtosCadastrados;
}
// =====================================
// NOTIFICAÇÕES
// =====================================

function mostrarNotificacao(mensagem, tipo = "sucesso") {

    const notificacao = document.createElement("div");

    notificacao.className = `notificacao ${tipo}`;

    notificacao.textContent = mensagem;

    document.body.appendChild(notificacao);

    setTimeout(() => {

        notificacao.classList.add("saindo");

        setTimeout(() => {
            notificacao.remove();
        }, 300);

    }, 3000);
}
// ===============================
// MOSTRAR PRODUTOS NA TELA
// ===============================

function mostrarProdutos() {

    const listaProdutos =
        document.getElementById("lista-produtos");

    // O index.html não possui lista de produtos.
    // A página Produtos.html possui.
    if (!listaProdutos) {
        return;
    }

    listaProdutos.innerHTML = "";

    const todosProdutos = obterProdutosDaLoja();

    todosProdutos.forEach(produto => {

        const estoque = Number(produto.estoque) || 0;
        const esgotado = estoque <= 0;

        listaProdutos.innerHTML += `
            <div class="produto"
                 data-categoria="${produto.categoria}"
                 onclick="abrirDetalhesProduto(${produto.id})">

                <div class="imagem-produto">
                    <img
                        src="${produto.imagem}"
                        alt="${produto.nome}">
                </div>

                <h3>
                    ${produto.nome}
                </h3>

                <p>
                    R$ ${produto.preco
                        .toFixed(2)
                        .replace(".", ",")}
                </p>

                <p class="estoque-produto ${esgotado ? "esgotado" : ""}">
                    ${
                        esgotado
                            ? "Esgotado"
                            : `Disponível: ${estoque} unidade${estoque === 1 ? "" : "s"}`
                    }
                </p>

                <button
                    ${esgotado ? "disabled" : ""}
                    onclick="event.stopPropagation(); comprarProduto(${produto.id})">

                    ${
                        esgotado
                            ? "Esgotado"
                            : "Comprar"
                    }

                </button>

            </div>
        `;
    });
}


// ===============================
// CARRINHO
// ===============================

let carrinho = [];


// ===============================
// CARRINHO
// ===============================



// Adicionar produto ao carrinho
function comprarProduto(idProduto) {

    const todosProdutos =
        obterProdutosDaLoja();

    const produto = todosProdutos.find(
        produto => produto.id === idProduto
    );

    if (!produto) {
        return;
    }

    const estoque =
        Number(produto.estoque) || 0;

    if (estoque <= 0) {
        mostrarNotificacao(
    "Produto esgotado!",
    "erro"
);
        return;
    }

    const produtoExistente =
        carrinho.find(
            item => item.id === idProduto
        );

    const quantidadeNoCarrinho =
        produtoExistente
            ? produtoExistente.quantidade
            : 0;

    if (quantidadeNoCarrinho >= estoque) {
        mostrarNotificacao(
    "Você atingiu o limite disponível em estoque.",
    "erro"
);
        return;
    }

    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinho();

  mostrarNotificacao(
    produto.nome + " foi adicionado ao carrinho!"
);
}

   

function salvarCarrinho() {

    localStorage.setItem(
        "carrinhoADAcessorios",
        JSON.stringify(carrinho)
    );
}

// Atualizar quantidade mostrada no topo
function atualizarCarrinho() {

    let quantidadeTotal = 0;

    carrinho.forEach(produto => {
        quantidadeTotal += produto.quantidade;
    });

    document.getElementById("quantidade").textContent = quantidadeTotal;
}

// Abrir carrinho
function abrirCarrinho() {

    document.getElementById("carrinhoModal").style.display = "flex";

    mostrarProdutosCarrinho();
}

// Fechar carrinho

function fecharCarrinhoAoClicarFora(event) {

    const modal =
        document.getElementById("carrinhoModal");

    if (event.target === modal) {
        fecharCarrinho();
    }
}
function fecharCarrinho() {

    document.getElementById("carrinhoModal").style.display = "none";
}

function mostrarProdutosCarrinho() {

    const listaCarrinho = document.getElementById("lista-carrinho");

    listaCarrinho.innerHTML = "";

    let total = 0;

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        document.getElementById("total-carrinho").textContent = "0,00";

        return;
    }


    carrinho.forEach((produto, index) => {

        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;

        listaCarrinho.innerHTML += `

           <div class="item-carrinho">

    <img
        src="${produto.imagem}"
        alt="${produto.nome}"
        class="imagem-carrinho"
    >

    <div class="informacoes-produto">

        <h3>${produto.nome}</h3>

        <p>
            R$ ${produto.preco
                .toFixed(2)
                .replace(".", ",")}
        </p>

    </div>

                <div class="controle-quantidade">

                    <button onclick="diminuirQuantidade(${index})">
                        -
                    </button>

                    <span>
                        ${produto.quantidade}
                    </span>

                    <button onclick="aumentarQuantidade(${index})">
                        +
                    </button>

                </div>


                <div class="subtotal">

                    <strong>
                        R$ ${subtotal
                            .toFixed(2)
                            .replace(".", ",")}
                    </strong>

                    <button
                        class="remover"
                        onclick="removerProduto(${index})">
                        🗑️
                    </button>

                </div>

            </div>
        `;
    });


    document.getElementById("total-carrinho").textContent =
        total.toFixed(2).replace(".", ",");
}

function aumentarQuantidade(index) {

    const produtoCarrinho = carrinho[index];

    const produtosDaLoja =
        obterProdutosDaLoja();

    const produtoAtual =
        produtosDaLoja.find(
            produto => produto.id === produtoCarrinho.id
        );

    if (!produtoAtual) {
        return;
    }

    const estoque =
        Number(produtoAtual.estoque) || 0;

    if (produtoCarrinho.quantidade >= estoque) {
        alert(
            "Você atingiu o limite disponível em estoque."
        );
        return;
    }

    produtoCarrinho.quantidade++;

    salvarCarrinho();
    atualizarCarrinho();
    mostrarProdutosCarrinho();
}

function diminuirQuantidade(index) {

    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);
    }

    salvarCarrinho();

    atualizarCarrinho();

    mostrarProdutosCarrinho();
}

function removerProduto(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarCarrinho();

    mostrarProdutosCarrinho();
}


function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarNotificacao(
            "Seu carrinho está vazio!",
            "erro"
        );
        return;
    }

    const nomeCliente =
        document.getElementById("nomeCliente").value.trim();

    const formaPagamento =
        document.getElementById("formaPagamento").value;

    const formaRecebimento =
        document.getElementById("FormadeRecebimento").value;

    const observacao =
        document.getElementById("observacaoPedido").value.trim();

    if (nomeCliente === "") {
        mostrarNotificacao(
            "Por favor, informe seu nome.",
            "erro"
        );
        return;
    }

    if (formaPagamento === "") {
        mostrarNotificacao(
            "Por favor, escolha a forma de pagamento.",
            "erro"
        );
        return;
    }

    if (formaRecebimento === "") {
        mostrarNotificacao(
            "Por favor, escolha a forma de recebimento.",
            "erro"
        );
        return;
    }

    // Emojis em formato UTF-16
    const ola = "\uD83D\uDC4B";          // 👋
    const coracao = "\uD83D\uDC9C";      // 💜
    const cliente = "\uD83D\uDC64";      // 👤
    const produtos = "\uD83D\uDED2";     // 🛒
    const dinheiro = "\uD83D\uDCB0";     // 💰
    const pagamento = "\uD83D\uDCB3";    // 💳
    const pacote = "\uD83D\uDCE6";       // 📦
    const observacaoEmoji = "\uD83D\uDCDD"; // 📝
    const sorriso = "\uD83D\uDE0A";      // 😊

    let mensagem =
        "Olá! " + ola + "\n";

    mensagem +=
        "Gostaria de fazer um pedido na *AD.Acessórios*. " +
        coracao +
        "\n\n";

    mensagem +=
        cliente +
        " *Cliente:* " +
        nomeCliente +
        "\n\n";

    mensagem +=
        produtos +
        " *PRODUTOS*\n\n";

    let total = 0;

    carrinho.forEach(produto => {
        const subtotal =
            produto.preco * produto.quantidade;

        total += subtotal;

        mensagem +=
            "• *" +
            produto.nome +
            "*\n";

        mensagem +=
            "Quantidade: " +
            produto.quantidade +
            "\n";

        mensagem +=
            "Preço unitário: R$ " +
            produto.preco
                .toFixed(2)
                .replace(".", ",") +
            "\n";

        mensagem +=
            "Subtotal: R$ " +
            subtotal
                .toFixed(2)
                .replace(".", ",") +
            "\n\n";
    });

    mensagem +=
        "━━━━━━━━━━━━━━━━━━\n";

    mensagem +=
        dinheiro +
        " *TOTAL: R$ " +
        total
            .toFixed(2)
            .replace(".", ",") +
        "*\n";

    mensagem +=
        pagamento +
        " *Pagamento:* " +
        formaPagamento +
        "\n";

    mensagem +=
        pacote +
        " *Recebimento:* " +
        formaRecebimento +
        "\n";

    if (observacao !== "") {
        mensagem +=
            observacaoEmoji +
            " *Observação:* " +
            observacao +
            "\n";
    }

    mensagem +=
        "━━━━━━━━━━━━━━━━━━\n\n";

    mensagem +=
        "Gostaria de finalizar meu pedido. " +
        sorriso;
        console.log("MENSAGEM ANTES DO WHATSAPP:");
console.log(mensagem);

    const numeroWhatsApp = "5585981974741";

const linkWhatsApp =
    "https://api.whatsapp.com/send?phone=" +
    numeroWhatsApp +
    "&text=" +
    encodeURIComponent(mensagem);
    const janelaWhatsApp =
        window.open(linkWhatsApp, "_blank");

    if (janelaWhatsApp) {
        carrinho = [];

        localStorage.removeItem(
            "carrinhoADAcessorios"
        );

        atualizarCarrinho();

        mostrarNotificacao(
            "Pedido enviado para o WhatsApp! Carrinho limpo."
        );
    }
}
function carregarCarrinho() {

    const carrinhoSalvo =
        localStorage.getItem("carrinhoADAcessorios");

    if (carrinhoSalvo) {

        carrinho = JSON.parse(carrinhoSalvo);

        atualizarCarrinho();
    }
}

carregarCarrinho();
mostrarProdutos();

function filtrarProdutos(categoria, botaoSelecionado) {

    const textoBusca =
        document.getElementById("campoBusca").value
            .toLowerCase()
            .trim();

    const produtosTela =
        document.querySelectorAll(".produto");

    produtosTela.forEach(produto => {

        const categoriaProduto =
            produto.getAttribute("data-categoria");

        const nomeProduto =
            produto.querySelector("h3")
                .textContent
                .toLowerCase();

        const correspondeCategoria =
            categoria === "Todos" ||
            categoriaProduto === categoria;

        const correspondeBusca =
            nomeProduto.includes(textoBusca);

        if (correspondeCategoria && correspondeBusca) {
            produto.style.display = "block";
        } else {
            produto.style.display = "none";
        }

    });

    const botoes =
        document.querySelectorAll(".categoria-btn");

    botoes.forEach(botao => {
        botao.classList.remove("ativo");
    });

    botaoSelecionado.classList.add("ativo");
}
function buscarProdutos() {

    const textoBusca =
        document.getElementById("campoBusca").value
            .toLowerCase()
            .trim();

    const botaoAtivo =
        document.querySelector(".categoria-btn.ativo");

    const categoriaAtual =
        botaoAtivo
            ? botaoAtivo.textContent
            : "Todos";

    const produtosTela =
        document.querySelectorAll(".produto");

    produtosTela.forEach(produto => {

        const categoriaProduto =
            produto.getAttribute("data-categoria");

        const nomeProduto =
            produto.querySelector("h3")
                .textContent
                .toLowerCase();

        let categoriaSelecionada = "Todos";

        if (categoriaAtual.includes("Brincos")) {
            categoriaSelecionada = "Brincos";
        } else if (categoriaAtual.includes("Anéis")) {
            categoriaSelecionada = "Anéis";
        } else if (categoriaAtual.includes("Colares")) {
            categoriaSelecionada = "Colares";
       } else if (categoriaAtual.includes("Biquini")) {
    categoriaSelecionada = "Biquini";
       }else if (categoriaAtual.includes("Lingerie")) {
    categoriaSelecionada = "Lingerie";
        } else if (categoriaAtual.includes("Acessórios")) {
            categoriaSelecionada = "Acessórios";
        }else if (categoriaAtual.includes("Infantil")) {
    categoriaSelecionada = "Infantil";
        }

        const correspondeCategoria =
            categoriaSelecionada === "Todos" ||
            categoriaProduto === categoriaSelecionada;

        const correspondeBusca =
            nomeProduto.includes(textoBusca);

        if (correspondeCategoria && correspondeBusca) {
            produto.style.display = "block";
        } else {
            produto.style.display = "none";
        }

    });
}

function abrirDetalhesProduto(idProduto) {

    const todosProdutos =
        obterProdutosDaLoja();

    const produto = todosProdutos.find(
        produto => produto.id === idProduto
    );

    if (!produto) {
        return;
    }

    document.getElementById("produtoImagem").src =
        produto.imagem;

    document.getElementById("produtoImagem").alt =
        produto.nome;

    document.getElementById("produtoNome").textContent =
        produto.nome;

    document.getElementById("produtoCategoria").textContent =
        produto.categoria;

    document.getElementById("produtoPreco").textContent =
        "R$ " +
        produto.preco
            .toFixed(2)
            .replace(".", ",");

    document.getElementById("produtoDescricao").textContent =
        produto.descricao ||
        "Um lindo acessório para complementar seu estilo.";

    document.getElementById("botaoComprarDetalhes").onclick =
        function () {

            comprarProduto(produto.id);

            fecharProduto();
        };

    document.getElementById("produtoModal").style.display =
        "flex";
}
function fecharProduto() {

    document.getElementById("produtoModal").style.display = "none";

}
/* ==========================================
CARROSSEL DA PÁGINA INICIAL
========================================== */

let slideAtual = 0;
let intervaloCarrossel;

/* MOSTRAR SLIDE */

function mostrarSlide(numero) {


const slides = document.querySelectorAll(".slide");
const indicadores = document.querySelectorAll(".indicador");

// Se não existir carrossel na página, não faz nada
if (slides.length === 0) {
    return;
}

// Garantir que o número esteja dentro dos limites
if (numero >= slides.length) {
    slideAtual = 0;
}

if (numero < 0) {
    slideAtual = slides.length - 1;
}

// Esconder todos os slides
slides.forEach(slide => {
    slide.classList.remove("ativo");
});

// Remover indicador ativo
indicadores.forEach(indicador => {
    indicador.classList.remove("ativo");
});

// Mostrar slide atual
slides[slideAtual].classList.add("ativo");

// Ativar bolinha correspondente
if (indicadores[slideAtual]) {
    indicadores[slideAtual].classList.add("ativo");
}


}

/* MUDAR SLIDE */

function mudarSlide(direcao) {


slideAtual += direcao;

mostrarSlide(slideAtual);

reiniciarCarrossel();


}

/* IR DIRETAMENTE PARA UM SLIDE */

function irParaSlide(numero) {


slideAtual = numero;

mostrarSlide(slideAtual);

reiniciarCarrossel();


}

/* INICIAR CARROSSEL AUTOMÁTICO */

function iniciarCarrossel() {


const slides = document.querySelectorAll(".slide");

// Não iniciar se a página não possuir carrossel
if (slides.length === 0) {
    return;
}

intervaloCarrossel = setInterval(() => {

    slideAtual++;

    mostrarSlide(slideAtual);

}, 4000);


}

/* REINICIAR TEMPO DO CARROSSEL */

function reiniciarCarrossel() {


clearInterval(intervaloCarrossel);

iniciarCarrossel();


}

/* INICIAR QUANDO A PÁGINA CARREGAR */

document.addEventListener("DOMContentLoaded", () => {


const slides = document.querySelectorAll(".slide");

if (slides.length === 0) {
    return;
}

mostrarSlide(slideAtual);

iniciarCarrossel();


});
