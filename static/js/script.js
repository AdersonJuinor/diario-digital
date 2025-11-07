// A URL da sua API Flask. Lembre-se: o Flask deve estar rodando!
const API_URL = 'http://127.0.0.1:5000/api/vlog-posts';

// Data do início do relacionamento (AAAA-MM-DD)
// **TROQUE ESTA DATA PELA SUA!**
const DATA_INICIO_NAMORO = '2024-03-15'; 


// ==========================================================
// FUNÇÃO 1: Fazer a ponte com o Flask (Backend)
// ==========================================================
async function carregarMemórias() {
    const container = document.getElementById('linha-do-tempo');
    container.innerHTML = 'Carregando as memórias do coração...'; // Mensagem de espera

    try {
        // 1. Faz a requisição HTTP GET para a API Flask
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            // Se o Flask retornar um erro 404, 500, etc.
            throw new Error(`Erro HTTP: ${response.status}. O servidor do amor está offline?`);
        }
        
        // 2. Converte a resposta JSON em um array de objetos JS
        const posts = await response.json();

        // 3. Renderiza o conteúdo na tela
        renderizarLinhaDoTempo(posts);
        
    } catch (error) {
        console.error("Erro ao buscar dados do Flask:", error);
        container.innerHTML = `<p class="erro-fofo">
            💔 Oops! Não consegui me conectar com o servidor. 
            Verifique se o seu Backend (Python app.py) está rodando!
            Detalhe: ${error.message}
        </p>`;
    }
}


// ==========================================================
// FUNÇÃO 2: Criar os elementos HTML na Linha do Tempo
// ==========================================================
function renderizarLinhaDoTempo(posts) {
    const container = document.getElementById('linha-do-tempo');
    container.innerHTML = ''; // Limpa a mensagem de carregamento

    if (posts.length === 0) {
        container.innerHTML = `<p class="vazio-fofo">Ainda não temos memórias digitais aqui. Seja o primeiro a postar! (Use o POST na API 😉)</p>`;
        return;
    }
    
    // O array já vem ordenado do Flask (do mais recente para o mais antigo)
    posts.forEach(post => {
        const dataObjeto = new Date(post.data_do_momento);
        
        // Formata a data para ficar bonitinha (Ex: 15 de Março de 2024)
        const dataFormatada = dataObjeto.toLocaleDateString('pt-BR', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });

        const postElemento = document.createElement('article');
        postElemento.className = 'vlog-post'; 

        // Monta o HTML do post com os dados recebidos do Flask
        postElemento.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="vlog-data">${dataFormatada}</div>
            <h3 class="vlog-titulo">${post.titulo}</h3>
            ${post.link_midia ? `<img src="${post.link_midia}" alt="${post.titulo}" class="vlog-midia">` : ''}
            <p class="vlog-texto">${post.texto}</p>
        `;
        
        container.appendChild(postElemento);
    });
}


// ==========================================================
// FUNÇÃO 3: Contador de Dias Fofo
// ==========================================================
function atualizarContador() {
    const inicio = new Date(DATA_INICIO_NAMORO);
    const hoje = new Date();
    
    // Cálculo da diferença em milissegundos
    const diferencaTempo = hoje.getTime() - inicio.getTime();
    
    // Conversão para dias e arredondamento
    const dias = Math.floor(diferencaTempo / (1000 * 3600 * 24));

    const contadorElemento = document.getElementById('countdown');
    
    if (dias > 0) {
        contadorElemento.innerHTML = `Já se passaram <span class="dias-numero">${dias}</span> dias de amor!`;
    } else {
        contadorElemento.innerHTML = `Contador de dias iniciando...`;
    }
}


// ==========================================================
// INÍCIO: Chama as funções principais quando a página carregar
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia o contador de dias imediatamente
    atualizarContador(); 
    // Opcional: Atualiza a cada minuto para ser preciso
    setInterval(atualizarContador, 60000); 

    // 2. Carrega os dados da API Flask
    carregarMemórias();
});