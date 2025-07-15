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
        cancelAnimationFrame(animationId);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (mobileMenuButton) mobileMenuButton.removeEventListener('click', toggleMobileMenu);
    });

    // Função para exibir mensagem de sucesso/erro
    function showMessage(form, message, isError = false) {
        // Remove mensagens existentes
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria a mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message p-4 mb-4 rounded-md ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
        messageDiv.textContent = message;
        
        // Insere a mensagem antes do botão de envio
        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(messageDiv, submitButton);
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // Validação do formulário de contato com EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Desabilita o botão de envio
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.style.opacity = '0.7';
            submitButton.style.cursor = 'not-allowed';
            
            try {
                // Validação dos campos
                const name = this.querySelector('#name').value.trim();
                const email = this.querySelector('#email').value.trim();
                const phone = this.querySelector('#phone').value.trim();
                const subject = this.querySelector('#subject').value;
                const message = this.querySelector('#message').value.trim();
                const to_email = this.querySelector('#to_email').value;
                
                if (!name || !email || !subject || !message) {
                    throw new Error('Por favor, preencha todos os campos obrigatórios.');
                }
                
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error('Por favor, insira um endereço de e-mail válido.');
                }
                
                // Prepara os parâmetros para o EmailJS
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    to_email: to_email,
                    phone: phone || 'Não informado',
                    subject: subject,
                    message: message,
                    reply_to: email
                };
                
                // Envia o e-mail usando o EmailJS
                await emailjs.send(
                    'default_service', // Usando o serviço padrão
                    'template_logt5ac', // ID do template do EmailJS
                    templateParams
                );
                
                // Se chegou até aqui, o envio foi bem-sucedido
                showMessage(this, 'Mensagem enviada com sucesso! Entraremos em contato em breve.', false);
                
                // Limpa o formulário
                this.reset();
                
                // Rola para o topo do formulário
                this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Redireciona para a página de agradecimento após 2 segundos
                setTimeout(() => {
                    window.location.href = 'obrigado.html';
                }, 2000);
                
            } catch (error) {
                console.error('Erro ao enviar o formulário:', error);
                const errorMessage = error.message || 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde.';
                showMessage(this, errorMessage, true);
                
                // Rola até o formulário para mostrar a mensagem de erro
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                // Reativa o botão de envio
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            }
        });
        
        // Adiciona estilos dinâmicos para campos inválidos
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                this.classList.add('border-red-500');
            });
            
            input.addEventListener('input', function() {
                if (this.checkValidity()) {
                    this.classList.remove('border-red-500');
                }
            });
        });
    }
    
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