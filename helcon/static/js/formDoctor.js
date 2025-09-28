document.addEventListener('DOMContentLoaded', function() {
    // Lógica para mostrar/ocultar el modal de edición
    const btnEditar = document.getElementById('btnEditar');
    const modal = document.getElementById('modal');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const fotoWrapper = document.querySelector('.foto-wrapper');
    const fotoInput = document.getElementById('foto_perfil');

    if (btnEditar) {
        btnEditar.addEventListener('click', function() {
            modal.style.display = 'flex'; // Mostrar el modal
            modal.setAttribute('aria-hidden', 'false');
        });
    }

    if (btnCancelarModal) {
        btnCancelarModal.addEventListener('click', function() {
            modal.style.display = 'none'; // Ocultar el modal
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    // Lógica para cambiar la foto de perfil
    if (fotoWrapper && fotoInput) {
        fotoWrapper.addEventListener('click', function() {
            fotoInput.click(); // Simula el clic en el input de archivo oculto
        });

        fotoInput.addEventListener('change', function() {
            // Cuando se selecciona un archivo, enviar el formulario de la foto
            const fotoForm = document.getElementById('fotoForm');
            if (fotoForm) {
                fotoForm.submit();
            }
        });
    }

    // ============================================================================================================
    // Lógica de Traducción y Menú de Idiomas (Integrada y Adaptada)
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
                pageTitle: 'Perfil Doctor',
                change_photo_title: 'Haz clic para cambiar foto',
                change_photo_overlay: 'Cambiar foto',
                name_label: 'Nombre:',
                specialty_label: 'Especialidad:',
                suitability_label: 'Idoneidad:',
                studies_label: 'Estudios:',
                description_label: 'Descripción:',
                phone_label: 'Teléfono:',
                location_label: 'Ubicación:',
                return_home_button: 'Regresar al Home',
                edit_profile_button: 'Editar Perfil',
                edit_profile_modal_title: 'Editar Perfil',
                modal_specialty_label: 'Especialidad',
                modal_select_specialty_option: 'Seleccione especialidad',
                modal_cardiology_option: 'Cardiología',
                modal_pediatrics_option: 'Pediatría',
                modal_dermatology_option: 'Dermatología',
                modal_suitability_label: 'Idoneidad',
                modal_studies_label: 'Estudios',
                modal_description_label: 'Descripción',
                modal_phone_label: 'Teléfono',
                modal_location_label: 'Ubicación',
                modal_save_changes_button: 'Guardar Cambios',
                modal_cancel_button: 'Cancelar'
            },
            en: {
                pageTitle: 'Doctor Profile',
                change_photo_title: 'Click to change photo',
                change_photo_overlay: 'Change photo',
                name_label: 'Name:',
                specialty_label: 'Specialty:',
                suitability_label: 'Suitability:',
                studies_label: 'Studies:',
                description_label: 'Description:',
                phone_label: 'Phone:',
                location_label: 'Location:',
                return_home_button: 'Return to Home',
                edit_profile_button: 'Edit Profile',
                edit_profile_modal_title: 'Edit Profile',
                modal_specialty_label: 'Specialty',
                modal_select_specialty_option: 'Select specialty',
                modal_cardiology_option: 'Cardiology',
                modal_pediatrics_option: 'Pediatrics',
                modal_dermatology_option: 'Dermatology',
                modal_suitability_label: 'Suitability',
                modal_studies_label: 'Studies',
                modal_description_label: 'Description:',
                modal_phone_label: 'Phone',
                modal_location_label: 'Location',
                modal_save_changes_button: 'Save Changes',
                modal_cancel_button: 'Cancel'
            }
        };
        
        const texts = translations[lang];
        
        if (texts) {
            // Traducir el título de la página
            const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
            if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;

            // Traducción de labels, botones, y otros elementos estáticos por data-text-key
            document.querySelectorAll('[data-text-key]').forEach(element => {
                const key = element.getAttribute('data-text-key');
                if (key && texts[key]) {
                    // Traducción de placeholders para inputs/textareas
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        if (element.placeholder !== undefined) {
                            element.placeholder = texts[key];
                        }
                    } 
                    // Traducción de atributos title
                    else if (element.hasAttribute('title')) {
                        element.title = texts[key];
                    }
                    // Traducción de texto para la mayoría de los elementos
                    else if (!element.classList.contains('dynamic-value')) { // Evitar sobrescribir valores dinámicos
                        element.textContent = texts[key];
                    }
                }
            });

            // Traducción de las opciones del select
            const specialtySelect = document.getElementById('especialidad');
            if (specialtySelect) {
                Array.from(specialtySelect.options).forEach(option => {
                    const optionKey = option.getAttribute('data-text-key');
                    if (optionKey && texts[optionKey]) {
                        option.textContent = texts[optionKey];
                    }
                });
            }

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