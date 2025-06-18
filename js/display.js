// js/display.js

const display = {
    // Adicionado onCardClickCallback para lidar com cliques no card
    renderTracks: function(tracks, containerId, isRecentlyPlayed = false, onCardClickCallback = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found for tracks.`);
            return;
        }

        if (!tracks || tracks.length === 0) {
            container.innerHTML = `<div class="no-content-message"><p>${isRecentlyPlayed ? 'No recently played music.' : 'No tracks found.'}</p></div>`;
            return;
        }
        let html = '';
        tracks.forEach(track => {
            const imageUrl = track.album?.cover_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Music';
            // Usa data-track-id e adiciona evento programaticamente
            html += `
                <div class="card" data-track-id="${track.id}">
                    <img src="${imageUrl}" alt="${track.album?.title || 'Album Art'}">
                    <div class="card-title">${track.title}</div>
                    <div class="card-subtitle">${track.artist.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;

        // Adiciona event listener para cada card se um callback foi fornecido
        if (onCardClickCallback && typeof onCardClickCallback === 'function') {
            container.querySelectorAll('.card').forEach(card => {
                card.addEventListener('click', () => {
                    const trackId = card.dataset.trackId;
                    onCardClickCallback(trackId);
                });
            });
        }
    },

    renderArtists: function(artists, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found for artists.`);
            return;
        }
        if (!artists || artists.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>No artists found.</p></div>';
            return;
        }
        let html = '';
        artists.forEach(artist => {
            const imageUrl = artist.picture_medium || 'https://placehold.co/180x180/1abc9c/FFFFFF?text=Artist';
            html += `
                <div class="card">
                    <img src="${imageUrl}" alt="${artist.name}">
                    <div class="card-title">${artist.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    renderPlaylists: function(playlists, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found for playlists.`);
            return;
        }
        if (!playlists || playlists.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>No playlists found.</p></div>';
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

    renderAlbums: function(albums, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found for albums.`);
            return;
        }
        if (!albums || albums.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>No albums found.</p></div>';
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
    },
};

export { display };