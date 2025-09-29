document.addEventListener('DOMContentLoaded', function () {

    const menuToggle = document.getElementById('menu-toggle');
    const linksContainer = document.querySelector('.links-container');

    if (menuToggle && linksContainer) {
        menuToggle.addEventListener('click', function () {
            linksContainer.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    const clearButton = document.querySelector('.clear-button');
    const loginForm = document.querySelector('.login-form');

    if (clearButton && loginForm) {
        clearButton.addEventListener('click', function () {
            loginForm.reset();
        });
    }

    const passwordInput = document.querySelector('#password-input');
    const togglePasswordButton = document.querySelector('#toggle-password');

    if (passwordInput && togglePasswordButton) {
        togglePasswordButton.addEventListener('click', function () {
            const isPassword = passwordInput.getAttribute('type') === 'password';

            if (isPassword) {
                passwordInput.setAttribute('type', 'text');
                togglePasswordButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            } else {
                passwordInput.setAttribute('type', 'password');
                togglePasswordButton.innerHTML = '<i class="fa-solid fa-eye"></i>';
            }
        });
    }
});