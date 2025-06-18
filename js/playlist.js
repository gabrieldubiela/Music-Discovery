import { createHeaderFooter } from './commonComponents.mjs';
import { deezerApi } from './deezerApi.mjs';
import { display } from './display.mjs'; 

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
                displayMessage('Fail to upload.', 'error');
            }
        } catch (error) {
            console.error('Fail to upload:', error);
            displayMessage('Fail to upload', 'error');
        }
    } else {
        displayMessage('Fail to upload.', 'info');
    }
});

function renderPlaylistDetails(playlistData) {
    const container = document.getElementById('playlist-details-container');
    if (!container) {
        console.error('Container #playlist-details-container not found.');
        return;
    }

    const imageUrl = playlistData.picture_xl || 'https://placehold.co/500x500/6C5CE7/FFFFFF?text=Playlist';
    const creatorName = playlistData.user?.name || 'Fail to upload'; 

    container.innerHTML = `
        <div class="playlist-detail-card">
            <img class="playlist-cover" src="${imageUrl}" alt="${playlistData.title}">
            <div class="playlist-info">
                <h2 class="playlist-title">${playlistData.title}</h2>
                <p class="playlist-creator">Created by: <a href="#">${creatorName}</a></p>
                <p class="playlist-description">${playlistData.description || 'Fail to upload.'}</p>
                <p class="playlist-num-tracks">Tracks: ${playlistData.nb_tracks}</p>
                <p class="playlist-duration">Duration: ${formatDuration(playlistData.duration)}</p>

                <div id="playlist-tracks-container" class="card-container">
                    <h3>Playlist Tracks</h3>
                    </div>
            </div>
        </div>
    `;

    if (playlistData.tracks && playlistData.tracks.data) {
        const trackCardClickHandler = (trackId) => {
            window.location.href = `track.html?id=${trackId}`;
        };
        display.renderTracks(playlistData.tracks.data, 'playlist-tracks-container', false, trackCardClickHandler);
    } else {
        document.getElementById('playlist-tracks-container').innerHTML = '<div class="no-content-message"><p>Fail to upload.</p></div>';
    }
}

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