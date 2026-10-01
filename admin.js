// =====================================
// PAINEL ADMINISTRATIVO
// =====================================

const chaveProdutos = "produtosADAcessorios";
const chaveMigracao = "produtosAntigosMigrados";
const limiteEstoqueBaixo = 5;

// =====================================
// PRODUTOS ANTIGOS DA LOJA
// =====================================

const produtosAntigos = [

    {
        id: 1,
        nome: "Kit de Acessórios",
        preco: 49.90,
        imagem: "img/produto1.jpeg.jpeg",
        categoria: "Acessórios",
        descricao: "Kit de acessórios elegante e versátil para complementar seu estilo.",
        estoque: 0
    },

    {
        id: 2,
        nome: "Colar",
        preco: 29.90,
        imagem: "img/produto2.jpeg",
        categoria: "Colares",
        descricao: "Brinco delicado e elegante para complementar diferentes looks.",
        estoque: 0
    },

    {
        id: 3,
        nome: "Brincos",
        preco: 32.90,
        imagem: "img/brinco.jpeg",
        categoria: "Brincos",
        descricao: "Brincos modernos e charmosos para deixar seu visual ainda mais bonito.",
        estoque: 0
    },

    {
        id: 4,
        nome: "Anel",
        preco: 40.50,
        imagem: "img/anel.jpeg",
        categoria: "Anéis",
        descricao: "Anel delicado e elegante para complementar seu estilo.",
        estoque: 0
    },

    {
        id: 5,
        nome: "Colar",
        preco: 35.90,
        imagem: "img/colar.jpeg",
        categoria: "Colares",
        descricao: "Colar delicado e versátil para combinar com diferentes looks.",
        estoque: 0
    },

    {
        id: 6,
        nome: "Biquini - Anitta",
        preco: 35.90,
        imagem: "img/biquini.jpeg",
        categoria: "Biquini",
        descricao: "Biquíni moderno e estiloso para você aproveitar seus momentos de lazer.",
        estoque: 0
    }

];


// =====================================
// MIGRAR PRODUTOS ANTIGOS
// =====================================

function migrarProdutosAntigos() {

    // Verifica se a migração já foi feita
    const migracaoRealizada =
        localStorage.getItem(chaveMigracao);

    if (migracaoRealizada === "true") {
        return;
    }


    // Pega os produtos que já existem no Admin
    let produtosAtuais =
        JSON.parse(
            localStorage.getItem(chaveProdutos)
        ) || [];


    // Adiciona os produtos antigos
    // somente se ainda não existirem
    produtosAntigos.forEach(function(produtoAntigo) {

        const produtoExiste =
            produtosAtuais.some(function(produto) {

                return produto.id === produtoAntigo.id;

            });


        if (!produtoExiste) {

            produtosAtuais.push(produtoAntigo);

        }

    });


    // Salva tudo no localStorage
    localStorage.setItem(
        chaveProdutos,
        JSON.stringify(produtosAtuais)
    );


    // Marca a migração como concluída
    localStorage.setItem(
        chaveMigracao,
        "true"
    );

}


// =====================================
// FAZ A MIGRAÇÃO
// =====================================

migrarProdutosAntigos();


// =====================================
// LISTA DE PRODUTOS SALVOS
// =====================================

let produtosAdmin =
    JSON.parse(
        localStorage.getItem(chaveProdutos)
    ) || [];


// =====================================
// PRODUTO SENDO EDITADO
// =====================================

let produtoEditandoId = null;

// =====================================
// ABRIR CADASTRO
// =====================================

function abrirCadastroProduto() {

    const formulario =
        document.getElementById("formularioCadastro");

    formulario.style.display = "block";

    formulario.scrollIntoView({
        behavior: "smooth"
    });
}


// =====================================
// FECHAR CADASTRO
// =====================================

function fecharCadastroProduto() {

    const formulario =
        document.getElementById("formularioCadastro");

    formulario.style.display = "none";
}


// =====================================
// CADASTRAR PRODUTO
// =====================================

// =====================================
// CADASTRAR / EDITAR PRODUTO
// =====================================

document
    .getElementById("formProduto")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const nome =
            document.getElementById("nomeProduto").value;

        const preco =
            Number(
                document.getElementById("precoProduto").value
            );

        const categoria =
            document.getElementById("categoriaProduto").value;

        const descricao =
            document.getElementById("descricaoProduto").value;

        const estoque =
            Number(
                document.getElementById("estoqueProduto").value
            );

        const arquivoImagem =
            document.getElementById("imagemProduto").files[0];


        // =====================================
        // EDITANDO PRODUTO
        // =====================================

        if (produtoEditandoId !== null) {

            const indice =
                produtosAdmin.findIndex(
                    produto =>
                        produto.id === produtoEditandoId
                );

            if (indice === -1) {
                alert("Produto não encontrado.");
                return;
            }


            // Mantém a imagem antiga
            // caso nenhuma nova imagem seja escolhida
            if (!arquivoImagem) {

                produtosAdmin[indice].nome = nome;
                produtosAdmin[indice].preco = preco;
                produtosAdmin[indice].categoria = categoria;
                produtosAdmin[indice].descricao = descricao;
                produtosAdmin[indice].estoque = estoque;

                salvarEdicaoProduto();

                return;
            }


            // Se escolheu nova imagem
            const leitor = new FileReader();

            leitor.onload = function() {

                produtosAdmin[indice].nome = nome;
                produtosAdmin[indice].preco = preco;
                produtosAdmin[indice].imagem = leitor.result;
                produtosAdmin[indice].categoria = categoria;
                produtosAdmin[indice].descricao = descricao;
                produtosAdmin[indice].estoque = estoque;

                salvarEdicaoProduto();

            };

            leitor.readAsDataURL(arquivoImagem);

            return;
        }


        // =====================================
        // NOVO PRODUTO
        // =====================================

        if (!arquivoImagem) {

            alert("Selecione uma imagem para o produto.");

            return;
        }


        const leitor = new FileReader();

        leitor.onload = function() {

            const novoProduto = {

                id: Date.now(),
                nome: nome,
                preco: preco,
                imagem: leitor.result,
                categoria: categoria,
                descricao: descricao,
                estoque: estoque

            };


            produtosAdmin.push(novoProduto);


            localStorage.setItem(
                chaveProdutos,
                JSON.stringify(produtosAdmin)
            );


            alert("Produto cadastrado com sucesso!");


            document
                .getElementById("formProduto")
                .reset();


            fecharCadastroProduto();

            mostrarProdutosAdmin();
            atualizarResumoAdmin();
            atualizarListaEstoqueBaixo();
            atualizarListaProdutosEsgotados();
            atualizarListaEstoqueNormal();

        };


        leitor.readAsDataURL(arquivoImagem);

    });


// =====================================
// FINALIZAR EDIÇÃO
// =====================================

function salvarEdicaoProduto() {

    localStorage.setItem(
        chaveProdutos,
        JSON.stringify(produtosAdmin)
    );


    produtoEditandoId = null;


    alert("Produto atualizado com sucesso!");


    document
        .getElementById("formProduto")
        .reset();


    fecharCadastroProduto();

    mostrarProdutosAdmin();
    atualizarResumoAdmin();
    atualizarListaEstoqueBaixo();
    atualizarListaProdutosEsgotados();
    atualizarListaEstoqueNormal();
}



// =====================================
// MOSTRAR PRODUTOS
// =====================================

// =====================================
// MOSTRAR PRODUTOS
// =====================================
function classeEstoque(estoque) {

    if (estoque === 0) {
        return "estoque-esgotado";
    }

    if (estoque <= limiteEstoqueBaixo) {
        return "estoque-baixo";
    }

    return "estoque-normal";
}

function mostrarProdutosAdmin() {

    const lista =
        document.getElementById("listaProdutosAdmin");


    lista.innerHTML = "";


    // Caso não tenha produtos
    if (produtosAdmin.length === 0) {

        lista.innerHTML = `
            <p class="nenhum-produto">
                Nenhum produto cadastrado ainda.
            </p>
        `;

        return;
    }


    // Percorre os produtos
    produtosAdmin.forEach(function(produto) {

        lista.innerHTML += `

            <div class="produto-admin">

                <img
                    src="${produto.imagem}"
                    alt="${produto.nome}">

                <div class="produto-admin-info">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${produto.categoria}
                    </p>

                    <strong>
                        R$ ${produto.preco
                            .toFixed(2)
                            .replace(".", ",")}
                    </strong>

                  <div class="controle-estoque">

    <span class="${classeEstoque(produto.estoque)}">
    ${
        Number(produto.estoque) === 0
            ? "Esgotado"
            : Number(produto.estoque) <= limiteEstoqueBaixo
                ? "Estoque baixo"
                : "Estoque normal"
    }
</span>

    <div class="botoes-estoque">

        <button
            class="btn-estoque"
            onclick="alterarEstoque(${produto.id}, -1)">
            −
        </button>

        <strong>
            ${produto.estoque}
        </strong>

        <button
            class="btn-estoque"
            onclick="alterarEstoque(${produto.id}, 1)">
            +
        </button>

    </div>

</div>

                    <div class="acoes-produto">

                        <button
                            class="btn-editar"
                            onclick="editarProduto(${produto.id})">
                            ✏️ Editar
                        </button>

                        <button
                            class="btn-excluir"
                            onclick="excluirProduto(${produto.id})">
                            🗑️ Excluir
                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}

// =====================================
// ATUALIZAR RESUMO
// =====================================

function atualizarResumoAdmin() {

    const totalProdutos =
        produtosAdmin.length;


    const totalEstoque =
        produtosAdmin.reduce(
            function(total, produto) {

                return total + produto.estoque;

            },
            0
        );


    const valorEstoque =
        produtosAdmin.reduce(
            function(total, produto) {

                return total +
                    (produto.preco * produto.estoque);

            },
            0
        );
        const produtosEstoqueBaixo =
    produtosAdmin.filter(function(produto) {
        const estoque = Number(produto.estoque) || 0;

        return estoque >= 1 && estoque <= 5;
    }).length;

const produtosEsgotados =
    produtosAdmin.filter(function(produto) {
        const estoque = Number(produto.estoque) || 0;

        return estoque === 0;
    }).length;

    const produtosEstoqueNormal =
    produtosAdmin.filter(function(produto) {
        const estoque = Number(produto.estoque) || 0;

        return estoque > limiteEstoqueBaixo;
    }).length;


    document.getElementById("totalProdutos")
        .textContent = totalProdutos;


    document.getElementById("totalEstoque")
        .textContent = totalEstoque;


    document.getElementById("valorEstoque")
        .textContent =
            "R$ " +
            valorEstoque
                .toFixed(2)
                .replace(".", ",");

                document.getElementById("produtosEstoqueBaixo")
    .textContent = produtosEstoqueBaixo;

document.getElementById("produtosEsgotados")
    .textContent = produtosEsgotados;

    document.getElementById("produtosEstoqueNormal")
    .textContent = produtosEstoqueNormal;
}


// =====================================
// BOTÃO VER ESTOQUE
// =====================================

function mostrarEstoque() {

    document
        .getElementById("listaProdutosAdmin")
        .scrollIntoView({
            behavior: "smooth"
        });

}

// =====================================
// EXCLUIR PRODUTO
// =====================================

function excluirProduto(idProduto) {

    const produto = produtosAdmin.find(
        produto => produto.id === idProduto
    );

    if (!produto) {
        return;
    }


    const confirmar = confirm(
        `Deseja realmente excluir o produto "${produto.nome}"?`
    );


    if (!confirmar) {
        return;
    }


    produtosAdmin = produtosAdmin.filter(
        produto => produto.id !== idProduto
    );


    localStorage.setItem(
        "produtosADAcessorios",
        JSON.stringify(produtosAdmin)
    );


    mostrarProdutosAdmin();
    atualizarResumoAdmin();
    atualizarListaEstoqueBaixo();
    atualizarListaProdutosEsgotados();
    atualizarListaEstoqueNormal();


    alert("Produto excluído com sucesso!");

}

// =====================================
// EDITAR PRODUTO
// =====================================

// =====================================
// EDITAR PRODUTO
// =====================================

function editarProduto(idProduto) {

    const produto = produtosAdmin.find(
        produto => produto.id === idProduto
    );


    if (!produto) {
        return;
    }


    produtoEditandoId = idProduto;


    document.getElementById("nomeProduto").value =
        produto.nome;

    document.getElementById("precoProduto").value =
        produto.preco;

    document.getElementById("categoriaProduto").value =
        produto.categoria;

    document.getElementById("descricaoProduto").value =
        produto.descricao;

    document.getElementById("estoqueProduto").value =
        produto.estoque;


    abrirCadastroProduto();

}


// =====================================
// CARREGAR PAINEL
// =====================================

mostrarProdutosAdmin();
atualizarResumoAdmin();
atualizarListaEstoqueBaixo();
atualizarListaProdutosEsgotados();
atualizarListaEstoqueNormal();

function alterarEstoque(idProduto, quantidade) {

    const produto = produtosAdmin.find(
        produto => produto.id === idProduto
    );

    if (!produto) {
        return;
    }

    const novoEstoque =
        Number(produto.estoque) + quantidade;

    if (novoEstoque < 0) {
        return;
    }

    produto.estoque = novoEstoque;

    localStorage.setItem(
        chaveProdutos,
        JSON.stringify(produtosAdmin)
    );

    mostrarProdutosAdmin();
    atualizarResumoAdmin();
    atualizarListaEstoqueBaixo();
    atualizarListaProdutosEsgotados();
    atualizarListaEstoqueNormal();
}
function atualizarListaEstoqueBaixo() {

    const lista =
        document.getElementById("listaEstoqueBaixo");

    lista.innerHTML = "";

    const produtosBaixo =
        produtosAdmin.filter(function(produto) {

            const estoque =
                Number(produto.estoque) || 0;

            return estoque > 0 &&
                   estoque <= limiteEstoqueBaixo;

        });

    if (produtosBaixo.length === 0) {

        lista.innerHTML = `
            <p class="sem-status">
                Nenhum produto com estoque baixo.
            </p>
        `;

        return;
    }

    produtosBaixo.forEach(function(produto) {

        const estoque = Number(produto.estoque);

        lista.innerHTML += `
            <div class="item-status">

                <span>
                    ${produto.nome}
                </span>

                <strong>
                    ${estoque}
                    ${estoque === 1 ? "unidade" : "unidades"}
                </strong>

            </div>
        `;

    });
}
function atualizarListaProdutosEsgotados() {

    const lista =
        document.getElementById("listaProdutosEsgotados");

    lista.innerHTML = "";

    const produtosEsgotados =
        produtosAdmin.filter(function(produto) {

            const estoque =
                Number(produto.estoque) || 0;

            return estoque === 0;

        });

    if (produtosEsgotados.length === 0) {

        lista.innerHTML = `
            <p class="sem-status">
                Nenhum produto esgotado.
            </p>
        `;

        return;
    }

    produtosEsgotados.forEach(function(produto) {

        lista.innerHTML += `
            <div class="item-status">

                <span>
                    ${produto.nome}
                </span>

                <strong>
                    Esgotado
                </strong>

            </div>
        `;

    });
}
function atualizarListaEstoqueNormal() {

    const lista =
        document.getElementById("listaEstoqueNormal");

    lista.innerHTML = "";

    const produtosNormais =
        produtosAdmin.filter(function(produto) {

            const estoque =
                Number(produto.estoque) || 0;

            return estoque > limiteEstoqueBaixo;

        });

    if (produtosNormais.length === 0) {

        lista.innerHTML = `
            <p class="sem-status">
                Nenhum produto com estoque normal.
            </p>
        `;

        return;
    }

    produtosNormais.forEach(function(produto) {

        const estoque =
            Number(produto.estoque);

        lista.innerHTML += `
            <div class="item-status">

                <span>
                    ${produto.nome}
                </span>

                <strong>
                    ${estoque}
                    ${estoque === 1 ? "unidade" : "unidades"}
                </strong>

            </div>
        `;

    });
}
