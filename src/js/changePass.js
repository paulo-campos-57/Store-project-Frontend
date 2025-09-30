document.addEventListener('DOMContentLoaded', () => {

    const passwordInput = document.getElementById('new-password');
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
        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    };

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;

        updateRequirement(reqLength, password.length >= 6);

        updateRequirement(reqUpper, validators.upper.test(password));

        updateRequirement(reqNumber, validators.number.test(password));

        updateRequirement(reqSpecial, validators.special.test(password));
    });

    // Elementos de validação do formulário
    const form = document.getElementById('change-pass-form');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const messageArea = document.getElementById('message-area');

    function validatePassword(password) {
        if (password.length < 6) {
            return { isValid: false, message: 'Your password must have at least 6 characters.' };
        }

        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: 'Your password must have at least one capital letter.' };
        }

        if (!/\d/.test(password)) {
            return { isValid: false, message: 'Your password must have at least one number.' };
        }

        const allowedSpecialChars = /[@#\$%&\*!\?\/\-\|\\_\.\+=]/;
        if (!allowedSpecialChars.test(password)) {
            return { isValid: false, message: 'Your password must contain at least one special character: @ # $ % & * ! ? / \\ | - _ + . =' };
        }

        const forbiddenChars = /[¨\{\}\[\]´`~\^:;<>,“”‘']/;
        if (forbiddenChars.test(password)) {
            return { isValid: false, message: 'The password contais unsupported characters.' };
        }

        return { isValid: true, message: 'Password changed sucessfully! ✅' };
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        messageArea.innerHTML = '';

        if (newPassword !== confirmPassword) {
            messageArea.innerHTML = '<p class="message error">Passwords does not match.</p>';
            return;
        }

        const validationResult = validatePassword(newPassword);

        if (validationResult.isValid) {
            messageArea.innerHTML = `<p class="message success">${validationResult.message}</p>`;
        } else {
            messageArea.innerHTML = `<p class="message error">${validationResult.message}</p>`;
        }
    });

    // Alterar a visibilidade da senha
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling;

            const icon = button.querySelector('i');

            const isPassword = passwordInput.type === 'password';

            if (isPassword) {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
});