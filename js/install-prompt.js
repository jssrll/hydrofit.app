// ========================================
// HYDROFIT - CUSTOM INSTALL PROMPT
// ========================================

let deferredPrompt = null;
let installPromptShown = false;

// Initialize install prompt listener
function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.deferredPrompt = deferredPrompt;
    console.log('📲 Install prompt captured!');
    
    // Show custom prompt after a short delay
    setTimeout(() => {
      showCustomInstallPrompt();
    }, 2000);
  });
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('📱 App already installed');
    return;
  }
  
  // Track installation
  window.addEventListener('appinstalled', () => {
    console.log('✅ HydroFit installed successfully!');
    deferredPrompt = null;
    window.deferredPrompt = null;
    hideCustomInstallPrompt();
    
    if (typeof showToast === 'function') {
      showToast('HydroFit installed! Check your home screen 🎉', false);
    }
  });
}

// Show beautiful custom install prompt
function showCustomInstallPrompt() {
  if (installPromptShown) return;
  if (!deferredPrompt) return;
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  
  installPromptShown = true;
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'prompt-overlay';
  overlay.id = 'installPromptOverlay';
  overlay.onclick = hideCustomInstallPrompt;
  
  // Create prompt
  const prompt = document.createElement('div');
  prompt.className = 'custom-install-prompt';
  prompt.id = 'customInstallPrompt';
  prompt.innerHTML = `
    <div class="prompt-header">
      <div class="prompt-icon">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/N%20(2).png" alt="HydroFit">
      </div>
      <div class="prompt-title">
        <h3>Install HydroFit</h3>
        <p>Get the full app experience</p>
      </div>
      <button class="prompt-close" onclick="hideCustomInstallPrompt()">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="prompt-body">
      <div class="prompt-features">
        <div class="prompt-feature">
          <i class="fas fa-bolt"></i>
          <span>Faster</span>
        </div>
        <div class="prompt-feature">
          <i class="fas fa-wifi"></i>
          <span>Offline</span>
        </div>
        <div class="prompt-feature">
          <i class="fas fa-mobile"></i>
          <span>Full Screen</span>
        </div>
      </div>
      <p class="prompt-description">
        Install HydroFit on your device for quick access and better performance.
      </p>
      <div class="prompt-buttons">
        <button class="prompt-install-btn" onclick="triggerInstall()">
          <i class="fas fa-arrow-down"></i> Install Now
        </button>
        <button class="prompt-later-btn" onclick="hideCustomInstallPrompt()">
          Maybe Later
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  document.body.appendChild(prompt);
}

// Hide the custom install prompt
function hideCustomInstallPrompt() {
  const prompt = document.getElementById('customInstallPrompt');
  const overlay = document.getElementById('installPromptOverlay');
  
  if (prompt) {
    prompt.style.animation = 'fadeOutPrompt 0.3s ease forwards';
    setTimeout(() => prompt.remove(), 300);
  }
  if (overlay) {
    overlay.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => overlay.remove(), 300);
  }
  
  installPromptShown = false;
}

// Trigger the actual installation
async function triggerInstall() {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    hideCustomInstallPrompt();
    
    // Fallback for browsers
    if (typeof showToast === 'function') {
      showToast('Use browser menu (⋮) → "Install App"', false);
    }
    return;
  }
  
  try {
    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('✅ User accepted installation');
      hideCustomInstallPrompt();
    } else {
      console.log('❌ User dismissed installation');
      hideCustomInstallPrompt();
    }
    
    deferredPrompt = null;
    window.deferredPrompt = null;
    
  } catch (error) {
    console.error('Install error:', error);
    hideCustomInstallPrompt();
  }
}

// Manual trigger for install button in other pages
function manualInstall() {
  if (deferredPrompt) {
    triggerInstall();
  } else {
    showCustomInstallPrompt();
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initInstallPrompt();
});

// Expose functions globally
window.showCustomInstallPrompt = showCustomInstallPrompt;
window.hideCustomInstallPrompt = hideCustomInstallPrompt;
window.triggerInstall = triggerInstall;
window.manualInstall = manualInstall;

console.log('✅ Install Prompt Module Loaded');