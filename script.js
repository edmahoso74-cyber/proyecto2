// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página del Dr. Edgar Hoyos - Medicina Ocupacional');
    console.log('Cargando componentes...');

    // Inicializar todos los componentes
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initContactForm();
    initAnimations();
    initCounterAnimation();
    initCurrentYear();
    initHoverEffects();
    initFormValidation();
    initTestimonialSlider();
    initServiceCards();
    initCertificateBadges();
    initPhotoPlaceholders();
    initWhatsAppButton();
    initPrintButton();
    initBackToTop();

    // Efecto de carga inicial
    setTimeout(() => {
        document.body.classList.add('loaded');
        showNotification('¡Bienvenido a la página del Dr. Edgar Hoyos!', 'info');
    }, 500);

    // Verificar conexión
    checkConnection();
});

// ===== MENÚ MÓVIL MEJORADO =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    if (!menuToggle || !mobileMenu) {
        console.warn('Elementos del menú móvil no encontrados');
        return;
    }

    // Estado del menú
    let isMenuOpen = false;

    // Toggle del menú móvil
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        isMenuOpen = !isMenuOpen;
        toggleMenu(isMenuOpen);
    });

    // Función para alternar menú
    function toggleMenu(open) {
        mobileMenu.classList.toggle('active', open);
        menuToggle.classList.toggle('active', open);

        const icon = menuToggle.querySelector('i');
        if (open) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            body.style.overflow = 'hidden';
            body.classList.add('menu-open');
            document.dispatchEvent(new CustomEvent('menuOpened'));
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            body.style.overflow = '';
            body.classList.remove('menu-open');
            document.dispatchEvent(new CustomEvent('menuClosed'));
        }

        isMenuOpen = open;
    }

    // Cerrar menú al hacer clic en enlace
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    toggleMenu(false);
                }, 300);
            }
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (isMenuOpen &&
            !menuToggle.contains(e.target) &&
            !mobileMenu.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Cerrar menú con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(false);
        }
    });

    // Prevenir cierre al hacer clic dentro del menú
    mobileMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Ajustar menú en resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu(false);
        }
    });

    console.log('Menú móvil inicializado');
}

// ===== SCROLL SUAVE MEJORADO =====
function initSmoothScroll() {
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '#!') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800;
                let start = null;

                // Función de easing
                function easeInOutCubic(t) {
                    return t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }

                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const easeProgress = easeInOutCubic(progress);

                    window.scrollTo(0, startPosition + distance * easeProgress);

                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }

                requestAnimationFrame(animation);

                // Actualizar URL sin recargar
                history.pushState(null, null, targetId);

                // Cerrar menú móvil si está abierto
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.getElementById('menuToggle').querySelector('i').classList.remove('fa-times');
                    document.getElementById('menuToggle').querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    console.log('Scroll suave inicializado');
}

// ===== SCROLL SPY MEJORADO =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const header = document.querySelector('.header');

    if (sections.length === 0 || navLinks.length === 0) {
        console.warn('No se encontraron secciones para Scroll Spy');
        return;
    }

    // Crear observer para las secciones
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');

                // Actualizar enlaces activos
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Disparar evento personalizado
                document.dispatchEvent(new CustomEvent('sectionActive', {
                    detail: { sectionId }
                }));
            }
        });
    }, observerOptions);

    // Observar cada sección
    sections.forEach(section => {
        observer.observe(section);
    });

    // Efecto de header al hacer scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Header con sombra al hacer scroll
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Ocultar/mostrar header en scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Inicializar estado
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    }

    console.log('Scroll Spy inicializado');
}

// ===== ANIMACIONES MEJORADAS =====
function initAnimations() {
    // Configuración del Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Agregar clase active para animación
                entry.target.classList.add('active');

                // Animaciones específicas por tipo de elemento
                if (entry.target.classList.contains('service-card')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) rotateX(0)';
                    }, index * 100);
                }

                if (entry.target.classList.contains('testimonial-card')) {
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                    entry.target.classList.add('animate-fade-in-up');
                }

                if (entry.target.classList.contains('cert-item')) {
                    entry.target.style.transitionDelay = `${index * 0.05}s`;
                }

                // Dejar de observar después de animar
                setTimeout(() => {
                    observer.unobserve(entry.target);
                }, 1000);
            }
        });
    }, observerOptions);

    // Observar elementos para animar
    const animatableElements = document.querySelectorAll(
        '.reveal, .service-card, .testimonial-card, .cert-item, .value-item, .contact-card'
    );

    animatableElements.forEach(el => {
        // Estilos iniciales para animación
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease';

        // Observar elemento
        observer.observe(el);
    });

    // Animación de entrada para hero section
    const heroElements = [
        '.hero-badge',
        '.hero-title',
        '.hero-subtitle',
        '.hero-description',
        '.hero-cta',
        '.hero-stats',
        '.doctor-photo-placeholder'
    ];

    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 150));
        }
    });

    console.log('Sistema de animaciones inicializado');
}

// ===== CONTADOR ANIMADO MEJORADO =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    if (counters.length === 0) {
        console.log('No se encontraron contadores para animar');
        return;
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const suffix = counter.textContent.includes('+') ? '+' : '';
                const duration = 2000; // 2 segundos
                const startTime = Date.now();
                const startValue = 0;

                // Función de animación del contador
                function updateCounter() {
                    const currentTime = Date.now();
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);

                    // Easing function (easeOutCubic)
                    const easeProgress = 1 - Math.pow(1 - progress, 3);

                    const currentValue = Math.floor(easeProgress * target);
                    counter.textContent = currentValue + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                        // Agregar efecto visual al completar
                        counter.classList.add('count-complete');

                        // Disparar evento
                        document.dispatchEvent(new CustomEvent('counterComplete', {
                            detail: { target, element: counter }
                        }));
                    }
                }

                // Agregar clase de animación
                counter.classList.add('counting');

                // Iniciar contador con delay pequeño
                setTimeout(updateCounter, 500);

                // Dejar de observar
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observar cada contador
    counters.forEach(counter => {
        // Configurar estado inicial
        counter.textContent = '0' + (counter.textContent.includes('+') ? '+' : '');
        observer.observe(counter);
    });

    console.log(`Contadores animados inicializados: ${counters.length} encontrados`);
}

// ===== FORMULARIO DE CONTACTO MEJORADO =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) {
        console.warn('Formulario de contacto no encontrado');
        return;
    }

    // Elementos del formulario
    const formElements = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        service: document.getElementById('service'),
        company: document.getElementById('company'),
        employees: document.getElementById('employees'),
        message: document.getElementById('message')
    };

    // Estado del formulario
    let formState = {
        isSubmitting: false,
        lastSubmission: null,
        attempts: 0
    };

    // Inicializar máscara para teléfono
    if (formElements.phone) {
        initPhoneMask(formElements.phone);
    }

    // Validación en tiempo real
    Object.keys(formElements).forEach(key => {
        const element = formElements[key];
        if (element) {
            element.addEventListener('blur', () => validateField(key));
            element.addEventListener('input', () => clearError(key));
        }
    });

    // Envío del formulario
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Prevenir múltiples envíos
        if (formState.isSubmitting) {
            showNotification('Por favor espera...', 'info');
            return;
        }

        // Validar formulario completo
        const isValid = validateForm();
        if (!isValid) {
            showNotification('Por favor completa los campos requeridos correctamente', 'error');
            return;
        }

        // Cambiar estado
        formState.isSubmitting = true;
        formState.attempts++;

        // Mostrar estado de carga
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const originalWidth = submitBtn.offsetWidth;

        submitBtn.style.width = `${originalWidth}px`;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        try {
            // Simular envío a servidor (en producción, esto sería una llamada fetch real)
            const formData = getFormData();

            // Guardar en localStorage por si hay error
            localStorage.setItem('contactFormDraft', JSON.stringify(formData));

            // Simular delay de red
            await simulateNetworkRequest();

            // Éxito
            showNotification('¡Mensaje enviado con éxito! El Dr. Hoyos se comunicará contigo pronto.', 'success');

            // Resetear formulario
            contactForm.reset();
            clearAllErrors();

            // Guardar timestamp del envío
            formState.lastSubmission = Date.now();

            // Disparar evento personalizado
            document.dispatchEvent(new CustomEvent('contactFormSubmitted', {
                detail: { formData, timestamp: new Date() }
            }));

            // Scroll al inicio del formulario
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        } catch (error) {
            // Error
            console.error('Error al enviar formulario:', error);
            showNotification('Error al enviar el mensaje. Por favor intenta nuevamente.', 'error');

            // Restaurar datos del draft
            restoreFormDraft();

        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.width = '';
            formState.isSubmitting = false;

            // Resetear después de 2 intentos fallidos
            if (formState.attempts >= 2) {
                setTimeout(() => {
                    formState.attempts = 0;
                }, 5000);
            }
        }
    });

    // Funciones auxiliares
    function getFormData() {
        return {
            name: formElements.name?.value.trim() || '',
            email: formElements.email?.value.trim() || '',
            phone: formElements.phone?.value.trim() || '',
            service: formElements.service?.value || '',
            company: formElements.company?.value.trim() || '',
            employees: formElements.employees?.value || '',
            message: formElements.message?.value.trim() || '',
            timestamp: new Date().toISOString(),
            source: 'dr-hoyos-website'
        };
    }

    async function simulateNetworkRequest() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito 90% del tiempo
                Math.random() > 0.1 ? resolve() : reject(new Error('Network error'));
            }, 1500);
        });
    }

    function restoreFormDraft() {
        try {
            const draft = localStorage.getItem('contactFormDraft');
            if (draft) {
                const formData = JSON.parse(draft);

                if (formElements.name) formElements.name.value = formData.name || '';
                if (formElements.email) formElements.email.value = formData.email || '';
                if (formElements.phone) formElements.phone.value = formData.phone || '';
                if (formElements.service) formElements.service.value = formData.service || '';
                if (formElements.company) formElements.company.value = formData.company || '';
                if (formElements.employees) formElements.employees.value = formData.employees || '';
                if (formElements.message) formElements.message.value = formData.message || '';
            }
        } catch (error) {
            console.error('Error al restaurar draft:', error);
        }
    }

    console.log('Formulario de contacto inicializado');
}

// ===== VALIDACIÓN DE FORMULARIO =====
function initFormValidation() {
    // Expresiones regulares para validación
    const patterns = {
        name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9\s\-\+\(\)]{9,15}$/,
        company: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-\.,]{0,100}$/,
        message: /^[\s\S]{0,1000}$/
    };

    // Mensajes de error
    const errorMessages = {
        name: {
            required: 'Por favor ingresa tu nombre completo',
            invalid: 'El nombre debe tener entre 2 y 50 caracteres',
            pattern: 'Solo se permiten letras y espacios'
        },
        email: {
            required: 'Por favor ingresa tu correo electrónico',
            invalid: 'Por favor ingresa un correo electrónico válido',
            pattern: 'Formato de correo inválido'
        },
        phone: {
            required: 'Por favor ingresa tu número de teléfono',
            invalid: 'Por favor ingresa un número de teléfono válido',
            pattern: 'Formato de teléfono inválido'
        },
        service: {
            required: 'Por favor selecciona un servicio'
        }
    };

    // Validar campo individual
    window.validateField = function(fieldName) {
        const element = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        if (!element || !errorElement) return true;

        const value = element.value.trim();
        let isValid = true;
        let message = '';

        // Validaciones específicas por campo
        switch(fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    message = errorMessages.name.required;
                } else if (value.length < 2 || value.length > 50) {
                    isValid = false;
                    message = errorMessages.name.invalid;
                } else if (!patterns.name.test(value)) {
                    isValid = false;
                    message = errorMessages.name.pattern;
                }
                break;

            case 'email':
                if (!value) {
                    isValid = false;
                    message = errorMessages.email.required;
                } else if (!patterns.email.test(value)) {
                    isValid = false;
                    message = errorMessages.email.invalid;
                }
                break;

            case 'phone':
                if (!value) {
                    isValid = false;
                    message = errorMessages.phone.required;
                } else {
                    const cleanPhone = value.replace(/\s/g, '');
                    if (!patterns.phone.test(cleanPhone)) {
                        isValid = false;
                        message = errorMessages.phone.invalid;
                    }
                }
                break;

            case 'service':
                if (!value) {
                    isValid = false;
                    message = errorMessages.service.required;
                }
                break;
        }

        // Actualizar estado visual
        if (isValid) {
            element.classList.remove('error');
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        } else {
            element.classList.add('error');
            errorElement.classList.add('show');
            errorElement.textContent = message;
        }

        return isValid;
    };

    // Limpiar error
    window.clearError = function(fieldName) {
        const element = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + 'Error');

        if (element) element.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('show');
            errorElement.textContent = '';
        }
    };

    // Limpiar todos los errores
    window.clearAllErrors = function() {
        document.querySelectorAll('.form-error').forEach(error => {
            error.classList.remove('show');
            error.textContent = '';
        });

        document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
            input.classList.remove('error');
        });
    };

    // Validar formulario completo
    window.validateForm = function() {
        let isValid = true;

        // Validar campos requeridos
        const requiredFields = ['name', 'email', 'phone', 'service'];
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    };

    // Máscara para teléfono
    function initPhoneMask(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                } else if (value.length <= 9) {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
                } else {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9);
                }
            }

            e.target.value = value;
        });
    }

    console.log('Sistema de validación inicializado');
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialGrid = document.querySelector('.testimonials-grid');

    if (!testimonialCards.length || !testimonialGrid) {
        console.log('No se encontraron testimonios para slider');
        return;
    }

    // Configurar grid para testimonios
    testimonialCards.forEach((card, index) => {
        // Agregar índice como data attribute
        card.setAttribute('data-index', index);

        // Agregar event listeners para hover
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });

        // Click para expandir (en móvil)
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('expanded');
            }
        });
    });

    // Rotación automática de testimonios destacados
    let currentFeaturedIndex = 0;
    const featuredTestimonials = Array.from(testimonialCards).filter(card =>
        card.classList.contains('featured')
    );

    if (featuredTestimonials.length > 1) {
        setInterval(() => {
            // Remover featured de todos
            featuredTestimonials.forEach(card => {
                card.classList.remove('featured');
            });

            // Agregar featured al siguiente
            currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredTestimonials.length;
            featuredTestimonials[currentFeaturedIndex].classList.add('featured');

        }, 10000); // Cambiar cada 10 segundos
    }

    console.log(`Slider de testimonios inicializado: ${testimonialCards.length} testimonios`);
}

// ===== TARJETAS DE SERVICIO =====
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card, index) => {
        // Agregar delay para animación escalonada
        card.style.animationDelay = `${index * 0.1}s`;

        // Efecto de tilt en hover (solo desktop)
        if (window.innerWidth > 768) {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateY = ((x - centerX) / centerX) * 5;
                const rotateX = ((centerY - y) / centerY) * 5;

                this.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateY(-10px)
                `;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px)';
                }, 300);
            });
        }

        // Click para ver detalles (móvil)
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                this.classList.toggle('expanded');
            }
        });
    });

    console.log(`Tarjetas de servicio inicializadas: ${serviceCards.length} tarjetas`);
}

// ===== BADGES DE CERTIFICACIÓN =====
function initCertificateBadges() {
    const certBadges = document.querySelectorAll('.cert-badge');

    certBadges.forEach(badge => {
        // Agregar tooltip
        const badgeType = badge.classList.contains('active') ? 'Vigente' :
                         badge.classList.contains('reciente') ? 'Reciente' : 'Certificado';

        badge.setAttribute('title', badgeType);

        // Efecto de pulso para badges activos
        if (badge.classList.contains('active')) {
            badge.classList.add('pulse-animation');
        }
    });

    console.log(`Badges de certificación inicializados: ${certBadges.length} badges`);
}

// ===== PLACEHOLDERS PARA FOTOS =====
function initPhotoPlaceholders() {
    const photoPlaceholders = document.querySelectorAll('.photo-container, .doctor-photo-placeholder');

    photoPlaceholders.forEach(placeholder => {
        // Agregar mensaje de instrucción
        placeholder.setAttribute('title', 'Haz clic para subir tu foto profesional');

        // Click para simular upload (en desarrollo)
        placeholder.addEventListener('click', function() {
            if (confirm('¿Deseas subir tu foto profesional? En producción, esto abriría un selector de archivos.')) {
                showNotification('En producción, esto permitiría subir tu foto profesional.', 'info');
            }
        });

        // Efecto hover
        placeholder.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = 'var(--shadow-2xl)';
        });

        placeholder.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
    });

    console.log(`Placeholders de foto inicializados: ${photoPlaceholders.length} placeholders`);
}

// ===== WHATSAPP BUTTON MEJORADO =====
function initWhatsAppButton() {
    const whatsappButton = document.querySelector('.whatsapp-float');

    if (!whatsappButton) {
        console.warn('Botón de WhatsApp no encontrado');
        return;
    }

    // Textos predefinidos para WhatsApp
    const whatsappMessages = {
        default: "Hola Dr. Hoyos, quisiera información sobre sus servicios médicos ocupacionales.",
        appointment: "Hola Dr. Hoyos, me gustaría agendar una cita para evaluación médica.",
        certificate: "Hola Dr. Hoyos, necesito información sobre certificaciones SCTR.",
        business: "Hola Dr. Hoyos, represento a una empresa y necesito servicios corporativos."
    };

    // Actualizar enlace de WhatsApp basado en la sección actual
    function updateWhatsAppLink() {
        const currentSection = getCurrentSection();
        let message = whatsappMessages.default;

        switch(currentSection) {
            case 'servicios':
                message = whatsappMessages.appointment;
                break;
            case 'certificaciones':
                message = whatsappMessages.certificate;
                break;
            case 'contacto':
                message = whatsappMessages.business;
                break;
        }

        const encodedMessage = encodeURIComponent(message);
        whatsappButton.href = `https://wa.me/51975025943?text=${encodedMessage}`;
    }

    // Efecto de aparición/desaparición al hacer scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScrollTop && currentScroll > 300) {
            // Scrolling down
            whatsappButton.style.opacity = '0.5';
            whatsappButton.style.transform = 'translateY(20px)';
        } else {
            // Scrolling up
            whatsappButton.style.opacity = '1';
            whatsappButton.style.transform = 'translateY(0)';
        }

        lastScrollTop = currentScroll;
    });

    // Efecto de pulso periódico
    setInterval(() => {
        whatsappButton.classList.add('pulse');
        setTimeout(() => {
            whatsappButton.classList.remove('pulse');
        }, 1000);
    }, 30000); // Cada 30 segundos

    // Actualizar enlace inicial
    updateWhatsAppLink();

    // Actualizar al cambiar de sección
    document.addEventListener('sectionActive', updateWhatsAppLink);

    // Track clicks
    whatsappButton.addEventListener('click', function() {
        // Enviar evento a analytics (simulado)
        console.log('WhatsApp clickeado desde:', getCurrentSection());

        // Mostrar confirmación
        setTimeout(() => {
            showNotification('Redirigiendo a WhatsApp...', 'info');
        }, 100);
    });

    console.log('Botón de WhatsApp inicializado');
}

// ===== BOTÓN IMPRIMIR =====
function initPrintButton() {
    // Crear botón de impresión (opcional, se puede agregar en el HTML)
    const printButton = document.createElement('button');
    printButton.id = 'printButton';
    printButton.innerHTML = '<i class="fas fa-print"></i>';
    printButton.setAttribute('aria-label', 'Imprimir página');
    printButton.setAttribute('title', 'Imprimir información');

    // Estilos para el botón de impresión
    const style = document.createElement('style');
    style.textContent = `
        #printButton {
            position: fixed;
            bottom: 100px;
            left: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--gray-700), var(--gray-900));
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #printButton:hover {
            opacity: 1;
            transform: scale(1.1);
            background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        }
        
        @media print {
            #printButton {
                display: none !important;
            }
        }
        
        @media (max-width: 768px) {
            #printButton {
                bottom: 80px;
                left: 20px;
                width: 45px;
                height: 45px;
                font-size: 1.125rem;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(printButton);

    // Funcionalidad de impresión
    printButton.addEventListener('click', function() {
        showNotification('Preparando para imprimir...', 'info');

        setTimeout(() => {
            window.print();
        }, 500);
    });

    console.log('Botón de impresión inicializado');
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const button = document.createElement('button');
    button.id = 'backToTop';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.setAttribute('aria-label', 'Volver arriba');
    button.setAttribute('title', 'Volver al inicio');

    const style = document.createElement('style');
    style.textContent = `
        #backToTop {
            position: fixed;
            bottom: 160px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--secondary), var(--secondary-dark));
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.25rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        #backToTop:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: var(--shadow-xl);
            background: linear-gradient(135deg, var(--secondary-dark), var(--secondary));
        }
        
        #backToTop.visible {
            opacity: 1;
