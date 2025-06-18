// js/commonComponents.mjs (Versão Mais Recente e Correta)
import { initializeSearch } from './search.mjs'; // Continua importando para inicializar a busca

function createHeaderFooter() {
    const headerElement = document.getElementById('main-header');
    const footerElement = document.getElementById('main-footer');

    if (headerElement) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const authLink = isLoggedIn
            ? '<a href="#" id="auth-link">Logout</a>'
            : '<a href="login.html" id="auth-link">Login</a>';

        headerElement.innerHTML = `
            <div class="header-content">
                <div class="header-top-row">
                    <div class="site-title">
                        <img src="images/icon.png" alt="Music Discovery Icon" class="site-icon">
                        <h1>Music Discovery</h1>
                    </div>
                    <nav class="main-nav">
                        <a href="index.html">Home</a>
                        <a href="manager.html">My Playlists</a>
                        ${authLink}
                    </nav>
                </div>

                <div class="search-section-wrapper">
                    <div class="search-container">
                        <input type="text" id="search-input" placeholder="Search for songs, artists, albums...">
                        <button id="search-button">Search</button>
                    </div>
                    <div id="search-message-container"></div>
                </div>
            </div>
        `;

        if (isLoggedIn) {
            const authLinkElement = headerElement.querySelector('#auth-link');
            authLinkElement.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                window.location.reload();
            });
        }

        // Continua inicializando a busca aqui, pois a barra de busca está no header
        initializeSearch(); 
    }

    if (footerElement) {
        footerElement.innerHTML = `
            <p>&copy; 2025 Music Discovery</p>
        `;
    }
}

// Removido: document.addEventListener('DOMContentLoaded', createHeaderFooter);

export { createHeaderFooter };