import { createHeaderFooter } from './commonComponents.mjs';

function displayMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.textContent = message;
    container.className = `message-container ${type}`; 
    container.classList.remove('hidden');

    setTimeout(() => {
        container.classList.add('hidden');
        container.textContent = '';
    }, 5000);
}

async function fetchUsers() {
    try {
        const response = await fetch('json/users.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        displayMessage('login-message-container', 'Failed to load user data. Please try again later.', 'error');
        return []; 
    }
}

async function saveUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter();

    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterButton = document.getElementById('show-register-button');
    const showLoginButton = document.getElementById('show-login-button');
    const messageContainer = document.getElementById('login-message-container');

    let users = await fetchUsers();

    const localStorageUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (localStorageUsers.length > 0) {
        localStorageUsers.forEach(lsUser => {
            if (!users.some(u => u.username === lsUser.username)) {
                users.push(lsUser);
            }
        });
    }

    showRegisterButton.addEventListener('click', () => {
        loginSection.classList.add('hidden');
        registerSection.classList.remove('hidden');
        messageContainer.classList.add('hidden'); 
    });

    showLoginButton.addEventListener('click', () => {
        registerSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
        messageContainer.classList.add('hidden'); 
    });

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

            localStorage.setItem('isLoggedIn', 'true');
            displayMessage('login-message-container', 'Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500); 
        });
    }

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
            await saveUsers(users); 

            displayMessage('login-message-container', 'Registration successful! You can now log in.', 'success');
            registerForm.reset(); 
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        });
    }
});