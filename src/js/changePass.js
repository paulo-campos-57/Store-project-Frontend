document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('change-pass-form');
    const emailInput = document.getElementById('email');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageArea = document.getElementById('message-area');
    const clearButton = document.querySelector('.clear-button');

    const reqLength = document.getElementById('req-length');
    const reqUpper = document.getElementById('req-upper');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');

    const validators = {
        upper: /[A-Z]/,
        number: /\d/,
        special: /[@#\$%&\*!\?\/\-\|\\_\.\+=]/
    };

    const updateRequirement = (element, isValid) => {
        element.classList.toggle('valid', isValid);
    };

    newPasswordInput.addEventListener('input', () => {
        const password = newPasswordInput.value;
        updateRequirement(reqLength, password.length >= 6);
        updateRequirement(reqUpper, validators.upper.test(password));
        updateRequirement(reqNumber, validators.number.test(password));
        updateRequirement(reqSpecial, validators.special.test(password));
    });

    function validatePassword(password) {
        if (password.length < 6) return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
        if (!/[A-Z]/.test(password)) return { isValid: false, message: 'A senha deve ter pelo menos uma letra maiúscula.' };
        if (!/\d/.test(password)) return { isValid: false, message: 'A senha deve ter pelo menos um número.' };
        if (!/[@#\$%&\*!\?\/\-\|\\_\.\+=]/.test(password)) return { isValid: false, message: 'A senha deve conter pelo menos um caractere especial.' };
        if (/[¨\{\}\[\]´`~\^:;<>,“”‘']/.test(password)) return { isValid: false, message: 'A senha contém caracteres não suportados.' };

        return { isValid: true };
    }

    function handleChangePassword(event) {
        event.preventDefault();
        messageArea.innerHTML = '';

        const email = emailInput.value.trim();
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!email || !newPassword || !confirmPassword) {
            messageArea.innerHTML = '<p class="message error">Por favor, preencha todos os campos.</p>';
            return;
        }

        if (newPassword !== confirmPassword) {
            messageArea.innerHTML = '<p class="message error">As senhas não coincidem.</p>';
            return;
        }

        const validationResult = validatePassword(newPassword);
        if (!validationResult.isValid) {
            messageArea.innerHTML = `<p class="message error">${validationResult.message}</p>`;
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === email || user.email === email);

        if (userIndex === -1) {
            messageArea.innerHTML = '<p class="message error">Usuário não encontrado com este e-mail.</p>';
        } else {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));

            messageArea.innerHTML = '<p class="message success">Senha alterada com sucesso! ✅</p>';
            form.reset();

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    form.addEventListener('submit', handleChangePassword);

    clearButton.addEventListener('click', () => {
        form.reset();
        messageArea.innerHTML = '';
        document.querySelectorAll('#password-rules li').forEach(li => li.classList.remove('valid'));
    });

    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordField = button.previousElementSibling;
            const icon = button.querySelector('i');
            const isPassword = passwordField.type === 'password';

            passwordField.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
});