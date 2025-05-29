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

// Inicialização do carrossel de serviços
document.addEventListener('DOMContentLoaded', function() {
    initServicesCarousel();
});

// Função para inicializar o carrossel de serviços
function initServicesCarousel() {
    const carousel = document.querySelector('.services-carousel');
    if (!carousel) return;
    
    const cards = Array.from(carousel.querySelectorAll('.service-card'));
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicators = document.querySelector('.carousel-indicators');
    
    // Sempre mostrar 2 cards por vez
    const cardsPerView = 2;
    let currentIndex = 0;
    
    // Criar indicadores (pontos de navegação)
    function createIndicators() {
        indicators.innerHTML = '';
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentIndex = i * cardsPerView;
                updateCarousel();
            });
            
            indicators.appendChild(dot);
        }
    }
    
    // Atualizar indicadores ativos
    function updateIndicators() {
        const dots = indicators.querySelectorAll('.indicator');
        const activeIndex = Math.floor(currentIndex / cardsPerView);
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }
    
    // Atualizar a visualização do carrossel
    function updateCarousel() {
        // Limitar o índice para evitar posições inválidas
        if (currentIndex < 0) {
            currentIndex = 0;
        } else if (currentIndex > cards.length - cardsPerView) {
            currentIndex = cards.length - cardsPerView;
        }
        
        // Largura do card + margem (30px de margem total)
        const cardTotalWidth = carousel.offsetWidth / cardsPerView;
        const translateX = currentIndex * cardTotalWidth;
        
        carousel.style.transform = `translateX(-${translateX}px)`;
        updateIndicators();
    }
    
    // Navegação para o próximo slide
    function nextSlide() {
        currentIndex += cardsPerView;
        
        // Se estiver no último conjunto, voltar para o início
        if (currentIndex >= cards.length) {
            currentIndex = 0;
        }
        
        updateCarousel();
    }
    
    // Navegação para o slide anterior
    function prevSlide() {
        currentIndex -= cardsPerView;
        
        // Se estiver no primeiro conjunto, ir para o último
        if (currentIndex < 0) {
            currentIndex = Math.floor((cards.length - 1) / cardsPerView) * cardsPerView;
        }
        
        updateCarousel();
    }
    
    // Configurar eventos dos botões de navegação
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Inicialização do carrossel
    createIndicators();
    updateCarousel();
    
    // Adicionar funcionalidade de swipe para dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe para a esquerda
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe para a direita
        }
    }
    
    // Reajustar o carrossel quando a janela for redimensionada
    window.addEventListener('resize', updateCarousel);
}

// Mudança de aparência da navbar com scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
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
