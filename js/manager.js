import { createHeaderFooter } from './commonComponents.mjs';

document.addEventListener('DOMContentLoaded', () => {
    createHeaderFooter();

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const mainContent = document.querySelector('main');

    if (!isLoggedIn) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Acesso Negado</h2>
                <p>Por favor, <a href="login.html">faça login</a> para acessar suas playlists.</p>
            </div>
        `;
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000); 
    } else {
        mainContent.innerHTML = `
            <h2 style="text-align: center;">Minhas Playlists</h2>
            <div id="playlist-container" class="card-container">
                <p style="text-align: center;">Nenhuma playlist salva ainda.</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button id="create-playlist-button">Criar Nova Playlist</button>
            </div>
        `;
        const createPlaylistButton = document.getElementById('create-playlist-button');
        if (createPlaylistButton) {
            createPlaylistButton.addEventListener('click', () => {
                const playlistName = prompt('Enter the name for your new playlist:');
                if (playlistName) {
                    console.log('New playlist created:', playlistName);
                }
            });
        }
    }
});