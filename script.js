// Get references to the player controls and audio element
/*const playButton = document.querySelector('.fa-circle-play');
const audioElement = document.querySelector('audio');

// Add an event listener to the play button
playButton.addEventListener('click', function () {
    if (audioElement.paused) {
        audioElement.play();
        playButton.classList.add('fa-pause');
        playButton.classList.remove('fa-circle-play');
    } else {
        audioElement.pause();
        playButton.classList.add('fa-circle-play');
        playButton.classList.remove('fa-pause');
    }
});

// Update the progress bar as the audio plays
const progressBar = document.querySelector('.progress-bar');
audioElement.addEventListener('timeupdate', function () {
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration;
    const progressPercentage = (currentTime / duration) * 100;
    progressBar.value = progressPercentage;
});

// Handle user interaction with the progress bar
progressBar.addEventListener('input', function () {
    const seekTime = (progressBar.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
});

// Handle previous and next track buttons if needed
const previousButton = document.querySelector('.fa-backward-step');
const nextButton = document.querySelector('.fa-forward-step');

// Add event listeners for previous and next track buttons
// You can implement logic to change the audio source here

// Function to change the source of the audio element
function changeAudioSource(src) {
    audioElement.src = src;
    audioElement.play();
}

// Example usage:
// previousButton.addEventListener('click', function () {
//     // Change the source to the previous track
//     changeAudioSource('path-to-previous-track.mp3');
// });

// nextButton.addEventListener('click', function () {
//     // Change the source to the next track
//     changeAudioSource('path-to-next-track.mp3');
// });

// Mood-Based Song Recommendation Feature
// Spotify API Credentials (Replace these with your actual credentials)
// Spotify API Credentials (Replace these with your actual credentials)
// Spotify API Credentials*/
// Spotify API Credentials (Replace with your actual credentials)
const CLIENT_ID = "cb0d2464f2e54ef2a988b60d7ddef2ac";
const CLIENT_SECRET = "d454a9a9dce140e285123ef9f7730c7d";
let accessToken = "";

// Function to Get Spotify Access Token
async function getSpotifyToken() {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
            },
            body: "grant_type=client_credentials"
        });

        const data = await response.json();
        accessToken = data.access_token;
        console.log("✅ Spotify Access Token Received:", accessToken);
    } catch (error) {
        console.error("❌ Error getting Spotify token:", error);
    }
}

// Ensure Token is Ready Before API Calls
async function ensureSpotifyToken() {
    if (!accessToken) {
        await getSpotifyToken();
    }
}

// Mood Mapping to Spotify Genres
const moodToGenre = {
    "happy": "pop",
    "sad": "acoustic",
    "angry": "rock",
    "calm": "jazz",
    "neutral": "chill"
};

// Fetch Songs from Spotify Based on Mood
async function getSpotifyRecommendations(mood) {
    await ensureSpotifyToken(); // Make sure the token is ready

    const genre = moodToGenre[mood] || "pop"; // Default to pop if mood is unknown

    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}&limit=5`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (response.status === 401) { // Token expired, refresh it
            console.warn("🔄 Token expired. Fetching new token...");
            await getSpotifyToken();
            return getSpotifyRecommendations(mood); // Retry API call
        }

        const data = await response.json();

        if (!data.tracks || data.tracks.length === 0) {
            console.warn("⚠️ No tracks found for mood:", mood);
            return [];
        }

        return data.tracks.map(track => ({
            name: track.name,
            artist: track.artists[0].name,
            uri: track.uri
        }));
    } catch (error) {
        console.error("❌ Error fetching Spotify recommendations:", error);
        return [];
    }
}

// Function to Play a Song using Spotify Embed Player
function playSong(uri) {
    if (!uri) {
        console.error("❌ No URI provided for playback.");
        return;
    }

    const songId = uri.split(":")[2]; // Extracting the song ID
    if (!songId) {
        console.error("❌ Invalid Spotify URI:", uri);
        return;
    }

    // Show the player and set the correct song in the embedded Spotify iframe
    document.getElementById("spotifyPlayer").style.display = "block";
    document.getElementById("playerFrame").src = `https://open.spotify.com/embed/track/${songId}`;
}

// Event Listener for "Live the Moment" Button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("analyzeMood").addEventListener("click", async function () {
        const userInput = document.getElementById("moodInput").value.toLowerCase().trim();

        if (!userInput) {
            alert("⚠️ Please describe your mood or an incident.");
            return;
        }

        console.log("📌 User Input:", userInput);

        // Detect Mood
        let mood = "neutral";
        if (userInput.includes("happy") || userInput.includes("excited") || userInput.includes("joy")) {
            mood = "happy";
        } else if (userInput.includes("sad") || userInput.includes("depressed") || userInput.includes("down")) {
            mood = "sad";
        } else if (userInput.includes("angry") || userInput.includes("furious") || userInput.includes("annoyed")) {
            mood = "angry";
        } else if (userInput.includes("calm") || userInput.includes("relaxed") || userInput.includes("peaceful")) {
            mood = "calm";
        }

        console.log("📌 Detected Mood:", mood);

        // Fetch Spotify Recommendations
        const recommendedSongs = await getSpotifyRecommendations(mood);

        console.log("📌 Recommended Songs:", recommendedSongs);

        // Display Recommendations with Play Buttons
        const songDiv = document.getElementById("songRecommendations");
        if (recommendedSongs.length === 0) {
            songDiv.innerHTML = `<p>No songs found for this mood. Try again later!</p>`;
            return;
        }

        songDiv.innerHTML = `
            <h3>🎵 Recommended Songs for Your Mood:</h3>
            <ul>
                ${recommendedSongs.map(song => `
                    <li>
                        ${song.name} - ${song.artist} 
                        <button onclick="playSong('${song.uri}')">▶ Play</button>
                    </li>
                `).join('')}
            </ul>
        `;
    });
});


