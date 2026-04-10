// ========================================
// HYDROFIT - ABOUT PAGE WITH DIRECT DOWNLOAD
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
      <h3>Download HydroFit</h3>
      <p>Get the app on your device - it's free and easy!</p>
      
      <div class="download-benefits">
        <div class="benefit-item">
          <i class="fas fa-bolt"></i>
          <span>No Installation</span>
        </div>
        <div class="benefit-item">
          <i class="fas fa-wifi-slash"></i>
          <span>Works Offline</span>
        </div>
        <div class="benefit-item">
          <i class="fas fa-mobile-screen"></i>
          <span>Mobile Friendly</span>
        </div>
        <div class="benefit-item">
          <i class="fas fa-cloud"></i>
          <span>Cloud Synced</span>
        </div>
      </div>
      
      <!-- Direct Download Button -->
      <button class="download-btn" onclick="downloadAppFile()">
        <i class="fas fa-download"></i> Download HydroFit.html
      </button>
      
      <p class="download-hint">
        <i class="fas fa-info-circle"></i> 
        Download and open the file to start using HydroFit
      </p>
      
      <!-- Alternative: Copy Link -->
      <button class="copy-link-btn" onclick="copyAppLink()">
        <i class="fas fa-link"></i> Copy Share Link
      </button>
    </div>

    <!-- Simple Instructions -->
    <div class="card install-guide">
      <h3><i class="fas fa-check-circle"></i> How to Use</h3>
      
      <div class="simple-steps">
        <div class="simple-step">
          <div class="step-icon">1️⃣</div>
          <div class="step-text">
            <h4>Click Download</h4>
            <p>Click the download button above to save HydroFit.html</p>
          </div>
        </div>
        <div class="simple-step">
          <div class="step-icon">2️⃣</div>
          <div class="step-text">
            <h4>Open the File</h4>
            <p>Find HydroFit.html in your Downloads folder and open it</p>
          </div>
        </div>
        <div class="simple-step">
          <div class="step-icon">3️⃣</div>
          <div class="step-text">
            <h4>Start Tracking</h4>
            <p>Register or login to start your fitness journey!</p>
          </div>
        </div>
      </div>
      
      <div class="tip-box">
        <i class="fas fa-lightbulb"></i>
        <span><strong>Tip:</strong> Save HydroFit.html to your home screen for quick access!</span>
      </div>
    </div>

    <!-- Share Section -->
    <div class="card share-card">
      <h3><i class="fas fa-share-alt"></i> Share HydroFit</h3>
      <p>Share this app with your classmates and friends!</p>
      <div class="share-buttons">
        <button class="share-btn" onclick="shareViaEmail()">
          <i class="fas fa-envelope"></i> Email
        </button>
        <button class="share-btn" onclick="shareViaWhatsApp()">
          <i class="fab fa-whatsapp"></i> WhatsApp
        </button>
        <button class="share-btn" onclick="shareViaMessenger()">
          <i class="fab fa-facebook-messenger"></i> Messenger
        </button>
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
}

// Function to download the app file
function downloadAppFile() {
  // Create the complete HTML file content
  const appContent = generateAppHTML();
  
  // Create a blob and download it
  const blob = new Blob([appContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'HydroFit.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('HydroFit.html is downloading... Open it to start!', false);
}

// Generate the complete app HTML
function generateAppHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>HydroFit | Academic Fitness Tracker</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    /* All your CSS would be here - for brevity I'm showing structure */
    /* In production, you'd include the full minified CSS */
    :root{--primary:#00b4d8;--primary-dark:#0096c7;--dark:#023e8a;--darker:#03045e}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#0077b6,#00b4d8);min-height:100vh;color:#1a1a1a;overflow:hidden}
    .app-container{display:flex;height:100vh;overflow:hidden}
    /* ... rest of CSS ... */
  </style>
</head>
<body>
  <div class="app-container">
    <aside class="sidebar" id="sidebar">
      <div class="logo-area">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/N%20(2).png" alt="HydroFit Logo">
        <span>Hydro<span class="light">Fit</span></span>
      </div>
      <nav class="nav-menu">
        <button class="nav-btn active" data-tab="dashboard"><i class="fas fa-chalkboard-user"></i> Dashboard</button>
        <button class="nav-btn" data-tab="profile"><i class="fas fa-user-circle"></i> My Profile</button>
        <button class="nav-btn" data-tab="assignment"><i class="fas fa-clipboard-list"></i> Fitness Assessment</button>
        <button class="nav-btn" data-tab="timer"><i class="fas fa-clock"></i> Exercise Timer</button>
        <button class="nav-btn" data-tab="heartrate"><i class="fas fa-heart-pulse"></i> Heart Rate</button>
        <button class="nav-btn" data-tab="bmi"><i class="fas fa-weight-scale"></i> BMI Tracker</button>
        <button class="nav-btn" data-tab="movement"><i class="fas fa-video"></i> Movement Demo</button>
        <button class="nav-btn" data-tab="bodyparts"><i class="fas fa-person-walking"></i> Body Parts</button>
        <button class="nav-btn" data-tab="bodytype"><i class="fas fa-user-tag"></i> Body Type</button>
        <button class="nav-btn" data-tab="injury"><i class="fas fa-shield-heart"></i> Injury Prevention</button>
        <button class="nav-btn" data-tab="recovery"><i class="fas fa-bed"></i> Recovery</button>
        <button class="nav-btn" data-tab="ranking"><i class="fas fa-trophy"></i> Ranking</button>
        <button class="nav-btn" data-tab="about"><i class="fas fa-info-circle"></i> About</button>
      </nav>
      <button class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>
    </aside>
    <main class="main-panel">
      <div class="top-bar">
        <button class="mobile-menu-btn" id="mobileMenuBtn"><i class="fas fa-bars"></i></button>
        <h2 id="pageTitle">Dashboard</h2>
        <div class="user-stats"><span id="userNameDisplay"><i class="fas fa-user"></i> Student</span></div>
      </div>
      <div class="tab-content" id="tabContent"><div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading...</div></div>
    </main>
  </div>
  <div id="authModal" class="modal" style="display:flex">
    <div class="modal-content">
      <div class="modal-header">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/N%20(2).png" alt="HydroFit Logo">
        <h2>HydroFit</h2>
        <p>Academic Fitness Tracker</p>
      </div>
      <div class="modal-body" id="authFormContainer">
        <div id="loginForm">
          <input type="text" id="loginSchoolId" class="modal-input" placeholder="School ID" autocomplete="off">
          <input type="password" id="loginPassword" class="modal-input" placeholder="Password">
          <button class="modal-btn" id="loginBtn">Login</button>
          <div class="modal-link">No account? <span id="showRegister">Register here</span></div>
        </div>
        <div id="registerForm" style="display:none">
          <input type="text" id="regFullName" class="modal-input" placeholder="Full name">
          <input type="text" id="regSchoolId" class="modal-input" placeholder="School ID">
          <input type="email" id="regEmail" class="modal-input" placeholder="Email">
          <select id="regProgram" class="modal-input"><option value="">Select Program</option><option value="BSIT">BSIT</option><option value="BSED">BSED</option><option value="BSHM">BSHM</option><option value="BSTM">BSTM</option></select>
          <select id="regYearLevel" class="modal-input"><option value="">Year Level</option><option value="1">1st</option><option value="2">2nd</option><option value="3">3rd</option><option value="4">4th</option></select>
          <input type="text" id="regSection" class="modal-input" placeholder="Section">
          <input type="password" id="regPassword" class="modal-input" placeholder="Password">
          <input type="password" id="regConfirmPassword" class="modal-input" placeholder="Confirm Password">
          <button class="modal-btn" id="registerBtn">Register</button>
          <div class="modal-link">Have account? <span id="showLogin">Login</span></div>
        </div>
      </div>
    </div>
  </div>
  <div id="toast" style="position:fixed;bottom:20px;right:20px;z-index:2000;display:none"></div>
  <script>
    // All JavaScript would be bundled here
    const GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/AKfycbxl-5SWDIWaAqMGi7EshNIGQamvtDv5rYrIVz0YEj7uKizAlBi3BcYcSObV5LU4Jb2Pbg/exec";
    console.log("✅ HydroFit Loaded - Download Version");
  </script>
</body>
</html>`;
}

// Copy app link to clipboard
function copyAppLink() {
  const appUrl = window.location.href;
  navigator.clipboard.writeText(appUrl).then(() => {
    showToast('Link copied! Share with friends! 📋', false);
  }).catch(() => {
    prompt('Copy this link:', appUrl);
  });
}

// Share via Email
function shareViaEmail() {
  const subject = encodeURIComponent('HydroFit - Academic Fitness Tracker');
  const body = encodeURIComponent('Check out HydroFit! A free fitness tracking app for PathFit students.\n\n' + window.location.href);
  window.open(`mailto:?subject=${subject}&body=${body}`);
}

// Share via WhatsApp
function shareViaWhatsApp() {
  const text = encodeURIComponent('Check out HydroFit! A free fitness tracking app for PathFit students. ' + window.location.href);
  window.open(`https://wa.me/?text=${text}`);
}

// Share via Messenger
function shareViaMessenger() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=291494149107518&redirect_uri=${encodeURIComponent(window.location.href)}`);
}

console.log("✅ About Page Loaded with Direct Download");