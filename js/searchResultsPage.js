// js/searchResultsPage.mjs

import { createHeaderFooter } from './commonComponents.mjs'; // Importa para criar o header/footer
import { display } from './display.mjs'; // Importa as funções de renderização (certifique-se que o arquivo é display.js, não display.mjs)

document.addEventListener('DOMContentLoaded', () => {
    createHeaderFooter();
    
    const storedResults = sessionStorage.getItem('searchResults');

    if (storedResults) {
        const searchResults = JSON.parse(storedResults);
        
        const queryDisplay = document.getElementById('search-query-display');
        if (queryDisplay) {
            queryDisplay.textContent = searchResults.query;
        }

        // Define a função de callback para os cards de faixas nos resultados da busca
        const trackCardClickHandler = (trackId) => {
            // Por simplicidade, nesta página, apenas redireciona.
            // Se você quiser que o clique aqui também adicione à "recentemente tocadas",
            // você precisaria importar o 'main' ou uma função de 'addToRecentlyPlayed' para cá.
            window.location.href = `track.html?id=${trackId}`; 
        };

        // NOVO: Define a função de callback para os cards de artistas nos resultados da busca
        const artistCardClickHandler = (artistId) => {
            window.location.href = `artist.html?id=${artistId}`;
        };

        // NOVO: Define a função de callback para os cards de álbuns nos resultados da busca
        const albumCardClickHandler = (albumId) => {
            window.location.href = `album.html?id=${albumId}`;
        };

        // Passa os callbacks para as respectivas funções de renderização
        display.renderTracks(searchResults.tracks, 'tracks-results-container', false, trackCardClickHandler);
        display.renderArtists(searchResults.artists, 'artists-results-container', artistCardClickHandler); // Passando o handler do artista
        display.renderAlbums(searchResults.albums, 'albums-results-container', albumCardClickHandler);   // Passando o handler do álbum

        // Limpa os resultados da sessão para que não apareçam novamente em um recarregamento
        sessionStorage.removeItem('searchResults');
    } else {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = '<h1>Nenhum resultado de busca encontrado. Por favor, retorne para a <a href="index.html">página inicial</a> para buscar.</h1>';
        }
    }
});