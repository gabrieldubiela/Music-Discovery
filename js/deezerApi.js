// Manages requests, responses, and data reception from the Deezer API
const deezerApi = {
    // A proxy is needed to avoid CORS issues in a browser environment
    // For development, you can use a service like cors-anywhere
    proxy: 'https://cors-anywhere.herokuapp.com/',

    getChart: async function(type = 'tracks') {
        const response = await fetch(`${this.proxy}https://api.deezer.com/chart/0/${type}`);
        const data = await response.json();
        return data.data;
    }
};