const display = {
    renderTracks: function(tracks, containerId, isRecentlyPlayed = false, clickHandler = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`None results for your search`);
            return;
        }

        container.innerHTML = '';

        if (!tracks || tracks.length === 0) {
            container.innerHTML = `<div class="no-content-message"><p>${isRecentlyPlayed ? 'No music recently played.' : 'None results for your search'}</p></div>`;
            return;
        }

        tracks.forEach(track => {
            const imageUrl = track.album?.cover_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Música';
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${track.album?.title || 'Album'}">
                <div class="card-title">${track.title}</div>
                <div class="card-subtitle">${track.artist.name}</div>
            `;

            if (clickHandler) {
                card.addEventListener('click', () => clickHandler(track.id));
            }

            container.appendChild(card);
        });
    },

    renderArtists: function(artists, containerId, clickHandler = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`None results for your search`);
            return;
        }

        container.innerHTML = '';

        if (!artists || artists.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>None results for your search.</p></div>';
            return;
        }
        
        artists.forEach(artist => {
            const imageUrl = artist.picture_medium || 'https://placehold.co/180x180/00CEC9/FFFFFF?text=Artista';
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${artist.name}">
                <div class="card-title">${artist.name}</div>
            `;
            if (clickHandler) {
                card.addEventListener('click', () => clickHandler(artist.id));
            }
            container.appendChild(card);
        });
    },

    renderPlaylists: function(playlists, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`None results for your search`);
            return;
        }

        container.innerHTML = '';

        if (!playlists || playlists.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>None results for your search.</p></div>';
            return;
        }

        playlists.forEach(playlist => {
            const imageUrl = playlist.picture_medium || 'https://placehold.co/180x180/00CEC9/FFFFFF?text=Playlist';
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${playlist.title}">
                <div class="card-title">${playlist.title}</div>
                <div class="card-subtitle">Por ${playlist.user.name}</div>
            `;
            card.addEventListener('click', () => window.location.href = `playlist.html?id=${playlist.id}`);
            container.appendChild(card);
        });
    },

    renderAlbums: function(albums, containerId, clickHandler = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`None results for your search`);
            return;
        }

        container.innerHTML = '';

        if (!albums || albums.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>None results for your search.</p></div>';
            return;
        }
        
        albums.forEach(album => {
            const imageUrl = album.cover_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Álbum';
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${album.title}">
                <div class="card-title">${album.title}</div>
                <div class="card-subtitle">${album.artist?.name || 'None results for your search'}</div> `;
            if (clickHandler) {
                card.addEventListener('click', () => clickHandler(album.id));
            }
            container.appendChild(card);
        });
    },

    displaySearchResults: function(results) {
        const searchResultsContainer = document.getElementById('search-results-container');
        if (!searchResultsContainer) {
            console.error('None results for your search (ID: search-results-container).');
            return;
        }

        searchResultsContainer.innerHTML = '';

        if (!results || results.length === 0) {
            searchResultsContainer.innerHTML = '<div class="no-content-message"><p>None results for your search.</p></div>';
            return;
        }

        this.renderTracks(results, 'search-results-container', false, (trackId) => {
            window.location.href = `track.html?id=${trackId}`;
        });
    }
};

export { display };