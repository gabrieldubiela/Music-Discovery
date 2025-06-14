// The main JavaScript file for the application
const main = {
    init: function() {
        console.log("Music Discovery App Initialized");
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
        // Fetch and display trending tracks
        const topTracks = await deezerApi.getChart('tracks');
        display.renderTracks(topTracks.slice(0, 10), 'trending-tracks-container');

        // Fetch and display trending artists
        const topArtists = await deezerApi.getChart('artists');
        display.renderArtists(topArtists.slice(0, 10), 'trending-artists-container');

        // Fetch and display trending playlists
        const topPlaylists = await deezerApi.getChart('playlists');
        display.renderPlaylists(topPlaylists.slice(0, 10), 'trending-playlists-container');
    },
    
    fetchAndDisplayNewReleases: async function() {
        const newReleases = await deezerApi.getNewReleases();
        display.renderAlbums(newReleases.slice(0, 10), 'new-releases-container');
    },
    getRecentlyPlayed: function() {
        // Safely parse JSON from localStorage
        try {
            return JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        } catch (e) {
            return [];
        }
    },

    addToRecentlyPlayed: async function(trackId) {
        // In a full app, this would be called from the player.
        console.log(`Simulating playing track ID: ${trackId}`);
        
        // Fetch the full track details
        const track = await deezerApi.getTrack(trackId);

        if (track && track.id) {
            let recentlyPlayed = this.getRecentlyPlayed();
            // Remove if already in the list to move it to the front
            recentlyPlayed = recentlyPlayed.filter(t => t.id !== track.id);
            // Add to the beginning of the array
            recentlyPlayed.unshift(track);
            // Keep only the last 5 played songs
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

document.addEventListener('DOMContentLoaded', () => main.init());