// Renders information about artists, albums, and songs
const display = {
    renderTracks: function(tracks, containerId, isRecentlyPlayed = false) {
        // ... (existing renderTracks function remains the same)
    },

    renderArtists: function(artists, containerId) {
        // ... (existing renderArtists function remains the same)
    },

    /**
     * Renders a list of playlists into cards.
     * @param {Array} playlists - An array of playlist objects from the Deezer API.
     * @param {string} containerId - The ID of the container element.
     */
    renderPlaylists: function(playlists, containerId) {
        const container = document.getElementById(containerId);
        if (!playlists || playlists.length === 0) {
            container.innerHTML = '<p>No playlists found.</p>';
            return;
        }
        let html = '';
        playlists.forEach(playlist => {
            const imageUrl = playlist.picture_medium || 'https://placehold.co/180x180/00CEC9/FFFFFF?text=Playlist';
            html += `
                <div class="card">
                    <img src="${imageUrl}" alt="${playlist.title}">
                    <div class="card-title">${playlist.title}</div>
                    <div class="card-subtitle">By ${playlist.user.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    /**
     * Renders a list of albums into cards (used for New Releases).
     * @param {Array} albums - An array of album objects from the Deezer API.
     * @param {string} containerId - The ID of the container element.
     */
    renderAlbums: function(albums, containerId) {
        const container = document.getElementById(containerId);
        if (!albums || albums.length === 0) {
            container.innerHTML = '<p>No new releases found.</p>';
            return;
        }
        let html = '';
        albums.forEach(album => {
            const imageUrl = album.cover_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Album';
            html += `
                <div class="card">
                    <img src="${imageUrl}" alt="${album.title}">
                    <div class="card-title">${album.title}</div>
                    <div class="card-subtitle">${album.artist.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
};