const deezerApi = {
    apiUrl: 'https://api.deezer.com',

    jsonpRequest: function(path) {
        return new Promise((resolve, reject) => {
            const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());

            const script = document.createElement('script');

            window[callbackName] = (data) => {
                document.body.removeChild(script);
                delete window[callbackName];
                if (data.error) {
                    reject(new Error(data.error.message));
                } else {
                    resolve(data);
                }
            };

            script.src = `${this.apiUrl}${path}?output=jsonp&callback=${callbackName}`;
            
            script.onerror = () => {
                reject(new Error('Failed to load script for JSONP request.'));
                document.body.removeChild(script);
                delete window[callbackName];
            };

            document.body.appendChild(script);
        });
    },

    getChart: async function(type = 'tracks') {
        try {
            const response = await this.jsonpRequest(`/chart/0/${type}`);
            return response.data || []; 
        } catch (error) {
            console.error(`Error fetching Deezer chart for ${type}:`, error);
            return []; 
        }
    },
    
    getTrack: async function(trackId) {
        try {
            const response = await this.jsonpRequest(`/track/${trackId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching track ${trackId}:`, error);
            return null;
        }
    },
    getNewReleases: async function() {
        try {
            const response = await this.jsonpRequest('/editorial/0/releases');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching new releases:', error);
            return []; 
        }
    }
};