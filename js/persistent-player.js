// ========================================
// HYDROFIT - PERSISTENT MUSIC PLAYER
// ========================================

window.persistentPlayer = {
  player: null,
  isPlaying: false,
  currentVideo: null,
  accessToken: null,
  isInitialized: false
};

// Initialize the persistent player
function initPersistentPlayer() {
  if (window.persistentPlayer.isInitialized) return;
  
  // Load YouTube API
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
  
  window.onYouTubeIframeAPIReady = function() {
    window.persistentPlayer.player = new YT.Player('persistentYouTubePlayer', {
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: onPersistentPlayerReady,
        onStateChange: onPersistentPlayerStateChange
      }
    });
  };
  
  // If YT is already loaded
  if (window.YT && window.YT.Player) {
    window.persistentPlayer.player = new YT.Player('persistentYouTubePlayer', {
      height: '1',
      width: '1',
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: onPersistentPlayerReady,
        onStateChange: onPersistentPlayerStateChange
      }
    });
  }
  
  window.persistentPlayer.isInitialized = true;
  
  // Setup mini player controls
  setupMiniPlayerControls();
  
  // Load saved state
  loadPlayerState();
}

function onPersistentPlayerReady() {
  console.log('✅ Persistent Player Ready');
  
  // Restore previous video if exists
  const savedVideo = localStorage.getItem('persistent_current_video');
  if (savedVideo) {
    try {
      const video = JSON.parse(savedVideo);
      window.persistentPlayer.player.loadVideoById(video.id);
    } catch(e) {}
  }
}

function onPersistentPlayerStateChange(event) {
  const isPlaying = event.data === YT.PlayerState.PLAYING;
  window.persistentPlayer.isPlaying = isPlaying;
  
  // Update mini player UI
  updateMiniPlayerState(isPlaying);
  
  // Save state
  localStorage.setItem('persistent_is_playing', isPlaying);
  
  // If playing, get video info
  if (isPlaying && window.persistentPlayer.player) {
    const videoData = window.persistentPlayer.player.getVideoData();
    if (videoData && videoData.video_id) {
      updateMiniPlayerInfo(videoData);
    }
  }
}

function setupMiniPlayerControls() {
  document.getElementById('miniPlayPauseBtn')?.addEventListener('click', togglePersistentPlayPause);
  document.getElementById('miniNextBtn')?.addEventListener('click', playNextTrack);
  document.getElementById('miniPlayerClose')?.addEventListener('click', closeMiniPlayer);
}

function updateMiniPlayerState(isPlaying) {
  const btn = document.getElementById('miniPlayPauseBtn');
  if (btn) {
    btn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
  }
}

function updateMiniPlayerInfo(videoData) {
  document.getElementById('miniPlayerTitle').innerText = videoData.title || 'Now Playing';
  document.getElementById('miniPlayerArtist').innerText = videoData.author || '';
  
  // Try to get thumbnail
  const videoId = videoData.video_id;
  if (videoId) {
    document.getElementById('miniPlayerThumb').src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
  }
  
  // Show mini player
  document.getElementById('miniMusicPlayer').style.display = 'block';
}

function togglePersistentPlayPause() {
  const player = window.persistentPlayer.player;
  if (!player) return;
  
  if (window.persistentPlayer.isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

function playNextTrack() {
  // This can be connected to a queue system
  console.log('Next track');
}

function closeMiniPlayer() {
  const player = window.persistentPlayer.player;
  if (player) {
    player.stopVideo();
    player.clearVideo();
  }
  
  document.getElementById('miniMusicPlayer').style.display = 'none';
  localStorage.removeItem('persistent_current_video');
  localStorage.removeItem('persistent_is_playing');
  
  window.persistentPlayer.isPlaying = false;
  window.persistentPlayer.currentVideo = null;
}

// Public API for other pages to use
window.playPersistentVideo = function(videoId, title, channel, thumb) {
  initPersistentPlayer();
  
  const player = window.persistentPlayer.player;
  if (player) {
    player.loadVideoById(videoId);
    
    // Save state
    const videoData = { id: videoId, title, channel, thumb };
    localStorage.setItem('persistent_current_video', JSON.stringify(videoData));
    window.persistentPlayer.currentVideo = videoData;
    
    // Update mini player
    document.getElementById('miniPlayerTitle').innerText = title;
    document.getElementById('miniPlayerArtist').innerText = channel;
    document.getElementById('miniPlayerThumb').src = thumb;
    document.getElementById('miniMusicPlayer').style.display = 'block';
  }
};

window.getPersistentPlayerState = function() {
  return {
    isPlaying: window.persistentPlayer.isPlaying,
    currentVideo: window.persistentPlayer.currentVideo
  };
};

window.setPersistentAccessToken = function(token) {
  window.persistentPlayer.accessToken = token;
};

function loadPlayerState() {
  const isPlaying = localStorage.getItem('persistent_is_playing') === 'true';
  const savedVideo = localStorage.getItem('persistent_current_video');
  
  if (savedVideo) {
    try {
      const video = JSON.parse(savedVideo);
      document.getElementById('miniPlayerTitle').innerText = video.title || 'Now Playing';
      document.getElementById('miniPlayerArtist').innerText = video.channel || '';
      document.getElementById('miniPlayerThumb').src = video.thumb || '';
      document.getElementById('miniMusicPlayer').style.display = 'block';
      updateMiniPlayerState(isPlaying);
    } catch(e) {}
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initPersistentPlayer();
});

console.log("✅ Persistent Player Loaded");