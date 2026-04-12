// ========================================
// HYDROFIT - YOUTUBE MUSIC WITH USER LOGIN
// ========================================

const YOUTUBE_CLIENT_ID = '147d105e5c764b03b0fd25021f1a4326'; // Use your Google Client ID
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY';
const REDIRECT_URI = window.location.origin + window.location.pathname;
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
].join(' ');

let accessToken = null;
let userProfile = null;
let userPlaylists = [];
let youtubePlayer = null;
let currentVideo = null;
let isPlaying = false;

// Check for saved token
(function init() {
  const savedToken = localStorage.getItem('youtube_access_token');
  const tokenExpiry = localStorage.getItem('youtube_token_expiry');
  
  if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
    accessToken = savedToken;
    console.log('✅ Token loaded from storage');
  }
  
  // Check URL for token
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const urlToken = params.get('access_token');
  const expiresIn = params.get('expires_in');
  
  if (urlToken) {
    accessToken = urlToken;
    const expiry = Date.now() + (parseInt(expiresIn) * 1000);
    localStorage.setItem('youtube_access_token', urlToken);
    localStorage.setItem('youtube_token_expiry', expiry);
    window.location.hash = '';
    console.log('✅ Token saved from URL');
  }
})();

function renderMusic() {
  const container = document.getElementById("tabContent");
  const isConnected = accessToken !== null;
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Workout Music" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    ${!isConnected ? `
      <!-- Connect YouTube -->
      <div class="card connect-card">
        <div class="connect-header">
          <i class="fab fa-youtube" style="color:#FF0000"></i>
          <h2>Connect Your YouTube</h2>
        </div>
        <p style="color:#64748b;margin-bottom:24px;text-align:center">
          Connect your YouTube account to access your personal playlists and music
        </p>
        <button class="youtube-connect-btn" id="youtubeConnectBtn">
          <i class="fab fa-youtube"></i> Connect YouTube Account
        </button>
        <p class="connect-hint">
          <i class="fas fa-info-circle"></i> You'll be redirected to Google to authorize access
        </p>
      </div>
    ` : `
      <!-- Connected User Info -->
      <div class="card user-card">
        <div class="user-info">
          <img id="userAvatar" src="" alt="Profile" class="user-avatar">
          <div>
            <h3 id="userName">Loading profile...</h3>
            <p id="userEmail"></p>
          </div>
          <button class="btn btn-outline" id="disconnectBtn">
            <i class="fas fa-sign-out-alt"></i> Disconnect
          </button>
        </div>
      </div>

      <!-- Now Playing -->
      <div class="card now-playing-card" id="nowPlayingCard" style="display:none">
        <h3><i class="fas fa-play-circle"></i> Now Playing</h3>
        <div class="video-container">
          <div id="youtubePlayer"></div>
        </div>
        <div class="now-playing-info">
          <h4 id="videoTitle">No video playing</h4>
          <p id="videoChannel"></p>
        </div>
        <div class="player-controls">
          <button class="player-btn" id="prevBtn"><i class="fas fa-step-backward"></i></button>
          <button class="player-btn play-pause" id="playPauseBtn"><i class="fas fa-play"></i></button>
          <button class="player-btn" id="nextBtn"><i class="fas fa-step-forward"></i></button>
        </div>
        <div class="volume-control">
          <i class="fas fa-volume-down"></i>
          <input type="range" id="volumeSlider" min="0" max="100" value="50">
          <i class="fas fa-volume-up"></i>
        </div>
      </div>

      <!-- My YouTube Playlists -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h3 style="margin:0"><i class="fab fa-youtube"></i> My Playlists</h3>
          <button class="refresh-btn" id="refreshPlaylistsBtn">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div id="playlistsList">
          <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i> Loading your playlists...
          </div>
        </div>
      </div>

      <!-- Search YouTube -->
      <div class="card search-card">
        <h3><i class="fas fa-search"></i> Search YouTube Music</h3>
        <div class="search-bar">
          <input type="text" id="searchInput" class="form-control" placeholder="Search for songs...">
          <button class="btn" id="searchBtn"><i class="fas fa-search"></i> Search</button>
        </div>
        <div id="searchResults"></div>
      </div>

      <!-- BPM Recommendations -->
      <div class="card bpm-guide-card">
        <h3><i class="fas fa-heart-pulse"></i> BPM Recommendations</h3>
        <div class="bpm-grid">
          <div class="bpm-item"><div class="bpm-activity">Running</div><div class="bpm-range">140-180 BPM</div></div>
          <div class="bpm-item"><div class="bpm-activity">Weight Lifting</div><div class="bpm-range">120-140 BPM</div></div>
          <div class="bpm-item"><div class="bpm-activity">HIIT</div><div class="bpm-range">150-180 BPM</div></div>
          <div class="bpm-item"><div class="bpm-activity">Yoga</div><div class="bpm-range">60-90 BPM</div></div>
          <div class="bpm-item"><div class="bpm-activity">Cool-down</div><div class="bpm-range">70-100 BPM</div></div>
          <div class="bpm-item"><div class="bpm-activity">Warm-up</div><div class="bpm-range">100-130 BPM</div></div>
        </div>
      </div>
    `}
  `;
  
  if (!isConnected) {
    document.getElementById('youtubeConnectBtn')?.addEventListener('click', connectYouTube);
  } else {
    document.getElementById('disconnectBtn')?.addEventListener('click', disconnectYouTube);
    document.getElementById('refreshPlaylistsBtn')?.addEventListener('click', fetchUserPlaylists);
    document.getElementById('searchBtn')?.addEventListener('click', searchYouTube);
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchYouTube();
    });
    
    // Load data
    fetchUserProfile();
    fetchUserPlaylists();
    initializeYouTubePlayer();
  }
}

// ========================================
// AUTHENTICATION
// ========================================

function connectYouTube() {
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
    client_id: YOUTUBE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: SCOPES,
    include_granted_scopes: 'true',
    state: 'youtube-auth'
  }).toString();
  
  window.location.href = authUrl;
}

function disconnectYouTube() {
  accessToken = null;
  userProfile = null;
  localStorage.removeItem('youtube_access_token');
  localStorage.removeItem('youtube_token_expiry');
  if (youtubePlayer) youtubePlayer.destroy();
  renderMusic();
  showToast('Disconnected from YouTube', false);
}

// ========================================
// API CALLS
// ========================================

async function youtubeAPI(endpoint, method = 'GET', body = null) {
  if (!accessToken) return null;
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/${endpoint}`, options);
    
    if (response.status === 401) {
      disconnectYouTube();
      showToast('Session expired. Please reconnect.', true);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// ========================================
// USER PROFILE
// ========================================

async function fetchUserProfile() {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  
  const data = await response.json();
  
  if (data) {
    userProfile = data;
    document.getElementById('userName').innerText = data.name || 'YouTube User';
    document.getElementById('userEmail').innerText = data.email || '';
    if (data.picture) {
      document.getElementById('userAvatar').src = data.picture;
    }
  }
}

// ========================================
// USER PLAYLISTS
// ========================================

async function fetchUserPlaylists() {
  const container = document.getElementById('playlistsList');
  container.innerHTML = '<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading your playlists...</div>';
  
  const data = await youtubeAPI('playlists?part=snippet,contentDetails&mine=true&maxResults=25');
  
  if (data && data.items) {
    userPlaylists = data.items;
    
    if (userPlaylists.length === 0) {
      container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No playlists found. Create one on YouTube!</p>';
      return;
    }
    
    let html = '<div class="playlists-grid">';
    userPlaylists.forEach(playlist => {
      const thumb = playlist.snippet.thumbnails?.default?.url || 
                   'https://via.placeholder.com/60/FF0000/ffffff?text=🎵';
      
      html += `
        <div class="playlist-card" data-playlist-id="${playlist.id}">
          <img src="${thumb}" class="playlist-image">
          <div class="playlist-info">
            <h4>${escapeHtml(playlist.snippet.title)}</h4>
            <p>${playlist.contentDetails.itemCount} videos</p>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
    
    document.querySelectorAll('.playlist-card').forEach(card => {
      card.addEventListener('click', () => loadPlaylistVideos(card.dataset.playlistId));
    });
  } else {
    container.innerHTML = '<p style="color:#d63031;text-align:center;padding:20px">Failed to load playlists</p>';
  }
}

async function loadPlaylistVideos(playlistId) {
  const data = await youtubeAPI(`playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}`);
  
  if (data && data.items) {
    const videos = data.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.default?.url
    }));
    
    displaySearchResults(videos);
    showToast(`Loaded ${videos.length} videos`, false);
  }
}

// ========================================
// SEARCH
// ========================================

async function searchYouTube() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) {
    showToast('Enter a search term', true);
    return;
  }
  
  const container = document.getElementById('searchResults');
  container.innerHTML = '<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
  
  const data = await youtubeAPI(`search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10`);
  
  if (data && data.items) {
    const videos = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.default?.url
    }));
    
    displaySearchResults(videos);
  } else {
    container.innerHTML = '<p style="color:#d63031;text-align:center;padding:20px">Search failed</p>';
  }
}

function displaySearchResults(videos) {
  const container = document.getElementById('searchResults');
  
  if (videos.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No results found</p>';
    return;
  }
  
  let html = '<div class="video-grid">';
  videos.forEach(video => {
    html += `
      <div class="video-card" data-video-id="${video.id}" data-video-title="${escapeHtml(video.title)}">
        <img src="${video.thumbnail}" class="video-thumbnail" onerror="this.src='https://via.placeholder.com/120/FF0000/ffffff?text=🎵'">
        <div class="video-details">
          <h4>${escapeHtml(video.title)}</h4>
          <p>${escapeHtml(video.channel)}</p>
        </div>
        <button class="add-to-playlist-btn" onclick="event.stopPropagation(); addToMyPlaylist('${video.id}', '${escapeHtml(video.title)}')">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
  
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      playVideo(card.dataset.videoId, card.dataset.videoTitle);
    });
  });
}

// ========================================
// YOUTUBE PLAYER
// ========================================

function initializeYouTubePlayer() {
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
  
  window.onYouTubeIframeAPIReady = createPlayer;
  if (window.YT && window.YT.Player) createPlayer();
}

function createPlayer() {
  if (youtubePlayer) youtubePlayer.destroy();
  
  youtubePlayer = new YT.Player('youtubePlayer', {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0
    },
    events: {
      onReady: () => console.log('✅ Player Ready'),
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  isPlaying = event.data === YT.PlayerState.PLAYING;
  document.getElementById('playPauseBtn').innerHTML = isPlaying 
    ? '<i class="fas fa-pause"></i>' 
    : '<i class="fas fa-play"></i>';
  
  if (isPlaying) {
    document.getElementById('nowPlayingCard').style.display = 'block';
  }
}

function playVideo(videoId, title) {
  currentVideo = { id: videoId, title: title };
  
  if (youtubePlayer) {
    youtubePlayer.loadVideoById(videoId);
    document.getElementById('videoTitle').innerText = title;
    document.getElementById('nowPlayingCard').style.display = 'block';
  }
}

function togglePlayPause() {
  if (!youtubePlayer) return;
  
  if (isPlaying) {
    youtubePlayer.pauseVideo();
  } else {
    youtubePlayer.playVideo();
  }
}

function nextTrack() {
  showToast('Next track', false);
}

function previousTrack() {
  showToast('Previous track', false);
}

function setVolume(value) {
  if (youtubePlayer) youtubePlayer.setVolume(value);
}

// ========================================
// MY PLAYLIST (Local Storage)
// ========================================

function addToMyPlaylist(videoId, title) {
  let myPlaylist = JSON.parse(localStorage.getItem('hydrofit_my_playlist') || '[]');
  
  if (myPlaylist.find(v => v.id === videoId)) {
    showToast('Already in your playlist', true);
    return;
  }
  
  myPlaylist.push({ id: videoId, title: title, added: new Date().toISOString() });
  localStorage.setItem('hydrofit_my_playlist', JSON.stringify(myPlaylist));
  showToast('Added to My Playlist! 💚', false);
}

function displayMyPlaylist() {
  const myPlaylist = JSON.parse(localStorage.getItem('hydrofit_my_playlist') || '[]');
  
  if (myPlaylist.length === 0) {
    document.getElementById('searchResults').innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Your playlist is empty. Search and add songs!</p>';
    return;
  }
  
  let html = '<div class="video-grid">';
  myPlaylist.reverse().forEach(video => {
    html += `
      <div class="video-card" data-video-id="${video.id}" data-video-title="${escapeHtml(video.title)}">
        <img src="https://img.youtube.com/vi/${video.id}/default.jpg" class="video-thumbnail">
        <div class="video-details">
          <h4>${escapeHtml(video.title)}</h4>
          <p>Added ${new Date(video.added).toLocaleDateString()}</p>
        </div>
        <button class="remove-from-playlist-btn" onclick="event.stopPropagation(); removeFromMyPlaylist('${video.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
  html += '</div>';
  document.getElementById('searchResults').innerHTML = html;
  
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      playVideo(card.dataset.videoId, card.dataset.videoTitle);
    });
  });
}

function removeFromMyPlaylist(videoId) {
  let myPlaylist = JSON.parse(localStorage.getItem('hydrofit_my_playlist') || '[]');
  myPlaylist = myPlaylist.filter(v => v.id !== videoId);
  localStorage.setItem('hydrofit_my_playlist', JSON.stringify(myPlaylist));
  displayMyPlaylist();
  showToast('Removed from playlist', false);
}

function switchView(view) {
  currentView = view;
  
  if (view === 'mylist') {
    setTimeout(() => displayMyPlaylist(), 100);
  } else if (view === 'search') {
    setTimeout(() => {
      document.getElementById('searchResults').innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Search for music to get started!</p>';
    }, 100);
  }
  
  renderMusic();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

console.log("✅ YouTube Music with Login Loaded");