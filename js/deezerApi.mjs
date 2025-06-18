// js/deezerApi.mjs

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

            // CORREÇÃO: Usa '?' se não houver parâmetros ainda, ou '&' se já houver
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

    // FUNÇÕES DE GRÁFICOS E LANÇAMENTOS (MANTIDAS)
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
                type = 'tracks'; // Garante que o tipo padrão seja usado se for inválido
        }

        try {
            const response = await this.jsonpRequest(`${endpoint}?q=${encodeURIComponent(query)}&limit=${limit}`);
            return response || { data: [] };
        } catch (error) {
            console.error(`Error searching ${type} for "${query}":`, error);
            return { data: [] };
        }
    },
};

export { deezerApi };