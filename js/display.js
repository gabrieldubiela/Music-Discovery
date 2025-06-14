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
            html += `
                <div class="card" onclick="main.addToRecentlyPlayed(${track.id})">
                    <img src="${track.album.cover_medium}" alt="${track.album.title}">
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
            html += `
                <div class="card">
                    <img src="${artist.picture_medium}" alt="${artist.name}">
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
            // Deezer API doesn't provide genre images in the chart, so we use a placeholder color
            html += `
                <div class="card" style="background-color: ${'#' + Math.floor(Math.random()*16777215).toString(16)};">
                    <div class="card-title" style="color: white;">${genre.name}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
};