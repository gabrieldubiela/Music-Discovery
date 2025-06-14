// Renders information about artists, albums, and songs
const display = {
    renderTracks: function(tracks, containerId, isRecentlyPlayed = false) {
        const container = document.getElementById(containerId);
        if (!tracks || tracks.length === 0) {
            container.innerHTML = `<p>${isRecentlyPlayed ? 'No recently played music.' : 'No tracks found.'}</p>`;
            return;
        }
        let html = '';
        tracks.forEach(track => {
            const imageUrl = track.album?.cover_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Music';
            html += `
                <div class="card" onclick="main.addToRecentlyPlayed(${track.id})">
                    <img src="${imageUrl}" alt="${track.album?.title || 'Album Art'}">
                    <div class="card-title">${track.title}</div>
                    <div class="card-subtitle">${track.artist.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    renderArtists: function(artists, containerId) {
        const container = document.getElementById(containerId);
        if (!artists || artists.length === 0) {
            container.innerHTML = '<p>No artists found.</p>';
            return;
        }
        let html = '';
        artists.forEach(artist => {
            const imageUrl = artist.picture_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Artist';
            html += `
                <div class="card">
                    <img src="${imageUrl}" alt="${artist.name}">
                    <div class="card-title">${artist.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    renderGenres: function(genres, containerId) {
        const container = document.getElementById(containerId);
        if (!genres || genres.length === 0) {
            container.innerHTML = '<p>No genres found.</p>';
            return;
        }
        let html = '';
        genres.forEach(genre => {
            // Use the image provided by the Deezer API for genres
            const imageUrl = genre.picture_medium || 'https://placehold.co/180x180/00CEC9/FFFFFF?text=Genre';
            html += `
                <div class="card">
                    <img src="${imageUrl}" alt="${genre.name}">
                    <div class="card-title">${genre.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
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