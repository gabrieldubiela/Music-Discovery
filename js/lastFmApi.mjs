// js/lastFmApi.mjs

// IMPORTANTE: Substitua 'YOUR_LASTFM_API_KEY' pela sua chave de API real do Last.fm.
// Você pode obter uma chave aqui: https://www.last.fm/api/account/create
const LASTFM_API_KEY = '7b13f2e3f6be48ef63fde69867480b1b'; 
const LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/';

const lastFmApi = {
    /**
     * Busca informações do artista (incluindo biografia) do Last.fm.
     * @param {string} artistName - O nome do artista para pesquisar.
     * @returns {Promise<Object|null>} Uma promessa que resolve com as informações do artista ou null em caso de erro.
     */
    getArtistInfo: async function(artistName) {
        if (!LASTFM_API_KEY || LASTFM_API_KEY === 'YOUR_LASTFM_API_KEY') {
            console.error('Erro: A chave da API do Last.fm não está configurada. Obtenha uma em https://www.last.fm/api/account/create e substitua "YOUR_LASTFM_API_KEY".');
            return null;
        }

        const url = `${LASTFM_API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                console.error(`Last.fm API retornou status não OK para info do artista: ${response.status} ${response.statusText}`, data);
                return null;
            }

            if (data.error) {
                console.error('Erro da API Last.fm para info do artista:', data.message);
                return null;
            }

            // Verifica se os dados do artista existem e se há conteúdo de biografia
            // O bio.content pode vir com links HTML, vamos retornar o conteúdo bruto
            if (data.artist && data.artist.bio && data.artist.bio.content) {
                // Last.fm adiciona um link de "Read more" no final da biografia.
                // Podemos remover isso para ter apenas o texto da biografia.
                const bioContent = data.artist.bio.content.replace(/<a href="[^"]*">Read more on Last.fm<\/a>$/, '').trim();
                return {
                    name: data.artist.name,
                    bio: bioContent,
                    // Você pode adicionar outras propriedades do artista Last.fm aqui se precisar
                    // Por exemplo: data.artist.image para imagens, data.artist.url para o perfil
                };
            } else {
                console.warn(`Nenhuma informação abrangente do artista (ex: biografia) encontrada para "${artistName}" no Last.fm.`);
                return null;
            }

        } catch (error) {
            console.error(`Erro ao buscar informações do artista "${artistName}" do Last.fm (rede ou fetch geral):`, error);
            return null;
        }
    },

    /**
     * Busca informações do álbum (incluindo resumo/resenha) do Last.fm.
     * @param {string} artistName - O nome do artista do álbum.
     * @param {string} albumName - O nome do álbum.
     * @returns {Promise<Object|null>} Uma promessa que resolve com as informações do álbum ou null em caso de erro.
     */
    getAlbumInfo: async function(artistName, albumName) {
        if (!LASTFM_API_KEY || LASTFM_API_KEY === 'YOUR_LASTFM_API_KEY') {
            console.error('Erro: A chave da API do Last.fm não está configurada. Obtenha uma em https://www.last.fm/api/account/create e substitua "YOUR_LASTFM_API_KEY".');
            return null;
        }

        const url = `${LASTFM_API_URL}?method=album.getinfo&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&api_key=${LASTFM_API_KEY}&format=json`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                console.error(`Last.fm API retornou status não OK para info do álbum: ${response.status} ${response.statusText}`, data);
                return null;
            }

            if (data.error) {
                console.error('Erro da API Last.fm para info do álbum:', data.message);
                return null;
            }

            // Verifica se os dados do álbum existem e se há um resumo (wiki)
            if (data.album && data.album.wiki && data.album.wiki.content) {
                // Last.fm adiciona um link de "Read more" no final do resumo.
                const albumSummary = data.album.wiki.content.replace(/<a href="[^"]*">Read more on Last.fm<\/a>$/, '').trim();
                return {
                    title: data.album.name,
                    artist: data.album.artist,
                    summary: albumSummary,
                    // Você pode adicionar outras propriedades do álbum Last.fm aqui se precisar
                    // Por exemplo: data.album.image para imagens, data.album.url para o perfil
                };
            } else {
                console.warn(`Nenhuma informação abrangente do álbum (ex: resumo) encontrada para "${albumName}" por "${artistName}" no Last.fm.`);
                return null;
            }

        } catch (error) {
            console.error(`Erro ao buscar informações do álbum "${albumName}" por "${artistName}" do Last.fm (rede ou fetch geral):`, error);
            return null;
        }
    }
};

export { lastFmApi };