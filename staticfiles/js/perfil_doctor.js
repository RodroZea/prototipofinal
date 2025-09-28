document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar modal de edición
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
 
    // Cambiar foto de perfil
    if (fotoWrapper && fotoInput) {
        fotoWrapper.addEventListener('click', function() {
            fotoInput.click(); // Abrir selector de archivos
        });
 
        fotoInput.addEventListener('change', function() {
            const fotoForm = document.getElementById('fotoForm');
            if (fotoForm) {
                fotoForm.submit();
            }
        });
    }
 
    // =========================
    // Traducción y menú idiomas
    // =========================
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
                save: 'guardar',
                name_label: 'Nombre:',
                specialty_label: 'Especialidad:',
                suitability_label: 'Idoneidad:',
                studies_label: 'Estudios:',
                description_label: 'Descripción:',
                phone_label: 'Teléfono:',
                location_label: 'Ubicación:',
                return_home_button: 'Regresar',
               
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
                modal_cancel_button: 'Cancelar',
                recomendado_button:"Quieres ser recomendado?",
            },
            en: {
                pageTitle: 'Doctor Profile',
                change_photo_title: 'Click to change photo',
                change_photo_overlay: 'Change photo',
                save: 'Save',
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
                modal_description_label: 'Description',
                modal_phone_label: 'Phone',
                modal_location_label: 'Location',
                modal_save_changes_button: 'Save Changes',
                modal_cancel_button: 'Cancel',
                recomendado_button:"Do you want to be suggested?",
            }
        };
 
        const texts = translations[lang];
 
        if (texts) {
            // Cambiar título página
            const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
            if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;
 
            // Cambiar etiquetas fuertes de profile-data
            const profileDataStrongLabels = {
                'name_label': document.querySelector('.profile-data strong[data-text-key="name_label"]'),
                'specialty_label': document.querySelector('.profile-data strong[data-text-key="specialty_label"]'),
                'suitability_label': document.querySelector('.profile-data strong[data-text-key="suitability_label"]'),
                'studies_label': document.querySelector('.profile-data strong[data-text-key="studies_label"]'),
                'description_label': document.querySelector('.profile-data strong[data-text-key="description_label"]'),
                'phone_label': document.querySelector('.profile-data strong[data-text-key="phone_label"]'),
                'location_label': document.querySelector('.profile-data strong[data-text-key="location_label"]')
            };
 
            for (const key in profileDataStrongLabels) {
                if (profileDataStrongLabels[key]) {
                    profileDataStrongLabels[key].textContent = texts[key];
                }
            }
 
            // Botones y enlaces
            const returnHomeButton = document.querySelector('.btn-regresar[data-text-key="return_home_button"]');
            if (returnHomeButton) returnHomeButton.textContent = texts.return_home_button;
 
            const editProfileButton = document.querySelector('.edit-btn[data-text-key="edit_profile_button"]');
            if (editProfileButton) editProfileButton.textContent = texts.edit_profile_button;
 
            // Modal
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = texts.edit_profile_modal_title;
 
            const modalLabels = {
                'modal_specialty_label': document.querySelector('label[for="especialidad"][data-text-key="modal_specialty_label"]'),
                'modal_suitability_label': document.querySelector('label[for="idoneidad"][data-text-key="modal_suitability_label"]'),
                'modal_studies_label': document.querySelector('label[for="estudios"][data-text-key="modal_studies_label"]'),
                'modal_description_label': document.querySelector('label[for="descripcion"][data-text-key="modal_description_label"]'),
                'modal_phone_label': document.querySelector('label[for="phone"][data-text-key="modal_phone_label"]'),
                'modal_location_label': document.querySelector('label[for="ubicacion"][data-text-key="modal_location_label"]')
            };
 
            for (const key in modalLabels) {
                if (modalLabels[key]) {
                    modalLabels[key].textContent = texts[key];
                }
            }
 
            // Opciones del select especialidad
            const specialtySelect = document.getElementById('especialidad');
            if (specialtySelect) {
                Array.from(specialtySelect.options).forEach(option => {
                    const optionKey = option.getAttribute('data-text-key');
                    if (optionKey && texts[optionKey]) {
                        option.textContent = texts[optionKey];
                    }
                });
            }
 
            // Botones modal guardar/cancelar
            const saveChangesButton = document.querySelector('.save-btn[data-text-key="modal_save_changes_button"]');
            if (saveChangesButton) saveChangesButton.textContent = texts.modal_save_changes_button;
 
            const cancelModalButton = document.querySelector('.cancel-btn[data-text-key="modal_cancel_button"]');
            if (cancelModalButton) cancelModalButton.textContent = texts.modal_cancel_button;
 
            // Overlay y título de la foto
            const fotoOverlay = document.querySelector('.foto-overlay[data-text-key="change_photo_overlay"]');
            if (fotoOverlay) fotoOverlay.textContent = texts.change_photo_overlay;
 
            const fotoWrapperTitle = document.querySelector('.foto-wrapper[data-text-key="change_photo_title"]');
            if (fotoWrapperTitle) fotoWrapperTitle.title = texts.change_photo_title;
 
            // Cambiar atributo lang en documento
            document.documentElement.lang = lang;
        }
    }
 
    // Cargar idioma guardado o por defecto
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        changeLanguage(savedLanguage);
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
        changeLanguage(detectedLang);
    }
});
 
 