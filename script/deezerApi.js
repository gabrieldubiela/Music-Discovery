// Manages requests, responses, and data reception from the Deezer API 
const deezerApi = {
    search: async function(query) {
        // A proxy may be needed to avoid CORS issues in a browser environment
        const response = await fetch(`https://api.deezer.com/search?q=${query}`);
        const data = await response.json();
        return data;
    }
};