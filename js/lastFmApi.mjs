const LASTFM_API_KEY = '7b13f2e3f6be48ef63fde69867480b1b'; 
const LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/';

const lastFmApi = {
    getArtistInfo: async function(artistName) {
        if (!LASTFM_API_KEY || LASTFM_API_KEY === 'YOUR_LASTFM_API_KEY') {
            console.error('Erro: wrong API. Go in https://www.last.fm/api/account/create and replace "YOUR_LASTFM_API_KEY".');
            return null;
        }

        const url = `${LASTFM_API_URL}?method=artist.getinfo&artist=${encodeURIComponent(artistName)}&api_key=${LASTFM_API_KEY}&format=json`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                console.error(`Fail to upload: ${response.status} ${response.statusText}`, data);
                return null;
            }

            if (data.error) {
                console.error('Fail to upload:', data.message);
                return null;
            }

            if (data.artist && data.artist.bio && data.artist.bio.content) {
                const bioContent = data.artist.bio.content.replace(/<a href="[^"]*">Read more on Last.fm<\/a>$/, '').trim();
                return {
                    name: data.artist.name,
                    bio: bioContent,
                };
            } else {
                console.warn(`Fail to upload.`);
                return null;
            }

        } catch (error) {
            console.error(`Fail to upload:`, error);
            return null;
        }
    },

    getAlbumInfo: async function(artistName, albumName) {
        if (!LASTFM_API_KEY || LASTFM_API_KEY === 'YOUR_LASTFM_API_KEY') {
            console.error('Erro: wrong API. Go in https://www.last.fm/api/account/create and replace "YOUR_LASTFM_API_KEY".');
            return null;
        }

        const url = `${LASTFM_API_URL}?method=album.getinfo&artist=${encodeURIComponent(artistName)}&album=${encodeURIComponent(albumName)}&api_key=${LASTFM_API_KEY}&format=json`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                console.error(`Fail to upload: ${response.status} ${response.statusText}`, data);
                return null;
            }

            if (data.error) {
                console.error('Fail to upload:', data.message);
                return null;
            }

            if (data.album && data.album.wiki && data.album.wiki.content) {
                const albumSummary = data.album.wiki.content.replace(/<a href="[^"]*">Read more on Last.fm<\/a>$/, '').trim();
                return {
                    title: data.album.name,
                    artist: data.album.artist,
                    summary: albumSummary,
                };
            } else {
                console.warn(`Fail to upload.`);
                return null;
            }

        } catch (error) {
            console.error(`Fail to upload:`, error);
            return null;
        }
    }
};

export { lastFmApi };