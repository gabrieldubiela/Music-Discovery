// The main JavaScript file for the application 
document.addEventListener('DOMContentLoaded', () => {
    console.log("Music Discovery App Initialized");
    // Simple function to test API call on page load
    fetchTrending();
});

async function fetchTrending() {
    // Example: Fetch trending tracks from Deezer
    const trendingData = await deezerApi.search('top tracks');
    display.renderTracks(trendingData.data, '#trending');
}