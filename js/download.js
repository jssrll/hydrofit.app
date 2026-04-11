// ========================================
// HYDROFIT - DOWNLOAD PAGE
// ========================================

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

    <!-- Download Buttons -->
    <div class="card download-cta-card">
      <h3><i class="fas fa-download"></i> Download HydroFit</h3>
      <p>Get the app on your device and start your fitness journey</p>
      
      <div class="download-buttons">
        <button class="download-btn-android" onclick="downloadForAndroid()">
          <i class="fab fa-android"></i>
          <div class="btn-text">
            <span class="btn-title">Download for Android</span>
          </div>
        </button>
        
        <button class="download-btn-pc" onclick="downloadForPC()">
          <i class="fas fa-desktop"></i>
          <div class="btn-text">
            <span class="btn-title">Download for PC</span>
          </div>
        </button>
      </div>
      
      <p class="download-note">
        <i class="fas fa-shield-alt"></i> 
        Secure download • Free forever • No ads
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
  `;
}

// Download for Android
function downloadForAndroid() {
  showToast('Preparing Android download... 📱', false);
  
  // Create downloadable HTML file
  const appContent = generateAppHTML();
  const blob = new Blob([appContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'HydroFit.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  setTimeout(() => {
    showToast('HydroFit downloaded! Open the file to start 🎉', false);
  }, 1000);
}

// Download for PC
function downloadForPC() {
  showToast('Preparing PC download... 💻', false);
  
  // Create downloadable HTML file
  const appContent = generateAppHTML();
  const blob = new Blob([appContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'HydroFit.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  setTimeout(() => {
    showToast('HydroFit downloaded! Open the file to start 🎉', false);
  }, 1000);
}

// Generate app HTML for download
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
    :root{--primary:#00b4d8;--primary-dark:#0096c7;--dark:#023e8a;--darker:#03045e;--light:#f0f9ff;--success:#00b894;--warning:#fdcb6e;--danger:#d63031;--shadow:0 4px 12px rgba(0,0,0,0.08);--header-height:65px}
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;background:linear-gradient(135deg,#0077b6,#00b4d8);min-height:100vh;color:#1a1a1a;overflow:hidden}
    .app-container{display:flex;height:100vh;overflow:hidden}
    .sidebar{width:280px;background:linear-gradient(180deg,rgba(3,4,94,0.98),rgba(2,62,138,0.98));color:white;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100}
    .logo-area{padding:24px 20px;font-size:1.6rem;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;gap:12px}
    .logo-area img{width:45px;height:45px;border-radius:12px}
    .logo-area span{background:linear-gradient(135deg,#fff,#90e0ef);-webkit-background-clip:text;background-clip:text;color:transparent}
    .nav-menu{flex:1;padding:20px 12px;display:flex;flex-direction:column;gap:6px}
    .nav-btn{background:transparent;border:none;color:#e0f2fe;padding:12px 16px;text-align:left;font-size:0.95rem;font-weight:500;border-radius:12px;cursor:pointer;display:flex;align-items:center;gap:12px}
    .nav-btn:hover{background:rgba(0,180,216,0.2);color:white}
    .nav-btn.active{background:var(--primary);color:white}
    .logout-btn{margin:20px;padding:12px;background:rgba(214,48,49,0.9);border:none;color:white;border-radius:12px;cursor:pointer;font-weight:600}
    .main-panel{flex:1;margin-left:280px;overflow-y:auto;background:#f0f9ff;height:100vh}
    .top-bar{background:rgba(255,255,255,0.98);padding:0 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:var(--shadow);position:fixed;top:0;left:280px;right:0;z-index:50;height:65px}
    .top-bar h2{font-size:1.4rem;font-weight:700;background:linear-gradient(135deg,var(--primary),var(--dark));-webkit-background-clip:text;background-clip:text;color:transparent}
    .tab-content{padding:24px;margin-top:65px}
    .card{background:white;border-radius:20px;padding:24px;box-shadow:var(--shadow);margin-bottom:20px}
    .btn{background:var(--primary);color:white;border:none;padding:10px 20px;border-radius:40px;font-weight:600;cursor:pointer}
    .modal{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:1000}
    .modal-content{background:white;border-radius:28px;max-width:420px;width:90%}
    .modal-header{background:linear-gradient(135deg,var(--primary),var(--dark));color:white;padding:32px 24px;text-align:center;border-radius:28px 28px 0 0}
    .modal-body{padding:28px 24px}
    .modal-input{width:100%;padding:12px 16px;margin-bottom:16px;border:1.5px solid #e0e0e0;border-radius:12px}
    .modal-btn{width:100%;padding:14px;background:var(--primary);color:white;border:none;border-radius:12px;font-weight:600;cursor:pointer}
    @media (max-width:768px){.sidebar{left:-280px}.sidebar.open{left:0}.main-panel{margin-left:0}.top-bar{left:0}}
  </style>
</head>
<body>
<div class="app-container">
  <aside class="sidebar" id="sidebar">
    <div class="logo-area"><img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/N%20(2).png" alt="HydroFit"><span>Hydro<span class="light">Fit</span></span></div>
    <nav class="nav-menu">
      <button class="nav-btn active" onclick="switchTab('dashboard')"><i class="fas fa-chalkboard-user"></i> Dashboard</button>
      <button class="nav-btn" onclick="switchTab('profile')"><i class="fas fa-user-circle"></i> Profile</button>
      <button class="nav-btn" onclick="switchTab('assignment')"><i class="fas fa-clipboard-list"></i> Assessment</button>
      <button class="nav-btn" onclick="switchTab('download')"><i class="fas fa-download"></i> Download</button>
    </nav>
    <button class="logout-btn" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
  </aside>
  <main class="main-panel">
    <div class="top-bar"><h2>HydroFit</h2></div>
    <div class="tab-content" id="tabContent"><div class="card"><h3>Welcome to HydroFit!</h3><p>Your Academic Fitness Tracker</p></div></div>
  </main>
</div>
<div id="authModal" class="modal" style="display:flex">
  <div class="modal-content">
    <div class="modal-header"><h2>HydroFit</h2><p>Login to continue</p></div>
    <div class="modal-body">
      <input type="text" id="schoolId" class="modal-input" placeholder="School ID">
      <input type="password" id="password" class="modal-input" placeholder="Password">
      <button class="modal-btn" onclick="login()">Login</button>
    </div>
  </div>
</div>
<script>console.log("HydroFit Loaded!")</script>
</body>
</html>`;
}

console.log("✅ Download Page Loaded");