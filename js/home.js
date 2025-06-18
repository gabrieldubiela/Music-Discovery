// js/home.js

// Removido: import { initializeSearch } from './js/search.mjs'; // Não é mais necessário aqui
import { createHeaderFooter } from './commonComponents.mjs'; // Importa a função de criação do header/footer
import { deezerApi } from './deezerApi.mjs';
import { display } from './display.js';

const main = {
    init: function() {
        createHeaderFooter(); // Chama a função para criar o header e footer
        this.handleUserSession();
        this.fetchAndDisplayTrends();
        this.displayRecentlyPlayed();
    },

    handleUserSession: function() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            // Removido: Chamadas e lógica relacionadas a 'New Releases'
        }
    },

    fetchAndDisplayTrends: async function() {
        const topTracks = await deezerApi.getChart('tracks');
        // Passa main.addToRecentlyPlayed como callback para renderTracks
        display.renderTracks(topTracks.slice(0, 10), 'trending-tracks-container', false, this.addToRecentlyPlayed.bind(this));

        const topArtists = await deezerApi.getChart('artists');
        display.renderArtists(topArtists.slice(0, 10), 'trending-artists-container');

        const topPlaylists = await deezerApi.getChart('playlists');
        display.renderPlaylists(topPlaylists.slice(0, 10), 'trending-playlists-container');
    },
    
    // Removido: fetchAndDisplayNewReleases

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
        // Passa main.addToRecentlyPlayed como callback para renderTracks
        display.renderTracks(recentlyPlayed, 'recently-played-container', true, this.addToRecentlyPlayed.bind(this));
    }
};

// Garante que main.init é chamado ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    main.init();
});