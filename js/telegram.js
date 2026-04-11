// ========================================
// HYDROFIT - TELEGRAM COMMUNITY CHAT
// ========================================

// Telegram Group Settings
const TELEGRAM_CONFIG = {
  groupUsername: 'HydroFit_App',
  groupName: 'HydroFit Community',
  groupLink: 'https://t.me/HydroFit_App'
};

function renderTelegramCommunity() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <!-- Community Header -->
    <div class="card community-header">
      <div class="community-logo">
        <i class="fab fa-telegram"></i>
      </div>
      <h2>${TELEGRAM_CONFIG.groupName}</h2>
      <p>Connect with fellow students, share progress, and stay motivated!</p>
    </div>

    <!-- Join Community Card -->
    <div class="card join-community-card">
      <h3><i class="fab fa-telegram"></i> Join Our Telegram Community</h3>
      <p>Click the button below to open Telegram and join the conversation. Get real-time updates, ask questions, and connect with classmates!</p>
      
      <div class="join-actions">
        <a href="${TELEGRAM_CONFIG.groupLink}" target="_blank" class="telegram-join-btn" id="telegramLink">
          <i class="fab fa-telegram"></i> Join on Telegram
        </a>
        
        <div class="alternative-options">
          <button class="alt-btn" onclick="copyTelegramLink()">
            <i class="fas fa-copy"></i> Copy Link
          </button>
          <button class="alt-btn" onclick="showQRCode()">
            <i class="fas fa-qrcode"></i> QR Code
          </button>
          <button class="alt-btn" onclick="shareTelegramLink()">
            <i class="fas fa-share-alt"></i> Share
          </button>
        </div>
      </div>
    </div>

    <!-- Why Join Section -->
    <div class="card benefits-card">
      <h3><i class="fas fa-star"></i> Why Join Our Telegram Community?</h3>
      <div class="benefits-grid">
        <div class="benefit">
          <i class="fas fa-comments"></i>
          <h4>Real-time Chat</h4>
          <p>Instant messaging with classmates and fitness buddies</p>
        </div>
        <div class="benefit">
          <i class="fas fa-bell"></i>
          <h4>Workout Reminders</h4>
          <p>Get notified about scheduled workouts and events</p>
        </div>
        <div class="benefit">
          <i class="fas fa-trophy"></i>
          <h4>Share Achievements</h4>
          <p>Post your PRs and celebrate with the community</p>
        </div>
        <div class="benefit">
          <i class="fas fa-question-circle"></i>
          <h4>Ask Questions</h4>
          <p>Get help from experienced members and coaches</p>
        </div>
        <div class="benefit">
          <i class="fas fa-users"></i>
          <h4>Find Workout Partners</h4>
          <p>Connect with others at your fitness level</p>
        </div>
        <div class="benefit">
          <i class="fas fa-calendar"></i>
          <h4>Group Activities</h4>
          <p>Join group workouts and fitness challenges</p>
        </div>
      </div>
    </div>

    <!-- Community Guidelines -->
    <div class="card guidelines-card">
      <h3><i class="fas fa-shield-alt"></i> Community Guidelines</h3>
      <div class="guidelines-compact">
        <div class="guideline-item">
          <i class="fas fa-heart" style="color:#00b894"></i>
          <span>Be supportive and encouraging</span>
        </div>
        <div class="guideline-item">
          <i class="fas fa-comment-dots" style="color:#00b4d8"></i>
          <span>Keep conversations fitness-related</span>
        </div>
        <div class="guideline-item">
          <i class="fas fa-user-shield" style="color:#fdcb6e"></i>
          <span>Respect everyone's privacy</span>
        </div>
        <div class="guideline-item">
          <i class="fas fa-flag" style="color:#e17055"></i>
          <span>Report inappropriate content</span>
        </div>
      </div>
    </div>

    <!-- Don't have Telegram? -->
    <div class="card download-card">
      <h3><i class="fas fa-download"></i> Don't have Telegram?</h3>
      <p>Telegram is a free, secure messaging app available on all platforms.</p>
      <div class="download-buttons">
        <a href="https://play.google.com/store/apps/details?id=org.telegram.messenger" target="_blank" class="download-btn">
          <i class="fab fa-google-play"></i> Google Play
        </a>
        <a href="https://apps.apple.com/app/telegram-messenger/id686449807" target="_blank" class="download-btn">
          <i class="fab fa-apple"></i> App Store
        </a>
        <a href="https://desktop.telegram.org/" target="_blank" class="download-btn">
          <i class="fas fa-desktop"></i> Desktop
        </a>
        <a href="https://web.telegram.org/" target="_blank" class="download-btn">
          <i class="fas fa-globe"></i> Web
        </a>
      </div>
    </div>

    <!-- QR Code Modal -->
    <div id="qrModal" class="modal" style="display:none">
      <div class="modal-content" style="max-width:350px">
        <div class="modal-header">
          <i class="fab fa-telegram"></i>
          <h3>Scan to Join</h3>
        </div>
        <div class="modal-body">
          <div style="text-align:center;padding:20px">
            <div id="qrCodeContainer" style="background:white;padding:20px;border-radius:16px;display:inline-block">
              <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Screenshot%202026-04-11%20124936.png" alt="QR Code" style="width:200px;height:200px;object-fit:contain">
            </div>
            <p style="margin-top:16px;color:#64748b">Scan with your phone camera to join</p>
            <p style="font-size:0.9rem;color:#1a1a1a;margin-top:8px">
              <strong>${TELEGRAM_CONFIG.groupLink}</strong>
            </p>
          </div>
          <button class="modal-btn" onclick="closeQRModal()">Close</button>
        </div>
      </div>
    </div>
  `;
}

function copyTelegramLink() {
  const link = TELEGRAM_CONFIG.groupLink;
  
  navigator.clipboard.writeText(link).then(() => {
    showToast('Telegram link copied! Share with friends 📋', false);
  }).catch(() => {
    prompt('Copy this link:', link);
  });
}

function showQRCode() {
  document.getElementById('qrModal').style.display = 'flex';
}

function closeQRModal() {
  document.getElementById('qrModal').style.display = 'none';
}

function shareTelegramLink() {
  const link = TELEGRAM_CONFIG.groupLink;
  const text = `Join our HydroFit Community on Telegram! 💪`;
  
  if (navigator.share) {
    navigator.share({
      title: 'HydroFit Community',
      text: text,
      url: link
    }).catch(() => {});
  } else {
    // Fallback - open share dialog
    const shareText = encodeURIComponent(`${text} ${link}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank');
  }
}

console.log("✅ Telegram Community Loaded");