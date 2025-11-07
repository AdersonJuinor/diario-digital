// Dados simulados (se não quiser usar a API Flask ainda)
const DADOS_FOTOS_SIMULADOS = [
]

// --- FUNÇÕES DE CONTROLE DO LIGHTBOX ---

function abrirLightbox(url, titulo, descricao) {
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = url;
    document.getElementById('lightbox-title').textContent = titulo;
    document.getElementById('lightbox-desc').textContent = descricao;
    
    // Adiciona a classe para acionar as transições CSS
    lightbox.classList.add('is-open'); 
    document.body.style.overflow = 'hidden'; // Evita a rolagem da página
}

function fecharLightbox() {
    const lightbox = document.getElementById('lightbox');
    // Remove a classe para iniciar a transição de saída
    lightbox.classList.remove('is-open'); 
    document.body.style.overflow = ''; // Restaura a rolagem
}

// --- FUNÇÃO PARA CARREGAR FOTOS NA GRADE ---

async function carregarFotos() {
    const photoGrid = document.getElementById('photo-grid');
    let fotos = DADOS_FOTOS_SIMULADOS; // Usando dados simulados por padrão
    
    // Tenta buscar da API (descomente esta parte se a API estiver pronta)
    
    try {
        const response = await fetch('/api/album-photos');
        if (response.ok) {
            fotos = await response.json();
        }
    } catch (error) {
        console.error('Erro ao buscar fotos da API:', error);
        // Mantém os dados simulados se houver erro
    }
    

    photoGrid.innerHTML = ''; // Limpa o conteúdo
    
    fotos.forEach(foto => {
        const card = document.createElement('div');
        card.classList.add('photo-card');
        card.innerHTML = `
            <img src="${foto.url_foto}" alt="${foto.titulo}" class="photo-img">
            <div class="photo-card-info">
                <h3>${foto.titulo}</h3>
                <p>${foto.descricao}</p>
            </div>
        `;
        // Adiciona o evento de clique para abrir o lightbox
        card.addEventListener('click', () => {
            abrirLightbox(foto.url_foto, foto.titulo, foto.descricao);
        });
        
        photoGrid.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    carregarFotos();
    
    // Adiciona evento ao botão de fechar do Lightbox
    document.querySelector('.lightbox-close').addEventListener('click', fecharLightbox);

    // Fecha o lightbox se a tecla ESC for pressionada
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('lightbox').classList.contains('is-open')) {
            fecharLightbox();
        }
    });
});