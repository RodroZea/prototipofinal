// ============================================================================================================
// Clase AnimationController: Gestiona las animaciones de elementos al hacer scroll y hover
// ============================================================================================================
class AnimationController {
    constructor() {
        this.animatedElements = new Set(); // Almacena elementos ya animados para evitar re-animación
        this.observer = null; // Observador de intersección para detectar elementos en la vista
        this.init(); // Inicializa la configuración
    }

    // Inicializa el controlador, esperando a que el DOM esté completamente cargado
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    // Configura el Intersection Observer, prepara elementos y listeners
    setup() {
        this.setupIntersectionObserver();
        this.prepareElements();
        this.setupEventListeners();
        this.animateHeader(); // Anima el encabezado al cargar la página
    }

    // Configura el Intersection Observer para detectar cuando los elementos entran en la vista
    setupIntersectionObserver() {
        const options = {
            root: null, // El viewport es el elemento raíz
            rootMargin: '0px 0px -10% 0px', // Un margen inferior para que la animación se dispare un poco antes de que el elemento esté completamente visible
            threshold: [0.1, 0.3, 0.5] // Dispara el callback cuando el 10%, 30% o 50% del elemento es visible
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si el elemento está intersectando y no ha sido animado aún
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target); // Anima el elemento
                    this.animatedElements.add(entry.target); // Añade a los elementos animados
                }
            });
        }, options);
    }

    // Prepara los elementos a animar, estableciendo sus estilos iniciales y observándolos
    prepareElements() {
        // Configuración de los elementos a animar, incluyendo su selector, tipo de animación y dirección
        const elementsConfig = [
            { selector: '.imagen_principal:first-of-type', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.content-section.div1', animation: 'custom', direction: 'stagger' }, // content-section div1
            { selector: '.content-section.div2', animation: 'custom', direction: 'stagger' }, // content-section div2
            { selector: '.frase', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.contenido2:first-of-type', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.imagen_principal:nth-of-type(2)', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.contenido2:nth-of-type(2)', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.media-player-section', animation: 'fadeInUp', direction: 'up', distance: 40 }, // Sección del reproductor de medios
            { selector: '.main-footer', animation: 'fadeInUp', direction: 'up', distance: 40 }
        ];

        elementsConfig.forEach(config => {
            const element = document.querySelector(config.selector);
            if (element) {
                this.prepareElement(element, config); // Prepara el estilo inicial del elemento
                this.observer.observe(element); // Empieza a observar el elemento
            }
        });
    }

    // Establece los estilos iniciales de opacidad y transformación para un elemento
    prepareElement(element, config) {
        element.style.opacity = '0';
        element.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
        element.dataset.animationType = config.animation;

        switch (config.direction) {
            case 'up':
                element.style.transform = `translateY(${config.distance}px)`;
                break;
            case 'right':
                element.style.transform = `translateX(-${config.distance}px)`;
                break;
            case 'stagger':
                this.prepareStaggerElement(element); // Prepara los hijos para animación escalonada
                break;
            default:
                element.style.transform = `translateY(${config.distance || 20}px)`;
        }
    }

    // Prepara los elementos hijos para una animación escalonada
    prepareStaggerElement(element) {
        // Selecciona todos los elementos de texto dentro del contenedor
        const children = element.querySelectorAll('h1, h2, h3, p, ul, li'); // Incluye ul y li
        children.forEach((child, index) => {
            child.style.opacity = '0'; // Inicialmente oculto
            // Alterna la dirección inicial de la transformación para un efecto de "zig-zag"
            child.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
            child.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out'; // Transición suave
            child.dataset.staggerIndex = index; // Almacena el índice para el retardo
        });
    }

    // Anima un elemento dependiendo de su tipo de animación
    animateElement(element) {
        const animationType = element.dataset.animationType;
        if (animationType === 'custom') {
            this.animateStaggerElement(element); // Llama a la animación escalonada
        } else {
            this.animateStandardElement(element); // Llama a la animación estándar
        }
        // También anima elementos de lista si existen dentro del elemento principal
        this.animateListItems(element);
    }

    // Anima un elemento con una transición estándar (fade in y translate)
    animateStandardElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)'; // Vuelve a la posición original
            // Si usa clases de Animate.css, las añade
            if (element.dataset.animationType && element.dataset.animationType.includes('animate__')) {
                element.classList.add('animate__animated', element.dataset.animationType);
            }
        });
    }

    // Anima elementos hijos de forma escalonada
    animateStaggerElement(element) {
        element.style.opacity = '1'; // Asegura que el contenedor principal sea visible
        const children = element.querySelectorAll('[data-stagger-index]');
        children.forEach((child, index) => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)'; // Vuelve a la posición original
                });
            }, index * 150); // Retardo escalonado
        });
    }

    // Anima elementos de lista (ol, ul) de forma escalonada
    animateListItems(element) {
        // Animar elementos de listas ordenadas (ol li)
        const olItems = element.querySelectorAll('ol li');
        if (olItems.length > 0 && !element.hasAttribute('data-ol-animated')) {
            element.setAttribute('data-ol-animated', 'true'); // Marca para evitar doble animación
            this.staggerAnimate(olItems, 200, 'translateX(-20px)'); // Retardo y transformación inicial
        }

        // Animar elementos de listas no ordenadas (ul li)
        const ulItems = element.querySelectorAll('ul li');
        if (ulItems.length > 0 && !element.hasAttribute('data-ul-animated')) {
            element.setAttribute('data-ul-animated', 'true'); // Marca para evitar doble animación
            this.staggerAnimate(ulItems, 150, 'translateY(20px)'); // Retardo y transformación inicial
        }
    }

    // Función genérica para animación escalonada de elementos de lista
    staggerAnimate(items, delay, initialTransform) {
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = initialTransform;
            item.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translate(0, 0)';
                });
            }, index * delay + 300); // Retardo con un offset inicial
        });
    }

    // Anima el encabezado de la página al cargar
    animateHeader() {
        const header = document.querySelector('header');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';
            header.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    header.style.opacity = '1';
                    header.style.transform = 'translateY(0)';
                });
            }, 100);
        }
    }

    // Configura los event listeners para scroll y redimensionado, y animaciones de hover
    setupEventListeners() {
        let ticking = false; // Bandera para optimizar el evento scroll
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll(); // Llama a la función de manejo de scroll
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true }); // Usar { passive: true } para mejorar el rendimiento del scroll

        this.setupHoverAnimations(); // Configura animaciones de hover

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize(); // Llama a la función de manejo de redimensionado
        }, 250));
    }

    // Función de manejo de scroll (puede estar vacía si el observer hace todo el trabajo)
    handleScroll() {}

    // Función de manejo de redimensionado
    handleResize() {}

    // Configura animaciones de hover para botones y enlaces de navegación
    setupHoverAnimations() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.transition = 'transform 0.2s ease';
            });
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });

        const navLinks = document.querySelectorAll('.barra-navegacion a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-2px)';
                link.style.transition = 'transform 0.2s ease';
            });
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0)';
            });
        });
    }

    // Función debounce para limitar la frecuencia de ejecución de funciones (ej. en resize)
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Desconecta el observer y limpia elementos animados al destruir el controlador
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animatedElements.clear();
    }

    // Permite añadir dinámicamente elementos a observar
    addElement(selector, config) {
        const element = document.querySelector(selector);
        if (element) {
            this.prepareElement(element, config);
            this.observer.observe(element);
        }
    }
}

// Instancia global del controlador de animaciones
const animationController = new AnimationController();
window.AnimationController = animationController;


// ============================================================================================================
// Lógica de Traducción y Menú de Idiomas
// ============================================================================================================

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del menú de idioma
  const languageButton = document.getElementById('language-button');
  const languageMenu = document.getElementById('language-menu');
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  
  // Alternar la visibilidad del menú al hacer clic en el botón de idioma
  languageButton.addEventListener('click', function(e) {
    e.stopPropagation(); // Evita que el clic se propague al documento
    languageMenu.classList.toggle('show'); // Alterna la clase 'show'
  });
  
  // Cerrar el menú si se hace clic fuera de él
  document.addEventListener('click', function(e) {
    if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
      languageMenu.classList.remove('show');
    }
  });
  
  // Cerrar el menú al presionar la tecla 'Escape'
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      languageMenu.classList.remove('show');
    }
  });
  
  // Manejar la selección de idioma desde los elementos del menú
  dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault(); // Previene el comportamiento por defecto del enlace
      const selectedLang = this.getAttribute('data-lang'); // Obtiene el idioma del atributo data-lang
      
      console.log('Idioma seleccionado:', selectedLang); // Para depuración
      
      languageMenu.classList.remove('show'); // Cierra el menú
      
      changeLanguage(selectedLang); // Cambia el idioma de la página
      
      localStorage.setItem('selectedLanguage', selectedLang); // Guarda la preferencia en el almacenamiento local
    });
  });
  
  // Función principal para cambiar el idioma de todos los textos e imágenes en la página
  function changeLanguage(lang) {
    // Objeto con todas las traducciones y rutas de imagen
    const translations = {
      es: {
        // Título de la página
        pageTitle: 'Cómo Manejar el Estrés',

        // Barra superior y navegación
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',

        // Imágenes principales y de contenido
        image_main_relax: 'PAUSA_esp.webp', // Asume una versión en español
        image_facial_massage: 'masajefacial_esp.webp', // Asume una versión en español
        image_meditation: 'chicaenlanada_esp.webp', // Asume una versión en español
        image_connected_others: 'otros_son_esp.webp', // Asume una versión en español
        
        // Contenido Principal
        h1_main_title: '¿Cómo se puede manejar el estrés?',
        contenido_div1_h2: 'Aprende a Manejar el Estrés',
        contenido_div1_p: 'La Organización Mundial de la Salud (OMS) creó "Hacer lo que importa en momentos de estrés: una guía ilustrada" para ayudar a las personas a manejar el estrés mediante técnicas simples y basadas en evidencia. Esta guía de autoayuda está diseñada para cualquier persona que experimente estrés, con estrategias centrales que se pueden practicar en solo unos minutos al día. Estas incluyen arraigarse en el momento presente y hacer espacio para emociones difíciles.',
        contenido_div2_h2: 'Sigue una Rutina Diaria',
        contenido_div2_p: 'Realizar una serie de actividades cada día puede ayudarte a sentir más control sobre tu vida y ser más eficaz. Programa horarios específicos para comer, pasar tiempo con la familia, realizar tareas diarias y participar en actividades físicas o de ocio.',
        
        frase_h2: 'Consejos Sencillos para una Vida Saludable y Equilibrada',
        frase_p: 'Adoptar hábitos como dormir lo suficiente, comer bien, hacer ejercicio y mantenerse conectado socialmente puede mejorar tu bienestar físico y emocional. <br> Cuida tu cuerpo y tu mente con estos sencillos consejos diarios.',

        contenido2_1_h3: 'Duerme lo Suficiente',
        contenido2_1_p: 'El sueño es vital tanto para el cuerpo como para la mente. Dormir bien repara, relaja y revitaliza el cuerpo y ayuda a afrontar el estrés.',
        contenido2_2_h3: 'Una buena higiene del sueño incluye',
        contenido2_li_1: 'Consistencia: Acostarse y levantarse a la misma hora todos los días, incluso los fines de semana.',
        contenido2_li_2: 'Dormir en un ambiente tranquilo, oscuro y cómodo a una temperatura agradable.',
        contenido2_li_3: 'Evitar dispositivos electrónicos antes de acostarse.',
        contenido2_li_4: 'Evitar comidas pesadas o café antes de acostarse.',
        contenido2_li_5: 'Hacer ejercicio durante el día puede ayudarte a conciliar el sueño más fácilmente por la noche.',
        contenido2_3_h3: 'Mantente Conectado con Otros',
        contenido2_3_p: 'Habla con familiares y amigos sobre tus preocupaciones y sentimientos. <br> Mantenerse conectado puede ayudarte a sentirte más positivo y menos solo.',
        contenido2_4_h3: 'Lleva una Dieta Saludable',
        contenido2_4_p: 'Todo lo que comes y bebes afecta tu salud. <br> Come comidas equilibradas a intervalos regulares, mantente hidratado y trata de <br> incluir muchas frutas y verduras frescas.',
        contenido2_5_h3: 'Haz Ejercicio Regularmente',
        contenido2_5_p: 'El ejercicio diario puede ayudar a reducir el estrés, ser divertido en el tiempo libre o simplemente caminar.',
        contenido2_6_h3: 'Limita el Consumo de Noticias',
        contenido2_6_p: 'Ver o leer demasiadas noticias en la televisión o en las redes sociales puede causar estrés. Si notas que el consumo de noticias te causa estrés, limita el tiempo que le dedicas. ',
        
        // Sección de reproductor de medios
        media_player_title: 'Nuestros Podcasts',
        media_audio_title: 'Canción SoundHelix 1 (Ejemplo de Podcast)',

        // Pie de página (sin alterar en JS)
        footer_h3: 'Health\nConnectors', 
        footer_p1: 'New Elsiebury',
        footer_p2: '634 Halvorson',
        footer_p3: 'Estates Suite 039',
        footer_button: 'saber más',
        footer_links_h3: 'Enlaces',
        footer_link_home: 'Inicio',
        footer_link_pages: 'Páginas',
        footer_link_services: 'Servicios',
        footer_link_portfolio: 'Portafolio',
        footer_link_blog: 'Blog',
        footer_link_contact: 'Contacto',
        footer_link_internet: 'Internet',
        footer_link_news: 'Agencias de noticias',
        footer_link_data: 'Alternativa de datos',
        footer_link_media: 'Medios',
        footer_link_defamation: 'Difamación',
        footer_recent_posts_h3: 'Publicaciones recientes',
      },
      en: {
        // Título de la página
        pageTitle: 'How Can Stress Be Managed?',

        // Barra superior y navegación
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',

        // Imágenes principales y de contenido
        image_main_relax: 'pause.webp', 
        image_facial_massage: 'masajefacial.webp', 
        image_meditation: 'chicaenlanada.webp', 
        image_connected_others: 'others_are.webp', 
        
        // Contenido Principal
        h1_main_title: 'How Can Stress Be Managed?',
        contenido_div1_h2: 'Learn to Manage Stress',
        contenido_div1_p: 'The World Health Organization (WHO) created "Doing What Matters in Times of Stress: An Illustrated Guide" to help people manage stress through simple, evidence-based techniques. This self-help guide is designed for anyone experiencing stress, core strategies that can be practiced in just a few minutes a day. These include grounding yourself in the present moment and making space for difficult emotions.',
        contenido_div2_h2: 'Follow a Daily Routine',
        contenido_div2_p: 'Doing a series of activities each day can help you feel more in control of your life and be more effective. Schedule specific times to eat, spend time with family, do daily tasks, and engage in physical or leisure activities.',

        frase_h2: 'Simple Tips for a Healthy, Balanced Life',
        frase_p: 'Adopting habits like getting enough sleep, eating well, exercising, and staying socially connected can improve your physical and emotional well-being. <br> Take care of your body and mind with these simple daily tips.',

        contenido2_1_h3: 'Get Enough Sleep',
        contenido2_1_p: 'Sleep is vital for both the body and mind. Good sleep repairs, relaxes, and revitalizes the body and helps cope with stress.',
        contenido2_2_h3: 'Good sleep hygiene includes',
        contenido2_li_1: 'Consistency: Going to bed and waking up at the same time every day, even on weekends.',
        contenido2_li_2: 'Sleep in a quiet, dark and comfortable environment at a comfortable temperature.',
        contenido2_li_3: 'Avoid electronic devices before bedtime.',
        contenido2_li_4: 'Avoid caffeine, heavy meals, or coffee before bed.',
        contenido2_li_5: 'Exercise during the day can help you fall asleep more easily at night.',
        contenido2_3_h3: 'Stay Connected with Others',
        contenido2_3_p: 'Talk with family and friends about your concerns and feelings. <br> Staying connected can help you feel more positive and less alone.',
        contenido2_4_h3: 'Eat a Healthy Diet',
        contenido2_4_p: 'Everything you eat and drink affects your health. <br> Eat balanced meals at regular intervals, stay hydrated, and try to <br> include plenty of fresh fruits and vegetables.',
        contenido2_5_h3: 'Exercise Regularly',
        contenido2_5_p: 'Daily exercise can help reduce stress, be fun in leisure time, or simply walking.',
        contenido2_6_h3: 'Limit News Consumption',
        contenido2_6_p: 'Watching or reading too much news on TV or social media can cause stress.If you notice that news consumption causes stress, limit the time you spend on it. ',
        
        // Sección de reproductor de medios
        media_player_title: 'Our Podcasts',
        media_audio_title: 'SoundHelix Song 1 (Podcast Example)',

        // Pie de página (sin alterar en JS)
        footer_h3: 'Health\nConnectors',
        footer_p1: 'New Elsiebury',
        footer_p2: '634 Halvorson',
        footer_p3: 'Estates Suite 039',
        footer_button: 'know more',
        footer_links_h3: 'Links',
        footer_link_home: 'Home',
        footer_link_pages: 'Pages',
        footer_link_services: 'Services',
        footer_link_portfolio: 'Portfolio',
        footer_link_blog: 'Blog',
        footer_link_contact: 'Contact',
        footer_link_internet: 'Internet',
        footer_link_news: 'News agencias',
        footer_link_data: 'Data Alternative',
        footer_link_media: 'Media',
        footer_link_defamation: 'Defamation',
        footer_recent_posts_h3: 'Recent posts',
      }
    };
    
    const texts = translations[lang];
    
    if (texts) {
      // Traducir el título de la página
      document.title = texts.pageTitle;

      // Cambiar placeholder del buscador
      const searchInput = document.querySelector('.busqueda input');
      if (searchInput) {
        searchInput.placeholder = texts.searchPlaceholder;
      }
      
      // Cambiar texto de botones de la barra superior
      const registerButton = document.querySelector('.boton-registro');
      if(registerButton) registerButton.textContent = texts.registerButton;
      
      const loginButton = document.querySelector('.boton-login');
      if(loginButton) loginButton.textContent = texts.loginButton;
      
      // Cambiar navegación
      document.querySelectorAll('.barra-navegacion ul li a').forEach(link => {
        const key = link.getAttribute('data-nav-key');
        if (key && texts[key]) {
            link.textContent = texts[key];
        }
      });
      
      // Traducción de imágenes principales
// Traducción de imágenes por data-image-key
document.querySelectorAll('img[data-image-key]').forEach(img => {
  const imageKey = img.getAttribute('data-image-key');
  const imageFile = texts[imageKey];

  console.log(`🔍 Imagen para "${imageKey}":`, imageFile);  // ✅ Diagnóstico útil

  if (imageFile) {
    img.src = `/static/images/${imageFile}`;
  } else {
    console.warn(`⚠️ No se encontró imagen para "${imageKey}"`);
  }
});

      // Contenido principal (h1)
      const h1MainTitle = document.querySelector('h1[data-text-key="h1_main_title"]');
      if(h1MainTitle) h1MainTitle.textContent = texts.h1_main_title;

      // content-section div1
      const contentDiv1H2 = document.querySelector('.content-section.div1 h2[data-text-key="contenido_div1_h2"]');
      if(contentDiv1H2) contentDiv1H2.textContent = texts.contenido_div1_h2;
      const contentDiv1P = document.querySelector('.content-section.div1 p[data-text-key="contenido_div1_p"]');
      if(contentDiv1P) contentDiv1P.textContent = texts.contenido_div1_p;

      // content-section div2
      const contentDiv2H2 = document.querySelector('.content-section.div2 h2[data-text-key="contenido_div2_h2"]');
      if(contentDiv2H2) contentDiv2H2.textContent = texts.contenido_div2_h2;
      const contentDiv2P = document.querySelector('.content-section.div2 p[data-text-key="contenido_div2_p"]');
      if(contentDiv2P) contentDiv2P.textContent = texts.contenido_div2_p;

      // frase section
      const fraseH2 = document.querySelector('.frase h2[data-text-key="frase_h2"]');
      if(fraseH2) fraseH2.textContent = texts.frase_h2;
      const fraseP = document.querySelector('.frase p[data-text-key="frase_p"]');
      if(fraseP) fraseP.innerHTML = texts.frase_p; // Use innerHTML for <br>

      // contenido2 first block
      const contenido2_1_h3 = document.querySelector('.contenido2:first-of-type h3[data-text-key="contenido2_1_h3"]');
      if(contenido2_1_h3) contenido2_1_h3.textContent = texts.contenido2_1_h3;
      const contenido2_1_p = document.querySelector('.contenido2:first-of-type p[data-text-key="contenido2_1_p"]');
      if(contenido2_1_p) contenido2_1_p.textContent = texts.contenido2_1_p;

      const contenido2_2_h3 = document.querySelector('.contenido2:first-of-type h3[data-text-key="contenido2_2_h3"]');
      if(contenido2_2_h3) contenido2_2_h3.textContent = texts.contenido2_2_h3;
      const contenido2_lis = document.querySelectorAll('.contenido2:first-of-type ul li[data-text-key]');
      if(contenido2_lis[0]) contenido2_lis[0].textContent = texts.contenido2_li_1;
      if(contenido2_lis[1]) contenido2_lis[1].textContent = texts.contenido2_li_2;
      if(contenido2_lis[2]) contenido2_lis[2].textContent = texts.contenido2_li_3;
      if(contenido2_lis[3]) contenido2_lis[3].textContent = texts.contenido2_li_4;
      if(contenido2_lis[4]) contenido2_lis[4].textContent = texts.contenido2_li_5;

      const contenido2_3_h3 = document.querySelector('.contenido2:first-of-type h3[data-text-key="contenido2_3_h3"]');
      if(contenido2_3_h3) contenido2_3_h3.textContent = texts.contenido2_3_h3;
      const contenido2_3_p = document.querySelector('.contenido2:first-of-type p[data-text-key="contenido2_3_p"]');
      if(contenido2_3_p) contenido2_3_p.innerHTML = texts.contenido2_3_p; // Use innerHTML for <br>


      // contenido2 second block (after image_connected_others)
      const contenido2_second = document.querySelector('.contenido2:nth-of-type(2)');
      if(contenido2_second) {
          const h3_4 = contenido2_second.querySelector('h3[data-text-key="contenido2_4_h3"]');
          if(h3_4) h3_4.textContent = texts.contenido2_4_h3;
          const p_4 = contenido2_second.querySelector('p[data-text-key="contenido2_4_p"]');
          if(p_4) p_4.innerHTML = texts.contenido2_4_p; // Use innerHTML for <br>
          
          const h3_5 = contenido2_second.querySelector('h3[data-text-key="contenido2_5_h3"]');
          if(h3_5) h3_5.textContent = texts.contenido2_5_h3;
          const p_5 = contenido2_second.querySelector('p[data-text-key="contenido2_5_p"]');
          if(p_5) p_5.textContent = texts.contenido2_5_p;

          const h3_6 = contenido2_second.querySelector('h3[data-text-key="contenido2_6_h3"]');
          if(h3_6) h3_6.textContent = texts.contenido2_6_h3;
          const p_6 = contenido2_second.querySelector('p[data-text-key="contenido2_6_p"]');
          if(p_6) p_6.textContent = texts.contenido2_6_p;
      }

      // Sección de reproductor de medios
      const mediaPlayerTitle = document.querySelector('.media-player-section h2[data-text-key="media_player_title"]');
      if (mediaPlayerTitle) mediaPlayerTitle.textContent = texts.media_player_title;
      
      const mediaAudioTitle = document.querySelector('.media-player-section .media-title h3[data-text-key="media_audio_title"]');
      if (mediaAudioTitle) mediaAudioTitle.textContent = texts.media_audio_title;
      
      
document.querySelectorAll('[data-text-key]').forEach(el => {
  const key = el.getAttribute('data-text-key');
  if (texts[key]) {
    // Si contiene saltos de línea o etiquetas HTML, usa innerHTML
    if (texts[key].includes('<br>') || texts[key].includes('<span') || texts[key].includes('</')) {
      el.innerHTML = texts[key];
    } else {
      el.textContent = texts[key];
    }
  }
});

      // Pie de página (no se altera en JS)
      const footerColumns = document.querySelectorAll('.main-footer .footer-column');
      if (footerColumns[0]) {
        const footerH3 = footerColumns[0].querySelector('h3[data-text-key="footer_h3"]');
        if(footerH3) footerH3.innerHTML = texts.footer_h3.replace('\n', '<br>');
        
        const footerP = footerColumns[0].querySelectorAll('p[data-text-key]'); // Selecciona todos los <p> con data-text-key
        if (footerP[0]) footerP[0].textContent = texts.footer_p1;
        if (footerP[1]) footerP[1].textContent = texts.footer_p2;
        if (footerP[2]) footerP[2].textContent = texts.footer_p3;
        
        const socialButton = footerColumns[0].querySelector('button[data-text-key="footer_button"]');
        if (socialButton) socialButton.textContent = texts.footer_button;
      }

      if (footerColumns[1]) {
        const linksH3 = footerColumns[1].querySelector('h3[data-text-key="footer_links_h3"]');
        if(linksH3) linksH3.textContent = texts.footer_links_h3;
        
        const links = footerColumns[1].querySelectorAll('.footer-links li a[data-text-key]');
        if(links[0]) links[0].textContent = texts.footer_link_home;
        if(links[1]) links[1].textContent = texts.footer_link_pages;
        if(links[2]) links[2].textContent = texts.footer_link_services;
        if(links[3]) links[3].textContent = texts.footer_link_portfolio;
        if(links[4]) links[4].textContent = texts.footer_link_blog;
        if(links[5]) links[5].textContent = texts.footer_link_contact;
      }
      
      if (footerColumns[2]) {
        const links = footerColumns[2].querySelectorAll('.footer-links li a[data-text-key]');
        if(links[0]) links[0].textContent = texts.footer_link_internet;
        if(links[1]) links[1].textContent = texts.footer_link_news;
        if(links[2]) links[2].textContent = texts.footer_link_data;
        if(links[3]) links[3].textContent = texts.footer_link_media;
        if(links[4]) links[4].textContent = texts.footer_link_defamation;
      }

      if (footerColumns[3]) {
        const recentPostsH3 = footerColumns[3].querySelector('h3[data-text-key="footer_recent_posts_h3"]');
        if(recentPostsH3) recentPostsH3.textContent = texts.footer_recent_posts_h3;
      }


      // Cambiar el atributo lang del documento
      document.documentElement.lang = lang;
      
      // Opcional: Mostrar notificación de cambio
      showLanguageChangeNotification(lang);
    }
  }
  
  // Función para mostrar notificación (opcional)
  function showLanguageChangeNotification(lang) {
    const messages = {
      es: 'Idioma cambiado a Español',
      en: 'Language changed to English'
    };
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.textContent = messages[lang];
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 10px 20px;
      border-radius: 4px;
      font-family: 'Poppins', sans-serif;
      font-size: 14px;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);
    
    // Ocultar y eliminar notificación después de 3 segundos
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Lógica del reproductor de audio 
  const audio = document.getElementById('myAudio');
  if (audio) { // Asegurarse de que el elemento de audio existe
      const playPauseBtn = document.querySelector('.play-pause-btn');
      const playIcon = playPauseBtn.querySelector('.fa-play');
      const pauseIcon = document.createElement('i');
      pauseIcon.classList.add('fas', 'fa-pause');

      const progressBar = document.querySelector('.progress-bar');
      const currentTimeSpan = document.querySelector('.current-time');
      const durationSpan = document.querySelector('.duration');

      const volumeBtn = document.querySelector('.volume-btn');
      const volumeBar = document.querySelector('.volume-bar');

      let isDraggingProgressBar = false;

      function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      }

      playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
          audio.play();
          playPauseBtn.innerHTML = '';
          playPauseBtn.appendChild(pauseIcon);
        } else {
          audio.pause();
          playPauseBtn.innerHTML = '';
          playPauseBtn.appendChild(playIcon);
        }
      });

      audio.addEventListener('timeupdate', () => {
        if (!isDraggingProgressBar) {
          const progress = (audio.currentTime / audio.duration) * 100;
          progressBar.value = progress;
          currentTimeSpan.textContent = formatTime(audio.currentTime);
        }
      });

      audio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audio.duration);
        volumeBar.value = audio.volume * 100;
      });

      audio.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '';
        playPauseBtn.appendChild(playIcon);
        audio.currentTime = 0;
        progressBar.value = 0;
        currentTimeSpan.textContent = formatTime(0);
      });

      progressBar.addEventListener('mousedown', () => {
        isDraggingProgressBar = true;
      });

      progressBar.addEventListener('mouseup', () => {
        isDraggingProgressBar = false;
        const seekTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
      });

      progressBar.addEventListener('input', () => {
        if (isDraggingProgressBar) {
          currentTimeSpan.textContent = formatTime((progressBar.value / 100) * audio.duration);
        }
      });

      volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100;
        updateVolumeIcon();
      });

      volumeBtn.addEventListener('click', () => {
        if (audio.muted) {
          audio.muted = false;
          volumeBar.value = audio.volume * 100;
        } else {
          audio.muted = true;
          volumeBar.value = 0;
        }
        updateVolumeIcon();
      });

      function updateVolumeIcon() {
        if (audio.muted || audio.volume === 0) {
          volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (audio.volume < 0.5) {
          volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
          volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
      }

      updateVolumeIcon();
  }
  
  // Cargar idioma guardado al inicializar
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    changeLanguage(savedLanguage);
  } else {
    // Detectar idioma del navegador si no hay preferencia guardada
    const browserLang = navigator.language || navigator.userLanguage;
    const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
    changeLanguage(detectedLang);
  }
});
