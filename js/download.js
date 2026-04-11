// ========================================
// HYDROFIT - DOWNLOAD PAGE
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

    <!-- Install Button -->
    <div class="card download-cta-card">
      <h3><i class="fas fa-download"></i> Get HydroFit</h3>
      <p>Available on Android / iOS / Windows / Mac / Linux</p>
      
      <button class="install-btn" onclick="handleInstallClick()" id="installAppBtn">
        <i class="fas fa-arrow-down"></i>
        <div class="btn-text">
          <span class="btn-title">Install HydroFit</span>
          <span class="btn-subtitle">Android / iOS / Windows / Mac / Linux</span>
        </div>
      </button>
      
      <p class="install-note" id="installNote">
        <i class="fas fa-mobile-alt"></i> 
        Click Install to add HydroFit to your home screen
      </p>
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

    <!-- What's Included -->
    <div class="card included-card">
      <h3><i class="fas fa-check-circle"></i> What's Included</h3>
      <div class="included-grid">
        <div class="included-item">
          <i class="fas fa-clipboard-list"></i>
          <span>Fitness Assessment (50+ exercises)</span>
        </div>
        <div class="included-item">
          <i class="fas fa-clock"></i>
          <span>Exercise Timer & Interval Training</span>
        </div>
        <div class="included-item">
          <i class="fas fa-heart-pulse"></i>
          <span>Heart Rate Logger</span>
        </div>
        <div class="included-item">
          <i class="fas fa-weight-scale"></i>
          <span>BMI Tracker</span>
        </div>
        <div class="included-item">
          <i class="fas fa-video"></i>
          <span>Movement Demo Library</span>
        </div>
        <div class="included-item">
          <i class="fas fa-person-walking"></i>
          <span>Body Parts Focus Trainer</span>
        </div>
        <div class="included-item">
          <i class="fas fa-user-tag"></i>
          <span>Body Type Identifier</span>
        </div>
        <div class="included-item">
          <i class="fas fa-shield-heart"></i>
          <span>Injury Prevention Guide</span>
        </div>
        <div class="included-item">
          <i class="fas fa-bed"></i>
          <span>Recovery & Rest Tracker</span>
        </div>
        <div class="included-item">
          <i class="fas fa-fire"></i>
          <span>Warm-up & Cooldown Generator</span>
        </div>
        <div class="included-item">
          <i class="fas fa-calendar-check"></i>
          <span>Daily Workout Scheduler</span>
        </div>
        <div class="included-item">
          <i class="fas fa-person-walking"></i>
          <span>Stretching Exercise Library</span>
        </div>
        <div class="included-item">
          <i class="fas fa-droplet"></i>
          <span>Hydration Tracker</span>
        </div>
        <div class="included-item">
          <i class="fab fa-telegram"></i>
          <span>Community Chat</span>
        </div>
      </div>
    </div>

    <!-- Installation Guide -->
    <div class="card help-card">
      <h3><i class="fas fa-question-circle"></i> How to Install</h3>
      <p>Click the Install button above to add HydroFit to your device</p>
      <div class="install-methods">
        <div class="method">
          <i class="fab fa-chrome"></i>
          <span>Chrome: Click Install → Add to Home Screen</span>
        </div>
        <div class="method">
          <i class="fab fa-safari"></i>
          <span>Safari: Tap Share → Add to Home Screen</span>
        </div>
        <div class="method">
          <i class="fab fa-edge"></i>
          <span>Edge: Menu → Apps → Install this site</span>
        </div>
      </div>
    </div>
  `;
  
  // Check if already installed
  setTimeout(() => {
    checkInstallStatus();
  }, 300);
}

function checkInstallStatus() {
  const btn = document.getElementById('installAppBtn');
  const note = document.getElementById('installNote');
  
  if (!btn) return;
  
  // Check if running as standalone PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
  
  if (isStandalone) {
    btn.innerHTML = `
      <i class="fas fa-check"></i>
      <div class="btn-text">
        <span class="btn-title">HydroFit Installed</span>
        <span class="btn-subtitle">App is ready to use</span>
      </div>
    `;
    btn.style.background = '#00b894';
    btn.disabled = true;
    
    if (note) {
      note.innerHTML = '<i class="fas fa-check-circle"></i> HydroFit is installed on your device!';
    }
  }
}

// Listen for install prompt when page loads
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default browser install prompt
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  console.log('📲 Install prompt captured and saved');
});

// Track when app is installed
window.addEventListener('appinstalled', () => {
  console.log('✅ HydroFit was installed!');
  deferredPrompt = null;
  
  const btn = document.getElementById('installAppBtn');
  const note = document.getElementById('installNote');
  
  if (btn) {
    btn.innerHTML = `
      <i class="fas fa-check"></i>
      <div class="btn-text">
        <span class="btn-title">HydroFit Installed</span>
        <span class="btn-subtitle">App is ready to use</span>
      </div>
    `;
    btn.style.background = '#00b894';
    btn.disabled = true;
  }
  
  if (note) {
    note.innerHTML = '<i class="fas fa-check-circle"></i> HydroFit has been installed successfully!';
  }
  
  if (typeof showToast === 'function') {
    showToast('HydroFit installed successfully! 🎉', false);
  }
});

function handleInstallClick() {
  const btn = document.getElementById('installAppBtn');
  const note = document.getElementById('installNote');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Check if already installed
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true;
  
  if (isStandalone) {
    if (typeof showToast === 'function') {
      showToast('HydroFit is already installed! 🎉', false);
    } else {
      alert('HydroFit is already installed!');
    }
    return;
  }
  
  // iOS special handling
  if (isIOS) {
    if (typeof showToast === 'function') {
      showToast('Tap Share button then "Add to Home Screen" 📱', false);
    }
    
    if (note) {
      note.innerHTML = '<i class="fab fa-apple"></i> iOS: Tap Share <i class="fas fa-share"></i> → "Add to Home Screen"';
      note.style.background = '#f0f9ff';
      note.style.color = '#00b4d8';
    }
    return;
  }
  
  // Check if we have the install prompt
  if (!deferredPrompt) {
    console.log('No deferred prompt available - showing manual instructions');
    
    if (note) {
      note.innerHTML = '<i class="fas fa-info-circle"></i> Use browser menu (⋮) → "Install App" or "Add to Home Screen"';
    }
    
    if (typeof showToast === 'function') {
      showToast('Use browser menu to install HydroFit', false);
    } else {
      alert('Use your browser menu (⋮) and select "Install App" or "Add to Home Screen"');
    }
    return;
  }
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for user response
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('✅ User accepted installation');
      
      if (btn) {
        btn.innerHTML = `
          <i class="fas fa-check"></i>
          <div class="btn-text">
            <span class="btn-title">HydroFit Installed</span>
            <span class="btn-subtitle">App is ready to use</span>
          </div>
        `;
        btn.style.background = '#00b894';
        btn.disabled = true;
      }
      
      if (note) {
        note.innerHTML = '<i class="fas fa-check-circle"></i> HydroFit has been installed successfully!';
      }
      
      if (typeof showToast === 'function') {
        showToast('Installing HydroFit... Welcome! 🎉', false);
      }
    } else {
      console.log('❌ User dismissed installation');
      
      if (typeof showToast === 'function') {
        showToast('Installation cancelled. You can install later.', true);
      }
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
  }).catch((error) => {
    console.error('Install error:', error);
    
    if (note) {
      note.innerHTML = '<i class="fas fa-info-circle"></i> Use browser menu (⋮) → "Install App"';
    }
  });
}

console.log("✅ Download Page Loaded");