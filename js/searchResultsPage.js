import { createHeaderFooter } from './commonComponents.mjs'; 
import { display } from './display.mjs';

document.addEventListener('DOMContentLoaded', () => {
    createHeaderFooter();
    
    const storedResults = sessionStorage.getItem('searchResults');

    if (storedResults) {
        const searchResults = JSON.parse(storedResults);
        
        const queryDisplay = document.getElementById('search-query-display');
        if (queryDisplay) {
            queryDisplay.textContent = searchResults.query;
        }

        const trackCardClickHandler = (trackId) => {
            window.location.href = `track.html?id=${trackId}`; 
        };

        const artistCardClickHandler = (artistId) => {
            window.location.href = `artist.html?id=${artistId}`;
        };

        const albumCardClickHandler = (albumId) => {
            window.location.href = `album.html?id=${albumId}`;
        };

        display.renderTracks(searchResults.tracks, 'tracks-results-container', false, trackCardClickHandler);
        display.renderArtists(searchResults.artists, 'artists-results-container', artistCardClickHandler); 
        display.renderAlbums(searchResults.albums, 'albums-results-container', albumCardClickHandler);  

        sessionStorage.removeItem('searchResults');
    } else {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = '<h1>Fail to upload.</h1>';
        }
    }
});