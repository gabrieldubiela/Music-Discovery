/**
 * Manages requests to the Deezer API using the recommended JSONP method.
 */
const deezerApi = {
    /**
     * The base URL for the Deezer API.
     */
    apiUrl: 'https://api.deezer.com',

    /**
     * A generic handler for making JSONP requests to the Deezer API.
     * This creates a script tag in the page to bypass CORS.
     * @param {string} path - The API endpoint path (e.g., '/chart/0/tracks').
     * @returns {Promise<any>} A promise that resolves with the API response data.
     */
    jsonpRequest: function(path) {
        return new Promise((resolve, reject) => {
            // Create a unique callback function name to avoid conflicts
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

            // Create a script element
            const script = document.createElement('script');

            // Define the callback function on the window object
            window[callbackName] = (data) => {
                // Clean up: remove the script and the callback function
                document.body.removeChild(script);
                delete window[callbackName];

                // Check if the Deezer API returned an error
                if (data.error) {
                    reject(new Error(data.error.message));
                } else {
                    // Resolve the promise with the data
                    resolve(data);
                }
            };

            // Set the script source to the API endpoint with the JSONP callback
            script.src = `${this.apiUrl}${path}?output=jsonp&callback=${callbackName}`;
            
            // Add an error handler for network issues
            script.onerror = () => {
                reject(new Error('Failed to load script for JSONP request.'));
                document.body.removeChild(script);
                delete window[callbackName];
            };

            // Append the script to the body to trigger the request
            document.body.appendChild(script);
        });
    },

    /**
     * Fetches a chart from Deezer (e.g., top tracks, artists, genres).
     * @param {string} type - The type of chart ('tracks', 'artists', 'genres', 'albums').
     * @returns {Promise<Array>} A promise that resolves with an array of chart items.
     */
    getChart: async function(type = 'tracks') {
        try {
            // The API endpoint for charts is /chart/0/{type}
            const response = await this.jsonpRequest(`/chart/0/${type}`);
            // The actual list of items is in the 'data' property of the response
            return response.data || []; 
        } catch (error) {
            console.error(`Error fetching Deezer chart for ${type}:`, error);
            return []; // Return an empty array on failure
        }
    },
    
    /**
     * Fetches details for a single track.
     * @param {number} trackId - The ID of the track.
     * @returns {Promise<Object>} A promise that resolves with the track object.
     */
    getTrack: async function(trackId) {
        try {
            const response = await this.jsonpRequest(`/track/${trackId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching track ${trackId}:`, error);
            return null;
        }
    }
};