document.addEventListener('DOMContentLoaded', () => {
  // Lógica de animaciones (existente)
  const textos = 'h1, h2, h3, p, ul li, ol li'; // Agregamos ol li
  const todo = Array.from(document.querySelectorAll(textos));
 
  const imagenes = Array.from(document.querySelectorAll('img'))
    .filter(img => !img.closest('nav') && !img.closest('footer') && !img.closest('.barra-navegacion') && !img.closest('.main-footer'));
 
  const zona = elem => elem.closest('.barra-navegacion') || elem.closest('.main-footer');
 
  const animar = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        const elem = entrada.target;
        if (elem.tagName.toLowerCase() === 'img') {
          const num = imagenes.indexOf(elem);
          if (num % 2 === 0) {
            elem.classList.add('visible', 'fade-in-right');
          } else {
            elem.classList.add('visible', 'fade-in-left');
          }
        } else {
          // Para texto, aplicamos la animación a todos los elementos observados
          elem.classList.add('visible', 'fade-in-right'); // Opcional, puedes alternar o usar solo una
        }
        elem.classList.remove('pre-animate');
        observer.unobserve(elem);
      }
    });
  }, { threshold: 0.15 });
 
  todo.forEach(elem => {
    if (!zona(elem)) {
      elem.classList.add('pre-animate');
      animar.observe(elem);
    }
  });
 
  imagenes.forEach(img => {
    img.classList.add('pre-animate');
    animar.observe(img);
  });
 
  // se utiliza para girar las flip-cards
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('mouseover', () => {
      card.querySelector('.flip-card-inner').style.transform = 'rotateY(180deg)';
    });
    card.addEventListener('mouseout', () => {
      card.querySelector('.flip-card-inner').style.transform = 'rotateY(0deg)';
    });
  });
 
  // Esto es para que el boton rebote
  document.querySelectorAll('.main-footer button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('click-bounce');
      setTimeout(() => {
        btn.classList.remove('click-bounce');
      }, 300);
    });
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
        pageTitle: 'Información de la Compañía',
        searchPlaceholder: 'Buscar',
        registerButton: 'Registrarse',
        loginButton: 'Iniciar Sesión',
        homeNav: 'Inicio',
        featuresNav: 'Funcionalidades y Beneficios',
        aboutNav: 'Acerca de Nosotros',
        blogNav: 'Blog',
        image_main_rest: 'sleep_principal_esp.webp', // Asegúrate de tener esta imagen
        image_health_benefits: 'dormidaaa.webp', // Asegúrate de tener esta imagen
        image_benefit1_1: 'imagen_1.1.webp', // Asegúrate de tener esta imagen
        image_other_benefits: 'abuelitavenami_(1).webp', // Asegúrate de tener esta imagen
        image_poor_sleep_signs: 'sleep_cinco_esp.webp', // Asegúrate de tener esta imagen
        image_sleep_disorders: 'imagenseis_copia.webp', // Asegúrate de tener esta imagen
        image_assessment: 'sleep_siete_esp.webp', // Asegúrate de tener esta imagen
        section_paragraph_h2: '¿Sabes lo Vital que es un Buen Descanso?',
        section_paragraph_li_1: 'Dormir bien es esencial para nuestra salud y bienestar emocional.',
        section_paragraph_li_2: 'Dormir lo suficiente y tener un sueño de buena calidad son esenciales para un sueño saludable.',
        section_paragraph_li_3: 'La cantidad de sueño que necesitas cambia con la edad.',
        section_paragraph_li_4: 'Habla con tu proveedor de atención médica si tienes problemas para dormir.',
        benefit1_h2: 'Beneficios del sueño para la salud',
        benefit1_h3_1: 'Enfermarse menos a menudo',
        benefit1_p_1: 'El sueño de calidad fortalece tu sistema inmunológico, ayudándote a combatir virus e infecciones.',
        benefit1_h3_2: 'Mantener un peso saludable',
        benefit1_p_2: 'El sueño regula las hormonas que controlan el hambre y el apetito, ayudando a prevenir el aumento de peso.',
        benefit1_h3_3: 'Reducir el estrés y mejorar tu estado de ánimo',
        benefit1_p_3: 'Un descanso adecuado ayuda a manejar las emociones, reduce la irritabilidad y mejora la estabilidad emocional.',
        benefit2_h2: 'Otros Beneficios',
        benefit2_h3_1: 'Mejora la salud del corazón y el metabolismo',
        benefit2_p_1: 'El sueño profundo favorece una presión arterial saludable y la regulación del azúcar en sangre.',
        benefit2_h3_2: 'Reduce el riesgo de enfermedades crónicas como',
        benefit2_p_2: 'Diabetes tipo 2, enfermedades cardíacas, hipertensión, accidente cerebrovascular',
        benefit2_h3_3: 'Reduce el riesgo de accidentes automovilísticos y muertes relacionadas con lesiones',
        benefit2_p_3: 'Conducir con somnolencia ralentiza el tiempo de reacción y reduce la concentración, aumentando el riesgo de accidentes.',
        frase_h2: 'Estrategias para mejorar el sueño',
        frase_p: 'Mejorar los hábitos de sueño puede ayudarte a dormir bien. Algunos hábitos que pueden mejorar tu sueño incluyen:',
        sleep_quality_h3_1: '1. Acostarse y levantarse a la misma hora todos los días',
        sleep_quality_p_1: 'Mantener un horario de sueño constante ayuda a regular tu reloj interno y mejora la calidad del sueño.',
        sleep_quality_h3_2: '2. Mantener tu dormitorio tranquilo, relajante y fresco',
        sleep_quality_p_2: 'Un ambiente tranquilo y cómodo promueve un sueño más profundo e ininterrumpido.',
        sleep_quality_h3_3: '3. Apagar los dispositivos electrónicos al menos 30 minutos antes de acostarse',
        sleep_quality_p_3: 'La luz azul de las pantallas puede interferir con la producción de melatonina, dificultando conciliar el sueño.',
        sleep_quality_h3_4: '4. Evitar comidas pesadas y alcohol antes de acostarse',
        sleep_quality_p_4: 'Estos pueden alterar la digestión y provocar un sueño inquieto o fragmentado.',
        sleep_quality_h3_5: '5. Evitar la cafeína por la tarde o noche',
        sleep_quality_p_5: 'La cafeína es un estimulante que puede mantener tu mente alerta cuando debería estar relajándose.',
        sleep_quality_h3_6: '6. Hacer ejercicio regularmente y mantener una dieta saludable',
        sleep_quality_p_6: 'La actividad física y una nutrición equilibrada contribuyen a un sueño más reparador y de alta calidad.',
        poor_quality_h2: 'Los signos de mala calidad del sueño incluyen:',
        poor_quality_li_1_strong: 'Dificultad para conciliar el sueño:',
        poor_quality_li_1_text: ' Tardar más de 20 a 30 minutos en conciliar el sueño puede deberse a estrés, ansiedad, uso de pantallas antes de acostarse o una rutina de sueño irregular.',
        poor_quality_li_2_strong: 'Despertarse repetidamente durante la noche:',
        poor_quality_li_2_text: ' Los despertares frecuentes interrumpen el ciclo natural del sueño y pueden estar relacionados con la ansiedad, la apnea del sueño o un entorno incómodo.',
        poor_quality_li_3_strong: 'Sentirse somnoliento o cansado incluso después de dormir lo suficiente:',
        poor_quality_li_3_text: ' Incluso después de 7 a 9 horas, la fatiga puede indicar mala calidad del sueño, trastornos no diagnosticados o problemas como depresión o desequilibrios hormonales.',
        sleep_disorders_h2: 'Trastornos del Sueño',
        sleep_disorders_p: 'Algunas personas pueden tener problemas de salud que les impiden dormir bien, sin importar cuánto lo intenten. Estos problemas se llaman trastornos del sueño. Algunos de estos trastornos comunes del sueño son:',
        insomnia_h3: 'Insomnio',
        insomnia_p: 'Un trastorno del sueño caracterizado por dificultad para conciliar el sueño, mantenerse dormido o despertarse demasiado temprano, lo que provoca fatiga diurna y problemas de concentración.',
        restless_leg_h3: 'Síndrome de Piernas Inquietas',
        restless_leg_p: 'Una afección que causa una necesidad incontrolable de mover las piernas, generalmente por la noche, que a menudo interrumpe el sueño y causa molestias.',
        narcolepsy_h3: 'Narcolepsia',
        narcolepsy_p: 'Un trastorno neurológico crónico que afecta la capacidad del cerebro para regular los ciclos de sueño-vigilia, causando ataques repentinos de sueño y somnolencia diurna excesiva.',
        sleep_apnea_h3: 'Apnea del Sueño',
        sleep_apnea_p: 'Una afección grave en la que la respiración se detiene y se reanuda repetidamente durante el sueño, lo que a menudo conduce a un sueño deficiente, mala calidad del sueño y mayores riesgos para la salud.',
        sleep_diary_h2: 'Mantener un diario de sueño',
        sleep_diary_p: 'Tu diario de sueño debe incluir las horas en que:',
        flipcard_1_p: " Registrar cuándo te acuestas es fundamental porque establece la consistencia de tu hora de dormir. Un horario de acostarse consistente ayuda a regular el reloj interno de tu cuerpo (tu ritmo circadiano). Los horarios de sueño irregulares pueden alterar este ritmo, haciendo más difícil conciliar el sueño y despertarse de manera natural.",
        flipcard_1_img: 'sleep_diary1_esp.webp',
        flipcard_2_p: "Despertares frecuentes, incluso breves que quizás no recuerdes claramente, pueden indicar un sueño fragmentado y de mala calidad. Estos despertares podrían deberse a ruido, incomodidad o trastornos del sueño subyacentes como la apnea del sueño, el síndrome de piernas inquietas o incluso simplemente la ansiedad.",
        flipcard_2_img: 'sleep_diary2_esp.webp',
        flipcard_3_p: "Enumerar todos los medicamentos que tomas (incluyendo los de prescripción, los de venta libre y los suplementos, junto con la hora en que los tomas) es extremadamente importante. Muchos medicamentos pueden tener efectos secundarios relacionados con el sueño, ya sea causando insomnio, somnolencia excesiva o alterando tus ciclos de sueño.",
        flipcard_3_img: 'sleep_diary3_esp.webp',
        flipcard_4_p: 'Los detalles sobre cuándo haces ejercicio (y su intensidad) son valiosos para entender su efecto en el inicio y la calidad de tu sueño. La actividad física regular generalmente promueve un mejor sueño, pero hacer ejercicio demasiado cerca de la hora de dormir puede estimular y aumentar la temperatura central de tu cuerpo, dificultando que te duermas.',
        flipcard_4_img: 'sleep_diary4_esp.webp',
        flipcard_5_p: "Registrar tus siestas es importante porque las siestas pueden afectar significativamente tu impulso de sueño nocturno. Aunque las siestas cortas pueden ser beneficiosas, las siestas largas o por la tarde pueden reducir la presión para dormir por la noche, haciendo más difícil conciliar el sueño o mantenerse dormido cuando es hora de ir a la cama.",
        flipcard_5_img: 'sleep_diary5_esp.webp',
        flipcard_6_p: "Registrar tu consumo de alcohol o bebidas con cafeína es vital porque ambos son sustancias poderosas que impactan directamente tu arquitectura del sueño. La cafeína es un estimulante que puede retrasar el inicio del sueño y reducir el sueño profundo. El alcohol, aunque inicialmente sedante, a menudo conduce a un sueño fragmentado y despertares frecuentes.",
        flipcard_6_img: 'sleep_diary6_esp.webp',
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
        pageTitle: 'Company Info',
        searchPlaceholder: 'Search',
        registerButton: 'Register',
        loginButton: 'Login',
        homeNav: 'Home',
        featuresNav: 'Features and Benefits',
        aboutNav: 'About Us',
        blogNav: 'Blog',
        image_main_rest: 'REST_ingles.webp',
        image_health_benefits: 'dormidaaa.webp',
        image_benefit1_1: 'imagen_1.1.webp',
        image_other_benefits: 'abuelitavenami_(1).webp',
        image_poor_sleep_signs: 'imagen.webp',
        image_sleep_disorders: 'imagenseis_copia.webp', // No hay imagen específica para este en el HTML original
        image_assessment: 'assesment.webp',
        section_paragraph_h2: 'Do You Know How Vital Good Rest Is?',
        section_paragraph_li_1: 'Sleeping well is essential for our health and emotional well-being.',
        section_paragraph_li_2: 'Getting enough sleep and having good quality sleep are essential for healthy sleep.',
        section_paragraph_li_3: 'The amount of sleep you need changes as you age.',
        section_paragraph_li_4: 'Talk to your healthcare provider if you have trouble sleeping.',
        benefit1_h2: 'Health benefits of sleep',
        benefit1_h3_1: 'Get sick less often',
        benefit1_p_1: 'Quality sleep strengthens your immune system, helping you fight off viruses and infections.',
        benefit1_h3_2: 'Maintain a healthy weight',
        benefit1_p_2: 'Sleep regulates the hormones that control hunger and appetite, helping prevent weight gain.',
        benefit1_h3_3: 'Reduce stress and improve your mood',
        benefit1_p_3: 'Proper rest helps manage emotions, reduces irritability, and improves emotional stability.',
        benefit2_h2: 'Others Benefits',
        benefit2_h3_1: 'Improve your heart health and metabolism',
        benefit2_p_1: 'Deep sleep supports healthy blood pressure and blood sugar regulation.',
        benefit2_h3_2: 'Reduce the risk of chronic diseases such as',
        benefit2_p_2: 'Type 2 diabetes, Heart disease, Hypertension, Stroke',
        benefit2_h3_3: 'Reduce the risk of car accidents and injury-related deaths',
        benefit2_p_3: 'Drowsy driving slows reaction time and reduces focus, increasing accident risk.',
        frase_h2: 'Strategies to improve sleep',
        frase_p: 'Improving sleep habits can help you sleep well. Some habits that can improve your sleep include:',
        sleep_quality_h3_1: '1. Going to bed and waking up at the same time every day',
        sleep_quality_p_1: 'Maintaining a consistent sleep schedule helps regulate your internal clock and improves sleep quality.',
        sleep_quality_h3_2: '2. Keeping your bedroom quiet, relaxing, and cool',
        sleep_quality_p_2: 'A calm and comfortable environment promotes deeper, uninterrupted sleep.',
        sleep_quality_h3_3: '3. Turning off electronic devices at least 30 minutes before bedtime',
        sleep_quality_p_3: 'Blue light from screens can interfere with melatonin production, making it harder to fall asleep.',
        sleep_quality_h3_4: '4. Avoiding heavy meals and alcohol before bed',
        sleep_quality_p_4: 'These can disrupt digestion and lead to restless or fragmented sleep.',
        sleep_quality_h3_5: '5. Avoiding caffeine in the afternoon or evening',
        sleep_quality_p_5: 'Caffeine is a stimulant that can keep your mind alert when it should be winding down.',
        sleep_quality_h3_6: '6. Exercising regularly and maintaining a healthy diet',
        sleep_quality_p_6: 'Physical activity and balanced nutrition contribute to more restorative and high-quality sleep.',
        poor_quality_h2: 'Signs of poor sleep quality include:',
        poor_quality_li_1_strong: 'Difficulty falling asleep:',
        poor_quality_li_1_text: ' Taking more than 20–30 minutes to fall asleep may be due to stress, anxiety, screen use before bed, or an irregular bedtime routine.',
        poor_quality_li_2_strong: 'Waking up repeatedly during the night:',
        poor_quality_li_2_text: ' Frequent awakenings disrupt the natural sleep cycle and may be linked to anxiety, sleep apnea, or an uncomfortable environment.',
        poor_quality_li_3_strong: 'Feeling sleepy or tired even after enough sleep:',
        poor_quality_li_3_text: ' Even after 7 to 9 hours, fatigue may indicate poor sleep quality, undiagnosed disorders, or issues like depression or hormonal imbalances.',
        sleep_disorders_h2: 'Sleep Disorders',
        sleep_disorders_p: 'Some people may have health problems that prevent them from sleeping well, no matter how hard they try. These problems are called sleep disorders. Some of this common sleep disorders are:',
        insomnia_h3: 'Insomnia',
        insomnia_p: 'A sleep disorder characterized by difficulty falling asleep, staying asleep, or waking up too early, leading to daytime fatigue and concentration problems.',
        restless_leg_h3: 'Restless Leg Syndrome',
        restless_leg_p: 'A condition causing an uncontrollable urge to move the legs, usually in the evening or night, often disrupting sleep and causing discomfort.',
        narcolepsy_h3: 'Narcolepsy',
        narcolepsy_p: 'A chronic neurological disorder that affects the brain\'s ability to regulate sleep–wake cycles, causing sudden sleep attacks and excessive daytime sleepiness.',
        sleep_apnea_h3: 'Sleep Apnea',
        sleep_apnea_p: 'A serious condition where breathing repeatedly stops and starts during sleep, often leading to poor sleep, poor sleep quality, and increased health risks.',
        sleep_diary_h2: 'Keeping a sleep diary',
        sleep_diary_p: 'Your sleep diary should include the times when you:',
        flipcard_1_p:"Tracking when you go to bed is fundamental because it establishes your bedtime consistency. A consistent bedtime helps regulate your body's internal clock (your circadian rhythm). Irregular bedtimes can throw this rhythm off, making it harder to fall asleep and wake up naturally.",
        flipcard_2_p: "Frequent awakenings, even brief ones you might not remember clearly, can indicate a fragmented and poor quality of sleep. These awakenings could be due to noise, discomfort, or underlying sleep disorders like sleep apnea, restless legs syndrome, or even just anxiety.",
        flipcard_2_img: 'despertar.webp',
        flipcard_3_p: "Listing all the medications you take (including prescription, over the counter, and supplements, along with the time you take them) is extremely important. Many medications can have sleep-related side effects, either causing insomnia, excessive drowsiness, or altering your sleep cycles.",
        flipcard_4_p: "Details about when you exercise (and its intensity) are valuable for understanding its effect on your sleep onset and quality. Regular physical activity generally promotes better sleep, but exercising too close to bedtime can stimulate and raise your core body temperature, making it difficult to fall asleep.  ",
        flipcard_4_img: 'ejercicio.webp',
        flipcard_5_p: "Logging your naps is important because naps can significantly impact your nighttime sleep drive. While short power naps can be beneficial, long or late-afternoon naps can reduce the pressure to sleep at night, making it harder to fall asleep or stay asleep when it's time for bed. ",
        flipcard_5_img: 'nap.webp',
        flipcard_6_p: "Recording your consumption of alcohol or caffeinated drinks (including the amount and time) is vital because both are powerful substances that directly impact your sleep architecture. Caffeine is a stimulant that can delay sleep onset and reduce deep sleep. Alcohol, while initially sedating, often leads to fragmented sleep and frequent awakenings",
        flipcard_6_img: 'alcohol.webp',
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
      
      //console.log('detectado2',imageKey);
      const loginButton = document.querySelector('.boton-login');
      if(loginButton) loginButton.textContent = texts.loginButton;
      //console.log('detectado1',imageKey);
      // Cambiar navegación
      document.querySelectorAll('.barra-navegacion ul li a').forEach(link => {
        const key = link.getAttribute('data-nav-key');
        if (key && texts[key]) {
            link.textContent = texts[key];
        }
      });
      
      // Traducción de imágenes principales
document.querySelectorAll('img[data-image-key]').forEach(img => {
  const imageKey = img.getAttribute('data-image-key');
  const imageFile = texts[imageKey];
 
  console.log(` Imagen detectada: ${imageKey} → ${imageFile}`);
 
  if (imageFile) {
    img.src = `/static/images/${imageFile}`;
  } else {
    console.warn(`No se encontró traducción para la imagen "${imageKey}"`);
  }
});
 
 
      // Contenido principal: "Do You Know How Vital Good Rest Is?"
      const sectionParagraphH2 = document.querySelector('.seccion_parrafo h2[data-text-key="section_paragraph_h2"]');
      if(sectionParagraphH2) sectionParagraphH2.textContent = texts.section_paragraph_h2;
 
      const sectionParagraphLIs = document.querySelectorAll('.seccion_parrafo ul li');
      if(sectionParagraphLIs[0]) sectionParagraphLIs[0].textContent = texts.section_paragraph_li_1;
      if(sectionParagraphLIs[1]) sectionParagraphLIs[1].textContent = texts.section_paragraph_li_2;
      if(sectionParagraphLIs[2]) sectionParagraphLIs[2].textContent = texts.section_paragraph_li_3;
      if(sectionParagraphLIs[3]) sectionParagraphLIs[3].textContent = texts.section_paragraph_li_4;
 
      // Benefit 1
      const benefit1H2 = document.querySelector('.benefit1-1 h2[data-text-key="benefit1_h2"]');
      if(benefit1H2) benefit1H2.textContent = texts.benefit1_h2;
      const benefit1H3_1 = document.querySelector('.benefit1-1 h3[data-text-key="benefit1_h3_1"]');
      if(benefit1H3_1) benefit1H3_1.textContent = texts.benefit1_h3_1;
      const benefit1P_1 = document.querySelector('.benefit1-1 p[data-text-key="benefit1_p_1"]');
      if(benefit1P_1) benefit1P_1.textContent = texts.benefit1_p_1;
      const benefit1H3_2 = document.querySelector('.benefit1-1 h3[data-text-key="benefit1_h3_2"]');
      if(benefit1H3_2) benefit1H3_2.textContent = texts.benefit1_h3_2;
      const benefit1P_2 = document.querySelector('.benefit1-1 p[data-text-key="benefit1_p_2"]');
      if(benefit1P_2) benefit1P_2.textContent = texts.benefit1_p_2;
      const benefit1H3_3 = document.querySelector('.benefit1-1 h3[data-text-key="benefit1_h3_3"]');
      if(benefit1H3_3) benefit1H3_3.textContent = texts.benefit1_h3_3;
      const benefit1P_3 = document.querySelector('.benefit1-1 p[data-text-key="benefit1_p_3"]');
      if(benefit1P_3) benefit1P_3.textContent = texts.benefit1_p_3;
 
      // Benefit 2
      const benefit2H2 = document.querySelector('.benefit2-2 h2[data-text-key="benefit2_h2"]');
      if(benefit2H2) benefit2H2.textContent = texts.benefit2_h2;
      const benefit2H3_1 = document.querySelector('.benefit2-2 h3[data-text-key="benefit2_h3_1"]');
      if(benefit2H3_1) benefit2H3_1.textContent = texts.benefit2_h3_1;
      const benefit2P_1 = document.querySelector('.benefit2-2 p[data-text-key="benefit2_p_1"]');
      if(benefit2P_1) benefit2P_1.textContent = texts.benefit2_p_1;
      const benefit2H3_2 = document.querySelector('.benefit2-2 h3[data-text-key="benefit2_h3_2"]');
      if(benefit2H3_2) benefit2H3_2.textContent = texts.benefit2_h3_2;
      const benefit2P_2 = document.querySelector('.benefit2-2 p[data-text-key="benefit2_p_2"]');
      if(benefit2P_2) benefit2P_2.textContent = texts.benefit2_p_2;
      const benefit2H3_3 = document.querySelector('.benefit2-2 h3[data-text-key="benefit2_h3_3"]');
      if(benefit2H3_3) benefit2H3_3.textContent = texts.benefit2_h3_3;
      const benefit2P_3 = document.querySelector('.benefit2-2 p[data-text-key="benefit2_p_3"]');
      if(benefit2P_3) benefit2P_3.textContent = texts.benefit2_p_3;
 
      // Frase section
      const fraseH2 = document.querySelector('.frase h2[data-text-key="frase_h2"]');
      if(fraseH2) fraseH2.textContent = texts.frase_h2;
      const fraseP = document.querySelector('.frase p[data-text-key="frase_p"]');
      if(fraseP) fraseP.textContent = texts.frase_p;
 
      // Sleep Quality List
      const sleepQualityH3_1 = document.querySelector('.sleep-quality-list h3[data-text-key="sleep_quality_h3_1"]');
      if(sleepQualityH3_1) sleepQualityH3_1.textContent = texts.sleep_quality_h3_1;
      const sleepQualityP_1 = document.querySelector('.sleep-quality-list p[data-text-key="sleep_quality_p_1"]');
      if(sleepQualityP_1) sleepQualityP_1.textContent = texts.sleep_quality_p_1;
 
      const sleepQualityH3_2 = document.querySelector('.sleep-quality-list h3[data-text-key="sleep_quality_h3_2"]');
      if(sleepQualityH3_2) sleepQualityH3_2.textContent = texts.sleep_quality_h3_2;
      const sleepQualityP_2 = document.querySelector('.sleep-quality-list p[data-text-key="sleep_quality_p_2"]');
      if(sleepQualityP_2) sleepQualityP_2.textContent = texts.sleep_quality_p_2;
 
      const sleepQualityH3_3 = document.querySelector('.sleep-quality-list h3[data-text-key="sleep_quality_h3_3"]');
      if(sleepQualityH3_3) sleepQualityH3_3.textContent = texts.sleep_quality_h3_3;
      const sleepQualityP_3 = document.querySelector('.sleep-quality-list p[data-text-key="sleep_quality_p_3"]');
      if(sleepQualityP_3) sleepQualityP_3.textContent = texts.sleep_quality_p_3;
 
      const sleepQualityH3_4 = document.querySelector('.sleep-quality-list h3[data-text-key="sleep_quality_h3_4"]');
      if(sleepQualityH3_4) sleepQualityH3_4.textContent = texts.sleep_quality_h3_4;
      const sleepQualityP_4 = document.querySelector('.sleep-quality-list p[data-text-key="sleep_quality_p_4"]');
      if(sleepQualityP_4) sleepQualityP_4.textContent = texts.sleep_quality_p_4;
 
      const sleepQualityH3_5 = document.querySelector('.sleep-quality-list h3[data-text-key="sleep_quality_h3_5"]');
      if(sleepQualityH3_5) sleepQualityH3_5.textContent = texts.sleep_quality_h3_5;
      const sleepQualityP_5 = document.querySelector('.sleep-quality-list p[data-text-key="sleep_quality_p_5"]');
      if(sleepQualityP_5) sleepQualityP_5.textContent = texts.sleep_quality_p_5;
 
      const sleepQualityH3_6 = document.querySelector('.sleep-quality-list h3[data-text-key="sleep_quality_h3_6"]');
      if(sleepQualityH3_6) sleepQualityH3_6.textContent = texts.sleep_quality_h3_6;
      const sleepQualityP_6 = document.querySelector('.sleep-quality-list p[data-text-key="sleep_quality_p_6"]');
      if(sleepQualityP_6) sleepQualityP_6.textContent = texts.sleep_quality_p_6;
      
      // Poor Quality section
      const poorQualityH2 = document.querySelector('.class_poor_quality h2[data-text-key="poor_quality_h2"]');
      if(poorQualityH2) poorQualityH2.textContent = texts.poor_quality_h2;
 
      const poorQualityLI1Strong = document.querySelector('.class_poor_quality li strong[data-text-key="poor_quality_li_1_strong"]');
      if(poorQualityLI1Strong) poorQualityLI1Strong.textContent = texts.poor_quality_li_1_strong;
      const poorQualityLI1Text = document.querySelector('.class_poor_quality li span[data-text-key="poor_quality_li_1_text"]');
      if(poorQualityLI1Text) poorQualityLI1Text.textContent = texts.poor_quality_li_1_text;
 
      const poorQualityLI2Strong = document.querySelector('.class_poor_quality li strong[data-text-key="poor_quality_li_2_strong"]');
      if(poorQualityLI2Strong) poorQualityLI2Strong.textContent = texts.poor_quality_li_2_strong;
      const poorQualityLI2Text = document.querySelector('.class_poor_quality li span[data-text-key="poor_quality_li_2_text"]');
      if(poorQualityLI2Text) poorQualityLI2Text.textContent = texts.poor_quality_li_2_text;
 
      const poorQualityLI3Strong = document.querySelector('.class_poor_quality li strong[data-text-key="poor_quality_li_3_strong"]');
      if(poorQualityLI3Strong) poorQualityLI3Strong.textContent = texts.poor_quality_li_3_strong;
      const poorQualityLI3Text = document.querySelector('.class_poor_quality li span[data-text-key="poor_quality_li_3_text"]');
      if(poorQualityLI3Text) poorQualityLI3Text.textContent = texts.poor_quality_li_3_text;
 
      const sleepDisordersH2 = document.querySelector('#Sleepdesorder[data-text-key="sleep_disorders_h2"]');
      if(sleepDisordersH2) sleepDisordersH2.textContent = texts.sleep_disorders_h2;
      const sleepDisordersP = document.querySelector('.class_poor_quality p[data-text-key="sleep_disorders_p"]');
      if(sleepDisordersP) sleepDisordersP.textContent = texts.sleep_disorders_p;
 
      // Contenido div 2
      const insomniaH3 = document.querySelector('.contenido_div2_1 h3[data-text-key="insomnia_h3"]');
      if(insomniaH3) insomniaH3.textContent = texts.insomnia_h3;
      const insomniaP = document.querySelector('.contenido_div2_1 p[data-text-key="insomnia_p"]');
      if(insomniaP) insomniaP.textContent = texts.insomnia_p;
 
      const restlessLegH3 = document.querySelector('.contenido_div2_1 h3[data-text-key="restless_leg_h3"]');
      if(restlessLegH3) restlessLegH3.textContent = texts.restless_leg_h3;
      const restlessLegP = document.querySelector('.contenido_div2_1 p[data-text-key="restless_leg_p"]');
      if(restlessLegP) restlessLegP.textContent = texts.restless_leg_p;
 
      const narcolepsyH3 = document.querySelector('.contenido_div2_1 h3[data-text-key="narcolepsy_h3"]');
      if(narcolepsyH3) narcolepsyH3.textContent = texts.narcolepsy_h3;
      const narcolepsyP = document.querySelector('.contenido_div2_1 p[data-text-key="narcolepsy_p"]');
      if(narcolepsyP) narcolepsyP.textContent = texts.narcolepsy_p;
 
      const sleepApneaH3 = document.querySelector('.contenido_div2_1 h3[data-text-key="sleep_apnea_h3"]');
      if(sleepApneaH3) sleepApneaH3.textContent = texts.sleep_apnea_h3;
      const sleepApneaP = document.querySelector('.contenido_div2_1 p[data-text-key="sleep_apnea_p"]');
      if(sleepApneaP) sleepApneaP.textContent = texts.sleep_apnea_p;
 
      // Contenido div 3 (Sleep Diary)
      const sleepDiaryH2 = document.querySelector('.contenido_div3 h2[data-text-key="sleep_diary_h2"]');
      if(sleepDiaryH2) sleepDiaryH2.textContent = texts.sleep_diary_h2;
      const sleepDiaryP = document.querySelector('.contenido_div3 p[data-text-key="sleep_diary_p"]');
      if(sleepDiaryP) sleepDiaryP.textContent = texts.sleep_diary_p;
 
      // Flipcards (solo texto de los párrafos)
      const flipcardP1 = document.querySelector('.flip-card:nth-child(1) .flip-card-back p[data-text-key="flipcard_1_p"]');
      if(flipcardP1) flipcardP1.textContent = texts.flipcard_1_p;
      const flipcardP2 = document.querySelector('.flip-card:nth-child(2) .flip-card-back p[data-text-key="flipcard_2_p"]');
      if(flipcardP2) flipcardP2.textContent = texts.flipcard_2_p;
      const flipcardP3 = document.querySelector('.flip-card:nth-child(3) .flip-card-back p[data-text-key="flipcard_3_p"]');
      if(flipcardP3) flipcardP3.textContent = texts.flipcard_3_p;
      const flipcardP4 = document.querySelector('.flip-card:nth-child(4) .flip-card-back p[data-text-key="flipcard_4_p"]');
      if(flipcardP4) flipcardP4.textContent = texts.flipcard_4_p;
      const flipcardP5 = document.querySelector('.flip-card:nth-child(5) .flip-card-back p[data-text-key="flipcard_5_p"]');
      if(flipcardP5) flipcardP5.textContent = texts.flipcard_5_p;
      const flipcardP6 = document.querySelector('.flip-card:nth-child(6) .flip-card-back p[data-text-key="flipcard_6_p"]');
      if(flipcardP6) flipcardP6.textContent = texts.flipcard_6_p;
 
 
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
        
        const links = footerColumns[1].querySelectorAll('.footer-links li a'); // Removido data-text-key del selector para ser más general
        if(links[0]) links[0].textContent = texts.footer_link_home;
        if(links[1]) links[1].textContent = texts.footer_link_pages;
        if(links[2]) links[2].textContent = texts.footer_link_services;
        if(links[3]) links[3].textContent = texts.footer_link_portfolio;
        if(links[4]) links[4].textContent = texts.footer_link_blog;
        if(links[5]) links[5].textContent = texts.footer_link_contact;
      }
      
      if (footerColumns[2]) {
        const links = footerColumns[2].querySelectorAll('.footer-links li a'); // Removido data-text-key del selector para ser más general
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
 