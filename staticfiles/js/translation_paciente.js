// ============================================================================================================
// Lógica de Traducción y Menú de Idiomas para home_paciente.html
// ============================================================================================================

document.addEventListener('DOMContentLoaded', function() {
  const htmlElement = document.documentElement; // Referencia al elemento <html>
  const languageButton = document.querySelector('.header .material-symbols-outlined[title="Language"]');
  let languageMenu = document.getElementById('language-menu'); // Obtener el menú existente

  // Objeto que contiene las traducciones para diferentes idiomas
  const translations = {
    es: {
      // Título de la página
      pageTitle: 'Health Connectors',

      // Header
      homeIconTitle: 'Inicio',
      profileLink: 'Perfil',
      logoutLink: 'Cerrar sesión',
      loginButton: 'Iniciar Sesión', // Esto no debería aparecer si el usuario está autenticado en home_paciente
      signupButton: 'Registrarse', // Esto no debería aparecer si el usuario está autenticado en home_paciente

      // Carrusel principal
      carouselPrev: 'Diapositiva anterior',
      carouselNext: 'Siguiente diapositiva',

      //IMAGENES
      cupon1: 'cupon1_esp.webp',
      cupon2: 'cupon4_esp.webp',
      cupon3: 'cupon2_esp.webp',
      cupon4: 'cupon3_esp.webp',

      // Sección de Bienvenida/Búsqueda
      welcomeTitle: 'Bienvenido a Health Connectors',
      welcomeText: 'Encuentra a tu especialista ideal y agenda tu cita fácilmente.',
      searchPlaceholder: 'Buscar por nombre...',
      allSpecialties: 'Todas las especialidades',
      cardiology: 'Cardiología',
      dermatology: 'Dermatología',
      pediatrics: 'Pediatría',
      allergology: 'Alergología',
      anesthesiology: 'Anestesiología',
      generalSurgery: 'Cirugía General',
      endocrinology: 'Endocrinología',
      gastroenterology: 'Gastroenterología',
      geriatrics: 'Geriatría',
      gynecology: 'Ginecología',
      hematology: 'Hematología',
      infectiousDiseases: 'Infectología',
      generalMedicine: 'Medicina General',
      internalMedicine: 'Medicina Interna',
      nephrology: 'Nefrología',
      pulmonology: 'Neumología',
      neurology: 'Neurología',
      nutrition: 'Nutrición',
      oncology: 'Oncología',
      ophthalmology: 'Oftalmología',
      otorhinolaryngology: 'Otorrinolaringología',
      psychiatry: 'Psiquiatría',
      radiology: 'Radiología',
      rheumatology: 'Reumatología',
      traumatology: 'Traumatología',
      urology: 'Urología',
      searchButton: 'Buscar',
      availableDoctors: 'Todos los doctores disponibles',
      noDoctors: 'No hay doctores disponibles.',
      recommended: '★ Recomendado',
      currentStatus: 'Estado actual:',
      suitability: 'Idoneidad:',
      credential: 'Credencial:',
      email: 'Email:',
      specialties: 'Especialidades:',
      hospitalAffiliation: 'Afiliación Hospitalaria:',
      scheduleAppointment: 'Agendar cita',
      moreInformation: 'Más información',

      // Sección de Ofertas Especiales
      specialOffersTitle: 'Ofertas especiales para ti',
      specialOffersText: 'Accede a promociones y descuentos especiales con Health Connectors. Reserva tus citas fácilmente y aprovecha al máximo tu experiencia de atención médica.',
      previousOffer: 'Oferta anterior',
      nextOffer: 'Siguiente oferta',
      copyCodeButton: 'Copiar código',
      copiedText: '¡Copiado!',

      // Pie de página (Footer)
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
      footer_link_privacy: 'Políticas de Privacidad',
      footer_link_terms: 'Términos de uso',
      footer_link_signup: 'Registrarse',
      footer_link_login: 'Iniciar Sesión',
      footer_link_defamation: 'Difamación',
      footer_recent_posts_h3: 'Publicaciones recientes',
      footer_post_1: 'Beneficios del sueño para la salud<br>Beneficios del ejercicio<br>Manejo del estrés<br>La importancia de la atención preventiva.',
    },
    en: {
      // Page Title
      pageTitle: 'Health Connectors',

      // Header
      homeIconTitle: 'Home',
      profileLink: 'Profile',
      logoutLink: 'Logout',
      loginButton: 'Login',
      signupButton: 'Sign up',

      // Main Carousel
      carouselPrev: 'Previous slide',
      carouselNext: 'Next slide',

       //IMAGENES
      cupon1: 'cupon1_eng.webp',
      cupon2: 'cupon4_eng.webp',
      cupon3: 'cupon2_eng.webp',
      cupon4: 'cupon3_eng.webp',

      // Welcome/Search Section
      welcomeTitle: 'Welcome to Health Connectors',
      welcomeText: 'Find your ideal specialist and schedule your appointment easily.',
      searchPlaceholder: 'Search by name...',
      allSpecialties: 'All Specialties',
      cardiology: 'Cardiology',
      dermatology: 'Dermatology',
      pediatrics: 'Pediatrics',
      allergology: 'Allergology',
      anesthesiology: 'Anesthesiology',
      generalSurgery: 'General Surgery',
      endocrinology: 'Endocrinology',
      gastroenterology: 'Gastroenterology',
      geriatrics: 'Geriatrics',
      gynecology: 'Gynecology',
      hematology: 'Hematology',
      infectiousDiseases: 'Infectious Diseases',
      generalMedicine: 'General Medicine',
      internalMedicine: 'Internal Medicine',
      nephrology: 'Nephrology',
      pulmonology: 'Pulmonology',
      neurology: 'Neurology',
      nutrition: 'Nutrition',
      oncology: 'Oncology',
      ophthalmology: 'Ophthalmology',
      otorhinolaryngology: 'Otolaryngology', // Changed to more common English term
      psychiatry: 'Psychiatry',
      radiology: 'Radiology',
      rheumatology: 'Rheumatology',
      traumatology: 'Traumatology',
      urology: 'Urology',
      searchButton: 'Search',
      availableDoctors: 'All Available Doctors',
      noDoctors: 'No doctors available.',
      recommended: '★ Recommended',
      currentStatus: 'Current Status:',
      suitability: 'Suitability:',
      credential: 'Credential:',
      email: 'Email:',
      specialties: 'Specialties:',
      hospitalAffiliation: 'Hospital Affiliation:',
      scheduleAppointment: 'Schedule Appointment',
      moreInformation: 'More Information',

      // Special Offers Section
      specialOffersTitle: 'Special offers for you',
      specialOffersText: 'Access special promotions and discounts with Health Connectors. Book your appointments easily and make the most of your healthcare experience.',
      previousOffer: 'Previous',
      nextOffer: 'Next',
      copyCodeButton: 'Copy code',
      copiedText: 'Copied!',

      // Footer
      footer_h3: 'Health<br>Connectors',
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
      footer_link_privacy: 'Privacy Policies',
      footer_link_terms: 'Term of use',
      footer_link_signup: 'Sign up',
      footer_link_login: 'Login',
      footer_link_defamation: 'Defamation',
      footer_recent_posts_h3: 'Recent posts',
      footer_post_1: 'Health Benefits of Sleep<br>Benefits of Exercise<br>Stress Management<br>The importance of preventive care.',
    }
  };

  // Función para aplicar las traducciones
  function applyTranslation(lang) {
    console.log('Aplicando traducción para el idioma:', lang);
    const texts = translations[lang];
    if (!texts) {
      console.error('No se encontraron traducciones para el idioma:', lang);
      return;
    }

    // Actualizar el atributo lang del documento
    htmlElement.lang = lang;

    // Traducir el título de la página (si existe el data-text-key en el <title>)
    // Nota: El elemento <title> no puede tener data-text-key directamente en algunos navegadores.
    // Lo mejor es apuntar al title en el objeto y cambiarlo directamente.
    document.title = texts.pageTitle;

    // Elementos del Header
    const homeIconTitle = document.querySelector('[data-text-key="homeIconTitle"]');
    if (homeIconTitle) homeIconTitle.title = texts.homeIconTitle;

    const profileLink = document.querySelector('.account-menu [data-text-key="profileLink"]');
    if (profileLink) profileLink.textContent = texts.profileLink;

    const logoutLink = document.querySelector('.account-menu [data-text-key="logoutLink"]');
    if (logoutLink) logoutLink.textContent = texts.logoutLink;

    const loginButton = document.querySelector('[data-text-key="loginButton"]');
    if (loginButton) loginButton.textContent = texts.loginButton;

    const signupButton = document.querySelector('[data-text-key="signupButton"]');
    if (signupButton) signupButton.textContent = texts.signupButton;

    // Elementos del Carrusel Principal
    const carouselPrev = document.querySelector('[data-text-key="carouselPrev"]');
    if (carouselPrev) carouselPrev.setAttribute('aria-label', texts.carouselPrev);

    const carouselNext = document.querySelector('[data-text-key="carouselNext"]');
    if (carouselNext) carouselNext.setAttribute('aria-label', texts.carouselNext);

    // Sección de Bienvenida/Búsqueda
    const welcomeTitle = document.querySelector('[data-text-key="welcomeTitle"]');
    if (welcomeTitle) welcomeTitle.textContent = texts.welcomeTitle;

    const welcomeText = document.querySelector('[data-text-key="welcomeText"]');
    if (welcomeText) welcomeText.textContent = texts.welcomeText;

    const searchInput = document.querySelector('[data-text-key="searchPlaceholder"]');
    if (searchInput) searchInput.placeholder = texts.searchPlaceholder;

    const allSpecialtiesOption = document.querySelector('[data-text-key="allSpecialties"]');
    if (allSpecialtiesOption) allSpecialtiesOption.textContent = texts.allSpecialties;

    // Traducir las opciones de especialidades en el select
    const specialtyOptions = document.querySelectorAll('.busqueda-doctor__contenedor option');
    specialtyOptions.forEach(option => {
      const key = option.getAttribute('data-text-key');
      if (key && texts[key]) {
        option.textContent = texts[key];
      }
    });

    const searchButton = document.querySelector('[data-text-key="searchButton"]');
    if (searchButton) searchButton.textContent = texts.searchButton;

    const availableDoctorsTitle = document.querySelector('[data-text-key="availableDoctors"]');
    if (availableDoctorsTitle) availableDoctorsTitle.textContent = texts.availableDoctors;

    const noDoctorsMessage = document.querySelector('[data-text-key="noDoctors"]');
    if (noDoctorsMessage) noDoctorsMessage.textContent = texts.noDoctors;

    // Traducir los textos dentro de las tarjetas de doctores
    document.querySelectorAll('.card').forEach(card => {
      const recommendedText = card.querySelector('[data-text-key="recommended"]');
      if (recommendedText && recommendedText.closest('p')) {
        recommendedText.closest('p').innerHTML = recommendedText.closest('p').innerHTML.replace(/★\s*Recomendado|★\s*Recommended/, texts.recommended);
      }

      const statusStrong = card.querySelector('[data-text-key="currentStatus"]');
      if (statusStrong) statusStrong.textContent = texts.currentStatus;

      const suitabilityStrong = card.querySelector('[data-text-key="suitability"]');
      if (suitabilityStrong) suitabilityStrong.textContent = texts.suitability;

      const credentialStrong = card.querySelector('[data-text-key="credential"]');
      if (credentialStrong) credentialStrong.textContent = texts.credential;

      const emailStrong = card.querySelector('[data-text-key="email"]');
      if (emailStrong) emailStrong.textContent = texts.email;

      const specialtiesStrong = card.querySelector('[data-text-key="specialties"]');
      if (specialtiesStrong) specialtiesStrong.textContent = texts.specialties;

      const hospitalAffiliationStrong = card.querySelector('[data-text-key="hospitalAffiliation"]');
      if (hospitalAffiliationStrong) hospitalAffiliationStrong.textContent = texts.hospitalAffiliation;

      const scheduleButton = card.querySelector('[data-text-key="scheduleAppointment"]');
      if (scheduleButton) scheduleButton.textContent = texts.scheduleAppointment;

      const moreInfoButton = card.querySelector('[data-text-key="moreInformation"]');
      if (moreInfoButton) moreInfoButton.textContent = texts.moreInformation;
    });

    // Sección de Ofertas Especiales
    const specialOffersTitle = document.querySelector('[data-text-key="specialOffersTitle"]');
    if (specialOffersTitle) specialOffersTitle.textContent = texts.specialOffersTitle;

    const specialOffersText = document.querySelector('[data-text-key="specialOffersText"]');
    if (specialOffersText) specialOffersText.textContent = texts.specialOffersText;

    const prevOfferArrow = document.querySelector('[data-text-key="previousOffer"]');
    if (prevOfferArrow) prevOfferArrow.setAttribute('aria-label', texts.previousOffer);

    const nextOfferArrow = document.querySelector('[data-text-key="nextOffer"]');
    if (nextOfferArrow) nextOfferArrow.setAttribute('aria-label', texts.nextOffer);

    const copyCodeButton = document.querySelector('[data-text-key="copyCodeButton"]');
    if (copyCodeButton) {
        copyCodeButton.textContent = texts.copyCodeButton;
        copyCodeButton.setAttribute('data-original-text', texts.copyCodeButton); // Guardar texto original
        copyCodeButton.setAttribute('data-copied-text', texts.copiedText); // Guardar texto de copiado
    }


    // Pie de página (Footer)
    const footerH3 = document.querySelector('[data-text-key="footer_h3"]');
    if (footerH3) footerH3.innerHTML = texts.footer_h3.replace('\n', '<br>');

    const footerP1 = document.querySelector('[data-text-key="footer_p1"]');
    if (footerP1) footerP1.textContent = texts.footer_p1;
    const footerP2 = document.querySelector('[data-text-key="footer_p2"]');
    if (footerP2) footerP2.textContent = texts.footer_p2;
    const footerP3 = document.querySelector('[data-text-key="footer_p3"]');
    if (footerP3) footerP3.textContent = texts.footer_p3;

    const footerButton = document.querySelector('[data-text-key="footer_button"]');
    if (footerButton) footerButton.textContent = texts.footer_button;

    const footerLinksH3 = document.querySelector('[data-text-key="footer_links_h3"]');
    if (footerLinksH3) footerLinksH3.textContent = texts.footer_links_h3;

    // Enlaces del pie de página (primer grupo de links)
    document.querySelectorAll('.footer-column.links-column:nth-of-type(2) .footer-links a[data-text-key]').forEach(link => {
      const key = link.getAttribute('data-text-key');
      if (key && texts[key]) link.textContent = texts[key];
    });

    // Enlaces del pie de página (segundo grupo de links)
    document.querySelectorAll('.footer-column.links-column:nth-of-type(3) .footer-links a[data-text-key]').forEach(link => {
      const key = link.getAttribute('data-text-key');
      if (key && texts[key]) link.textContent = texts[key];
    });

    const footerRecentPostsH3 = document.querySelector('[data-text-key="footer_recent_posts_h3"]');
    if (footerRecentPostsH3) footerRecentPostsH3.textContent = texts.footer_recent_posts_h3;

    const footerPost1 = document.querySelector('[data-text-key="footer_post_1"]');
    if (footerPost1) footerPost1.innerHTML = texts.footer_post_1;
  }

  // Manejo del menú de idioma
  // Asegurarse de que el languageMenu exista antes de añadirlo al DOM
  if (!languageMenu) {
    languageMenu = document.createElement('div');
    languageMenu.id = 'language-menu';
    languageMenu.classList.add('dropdown-menu');
    languageMenu.innerHTML = `
      <a href="#" class="dropdown-item" data-lang="es">
        <div class="flag-icon flag-es"></div>
        Español
      </a>
      <a href="#" class="dropdown-item" data-lang="en">
        <div class="flag-icon flag-en"></div>
        English
      </a>
    `;
    // Insertar el menú en el DOM, por ejemplo, dentro del div que contiene el botón de idioma
    const languageDropdown = document.querySelector('.header > .material-symbols-outlined[title="Language"]').closest('div');
    if (languageDropdown) {
        languageDropdown.appendChild(languageMenu);
    } else {
        // Fallback si no se encuentra el contenedor, agregar al body (menos ideal)
        document.body.appendChild(languageMenu);
    }
  }






  //TRADUCCION DE IMAGENES
  function updateCarouselImages(lang) {
    const staticUrl = document.body.getAttribute('data-static-url');
    const images = document.querySelectorAll('img[data-img-key]');
    images.forEach((img) => {
      const key = img.getAttribute('data-img-key');
      const filename = imageTranslations[lang][key];
      if (filename) {
        img.src = `${staticUrl}images/${filename}?v=${Date.now()}`;
      }
    });
  }

  // Detectar selección de idioma (ajusta esto según tu dropdown real)
  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function () {
      const selectedLang = this.getAttribute('data-lang');
      updateCarouselImages(selectedLang);
    });
  });
 



  if (languageButton && languageMenu) {
    console.log('Botón de idioma y menú encontrados. Configurando eventos.');
    languageButton.addEventListener('click', function(e) {
      e.stopPropagation();
      languageMenu.classList.toggle('show');
      console.log('Menú de idioma alternado. Clase "show" actual:', languageMenu.classList.contains('show'));
    });

    document.addEventListener('click', function(e) {
      if (languageMenu.classList.contains('show') && !languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
        languageMenu.classList.remove('show');
        console.log('Menú de idioma cerrado por clic fuera.');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && languageMenu.classList.contains('show')) {
        languageMenu.classList.remove('show');
        console.log('Menú de idioma cerrado por tecla Escape.');
      }
    });
  } else {
    console.warn('Botón de idioma o menú no encontrados. Asegúrate de que el HTML esté estructurado correctamente para el menú de idioma.');
  }

  // Asigna el evento a los elementos del menú de idioma
  const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const selectedLang = this.getAttribute('data-lang');
      console.log('Idioma seleccionado:', selectedLang);
      languageMenu.classList.remove('show');

      // Aplica la traducción y guarda la preferencia
      setLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', selectedLang);
    });
  });

  // Función para establecer el idioma (separa la lógica de localStorage y applyTranslation)
  function setLanguage(lang) {
      applyTranslation(lang);
  }

  // Función para obtener el idioma actual (se mantiene para la inicialización)
  function getCurrentLanguage() {
      return localStorage.getItem('selectedLanguage') || (navigator.language.startsWith('es') ? 'es' : 'en');
  }

  // Cargar idioma guardado al inicializar
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    console.log('Idioma guardado encontrado:', savedLanguage);
    setLanguage(savedLanguage);
  } else {
    // Detectar idioma del navegador si no hay preferencia guardada
    const browserLang = navigator.language || navigator.userLanguage;
    const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
    console.log('No hay idioma guardado, detectando idioma del navegador:', detectedLang);
    setLanguage(detectedLang);
  }
});

// Lógica de copia de código para el modal de ofertas
document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById("copy-button");

    if (copyButton) {
        copyButton.addEventListener("click", () => {
            const codeSpan = document.getElementById("generated-code");
            const code = codeSpan.textContent;
            document.execCommand('copy'); // Usar execCommand para compatibilidad con iframe

            // Revertir el texto del botón después de unos segundos
            const originalText = copyButton.getAttribute('data-original-text');
            const copiedText = copyButton.getAttribute('data-copied-text');

            copyButton.textContent = copiedText;
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        });
    }
});

