// js/display.js

// Renders information about artists, albums, and songs
const display = {
    /**
     * Renderiza uma lista de faixas em cards.
     * @param {Array} tracks - Um array de objetos de faixas da API do Deezer.
     * @param {string} containerId - O ID do elemento container.
     * @param {boolean} [isRecentlyPlayed=false] - Indica se é para a seção "Recently Played".
     * @param {Function} [clickHandler=null] - Uma função de callback para o clique do card, que recebe o trackId.
     */
    renderTracks: function(tracks, containerId, isRecentlyPlayed = false, clickHandler = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container com ID "${containerId}" não encontrado para faixas.`);
            return;
        }

        container.innerHTML = ''; // Limpa o conteúdo anterior

        if (!tracks || tracks.length === 0) {
            container.innerHTML = `<div class="no-content-message"><p>${isRecentlyPlayed ? 'Nenhuma música reproduzida recentemente.' : 'Nenhuma faixa encontrada.'}</p></div>`;
            return;
        }

        tracks.forEach(track => {
            const imageUrl = track.album?.cover_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Música';
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${track.album?.title || 'Capa do Álbum'}">
                <div class="card-title">${track.title}</div>
                <div class="card-subtitle">${track.artist.name}</div>
            `;

            if (clickHandler) {
                card.addEventListener('click', () => clickHandler(track.id));
            }

            container.appendChild(card);
        });
    },

    /**
     * Renderiza uma lista de artistas em cards.
     * @param {Array} artists - Um array de objetos de artistas da API do Deezer.
     * @param {string} containerId - O ID do elemento container.
     * @param {Function} [clickHandler=null] - Uma função de callback para o clique do card, que recebe o artistId.
     */
    renderArtists: function(artists, containerId, clickHandler = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container com ID "${containerId}" não encontrado para artistas.`);
            return;
        }

        container.innerHTML = '';

        if (!artists || artists.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>Nenhum artista encontrado.</p></div>';
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

    /**
     * Renderiza uma lista de playlists em cards.
     * @param {Array} playlists - Um array de objetos de playlists da API do Deezer.
     * @param {string} containerId - O ID do elemento container.
     */
    renderPlaylists: function(playlists, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container com ID "${containerId}" não encontrado para playlists.`);
            return;
        }

        container.innerHTML = '';

        if (!playlists || playlists.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>Nenhuma playlist encontrada.</p></div>';
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

    /**
     * Renderiza uma lista de álbuns em cards.
     * @param {Array} albums - Um array de objetos de álbum da API do Deezer.
     * @param {string} containerId - O ID do elemento container.
     * @param {Function} [clickHandler=null] - Uma função de callback para o clique do card, que recebe o albumId.
     */
    renderAlbums: function(albums, containerId, clickHandler = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container com ID "${containerId}" não encontrado para álbuns.`);
            return;
        }

        container.innerHTML = '';

        if (!albums || albums.length === 0) {
            container.innerHTML = '<div class="no-content-message"><p>Nenhum álbum encontrado.</p></div>';
            return;
        }
        
        albums.forEach(album => {
            const imageUrl = album.cover_medium || 'https://placehold.co/180x180/6C5CE7/FFFFFF?text=Álbum';
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${imageUrl}" alt="${album.title}">
                <div class="card-title">${album.title}</div>
                <div class="card-subtitle">${album.artist?.name || 'Artista Desconhecido'}</div> `;
            if (clickHandler) {
                card.addEventListener('click', () => clickHandler(album.id));
            }
            container.appendChild(card);
        });
    },

    displaySearchResults: function(results) {
        const searchResultsContainer = document.getElementById('search-results-container');
        if (!searchResultsContainer) {
            console.error('Container de resultados de busca não encontrado (ID: search-results-container).');
            return;
        }

        searchResultsContainer.innerHTML = '';

        if (!results || results.length === 0) {
            searchResultsContainer.innerHTML = '<div class="no-content-message"><p>Nenhum resultado encontrado para sua busca.</p></div>';
            return;
        }

        this.renderTracks(results, 'search-results-container', false, (trackId) => {
            window.location.href = `track.html?id=${trackId}`;
        });
    }
};

export { display };