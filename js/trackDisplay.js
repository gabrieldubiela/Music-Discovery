// js/trackDisplay.js

import { createHeaderFooter } from './commonComponents.mjs';
import { deezerApi } from './deezerApi.mjs';
import { lastFmApi } from './lastFmApi.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('id');

    if (trackId) {
        try {
            const track = await deezerApi.getTrack(trackId);
            if (track) {
                // Tenta buscar informações adicionais do artista via AudioDB
                let artistInfo = null;
                if (track.artist && track.artist.name) {
                    try {
                        const audioDbArtistData = await lastFmApi.getArtistInfo(track.artist.name);
                        if (audioDbArtistData && audioDbArtistData.artists && audioDbArtistData.artists.length > 0) {
                            artistInfo = audioDbArtistData.artists[0];
                        }
                    } catch (audioDbError) {
                        console.warn('Could not fetch artist info from AudioDB:', audioDbError);
                    }
                }
                renderTrackDetails(track, artistInfo); // Passa artistInfo para a função de renderização
            } else {
                displayMessage('Track not found.', 'error');
            }
        } catch (error) {
            console.error('Error fetching track details:', error);
            displayMessage('Failed to load track details. Please try again later.', 'error');
        }
    } else {
        displayMessage('No track ID provided in the URL.', 'error');
    }
});

/**
 * Renderiza os detalhes de uma faixa na página.
 * @param {Object} track - O objeto da faixa retornado pela Deezer API.
 * @param {Object} [artistInfo=null] - Informações adicionais do artista do AudioDB API.
 */
function renderTrackDetails(track, artistInfo = null) {
    const container = document.getElementById('track-content');
    if (!container) {
        console.error('Track content container not found.');
        return;
    }

    const imageUrl = track.album?.cover_big || 'https://placehold.co/300x300?text=No+Cover';
    const previewUrl = track.preview;

    let artistBioHtml = '';
    if (artistInfo && artistInfo.strBiographyEN) {
        // Exibe um resumo da biografia do artista
        artistBioHtml = `<p class="artist-bio-summary">About the artist: ${artistInfo.strBiographyEN.substring(0, 200)}...</p>`;
    }

    container.innerHTML = `
        <div class="track-detail-card">
            <img class="track-album-cover" src="${imageUrl}" alt="${track.album?.title || 'Album Art'}">
            <div class="track-info">
                <h2 class="track-title">${track.title}</h2>
                <p class="track-artist">Artist: <a href="artist.html?id=${track.artist.id}">${track.artist.name}</a></p>
                <p class="track-album">Album: <a href="album.html?id=${track.album.id}">${track.album.title}</a></p>
                <p class="track-duration">Duration: ${formatDuration(track.duration)}</p>
                ${previewUrl ? `<audio controls src="${previewUrl}" class="track-preview-audio">Your browser does not support the audio element.</audio>` : '<p class="no-preview">No preview available for this track.</p>'}
                <button id="add-to-playlist-button" class="btn primary-btn">Add to Playlist</button>
            </div>
            ${artistBioHtml} </div>
    `;

    const addToListButton = document.getElementById('add-to-playlist-button');
    if (addToListButton) {
        addToListButton.addEventListener('click', () => {
            alert(`Adding "${track.title}" to playlist (feature not yet implemented).`);
        });
    }
}

// ... (formatDuration e displayMessage permanecem os mesmos) ...
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/**
 * Exibe uma mensagem na página.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - O tipo da mensagem ('info', 'error').
 */
function displayMessage(message, type = 'info') {
    const container = document.getElementById('track-details-container');
    if (container) {
        container.innerHTML = `<div class="message ${type}">${message}</div>`;
    }
}