import { createHeaderFooter } from './commonComponents.mjs';

// Função para exibir mensagens na tela
function displayMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.textContent = message;
    container.className = `message-container ${type}`; // Adiciona a classe de tipo para estilização (error, success)
    container.classList.remove('hidden');

    setTimeout(() => {
        container.classList.add('hidden');
        container.textContent = ''; // Limpa a mensagem
    }, 5000); // Mensagem desaparece após 5 segundos
}

async function fetchUsers() {
    try {
        const response = await fetch('json/users.json'); // Caminho para o seu JSON
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        displayMessage('login-message-container', 'Failed to load user data. Please try again later.', 'error');
        return []; // Retorna um array vazio em caso de erro
    }
}

async function saveUsers(users) {
    // Em um ambiente de desenvolvimento (local), podemos simular salvamento no localStorage.
    // Em produção, isso seria uma chamada para um backend.
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter(); // Garante que o header e footer sejam criados

    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterButton = document.getElementById('show-register-button');
    const showLoginButton = document.getElementById('show-login-button');
    const messageContainer = document.getElementById('login-message-container');

    let users = await fetchUsers(); // Carrega os usuários do JSON

    // Se houver usuários registrados no localStorage (para simulação de registro), use-os.
    const localStorageUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (localStorageUsers.length > 0) {
        // Mescla ou sobrescreve, dependendo da sua estratégia.
        // Aqui, vamos adicionar usuários do localStorage se não existirem no JSON inicial.
        localStorageUsers.forEach(lsUser => {
            if (!users.some(u => u.username === lsUser.username)) {
                users.push(lsUser);
            }
        });
    }


    // Lógica para mostrar/esconder seções
    showRegisterButton.addEventListener('click', () => {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
        messageContainer.classList.add('hidden'); // Oculta mensagens ao trocar de formulário
    });

    showLoginButton.addEventListener('click', () => {
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        messageContainer.classList.add('hidden'); // Oculta mensagens ao trocar de formulário
    });

    // Lógica de Login
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;

            const user = users.find(u => u.username === username);

            if (!user) {
                displayMessage('login-message-container', 'Username does not exist.', 'error');
                return;
            }

            if (user.password !== password) {
                displayMessage('login-message-container', 'Incorrect password.', 'error');
                return;
            }

            // Login successful
            localStorage.setItem('isLoggedIn', 'true');
            // Você pode armazenar o username ou outros dados do usuário aqui se precisar
            // localStorage.setItem('loggedInUsername', user.username);
            displayMessage('login-message-container', 'Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html'; // Redireciona para a página inicial
            }, 1500); // Pequeno atraso para o usuário ver a mensagem
        });
    }

    // Lógica de Registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('register-username').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                displayMessage('login-message-container', 'Passwords do not match.', 'error');
                return;
            }

            if (users.some(u => u.username === username)) {
                displayMessage('login-message-container', 'Username already exists. Please choose another.', 'error');
                return;
            }

            const newUser = { username, email, password };
            users.push(newUser);
            await saveUsers(users); // Salva o novo usuário (simulado)

            displayMessage('login-message-container', 'Registration successful! You can now log in.', 'success');
            registerForm.reset(); // Limpa o formulário de registro
            // Alterna para a tela de login automaticamente após o registro
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        });
    }
});