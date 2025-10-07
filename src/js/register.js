document.addEventListener('DOMContentLoaded', function () {

    // --- SELETORES DOS ELEMENTOS ---
    const form = document.getElementById('cadastroForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');
    const nomeInput = document.getElementById('nome');
    const cpfInput = document.getElementById('cpf');
    const dataNascimentoInput = document.getElementById('dataNascimento');
    const celularInput = document.getElementById('celular');
    
    const btnIncluir = document.getElementById('btnIncluir');
    const btnLimpar = document.getElementById('btnLimpar');
    const btnVoltar = document.getElementById('btnVoltar');

    // --- EVENT LISTENERS ---
    btnIncluir.addEventListener('click', validarFormulario);
    btnLimpar.addEventListener('click', limparFormulario);
    btnVoltar.addEventListener('click', () => {
        window.history.back();
    });

    // --- MÁSCARAS DE CAMPO ---
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
             value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/,"($1) $2-$3");
        } else if (value.length > 5) {
             value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/,"($1) $2-$3");
        } else if (value.length > 2) {
             value = value.replace(/^(\d\d)(\d{0,5}).*/,"($1) $2");
        } else {
             value = value.replace(/^(\d*)/, "($1");
        }
        e.target.value = value;
    });

    // --- FUNÇÕES ---

    function limparFormulario() {
        form.reset();
        emailInput.focus();
    }

    function validarFormulario() {
        // Validação do Email
        if (emailInput.value.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            alert('Por favor, insira um e-mail válido.');
            emailInput.focus();
            return;
        }

        // Validação da Senha
        const senha = senhaInput.value;
        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!regexSenha.test(senha)) {
            alert('A senha não atende aos critérios de segurança. Verifique as regras.');
            senhaInput.focus();
            return;
        }

        // Validação da Confirmação de Senha
        if (senha !== confirmarSenhaInput.value) {
            alert('As senhas não coincidem.');
            confirmarSenhaInput.focus();
            return;
        }
        
        // Validação do Nome
        const nome = nomeInput.value.trim();
        const palavrasNome = nome.split(' ');
        if (nome === '') {
            alert('O campo Nome é obrigatório.');
            nomeInput.focus();
            return;
        }
        if (palavrasNome.length < 2 || palavrasNome[0].length < 2) {
            alert('O nome deve conter pelo menos duas palavras, e a primeira deve ter no mínimo 2 caracteres.');
            nomeInput.focus();
            return;
        }
        const regexCaracteresEspeciais = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/;
        if (regexCaracteresEspeciais.test(nome)) {
            alert('O nome não pode conter números ou caracteres especiais.');
            nomeInput.focus();
            return;
        }

        // Validação do CPF
        if (cpfInput.value.trim() === '') {
            alert('O campo CPF é obrigatório.');
            cpfInput.focus();
            return;
        }
        if (!validarDigitoCPF(cpfInput.value)) {
            alert('O CPF inserido é inválido.');
            cpfInput.focus();
            return;
        }

        // Validação da Data de Nascimento
        if (dataNascimentoInput.value.trim() === '') {
            alert('A data de nascimento é obrigatória.');
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
            alert('O cliente deve ser maior de 18 anos.');
            dataNascimentoInput.focus();
            return;
        }

        // Validação do Celular (Opcional)
        if (celularInput.value.trim() !== '') {
            const celularLimpo = celularInput.value.replace(/\D/g, '');
            if (celularLimpo.length < 10 || celularLimpo.length > 11) {
                alert('Se preenchido, o celular deve estar em um formato válido (com DDD).');
                celularInput.focus();
                return;
            }
        }
        
        // Se todas as validações passarem
        alert('Validação realizada com sucesso!');
    }

    function validarDigitoCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0, resto;
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