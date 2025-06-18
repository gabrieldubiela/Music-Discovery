// Manages requests, responses, and data reception from the AudioDB API 
const audioDbApi = {
    getArtistInfo: async function(artistName) {
        const response = await fetch(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${artistName}`);
        const data = await response.json();
        return data;
    }
};