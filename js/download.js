// ========================================
// HYDROFIT - DOWNLOAD PAGE (PWA INSTALL)
// ========================================

let deferredPrompt = null;

function renderDownload() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="download-hero">
      <div class="download-hero-content">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/N%20(2).png" alt="HydroFit Logo" class="download-logo">
        <h1>HydroFit</h1>
        <p class="hero-subtitle">Train specific body parts with guided workouts</p>
      </div>
    </div>

    <!-- Install Buttons -->
    <div class="card download-cta-card">
      <h3><i class="fas fa-download"></i> Install HydroFit</h3>
      <p>Get the app on your device and start your fitness journey</p>
      
      <div class="download-buttons">
        <button class="download-btn-android" id="installAndroidBtn" onclick="installPWA()">
          <i class="fab fa-android"></i>
          <div class="btn-text">
            <span class="btn-title">Install on Android</span>
          </div>
        </button>
        
        <button class="download-btn-pc" id="installPCBtn" onclick="installPWA()">
          <i class="fas fa-desktop"></i>
          <div class="btn-text">
            <span class="btn-title">Install on PC</span>
          </div>
        </button>
      </div>
      
      <p class="download-note">
        <i class="fas fa-shield-alt"></i> 
        Install as app • Works offline • Always up to date
      </p>
      
      <!-- Alternative Install Guide -->
      <div class="install-guide-box">
        <h4><i class="fas fa-info-circle"></i> How to Install</h4>
        <div class="guide-steps">
          <div class="guide-step">
            <span class="step-icon">1</span>
            <span>Click the Install button above</span>
          </div>
          <div class="guide-step">
            <span class="step-icon">2</span>
            <span>Confirm installation when prompted</span>
          </div>
          <div class="guide-step">
            <span class="step-icon">3</span>
            <span>HydroFit will appear on your home screen</span>
          </div>
        </div>
        <p class="alternative-hint">
          <i class="fas fa-ellipsis-v"></i>
          Alternatively, tap the menu (⋮) in your browser and select "Install App"
        </p>
      </div>
    </div>

    <!-- Features -->
    <div class="card">
      <h3><i class="fas fa-star"></i> Features</h3>
      <div class="features-list">
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-dumbbell"></i>
          </div>
          <div class="feature-content">
            <h4>Guided Exercises</h4>
            <p>Squat, Plank, Push-ups and many more with proper form guidance</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="feature-content">
            <h4>Beginner to Advanced</h4>
            <p>Workouts for all fitness levels with adjustable difficulty</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <div class="feature-content">
            <h4>Fast & Easy to Use</h4>
            <p>Simple interface designed for quick workout tracking</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-video"></i>
          </div>
          <div class="feature-content">
            <h4>Video Demonstrations</h4>
            <p>Learn proper form with exercise video library</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-chart-pie"></i>
          </div>
          <div class="feature-content">
            <h4>Progress Tracking</h4>
            <p>Monitor your improvements over time</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">
            <i class="fas fa-trophy"></i>
          </div>
          <div class="feature-content">
            <h4>Rankings</h4>
            <p>Compete with others and climb the leaderboard</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Benefits of PWA -->
    <div class="card benefits-card">
      <h3><i class="fas fa-mobile-screen"></i> Why Install as App?</h3>
      <div class="pwa-benefits">
        <div class="pwa-benefit">
          <i class="fas fa-bolt"></i>
          <div>
            <h4>Faster Loading</h4>
            <p>App loads instantly without browser tabs</p>
          </div>
        </div>
        <div class="pwa-benefit">
          <i class="fas fa-wifi-slash"></i>
          <div>
            <h4>Works Offline</h4>
            <p>Continue tracking even without internet</p>
          </div>
        </div>
        <div class="pwa-benefit">
          <i class="fas fa-arrows-alt"></i>
          <div>
            <h4>Full Screen Mode</h4>
            <p>Immersive experience without distractions</p>
          </div>
        </div>
        <div class="pwa-benefit">
          <i class="fas fa-sync-alt"></i>
          <div>
            <h4>Auto Updates</h4>
            <p>Always get the latest features automatically</p>
          </div>
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
    window.deferredPrompt = deferredPrompt;
    
    console.log('✅ Install prompt captured! Ready to install.');
    
    // Update button states
    const androidBtn = document.getElementById('installAndroidBtn');
    const pcBtn = document.getElementById('installPCBtn');
    
    if (androidBtn) {
      androidBtn.style.opacity = '1';
      androidBtn.disabled = false;
    }
    if (pcBtn) {
      pcBtn.style.opacity = '1';
      pcBtn.disabled = false;
    }
  });
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    const androidBtn = document.getElementById('installAndroidBtn');
    const pcBtn = document.getElementById('installPCBtn');
    
    if (androidBtn) {
      androidBtn.innerHTML = `
        <i class="fas fa-check"></i>
        <div class="btn-text">
          <span class="btn-title">App Installed</span>
        </div>
      `;
      androidBtn.disabled = true;
      androidBtn.style.background = '#00b894';
    }
    if (pcBtn) {
      pcBtn.innerHTML = `
        <i class="fas fa-check"></i>
        <div class="btn-text">
          <span class="btn-title">App Installed</span>
        </div>
      `;
      pcBtn.disabled = true;
      pcBtn.style.background = '#00b894';
    }
  }
}

async function installPWA() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const androidBtn = document.getElementById('installAndroidBtn');
  const pcBtn = document.getElementById('installPCBtn');
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    showToast('HydroFit is already installed! 🎉', false);
    return;
  }
  
  // iOS special handling
  if (isIOS) {
    showToast('Tap Share button then "Add to Home Screen"', false);
    
    // Show iOS specific guide
    const guideBox = document.querySelector('.install-guide-box');
    if (guideBox) {
      guideBox.innerHTML = `
        <h4><i class="fab fa-apple"></i> iOS Installation</h4>
        <div class="guide-steps">
          <div class="guide-step">
            <span class="step-icon">1</span>
            <span>Tap the Share button <i class="fas fa-share"></i> at the bottom</span>
          </div>
          <div class="guide-step">
            <span class="step-icon">2</span>
            <span>Scroll down and tap "Add to Home Screen"</span>
          </div>
          <div class="guide-step">
            <span class="step-icon">3</span>
            <span>Tap "Add" to install HydroFit</span>
          </div>
        </div>
      `;
    }
    return;
  }
  
  // Check if we have the install prompt
  if (!deferredPrompt && !window.deferredPrompt) {
    console.log('No install prompt available');
    showToast('Use browser menu (⋮) → "Install App"', false);
    
    // Show manual guide
    const guideBox = document.querySelector('.install-guide-box');
    if (guideBox) {
      guideBox.style.background = '#fef9e7';
      guideBox.style.border = '2px solid #fdcb6e';
      setTimeout(() => {
        guideBox.style.background = '';
        guideBox.style.border = '';
      }, 3000);
    }
    return;
  }
  
  const prompt = deferredPrompt || window.deferredPrompt;
  
  try {
    // Update button state
    if (androidBtn) {
      androidBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><div class="btn-text"><span class="btn-title">Installing...</span></div>';
      androidBtn.disabled = true;
    }
    if (pcBtn) {
      pcBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><div class="btn-text"><span class="btn-title">Installing...</span></div>';
      pcBtn.disabled = true;
    }
    
    // Show the install prompt
    await prompt.prompt();
    
    // Wait for user response
    const { outcome } = await prompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted installation');
      showToast('Installing HydroFit... Welcome! 🎉', false);
      
      if (androidBtn) {
        androidBtn.innerHTML = `
          <i class="fas fa-check"></i>
          <div class="btn-text">
            <span class="btn-title">App Installed</span>
          </div>
        `;
        androidBtn.style.background = '#00b894';
      }
      if (pcBtn) {
        pcBtn.innerHTML = `
          <i class="fas fa-check"></i>
          <div class="btn-text">
            <span class="btn-title">App Installed</span>
          </div>
        `;
        pcBtn.style.background = '#00b894';
      }
    } else {
      console.log('❌ User dismissed installation');
      showToast('Installation cancelled. You can install later.', true);
      
      if (androidBtn) {
        androidBtn.innerHTML = `
          <i class="fab fa-android"></i>
          <div class="btn-text">
            <span class="btn-title">Install on Android</span>
          </div>
        `;
        androidBtn.disabled = false;
      }
      if (pcBtn) {
        pcBtn.innerHTML = `
          <i class="fas fa-desktop"></i>
          <div class="btn-text">
            <span class="btn-title">Install on PC</span>
          </div>
        `;
        pcBtn.disabled = false;
      }
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
    window.deferredPrompt = null;
    
  } catch (error) {
    console.error('Install error:', error);
    showToast('Could not install. Use browser menu instead.', true);
    
    if (androidBtn) {
      androidBtn.innerHTML = `
        <i class="fab fa-android"></i>
        <div class="btn-text">
          <span class="btn-title">Install on Android</span>
        </div>
      `;
      androidBtn.disabled = false;
    }
    if (pcBtn) {
      pcBtn.innerHTML = `
        <i class="fas fa-desktop"></i>
        <div class="btn-text">
          <span class="btn-title">Install on PC</span>
        </div>
      `;
      pcBtn.disabled = false;
    }
  }
}

console.log("✅ Download Page Loaded with PWA Install");