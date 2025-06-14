function createHeaderFooter() {
    const headerElement = document.getElementById('main-header');
    const footerElement = document.getElementById('main-footer');

    if (headerElement) {
        headerElement.innerHTML = `
            <h1>Music Discovery</h1>
            <nav>
                <a href="index.html">Home</a>
                <a href="playlist.html">My Playlists</a>
                <a href="login.html">Login</a>
            </nav>
        `;
    }

    if (footerElement) {
        footerElement.innerHTML = `
            <p>&copy; 2025 Music Discovery</p>
        `;
    }
}

// Call the function to create the header and footer as soon as the script is loaded
document.addEventListener('DOMContentLoaded', createHeaderFooter);