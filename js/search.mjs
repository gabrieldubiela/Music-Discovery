import { deezerApi } from './deezerApi.mjs'; 
import { display } from './display.mjs';

function displaySearchMessage(message, type = 'info') {
    const messageContainer = document.getElementById('search-message-container');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.classList.remove('hidden');
        setTimeout(() => {
            messageContainer.classList.add('hidden');
            messageContainer.textContent = '';
        }, 3000);
    }
}

export function initializeSearch() {
    const searchInput = document.getElementById('search-input'); 
    const searchButton = document.getElementById('search-button'); 

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    } else {
        console.error('Search input or button not found. Make sure elements with IDs "search-input" and "search-button" exist in your HTML.');
    }
}

async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();

    if (!query) {
        displaySearchMessage('Please enter a search query.', 'error');
        return;
    }

    displaySearchMessage('Searching...', 'info');

    try {
        console.log(`Searching for all types: ${query}`);
        
        const [tracksData, artistsData, albumsData] = await Promise.all([
            deezerApi.generalSearch(query, 'tracks', 25),
            deezerApi.generalSearch(query, 'artists', 10),
            deezerApi.generalSearch(query, 'albums', 10)
        ]);
        
        const searchResults = {
            query: query,
            tracks: tracksData.data || [],
            artists: artistsData.data || [],
            albums: albumsData.data || []
        };

        sessionStorage.setItem('searchResults', JSON.stringify(searchResults));

        window.location.href = 'search_results.html';

    } catch (error) {
        console.error('Error during search:', error);
        displaySearchMessage('Failed to perform search. Please try again later.', 'error');
    }
}