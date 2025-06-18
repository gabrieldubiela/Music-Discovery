import { createHeaderFooter } from './commonComponents.mjs';
import { deezerApi } from './deezerApi.mjs';
import { lastFmApi } from './lastFmApi.mjs';
import { display } from './display.mjs';

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');

    if (artistId) {
        try {
            const deezerArtistData = await deezerApi.getArtist(artistId);
            let lastFmArtistInfo = null;

            if (deezerArtistData) {
                if (deezerArtistData.name) {
                    try {
                        lastFmArtistInfo = await lastFmApi.getArtistInfo(deezerArtistData.name);
                    } catch (lastFmError) {
                        console.warn('Not found information in Last.fm:', lastFmError);
                    }
                }
                
                renderArtistDetails(deezerArtistData, lastFmArtistInfo);

                await fetchAndDisplayArtistTracks(artistId);

                await fetchAndDisplayArtistAlbums(artistId); 

            } else {
                displayMessage('Artist not found', 'error');
            }
        } catch (error) {
            console.error('Fail to upload', error);
            displayMessage('Fail to upload', 'error');
        }
    } else {
        displayMessage('Fail to upload', 'info');
    }
});

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
                <h3>Biography</h3>
                <p>${lastFmArtistInfo.bio}</p>
            </div>
        `;
    } else {
        artistBioHtml = '<div class="artist-bio-section"><p>Fail to upload.</p></div>';
    }

    container.innerHTML = `
        <div class="artist-profile-card">
            <img class="artist-picture" src="${imageUrl}" alt="${deezerArtistData.name}">
            <div class="artist-info-details">
                <h2 class="artist-name">${deezerArtistData.name}</h2>
                <p class="artist-num-fans">Fãs: ${deezerArtistData.nb_fan.toLocaleString()}</p>
                ${artistBioHtml}
                
                <div id="artist-top-tracks-container" class="card-container">
                    <h3>Popular Musics</h3>
                    <p>Uploading Musics...</p>
                </div>

                <div id="artist-albums-container" class="card-container">
                    <h3>Albuns</h3>
                    <p>Uploading Albuns...</p>
                </div>

            </div>
        </div>
    `;
}

async function fetchAndDisplayArtistTracks(artistId) {
    try {
        const topTracks = await deezerApi.getArtistTopTracks(artistId);
        const container = document.getElementById('artist-top-tracks-container');
        if (container) {
            if (topTracks && topTracks.length > 0) {
                container.innerHTML = '<h3>Popular Musics</h3>'; 
                display.renderTracks(topTracks, 'artist-top-tracks-container', false, (trackId) => {
                    window.location.href = `track.html?id=${trackId}`;
                });
            } else {
                container.innerHTML = '<h3>Popular Musics</h3><div class="no-content-message"><p>Fail to upload.</p></div>';
            }
        }
    } catch (error) {
        console.error('Fail to upload:', error);
        const container = document.getElementById('artist-top-tracks-container');
        if (container) {
            container.innerHTML = '<h3>Popular Musics</h3><div class="no-content-message"><p>Fail to upload.</p></div>';
        }
    }
}

async function fetchAndDisplayArtistAlbums(artistId) {
    try {
        const albums = await deezerApi.getArtistAlbums(artistId);
        const container = document.getElementById('artist-albums-container');
        if (container) {
            if (albums && albums.length > 0) {
                container.innerHTML = '<h3>Albuns</h3>';
                display.renderAlbums(albums, 'artist-albums-container', (albumId) => {
                    window.location.href = `album.html?id=${albumId}`;
                });
            } else {
                container.innerHTML = '<h3>Albuns</h3><div class="no-content-message"><p>Fail to upload.</p></div>';
            }
        }
    } catch (error) {
        console.error('Fail to upload:', error);
        const container = document.getElementById('artist-albums-container');
        if (container) {
            container.innerHTML = '<h3>Albuns</h3><div class="no-content-message"><p>Fail to upload.</p></div>';
        }
    }
}

function displayMessage(message, type = 'info') {
    const container = document.getElementById('artist-details');
    if (!container) return;

    container.innerHTML = `<div class="message ${type}">${message}</div>`;
}