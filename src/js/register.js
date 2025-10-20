document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('cadastroForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const nomeInput = document.getElementById('nome');
    const cpfInput = document.getElementById('cpf');
    const dataNascimentoInput = document.getElementById('dataNascimento');
    const celularInput = document.getElementById('celular');
    const escolaridadeSelect = document.getElementById('escolaridade');

    const btnIncluir = document.getElementById('btnIncluir');
    const btnLimpar = document.getElementById('btnLimpar');
    const btnVoltar = document.getElementById('btnVoltar');

    btnIncluir.addEventListener('click', validarFormulario);
    btnLimpar.addEventListener('click', limparFormulario);
    btnVoltar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    celularInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        } else if (value.length > 5) {
            value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3");
        } else if (value.length > 2) {
            value = value.replace(/^(\d\d)(\d{0,5}).*/, "($1) $2");
        } else {
            value = value.replace(/^(\d*)/, "($1");
        }
        e.target.value = value;
    });

    function limparFormulario() {
        form.reset();
        emailInput.focus();
    }

    function salvarDados() {
        const usuarios = JSON.parse(localStorage.getItem('users')) || [];

        const email = emailInput.value;

        const emailExiste = usuarios.some(user => user.email === email);
        if (emailExiste) {
            alert('This email is already registered. Please use another one.');
            emailInput.focus();
            return;
        }

        const novoUsuario = {
            username: email,
            password: senhaInput.value,
            email: email,
            nomeCompleto: nomeInput.value,
            cpf: cpfInput.value,
            dataNascimento: dataNascimentoInput.value,
            celular: celularInput.value,
            estadoCivil: document.querySelector('input[name="estadoCivil"]:checked').value,
            escolaridade: escolaridadeSelect.value
        };

        usuarios.push(novoUsuario);

        localStorage.setItem('users', JSON.stringify(usuarios));

        alert('Registration successful!');
        limparFormulario();
    }


    function validarFormulario() {
        if (emailInput.value.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            alert('Please enter a valid email.');
            emailInput.focus();
            return;
        }

        const senha = senhaInput.value;
        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!regexSenha.test(senha)) {
            alert('The password does not meet the security criteria. Please check the rules.');
            senhaInput.focus();
            return;
        }

        if (senha !== confirmarSenhaInput.value) {
            alert('The passwords do not match.');
            confirmarSenhaInput.focus();
            return;
        }

        const nome = nomeInput.value.trim();
        const palavrasNome = nome.split(' ');
        if (nome === '') {
            alert('The Name field is required.');
            nomeInput.focus();
            return;
        }
        if (palavrasNome.length < 2 || palavrasNome[0].length < 2) {
            alert('The name must contain at least two words, and the first must have at least 2 characters.');
            nomeInput.focus();
            return;
        }
        const regexCaracteresEspeciais = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
        if (regexCaracteresEspeciais.test(nome)) {
            alert('The name cannot contain numbers or special characters.');
            nomeInput.focus();
            return;
        }

        if (cpfInput.value.trim() === '') {
            alert('The CPF field is required.');
            cpfInput.focus();
            return;
        }
        if (!validarDigitoCPF(cpfInput.value)) {
            alert('The entered CPF is invalid.');
            cpfInput.focus();
            return;
        }

        if (dataNascimentoInput.value.trim() === '') {
            alert('The date of birth is required.');
            dataNascimentoInput.focus();
            return;
        }
        const dataNascimento = new Date(dataNascimentoInput.value);
        const hoje = new Date();
        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const m = hoje.getMonth() - dataNascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
        }
        if (idade < 18) {
            alert('You must be over 18 years old.');
            dataNascimentoInput.focus();
            return;
        }

        if (celularInput.value.trim() !== '') {
            const celularLimpo = celularInput.value.replace(/\D/g, '');
            if (celularLimpo.length < 10 || celularLimpo.length > 11) {
                alert('If filled, the cell phone must be in a valid format (with area code).');
                celularInput.focus();
                return;
            }
        }

        salvarDados();
    }

    function validarDigitoCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0,
            resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }
});