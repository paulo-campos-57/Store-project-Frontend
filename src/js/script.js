document.addEventListener('DOMContentLoaded', function () {

    // Função de responsividade do menu
    const menuToggle = document.getElementById('menu-toggle');
    const linksContainer = document.querySelector('.links-container');

    if (menuToggle && linksContainer) {
        menuToggle.addEventListener('click', function () {
            linksContainer.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

});