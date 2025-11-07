// ==========================================================
// FUNÇÃO A: Efeito Máquina de Escrever (Typewriter)
// ==========================================================
function startTypewriterEffect() {
    const element = document.querySelector('.typewriter');
    if (!element) return;

    const fullText = element.getAttribute('data-text');
    let charIndex = 0;
    element.textContent = ''; // Limpa o conteúdo inicial para começar a digitar

    function type() {
        if (charIndex < fullText.length) {
            element.textContent += fullText.charAt(charIndex);
            charIndex++;
            setTimeout(type, 80); // Velocidade de digitação (80ms por caractere)
        } 
        // Não há mais animações sequenciais complexas após isso, então a função termina aqui.
    }
    type();
}


// ==========================================================
// FUNÇÃO B: Inicializa a Animação de Partículas (particles.js)
// ==========================================================
function initParticles() {
    // Certifique-se de que a biblioteca particles.js foi carregada no HTML
    if (typeof particlesJS === 'undefined') {
        console.error("particles.js não foi carregado. Verifique o <script> no HTML.");
        return;
    }

    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ffffff" },
            "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" } },
            "opacity": { "value": 0.5, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out" }
        },
        "interactivity": {
            "detect_on": "canvas", "events": {
                "onhover": { "enable": true, "mode": "repulse" },
                "onclick": { "enable": true, "mode": "push" }, "resize": true
            },
            "modes": { "repulse": { "distance": 200, "duration": 0.4 } }
        },
        "retina_detect": true
    });
}


// ==========================================================
// INÍCIO: Liga tudo ao carregar a página
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia a animação de partículas
    initParticles();

    // 2. Inicia o efeito Typewriter
    startTypewriterEffect();
    
    console.log("Script da Home carregado com Typewriter e Particles.js.");
});