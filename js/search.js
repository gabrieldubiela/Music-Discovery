// search.js

import { searchTracks } from './deezerApi.js'; // Assuming deezerApi.js exports a search function
import { displaySearchResults } from './display.js'; // Assuming display.js exports a function to display results

/**
 * Initializes the search functionality.
 * Attaches event listeners to the search input and button.
 */
export function initializeSearch() {
    const searchInput = document.getElementById('search-input'); // Your search input field
    const searchButton = document.getElementById('search-button'); // Your search button

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

/**
 * Performs a search based on the input value.
 * Fetches data from Deezer API and displays results.
 */
async function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();

    if (!query) {
        alert('Please enter a search query.');
        return;
    }

    try {
        console.log(`Searching for: ${query}`);
        const data = await searchTracks(query); // Call the Deezer API function
        console.log('Search results:', data);
        displaySearchResults(data.data); // Assuming Deezer API returns data.data for tracks
    } catch (error) {
        console.error('Error during search:', error);
        alert('Failed to perform search. Please try again later.');
    }
}