document.addEventListener('DOMContentLoaded', function() {
    // Referencias
    const btnEditar = document.getElementById('btnEditar');
    const modal = document.getElementById('modal');
    const btnCancelarModal = document.getElementById('btnCancelarModal');

    // Abrir modal
    if (btnEditar) {
        btnEditar.addEventListener('click', function() {
            modal.style.display = 'flex'; // Mostrar modal
            modal.setAttribute('aria-hidden', 'false');
        });
    }

    // Cerrar modal con botón cancelar
    if (btnCancelarModal) {
        btnCancelarModal.addEventListener('click', function() {
            modal.style.display = 'none'; // Ocultar modal
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    // Cerrar modal al hacer click fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    // Cerrar modal con tecla Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    // ============ Menú de idiomas y traducción ============
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
                pageTitle: 'Perfil Paciente',
                name_label: 'Nombre:',
                birthdate_label: 'Fecha de nacimiento:',
                id_number_label: 'Cédula:',
                gender_label: 'Género:',
                phone_label: 'Teléfono:',
                allergies_label: 'Alergias:',
                diseases_label: 'Enfermedades:',
                current_meds_label: 'Medicamentos actuales:',
                surgical_history_label: 'Antecedentes quirúrgicos:',
                return_home_button: 'Regresar al Home',
                edit_profile_button: 'Editar Perfil',
                edit_profile_modal_title: 'Editar Perfil',
                modal_id_number_label: 'Cédula',
                modal_phone_label: 'Teléfono',
                modal_allergies_label: 'Alergias',
                modal_diseases_label: 'Enfermedades',
                modal_current_meds_label: 'Medicamentos actuales',
                modal_surgical_history_label: 'Antecedentes quirúrgicos',
                modal_save_changes_button: 'Guardar Cambios',
                modal_cancel_button: 'Cancelar'
            },
            en: {
                pageTitle: 'Patient Profile',
                name_label: 'Name:',
                birthdate_label: 'Birthdate:',
                id_number_label: 'ID Number:',
                gender_label: 'Gender:',
                phone_label: 'Phone:',
                allergies_label: 'Allergies:',
                diseases_label: 'Diseases:',
                current_meds_label: 'Current Medications:',
                surgical_history_label: 'Surgical History:',
                return_home_button: 'Return to Home',
                edit_profile_button: 'Edit Profile',
                edit_profile_modal_title: 'Edit Profile',
                modal_id_number_label: 'ID Number',
                modal_phone_label: 'Phone',
                modal_allergies_label: 'Allergies',
                modal_diseases_label: 'Diseases',
                modal_current_meds_label: 'Current Medications',
                modal_surgical_history_label: 'Surgical History',
                modal_save_changes_button: 'Save Changes',
                modal_cancel_button: 'Cancel'
            }
        };

        const texts = translations[lang];

        if (texts) {
            // Cambiar título página
            const pageTitleElement = document.querySelector('title[data-text-key="pageTitle"]');
            if (pageTitleElement) pageTitleElement.textContent = texts.pageTitle;

            // Traducir labels en .profile-data
            document.querySelectorAll('.profile-data p strong[data-text-key]').forEach(el => {
                const key = el.getAttribute('data-text-key');
                if (key && texts[key]) el.textContent = texts[key];
            });

            // Botones principales
            const returnHomeButton = document.querySelector('.btn-regresar[data-text-key="return_home_button"]');
            if (returnHomeButton) returnHomeButton.textContent = texts.return_home_button;

            const editProfileButton = document.querySelector('.edit-btn[data-text-key="edit_profile_button"]');
            if (editProfileButton) editProfileButton.textContent = texts.edit_profile_button;

            // Modal título
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = texts.edit_profile_modal_title;

            // Labels en modal
            document.querySelectorAll('.modal-content .form-group label[data-text-key]').forEach(labelEl => {
                const key = labelEl.getAttribute('data-text-key');
                if (key && texts[key]) labelEl.textContent = texts[key];
            });

            // Botones modal
            const saveChangesButton = document.querySelector('.save-btn[data-text-key="modal_save_changes_button"]');
            if (saveChangesButton) saveChangesButton.textContent = texts.modal_save_changes_button;

            const cancelModalButton = document.querySelector('.cancel-btn[data-text-key="modal_cancel_button"]');
            if (cancelModalButton) cancelModalButton.textContent = texts.modal_cancel_button;

            // Cambiar atributo lang
            document.documentElement.lang = lang;
        }
    }

    // Cargar idioma guardado o detectar idioma navegador
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
        changeLanguage(savedLanguage);
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        const detectedLang = browserLang.startsWith('es') ? 'es' : 'en';
        changeLanguage(detectedLang);
    }
});
