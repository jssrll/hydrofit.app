// ========================================
// HYDROFIT - ABOUT PAGE
// ========================================

let deferredPrompt;

function renderAbout() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="HydroFit Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- App Info Card -->
    <div class="card about-hero">
      <div class="about-logo">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/N%20(2).png" alt="HydroFit Logo" style="width:80px;height:80px;border-radius:20px">
      </div>
      <h2>HydroFit</h2>
      <p class="version">Version 1.0.0</p>
      <p class="tagline">Academic Fitness Tracker for PathFit Class</p>
    </div>

    <!-- Download Section -->
    <div class="card download-card">
      <div class="download-icon">
        <i class="fas fa-download"></i>
      </div>
      <h3>Get the Full Experience</h3>
      <p>Download HydroFit as an app on your device for faster access and offline support.</p>
      
      <div class="download-benefits">
        <div class="benefit-item">
          <i class="fas fa-bolt"></i>
          <span>Faster Loading</span>
        </div>
        <div class="benefit-item">
          <i class="fas fa-wifi-slash"></i>
          <span>Works Offline</span>
        </div>
        <div class="benefit-item">
          <i class="fas fa-mobile-screen"></i>
          <span>Full Screen Mode</span>
        </div>
        <div class="benefit-item">
          <i class="fas fa-bell"></i>
          <span>Push Notifications</span>
        </div>
      </div>
      
      <button class="download-btn" id="downloadAppBtn" onclick="installApp()">
        <i class="fas fa-arrow-down"></i> Install HydroFit App
      </button>
      
      <p class="download-hint">
        <i class="fas fa-info-circle"></i> 
        Click install to add HydroFit to your home screen
      </p>
    </div>

    <!-- Installation Guide -->
    <div class="card install-guide">
      <h3><i class="fas fa-question-circle"></i> How to Install</h3>
      
      <div class="install-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>Click "Install HydroFit App"</h4>
            <p>Click the download button above to start installation</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>Confirm Installation</h4>
            <p>Click "Install" on the popup prompt that appears</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>Open HydroFit</h4>
            <p>Find HydroFit on your home screen and start tracking!</p>
          </div>
        </div>
      </div>
      
      <div class="alternative-install">
        <h4><i class="fas fa-ellipsis-v"></i> Alternative Method</h4>
        <p>Tap the menu (⋮) in your browser and select "Install App" or "Add to Home Screen"</p>
      </div>
    </div>

    <!-- About the App -->
    <div class="card">
      <h3><i class="fas fa-info-circle"></i> About HydroFit</h3>
      <p>HydroFit is an academic fitness tracking web application designed specifically for the PathFit program at Mindoro State University. Its purpose is to help students monitor their physical activity, track hydration goals, and stay engaged with their fitness journey throughout the semester.</p>
      <p>The platform was created to support the PathFit curriculum by providing a simple and modern digital tool where students can log their progress, view assessments, and check their rankings—all in one place.</p>
    </div>

    <!-- Features -->
    <div class="card">
      <h3><i class="fas fa-star"></i> Key Features</h3>
      <div class="features-grid">
        <div class="feature">
          <i class="fas fa-clipboard-check"></i>
          <h4>Fitness Assessment</h4>
          <p>Track 50+ exercises with auto-rating system</p>
        </div>
        <div class="feature">
          <i class="fas fa-trophy"></i>
          <h4>Ranking System</h4>
          <p>Compete with classmates on the leaderboard</p>
        </div>
        <div class="feature">
          <i class="fas fa-heart-pulse"></i>
          <h4>Heart Rate Logger</h4>
          <p>Monitor cardiovascular performance</p>
        </div>
        <div class="feature">
          <i class="fas fa-weight-scale"></i>
          <h4>BMI Tracker</h4>
          <p>Track body composition changes</p>
        </div>
        <div class="feature">
          <i class="fas fa-clock"></i>
          <h4>Exercise Timer</h4>
          <p>Interval and countdown timers</p>
        </div>
        <div class="feature">
          <i class="fas fa-video"></i>
          <h4>Movement Library</h4>
          <p>Video demonstrations for all exercises</p>
        </div>
        <div class="feature">
          <i class="fas fa-shield-heart"></i>
          <h4>Injury Prevention</h4>
          <p>Safety tips and proper form guides</p>
        </div>
        <div class="feature">
          <i class="fas fa-bed"></i>
          <h4>Recovery Tracker</h4>
          <p>Monitor rest and sleep quality</p>
        </div>
      </div>
    </div>

    <!-- Development Team -->
    <div class="card">
      <h3><i class="fas fa-users"></i> Development Team</h3>
      <div class="team-grid">
        <div class="team-member">
          <div class="member-avatar">
            <i class="fas fa-user-graduate"></i>
          </div>
          <h4>Jessrell M. Custodio</h4>
          <p>Lead Developer</p>
        </div>
        <div class="team-member">
          <div class="member-avatar">
            <i class="fas fa-user-graduate"></i>
          </div>
          <h4>John Daniel C. Soriano</h4>
          <p>Developer</p>
        </div>
        <div class="team-member">
          <div class="member-avatar">
            <i class="fas fa-user-graduate"></i>
          </div>
          <h4>John Roberth C. Marchina</h4>
          <p>Developer</p>
        </div>
      </div>
      <p class="completion-date">
        <i class="fas fa-calendar-check"></i> Completed: April 15, 2026
      </p>
    </div>

    <!-- Technical Info -->
    <div class="card">
      <h3><i class="fas fa-cog"></i> Technical Information</h3>
      <div class="tech-info">
        <div class="tech-item">
          <span class="label">Platform:</span>
          <span class="value">Web App (PWA)</span>
        </div>
        <div class="tech-item">
          <span class="label">Version:</span>
          <span class="value">1.0.0</span>
        </div>
        <div class="tech-item">
          <span class="label">Database:</span>
          <span class="value">Google Sheets API</span>
        </div>
        <div class="tech-item">
          <span class="label">Storage:</span>
          <span class="value">Cloud + Local</span>
        </div>
        <div class="tech-item">
          <span class="label">Offline Mode:</span>
          <span class="value">Supported</span>
        </div>
        <div class="tech-item">
          <span class="label">Last Updated:</span>
          <span class="value">April 11, 2026</span>
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="card">
      <h3><i class="fas fa-envelope"></i> Contact & Support</h3>
      <p>For questions, suggestions, or support, please contact:</p>
      <div class="contact-info">
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <span>hydrofit@minsu.edu.ph</span>
        </div>
        <div class="contact-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>Mindoro State University - Main Campus</span>
        </div>
      </div>
    </div>
  `;
  
  // Listen for install prompt
  listenForInstallPrompt();
}

function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Enable download button
    const downloadBtn = document.getElementById('downloadAppBtn');
    if (downloadBtn) {
      downloadBtn.style.opacity = '1';
      downloadBtn.disabled = false;
    }
    
    console.log('✅ Install prompt available');
  });
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    const downloadBtn = document.getElementById('downloadAppBtn');
    if (downloadBtn) {
      downloadBtn.innerHTML = '<i class="fas fa-check"></i> App Installed';
      downloadBtn.disabled = true;
      downloadBtn.style.background = '#00b894';
    }
  }
}

async function installApp() {
  const downloadBtn = document.getElementById('downloadAppBtn');
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    showToast('HydroFit is already installed!', false);
    return;
  }
  
  if (!deferredPrompt) {
    // Show manual instructions
    showToast('Tap the menu (⋮) and select "Install App" or "Add to Home Screen"', false);
    
    // Show alternative guide
    const alternativeGuide = document.querySelector('.alternative-install');
    if (alternativeGuide) {
      alternativeGuide.style.background = '#f0f9ff';
      alternativeGuide.style.border = '2px solid #00b4d8';
      setTimeout(() => {
        alternativeGuide.style.background = '';
        alternativeGuide.style.border = '';
      }, 2000);
    }
    return;
  }
  
  try {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted install');
      showToast('Installing HydroFit...', false);
      
      downloadBtn.innerHTML = '<i class="fas fa-check"></i> App Installed';
      downloadBtn.disabled = true;
      downloadBtn.style.background = '#00b894';
    } else {
      console.log('❌ User dismissed install');
      showToast('Installation cancelled. You can install later.', true);
    }
    
    deferredPrompt = null;
  } catch (error) {
    console.error('Install error:', error);
    showToast('Could not install. Try using the browser menu.', true);
  }
}

// Check if app is installable
function checkInstallable() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isStandalone) {
    return 'installed';
  } else if (isIOS) {
    return 'ios-manual';
  } else if (deferredPrompt) {
    return 'installable';
  } else {
    return 'manual';
  }
}

console.log("✅ About Page Loaded");