import { initializeSearch } from './search.mjs';
import { createHeaderFooter } from './commonComponents.mjs';
import { display } from './display.mjs';
import { deezerApi } from './deezerApi.mjs'; 

document.addEventListener('DOMContentLoaded', () => {
    createHeaderFooter(); 
    main.init(); 
});

const main = {
    init: function() {
        this.fetchAndDisplayTrends();
        this.displayRecentlyPlayed();
    },

    fetchAndDisplayTrends: async function() {
        try {
            const topTracks = await deezerApi.getChart('tracks');
            display.renderTracks(topTracks.slice(0, 10), 'trending-tracks-container', false, (trackId) => {
                main.addToRecentlyPlayed(trackId);
                window.location.href = `track.html?id=${trackId}`;
            });
        } catch (error) {
            console.error('Fail to upload:', error);
        }

        try {
            const topArtists = await deezerApi.getChart('artists');
            display.renderArtists(topArtists.slice(0, 10), 'trending-artists-container', (artistId) => {
                window.location.href = `artist.html?id=${artistId}`;
            });
        } catch (error) {
            console.error('Fail to upload:', error);
        }

        try {
            const topPlaylists = await deezerApi.getChart('playlists'); 
            display.renderPlaylists(topPlaylists.slice(0, 10), 'trending-playlists-container');
        } catch (error) {
            console.error('Fail to upload:', error);
        }
    },

    getRecentlyPlayed: function() {
        try {
            return JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        } catch (e) {
            console.error("Erro ao ler 'recentlyPlayed' do localStorage:", e);
            return [];
        }
    },

    addToRecentlyPlayed: async function(trackId) {
        console.log(`Simulating: ${trackId}`);
        
        try {
            const track = await deezerApi.getTrack(trackId);

            if (track && track.id) {
                let recentlyPlayed = this.getRecentlyPlayed();
                recentlyPlayed = recentlyPlayed.filter(t => t.id !== track.id);
                recentlyPlayed.unshift(track);
                recentlyPlayed = recentlyPlayed.slice(0, 5);
                localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
                this.displayRecentlyPlayed();
            }
        } catch (error) {
            console.error('Fail to upload:', error);
        }
    },

    displayRecentlyPlayed: function() {
        const recentlyPlayed = this.getRecentlyPlayed();
        display.renderTracks(recentlyPlayed, 'recently-played-container', true, (trackId) => {
            main.addToRecentlyPlayed(trackId);
            window.location.href = `track.html?id=${trackId}`;
        });
    },
};

export { main };