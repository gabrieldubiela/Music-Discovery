// js/displayArtist.js

import { createHeaderFooter } from './commonComponents.mjs';
import { deezerApi } from './deezerApi.mjs';
import { lastFmApi } from './lastFmApi.mjs';
import { display } from './display.mjs'; // Certifique-se que esta linha está presente

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

    if (artistId) {
        try {
            const deezerArtistData = await deezerApi.getArtist(artistId);
            let lastFmArtistInfo = null;

            if (deezerArtistData) {
                // Tenta buscar a biografia do artista do Last.fm
                if (deezerArtistData.name) {
                    try {
                        lastFmArtistInfo = await lastFmApi.getArtistInfo(deezerArtistData.name);
                    } catch (lastFmError) {
                        console.warn('Não foi possível buscar informações do artista do Last.fm:', lastFmError);
                    }
                }
                
                // Renderiza os detalhes básicos do artista e a biografia
                renderArtistDetails(deezerArtistData, lastFmArtistInfo);

                // Busca e exibe as músicas populares do artista
                await fetchAndDisplayArtistTracks(artistId);

                // **NOVO: Busca e exibe os álbuns do artista**
                await fetchAndDisplayArtistAlbums(artistId); // Chamada da nova função

            } else {
                displayMessage('Artista não encontrado.', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar perfil do artista:', error);
            displayMessage('Erro ao carregar perfil do artista. Por favor, tente novamente mais tarde.', 'error');
        }
    } else {
        displayMessage('ID do artista não fornecido na URL.', 'info');
    }
});

/**
 * Renderiza os detalhes de um artista na página.
 * @param {object} deezerArtistData - Objeto do artista da API do Deezer.
 * @param {object|null} lastFmArtistInfo - Objeto com informações do artista do Last.fm (inclui bio).
 */
function renderArtistDetails(deezerArtistData, lastFmArtistInfo) {
    const container = document.getElementById('artist-details');
    if (!container) {
        console.error('Container #artist-details not found.');
        return;
    }

    const imageUrl = deezerArtistData.picture_xl || 'https://placehold.co/500x500/6C5CE7/FFFFFF?text=Artista';

    let artistBioHtml = '';
    if (lastFmArtistInfo && lastFmArtistInfo.bio) {
        artistBioHtml = `
            <div class="artist-bio-section">
                <h3>Biografia</h3>
                <p>${lastFmArtistInfo.bio}</p>
            </div>
        `;
    } else {
        artistBioHtml = '<div class="artist-bio-section"><p>Nenhuma biografia detalhada encontrada para este artista.</p></div>';
    }

    container.innerHTML = `
        <div class="artist-profile-card">
            <img class="artist-picture" src="${imageUrl}" alt="${deezerArtistData.name}">
            <div class="artist-info-details">
                <h2 class="artist-name">${deezerArtistData.name}</h2>
                <p class="artist-num-fans">Fãs: ${deezerArtistData.nb_fan.toLocaleString()}</p>
                ${artistBioHtml}
                
                <div id="artist-top-tracks-container" class="card-container">
                    <h3>Músicas Populares</h3>
                    <p>Carregando músicas...</p>
                </div>

                <div id="artist-albums-container" class="card-container">
                    <h3>Álbuns</h3>
                    <p>Carregando álbuns...</p>
                </div>

            </div>
        </div>
    `;
}

/**
 * Busca e exibe as músicas populares de um artista.
 * @param {string} artistId - O ID do artista do Deezer.
 */
async function fetchAndDisplayArtistTracks(artistId) {
    try {
        const topTracks = await deezerApi.getArtistTopTracks(artistId);
        const container = document.getElementById('artist-top-tracks-container');
        if (container) {
            if (topTracks && topTracks.length > 0) {
                // Remove a mensagem de "Carregando músicas..." e adiciona o título
                container.innerHTML = '<h3>Músicas Populares</h3>'; 
                display.renderTracks(topTracks, 'artist-top-tracks-container', false, (trackId) => {
                    window.location.href = `track.html?id=${trackId}`;
                });
            } else {
                container.innerHTML = '<h3>Músicas Populares</h3><div class="no-content-message"><p>Nenhuma música popular encontrada para este artista.</p></div>';
            }
        }
    } catch (error) {
        console.error('Erro ao buscar e exibir músicas populares do artista:', error);
        const container = document.getElementById('artist-top-tracks-container');
        if (container) {
            container.innerHTML = '<h3>Músicas Populares</h3><div class="no-content-message"><p>Erro ao carregar músicas.</p></div>';
        }
    }
}

/**
 * NOVO: Busca e exibe os álbuns de um artista.
 * @param {string} artistId - O ID do artista do Deezer.
 */
async function fetchAndDisplayArtistAlbums(artistId) {
    try {
        const albums = await deezerApi.getArtistAlbums(artistId);
        const container = document.getElementById('artist-albums-container');
        if (container) {
            if (albums && albums.length > 0) {
                // Remove a mensagem de "Carregando álbuns..." e adiciona o título
                container.innerHTML = '<h3>Álbuns</h3>';
                display.renderAlbums(albums, 'artist-albums-container', (albumId) => {
                    window.location.href = `album.html?id=${albumId}`;
                });
            } else {
                container.innerHTML = '<h3>Álbuns</h3><div class="no-content-message"><p>Nenhum álbum encontrado para este artista.</p></div>';
            }
        }
    } catch (error) {
        console.error('Erro ao buscar e exibir álbuns do artista:', error);
        const container = document.getElementById('artist-albums-container');
        if (container) {
            container.innerHTML = '<h3>Álbuns</h3><div class="no-content-message"><p>Erro ao carregar álbuns.</p></div>';
        }
    }
}

function displayMessage(message, type = 'info') {
    const container = document.getElementById('artist-details');
    if (!container) return;

    container.innerHTML = `<div class="message ${type}">${message}</div>`;
}