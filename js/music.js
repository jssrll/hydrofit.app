// ========================================
// HYDROFIT - SPOTIFY MUSIC INTEGRATION
// ========================================

// Spotify API Configuration
const SPOTIFY_CLIENT_ID = '147d105e5c764b03b0fd25021f1a4326';
const SPOTIFY_REDIRECT_URI = window.location.origin + window.location.pathname;
const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative'
].join(' ');

let spotifyAccessToken = null;
let spotifyPlayer = null;
let spotifyDeviceId = null;
let userPlaylists = [];
let currentPlaylist = null;
let currentTrack = null;
let isPlaying = false;
let isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let tokenExpiryTime = null;

// Check for saved token on load
(function init() {
  const savedToken = localStorage.getItem('spotify_access_token');
  const savedExpiry = localStorage.getItem('spotify_token_expiry');
  
  if (savedToken && savedExpiry) {
    const expiryTime = parseInt(savedExpiry);
    if (Date.now() < expiryTime) {
      spotifyAccessToken = savedToken;
      tokenExpiryTime = expiryTime;
      console.log('✅ Valid token found');
    } else {
      console.log('⚠️ Token expired, clearing...');
      localStorage.removeItem('spotify_access_token');
      localStorage.removeItem('spotify_refresh_token');
      localStorage.removeItem('spotify_token_expiry');
    }
  }
})();

function renderMusic() {
  const container = document.getElementById("tabContent");
  const isConnected = spotifyAccessToken !== null;
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Workout Music" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    ${!isConnected ? `
      <!-- Connect Spotify -->
      <div class="card connect-card">
        <div class="connect-header">
          <i class="fab fa-spotify"></i>
          <h2>Connect Your Spotify</h2>
        </div>
        <p style="color:#64748b;margin-bottom:24px;text-align:center">Connect your Spotify account to play your own playlists and music during workouts</p>
        <button class="spotify-connect-btn" id="spotifyConnectBtn">
          <i class="fab fa-spotify"></i> Connect Spotify Account
        </button>
        <p class="connect-hint">
          <i class="fas fa-info-circle"></i> You'll be redirected to Spotify to authorize access
        </p>
      </div>
    ` : `
      <!-- Connected User Info -->
      <div class="card user-card">
        <div class="user-info">
          <img id="userAvatar" src="" alt="Profile" class="user-avatar" onerror="this.src='https://via.placeholder.com/60/1DB954/ffffff?text=👤'">
          <div>
            <h3 id="userName">Loading profile...</h3>
            <p id="userEmail"></p>
          </div>
          <button class="btn btn-outline" id="disconnectSpotifyBtn">
            <i class="fas fa-sign-out-alt"></i> Disconnect
          </button>
        </div>
      </div>

      ${!isMobileDevice ? `
        <!-- Now Playing -->
        <div class="card now-playing-card" id="nowPlayingCard" style="display:none">
          <h3><i class="fas fa-play-circle"></i> Now Playing</h3>
          <div class="now-playing">
            <img id="trackImage" src="" alt="Album Art" class="track-image">
            <div class="track-info">
              <h4 id="trackName">No track playing</h4>
              <p id="trackArtist"></p>
              <p id="trackAlbum"></p>
            </div>
          </div>
          <div class="player-controls">
            <button class="player-btn" id="previousTrackBtn">
              <i class="fas fa-step-backward"></i>
            </button>
            <button class="player-btn play-pause" id="playPauseBtn">
              <i class="fas fa-play"></i>
            </button>
            <button class="player-btn" id="nextTrackBtn">
              <i class="fas fa-step-forward"></i>
            </button>
          </div>
          <div class="progress-bar" id="progressBar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="time-display">
            <span id="currentTime">0:00</span>
            <span id="duration">0:00</span>
          </div>
          <div class="volume-control">
            <i class="fas fa-volume-down"></i>
            <input type="range" id="volumeSlider" min="0" max="100" value="50">
            <i class="fas fa-volume-up"></i>
          </div>
        </div>
      ` : `
        <div class="card mobile-play-card">
          <h3><i class="fab fa-spotify"></i> Play in Spotify App</h3>
          <p style="color:#64748b;margin-bottom:16px">Tap a playlist below to open it in the Spotify app</p>
        </div>
      `}

      <!-- My Playlists -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h3 style="margin:0"><i class="fas fa-list"></i> My Playlists</h3>
          <button class="refresh-btn" id="refreshPlaylistsBtn" title="Refresh">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
        <div id="playlistsList">
          <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i> Loading your playlists...
          </div>
        </div>
      </div>

      ${!isMobileDevice ? `
        <!-- Devices -->
        <div class="card">
          <h3><i class="fas fa-devices"></i> Playback Device</h3>
          <div id="deviceList">
            <p style="color:#64748b">Loading available devices...</p>
          </div>
        </div>
      ` : ''}

      <!-- BPM Recommendations -->
      <div class="card bpm-guide-card">
        <h3><i class="fas fa-heart-pulse"></i> BPM Recommendations</h3>
        <p style="color:#64748b;margin-bottom:16px">Find the perfect tempo for your workout</p>
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
  
  // Attach event listeners after render
  if (!isConnected) {
    document.getElementById('spotifyConnectBtn')?.addEventListener('click', connectSpotify);
  } else {
    document.getElementById('disconnectSpotifyBtn')?.addEventListener('click', disconnectSpotify);
    document.getElementById('refreshPlaylistsBtn')?.addEventListener('click', loadUserPlaylists);
    
    if (!isMobileDevice) {
      document.getElementById('previousTrackBtn')?.addEventListener('click', previousTrack);
      document.getElementById('playPauseBtn')?.addEventListener('click', togglePlayPause);
      document.getElementById('nextTrackBtn')?.addEventListener('click', nextTrack);
      document.getElementById('progressBar')?.addEventListener('click', seekToPosition);
      document.getElementById('volumeSlider')?.addEventListener('change', (e) => setVolume(e.target.value));
    }
    
    // Load data
    loadUserProfile();
    loadUserPlaylists();
    if (!isMobileDevice) {
      loadAvailableDevices();
      initializeSpotifyPlayer();
    }
  }
  
  // Check for OAuth callback
  checkForAuthCallback();
}

// ========================================
// SPOTIFY AUTHENTICATION (PKCE Flow)
// ========================================

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function connectSpotify() {
  // Clear any existing tokens
  spotifyAccessToken = null;
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_code_verifier');
  localStorage.removeItem('spotify_token_expiry');
  
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  
  localStorage.setItem('spotify_code_verifier', codeVerifier);
  localStorage.setItem('spotify_auth_started', 'true');
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: SPOTIFY_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    show_dialog: 'false'
  });
  
  // Redirect to Spotify
  window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
}

async function exchangeCodeForToken(code) {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  
  if (!codeVerifier) {
    console.error('No code verifier found');
    showToast('Authentication failed. Please try again.', true);
    return false;
  }
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    code_verifier: codeVerifier
  });
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      spotifyAccessToken = data.access_token;
      tokenExpiryTime = Date.now() + (data.expires_in * 1000);
      
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', tokenExpiryTime);
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      
      localStorage.removeItem('spotify_code_verifier');
      localStorage.removeItem('spotify_auth_started');
      
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Re-render with connected state
      renderMusic();
      showToast('Connected to Spotify! 🎵', false);
      return true;
    } else {
      console.error('Token exchange failed:', data);
      localStorage.removeItem('spotify_auth_started');
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast('Failed to connect. Please try again.', true);
      return false;
    }
  } catch (error) {
    console.error('Token exchange error:', error);
    localStorage.removeItem('spotify_auth_started');
    window.history.replaceState({}, document.title, window.location.pathname);
    showToast('Connection error. Please try again.', true);
    return false;
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) return false;
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: SPOTIFY_CLIENT_ID
  });
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      spotifyAccessToken = data.access_token;
      tokenExpiryTime = Date.now() + (data.expires_in * 1000);
      
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', tokenExpiryTime);
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
}

function checkForAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const error = params.get('error');
  const authStarted = localStorage.getItem('spotify_auth_started');
  
  if (error) {
    localStorage.removeItem('spotify_auth_started');
    window.history.replaceState({}, document.title, window.location.pathname);
    showToast('Authorization cancelled', true);
    return;
  }
  
  if (code && authStarted === 'true') {
    exchangeCodeForToken(code);
  }
}

function disconnectSpotify() {
  spotifyAccessToken = null;
  tokenExpiryTime = null;
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_code_verifier');
  localStorage.removeItem('spotify_token_expiry');
  localStorage.removeItem('spotify_auth_started');
  
  if (spotifyPlayer) {
    spotifyPlayer.disconnect();
    spotifyPlayer = null;
  }
  
  renderMusic();
  showToast('Disconnected from Spotify', false);
}

// ========================================
// SPOTIFY API CALLS (With Auto Refresh)
// ========================================

async function spotifyAPI(endpoint, method = 'GET', body = null) {
  if (!spotifyAccessToken) return null;
  
  // Check if token is expired
  if (tokenExpiryTime && Date.now() >= tokenExpiryTime) {
    console.log('Token expired, refreshing...');
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      disconnectSpotify();
      showToast('Session expired. Please reconnect.', true);
      return null;
    }
  }
  
  const options = {
    method,
    headers: { 'Authorization': `Bearer ${spotifyAccessToken}` }
  };
  
  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  
  try {
    let response = await fetch(`https://api.spotify.com/v1/${endpoint}`, options);
    
    // Token expired during request
    if (response.status === 401) {
      console.log('Token expired during request, refreshing...');
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        options.headers['Authorization'] = `Bearer ${spotifyAccessToken}`;
        response = await fetch(`https://api.spotify.com/v1/${endpoint}`, options);
      } else {
        disconnectSpotify();
        showToast('Session expired. Please reconnect.', true);
        return null;
      }
    }
    
    if (response.status === 204) {
      return { success: true };
    }
    
    if (!response.ok) {
      console.error('API Error:', response.status);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Spotify API Error:', error);
    return null;
  }
}

// ========================================
// USER PROFILE & PLAYLISTS
// ========================================

async function loadUserProfile() {
  const data = await spotifyAPI('me');
  
  if (data && !data.error) {
    const nameEl = document.getElementById('userName');
    const emailEl = document.getElementById('userEmail');
    const avatarEl = document.getElementById('userAvatar');
    
    if (nameEl) nameEl.innerText = data.display_name || 'Spotify User';
    if (emailEl) emailEl.innerText = data.email || '';
    if (avatarEl && data.images && data.images.length > 0) {
      avatarEl.src = data.images[0].url;
    }
  }
}

async function loadUserPlaylists() {
  const container = document.getElementById('playlistsList');
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-placeholder">
      <i class="fas fa-spinner fa-spin"></i> Loading your playlists...
    </div>
  `;
  
  const data = await spotifyAPI('me/playlists?limit=30');
  
  if (data && data.items) {
    userPlaylists = data.items;
    
    if (userPlaylists.length === 0) {
      container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No playlists found</p>';
      return;
    }
    
    let html = '<div class="playlists-grid">';
    userPlaylists.forEach(playlist => {
      const imageUrl = playlist.images && playlist.images.length > 0 
        ? playlist.images[0].url 
        : 'https://via.placeholder.com/60/1DB954/ffffff?text=🎵';
      
      html += `
        <div class="playlist-card" data-playlist-id="${playlist.id}" data-playlist-uri="${playlist.uri}">
          <img src="${imageUrl}" alt="${escapeHtml(playlist.name)}" class="playlist-image" onerror="this.src='https://via.placeholder.com/60/1DB954/ffffff?text=🎵'">
          <div class="playlist-info">
            <h4>${escapeHtml(playlist.name)}</h4>
            <p>${playlist.tracks.total} tracks</p>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
    
    // Attach click listeners
    document.querySelectorAll('.playlist-card').forEach(card => {
      card.addEventListener('click', () => {
        const uri = card.dataset.playlistUri;
        const id = card.dataset.playlistId;
        playPlaylist(id, uri);
      });
    });
  } else {
    container.innerHTML = `
      <div style="text-align:center;padding:20px;color:#d63031">
        <i class="fas fa-exclamation-circle"></i>
        <p>Failed to load playlists</p>
        <button class="btn btn-outline" id="retryPlaylistsBtn" style="margin-top:12px">Try Again</button>
      </div>
    `;
    document.getElementById('retryPlaylistsBtn')?.addEventListener('click', loadUserPlaylists);
  }
}

// ========================================
// SPOTIFY PLAYER (Desktop Only)
// ========================================

function initializeSpotifyPlayer() {
  if (!window.Spotify) {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.onload = () => createPlayer();
    document.body.appendChild(script);
  } else {
    createPlayer();
  }
}

function createPlayer() {
  if (spotifyPlayer) {
    spotifyPlayer.disconnect();
  }
  
  spotifyPlayer = new Spotify.Player({
    name: 'HydroFit Web Player',
    getOAuthToken: cb => { cb(spotifyAccessToken); },
    volume: 0.5
  });
  
  spotifyPlayer.addListener('ready', ({ device_id }) => {
    spotifyDeviceId = device_id;
    console.log('✅ Spotify Player Ready');
    transferPlayback();
  });
  
  spotifyPlayer.addListener('player_state_changed', state => {
    if (state) {
      updateNowPlaying(state);
    }
  });
  
  spotifyPlayer.addListener('authentication_error', ({ message }) => {
    console.error('Auth error:', message);
  });
  
  spotifyPlayer.connect();
}

async function transferPlayback() {
  if (!spotifyDeviceId) return;
  await spotifyAPI('me/player', 'PUT', { device_ids: [spotifyDeviceId], play: false });
}

async function loadAvailableDevices() {
  const container = document.getElementById('deviceList');
  if (!container) return;
  
  const data = await spotifyAPI('me/player/devices');
  
  if (data && data.devices && data.devices.length > 0) {
    let html = '<div class="device-list">';
    data.devices.forEach(device => {
      html += `
        <div class="device-item ${device.is_active ? 'active' : ''}" data-device-id="${device.id}">
          <i class="fas fa-${device.type === 'Computer' ? 'desktop' : device.type === 'Smartphone' ? 'mobile-alt' : 'speaker'}"></i>
          <span>${escapeHtml(device.name)}</span>
          ${device.is_active ? '<span class="active-badge">Active</span>' : ''}
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
    
    document.querySelectorAll('.device-item').forEach(item => {
      item.addEventListener('click', () => setActiveDevice(item.dataset.deviceId));
    });
  } else {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Open Spotify on a device to control playback</p>';
  }
}

async function setActiveDevice(deviceId) {
  await spotifyAPI('me/player', 'PUT', { device_ids: [deviceId] });
  showToast('Device changed', false);
  setTimeout(loadAvailableDevices, 1000);
}

// ========================================
// PLAYBACK CONTROLS
// ========================================

async function playPlaylist(playlistId, playlistUri) {
  if (isMobileDevice) {
    window.location.href = playlistUri;
    return;
  }
  
  const result = await spotifyAPI('me/player/play', 'PUT', { context_uri: playlistUri });
  if (result) {
    showToast('Playing playlist! 🎵', false);
    document.getElementById('nowPlayingCard').style.display = 'block';
  }
}

async function togglePlayPause() {
  const state = await spotifyAPI('me/player');
  const btn = document.getElementById('playPauseBtn');
  
  if (state && state.is_playing) {
    await spotifyAPI('me/player/pause', 'PUT');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
  } else {
    await spotifyAPI('me/player/play', 'PUT');
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
  }
}

async function nextTrack() {
  await spotifyAPI('me/player/next', 'POST');
}

async function previousTrack() {
  await spotifyAPI('me/player/previous', 'POST');
}

async function setVolume(value) {
  await spotifyAPI(`me/player/volume?volume_percent=${value}`, 'PUT');
}

async function seekToPosition(event) {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  
  const rect = bar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;
  
  const state = await spotifyAPI('me/player');
  if (state && state.item) {
    const position = Math.floor(percent * state.item.duration_ms);
    await spotifyAPI(`me/player/seek?position_ms=${position}`, 'PUT');
  }
}

// ========================================
// NOW PLAYING DISPLAY
// ========================================

function updateNowPlaying(state) {
  if (!state || !state.item) return;
  
  const card = document.getElementById('nowPlayingCard');
  if (card) card.style.display = 'block';
  
  const trackName = document.getElementById('trackName');
  const trackArtist = document.getElementById('trackArtist');
  const trackAlbum = document.getElementById('trackAlbum');
  const trackImage = document.getElementById('trackImage');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const progressFill = document.getElementById('progressFill');
  const currentTime = document.getElementById('currentTime');
  const duration = document.getElementById('duration');
  
  if (trackName) trackName.innerText = state.item.name;
  if (trackArtist) trackArtist.innerText = state.item.artists.map(a => a.name).join(', ');
  if (trackAlbum) trackAlbum.innerText = state.item.album.name;
  if (trackImage) trackImage.src = state.item.album.images[0]?.url || '';
  
  if (playPauseBtn) {
    playPauseBtn.innerHTML = state.is_playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
  }
  
  if (progressFill) progressFill.style.width = (state.position / state.item.duration_ms * 100) + '%';
  if (currentTime) currentTime.innerText = formatTime(state.position);
  if (duration) duration.innerText = formatTime(state.item.duration_ms);
}

function formatTime(ms) {
  if (!ms) return '0:00';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

console.log("✅ Spotify Music Integration Loaded");