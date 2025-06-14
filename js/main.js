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
        // ... (existing function remains the same)
    },

    addToRecentlyPlayed: async function(trackId) {
        // ... (existing function remains the same)
    },

    displayRecentlyPlayed: function() {
        // ... (existing function remains the same)
    }
};

document.addEventListener('DOMContentLoaded', () => main.init());