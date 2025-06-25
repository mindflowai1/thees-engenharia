// Menu Mobile novo e animado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenu = document.querySelector('.mobile-menu-container');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const menuLinks = document.querySelectorAll('.mobile-menu-nav a');
    
    // Função para abrir o menu
    function openMenu() {
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden'; // Impede scroll quando menu está aberto
        
        // Adiciona animação sequencial para itens do menu
        document.querySelectorAll('.mobile-menu-nav li').forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    }
    
    // Função para fechar o menu
    function closeMenu() {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = ''; // Restaura o scroll
    }
    
    // Eventos de clique
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMenu);
    }
    
    // Fechar menu após clicar em um link
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Adiciona um pequeno delay para fechar o menu após a animação de clique
            setTimeout(closeMenu, 300);
        });
    });
    
    // Animação do botão do menu
    if (menuToggle) {
        const menuIcon = menuToggle.querySelector('.menu-icon');
        
        menuToggle.addEventListener('mouseover', function() {
            menuIcon.querySelectorAll('span').forEach((bar, index) => {
                bar.style.width = index === 1 ? '70%' : '100%';
            });
        });
        
        menuToggle.addEventListener('mouseout', function() {
            menuIcon.querySelectorAll('span').forEach(bar => {
                bar.style.width = '100%';
            });
        });
    }
});

// Animação na navegação com scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Offset para considerar a barra de navegação fixa
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Funcionalidade de rolagem suave para a seta "scroll-down-arrow"
document.addEventListener('DOMContentLoaded', function() {
    const scrollDownArrow = document.querySelector('.scroll-down-arrow a');
    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

// Mudança de aparência da navbar com scroll
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');
const navbarHeight = navbar.offsetHeight;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > navbarHeight) {
        // Rolando para baixo e já passou da altura da navbar
        navbar.classList.add('navbar-hidden');
    } else if (window.scrollY < lastScrollY) {
        // Rolando para cima
        navbar.classList.remove('navbar-hidden');
    }
    lastScrollY = window.scrollY;
});

// Destacar link ativo durante o scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Animação de entrada de elementos quando entrarem no viewport
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 50) {
            element.classList.add('animated');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Instagram Embed Integration
document.addEventListener('DOMContentLoaded', function() {
    // Carregar o script do Instagram
    const instagramScript = document.createElement('script');
    instagramScript.src = '//www.instagram.com/embed.js';
    instagramScript.async = true;
    instagramScript.defer = true;
    document.body.appendChild(instagramScript);
    
    // Configuração dos posts
    const instagramPosts = [
        'https://www.instagram.com/reel/C7Ae17utTYv/',
        'https://www.instagram.com/reel/C3x-VFfO8lV/',
        'https://www.instagram.com/p/DAlrqB5u6Ps/'
    ];
    
    let currentPostIndex = 0;
    const totalPosts = instagramPosts.length;
    
    // Elementos da UI
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentIndexEl = document.querySelector('.current-index');
    const totalCountEl = document.querySelector('.total-count');
    const mainBlockquote = document.querySelector('.instagram-content .instagram-media');
    const additionalBlockquotes = document.querySelectorAll('.instagram-additional .instagram-media');
    
    if (!prevBtn || !nextBtn || !mainBlockquote) return;
    
    // Inicializar o contador
    if (currentIndexEl) currentIndexEl.textContent = '1';
    if (totalCountEl) totalCountEl.textContent = totalPosts.toString();
    
    // Função para recarregar o widget do Instagram
    function reloadInstagramWidget() {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }
    
    // Função para mudar para o post anterior
    function goToPrevPost() {
        if (currentPostIndex > 0) {
            currentPostIndex--;
            updatePostDisplay();
        }
    }
    
    // Função para mudar para o próximo post
    function goToNextPost() {
        if (currentPostIndex < totalPosts - 1) {
            currentPostIndex++;
            updatePostDisplay();
        }
    }
    
    // Função para atualizar a exibição do post atual
    function updatePostDisplay() {
        // Atualizar o contador
        if (currentIndexEl) currentIndexEl.textContent = (currentPostIndex + 1).toString();
        
        // Atualizar o estado dos botões
        prevBtn.disabled = currentPostIndex === 0;
        nextBtn.disabled = currentPostIndex === totalPosts - 1;
        
        // Atualizar o link e permalink do blockquote
        if (mainBlockquote) {
            const currentURL = instagramPosts[currentPostIndex];
            mainBlockquote.setAttribute('data-instgrm-permalink', currentURL);
            const linkElement = mainBlockquote.querySelector('a');
            if (linkElement) {
                linkElement.href = currentURL;
            }
            
            // Recarregar o widget
            setTimeout(reloadInstagramWidget, 100);
        }
    }
    
    // Adicionar event listeners
    prevBtn.addEventListener('click', goToPrevPost);
    nextBtn.addEventListener('click', goToNextPost);
    
    // Inicializar o display
    instagramScript.onload = function() {
        setTimeout(reloadInstagramWidget, 1000);
    };
});

// Animação de texto dinâmico para o banner
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded fired.");
    const dynamicWordsElement = document.getElementById('dynamic-words');
    if (!dynamicWordsElement) {
        console.error("Element with ID 'dynamic-words' not found!");
        return;
    }
    console.log("Dynamic words element found:", dynamicWordsElement);

    const words = ["Qualidade", "Eficiência", "Satisfação"];
    let wordIndex = 0;

    function updateWord() {
        console.log("updateWord function called. Current wordIndex:", wordIndex);
        // Adiciona classe para fade-out
        dynamicWordsElement.style.opacity = 0;
        console.log("Opacity set to 0.");

        setTimeout(() => {
            dynamicWordsElement.textContent = words[wordIndex];
            console.log("Text content set to:", words[wordIndex]);
            // Remove classe para fade-in
            dynamicWordsElement.style.opacity = 1;
            console.log("Opacity set to 1.");
            wordIndex = (wordIndex + 1) % words.length;
        }, 500); // Tempo para o fade-out (metade do tempo de transição definido no CSS)
    }

    // Inicia a primeira palavra imediatamente
    updateWord();
    console.log("First updateWord call.");

    // Altera a palavra a cada 3 segundos (3000ms)
    setInterval(updateWord, 3000);
    console.log("Interval for updateWord set.");
});
