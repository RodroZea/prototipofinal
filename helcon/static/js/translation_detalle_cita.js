document.addEventListener('DOMContentLoaded', function() {
  const languageButton = document.getElementById('language-button');
  const languageMenu = document.getElementById('language-menu');
  const dropdownItems = document.querySelectorAll('.language-dropdown .dropdown-item');
 
  // Objeto de traducciones
  const translations = {
    es: {
      pageTitle: 'Detalle de la Cita',
      detailsTitle: 'Detalles de la Cita',
      nameLabel: 'Nombre:',
      reasonLabel: 'Motivo de Visita:',
      consultationDataLabel: 'Datos de Consulta:',
      insuranceLabel: 'Aseguradora:',
      dateLabel: 'Fecha:',
      timeLabel: 'Hora:',
      statusLabel: 'Estado:',
      priceLabel: 'Precio de la consulta:',
      assignPriceButton: 'Asignar Precio', // No se incluyen iconos aquí, se añaden en HTML
      confirmAppointmentButton: 'Confirmar cita', // No se incluyen iconos aquí
      cancelAppointmentButton: 'Cancelar cita', // No se incluyen iconos aquí
      cancelConfirmMessage: '¿Seguro que deseas cancelar la cita? Esta acción no se puede deshacer.' // Mensaje para window.confirm
    },
    en: {
      pageTitle: 'Appointment Details',
      detailsTitle: 'Appointment Details',
      nameLabel: 'Name:',
      reasonLabel: 'Reason for Visit:',
      consultationDataLabel: 'Consultation Data:',
      insuranceLabel: 'Insurance:',
      dateLabel: 'Date:',
      timeLabel: 'Time:',
      statusLabel: 'Status:',
      priceLabel: 'Consultation Price:',
      assignPriceButton: 'Assign Price',
      confirmAppointmentButton: 'Confirm Appointment',
      cancelAppointmentButton: 'Cancel Appointment',
      cancelConfirmMessage: 'Are you sure you want to cancel the appointment? This action cannot be undone.'
    }
  };
 
  // Función para obtener el idioma actual desde localStorage o el navegador
  function getCurrentLanguage() {
    return localStorage.getItem('selectedLanguage') || (navigator.language.startsWith('es') ? 'es' : 'en');
  }
 
  // Función para aplicar las traducciones
  function applyTranslation(lang) {
    const texts = translations[lang];
    if (!texts) return;
 
    document.documentElement.lang = lang; // Actualiza el atributo lang del HTML
 
    // Traducir elementos por data-text-key
    document.querySelectorAll('[data-text-key]').forEach(element => {
      const key = element.getAttribute('data-text-key');
      // Solo actualiza textContent, los iconos ya están en el HTML
      if (texts[key] && key !== 'cancelConfirmMessage') { // No traducir el mensaje de confirmación directa aquí
          if (key === 'assignPriceButton') {
              element.innerHTML = `💰 ${texts[key]}`;
          } else if (key === 'confirmAppointmentButton') {
              element.innerHTML = `✅ ${texts[key]}`;
          } else if (key === 'cancelAppointmentButton') {
              element.innerHTML = `❌ ${texts[key]}`;
          } else {
              element.textContent = texts[key];
          }
      }
    });
  }
 
  // Lógica del menú de idioma
  if (languageButton && languageMenu) {
    languageButton.addEventListener('click', function(e) {
      e.stopPropagation();
      languageMenu.classList.toggle('show');
    });
 
    document.addEventListener('click', function(e) {
      if (languageMenu.classList.contains('show') && !languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
        languageMenu.classList.remove('show');
      }
    });
 
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && languageMenu.classList.contains('show')) {
        languageMenu.classList.remove('show');
      }
    });
  }
 
  // Event listeners para los elementos del menú desplegable
  dropdownItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const selectedLang = this.getAttribute('data-lang');
      localStorage.setItem('selectedLanguage', selectedLang); // Guarda la preferencia
      applyTranslation(selectedLang); // Aplica la traducción
      languageMenu.classList.remove('show'); // Cierra el menú
    });
  });
 
  // Inicializa la traducción al cargar la página
  applyTranslation(getCurrentLanguage());
 
  // Nueva función global para la confirmación de cancelación
  window.showCancelConfirm = function(form) {
    const currentLang = getCurrentLanguage();
    const message = translations[currentLang].cancelConfirmMessage;
    return window.confirm(message); // Retorna true si se confirma, false si se cancela
  };
});
 
 