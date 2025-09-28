// ============================================================================================================
// Lógica de Traducción y Menú de Idiomas para home_doctor.html (o home_paciente.html)
// ============================================================================================================
 
document.addEventListener('DOMContentLoaded', function() {
  const languageButton = document.getElementById('language-button');
  const languageMenu = document.getElementById('language-menu');
  const dropdownItems = document.querySelectorAll('.language-dropdown .dropdown-item');
 
  // Objeto que contiene las traducciones para diferentes idiomas
  const translations = {
    es: {
        // Título de la página
        pageTitle: 'Health Connectors', // El título general no cambia por el idioma en este caso
       
        // Header
        homeIconTitle: 'Inicio',
        profileLink: 'Perfil',
        logoutLink: 'Cerrar sesión',
        loginButton: 'Iniciar Sesión',
        signupButton: 'Registrarse',
 
        // Carrusel
        carouselPrev: 'Diapositiva anterior',
        carouselNext: 'Siguiente diapositiva',
 
        // Sección de Bienvenida/Búsqueda
        welcomeTitle: 'Bienvenido a Health Connectors',
        welcomeText: 'Aquí está tu calendario de citas. Por favor, revisa tus próximas consultas.',
 
        // Sección de Citas del Doctor
        doctorAppointmentsTitle: 'Citas del Doctor', // El nombre del doctor se agrega dinámicamente
        appointmentReason: 'Motivo:',
        appointmentDate: 'Fecha:',
        moreInfoButton: 'Más información',
        noAppointments: 'No hay citas registradas.',
 
        // Pie de página (Footer)
        footer_h3: 'Health\nConnectors', // El salto de línea se maneja en applyTranslation
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
        // Título de la página
        pageTitle: 'Health Connectors',
       
        // Header
        homeIconTitle: 'Home',
        profileLink: 'Profile',
        logoutLink: 'Logout',
        loginButton: 'Login',
        signupButton: 'Sign up',
 
        // Carrusel
        carouselPrev: 'Previous slide',
        carouselNext: 'Next slide',
 
        // Sección de Bienvenida/Búsqueda
        welcomeTitle: 'Welcome to Health Connectors',
        welcomeText: 'Here is your appointment calendar. Please review your upcoming consultations.',
 
        // Sección de Citas del Doctor
        doctorAppointmentsTitle: 'Doctor Appointments',
        appointmentReason: 'Reason:',
        appointmentDate: 'Date:',
        moreInfoButton: 'More information',
        noAppointments: 'No appointments registered.',
 
        // Pie de página (Footer)
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
        footer_link_privacy: 'Privacy Policies',
        footer_link_terms: 'Term of use',
        footer_link_signup: 'Sign up',
        footer_link_login: 'Login',
        footer_link_defamation: 'Defamation',
        footer_recent_posts_h3: 'Recent posts',
        footer_post_1: 'Health Benefits of Sleep<br>Benefits of Excercise<br>Stress Management<br>The importance of preventive care.',
    }
  };
 
  // Función para aplicar las traducciones
  function applyTranslation(lang) {
    console.log('Aplicando traducción para el idioma:', lang); // Debugging
    const texts = translations[lang];
    if (!texts) {
      console.error('No se encontraron traducciones para el idioma:', lang); // Debugging
      return;
    }
 
    // Actualizar el atributo lang del documento
    document.documentElement.lang = lang;
 
    // Traducir el título de la página
    const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
    if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;
 
    // Elementos del Header
    const homeIconTitle = document.querySelector('[data-text-key="homeIconTitle"]');
    if (homeIconTitle) homeIconTitle.title = texts.homeIconTitle;
 
    // Menú de cuenta (si está autenticado) - Selectores más específicos
    const profileLink = document.querySelector('.account-menu [data-text-key="profileLink"]');
    if (profileLink) profileLink.textContent = texts.profileLink;
 
    const logoutLink = document.querySelector('.account-menu [data-text-key="logoutLink"]');
    if (logoutLink) logoutLink.textContent = texts.logoutLink;
 
    const loginButton = document.querySelector('[data-text-key="loginButton"]');
    if (loginButton) loginButton.textContent = texts.loginButton;
 
    const signupButton = document.querySelector('[data-text-key="signupButton"]');
    if (signupButton) signupButton.textContent = texts.signupButton;
 
    // Elementos del Carrusel
    const carouselPrev = document.querySelector('[data-text-key="carouselPrev"]');
    if (carouselPrev) carouselPrev.setAttribute('aria-label', texts.carouselPrev);
 
    const carouselNext = document.querySelector('[data-text-key="carouselNext"]');
    if (carouselNext) carouselNext.setAttribute('aria-label', texts.carouselNext);
 
    // Sección de Bienvenida/Búsqueda
    const welcomeTitle = document.querySelector('[data-text-key="welcomeTitle"]');
    if (welcomeTitle) welcomeTitle.textContent = texts.welcomeTitle;
 
    const welcomeText = document.querySelector('[data-text-key="welcomeText"]');
    if (welcomeText) welcomeText.textContent = texts.welcomeText;
 
    // Sección de Citas del Doctor
    const doctorAppointmentsTitleElement = document.querySelector('[data-text-key="doctorAppointmentsTitle"]');
    if (doctorAppointmentsTitleElement) {
        // Preserva el nombre del doctor que viene de Django
        const doctorName = doctorAppointmentsTitleElement.getAttribute('data-doctor-name');
        doctorAppointmentsTitleElement.textContent = `${texts.doctorAppointmentsTitle} ${doctorName || ''}`;
    }
 
    // Traducir las etiquetas de Motivo y Fecha dentro de cada tarjeta de cita
    document.querySelectorAll('.appointment-card').forEach(card => {
        const reasonStrong = card.querySelector('[data-text-key="appointmentReason"]');
        if (reasonStrong) reasonStrong.textContent = texts.appointmentReason;
 
        const dateStrong = card.querySelector('[data-text-key="appointmentDate"]');
        if (dateStrong) dateStrong.textContent = texts.appointmentDate;
    });
 
    // Debido a que 'Más información' se repite en un bucle, se seleccionan todos y se actualizan
    document.querySelectorAll('[data-text-key="moreInfoButton"]').forEach(element => {
        element.textContent = texts.moreInfoButton;
    });
 
    const noAppointments = document.querySelector('[data-text-key="noAppointments"]');
    if (noAppointments) noAppointments.textContent = texts.noAppointments;
 
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
 
    // Si estás usando FullCalendar, establece el idioma también
    if (typeof FullCalendar !== 'undefined' && window.calendarInstance) {
        window.calendarInstance.setOption('locale', lang);
        console.log('Idioma de FullCalendar actualizado a:', lang); // Debugging
    }
  }
 
  // Manejo del menú de idioma
  if (languageButton && languageMenu) {
    console.log('Botón de idioma y menú encontrados. Configurando eventos.'); // Debugging
    languageButton.addEventListener('click', function(e) {
      e.stopPropagation(); // Evita que el clic se propague al documento
      languageMenu.classList.toggle('show');
      console.log('Menú de idioma alternado. Clase "show" actual:', languageMenu.classList.contains('show')); // Debugging
    });
   
    document.addEventListener('click', function(e) {
      // Cierra el menú si se hace clic fuera de él
      if (languageMenu.classList.contains('show') && !languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
        languageMenu.classList.remove('show');
        console.log('Menú de idioma cerrado por clic fuera.'); // Debugging
      }
    });
   
    document.addEventListener('keydown', function(e) {
      // Cierra el menú con la tecla 'Escape'
      if (e.key === 'Escape' && languageMenu.classList.contains('show')) {
        languageMenu.classList.remove('show');
        console.log('Menú de idioma cerrado por tecla Escape.'); // Debugging
      }
    });
  } else {
    console.warn('Botón de idioma o menú no encontrados. Asegúrate de que los IDs "language-button" y "language-menu" estén presentes en el HTML.'); // Debugging
  }
 
  // Asigna el evento a los elementos del menú de idioma
  dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault(); // Previene la navegación por defecto del enlace
      const selectedLang = this.getAttribute('data-lang');
     
      console.log('Idioma seleccionado:', selectedLang); // Debugging
     
      languageMenu.classList.remove('show'); // Cierra el menú
 
      // Aplica la traducción y guarda la preferencia
      setLanguage(selectedLang);
      localStorage.setItem('selectedLanguage', selectedLang);
    });
  });
 
  // Función para establecer el idioma (separa la lógica de localStorage y applyTranslation)
  function setLanguage(lang) {
      // Actualiza el idioma de FullCalendar si está cargado
      if (typeof FullCalendar !== 'undefined' && window.calendarInstance) {
          window.calendarInstance.setOption('locale', lang);
      }
      applyTranslation(lang);
  }
 
  // Función para obtener el idioma actual (se mantiene para la inicialización de FullCalendar)
  function getCurrentLanguage() {
      return localStorage.getItem('selectedLanguage') || (navigator.language.startsWith('es') ? 'es' : 'en');
  }
 
  // Cargar idioma guardado al inicializar
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    console.log('Idioma guardado encontrado:', savedLanguage); // Debugging
    setLanguage(savedLanguage);
  } else {
    // Detectar idioma del navegador si no hay preferencia guardada
    const browserLang = navigator.language || navigator.userLanguage;
    const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
    console.log('No hay idioma guardado, detectando idioma del navegador:', detectedLang); // Debugging
    setLanguage(detectedLang);
  }
});
 
 