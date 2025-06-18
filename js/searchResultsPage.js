// js/searchResultsPage.mjs

import { createHeaderFooter } from './commonComponents.mjs'; // Importa para criar o header/footer
import { display } from './display.js'; // Importa as funções de renderização

document.addEventListener('DOMContentLoaded', () => {
    createHeaderFooter(); // Chama a função para criar o header e footer
    
    // Pega os resultados da busca do sessionStorage
    const storedResults = sessionStorage.getItem('searchResults');

    if (storedResults) {
        const searchResults = JSON.parse(storedResults);
        
        const queryDisplay = document.getElementById('search-query-display');
        if (queryDisplay) {
            queryDisplay.textContent = searchResults.query;
        }

        // Não há addToRecentlyPlayed nesta página diretamente, então não passamos callback.
        // Se desejar que as faixas aqui também sejam adicionadas, adicione a lógica ou import do main.
        // Por enquanto, vamos manter a simplicidade e não adicionar o listener de clique em search results.
        display.renderTracks(searchResults.tracks, 'tracks-results-container');
        display.renderArtists(searchResults.artists, 'artists-results-container');
        display.renderAlbums(searchResults.albums, 'albums-results-container');

        sessionStorage.removeItem('searchResults');
    } else {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = '<h1>No search results found. Please go back to the <a href="index.html">home page</a> to search.</h1>';
        }
    }
});