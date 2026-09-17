// Base de Dados de Produtos Ampliada (12 Produtos)
const produtos = [
    { id: 1, nome: "Ração Premium Cães 15kg", preco: 149.90, precoAntigo: 179.90, cat: "caes", avaliacao: "⭐⭐⭐⭐⭐ (48)", desconto: "-16%", img: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400" },
    { id: 2, nome: "Ração Gourmet Gatos 3kg", preco: 79.90, precoAntigo: 89.90, cat: "gatos", avaliacao: "⭐⭐⭐⭐ (32)", desconto: "-11%", img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400" },
    { id: 3, nome: "Mordedor Corda Kripton", preco: 29.90, precoAntigo: null, cat: "acessorios", avaliacao: "⭐⭐⭐⭐⭐ (15)", desconto: null, img: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400" },
    { id: 4, nome: "Arranhador Luxo para Gatos", preco: 119.90, precoAntigo: 139.90, cat: "gatos", avaliacao: "⭐⭐⭐⭐⭐ (22)", desconto: "-14%", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" },
    { id: 5, nome: "Cama Confort Super Macia", preco: 139.90, precoAntigo: null, cat: "acessorios", avaliacao: "⭐⭐⭐⭐ (19)", desconto: null, img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400" },
    { id: 6, nome: "Coleira Guia Anti-Puxão", preco: 49.90, precoAntigo: 59.90, cat: "caes", avaliacao: "⭐⭐⭐⭐⭐ (54)", desconto: "-16%", img: "https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?w=400" },
    { id: 7, nome: "Shampoo Hipoalergênico 500ml", preco: 34.90, precoAntigo: null, cat: "saude", avaliacao: "⭐⭐⭐⭐ (11)", desconto: null, img: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400" },
    { id: 8, nome: "Fonte Automática de Água", preco: 89.90, precoAntigo: 109.90, cat: "saude", avaliacao: "⭐⭐⭐⭐⭐ (28)", desconto: "-18%", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400" },
    { id: 9, nome: "Petisco Sabor Picanha Cães", preco: 14.90, precoAntigo: null, cat: "caes", avaliacao: "⭐⭐⭐⭐⭐ (62)", desconto: null, img: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400" },
    { id: 10, nome: "Caixa de Transporte Luxo", preco: 159.90, precoAntigo: 189.90, cat: "acessorios", avaliacao: "⭐⭐⭐⭐ (14)", desconto: "-15%", img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400" },
    { id: 11, nome: "Vitamina & Suplemento Pet", preco: 45.90, precoAntigo: null, cat: "saude", avaliacao: "⭐⭐⭐⭐⭐ (20)", desconto: null, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400" },
    { id: 12, nome: "Brinquedo Laser para Gatos", preco: 24.90, precoAntigo: null, cat: "gatos", avaliacao: "⭐⭐⭐⭐⭐ (40)", desconto: null, img: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400" }
];

let carrinho = [];
let descontoAplicado = 0;
let valorFrete = 0;
let servicoSelecionado = "";

// Renderizar Produtos no DOM
function renderizarProdutos(lista) {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    lista.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                ${p.desconto ? `<span class="badge-discount">${p.desconto}</span>` : ''}
                <img src="${p.img}" alt="${p.nome}">
                <div>
                    <div class="rating">${p.avaliacao}</div>
                    <div class="card-title">${p.nome}</div>
                    <div class="card-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
                </div>
                <button onclick="adicionarAoCarrinho(${p.id})">Adicionar ao Carrinho</button>
            </div>
        `;
    });
}

// Filtro de Categoria
function filtrarCategoria(categoria) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (categoria === 'todos') {
        renderizarProdutos(produtos);
    } else {
        renderizarProdutos(produtos.filter(p => p.cat === categoria));
    }
}

// Busca em Tempo Real
function buscarProduto() {
    const termo = document.getElementById('search-input').value.toLowerCase();
    renderizarProdutos(produtos.filter(p => p.nome.toLowerCase().includes(termo)));
}

// Gerenciamento do Carrinho
function adicionarAoCarrinho(id) {
    const itemExistente = carrinho.find(item => item.id === id);
    if (itemExistente) {
        itemExistente.qtd++;
    } else {
        const produto = produtos.find(p => p.id === id);
        carrinho.push({ ...produto, qtd: 1 });
    }
    atualizarCarrinho();
    exibirToast("Produto adicionado ao carrinho!");
}

function alterarQtd(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (item) {
        item.qtd += delta;
        if (item.qtd <= 0) {
            carrinho = carrinho.filter(i => i.id !== id);
        }
    }
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const totalItens = carrinho.reduce((sum, item) => sum + item.qtd, 0);
    document.getElementById('cart-count').innerText = totalItens;

    const container = document.getElementById('cart-items-container');
    container.innerHTML = "";
    
    let subtotal = 0;

    carrinho.forEach(item => {
        subtotal += item.preco * item.qtd;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.nome}</strong><br>
                    <small>R$ ${item.preco.toFixed(2).replace('.', ',')}</small>
                </div>
                <div class="cart-item-controls">
                    <button onclick="alterarQtd(${item.id}, -1)">-</button>
                    <span style="margin: 0 5px;">${item.qtd}</span>
                    <button onclick="alterarQtd(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    const valorDesconto = subtotal * descontoAplicado;
    const totalFinal = Math.max(0, subtotal - valorDesconto + valorFrete);

    document.getElementById('cart-subtotal').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-discount').innerText = `- R$ ${valorDesconto.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-shipping').innerText = `R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
    document.getElementById('cart-total').innerText = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
}

// Cupom e Frete
function aplicarCupom() {
    const cupom = document.getElementById('coupon-code').value.trim().toUpperCase();
    if (cupom === 'KRIPTON10') {
        descontoAplicado = 0.10;
        exibirToast("Cupom de 10% aplicado!");
    } else {
        alert("Cupom inválido! Tente KRIPTON10");
    }
    atualizarCarrinho();
}

function calcularFrete() {
    const cep = document.getElementById('cep-input').value.trim();
    if (cep.length === 8) {
        valorFrete = 15.00;
        document.getElementById('shipping-info').innerText = "Frete Padrão: R$ 15,00";
        exibirToast("Frete calculado!");
    } else {
        alert("Por favor, digite um CEP válido com 8 dígitos.");
    }
    atualizarCarrinho();
}

function toggleCarrinhoModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    alert("Pedido realizado com sucesso!");
    carrinho = [];
    descontoAplicado = 0;
    valorFrete = 0;
    atualizarCarrinho();
    toggleCarrinhoModal();
}

// Agendamento
function abrirModalAgendamento(servico) {
    servicoSelecionado = servico;
    document.getElementById('agendamento-titulo').innerText = `Agendar ${servico}`;
    document.getElementById('agendamento-modal').style.display = 'flex';
}

function fecharModalAgendamento() {
    document.getElementById('agendamento-modal').style.display = 'none';
}

function confirmarAgendamento(event) {
    event.preventDefault();
    fecharModalAgendamento();
    exibirToast(`Agendamento de ${servicoSelecionado} confirmado!`);
}

function cadastrarNewsletter(e) {
    e.preventDefault();
    exibirToast("Inscrição confirmada!");
    e.target.reset();
}

function exibirToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// Inicializar na carga
renderizarProdutos(produtos);