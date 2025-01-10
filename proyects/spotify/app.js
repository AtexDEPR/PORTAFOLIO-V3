        // Estado global de la aplicación
        const state = {
            songs: [],
            currentSongIndex: 0,
            isPlaying: false,
            audio: new Audio(),
        };

        // Funciones de la API
        async function fetchSongs() {
            try {
                const response = await fetch('./api/app.json'); // Asegúrate de usar la ruta correcta
                const data = await response.json();
                state.songs = data.songs;
                renderSongs();
                renderRecentSongs();
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        }

        // Funciones de renderizado
        function renderSongs() {
            const container = document.getElementById('songs-container');
            container.innerHTML = state.songs.map((song, index) => `
                <div class="p-4 bg-spotify-dark rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                     onclick="playSong(${index})">
                    <div class="relative">
                        <img src="${song.coverUrl}" alt="${song.title}" class="w-full rounded-md mb-4">
                        <button class="absolute bottom-6 right-2 w-10 h-10 bg-spotify-green rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            <i class="fas fa-play text-black"></i>
                        </button>
                    </div>
                    <h3 class="font-semibold mb-1 truncate">${song.title}</h3>
                    <p class="text-sm text-gray-400 truncate">${song.album}</p>
                </div>
            `).join('');
        }

        function renderRecentSongs() {
            const container = document.getElementById('recent-songs');
            const recentSongs = state.songs.slice(0, 5);
            container.innerHTML = recentSongs.map((song, index) => `
                <div class="p-4 bg-spotify-dark rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                     onclick="playSong(${index})">
                    <div class="relative">
                        <img src="${song.coverUrl}" alt="${song.title}" class="w-full rounded-md mb-4">
                        <button class="absolute bottom-6 right-2 w-10 h-10 bg-spotify-green rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            <i class="fas fa-play text-black"></i>
                        </button>
                    </div>
                    <h3 class="font-semibold mb-1 truncate">${song.title}</h3>
                    <p class="text-sm text-gray-400 truncate">${song.album}</p>
                </div>
            `).join('');
        }

        // Funciones del reproductor
        function playSong(index) {
            state.currentSongIndex = index;
            const song = state.songs[index];
            
            // Reproducir usando la URL del streaming (Spotify)
            if (song.streamingServices?.spotify) {
                state.audio.src = song.streamingServices.spotify;
            }
            
            updatePlayerUI();
            togglePlay();
        }

        function togglePlay() {
            if (state.isPlaying) {
                state.audio.pause();
            } else {
                state.audio.play();
            }
            state.isPlaying = !state.isPlaying;
            updatePlayButton();
        }

        function updatePlayButton() {
            const playButton = document.getElementById('play-button');
            playButton.innerHTML = `<i class="fas fa-${state.isPlaying ? 'pause' : 'play'}"></i>`;
        }

        function updatePlayerUI() {
            const song = state.songs[state.currentSongIndex];
            document.getElementById('current-song-title').textContent = song.title;
            document.getElementById('current-song-artist').textContent = song.album;
            document.getElementById('current-song-image').src = song.coverUrl;  // Actualizar imagen
        }

        // Event Listeners
        document.getElementById('play-button').addEventListener('click', togglePlay);
        document.getElementById('prev-button').addEventListener('click', () => {
            state.currentSongIndex = (state.currentSongIndex - 1 + state.songs.length) % state.songs.length;
            playSong(state.currentSongIndex);
        });
        document.getElementById('next-button').addEventListener('click', () => {
            state.currentSongIndex = (state.currentSongIndex + 1) % state.songs.length;
            playSong(state.currentSongIndex);
        });

        // Actualizar la barra de progreso
        state.audio.addEventListener('timeupdate', () => {
            const progress = (state.audio.currentTime / state.audio.duration) * 100;
            document.getElementById('progress-bar').style.width = `${progress}%`;
            document.getElementById('current-time').textContent = formatTime(state.audio.currentTime);
            document.getElementById('duration').textContent = formatTime(state.audio.duration);
        });

        function formatTime(seconds) {
            if (isNaN(seconds)) return "0:00";
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        // Inicializar la aplicación
        fetchSongs();