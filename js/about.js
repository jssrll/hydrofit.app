// ========================================
// HYDROFIT - ABOUT PAGE
// ========================================

let deferredPrompt;

function renderAbout() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <!-- App Info Card -->
    <div class="card about-hero">
      <div class="about-logo">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/N%20(2).png" alt="HydroFit Logo" style="width:80px;height:80px;border-radius:20px">
      </div>
      <h2>HydroFit</h2>
      <p class="version" style="color:white;">Version 1.0.0</p>
      <p class="tagline" style="color:white;">Academic Fitness Tracker for PathFit Class</p>
    </div>

    <!-- Download Section -->
    <div class="card download-card">
      <div class="download-icon">
        <i class="fas fa-download"></i>
      </div>
      <h3>Get the Full Experience</h3>
      <p>Install HydroFit as an app on your device for faster access and offline support.</p>
      
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
          <i class="fas fa-home"></i>
          <span>Home Screen Icon</span>
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
            <p>Click the install button above to start installation</p>
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
      
      <div class="ios-install">
        <h4><i class="fab fa-apple"></i> iOS / Safari Users</h4>
        <p>Tap the Share button <i class="fas fa-share"></i> and select "Add to Home Screen"</p>
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
  
  // Check if already installed
  setTimeout(() => {
    checkIfInstalled();
  }, 500);
}

function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    console.log('✅ Install prompt captured - ready to install');
    
    // Enable and update download button
    const downloadBtn = document.getElementById('downloadAppBtn');
    if (downloadBtn) {
      downloadBtn.style.opacity = '1';
      downloadBtn.disabled = false;
      downloadBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Install HydroFit App';
    }
  });
}

function checkIfInstalled() {
  const downloadBtn = document.getElementById('downloadAppBtn');
  
  // Check if already in standalone mode (installed)
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    if (downloadBtn) {
      downloadBtn.innerHTML = '<i class="fas fa-check"></i> App Installed';
      downloadBtn.disabled = true;
      downloadBtn.style.background = '#00b894';
    }
    console.log('✅ App is already installed');
  }
  
  // Check if iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && downloadBtn) {
    downloadBtn.innerHTML = '<i class="fab fa-apple"></i> Add to Home Screen';
  }
}

async function installApp() {
  const downloadBtn = document.getElementById('downloadAppBtn');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    showToast('HydroFit is already installed! 🎉', false);
    return;
  }
  
  // iOS special handling
  if (isIOS) {
    showToast('Tap Share button then "Add to Home Screen"', false);
    
    // Highlight iOS instructions
    const iosGuide = document.querySelector('.ios-install');
    if (iosGuide) {
      iosGuide.style.background = '#f0f9ff';
      iosGuide.style.border = '2px solid #00b4d8';
      iosGuide.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        iosGuide.style.background = '';
        iosGuide.style.border = '';
      }, 3000);
    }
    return;
  }
  
  // Check if we have the install prompt
  if (!deferredPrompt) {
    // Try to trigger install manually
    console.log('No deferred prompt, showing manual instructions');
    showToast('Use browser menu (⋮) → "Install App"', false);
    
    // Highlight alternative guide
    const alternativeGuide = document.querySelector('.alternative-install');
    if (alternativeGuide) {
      alternativeGuide.style.background = '#f0f9ff';
      alternativeGuide.style.border = '2px solid #00b4d8';
      alternativeGuide.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        alternativeGuide.style.background = '';
        alternativeGuide.style.border = '';
      }, 3000);
    }
    return;
  }
  
  try {
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
    downloadBtn.disabled = true;
    
    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted installation');
      showToast('Installing HydroFit... Welcome! 🎉', false);
      
      downloadBtn.innerHTML = '<i class="fas fa-check"></i> App Installed';
      downloadBtn.style.background = '#00b894';
      
      // Check again after a delay
      setTimeout(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
          console.log('✅ App is now running in standalone mode');
        }
      }, 2000);
    } else {
      console.log('❌ User dismissed installation');
      showToast('Installation cancelled. You can install later.', true);
      
      downloadBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Install HydroFit App';
      downloadBtn.disabled = false;
    }
    
    // Clear the deferred prompt
    deferredPrompt = null;
    
  } catch (error) {
    console.error('Install error:', error);
    showToast('Could not install automatically. Use browser menu.', true);
    
    downloadBtn.innerHTML = '<i class="fas fa-arrow-down"></i> Install HydroFit App';
    downloadBtn.disabled = false;
  }
}

// Manual install trigger (for browsers that don't support beforeinstallprompt)
function manualInstallGuide() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) {
    return 'Click the menu (⋮) → "Install HydroFit"';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'Tap Share → "Add to Home Screen"';
  } else if (userAgent.includes('edg')) {
    return 'Click menu (⋯) → "Apps" → "Install HydroFit"';
  } else if (userAgent.includes('firefox')) {
    return 'Firefox: Tap menu → "Install"';
  } else {
    return 'Use browser menu to "Add to Home Screen"';
  }
}

console.log("✅ About Page Loaded");