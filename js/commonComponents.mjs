function createHeaderFooter() {
    const headerElement = document.getElementById('main-header');
    const footerElement = document.getElementById('main-footer');

    if (headerElement) {
        // Check login status from localStorage
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const authLink = isLoggedIn 
            ? '<a href="#" id="auth-link">Logout</a>' 
            : '<a href="login.html" id="auth-link">Login</a>';

        headerElement.innerHTML = `
            <h1>Music Discovery</h1>
            <nav>
                <a href="index.html">Home</a>
                <a href="playlist.html">My Playlists</a>
                ${authLink}
            </nav>
        `;

        // Add event listener only if the auth link is for logging out
        if (isLoggedIn) {
            const authLinkElement = headerElement.querySelector('#auth-link');
            authLinkElement.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                window.location.reload(); // Reload the page to reflect changes
            });
        }
    }

    if (footerElement) {
        footerElement.innerHTML = `
            <p>&copy; 2025 Music Discovery</p>
        `;
    }
}

// Call the function to create the header and footer as soon as the script is loaded
document.addEventListener('DOMContentLoaded', createHeaderFooter);