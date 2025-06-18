// A simple in-memory "database" for demonstration. In a real app,
// this would be replaced by server-side authentication and a database.
const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
const LOGGED_IN_USER_KEY = 'loggedInUser';

/**
 * Handles user registration.
 * @param {string} username - The username for registration.
 * @param {string} password - The password for registration.
 * @returns {boolean} - True if registration is successful, false otherwise (e.g., user already exists).
 */
export function registerUser(username, password) {
    if (users.some(user => user.username === username)) {
        console.warn('Registration failed: Username already exists.');
        return false;
    }
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    console.log('User registered successfully:', username);
    return true;
}

/**
 * Handles user login.
 * @param {string} username - The username for login.
 * @param {string} password - The password for login.
 * @returns {boolean} - True if login is successful, false otherwise.
 */
export function loginUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
        console.log('Login successful for:', username);
        return true;
    } else {
        console.warn('Login failed: Invalid username or password.');
        return false;
    }
}

/**
 * Logs out the current user.
 */
export function logoutUser() {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    console.log('User logged out.');
    // Redirect to login page or update UI
    if (window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }
}

/**
 * Checks if a user is currently logged in.
 * @returns {object|null} - The logged-in user object if found, otherwise null.
 */
export function getCurrentUser() {
    const user = localStorage.getItem(LOGGED_IN_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Example usage in login.html (assuming you have input fields with IDs)
// Add this script inside a <script> tag in your login.html
/*
import { registerUser, loginUser, logoutUser } from './js/login.js'; // Adjust path if needed

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout-button'); // If you have a logout button on another page

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            if (loginUser(username, password)) {
                alert('Login successful!');
                window.location.href = 'index.html'; // Redirect to home page
            } else {
                alert('Invalid username or password.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            if (registerUser(username, password)) {
                alert('Registration successful! You can now log in.');
                // Optionally redirect to login or clear form
                document.getElementById('register-form').reset();
            } else {
                alert('Username already exists.');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            logoutUser();
            alert('You have been logged out.');
        });
    }

    // Example check on non-login pages to ensure user is logged in
    // if (window.location.pathname !== '/login.html' && !getCurrentUser()) {
    //     alert('Please log in to access this page.');
    //     window.location.href = 'login.html';
    // }
});
*/