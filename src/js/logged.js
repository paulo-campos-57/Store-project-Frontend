// Dados fixos para serviços de TI
const services = [
    { id: 1, name: "Instalação de Software Básico", price: 50.00, deadline: 2, numSolicitacao: 1000 },
    { id: 2, name: "Configuração de Rede", price: 120.00, deadline: 5, numSolicitacao: 1001 },
    { id: 3, name: "Backup e Restauração", price: 80.00, deadline: 3, numSolicitacao: 1002 },
    { id: 4, name: "Suporte Hardware", price: 150.00, deadline: 7, numSolicitacao: 1003 },
];

// Lista de solicitações iniciais (fixas)
let requests = [
    {
        date: "2025-10-01",
        requestNumber: 2025001,
        service: "Instalação de Software Básico",
        status: "CONCLUÍDO",
        price: 50.00,
        scheduledDate: "2025-10-03"
    },
    {
        date: "2025-10-10",
        requestNumber: 2025002,
        service: "Configuração de Rede",
        status: "EM ANDAMENTO",
        price: 120.00,
        scheduledDate: "2025-10-15"
    },
    {
        date: "2025-10-15",
        requestNumber: 2025003,
        service: "Backup e Restauração",
        status: "AGUARDANDO APROVAÇÃO",
        price: 80.00,
        scheduledDate: "2025-10-18"
    },
];

// Referências do DOM para o Formulário e Tabela
const serviceSelect = document.getElementById('service-select');
const priceLabel = document.getElementById('price-label');
const deadlineLabel = document.getElementById('deadline-label');
const scheduledDateLabel = document.getElementById('scheduled-date-label');
const requestsBody = document.getElementById('requests-body');
const newRequestForm = document.getElementById('new-request-form');
const addButton = document.getElementById('add-request-button');

// NOVAS REFERÊNCIAS DO DOM PARA INFORMAÇÕES DO USUÁRIO
const userNameLabel = document.getElementById('user-name');
const userLoginLabel = document.getElementById('user-login');

// Função para formatar data (DD/MM/AAAA)
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

// Função para calcular a data prevista (adiciona dias úteis)
const calculateScheduledDate = (daysToAdd) => {
    let currentDate = new Date();
    let addedDays = 0;

    // Avança para o próximo dia útil se a data atual for fim de semana
    while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    while (addedDays < daysToAdd) {
        currentDate.setDate(currentDate.getDate() + 1);
        // 1=Segunda, ..., 5=Sexta. Ignora 0=Domingo e 6=Sábado
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            addedDays++;
        }
    }
    return currentDate.toISOString().split('T')[0];
};

// Função para preencher o Combo Box
const populateServices = () => {
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        serviceSelect.appendChild(option);
    });
};

// Função para atualizar Preço, Prazo e Data Prevista
window.updateRequestDetails = () => {
    const selectedId = parseInt(serviceSelect.value);
    const selectedService = services.find(s => s.id === selectedId);

    if (selectedService) {
        priceLabel.textContent = `R$ ${selectedService.price.toFixed(2).replace('.', ',')}`;
        deadlineLabel.textContent = `${selectedService.deadline} Dias Úteis`;

        const scheduledDate = calculateScheduledDate(selectedService.deadline);
        scheduledDateLabel.textContent = formatDate(scheduledDate);
        addButton.disabled = false;
    } else {
        priceLabel.textContent = 'R$ 0,00';
        deadlineLabel.textContent = '0 Dias Úteis';
        scheduledDateLabel.textContent = 'DD/MM/AAAA';
        addButton.disabled = true;
    }
};

// Função para renderizar a tabela
const renderRequestsTable = () => {
    // Ordena por data do pedido (crescente)
    requests.sort((a, b) => new Date(a.date) - new Date(b.date));

    requestsBody.innerHTML = '';

    requests.forEach((req, index) => {
        const row = requestsBody.insertRow();
        row.innerHTML = `
            <td>${formatDate(req.date)}</td>
            <td>${req.requestNumber}</td>
            <td>${req.service}</td>
            <td>${req.status}</td>
            <td>R$ ${req.price.toFixed(2).replace('.', ',')}</td>
            <td>${formatDate(req.scheduledDate)}</td>
            <td><button onclick="deleteRequest(${index})">Excluir</button></td>
        `;
    });
};

// Função para excluir linha
window.deleteRequest = (index) => {
    requests.splice(index, 1);
    renderRequestsTable();
};

// Listener para o formulário de Nova Solicitação
newRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedId = parseInt(serviceSelect.value);
    const selectedService = services.find(s => s.id === selectedId);

    if (!selectedService) return;

    const today = new Date().toISOString().split('T')[0];
    const scheduledDate = calculateScheduledDate(selectedService.deadline);

    const maxRequestNumber = requests.length > 0 ? Math.max(...requests.map(r => r.requestNumber)) : 2025000;
    const newRequestNumber = maxRequestNumber + 1;

    const newRequest = {
        date: today,
        requestNumber: newRequestNumber,
        service: selectedService.name,
        status: document.getElementById('status-label').textContent, // EM ELABORAÇÃO
        price: selectedService.price,
        scheduledDate: scheduledDate
    };

    requests.push(newRequest);
    renderRequestsTable();

    newRequestForm.reset();
    updateRequestDetails();
});

/**
 * FUNÇÃO ADAPTADA: Carrega as informações do usuário logado.
 * 1. Tenta identificar o e-mail do usuário ativo na chave 'loggedUserEmail'.
 * 2. Procura o usuário correspondente dentro do array 'users'.
 */
const loadUserInfo = () => {
    const loggedEmail = localStorage.getItem('loggedUserEmail');
    const usersJson = localStorage.getItem('users');
    let userName = 'Usuário Não Logado';
    let userEmail = 'nao.logado@default.com';

    if (usersJson) {
        try {
            const users = JSON.parse(usersJson);
            let loggedUser = null;

            if (loggedEmail) {
                loggedUser = users.find(user => user.email === loggedEmail);
            }

            if (!loggedUser) {
                loggedUser = users.find(user => user.email && user.nomeCompleto);
            }
            if (!loggedUser) {
                loggedUser = users.find(user => user.email);
            }


            if (loggedUser) {
                userName = loggedUser.nomeCompleto || loggedUser.email.split('@')[0];
                userEmail = loggedUser.email;
            }

        } catch (e) {
            console.error("Erro ao parsear usuários do localStorage:", e);
        }
    } else {
        userName = 'João da Silva (Teste)';
        userEmail = 'joao.silva@empresa.com';
    }


    userNameLabel.textContent = userName;
    userLoginLabel.textContent = userEmail;
};


document.addEventListener('DOMContentLoaded', () => {
    // Para TESTAR esta função, execute no console ANTES de carregar a página:
    // localStorage.setItem('loggedUserEmail', 'email_de_um_usuario_cadastrado@exemplo.com');
    // localStorage.setItem('users', JSON.stringify([{ email: 'email_de_um_usuario_cadastrado@exemplo.com', nomeCompleto: 'Nome Completo Teste'}]));

    loadUserInfo();
    populateServices();
    renderRequestsTable();
    updateRequestDetails();
});