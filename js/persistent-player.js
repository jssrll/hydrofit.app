// ========================================
// HYDROFIT - PERSISTENT MUSIC PLAYER
// ========================================

window.persistentPlayer = {
  player: null,
  isPlaying: false,
  currentVideo: null,
  isInitialized: false
};

function initPersistentPlayer() {
  if (window.persistentPlayer.isInitialized) return;
  
  window.persistentPlayer.isInitialized = true;
  
  // Load YouTube API if not already loaded
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
  
  window.onYouTubeIframeAPIReady = function() {
    createPersistentPlayer();
  };
  
  if (window.YT && window.YT.Player) {
    createPersistentPlayer();
  }
}

function createPersistentPlayer() {
  if (window.persistentPlayer.player) return;
  
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
      onStateChange: onPersistentStateChange
    }
  });
}

function onPersistentPlayerReady() {
  console.log('✅ Persistent Player Ready');
  
  const savedVideo = localStorage.getItem('persistent_current_video');
  if (savedVideo) {
    try {
      const video = JSON.parse(savedVideo);
      showMiniPlayer(video);
    } catch(e) {}
  }
}

function onPersistentStateChange(event) {
  const isPlaying = event.data === YT.PlayerState.PLAYING;
  window.persistentPlayer.isPlaying = isPlaying;
  
  const btn = document.getElementById('miniPlayPauseBtn');
  if (btn) {
    btn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
  }
}

window.playPersistentVideo = function(videoId, title, channel, thumb) {
  if (!window.persistentPlayer.player) {
    initPersistentPlayer();
    setTimeout(() => window.playPersistentVideo(videoId, title, channel, thumb), 500);
    return;
  }
  
  window.persistentPlayer.player.loadVideoById(videoId);
  window.persistentPlayer.player.playVideo();
  
  const videoData = { id: videoId, title, channel, thumb };
  localStorage.setItem('persistent_current_video', JSON.stringify(videoData));
  window.persistentPlayer.currentVideo = videoData;
  
  showMiniPlayer(videoData);
};

function showMiniPlayer(video) {
  const miniPlayer = document.getElementById('miniMusicPlayer');
  if (!miniPlayer) return;
  
  document.getElementById('miniPlayerTitle').innerText = video.title || 'Now Playing';
  document.getElementById('miniPlayerArtist').innerText = video.channel || '';
  document.getElementById('miniPlayerThumb').src = video.thumb || '';
  miniPlayer.style.display = 'block';
}

// Mini player controls
document.addEventListener('DOMContentLoaded', function() {
  initPersistentPlayer();
  
  document.getElementById('miniPlayPauseBtn')?.addEventListener('click', function() {
    const player = window.persistentPlayer?.player;
    if (!player) return;
    
    if (window.persistentPlayer.isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });
  
  document.getElementById('miniPlayerClose')?.addEventListener('click', function() {
    const player = window.persistentPlayer?.player;
    if (player) {
      player.stopVideo();
    }
    document.getElementById('miniMusicPlayer').style.display = 'none';
    localStorage.removeItem('persistent_current_video');
    window.persistentPlayer.currentVideo = null;
  });
  
  const savedVideo = localStorage.getItem('persistent_current_video');
  if (savedVideo) {
    try {
      const video = JSON.parse(savedVideo);
      showMiniPlayer(video);
    } catch(e) {}
  }
});

console.log("✅ Persistent Player Loaded");