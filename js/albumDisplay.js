import { createHeaderFooter } from './commonComponents.mjs';
import { deezerApi } from './deezerApi.mjs';
import { display } from './display.mjs';
import { lastFmApi } from './lastFmApi.mjs'; 

document.addEventListener('DOMContentLoaded', async () => {
    createHeaderFooter();

    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('id');

    if (albumId) {
        try {
            const album = await deezerApi.getAlbum(albumId);
            let artistBioLastFm = null; 
            let albumSummaryLastFm = null; 

            if (album) {
                if (album.artist && album.artist.name) {
                    try {
                        artistBioLastFm = await lastFmApi.getArtistInfo(album.artist.name);
                    } catch (lastFmArtistError) {
                        console.warn('Fail to upload:', lastFmArtistError);
                    }
                }

                if (album.artist && album.artist.name && album.title) {
                    try {
                        albumSummaryLastFm = await lastFmApi.getAlbumInfo(album.artist.name, album.title);
                    } catch (lastFmAlbumError) {
                        console.warn('Fail to upload:', lastFmAlbumError);
                    }
                }
                
                renderAlbumDetails(album, artistBioLastFm, albumSummaryLastFm); 
            } else {
                displayMessage('Fail to upload.', 'error');
            }
        } catch (error) {
            console.error('Fail to upload:', error);
            displayMessage('Fail to upload.', 'error');
        }
    } else {
        displayMessage('Fail to upload.', 'info');
    }
});

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
                <h3>Biograph of (${album.artist.name})</h3>
                <p>${lastFmArtistInfo.bio}</p>
            </div>
        `;
    }

    let albumSummaryHtml = '';
    if (lastFmAlbumInfo && lastFmAlbumInfo.summary) {
        albumSummaryHtml = `
            <div class="album-summary-section">
                <h3>About Album (${album.title})</h3>
                <p>${lastFmAlbumInfo.summary}</p>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="album-detail-card">
            <img class="album-cover" src="${imageUrl}" alt="${album.title}">
            <div class="album-info">
                <h2 class="album-title">${album.title}</h2>
                <p class="album-artist">Artist: <a href="artist.html?id=${album.artist.id}">${album.artist.name}</a></p>
                <p class="album-release-date">Release: ${album.release_date}</p>
                <p class="album-num-tracks">Tracks: ${album.nb_tracks}</p>
                
                ${albumSummaryHtml} ${artistBioHtml}   <div id="album-tracks-container" class="card-container">
                    <h3>Tracks</h3>
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
        document.getElementById('album-tracks-container').innerHTML = '<p>Fail to upload.</p>';
    }
}

function displayMessage(message, type = 'info') {
    const container = document.getElementById('album-details'); 
    if (!container) return;

    container.innerHTML = `<div class="message ${type}">${message}</div>`;
}