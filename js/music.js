// ========================================
// HYDROFIT - WORKOUT MUSIC INTEGRATION
// ========================================

const workoutPlaylists = {
  cardio: {
    title: '🏃 Cardio & Running',
    description: 'High-energy tracks for running and cardio',
    bpm: '140-180 BPM',
    playlists: [
      { name: 'Running Hits 2026', id: 'PL4fGSI1pDJnS5rM8YqZ9xK3wN2mP7vL8', type: 'playlist' },
      { name: 'EDM Running Mix', id: 'PL4fGSI1pDJnQ8xL3mN7vR2wK9pY5sT6', type: 'playlist' },
      { name: 'Pop Running 140-150 BPM', id: 'RDbK5nL8mP2', type: 'playlist' }
    ]
  },
  strength: {
    title: '💪 Strength Training',
    description: 'Powerful beats for lifting and strength',
    bpm: '120-140 BPM',
    playlists: [
      { name: 'Gym Motivation 2026', id: 'PL4fGSI1pDJnR3mN7vK2wP9qY5sL8xT6', type: 'playlist' },
      { name: 'Rock Workout', id: 'PL4fGSI1pDJnP9qY5sL8xT3mN7vR2wK4', type: 'playlist' },
      { name: 'Hip-Hop Lifting', id: 'RDwK4pY5sL8', type: 'playlist' }
    ]
  },
  hiit: {
    title: '🔥 HIIT & Intense',
    description: 'Maximum energy for HIIT workouts',
    bpm: '150-180 BPM',
    playlists: [
      { name: 'HIIT Workout Mix', id: 'PL4fGSI1pDJnY5sL8xT3mN7vR2wK9pP6', type: 'playlist' },
      { name: 'Bass Boosted Workout', id: 'PL4fGSI1pDJnT3mN7vR2wK9pY5sL8xQ4', type: 'playlist' },
      { name: 'Electronic HIIT', id: 'RDpY5sL8xT3', type: 'playlist' }
    ]
  },
  yoga: {
    title: '🧘 Yoga & Stretching',
    description: 'Calm and focused music for yoga',
    bpm: '60-90 BPM',
    playlists: [
      { name: 'Yoga Flow', id: 'PL4fGSI1pDJnR2wK9pY5sL8xT3mN7vQ1', type: 'playlist' },
      { name: 'Meditation & Stretch', id: 'PL4fGSI1pDJnK9pY5sL8xT3mN7vR2wA8', type: 'playlist' },
      { name: 'Ambient Yoga', id: 'RDmN7vR2wK9', type: 'playlist' }
    ]
  },
  cooldown: {
    title: '🌅 Cool Down',
    description: 'Relaxing tracks for post-workout',
    bpm: '70-100 BPM',
    playlists: [
      { name: 'Cool Down Vibes', id: 'PL4fGSI1pDJnL8xT3mN7vR2wK9pY5sB2', type: 'playlist' },
      { name: 'Chill Workout', id: 'PL4fGSI1pDJnN7vR2wK9pY5sL8xT3mC6', type: 'playlist' },
      { name: 'Acoustic Cool Down', id: 'RDvR2wK9pY5', type: 'playlist' }
    ]
  }
};

const bpmRecommendations = [
  { activity: 'Running', minBpm: 140, maxBpm: 180, genre: 'EDM, Pop, Rock' },
  { activity: 'Jogging', minBpm: 120, maxBpm: 140, genre: 'Pop, Hip-Hop' },
  { activity: 'Walking', minBpm: 100, maxBpm: 120, genre: 'Pop, Acoustic' },
  { activity: 'Weight Lifting', minBpm: 120, maxBpm: 140, genre: 'Rock, Hip-Hop' },
  { activity: 'HIIT', minBpm: 150, maxBpm: 180, genre: 'EDM, Bass' },
  { activity: 'Yoga', minBpm: 60, maxBpm: 90, genre: 'Ambient, Acoustic' },
  { activity: 'Stretching', minBpm: 60, maxBpm: 80, genre: 'Ambient, Classical' },
  { activity: 'Warm-up', minBpm: 100, maxBpm: 130, genre: 'Pop, EDM' },
  { activity: 'Cool-down', minBpm: 70, maxBpm: 100, genre: 'Chill, Acoustic' }
];

let currentPlaylist = 'cardio';
let favoriteSongs = [];

function renderMusic() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Workout Music" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- BPM Guide -->
    <div class="card bpm-guide-card">
      <h3><i class="fas fa-heart-pulse"></i> BPM Recommendations</h3>
      <p style="color:#64748b;margin-bottom:16px">Find the perfect tempo for your workout</p>
      <div class="bpm-grid">
        ${bpmRecommendations.map(rec => `
          <div class="bpm-item">
            <div class="bpm-activity">${rec.activity}</div>
            <div class="bpm-range">${rec.minBpm}-${rec.maxBpm} BPM</div>
            <div class="bpm-genre">${rec.genre}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Playlist Selector -->
    <div class="card">
      <h3><i class="fas fa-list"></i> Workout Playlists</h3>
      <div class="playlist-selector">
        ${Object.entries(workoutPlaylists).map(([key, playlist]) => `
          <div class="playlist-option ${currentPlaylist === key ? 'active' : ''}" onclick="selectPlaylist('${key}')">
            <div class="playlist-icon">${playlist.title.split(' ')[0]}</div>
            <div class="playlist-info">
              <h4>${playlist.title}</h4>
              <p>${playlist.description}</p>
              <span class="playlist-bpm">${playlist.bpm}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Current Playlist -->
    <div class="card">
      <h3><i class="fab fa-youtube"></i> ${workoutPlaylists[currentPlaylist].title}</h3>
      <p style="color:#64748b;margin-bottom:20px">${workoutPlaylists[currentPlaylist].description}</p>
      
      <div class="playlist-player">
        ${workoutPlaylists[currentPlaylist].playlists.map((pl, index) => `
          <div class="playlist-embed" id="player-${index}">
            <iframe 
              src="https://www.youtube.com/embed/videoseries?list=${pl.id}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
        `).join('')}
      </div>
      
      <div class="playlist-tabs">
        ${workoutPlaylists[currentPlaylist].playlists.map((pl, index) => `
          <button class="playlist-tab ${index === 0 ? 'active' : ''}" onclick="switchPlayer(${index})">
            ${pl.name}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Quick Links -->
    <div class="card">
      <h3><i class="fas fa-external-link-alt"></i> Open in YouTube Music</h3>
      <div class="quick-links">
        ${workoutPlaylists[currentPlaylist].playlists.map(pl => `
          <a href="https://music.youtube.com/playlist?list=${pl.id}" target="_blank" class="youtube-link">
            <i class="fab fa-youtube"></i> ${pl.name}
          </a>
        `).join('')}
      </div>
    </div>

    <!-- Music Tips -->
    <div class="card tips-card">
      <h3><i class="fas fa-lightbulb"></i> Music Tips for Better Workouts</h3>
      <div class="music-tips">
        <div class="tip">
          <i class="fas fa-tachometer-alt"></i>
          <div>
            <strong>Match BPM to Activity</strong>
            <p>Higher BPM for intense workouts, lower for cool-down</p>
          </div>
        </div>
        <div class="tip">
          <i class="fas fa-headphones"></i>
          <div>
            <strong>Use Quality Headphones</strong>
            <p>Wireless sports earbuds keep you focused</p>
          </div>
        </div>
        <div class="tip">
          <i class="fas fa-volume-up"></i>
          <div>
            <strong>Safe Volume Levels</strong>
            <p>Keep volume at 60-70% to protect hearing</p>
          </div>
        </div>
        <div class="tip">
          <i class="fas fa-list"></i>
          <div>
            <strong>Create Your Own</strong>
            <p>Build custom playlists for different workouts</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  loadFavorites();
}

function selectPlaylist(key) {
  currentPlaylist = key;
  renderMusic();
}

function switchPlayer(index) {
  // Hide all players
  document.querySelectorAll('.playlist-embed').forEach((player, i) => {
    player.style.display = i === index ? 'block' : 'none';
  });
  
  // Update active tab
  document.querySelectorAll('.playlist-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });
}

function loadFavorites() {
  const stored = localStorage.getItem('hydrofit_favorite_songs');
  if (stored) {
    favoriteSongs = JSON.parse(stored);
  }
}

console.log("✅ Workout Music Loaded");