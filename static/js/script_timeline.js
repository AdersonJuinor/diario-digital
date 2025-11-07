const API_URL = '/api/vlog-posts';
// MUDANÇA: NOVA DATA DE INÍCIO!
const DATA_INICIO_NAMORO = '2025-08-28'; // A PARTIR DE 28/08/2025

// FUNÇÃO: Observa e anima os elementos conforme a rolagem
function animarTimeline() {
    const timeline = document.getElementById('linha-do-tempo');
    const points = document.querySelectorAll('.timeline-point');
    
    // --- A. Desenha a Linha Central ---
    // Faz a linha crescer 2 segundos depois de tudo carregar
    setTimeout(() => {
        timeline.classList.add('is-drawn');
    }, 2000); 

    // --- B. Anima a Entrada dos Pontos (Intersection Observer) ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Se o ponto está visível, adiciona a classe para a animação
                entry.target.classList.add('is-visible');
                // Para de observar este ponto, pois ele já apareceu
                observer.unobserve(entry.target); 
            }
        });
    }, {
        // A animação será acionada quando o elemento aparecer 10% na tela
        threshold: 0.1 
    });

    // Inicia a observação de todos os pontos de memória
    points.forEach(point => {
        observer.observe(point);
    });
}

// FUNÇÃO: Conta e Anima os dias
function atualizarContador() {
    const inicio = new Date(DATA_INICIO_NAMORO);
    const hoje = new Date();
    const diferencaTempo = hoje.getTime() - inicio.getTime();
    
    // Calcula dias, horas, minutos e segundos
    const segundosTotais = Math.floor(diferencaTempo / 1000);
    const dias = Math.floor(segundosTotais / (3600 * 24));
    const horas = Math.floor((segundosTotais % (3600 * 24)) / 3600);
    const minutos = Math.floor((segundosTotais % 3600) / 60);
    const segundos = segundosTotais % 60;

    const contadorElemento = document.getElementById('countdown');
    
    if (contadorElemento) {
        contadorElemento.innerHTML = `
            <div class="counter-display">
                <span class="dias-numero">${dias}</span> dias 
                <span class="time-component">${String(horas).padStart(2, '0')}h</span>
                <span class="time-component">${String(minutos).padStart(2, '0')}m</span>
                <span class="time-component">${String(segundos).padStart(2, '0')}s</span>
            </div>
            <p class="counter-label">desde o nosso começo!</p>
        `;
    }
}

// FUNÇÃO: Carrega as memórias do Flask
async function carregarMemórias() {
    const container = document.getElementById('linha-do-tempo');
    container.innerHTML = '<p class="loading-fofo">Carregando as memórias do Caminho do Amor...</p>'; 
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}. Servidor Flask (5000) offline.`);
        const posts = await response.json();
        
        // ORDENA OS POSTS POR DATA (do mais antigo para o mais novo)
        posts.sort((a, b) => new Date(a.data_do_momento) - new Date(b.data_do_momento));
        
        container.innerHTML = ''; // Limpa o carregamento
        if (posts.length === 0) {
            container.innerHTML = `<p class="vazio-fofo">O Caminho do Amor ainda não foi pavimentado. Vamos criar a primeira memória!</p>`;
            return;
        }

        posts.forEach((post, index) => {
            const dataObjeto = new Date(post.data_do_momento);
            const dataFormatada = dataObjeto.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
            
            const postElemento = document.createElement('article');
            // Alterna a classe para que os posts fiquem um na esquerda e outro na direita
            postElemento.className = `timeline-point ${(index % 2 === 0) ? 'left' : 'right'}`; 
            
            postElemento.innerHTML = `
                <div class="vlog-content">
                    <div class="vlog-data">${dataFormatada}</div>
                    <h3 class="vlog-titulo">${post.titulo}</h3>
                    ${post.link_midia ? `<img src="${post.link_midia}" alt="${post.titulo}" class="vlog-midia">` : ''}
                    <p class="vlog-texto">${post.texto}</p>
                </div>
                <div class="timeline-heart">💖</div>
            `;
            container.appendChild(postElemento);
        });

    } catch (error) {
        console.error("Erro ao buscar dados do Flask:", error);
        // Novo erro mais claro para o usuário:
        container.innerHTML = `<p class="erro-fofo">💔 Erro de conexão com o Back-end. Detalhe: ${error.message}. <br> *Verifique se o servidor Flask está rodando na porta 5000.*</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicia e atualiza o contador a cada segundo
    atualizarContador(); 
    setInterval(atualizarContador, 1000); 
    
    carregarMemórias().then(() => {
        animarTimeline();
    });
});