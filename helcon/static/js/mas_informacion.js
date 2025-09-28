document.addEventListener('DOMContentLoaded', function() {
    // ============================================================================================================
    // Lógica de Traducción y Menú de Idiomas
    // ============================================================================================================
 
    const languageDropdownDiv = document.querySelector('.language-dropdown');
    let languageButton = null;
    let languageMenu = null;
    let dropdownItems = null;
 
    if (languageDropdownDiv) {
        languageButton = languageDropdownDiv.querySelector('.boton-idioma');
        languageMenu = languageDropdownDiv.querySelector('.dropdown-menu');
        dropdownItems = languageDropdownDiv.querySelectorAll('.dropdown-item');
 
        if (languageButton && languageMenu && dropdownItems.length > 0) {
            languageButton.addEventListener('click', function(e) {
                e.stopPropagation();
                languageMenu.classList.toggle('show');
            });
           
            document.addEventListener('click', function(e) {
                if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
                    languageMenu.classList.remove('show');
                }
            });
           
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    languageMenu.classList.remove('show');
                }
            });
           
            dropdownItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const selectedLang = this.getAttribute('data-lang');
                   
                    console.log('Idioma seleccionado:', selectedLang);
                   
                    languageMenu.classList.remove('show');
                   
                    changeLanguage(selectedLang);
                   
                    localStorage.setItem('selectedLanguage', selectedLang);
                });
            });
        } else {
            console.warn("Elementos del dropdown de idioma no encontrados, la funcionalidad de traducción no se inicializará completamente.");
        }
    }
 
    function changeLanguage(lang) {
        const translations = {
            es: {
                pageTitle: 'Información del Doctor',
                back_link: 'Volver',
                profile_img: '{% static "images/fotoprede_es.webp" %}', // Asumo una imagen por defecto en español
                profile_img_default: '{% static "images/fotoprede_es.webp" %}', // La misma por defecto si no hay foto
                doctor_name_full: '{{ doctor.user.first_name }} {{ doctor.user.last_name }}', // El nombre dinámico no se traduce aquí, solo se usa para el selector
                doctor_specialty_value: '{{ doctor.especialidad }}', // La especialidad dinámica no se traduce aquí
 
                description_label: 'Descripción:',
                suitability_label: 'Idoneidad:',
                studies_label: 'Estudios:',
                credential_label: 'Credencial:',
                email_label: 'Correo:',
                location_label: 'Ubicación:',
                phone_label: 'Teléfono:',
                btn_schedule: 'Agendar cita',
                btn_search_other: 'Buscar Otro',
            },
            en: {
                pageTitle: 'Doctor Information',
                back_link: 'Back',
                profile_img: '{% static "images/fotoprede.webp" %}', // Imagen por defecto en inglés
                profile_img_default: '{% static "images/fotoprede.webp" %}',
                doctor_name_full: '{{ doctor.user.first_name }} {{ doctor.user.last_name }}',
                doctor_specialty_value: '{{ doctor.especialidad }}',
                description_label: 'Description:',
                suitability_label: 'Suitability:',
                studies_label: 'Studies:',
                credential_label: 'Credential:',
                email_label: 'Email:',
                location_label: 'Location:',
                phone_label: 'Phone:',
                btn_schedule: 'Schedule appointment',
                btn_search_other: 'Search Other',
            }
        };
       
        const texts = translations[lang];
       
        if (texts) {
            // Traducir el título de la página
            const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
            if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;
 
            // Traducir el enlace de volver
            const backLink = document.querySelector('.back-link[data-text-key="back_link"]');
            if (backLink) backLink.innerHTML = `<i class="fas fa-arrow-left"></i> ${texts.back_link}`;
 
            // Traducir imagen de perfil
            const profileImgElement = document.querySelector('.profile-img[data-image-key="profile_img"]');
            const profileImgDefaultElement = document.querySelector('.profile-img[data-image-key="profile_img_default"]');
 
            if (profileImgElement && texts.profile_img) {
                profileImgElement.src = texts.profile_img;
            } else if (profileImgDefaultElement && texts.profile_img_default) {
                profileImgDefaultElement.src = texts.profile_img_default;
            }
 
            // Traducir el nombre completo del doctor (el h2)
            const doctorNameH2 = document.querySelector('h2[data-text-key="doctor_name_full"]');
            if (doctorNameH2) {
                // No se traduce el contenido, solo se usa el data-text-key para saber si es el elemento correcto
                // El contenido real es dinámico de Django
            }
 
            // Traducir la especialidad (el p con clase specialty)
            const doctorSpecialtyP = document.querySelector('p.specialty[data-text-key="doctor_specialty_value"]');
            if (doctorSpecialtyP) {
                // Similar al nombre, el contenido es dinámico.
            }
           
            // Traducción de las etiquetas fuertes y valores estáticos en el .right section
            document.querySelectorAll('.right p strong[data-text-key]').forEach(strongElement => {
                const key = strongElement.getAttribute('data-text-key');
                if (key && texts[key]) {
                    strongElement.textContent = texts[key];
                }
            });
 
            // No traducir los <span> con valores dinámicos
            // document.querySelectorAll('.right p span.dynamic-value').forEach(spanElement => {
            //     // Estos no se traducen
            // });
 
            // Traducir los botones
            const btnSchedule = document.querySelector('button[data-text-key="btn_schedule"]');
            if (btnSchedule) btnSchedule.textContent = texts.btn_schedule;
           
            const btnSearchOther = document.querySelector('a.btn-outline[data-text-key="btn_search_other"]');
            if (btnSearchOther) btnSearchOther.textContent = texts.btn_search_other;
 
 
            // Cambiar el atributo lang del documento
            document.documentElement.lang = lang;
        }
    }
 
    // Cargar idioma guardado al inicializar
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        changeLanguage(savedLanguage);
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
        changeLanguage(detectedLang);
    }
});
 
 