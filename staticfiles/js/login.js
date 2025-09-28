document.addEventListener("DOMContentLoaded", function () {
   
    const titulo = document.getElementById("titulo");
    titulo.classList.add("animate__animated", "animate__fadeInRight");

    const loginTitulo = document.getElementById("login-titulo");
    loginTitulo.classList.add("animate__animated", "animate__fadeInDown");

    const imagen = document.getElementById("imagen");
    imagen.classList.add("animate__animated", "animate__fadeInRight");

    const submitButton = document.querySelector('form input[type="submit"]');
    submitButton.style.transition = "transform 0.3s ease";

    submitButton.addEventListener("mouseenter", function () {
        submitButton.style.transform = "scale(1.1)";
    });

    submitButton.addEventListener("mouseleave", function () {
        submitButton.style.transform = "scale(1)";
    });
});

