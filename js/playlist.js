// js/playlist.mjs

import { createHeaderFooter } from './commonComponents.mjs';
import { deezerApi } from './deezerApi.mjs';
import { display } from './display.mjs'; // Corrigido para .mjs

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('id');

    if (playlistId) {
        try {
            const playlist = await deezerApi.getPlaylist(playlistId);

            if (playlist) {
                renderPlaylistDetails(playlist);
            } else {
                displayMessage('Playlist não encontrada.', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar playlist:', error);
            displayMessage('Erro ao carregar playlist. Por favor, tente novamente mais tarde.', 'error');
        }
    } else {
        displayMessage('ID da playlist não fornecido na URL.', 'info');
    }
});

/**
 * Renderiza os detalhes de uma playlist e suas músicas na página.
 * @param {object} playlistData - Objeto da playlist da API do Deezer.
 */
function renderPlaylistDetails(playlistData) {
    const container = document.getElementById('playlist-details-container');
    if (!container) {
        console.error('Container #playlist-details-container não encontrado.');
        return;
    }

    const imageUrl = playlistData.picture_xl || 'https://placehold.co/500x500/6C5CE7/FFFFFF?text=Playlist';
    const creatorName = playlistData.user?.name || 'Artista Desconhecido'; // Use optional chaining para user

    container.innerHTML = `
        <div class="playlist-detail-card">
            <img class="playlist-cover" src="${imageUrl}" alt="${playlistData.title}">
            <div class="playlist-info">
                <h2 class="playlist-title">${playlistData.title}</h2>
                <p class="playlist-creator">Criada por: <a href="#">${creatorName}</a></p>
                <p class="playlist-description">${playlistData.description || 'Nenhuma descrição disponível.'}</p>
                <p class="playlist-num-tracks">Número de Músicas: ${playlistData.nb_tracks}</p>
                <p class="playlist-duration">Duração Total: ${formatDuration(playlistData.duration)}</p>

                <div id="playlist-tracks-container" class="card-container">
                    <h3>Músicas da Playlist</h3>
                    </div>
            </div>
        </div>
    `;

    // Renderiza as músicas da playlist
    if (playlistData.tracks && playlistData.tracks.data) {
        const trackCardClickHandler = (trackId) => {
            window.location.href = `track.html?id=${trackId}`;
        };
        display.renderTracks(playlistData.tracks.data, 'playlist-tracks-container', false, trackCardClickHandler);
    } else {
        document.getElementById('playlist-tracks-container').innerHTML = '<div class="no-content-message"><p>Nenhuma música encontrada para esta playlist.</p></div>';
    }
}

/**
 * Formata a duração de segundos para um formato legível (MM:SS).
 * @param {number} seconds - Duração em segundos.
 * @returns {string} Duração formatada.
 */
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
}

function displayMessage(message, type = 'info') {
    const container = document.getElementById('playlist-details-container');
    if (!container) return;

    container.innerHTML = `<div class="message ${type}">${message}</div>`;
}