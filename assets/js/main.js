// Configurações globais
const CONFIG = {
    headerOffset: 100,
    animationDuration: 300,
    scrollThreshold: 10,
    mobileBreakpoint: 768
};

// Polyfill para scroll suave em navegadores mais antigos
if (!window.smoothScroll) {
    window.smoothScroll = function(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const { headerOffset } = CONFIG;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    };
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Rolagem suave para um elemento
     * @param {string} targetId - ID do elemento alvo
     */
    function smoothScroll(targetId) {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const { headerOffset } = CONFIG;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Tenta usar o scroll suave nativo
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            // Fallback para navegadores mais antigos
            window.smoothScroll(targetId);
        }
    }

    // Configura rolagem suave para links do menu desktop
    const desktopMenuLinks = document.querySelectorAll('header nav a[href^="#"]');
    desktopMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                smoothScroll(targetId);
                
                // Atualiza a URL sem recarregar a página
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    window.location.hash = href;
                }
            }
        });
    });

    // Elementos do menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    const hamburger = document.querySelector('.hamburger');
    let isMenuOpen = false;
    let resizeTimer;

    // Função para abrir o menu
    function openMobileMenu() {
        if (isMenuOpen) return;
        
        mobileMenu.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMenuOpen = true;
        
        // Força um reflow para reiniciar a animação
        void mobileMenu.offsetWidth;
        
        // Adiciona classe para ativar as animações
        mobileMenu.classList.add('animating');
    }
    
    // Função para fechar o menu
    function closeMobileMenu() {
        if (!isMenuOpen) return;
        
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        isMenuOpen = false;
        
        // Remove a classe de animação após o fechamento
        setTimeout(() => {
            mobileMenu.classList.remove('animating');
        }, 300);
    }
    
    // Função para alternar o menu
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Fechar menu ao clicar fora ou rolar a página
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Variável para controle do scroll
    let lastScrollTop = 0;
    
    // Função para verificar se deve fechar o menu durante o scroll
    function handleMenuOnScroll() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        if (Math.abs(st - lastScrollTop) > CONFIG.scrollThreshold && isMenuOpen) {
            closeMobileMenu();
        }
        lastScrollTop = st <= 0 ? 0 : st;
    }
    
    // Adiciona o listener otimizado para scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleMenuOnScroll, 100);
    });

    // Eventos de clique
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    // Fechar menu e rolar suavemente ao clicar em um link do menu mobile
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Fecha o menu com animação
                closeMobileMenu();
                
                // Pequeno delay para permitir que a animação de fechamento ocorra
                setTimeout(() => {
                    smoothScroll(targetId);
                    
                    // Atualiza a URL sem recarregar a página
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    } else {
                        window.location.hash = href;
                    }
                }, 400); // Aumentado para garantir que a animação termine
            }
        });
    });
    
    // Otimização do redimensionamento
    function handleResize() {
        if (window.innerWidth > CONFIG.mobileBreakpoint && isMenuOpen) {
            closeMobileMenu();
        }
    }

    // Debounce para o redimensionamento
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
    });

    // Otimização do header
    const header = document.querySelector('header');
    
    function updateHeaderOnScroll() {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona/remove classe do header
        if (st > 50) {
            header.classList.add('nav-scrolled');
        } else {
            header.classList.remove('nav-scrolled');
        }
    }
    
    // Otimização do scroll com requestAnimationFrame
    let animationId;
    
    function handleScroll() {
        updateHeaderOnScroll();
        animationId = window.requestAnimationFrame(handleScroll);
    }
    
    // Inicia a animação
    handleScroll();
    
    // Limpar listeners ao sair da página
    window.addEventListener('beforeunload', function() {
        if (animationId) {
            window.cancelAnimationFrame(animationId);
        }
        // Remover todos os event listeners
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleMenuOnScroll);
    });
    
    // Registrar Service Worker para cache e recursos offline
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registrado com sucesso: ', registration.scope);
                })
                .catch(function(error) {
                    console.log('Falha ao registrar o ServiceWorker: ', error);
                });
        });
    }
});