// ============================================================================================================
// Clase AnimationController: Gestiona las animaciones de elementos al hacer scroll y hover
// (Unificado de tercerapaginaa.js y otras animaciones)
// ============================================================================================================
class AnimationController {
    constructor() {
        this.animatedElements = new Set(); // Stores already animated elements to prevent re-animation
        this.observer = null; // Intersection observer to detect elements in view
        this.init(); // Initializes configuration
    }

    // Initializes the controller, waiting for the DOM to be fully loaded
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    // Sets up the Intersection Observer, prepares elements, and listeners
    setup() {
        this.setupIntersectionObserver();
        this.prepareElements();
        this.setupEventListeners();
        this.animateHeader(); // Animates the header on page load
    }

    // Sets up the Intersection Observer to detect when elements enter the view
    setupIntersectionObserver() {
        const options = {
            root: null, // The viewport is the root element
            rootMargin: '0px 0px -10% 0px', // A bottom margin so the animation triggers slightly before the element is fully visible
            threshold: [0.1, 0.3, 0.5] // Triggers the callback when 10%, 30%, or 50% of the element is visible
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the element is intersecting and hasn't been animated yet
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target); // Animate the element
                    this.animatedElements.add(entry.target); // Add to animated elements
                }
            });
        }, options);
    }

    // Prepares elements for animation, setting their initial styles and observing them
    prepareElements() {
        // Configuration of elements to animate
        const elementsConfig = [
            // Selectors for tercerapagina.html (maintained)
            { selector: 'h1[data-text-key="pageTitle"]', animation: 'fadeIn', direction: 'up', distance: 30 }, // This is the general h1
            { selector: '.about-section', animation: 'custom', direction: 'stagger' },
            { selector: '.mission-section', animation: 'custom', direction: 'stagger' },
            { selector: '.purpose-section:first-of-type', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: 'img[data-image-key="image_privacy"]', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.purpose-section:nth-of-type(2)', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.teams-section', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.media-player-section', animation: 'fadeInUp', direction: 'up', distance: 40 }, // Media player section
            { selector: '.main-footer', animation: 'fadeInUp', direction: 'up', distance: 40 },
            // Selectors for segundapaginaa.html (added/updated)
            { selector: '.parte_principal h2', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.b4who_we_are1:nth-of-type(1)', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.imagen_de_repuesto', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.b4who_we_are1:nth-of-type(2)', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: 'img[data-image-key="who_we_are_image"]', animation: 'fadeIn', direction: 'up', distance: 30 },
            { selector: '.b4who_we_are1:nth-of-type(3)', animation: 'fadeInUp', direction: 'up', distance: 40 },
            { selector: '.contactar_a_un_doctor', animation: 'fadeInUp', direction: 'up', distance: 40 }
        ];

        elementsConfig.forEach(config => {
            const element = document.querySelector(config.selector);
            if (element) {
                this.prepareElement(element, config); // Prepares the initial style of the element
                this.observer.observe(element); // Starts observing the element
            }
        });
    }

    // Sets initial opacity and transform styles for an element
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
                this.prepareStaggerElement(element); // Prepares children for staggered animation
                break;
            default:
                element.style.transform = `translateY(${config.distance || 20}px)`;
        }
    }

    // Prepares child elements for a staggered animation
    prepareStaggerElement(element) {
        // Selects all text elements and images within the container
        const children = element.querySelectorAll('h1, h2, h3, p, ul, ol, li, img, .team-card'); // Includes team-card
        children.forEach((child, index) => {
            child.style.opacity = '0'; // Initially hidden
            // Applies initial transformations for entry effects
            if (child.tagName === 'IMG' || child.classList.contains('team-card')) {
                child.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)'; // Images and team cards
            } else {
                child.style.transform = 'translateY(20px)'; // Text
            }
            child.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            child.dataset.staggerIndex = index; // Stores the index for delay
        });
    }

    // Animates an element depending on its animation type
    animateElement(element) {
        const animationType = element.dataset.animationType;
        if (animationType === 'custom') {
            this.animateStaggerElement(element);
        } else {
            this.animateStandardElement(element);
        }
        // animateListItems is not called here, as there are no lists that need specific stagger in the main observed containers
    }

    // Animates an element with a standard transition (fade in and translate)
    animateStandardElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)'; // Returns to original position
            if (element.dataset.animationType && element.dataset.animationType.includes('animate__')) {
                element.classList.add('animate__animated', element.dataset.animationType);
            }
        });
    }

    // Animates child elements in a staggered manner
    animateStaggerElement(element) {
        element.style.opacity = '1'; // Ensures the main container is visible
        const children = element.querySelectorAll('[data-stagger-index]');
        children.forEach((child, index) => {
            setTimeout(() => {
                requestAnimationFrame(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateX(0)'; // Returns to original position
                });
            }, index * 150); // Staggered delay
        });
    }

    // Animates list items (ol, ul) in a staggered manner
    // Maintained in case lists are added to observed elements
    animateListItems(element) {
        const olItems = element.querySelectorAll('ol li');
        if (olItems.length > 0 && !element.hasAttribute('data-ol-animated')) {
            element.setAttribute('data-ol-animated', 'true');
            this.staggerAnimate(olItems, 200, 'translateX(-20px)');
        }

        const ulItems = element.querySelectorAll('ul li');
        if (ulItems.length > 0 && !element.hasAttribute('data-ul-animated')) {
            element.setAttribute('data-ul-animated', 'true');
            this.staggerAnimate(ulItems, 150, 'translateY(20px)');
        }
    }

    // Generic function for staggered animation of list items
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
            }, index * delay + 300); // Delay with an initial offset
        });
    }

    // Animates the page header on load
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

    // Sets up event listeners for scroll and resize, and hover animations
    setupEventListeners() {
        let ticking = false; // Flag to optimize scroll event
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // this.handleScroll(); // Not necessary if observer handles everything
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        this.setupHoverAnimations();

        window.addEventListener('resize', this.debounce(() => {
            // this.handleResize(); // Not necessary if no animation resize logic
        }, 250));
    }

    // Sets up hover animations for buttons and navigation links
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
            // This is for the button bounce effect
            button.addEventListener('click', () => {
                button.classList.add('click-bounce');
                setTimeout(() => {
                    button.classList.remove('click-bounce');
                }, 300);
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

        // Functionality for team cards (with flip effect)
        document.querySelectorAll('.team-card').forEach(card => {
            // Ensure the inner card is the one that rotates
            const cardInner = card.querySelector('.card-inner');
            if (cardInner) {
                card.addEventListener('mouseenter', () => {
                    cardInner.style.transform = 'rotateY(180deg)';
                });
                card.addEventListener('mouseleave', () => {
                    cardInner.style.transform = 'rotateY(0deg)';
                });
            }
        });
    }

    // Debounce function to limit the execution frequency of functions (e.g., on resize)
    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Disconnects the observer and clears animated elements when the controller is destroyed
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animatedElements.clear();
    }

    // Allows dynamically adding elements to observe
    addElement(selector, config) {
        const element = document.querySelector(selector);
        if (element) {
            this.prepareElement(element, config);
            this.observer.observe(element);
        }
    }
}

// Global instance of the animation controller
const animationController = new AnimationController();
window.AnimationController = animationController;


// ============================================================================================================
// Translation Logic and Language Menu
// ============================================================================================================

document.addEventListener('DOMContentLoaded', function() {
  const languageDropdownDiv = document.querySelector('.language-dropdown');
  let languageButton = null;
  let languageMenu = null;
  let dropdownItems = null;

  // Checks if the dropdown container exists before trying to access its children
  if (languageDropdownDiv) {
      languageButton = languageDropdownDiv.querySelector('.boton-idioma');
      languageMenu = languageDropdownDiv.querySelector('.dropdown-menu');
      dropdownItems = languageDropdownDiv.querySelectorAll('.dropdown-item');

      // Only if all necessary elements exist, add event listeners
      if (languageButton && languageMenu && dropdownItems.length > 0) {
          languageButton.addEventListener('click', function(e) {
              e.stopPropagation(); // Prevents the click from propagating to the document
              languageMenu.classList.toggle('show'); // Toggles the 'show' class
          });
          
          // Close menu when clicking outside the dropdown
          document.addEventListener('click', function(e) {
              if (!languageDropdownDiv.contains(e.target)) { // Uses the main dropdown container
                  languageMenu.classList.remove('show');
              }
          });
          
          // Close menu when pressing Escape
          document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                  languageMenu.classList.remove('show');
              }
          });
          
          // Handle language selection
          dropdownItems.forEach(item => {
              item.addEventListener('click', function(e) {
                  e.preventDefault(); // Prevents default link behavior
                  const selectedLang = this.getAttribute('data-lang');
                  
                  console.log('Selected language:', selectedLang); // For debugging
                  
                  languageMenu.classList.remove('show'); // Close the menu
                  
                  changeLanguage(selectedLang); // Change page language
                  
                  localStorage.setItem('selectedLanguage', selectedLang); // Save preference
              });
          });
      } else {
          console.warn("Language dropdown elements not found, translation functionality will not be fully initialized.");
      }
  }


  function changeLanguage(lang) {
    const translations = {
      es: {
        // Page Title
        pageTitle: 'Health Connectors',
        
        // Top bar and navigation
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',
        profileLink: 'Perfil',
        logoutLink: 'Cerrar sesión',

        // Main content (segundapaginaa.html specific)
        main_functionalities_image: 'functions_encabezado_esp.webp',
        main_title_h2: 'UNA NUEVA FORMA DE EVITAR PROBLEMAS AL ORGANIZAR <br> ',
        main_title_span: 'TU CITA',
        what_you_can_do_h2: 'Qué puedes hacer en el sitio web de Health <br> Connectors',
        what_you_can_do_p1: 'En el sitio web de Health Connectors, puedes reservar fácilmente citas médicas con tu médico de confianza o encontrar al especialista adecuado según tus necesidades. La plataforma te permite buscar y comparar profesionales de la salud por ubicación, especialidad o reseñas de pacientes. Además de programar visitas, puedes explorar la sección de la Revista, que ofrece consejos de salud fiables y artículos verificados por organizaciones de salud reconocidas.',
        what_you_can_do_p2: 'Health Connectors está diseñado para que la gestión de tu atención médica sea sencilla, cómoda e informada, todo en un solo lugar.',
        placeholder_image: 'imagenderepuesto.png',

        benefits_patients_h2: 'Beneficios para pacientes',
        benefits_patients_li1: 'Reserva fácil de citas: Programa de forma rápida y sencilla tus citas médicas online. Ya sea que quieras reservar una visita con tu médico de confianza o necesites encontrar un especialista disponible según tus síntomas o necesidades, nuestro sistema intuitivo te permite programar citas en solo unos clics, sin complicaciones ni formularios largos.',
        benefits_patients_li2: 'Información de salud fiable: Mantente informado con artículos, consejos y recursos de salud confiables. Nuestra sección de la Revista presenta contenido revisado y aprobado por organizaciones médicas respetadas, cubriendo una amplia gama de temas como la prevención de enfermedades, nutrición, bienestar mental y consejos de salud cotidianos.',
        benefits_patients_li3: 'Ahorro de tiempo: Evita las llamadas telefónicas y los largos tiempos de espera. Gestiona todas tus citas en un solo lugar: consulta la disponibilidad del médico, reprograma cuando sea necesario y recibe recordatorios directamente en tu dispositivo. Es una atención médica eficiente y sin estrés.',
        benefits_patients_li4: 'Búsqueda conveniente: Encuentra al profesional de la salud adecuado rápidamente. Utiliza filtros para buscar por especialidad, ubicación, disponibilidad y otros criterios importantes para asegurarte de que te estás conectando con el proveedor adecuado para tus necesidades específicas.',
        who_we_are_image: 'functions_dos_esp.webp',

        benefits_doctors_h2: 'Beneficios para doctores',
        benefits_doctors_li1: 'Mayor visibilidad: Amplía tu alcance y atrae a más pacientes que buscan activamente atención médica online. Ser destacado en una plataforma de confianza te pone frente a personas que realmente necesitan tus servicios en el momento adecuado.',
        benefits_doctors_li2: 'Presencia profesional: Muestra tu perfil completo con una presentación pulcra que destaque tus especialidades, credenciales y experiencia profesional. Un perfil bien elaborado genera confianza en los pacientes potenciales y te diferencia de otros proveedores de atención médica.',
        benefits_doctors_li3: 'Conexión directa con el paciente: Simplifica la comunicación y la gestión de citas con herramientas integradas que permiten recordatorios de citas, mensajes rápidos y seguimientos sin interrupciones, facilitando la conexión con tus pacientes y mejorando su experiencia.',
        benefits_doctors_li4: 'Mejora del compromiso del paciente: Fomenta relaciones más sólidas al proporcionar a los pacientes recursos educativos, consejos de salud personalizados y fácil acceso a su historial de citas y notas médicas. Los pacientes comprometidos son más propensos a seguir los planes de tratamiento y sentirse seguros en su recorrido de atención médica, lo que lleva a mejores resultados y una mayor satisfacción.',

        contact_doctor_h2: '¿Quieres <br>',
        contact_doctor_span: 'contactar a un doctor?',
        contact_doctor_p: 'Para cualquier consulta, comentario o sugerencia, no dudes en contactarnos directamente por correo electrónico. Esperamos tener noticias tuyas.',
        find_doctor_contact_button: 'Encontrar un doctor',
        contact_doctor_image: 'imagen-mujer-medica-profesional-clipboard-escribiendo-escuchando-paciente-cita-clinica-hospital-pie-sobre-fondo-turquesa.webp',

        // Main content (tercerapagina.html specific, maintained for other pages)
        about_tag_1: 'Cariñoso',
        about_tag_2: 'Accesible',
        about_tag_3: 'Empoderador',
        about_h2: 'Acerca de Nuestra Empresa e Historia',
        about_p1: 'En Health Connectors, somos un sitio web desarrollado por el equipo Gürteltier, dedicado a mejorar el acceso a servicios de atención médica de calidad. Nuestro equipo está formado por profesionales de campos como la tecnología, la atención médica y la gestión, trabajando juntos para crear una plataforma innovadora que conecta a pacientes, proveedores y empresas en el sector de la salud.',
        about_p2: 'Nuestro objetivo es simplificar el proceso de búsqueda de atención médica, haciéndola más accesible y eficiente para los usuarios al mismo tiempo que promovemos el bienestar de las comunidades a las que servimos. Al aprovechar la tecnología de vanguardia, nos aseguramos de que las soluciones de salud estén al alcance de todos.',
        image_appointment: 'appoitment_es.webp',

        mission_h2: 'Nuestra misión',
        mission_p1: 'Nuestra misión es revolucionar el acceso a la atención médica creando un ecosistema digital donde pacientes, profesionales de la salud e instituciones estén conectados sin problemas. Nos comprometemos a eliminar las barreras a la atención —como ineficiencias, falta de coordinación y acceso limitado— a través de una plataforma segura, intuitiva e inclusiva.',
        mission_p2: 'Al empoderar a las personas para que gestionen su salud y apoyar a los proveedores con herramientas inteligentes, nuestro objetivo es construir una experiencia de atención médica que sea eficiente, centrada en el ser humano y enfocada en mejorar el bienestar de cada comunidad a la que servimos.',
        image_mission: 'chica_verde_es.webp',

        purpose_h2: 'Nuestro propósito principal',
        purpose_p1: 'En Health Connectors, nos enfocamos principalmente en facilitar que las personas organicen citas médicas desde la comodidad de sus hogares. A través de nuestra plataforma, los usuarios pueden conectarse con proveedores de atención médica, programar consultas y gestionar sus citas médicas de manera eficiente.',
        purpose_p2: 'Además, ofrecemos una gama de recursos relacionados con la salud, como consejos de bienestar y orientación, para apoyar a los usuarios en el mantenimiento de su salud general. Al simplificar el proceso de citas y proporcionar información valiosa sobre la salud, garantizamos que el acceso a la atención sea conveniente y completo, mejorando la experiencia general de atención médica.',
        
        image_privacy: 'your_privacy_es.webp',

        groups_h2: 'Descubre más sobre nuestros grupos de trabajo',
        groups_p: 'En Health Connectors, nuestro trabajo es impulsado por cuatro equipos especializados que colaboran para construir una experiencia de atención médica fluida:',

        // Team names and members - Images and text
        team_bg_design: 'morasporsiacaso_es.webp',
        team_title_design: 'letter_design_es.webp',
        team_names_design: 'about_design_nombres_es.webp',
        
        team_bg_htmlcss: 'cerezas_es.webp',
        team_title_htmlcss: 'css_letter_es.webp',
        team_names_htmlcss: 'about_html_nombres_es.webp',
        
        team_bg_javascript: 'moritas_es.webp',
        team_title_javascript: 'java_letras_es.webp',
        team_names_javascript: 'about_java_nombres_es.webp',
        
        team_bg_database: 'fresita_es.webp',
        team_title_database: 'base_letter_es.webp',
        team_names_database: 'about_database_nombres_es.webp',
        
        // Media player section
        media_player_title: 'Nuestros Podcasts',
        media_audio_title: 'Canción SoundHelix 1 (Ejemplo de Podcast)',


        // Footer
        footer_h3: 'Health<br>Connectors', 
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
        footer_link_privacy: 'Políticas de privacidad',
        footer_link_terms: 'Términos de uso',
        footer_link_signup: 'Registrarse',
        footer_link_login: 'Iniciar sesión',
        footer_link_defamation: 'Difamación',
        footer_recent_posts_h3: 'Publicaciones recientes',
        recent_post_sleep: 'Beneficios del sueño para la salud',
        recent_post_exercise: 'Beneficios del ejercicio',
        recent_post_stress: 'Manejo del estrés',
        recent_post_preventive_care: 'La importancia de la atención preventiva.',
      },
      en: {
        // Page Title
        pageTitle: 'Health Connectors',
        
        // Top bar and navigation
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Functions and Benefits',
        aboutNav: 'About us',
        blogNav: 'Blog',
        profileLink: 'Profile',
        logoutLink: 'Logout',

        // Main content (segundapaginaa.html specific)
        main_functionalities_image: 'funcionalidades_principal.webp',
        main_title_h2: 'A NEW WAY TO AVOID ANY PROBLEMS FOR ARRANGING <br> ',
        main_title_span: 'YOUR APPOINTMENT',
        what_you_can_do_h2: 'What you can do in Health <br> Connectors website',
        what_you_can_do_p1: 'On the Health Connectors website, you can easily book medical appointments with your trusted doctor or find the right specialist based on your needs. The platform allows you to search and compare healthcare professionals by location, specialty, or patient reviews. In addition to scheduling visits, you can explore the Journal section, which offers reliable health tips and articles verified by reputable health organizations.',
        what_you_can_do_p2: 'Health Connectors is designed to make managing your healthcare simple, convenient, and informed — all in one place.',
        placeholder_image: 'imagenderepuesto.png',

        benefits_patients_h2: 'Benefits for patients',
        benefits_patients_li1: 'Easy Appointment Booking: Quickly and easily schedule your medical appointments online. Whether you want to book a visit with your trusted doctor or need to find an available specialist based on your symptoms or needs, our intuitive system lets you set appointments in just a few clicks—no hassle, no long forms.',
        benefits_patients_li2: 'Reliable Health Information: Stay informed with trustworthy articles, tips, and health resources. Our Journal section features content reviewed and approved by respected medical organizations, covering a wide range of topics like disease prevention, nutrition, mental wellness, and everyday health advice.',
        benefits_patients_li3: 'Time-Saving: Skip the phone calls and long wait times. Manage all your appointments in one place—check doctor availability, reschedule when needed, and receive reminders directly to your device. It’s healthcare made efficient and stress-free.',
        benefits_patients_li4: 'Convenient Search: Find the right healthcare professional quickly. Use filters to search by specialty, location, availability, and other important criteria to ensure you\'re connecting with the right provider for your specific needs.',
        who_we_are_image: 'who_weare.webp',

        benefits_doctors_h2: 'Benefits for doctors',
        benefits_doctors_li1: 'Increased Visibility: Expand your reach and attract more patients who are actively searching for medical care online. Being featured on a trusted platform puts you in front of people who genuinely need your services at the right time.',
        benefits_doctors_li2: 'Professional Presence: Showcase your complete profile with a polished presentation that highlights your specialties, credentials, and professional experience. A well-crafted profile builds trust with potential patients and sets you apart from other healthcare providers.',
        benefits_doctors_li3: 'Direct Patient Connection: Simplify communication and appointment management with built-in tools that allow for appointment reminders, quick messaging, and seamless follow-ups—making it easier to stay connected with your patients and improve their experience.',
        benefits_doctors_li4: 'Enhanced Patient Engagement: Foster stronger relationships by providing patients with educational resources, personalized health tips, and easy access to their appointment history and medical notes. Engaged patients are more likely to follow treatment plans and feel confident in their healthcare journey, leading to better outcomes and higher satisfaction.',

        contact_doctor_h2: 'Do you want to <br>',
        contact_doctor_span: 'contact a doctor?',
        contact_doctor_p: 'For any inquiries, feedback, or comments, please feel free to contact us directly via email. We look forward to hearing from you.',
        find_doctor_contact_button: 'Find a doctor',
        contact_doctor_image: 'imagen-mujer-medica-profesional-clipboard-escribiendo-escuchando-paciente-cita-clinica-hospital-pie-sobre-fondo-turquesa.webp',

        // Main content (tercerapagina.html specific, maintained for other pages)
        about_tag_1: 'Caring',
        about_tag_2: 'Accessible',
        about_tag_3: 'Empowering',
        about_h2: 'About Our Company and History',
        about_p1: 'At Health Connectors, we are a website developed by the Gürteltier team, dedicated to improving access to quality healthcare services. Our team consists of professionals from fields such as technology, healthcare, and management, working together to create an innovative platform that connects patients, providers, and businesses in the healthcare sector.',
        about_p2: 'We aim to simplify the process of finding medical care, making it more accessible and efficient for users while promoting the well-being of the communities we serve. By leveraging cutting-edge technology, we ensure that health solutions are within reach for everyone.',
        image_appointment: 'appoitment.webp',

        mission_h2: 'Our mission',
        mission_p1: 'Our mission is to revolutionize access to healthcare by creating a digital ecosystem where patients, healthcare professionals, and institutions are seamlessly connected. We are committed to eliminating barriers to care—such as inefficiencies, lack of coordination, and limited access—through a secure, intuitive, and inclusive platform.',
        mission_p2: 'By empowering individuals to manage their health and supporting providers with smart tools, we aim to build a healthcare experience that is efficient, human-centered, and focused on improving the well-being of every community we serve.',
        image_mission: 'chica_verde.webp',

        purpose_h2: 'Our principal purpose',
        purpose_p1: 'At Health Connectors, we primarily focus on making it easy for individuals to organize medical appointments from the comfort of their homes. Through our platform, users can connect with healthcare providers, schedule consultations, and manage their medical appointments efficiently.',
        purpose_p2: 'Additionally, we offer a range of health-related resources, such as wellness tips and guidance, to support users in maintaining their overall health. By streamlining the appointment process and providing valuable health information, we ensure that access to care is both convenient and comprehensive, enhancing the overall healthcare experience.',
        
        image_privacy: 'your_privacy.webp',

        groups_h2: 'Discover more about our work groups',
        groups_p: 'At Health Connectors, our work is driven by four specialized teams that collaborate to build a seamless healthcare experience:',

        // Team names and members - Images and text
        team_bg_design: 'morasporsiacaso.webp',
        team_title_design: 'letter_design.webp',
        team_names_design: 'about_design_nombres.webp',
        
        team_bg_htmlcss: 'cerezas.webp',
        team_title_htmlcss: 'css_letter.webp',
        team_names_htmlcss: 'about_html_nombres.webp',
        
        team_bg_javascript: 'moritas.webp',
        team_title_javascript: 'java_letras.webp',
        team_names_javascript: 'about_java_nombres.webp',
        
        team_bg_database: 'fresita.webp',
        team_title_database: 'base_letter.webp',
        team_names_database: 'about_database_nombres.webp',

        // Footer
        footer_h3: 'Health<br />Connectors',
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
        footer_link_privacy: 'Privacy policies',
        footer_link_terms: 'Terms of use',
        footer_link_signup: 'Sign up',
        footer_link_login: 'Login',
        footer_link_defamation: 'Defamation',
        footer_recent_posts_h3: 'Recent posts',
        recent_post_sleep: 'Health Benefits of Sleep',
        recent_post_exercise: 'Benefits of Excercise',
        recent_post_stress: 'Stress Management',
        recent_post_preventive_care: 'The importance of preventive care.',
      }
    };
    
    const texts = translations[lang];
    
    if (texts) {
      // Translate page title
      const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
      if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;

      // Change search placeholder
      const searchInput = document.querySelector('input[data-text-key="searchPlaceholder"]');
      if (searchInput) searchInput.placeholder = texts.searchPlaceholder;

      // Handle login/register buttons or "My Account" dropdown
      const registerButton = document.querySelector('button[data-text-key="registerButton"]');
      if (registerButton) registerButton.textContent = texts.registerButton;

      const loginButton = document.querySelector('button[data-text-key="loginButton"]');
      if (loginButton) loginButton.textContent = texts.loginButton;

      const myAccountButton = document.querySelector('button[data-text-key="myAccountButton"]');
      if (myAccountButton) myAccountButton.textContent = texts.myAccountButton;

      const profileLink = document.querySelector('a[data-text-key="profileLink"]');
      if (profileLink) profileLink.textContent = texts.profileLink;

      const logoutLink = document.querySelector('a[data-text-key="logoutLink"]');
      if (logoutLink) logoutLink.textContent = texts.logoutLink;

      // Main navigation
      document.querySelectorAll('nav ul li a[data-nav-key]').forEach(link => {
          const key = link.getAttribute('data-nav-key');
          if (key && texts[key]) link.textContent = texts[key];
      });

      // --- Content specific to segundapaginaa.html ---
      const mainFunctionalitiesImage = document.querySelector('img[data-image-key="main_functionalities_image"]');
      if (mainFunctionalitiesImage) mainFunctionalitiesImage.src = `/static/images/${texts.main_functionalities_image}`;

      const mainTitleH2 = document.querySelector('h2[data-text-key="main_title_h2"]');
      if (mainTitleH2) mainTitleH2.innerHTML = texts.main_title_h2 + `<span data-text-key="main_title_span">${texts.main_title_span}</span>`;
      
      const whatYouCanDoH2 = document.querySelector('h2[data-text-key="what_you_can_do_h2"]');
      if (whatYouCanDoH2) whatYouCanDoH2.innerHTML = texts.what_you_can_do_h2;

      const whatYouCanDoP1 = document.querySelector('p[data-text-key="what_you_can_do_p1"]');
      if (whatYouCanDoP1) whatYouCanDoP1.textContent = texts.what_you_can_do_p1;

      const whatYouCanDoP2 = document.querySelector('p[data-text-key="what_you_can_do_p2"]');
      if (whatYouCanDoP2) whatYouCanDoP2.textContent = texts.what_you_can_do_p2;

      const placeholderImage = document.querySelector('img[data-image-key="placeholder_image"]');
      if (placeholderImage) placeholderImage.src = `/static/images/${texts.placeholder_image}`;

      const benefitsPatientsH2 = document.querySelector('h2[data-text-key="benefits_patients_h2"]');
      if (benefitsPatientsH2) benefitsPatientsH2.textContent = texts.benefits_patients_h2;
      document.querySelectorAll('li[data-text-key^="benefits_patients_li"]').forEach(li => {
          const key = li.getAttribute('data-text-key');
          if (key && texts[key]) li.textContent = texts[key];
      });

      const whoWeAreImage = document.querySelector('img[data-image-key="who_we_are_image"]');
      if (whoWeAreImage) whoWeAreImage.src = `/static/images/${texts.who_we_are_image}`;

      const benefitsDoctorsH2 = document.querySelector('h2[data-text-key="benefits_doctors_h2"]');
      if (benefitsDoctorsH2) benefitsDoctorsH2.textContent = texts.benefits_doctors_h2;
      document.querySelectorAll('li[data-text-key^="benefits_doctors_li"]').forEach(li => {
          const key = li.getAttribute('data-text-key');
          if (key && texts[key]) li.textContent = texts[key];
      });

      const contactDoctorH2 = document.querySelector('h2[data-text-key="contact_doctor_h2"]');
      if (contactDoctorH2) {
        contactDoctorH2.innerHTML = texts.contact_doctor_h2 + `<span data-text-key="contact_doctor_span">${texts.contact_doctor_span}</span>`;
      }
      
      const contactDoctorP = document.querySelector('p[data-text-key="contact_doctor_p"]');
      if (contactDoctorP) contactDoctorP.textContent = texts.contact_doctor_p;
      
      const findDoctorContactButton = document.querySelector('button[data-text-key="find_doctor_contact_button"]');
      if (findDoctorContactButton) findDoctorContactButton.textContent = texts.find_doctor_contact_button;

      const contactDoctorImage = document.querySelector('img[data-image-key="contact_doctor_image"]');
      if (contactDoctorImage) contactDoctorImage.src = `/static/images/${texts.contact_doctor_image}`;

      // --- End content specific to segundapaginaa.html ---


      // Main content: about-section (for tercerapagina.html, maintained for completeness)
      document.querySelectorAll('.about-section .tags span[data-text-key]').forEach(span => {
          const key = span.getAttribute('data-text-key');
          if (key && texts[key]) span.textContent = texts[key];
      });
      const aboutH2 = document.querySelector('h2[data-text-key="about_h2"]');
      if (aboutH2) aboutH2.innerHTML = texts.about_h2;
      const aboutP1 = document.querySelector('p[data-text-key="about_p1"]');
      if (aboutP1) aboutP1.textContent = texts.about_p1;
      const aboutP2 = document.querySelector('p[data-text-key="about_p2"]');
      if (aboutP2) aboutP2.textContent = texts.about_p2;
      const imageAppointment = document.querySelector('img[data-image-key="image_appointment"]');
      if (imageAppointment) imageAppointment.src = `/static/images/${texts.image_appointment}`;


      // Main content: mission-section (for tercerapagina.html, maintained for completeness)
      const missionH2 = document.querySelector('h2[data-text-key="mission_h2"]');
      if (missionH2) missionH2.textContent = texts.mission_h2;
      const missionP1 = document.querySelector('p[data-text-key="mission_p1"]');
      if (missionP1) missionP1.textContent = texts.mission_p1;
      const missionP2 = document.querySelector('p[data-text-key="mission_p2"]');
      if (missionP2) missionP2.textContent = texts.mission_p2;
      const imageMission = document.querySelector('img[data-image-key="image_mission"]');
      if (imageMission) imageMission.src = `/static/images/${texts.image_mission}`;

      // Main content: purpose-section (for tercerapagina.html, maintained for completeness)
      const purposeH2 = document.querySelector('h2[data-text-key="purpose_h2"]');
      if (purposeH2) purposeH2.textContent = texts.purpose_h2;
      const purposeP1 = document.querySelector('p[data-text-key="purpose_p1"]');
      if (purposeP1) purposeP1.textContent = texts.purpose_p1;
      const purposeP2 = document.querySelector('p[data-text-key="purpose_p2"]');
      if (purposeP2) purposeP2.textContent = texts.purpose_p2;

      // Privacy section (for tercerapagina.html, maintained for completeness)
      const imagePrivacy = document.querySelector('img[data-image-key="image_privacy"]');
      if (imagePrivacy) imagePrivacy.src = `/static/images/${texts.image_privacy}`;

      // Groups intro (for tercerapagina.html, maintained for completeness)
      const groupsH2 = document.querySelector('h2[data-text-key="groups_h2"]');
      if (groupsH2) groupsH2.textContent = texts.groups_h2;
      const groupsP = document.querySelector('p[data-text-key="groups_p"]');
      if (groupsP) groupsP.textContent = texts.groups_p;

      // Team section - Images and names on flip cards (for tercerapagina.html, maintained for completeness)
      document.querySelectorAll('.team-card').forEach(card => {
          const cardIndex = Array.from(card.parentElement.children).indexOf(card) + 1;
          const bgImage = card.querySelector('.background-image');
          const titleImage = card.querySelector('.team-title-image');
          const namesImage = card.querySelector('.card-back img');

          const bgKey = 'team_bg_' + (cardIndex === 1 ? 'design' : cardIndex === 2 ? 'htmlcss' : cardIndex === 3 ? 'javascript' : 'database');
          const titleKey = 'team_title_' + (cardIndex === 1 ? 'design' : cardIndex === 2 ? 'htmlcss' : cardIndex === 3 ? 'javascript' : 'database');
          const namesKey = 'team_names_' + (cardIndex === 1 ? 'design' : cardIndex === 2 ? 'htmlcss' : cardIndex === 3 ? 'javascript' : 'database');

          if (bgImage && texts[bgKey]) bgImage.src = `/static/images/${texts[bgKey]}`;
          if (titleImage && texts[titleKey]) titleImage.src = `/static/images/${texts[titleKey]}`;
          if (namesImage && texts[namesKey]) namesImage.src = `/static/images/${texts[namesKey]}`;
      });


      // Footer (common, maintained for completeness)
      const footerH3 = document.querySelector('footer .footer-column h3[data-text-key="footer_h3"]');
      if (footerH3) footerH3.innerHTML = texts.footer_h3.replace('<br />', '<br>');
      
      const footerP1 = document.querySelector('footer .footer-column p[data-text-key="footer_p1"]');
      if (footerP1) footerP1.textContent = texts.footer_p1;
      const footerP2 = document.querySelector('footer .footer-column p[data-text-key="footer_p2"]');
      if (footerP2) footerP2.textContent = texts.footer_p2;
      const footerP3 = document.querySelector('footer .footer-column p[data-text-key="footer_p3"]');
      if (footerP3) footerP3.textContent = texts.footer_p3;
      
      const footerButton = document.querySelector('footer .social-button button[data-text-key="footer_button"]');
      if (footerButton) footerButton.textContent = texts.footer_button;

      const footerLinksH3 = document.querySelector('footer .links-column h3[data-text-key="footer_links_h3"]');
      if (footerLinksH3) footerLinksH3.textContent = texts.footer_links_h3;
      
      // Footer links
      document.querySelectorAll('footer .links-column ul.footer-links:first-of-type li a[data-text-key]').forEach(link => {
          const key = link.getAttribute('data-text-key');
          if (key && texts[key]) link.textContent = texts[key];
      });
      document.querySelectorAll('footer .links-column ul.footer-links:nth-of-type(2) li a[data-text-key]').forEach(link => {
          const key = link.getAttribute('data-text-key');
          if (key && texts[key]) link.textContent = texts[key];
      });

      const footerRecentPostsH3 = document.querySelector('footer .recent-posts-column h3[data-text-key="footer_recent_posts_h3"]');
      if (footerRecentPostsH3) footerRecentPostsH3.textContent = texts.footer_recent_posts_h3;
      
      // Translate recent posts links
      document.querySelectorAll('footer .recent-posts ul li[data-text-key]').forEach(li => {
          const link = li.querySelector('a');
          const key = li.getAttribute('data-text-key');
          if (link && texts[key]) link.textContent = texts[key];
      });


      document.documentElement.lang = lang;
    }
  }

  // Initial language load
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
      changeLanguage(savedLanguage);
  } else {
      const browserLang = navigator.language || navigator.userLanguage;
      const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
      changeLanguage(detectedLang);
  }
});

//FOOTER
class FooterAnimator {
    constructor() {
        this.footer = document.querySelector('.main-footer');
        if (this.footer) {
            this.init();
        }
    }
 
    init() {
        this.prepareFooter();
        this.animateFooter();
    }
 
    prepareFooter() {
        this.footer.style.opacity = '0';
        this.footer.style.transform = 'translateY(40px)';
        this.footer.style.transition = 'transform 0.7s ease-out, opacity 0.7s ease-out';
    }
 
    animateFooter() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        });
 
        observer.observe(this.footer);
    }
 
    animateElement(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        });
       
        // Animar los elementos de lista
        this.animateListItems(element);
    }
 
    animateListItems(element) {
        const ulItems = element.querySelectorAll('ul li');
        if (ulItems.length > 0) {
            this.staggerAnimate(ulItems, 150, 'translateY(20px)');
        }
    }
 
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
            }, index * delay + 300);
        });
    }
}
// Inicializar el animador del footer
document.addEventListener('DOMContentLoaded', () => {
    new FooterAnimator();
});

