// js/albumDisplay.js

import { createHeaderFooter } from './commonComponents.mjs';
import { deezerApi } from './deezerApi.mjs';
import { display } from './display.mjs';
import { lastFmApi } from './lastFmApi.mjs'; // Importe o Last.fm API

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('id');

    if (albumId) {
        try {
            const album = await deezerApi.getAlbum(albumId);
            let artistBioLastFm = null; // Para biografia do artista via Last.fm
            let albumSummaryLastFm = null; // Para resumo do álbum via Last.fm

            if (album) {
                // Tenta buscar informações adicionais do artista do álbum via Last.fm
                if (album.artist && album.artist.name) {
                    try {
                        artistBioLastFm = await lastFmApi.getArtistInfo(album.artist.name);
                    } catch (lastFmArtistError) {
                        console.warn('Não foi possível buscar informações do artista do Last.fm para o álbum:', lastFmArtistError);
                    }
                }

                // Tenta buscar informações adicionais do álbum via Last.fm (resumo/wiki)
                if (album.artist && album.artist.name && album.title) {
                    try {
                        albumSummaryLastFm = await lastFmApi.getAlbumInfo(album.artist.name, album.title);
                    } catch (lastFmAlbumError) {
                        console.warn('Não foi possível buscar informações do álbum do Last.fm:', lastFmAlbumError);
                    }
                }
                
                renderAlbumDetails(album, artistBioLastFm, albumSummaryLastFm); // Passa as novas infos
            } else {
                displayMessage('Álbum não encontrado.', 'error');
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes do álbum:', error);
            displayMessage('Erro ao carregar detalhes do álbum. Por favor, tente novamente mais tarde.', 'error');
        }
    } else {
        displayMessage('ID do álbum não fornecido na URL.', 'info');
    }
});

/**
 * Renderiza os detalhes de um álbum na página.
 * @param {object} album - O objeto do álbum da API do Deezer.
 * @param {object|null} lastFmArtistInfo - Objeto com informações do artista do Last.fm (inclui bio).
 * @param {object|null} lastFmAlbumInfo - Objeto com informações do álbum do Last.fm (inclui summary).
 */
function renderAlbumDetails(album, lastFmArtistInfo, lastFmAlbumInfo) {
    const container = document.getElementById('album-details');
    if (!container) {
        console.error('Container #album-details not found.');
        return;
    }

    const imageUrl = album.cover_xl || 'https://placehold.co/500x500/6C5CE7/FFFFFF?text=Álbum';

    let artistBioHtml = '';
    if (lastFmArtistInfo && lastFmArtistInfo.bio) {
        artistBioHtml = `
            <div class="artist-bio-section">
                <h3>Biografia do Artista (${album.artist.name})</h3>
                <p>${lastFmArtistInfo.bio}</p>
            </div>
        `;
    }

    let albumSummaryHtml = '';
    if (lastFmAlbumInfo && lastFmAlbumInfo.summary) {
        albumSummaryHtml = `
            <div class="album-summary-section">
                <h3>Sobre o Álbum (${album.title})</h3>
                <p>${lastFmAlbumInfo.summary}</p>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="album-detail-card">
            <img class="album-cover" src="${imageUrl}" alt="${album.title}">
            <div class="album-info">
                <h2 class="album-title">${album.title}</h2>
                <p class="album-artist">Artista: <a href="artist.html?id=${album.artist.id}">${album.artist.name}</a></p>
                <p class="album-release-date">Data de Lançamento: ${album.release_date}</p>
                <p class="album-num-tracks">Número de Faixas: ${album.nb_tracks}</p>
                
                ${albumSummaryHtml} ${artistBioHtml}   <div id="album-tracks-container" class="card-container">
                    <h3>Faixas</h3>
                </div>
            </div>
        </div>
    `;

    if (album.tracks && album.tracks.data) {
        const trackCardClickHandler = (trackId) => {
            window.location.href = `track.html?id=${trackId}`;
        };
        display.renderTracks(album.tracks.data, 'album-tracks-container', false, trackCardClickHandler);
    } else {
        document.getElementById('album-tracks-container').innerHTML = '<p>Nenhuma faixa encontrada para este álbum.</p>';
    }
}

function displayMessage(message, type = 'info') {
    const container = document.getElementById('album-details'); // Corrigido o ID aqui
    if (!container) return;

    container.innerHTML = `<div class="message ${type}">${message}</div>`;
}