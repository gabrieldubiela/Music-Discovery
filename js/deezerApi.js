/**
 * Manages requests to the Deezer API using the recommended JSONP method.
 */
const deezerApi = {
    apiUrl: 'https://api.deezer.com',

    jsonpRequest: function(path) {
        // ... (existing jsonpRequest function remains the same)
    },

    getChart: async function(type = 'tracks') {
        // ... (existing getChart function remains the same)
    },
    
    getTrack: async function(trackId) {
        // ... (existing getTrack function remains the same)
    },
    
    /**
     * Fetches the latest album releases from the editorial selection.
     * @returns {Promise<Array>} A promise that resolves with an array of album items.
     */
    getNewReleases: async function() {
        try {
            const response = await this.jsonpRequest('/editorial/0/releases');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching new releases:', error);
            return []; // Return an empty array on failure
        }
    }
};