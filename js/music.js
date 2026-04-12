// ========================================
// HYDROFIT - YOUTUBE MUSIC WITH PERSISTENT PLAYER
// ========================================

const YOUTUBE_CLIENT_ID = '803381828579-kd6rlss822btd0in3h3t18ojaju0prue.apps.googleusercontent.com';
const YOUTUBE_API_KEY = 'AIzaSyDfwNI1zui-llJimzpWQ_Fsvv1cdkcXv0U';
const REDIRECT_URI = window.location.origin + window.location.pathname;
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
].join(' ');

let accessToken = null;
let userProfile = null;
let userPlaylists = [];
let currentVideo = null;
let currentView = 'home';
let homeVideos = [];
let currentPlaylistVideos = [];
let currentPlaylistId = null;

// Check for saved token
(function init() {
  const savedToken = localStorage.getItem('youtube_access_token');
  const tokenExpiry = localStorage.getItem('youtube_token_expiry');
  
  if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
    accessToken = savedToken;
    console.log('✅ Token loaded from storage');
  }
  
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
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="YouTube Music" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    ${!isConnected ? `
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
      <div class="youtube-music-container">
        <div class="youtube-sidebar">
          <div class="sidebar-menu">
            <div class="menu-item ${currentView === 'home' ? 'active' : ''}" id="menuHome">
              <i class="fas fa-home"></i>
              <span>Home</span>
            </div>
            <div class="menu-item ${currentView === 'search' ? 'active' : ''}" id="menuSearch">
              <i class="fas fa-search"></i>
              <span>Search</span>
            </div>
            <div class="menu-item ${currentView === 'library' ? 'active' : ''}" id="menuLibrary">
              <i class="fas fa-bookmark"></i>
              <span>Library</span>
            </div>
          </div>
          
          <div class="sidebar-playlists">
            <h4><i class="fas fa-list"></i> Your Playlists</h4>
            <div id="sidebarPlaylistsList"></div>
          </div>
          
          <div class="sidebar-footer">
            <div class="user-info-mini" id="sidebarUserInfo">
              <img id="sidebarAvatar" src="" alt="Profile">
              <span id="sidebarName">Loading...</span>
            </div>
            <button class="disconnect-btn" id="disconnectBtn">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
        
        <div class="youtube-main">
          <div id="youtubeContentArea">
            ${renderHomeContent()}
          </div>
        </div>
      </div>
    `}
  `;
  
  if (!isConnected) {
    document.getElementById('youtubeConnectBtn')?.addEventListener('click', connectYouTube);
  } else {
    document.getElementById('disconnectBtn')?.addEventListener('click', disconnectYouTube);
    document.getElementById('menuHome')?.addEventListener('click', switchToHome);
    document.getElementById('menuSearch')?.addEventListener('click', switchToSearch);
    document.getElementById('menuLibrary')?.addEventListener('click', switchToLibrary);
    
    fetchUserProfile();
    fetchUserPlaylists();
    fetchHomeVideos();
  }
}

function renderHomeContent() {
  return `
    <div class="home-content">
      <div class="content-section">
        <h2><i class="fas fa-fire"></i> Trending Workout Music</h2>
        <div id="homeVideosList" class="video-grid-horizontal">
          <div class="loading-placeholder">
            <i class="fas fa-spinner fa-spin"></i> Loading...
          </div>
        </div>
      </div>
      
      <div class="content-section">
        <h2><i class="fas fa-dumbbell"></i> Recommended for You</h2>
        <div class="category-chips">
          <span class="chip active" data-category="all">All</span>
          <span class="chip" data-category="cardio">Cardio</span>
          <span class="chip" data-category="strength">Strength</span>
          <span class="chip" data-category="hiit">HIIT</span>
          <span class="chip" data-category="yoga">Yoga</span>
        </div>
        <div id="recommendedList" class="video-grid-vertical"></div>
      </div>
    </div>
  `;
}

function renderSearchContent() {
  return `
    <div class="search-content">
      <div class="search-header">
        <div class="search-input-wrapper">
          <i class="fas fa-search"></i>
          <input type="text" id="searchInput" class="search-input" placeholder="Search for songs, artists, or playlists...">
        </div>
        <button class="btn" id="searchBtn"><i class="fas fa-search"></i> Search</button>
      </div>
      
      <div class="search-filters">
        <span class="filter-chip active" data-type="video">Videos</span>
        <span class="filter-chip" data-type="playlist">Playlists</span>
      </div>
      
      <div id="searchResults" class="search-results-grid"></div>
    </div>
  `;
}

function renderLibraryContent() {
  return `
    <div class="library-content">
      <div class="library-header">
        <h2><i class="fas fa-bookmark"></i> Your Library</h2>
      </div>
      
      <div class="library-tabs">
        <span class="library-tab active" data-tab="playlists">Playlists</span>
      </div>
      
      <div id="libraryContent" class="library-playlists-grid"></div>
    </div>
  `;
}

function renderPlaylistContent(playlistId, playlistName) {
  return `
    <div class="playlist-content">
      <div class="playlist-header">
        <button class="back-btn" id="backToLibraryBtn">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <div class="playlist-header-info">
          <div class="playlist-cover">
            <i class="fas fa-music"></i>
          </div>
          <div>
            <h2>${escapeHtml(playlistName)}</h2>
            <p id="playlistVideoCount"></p>
          </div>
        </div>
        <button class="btn" id="playAllBtn">
          <i class="fas fa-play"></i> Play All
        </button>
      </div>
      
      <div id="playlistVideosList" class="playlist-videos-list"></div>
    </div>
  `;
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
    include_granted_scopes: 'true'
  }).toString();
  
  window.location.href = authUrl;
}

function disconnectYouTube() {
  accessToken = null;
  localStorage.removeItem('youtube_access_token');
  localStorage.removeItem('youtube_token_expiry');
  renderMusic();
  showToast('Disconnected from YouTube', false);
}

// ========================================
// API CALLS
// ========================================

async function youtubeAPI(endpoint, method = 'GET') {
  if (!accessToken) return null;
  
  try {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `https://www.googleapis.com/youtube/v3/${endpoint}${separator}key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
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
    const nameEl = document.getElementById('sidebarName');
    const avatarEl = document.getElementById('sidebarAvatar');
    if (nameEl) nameEl.innerText = data.name?.split(' ')[0] || 'User';
    if (avatarEl && data.picture) avatarEl.src = data.picture;
  }
}

async function fetchUserPlaylists() {
  const data = await youtubeAPI('playlists?part=snippet,contentDetails&mine=true&maxResults=25');
  
  if (data && data.items) {
    userPlaylists = data.items;
    updateSidebarPlaylists();
    if (currentView === 'library') {
      displayLibraryPlaylists();
    }
  }
}

function updateSidebarPlaylists() {
  const container = document.getElementById('sidebarPlaylistsList');
  if (!container) return;
  
  if (userPlaylists.length === 0) {
    container.innerHTML = '<p class="sidebar-empty">No playlists yet</p>';
    return;
  }
  
  let html = '';
  userPlaylists.slice(0, 5).forEach(playlist => {
    html += `
      <div class="sidebar-playlist-item" data-playlist-id="${playlist.id}" data-playlist-name="${escapeHtml(playlist.snippet.title)}">
        <i class="fas fa-list-ul"></i>
        <span>${escapeHtml(playlist.snippet.title)}</span>
      </div>
    `;
  });
  container.innerHTML = html;
  
  container.querySelectorAll('.sidebar-playlist-item').forEach(item => {
    item.addEventListener('click', () => {
      openPlaylist(item.dataset.playlistId, item.dataset.playlistName);
    });
  });
}

async function fetchHomeVideos() {
  const queries = ['workout music 2024', 'gym motivation', 'running playlist'];
  const randomQuery = queries[Math.floor(Math.random() * queries.length)];
  
  const data = await youtubeAPI(`search?part=snippet&maxResults=10&q=${encodeURIComponent(randomQuery)}&type=video&videoCategoryId=10`);
  
  if (data && data.items) {
    homeVideos = data.items.filter(item => item.id.videoId);
    displayHomeVideos();
  }
}

function displayHomeVideos() {
  const container = document.getElementById('homeVideosList');
  if (!container) return;
  
  let html = '';
  homeVideos.forEach(item => {
    const video = item.id.videoId;
    const title = item.snippet.title;
    const channel = item.snippet.channelTitle;
    const thumb = item.snippet.thumbnails.medium.url;
    
    html += `
      <div class="video-card-horizontal" data-video-id="${video}" data-title="${escapeHtml(title)}" data-channel="${escapeHtml(channel)}" data-thumb="${thumb}">
        <img src="${thumb}" alt="${escapeHtml(title)}">
        <div class="video-info">
          <h4>${escapeHtml(title)}</h4>
          <p>${escapeHtml(channel)}</p>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
  
  container.querySelectorAll('.video-card-horizontal').forEach(card => {
    card.addEventListener('click', () => {
      playVideo(card.dataset.videoId, card.dataset.title, card.dataset.channel, card.dataset.thumb);
    });
  });
}

function displayLibraryPlaylists() {
  const container = document.getElementById('libraryContent');
  if (!container) return;
  
  if (userPlaylists.length === 0) {
    container.innerHTML = '<p class="empty-message">No playlists yet. Create one on YouTube!</p>';
    return;
  }
  
  let html = '<div class="library-grid">';
  userPlaylists.forEach(playlist => {
    const thumb = playlist.snippet.thumbnails?.default?.url || '';
    html += `
      <div class="library-playlist-card" data-playlist-id="${playlist.id}" data-playlist-name="${escapeHtml(playlist.snippet.title)}">
        <img src="${thumb}" alt="${escapeHtml(playlist.snippet.title)}">
        <div class="library-playlist-info">
          <h4>${escapeHtml(playlist.snippet.title)}</h4>
          <p>${playlist.contentDetails.itemCount} videos</p>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
  
  container.querySelectorAll('.library-playlist-card').forEach(card => {
    card.addEventListener('click', () => {
      openPlaylist(card.dataset.playlistId, card.dataset.playlistName);
    });
  });
}

async function openPlaylist(playlistId, playlistName) {
  currentPlaylistId = playlistId;
  const container = document.getElementById('youtubeContentArea');
  container.innerHTML = renderPlaylistContent(playlistId, playlistName);
  
  document.getElementById('backToLibraryBtn')?.addEventListener('click', switchToLibrary);
  document.getElementById('playAllBtn')?.addEventListener('click', playAllInPlaylist);
  
  const data = await youtubeAPI(`playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}`);
  
  if (data && data.items) {
    currentPlaylistVideos = data.items;
    document.getElementById('playlistVideoCount').innerText = `${data.items.length} videos`;
    
    const videosContainer = document.getElementById('playlistVideosList');
    let html = '';
    data.items.forEach((item, index) => {
      const video = item.snippet;
      html += `
        <div class="playlist-video-item" data-video-id="${video.resourceId.videoId}" data-title="${escapeHtml(video.title)}" data-channel="${escapeHtml(video.channelTitle)}" data-thumb="${video.thumbnails.default.url}">
          <span class="video-index">${index + 1}</span>
          <img src="${video.thumbnails.default.url}" alt="">
          <div class="video-details">
            <h4>${escapeHtml(video.title)}</h4>
            <p>${escapeHtml(video.channelTitle)}</p>
          </div>
        </div>
      `;
    });
    videosContainer.innerHTML = html;
    
    videosContainer.querySelectorAll('.playlist-video-item').forEach(item => {
      item.addEventListener('click', () => {
        playVideo(item.dataset.videoId, item.dataset.title, item.dataset.channel, item.dataset.thumb);
      });
    });
  }
}

function playAllInPlaylist() {
  if (currentPlaylistVideos.length > 0) {
    const first = currentPlaylistVideos[0].snippet;
    playVideo(first.resourceId.videoId, first.title, first.channelTitle, first.thumbnails.default.url);
  }
}

// ========================================
// VIDEO PLAYBACK (Persistent)
// ========================================

function playVideo(videoId, title, channel, thumb) {
  currentVideo = { id: videoId, title, channel, thumb };
  
  // Use persistent player
  if (window.playPersistentVideo) {
    window.playPersistentVideo(videoId, title, channel, thumb);
  }
  
  showToast(`Now playing: ${title}`, false);
}

// ========================================
// NAVIGATION
// ========================================

function switchToHome() {
  currentView = 'home';
  document.getElementById('youtubeContentArea').innerHTML = renderHomeContent();
  fetchHomeVideos();
  updateActiveMenu('home');
  attachCategoryListeners();
}

function switchToSearch() {
  currentView = 'search';
  document.getElementById('youtubeContentArea').innerHTML = renderSearchContent();
  setupSearchListeners();
  updateActiveMenu('search');
}

function switchToLibrary() {
  currentView = 'library';
  document.getElementById('youtubeContentArea').innerHTML = renderLibraryContent();
  displayLibraryPlaylists();
  updateActiveMenu('library');
}

function updateActiveMenu(active) {
  document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
  document.getElementById(`menu${active.charAt(0).toUpperCase() + active.slice(1)}`)?.classList.add('active');
}

function attachCategoryListeners() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      fetchHomeVideos();
    });
  });
}

function setupSearchListeners() {
  document.getElementById('searchBtn')?.addEventListener('click', performSearch);
  document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

async function performSearch() {
  const query = document.getElementById('searchInput')?.value.trim();
  if (!query) return;
  
  const container = document.getElementById('searchResults');
  container.innerHTML = '<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
  
  const data = await youtubeAPI(`search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video`);
  
  if (data && data.items) {
    let html = '';
    data.items.forEach(item => {
      if (!item.id.videoId) return;
      const video = item.id.videoId;
      const title = item.snippet.title;
      const channel = item.snippet.channelTitle;
      const thumb = item.snippet.thumbnails.medium.url;
      
      html += `
        <div class="search-result-item" data-video-id="${video}" data-title="${escapeHtml(title)}" data-channel="${escapeHtml(channel)}" data-thumb="${thumb}">
          <img src="${thumb}" alt="${escapeHtml(title)}">
          <div class="result-info">
            <h4>${escapeHtml(title)}</h4>
            <p>${escapeHtml(channel)}</p>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
    
    container.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        playVideo(item.dataset.videoId, item.dataset.title, item.dataset.channel, item.dataset.thumb);
      });
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

console.log("✅ YouTube Music Loaded");