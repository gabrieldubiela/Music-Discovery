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

            const connector = path.includes('?') ? '&' : '?';
            script.src = `${this.apiUrl}${path}${connector}output=jsonp&callback=${callbackName}`;
            
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

    generalSearch: async function(query, type = 'tracks', limit = 25) {
        let endpoint = '';
        switch (type) {
            case 'tracks':
                endpoint = '/search';
                break;
            case 'artists':
                endpoint = '/search/artist';
                break;
            case 'albums':
                endpoint = '/search/album';
                break;
            default:
                console.warn(`Invalid search type: ${type}. Defaulting to 'tracks'.`);
                endpoint = '/search';
                type = 'tracks'; 
        }

        try {
            const response = await this.jsonpRequest(`${endpoint}?q=${encodeURIComponent(query)}&limit=${limit}`);
            return response || { data: [] };
        } catch (error) {
            console.error(`Error searching ${type} for "${query}":`, error);
            return { data: [] };
        }
    },

    getAlbum: async function(albumId) {
        try {
            const response = await this.jsonpRequest(`/album/${albumId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching album ${albumId}:`, error);
            return null;
        }
    },

    getArtist: async function(artistId) {
        try {
            const response = await this.jsonpRequest(`/artist/${artistId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching artist ${artistId}:`, error);
            return null;
        }
    },

    getArtistTopTracks: async function(artistId) {
        try {
            const response = await this.jsonpRequest(`/artist/${artistId}/top`);
            return response.data || [];
        } catch (error) {
            console.error(`Fail to upload ${artistId}:`, error);
            return [];
        }
    },

    getArtistAlbums: async function(artistId) {
        try {
            const response = await this.jsonpRequest(`/artist/${artistId}/albums`);
            return response.data || [];
        } catch (error) {
            console.error(`Fail to upload ${artistId}:`, error);
            return [];
        }
    },

    getPlaylist: async function(playlistId) {
        try {
            const response = await this.jsonpRequest(`/playlist/${playlistId}`);
            return response;
        } catch (error) {
            console.error(`Fail to upload ${playlistId}:`, error);
            return null;
        }
    },

};

export { deezerApi };