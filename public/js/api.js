// Detecta automaticamente a pasta raiz do projeto no Apache
const pathArray = window.location.pathname.split('/');
const projectRoot = pathArray[1]; // Geralmente 'projeto' ou o nome da pasta no htdocs
const API_BASE = `/${projectRoot}/api`;

async function fetchPatrimonios() {
    const res = await fetch(`${API_BASE}/patrimonios.php`);
    return res.json();
}

async function fetchPatrimonio(slug) {
    const res = await fetch(`${API_BASE}/patrimonios.php?slug=${slug}`);
    return res.json();
}

async function login(email, senha) {
    const res = await fetch(`${API_BASE}/auth.php?acao=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    return res.json();
}

async function register(nome, email, senha) {
    const res = await fetch(`${API_BASE}/auth.php?acao=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });
    return res.json();
}

async function logout() {
    await fetch(`${API_BASE}/auth.php?acao=logout`);
    localStorage.removeItem('user_sessao');
    window.location.href = 'index.html';
}

function renderNav() {
    const sessao = JSON.parse(localStorage.getItem('user_sessao'));
    const nav = document.getElementById('navbar');
    if (!nav) return;

    nav.innerHTML = `
        <a href="index.html" class="flex items-center gap-2 font-semibold text-lg">
            <i data-lucide="landmark" class="h-6 w-6 text-zinc-900"></i>
            <span>Acervo Rondoniense</span>
        </a>
        <div class="flex items-center gap-4 text-sm font-medium">
            <a href="busca.html" class="text-zinc-600 hover:text-zinc-900">Busca</a>
            ${sessao ? `
                <a href="login.html" class="text-zinc-600 hover:text-zinc-900">Sugerir</a>
                ${sessao.isAdmin ? `<a href="admin.html" class="text-zinc-600 hover:text-zinc-900">Painel</a>` : ''}
                <button onclick="handleLogout()" class="bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-800">Sair</button>
            ` : `
                <a href="login.html" class="text-zinc-600 hover:text-zinc-900">Login</a>
                <a href="login.html?modo=cadastro" class="bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-800">Criar conta</a>
            `}
        </div>
    `;
    lucide.createIcons();
}

async function handleLogout() {
    await logout();
}

function renderPatrimonioCard(p) {
    return `
        <div class="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-md">
            <div class="aspect-video w-full overflow-hidden bg-zinc-100">
                ${p.url_foto_principal ? `<img src="${p.url_foto_principal}" class="h-full w-full object-cover transition-transform group-hover:scale-105">` : `<div class="flex h-full w-full items-center justify-center text-xs text-zinc-400">Sem foto</div>`}
            </div>
            <div class="p-4">
                <div class="mb-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">${p.categoria}</div>
                <h3 class="mb-1 font-semibold text-zinc-950 group-hover:text-blue-600">
                    <a href="detalhe.html?slug=${p.slug}">${p.nome}</a>
                </h3>
                <div class="flex items-center gap-1 text-xs text-zinc-500">
                    <i data-lucide="map-pin" class="h-3 w-3"></i>
                    <span>${p.cidade}</span>
                </div>
            </div>
        </div>
    `;
}
