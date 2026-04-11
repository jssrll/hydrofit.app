// ========================================
// HYDROFIT - TELEGRAM COMMUNITY CHAT
// ========================================

// Telegram Group Settings
const TELEGRAM_CONFIG = {
  // Replace with your actual Telegram group/channel username
  groupUsername: 'HydroFit_App', // Your group @username (without @)
  // OR use invite link hash
  inviteHash: 't.me/HydroFit_App', // From t.me/+XXXXX or t.me/joinchat/XXXXX
  
  // Discussion widget settings
  commentsLimit: 10,
  height: 500,
  colorScheme: 'light', // 'light' or 'dark'
  showHeader: true
};

function renderTelegramCommunity() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Community Chat" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Community Header -->
    <div class="card community-header">
      <div class="community-logo">
        <i class="fab fa-telegram"></i>
      </div>
      <h2>PathFit Community</h2>
      <p>Join our Telegram group to connect with fellow students!</p>
      
      <div class="community-stats">
        <div class="stat">
          <i class="fas fa-users"></i>
          <span id="memberCount">---</span>
          <label>Members</label>
        </div>
        <div class="stat">
          <i class="fas fa-comment-dots"></i>
          <span id="onlineCount">---</span>
          <label>Online</label>
        </div>
      </div>
    </div>

    <!-- Join Group Card -->
    <div class="card join-card">
      <div class="join-icon">
        <i class="fab fa-telegram-plane"></i>
      </div>
      <h3>Join the Conversation</h3>
      <p>Click the button below to join our Telegram group. Share your progress, ask questions, and motivate each other!</p>
      
      <div class="join-buttons">
        <a href="https://t.me/${TELEGRAM_CONFIG.groupUsername}" target="_blank" class="join-btn primary" id="telegramGroupLink">
          <i class="fab fa-telegram"></i> Join Telegram Group
        </a>
        <button class="join-btn secondary" onclick="copyInviteLink()">
          <i class="fas fa-link"></i> Copy Invite Link
        </button>
      </div>
      
      <p class="join-hint">
        <i class="fas fa-mobile-alt"></i> 
        Open on mobile for the best experience
      </p>
    </div>

    <!-- Live Discussion Widget -->
    <div class="card discussion-card">
      <div class="discussion-header">
        <h3><i class="fas fa-comments"></i> Live Discussion</h3>
        <span class="live-badge"><i class="fas fa-circle"></i> Live</span>
      </div>
      
      <!-- Telegram Comments Widget -->
      <div id="telegramComments" class="telegram-widget-container">
        <div class="loading-widget">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading discussion...</p>
        </div>
      </div>
    </div>

    <!-- Community Guidelines -->
    <div class="card guidelines-card">
      <h3><i class="fas fa-book"></i> Community Guidelines</h3>
      <div class="guidelines-list">
        <div class="guideline">
          <i class="fas fa-heart" style="color:#00b894"></i>
          <div>
            <h4>Be Supportive</h4>
            <p>Encourage and motivate fellow students on their fitness journey</p>
          </div>
        </div>
        <div class="guideline">
          <i class="fas fa-shield-alt" style="color:#00b4d8"></i>
          <div>
            <h4>Stay Safe</h4>
            <p>Don't share personal information. Report inappropriate content</p>
          </div>
        </div>
        <div class="guideline">
          <i class="fas fa-comment-dots" style="color:#fdcb6e"></i>
          <div>
            <h4>Keep it Relevant</h4>
            <p>Discussions should be about fitness, PathFit, and wellness</p>
          </div>
        </div>
        <div class="guideline">
          <i class="fas fa-clock" style="color:#6c5ce7"></i>
          <div>
            <h4>Be Active</h4>
            <p>Share your daily workouts, progress, and tips with the community</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Tips -->
    <div class="card tips-card">
      <h3><i class="fas fa-lightbulb"></i> What to Share</h3>
      <div class="share-ideas">
        <div class="idea">
          <i class="fas fa-fire"></i>
          <span>Today's workout completion</span>
        </div>
        <div class="idea">
          <i class="fas fa-trophy"></i>
          <span>Personal records and achievements</span>
        </div>
        <div class="idea">
          <i class="fas fa-question-circle"></i>
          <span>Questions about exercises</span>
        </div>
        <div class="idea">
          <i class="fas fa-utensils"></i>
          <span>Healthy meal ideas</span>
        </div>
        <div class="idea">
          <i class="fas fa-calendar-check"></i>
          <span>Workout schedule updates</span>
        </div>
        <div class="idea">
          <i class="fas fa-hands-helping"></i>
          <span>Motivation for others</span>
        </div>
      </div>
    </div>

    <!-- How to Join Modal -->
    <div id="helpModal" class="modal" style="display:none">
      <div class="modal-content">
        <div class="modal-header">
          <i class="fab fa-telegram"></i>
          <h3>How to Join</h3>
        </div>
        <div class="modal-body">
          <div class="help-steps">
            <div class="step">
              <div class="step-num">1</div>
              <p>Click "Join Telegram Group" button above</p>
            </div>
            <div class="step">
              <div class="step-num">2</div>
              <p>If you don't have Telegram, download it first</p>
            </div>
            <div class="step">
              <div class="step-num">3</div>
              <p>Tap "Join Group" when Telegram opens</p>
            </div>
            <div class="step">
              <div class="step-num">4</div>
              <p>Introduce yourself and start chatting!</p>
            </div>
          </div>
          <div class="download-links">
            <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" target="_blank" class="store-btn">
              <i class="fab fa-google-play"></i> Google Play
            </a>
            <a href="https://apps.apple.com/app/telegram-messenger/id686449807" target="_blank" class="store-btn">
              <i class="fab fa-apple"></i> App Store
            </a>
          </div>
          <button class="modal-btn" onclick="closeHelpModal()">Got it</button>
        </div>
      </div>
    </div>
  `;
  
  // Load Telegram widget
  loadTelegramWidget();
  
  // Show help modal for first-time users
  setTimeout(() => {
    const hasSeenHelp = localStorage.getItem('hydrofit_telegram_help');
    if (!hasSeenHelp) {
      openHelpModal();
      localStorage.setItem('hydrofit_telegram_help', 'true');
    }
  }, 1000);
}

function loadTelegramWidget() {
  const container = document.getElementById('telegramComments');
  
  // Check if Telegram username is set
  if (TELEGRAM_CONFIG.groupUsername === 'HydroFit_PathFit') {
    container.innerHTML = `
      <div class="widget-placeholder">
        <i class="fab fa-telegram" style="font-size:3rem;color:#0088cc;margin-bottom:16px"></i>
        <h4>Telegram Widget Ready</h4>
        <p>Update the TELEGRAM_CONFIG with your actual group @username</p>
        <code style="background:#f0f0f0;padding:4px 12px;border-radius:20px;margin-top:8px;display:inline-block">
          const TELEGRAM_CONFIG = { groupUsername: 'YourGroupName' }
        </code>
      </div>
    `;
    return;
  }
  
  // Create Telegram comments widget
  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-discussion', TELEGRAM_CONFIG.groupUsername);
  script.setAttribute('data-comments-limit', TELEGRAM_CONFIG.commentsLimit);
  script.setAttribute('data-color', '00b4d8');
  script.setAttribute('data-dark', '0');
  script.async = true;
  
  container.innerHTML = '';
  container.appendChild(script);
  
  // Also create a fallback if widget doesn't load
  setTimeout(() => {
    if (container.children.length === 0) {
      container.innerHTML = `
        <div class="widget-fallback">
          <i class="fab fa-telegram" style="font-size:3rem;color:#0088cc;margin-bottom:16px"></i>
          <h4>Join the Conversation</h4>
          <p>Click below to join our Telegram group and chat with the community!</p>
          <a href="https://t.me/${TELEGRAM_CONFIG.groupUsername}" target="_blank" class="btn" style="margin-top:16px">
            <i class="fab fa-telegram"></i> Open Telegram
          </a>
        </div>
      `;
    }
  }, 3000);
}

function copyInviteLink() {
  const inviteLink = `https://t.me/${TELEGRAM_CONFIG.groupUsername}`;
  
  navigator.clipboard.writeText(inviteLink).then(() => {
    showToast('Invite link copied! Share with classmates 📋', false);
  }).catch(() => {
    // Fallback
    prompt('Copy this link:', inviteLink);
  });
}

function openHelpModal() {
  document.getElementById('helpModal').style.display = 'flex';
}

function closeHelpModal() {
  document.getElementById('helpModal').style.display = 'none';
}

// Share workout to Telegram
function shareToTelegram(workoutData) {
  const text = encodeURIComponent(
    `🏋️ Just completed my workout on HydroFit!\n` +
    `Exercise: ${workoutData.exercise}\n` +
    `Duration: ${workoutData.duration} min\n` +
    `Feeling great! 💪\n\n` +
    `Join me on HydroFit!`
  );
  
  window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${text}`, '_blank');
}

console.log("✅ Telegram Community Loaded");