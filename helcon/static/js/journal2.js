document.addEventListener('DOMContentLoaded', () => {
  // Lógica existente para flip-cards (se mantiene sin cambios en proporciones)
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('flipped'));
    card.addEventListener('mouseleave', () => card.classList.remove('flipped'));
  });

  // ============================================================================================================
  // Lógica de Traducción y Menú de Idiomas
  // ============================================================================================================

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
        pageTitle: 'Beneficios de la Actividad Física',
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',
        image_health_in_motion: 'physical_principal_esp.webp', // Asegúrate de tener esta imagen
        div1_h1: 'Beneficios de la Actividad Física',
        div1_p_strong: 'La actividad física regular es muy beneficiosa tanto para la salud física como mental.',
        div1_li1_strong: 'En adultos:',
        div1_li1_text: ' ayuda a prevenir y controlar enfermedades no transmisibles como enfermedades cardiovasculares, cáncer y diabetes; reduce los síntomas de depresión y ansiedad; y promueve la salud cerebral y el bienestar general.',
        div1_li2_strong: 'En niños y adolescentes:',
        div1_li2_text: ' promueve la salud ósea, estimula el crecimiento y desarrollo saludable de los músculos, y mejora el desarrollo motor y cognitivo.',
        flipcard_1_p: 'moverse_o_morir.webp',
        flipcard_1_text: 'En los Estados Unidos y en todo el mundo, las personas están pasando cada vez más tiempo realizando actividades sedentarias. En nuestro tiempo libre, estamos sentados mientras usamos una computadora u otro dispositivo.',
        flipcard_2_p: 'cheetos_español.webp',
        flipcard_2_text: "La inactividad física es uno de los principales factores de riesgo modificables para la mortalidad global, con un riesgo estimado de muerte de entre el 20% y el 30% en comparación con aquellos que son físicamente activos.", // Interpretación de "Cheetos" como snack no saludable
        specific_benefits_h2: 'Los beneficios específicos incluyen',
        bullet_li1_strong: 'En niños y adolescentes:',
        bullet_li1_text: ' Mejora la aptitud física, la salud cardiometabólica y ósea, la capacidad cognitiva y la salud mental, y reduce la grasa corporal.',
        bullet_li2_strong: 'En adultos y ancianos:',
        bullet_li2_text: ' Reduce el riesgo de mortalidad por todas las causas y mortalidad por enfermedades cardiovasculares, la aparición de hipertensión, tipos específicos de cáncer y diabetes tipo 2; previene caídas; y mejora la salud mental, la salud cognitiva, el sueño y las medidas de grasa corporal.',
        bullet_li3_strong: 'En mujeres durante el embarazo y el posparto:',
        bullet_li3_text: ' Reduce el riesgo de preeclampsia, hipertensión gestacional, diabetes gestacional, aumento excesivo de peso durante el embarazo, complicaciones del parto, depresión posparto y complicaciones posnatales. Además, la actividad física no tiene efectos adversos sobre el peso al nacer ni aumenta el riesgo de muerte prenatal.',
        footer_h3: 'Health\nConnectors',
        footer_p1: 'Nueva Elsiebury',
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
        pageTitle: 'Benefits of Physical Activity',
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',
        image_health_in_motion: 'health_in_motion.webp',
        div1_h1: 'Benefits of Physical Activity',
        div1_p_strong: 'Regular physical activity is very beneficial for both physical and mental health.',
        div1_li1_strong: 'In adults:',
        div1_li1_text: ' helps prevent and control non-communicable diseases like cardiovascular diseases, cancer, and diabetes; reduces symptoms of depression and anxiety; and promotes brain health and overall well-being.',
        div1_li2_strong: 'In children and adolescents:',
        div1_li2_text: ' promotes bone health, stimulates healthy growth and development of muscles, and improves motor and cognitive development.',
        flipcard_1_p: 'Move_or_die.webp',
        flipcard_1_text: "In the United States and around the world, people are spending more and more time doing sedentary activities. During our leisure time, we are often sitting while using a computer or other device",
        flipcard_2_p: 'CHEETOS.webp',
        flipcard_2_text: "Physical inactivity is one of the leading modifiable risk factors for global mortality, with an estimated 20% to 30% increased risk of death compared with those who are physically active. ",
        specific_benefits_h2: 'Specific benefits include',
        bullet_li1_strong: 'In children and adolescents:',
        bullet_li1_text: ' Improves fitness, cardiometabolic and bone health, cognitive capacity, and mental health, and reduces body fat.',
        bullet_li2_strong: 'In adults and the elderly:',
        bullet_li2_text: ' Reduces the risk of all-cause mortality and cardiovascular disease mortality, the occurrence of hypertension, specific types of cancer, and type 2 diabetes; prevents falls; and improves mental health, cognitive health, sleep, and body fat measures.',
        bullet_li3_strong: 'In women during pregnancy and postpartum:',
        bullet_li3_text: ' Reduces the risk of preeclampsia, gestational hypertension, gestational diabetes, excessive weight gain during pregnancy, childbirth complications, postpartum depression, and postnatal complications. Additionally, physical activity has no adverse effects on birth weight nor increases the risk of prenatal death.',
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
      //textossss
      document.querySelectorAll('[data-text-key]').forEach(el => {
  const key = el.getAttribute('data-text-key');
  console.log('🔤 Traduciendo', key, '→', texts[key]);  // ← Debe salir en consola

  if (texts[key]) {
    if (texts[key].includes('<br>') || texts[key].includes('</')) {
      el.innerHTML = texts[key];
    } else {
      el.textContent = texts[key];
    }
  }
});

      // Traducción de imágenes principales
      document.querySelectorAll('img[data-image-key]').forEach(img => {
        const imageKey = img.getAttribute('data-image-key');
        if (texts[imageKey]) {
            img.src = `/static/images/${texts[imageKey]}`;
        }
      });


      // Contenido del div-1
      const div1H1 = document.querySelector('.div-1 h1[data-text-key="div1_h1"]');
      if(div1H1) div1H1.textContent = texts.div1_h1;
      
      const div1PStrong = document.querySelector('.div-1 p strong[data-text-key="div1_p_strong"]');
      if(div1PStrong) div1PStrong.textContent = texts.div1_p_strong;

      const div1Li1Strong = document.querySelector('.div-1 ul li:nth-child(1) strong[data-text-key="div1_li1_strong"]');
      if(div1Li1Strong) div1Li1Strong.textContent = texts.div1_li1_strong;
      const div1Li1Text = document.querySelector('.div-1 ul li:nth-child(1) span[data-text-key="div1_li1_text"]');
      if(div1Li1Text) div1Li1Text.textContent = texts.div1_li1_text;

      const div1Li2Strong = document.querySelector('.div-1 ul li:nth-child(2) strong[data-text-key="div1_li2_strong"]');
      if(div1Li2Strong) div1Li2Strong.textContent = texts.div1_li2_strong;
      const div1Li2Text = document.querySelector('.div-1 ul li:nth-child(2) span[data-text-key="div1_li2_text"]');
      if(div1Li2Text) div1Li2Text.textContent = texts.div1_li2_text;


      // Flipcards (texto de los párrafos)
      const flipcardP1 = document.querySelector('.flip-card:nth-child(1) .flip-card-back p[data-text-key="flipcard_1_text"]');
      if(flipcardP1) flipcardP1.textContent = texts.flipcard_1_text;
      const flipcardP2 = document.querySelector('.flip-card:nth-child(2) .flip-card-back p[data-text-key="flipcard_2_text"]');
      if(flipcardP2) flipcardP2.textContent = texts.flipcard_2_text;


      // Specific benefits section
      const specificBenefitsH2 = document.querySelector('h2[data-text-key="specific_benefits_h2"]');
      if(specificBenefitsH2) specificBenefitsH2.textContent = texts.specific_benefits_h2;

      const bulletLi1Strong = document.querySelector('.contenido_viñeta li:nth-child(1) strong[data-text-key="bullet_li1_strong"]');
      if(bulletLi1Strong) bulletLi1Strong.textContent = texts.bullet_li1_strong;
      const bulletLi1Text = document.querySelector('.contenido_viñeta li:nth-child(1) span[data-text-key="bullet_li1_text"]');
      if(bulletLi1Text) bulletLi1Text.textContent = texts.bullet_li1_text;

      const bulletLi2Strong = document.querySelector('.contenido_viñeta li:nth-child(2) strong[data-text-key="bullet_li2_strong"]');
      if(bulletLi2Strong) bulletLi2Strong.textContent = texts.bullet_li2_strong;
      const bulletLi2Text = document.querySelector('.contenido_viñeta li:nth-child(2) span[data-text-key="bullet_li2_text"]');
      if(bulletLi2Text) bulletLi2Text.textContent = texts.bullet_li2_text;

      const bulletLi3Strong = document.querySelector('.contenido_viñeta li:nth-child(3) strong[data-text-key="bullet_li3_strong"]');
      if(bulletLi3Strong) bulletLi3Strong.textContent = texts.bullet_li3_strong;
      const bulletLi3Text = document.querySelector('.contenido_viñeta li:nth-child(3) span[data-text-key="bullet_li3_text"]');
      if(bulletLi3Text) bulletLi3Text.textContent = texts.bullet_li3_text;

      // Pie de página
      const footerColumns = document.querySelectorAll('.main-footer .footer-column');
      if (footerColumns[0]) {
        const footerH3 = footerColumns[0].querySelector('h3[data-text-key="footer_h3"]');
        if(footerH3) footerH3.innerHTML = texts.footer_h3.replace('\n', '<br>');
        
        const footerP = footerColumns[0].querySelectorAll('p[data-text-key]');
        if (footerP[0]) footerP[0].textContent = texts.footer_p1;
        if (footerP[1]) footerP[1].textContent = texts.footer_p2;
        if (footerP[2]) footerP[2].textContent = texts.footer_p3;
        
        const socialButton = footerColumns[0].querySelector('button[data-text-key="footer_button"]');
        if (socialButton) socialButton.textContent = texts.footer_button;
      }

      if (footerColumns[1]) {
        const linksH3 = footerColumns[1].querySelector('h3[data-text-key="footer_links_h3"]');
        if(linksH3) linksH3.textContent = texts.footer_links_h3;
        
        const links = footerColumns[1].querySelectorAll('.footer-links li a');
        if(links[0]) links[0].textContent = texts.footer_link_home;
        if(links[1]) links[1].textContent = texts.footer_link_pages;
        if(links[2]) links[2].textContent = texts.footer_link_services;
        if(links[3]) links[3].textContent = texts.footer_link_portfolio;
        if(links[4]) links[4].textContent = texts.footer_link_blog;
        if(links[5]) links[5].textContent = texts.footer_link_contact;
      }
      
      if (footerColumns[2]) {
        const links = footerColumns[2].querySelectorAll('.footer-links li a');
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
    
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
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

