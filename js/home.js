// The main JavaScript file for the application

import { initializeSearch } from './js/search.mjs';
import { createHeaderFooter } from './js/commonComponents.mjs';

document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
});

const main = {
    init: function() {
        this.handleUserSession();
        this.fetchAndDisplayTrends();
        this.displayRecentlyPlayed();
    },

    handleUserSession: function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const newReleasesSection = document.getElementById('new-releases-section');
            newReleasesSection.classList.remove('hidden');
            this.fetchAndDisplayNewReleases();
        }
    },

    fetchAndDisplayTrends: async function() {
        const topTracks = await deezerApi.getChart('tracks');
        display.renderTracks(topTracks.slice(0, 10), 'trending-tracks-container');

        const topArtists = await deezerApi.getChart('artists');
        display.renderArtists(topArtists.slice(0, 10), 'trending-artists-container');

        const topPlaylists = await deezerApi.getChart('playlists');
        display.renderPlaylists(topPlaylists.slice(0, 10), 'trending-playlists-container');
    },
    
    fetchAndDisplayNewReleases: async function() {
        const newReleases = await deezerApi.getNewReleases();
        display.renderAlbums(newReleases.slice(0, 10), 'new-releases-container');
    },
    getRecentlyPlayed: function() {
        try {
            return JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        } catch (e) {
            return [];
        }
    },

    addToRecentlyPlayed: async function(trackId) {
        console.log(`Simulating playing track ID: ${trackId}`);
        
        const track = await deezerApi.getTrack(trackId);

        if (track && track.id) {
            let recentlyPlayed = this.getRecentlyPlayed();
            recentlyPlayed = recentlyPlayed.filter(t => t.id !== track.id);
            recentlyPlayed.unshift(track);
            recentlyPlayed = recentlyPlayed.slice(0, 5);
            localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
            this.displayRecentlyPlayed();
        }
    },

    displayRecentlyPlayed: function() {
        const recentlyPlayed = this.getRecentlyPlayed();
        display.renderTracks(recentlyPlayed, 'recently-played-container', true);
    }
};

createHeaderFooter();
initializeSearch(); 
document.addEventListener('DOMContentLoaded', () => main.init());