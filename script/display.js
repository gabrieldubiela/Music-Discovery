// Renders information about artists, albums, and songs 
const display = {
    renderTracks: function(tracks, elementId) {
        const container = document.querySelector(elementId);
        let html = '<ul>';
        tracks.slice(0, 5).forEach(track => { // Display top 5
            html += `<li>${track.title} - ${track.artist.name}</li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
    }
};