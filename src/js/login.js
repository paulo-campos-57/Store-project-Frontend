document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input'); // <-- MOVIDO PARA CÁ
    const clearButton = document.querySelector('.clear-button');
    const togglePasswordButton = document.querySelector('#toggle-password');

    function seedUsers() {
        if (!localStorage.getItem('users')) {
            const users = [
                { username: 'admin', password: 'password123' },
                { username: 'user', password: 'userpass' },
                { username: 'maria', password: 'securepassword' }
            ];
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    function handleLogin(event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username === '' || password === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = storedUsers.find(user => user.username === username);

        if (foundUser) {
            if (foundUser.password === password) {
                alert(`Login bem-sucedido! Bem-vindo, ${username}!`);
                window.location.href = 'logged.html';
            } else {
                alert('Usuário ou senha incorretos.');
            }
        } else {
            alert('Usuário ou senha incorretos.');
        }
    }

    if (loginForm) {
        seedUsers();
        loginForm.addEventListener('submit', handleLogin);
    }

    if (clearButton && loginForm) {
        clearButton.addEventListener('click', function () {
            loginForm.reset();
        });
    }

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