// ========================================
// HYDROFIT - MOBILE OPTIMIZED WITH QR FIX
// ========================================

let currentTab = "dashboard";
let currentUser = null;
let isLoading = false;

// Toast notification function
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = isError ? "#d63031" : "#03045e";
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="margin-right: 8px;"></i> ${message}`;
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function updatePageTitle(title) {
  document.getElementById("pageTitle").innerText = title;
}

function updateUserStats() {
  if (currentUser) {
    const lastName = currentUser.fullName.split(',')[0];
    document.getElementById("userNameDisplay").innerHTML = `<i class="fas fa-user"></i> ${lastName}`;
  }
}

// Close sidebar function
function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  sidebar.classList.remove("open");
  if (overlay) overlay.remove();
}

// ========================================
// API CALL
// ========================================

async function callAPI(action, data = {}) {
  try {
    const params = new URLSearchParams({ action, ...data });
    const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch(error) {
    console.error("Error:", error);
    return { success: false, error: error.message };
  }
}

// ========================================
// QR CODE GENERATOR
// ========================================

function generateQRCode(userData) {
  // Create QR data string with user info
  const qrData = JSON.stringify({
    name: userData.fullName,
    schoolId: userData.schoolId,
    email: userData.email,
    program: userData.program,
    yearLevel: userData.yearLevel,
    section: userData.section
  });
  
  // Use Google Charts API for QR code
  const qrUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(qrData)}&choe=UTF-8&chld=L|2`;
  
  return qrUrl;
}

// Download QR Code function
function downloadQRCode() {
  if (window.currentQRCodeUrl && currentUser) {
    // Create a canvas to convert QR to downloadable image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = window.currentQRCodeUrl;
    
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `HydroFit_QR_${currentUser.schoolId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      showToast('QR Code downloaded!', false);
    };
    
    img.onerror = function() {
      // Fallback - open in new tab
      window.open(window.currentQRCodeUrl, '_blank');
      showToast('Right-click the QR code to save it', false);
    };
  }
}

// ========================================
// DASHBOARD
// ========================================

function renderDashboard() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="slideshow-wrapper">
      <div class="slideshow-container" id="slideshowContainer">
        <div class="slide active" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_1.jpg?updatedAt=1775652185255'); background-size: cover; background-position: center;"></div>
        <div class="slide" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_2.jpg?updatedAt=1775652283140'); background-size: cover; background-position: center;"></div>
        <div class="slide" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_3.jpg?updatedAt=1775652127029'); background-size: cover; background-position: center;"></div>
        <div class="slide-dots" id="slideDots"></div>
      </div>
      <div class="slideshow-overlay">
        <div class="school-badge">
          <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/images%20(4).jpg?updatedAt=1775655891511" alt="MinSU Logo">
          <div class="school-text">
            <strong>Mindoro State University</strong>
            <span>PathFit Class</span>
          </div>
        </div>
      </div>
    </div>

    <div class="goals-card">
      <h2>Welcome to HydroFit</h2>
      <p>Your Academic Fitness Tracker for PathFit Class</p>
      <div class="goals-stats">
        <div class="goal-item">
          <div class="value"><i class="fas fa-heart"></i></div>
          <div class="label">Stay Active</div>
        </div>
        <div class="goal-item">
          <div class="value"><i class="fas fa-brain"></i></div>
          <div class="label">Learn & Grow</div>
        </div>
        <div class="goal-item">
          <div class="value"><i class="fas fa-medal"></i></div>
          <div class="label">Excel</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3><i class="fas fa-info-circle"></i> About HydroFit</h3>
      <p style="line-height: 1.6; margin: 16px 0; color: #333;">
        HydroFit is an academic fitness tracking platform designed for Mindoro State University students. 
        Track your PathFit activities, monitor your progress, and achieve your fitness goals.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px;">
        <span style="background: #e0f2fe; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; color: #023e8a;">
          <i class="fas fa-check-circle" style="color: #00b894;"></i> Track Activities
        </span>
        <span style="background: #e0f2fe; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; color: #023e8a;">
          <i class="fas fa-check-circle" style="color: #00b894;"></i> Monitor Progress
        </span>
        <span style="background: #e0f2fe; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; color: #023e8a;">
          <i class="fas fa-check-circle" style="color: #00b894;"></i> Earn Badges
        </span>
      </div>
    </div>
  `;
  
  initSlideshow();
}

function initSlideshow() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  if (!slides.length) return;
  
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  
  function goToSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    slides[n].classList.add('active');
    if (document.querySelectorAll('.dot')[n]) {
      document.querySelectorAll('.dot')[n].classList.add('active');
    }
    currentSlide = n;
  }
  
  setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, 4000);
}

// ========================================
// PROFILE PAGE WITH QR CODE
// ========================================

async function renderProfile() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading profile...</div>`;
  
  // If we already have currentUser, use it, otherwise fetch
  let userData = currentUser;
  if (!userData || !userData.schoolId) {
    const result = await callAPI("getProfile", { schoolId: currentUser?.schoolId });
    if (result.success) {
      userData = result.user;
      currentUser = userData;
      localStorage.setItem("hydrofit_user", JSON.stringify(currentUser));
    }
  }
  
  if (!userData) {
    container.innerHTML = `<div class="card"><p style="color: #d63031;">Error loading profile. Please try again.</p></div>`;
    isLoading = false;
    return;
  }
  
  const programColors = {
    'BSIT': '#00b4d8', 'BSED': '#48cae4', 'BSHM': '#90e0ef', 'BSTM': '#00b894',
    'BS PSYCHOLOGY': '#fdcb6e', 'BSCRIM': '#e17055', 'BTLED': '#6c5ce7', 'BTVTED': '#a29bfe'
  };
  
  // Generate QR code
  const qrCodeUrl = generateQRCode(userData);
  window.currentQRCodeUrl = qrCodeUrl;
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar"><i class="fas fa-user-graduate"></i></div>
      <h2>${escapeHtml(userData.fullName)}</h2>
      <p>PathFit Student</p>
      <span class="program-badge" style="background: ${programColors[userData.program] || '#00b4d8'}; color: white;">${userData.program}</span>
      <div class="profile-info-grid">
        <div class="info-item"><label>School ID</label><p>${userData.schoolId}</p></div>
        <div class="info-item"><label>Email</label><p>${userData.email}</p></div>
        <div class="info-item"><label>Year Level</label><p>${userData.yearLevel}${getYearSuffix(userData.yearLevel)} Year</p></div>
        <div class="info-item"><label>Section</label><p>${userData.section}</p></div>
      </div>
    </div>
    
    <div class="card">
      <h3><i class="fas fa-qrcode"></i> Attendance QR Code</h3>
      <p style="color: #64748b; margin-bottom: 20px; font-size: 0.9rem;">Scan this QR code for attendance tracking</p>
      <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 16px;">
        <div style="background: white; padding: 20px; border-radius: 12px; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <img src="${qrCodeUrl}" alt="Attendance QR Code" style="width: 200px; height: 200px; border-radius: 8px; display: block;">
        </div>
        <p style="margin-top: 16px; color: #1a1a1a; font-weight: 600;">
          <i class="fas fa-user"></i> ${escapeHtml(userData.fullName)}
        </p>
        <p style="color: #64748b; font-size: 0.85rem;">
          <i class="fas fa-id-card"></i> ${userData.schoolId}
        </p>
        <button class="btn btn-outline" onclick="window.downloadQRCode()" style="margin-top: 16px; width: 100%;">
          <i class="fas fa-download"></i> Download QR Code
        </button>
        <p style="margin-top: 12px; font-size: 0.75rem; color: #94a3b8;">
          <i class="fas fa-info-circle"></i> Present this QR code for attendance
        </p>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    return m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;';
  });
}

function getYearSuffix(year) {
  if (year == 1) return 'st';
  if (year == 2) return 'nd';
  if (year == 3) return 'rd';
  return 'th';
}

// ========================================
// ASSIGNMENT & RANKING
// ========================================

function renderAssignment() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `
    <div class="card">
      <div style="text-align: center; padding: 40px 20px;">
        <i class="fas fa-pen-ruler" style="font-size: 3.5rem; color: #00b4d8; margin-bottom: 16px;"></i>
        <h3 style="color: #1a1a1a; margin-bottom: 8px;">Assignments Coming Soon</h3>
        <p style="color: #64748b;">Track your PathFit assignments and written outputs here.</p>
      </div>
    </div>
  `;
}

function renderRanking() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `
    <div class="card">
      <div style="text-align: center; padding: 40px 20px;">
        <i class="fas fa-trophy" style="font-size: 3.5rem; color: #00b4d8; margin-bottom: 16px;"></i>
        <h3 style="color: #1a1a1a; margin-bottom: 8px;">Rankings Coming Soon</h3>
        <p style="color: #64748b;">Compete with classmates and climb the leaderboard.</p>
      </div>
    </div>
  `;
}

// ========================================
// TAB SWITCHING - WITH AUTO CLOSE SIDEBAR
// ========================================

function switchTab(tab) {
  if (isLoading) return;
  isLoading = true;
  currentTab = tab;
  
  // Update active states
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    }
  });
  
  // Close sidebar on mobile
  closeSidebar();
  
  // Update content
  if (tab === 'dashboard') { 
    updatePageTitle('Dashboard'); 
    renderDashboard(); 
    isLoading = false;
  }
  else if (tab === 'profile') { 
    updatePageTitle('My Profile'); 
    renderProfile().then(() => isLoading = false);
    return;
  }
  else if (tab === 'assignment') { 
    updatePageTitle('Assignments'); 
    renderAssignment(); 
    isLoading = false;
  }
  else if (tab === 'ranking') { 
    updatePageTitle('Ranking'); 
    renderRanking(); 
    isLoading = false;
  }
}

// ========================================
// AUTHENTICATION
// ========================================

async function initAuth() {
  const stored = localStorage.getItem("hydrofit_user");
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      document.getElementById("authModal").style.display = "none";
      updateUserStats();
      switchTab('dashboard');
    } catch(e) { 
      localStorage.removeItem("hydrofit_user"); 
    }
  }
}

// Login
document.getElementById("loginBtn")?.addEventListener("click", async (e) => {
  const btn = e.target;
  const schoolId = document.getElementById("loginSchoolId").value.trim();
  const password = document.getElementById("loginPassword").value;
  
  if (!schoolId || !password) {
    showToast("Please enter School ID and Password", true);
    return;
  }
  
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  
  const result = await callAPI("login", { schoolId, password });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    currentUser = result.user;
    localStorage.setItem("hydrofit_user", JSON.stringify(currentUser));
    document.getElementById("authModal").style.display = "none";
    updateUserStats();
    switchTab('dashboard');
    showToast(`Welcome back, ${currentUser.fullName.split(',')[0]}!`, false);
  } else {
    showToast(result.error || "Invalid School ID or Password", true);
  }
});

// Register
document.getElementById("registerBtn")?.addEventListener("click", async (e) => {
  const btn = e.target;
  const fullName = document.getElementById("regFullName").value.trim();
  const schoolId = document.getElementById("regSchoolId").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const program = document.getElementById("regProgram").value;
  const yearLevel = document.getElementById("regYearLevel").value;
  const section = document.getElementById("regSection").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  
  if (!fullName || !schoolId || !email || !program || !yearLevel || !section || !password) {
    showToast("Please fill in all fields", true);
    return;
  }
  
  if (password !== confirmPassword) {
    showToast("Passwords do not match", true);
    return;
  }
  
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
  
  const result = await callAPI("register", { fullName, schoolId, email, program, yearLevel, section, password });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast("Registration successful! Please login.", false);
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("loginSchoolId").value = schoolId;
  } else {
    showToast(result.error || "Registration failed", true);
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("hydrofit_user");
  currentUser = null;
  document.getElementById("authModal").style.display = "flex";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginSchoolId").value = "";
  document.getElementById("loginPassword").value = "";
  closeSidebar();
  showToast("Logged out successfully", false);
});

// Form toggles
document.getElementById("showRegister")?.addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
});

document.getElementById("showLogin")?.addEventListener("click", () => {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

// Mobile menu
document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
  
  if (window.innerWidth <= 768) {
    if (sidebar.classList.contains("open")) {
      const overlay = document.createElement('div');
      overlay.id = 'sidebarOverlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 199;
      `;
      overlay.addEventListener('click', closeSidebar);
      document.body.appendChild(overlay);
    } else {
      const overlay = document.getElementById("sidebarOverlay");
      if (overlay) overlay.remove();
    }
  }
});

// Nav button listeners - ALL close sidebar
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tab = btn.getAttribute('data-tab');
    switchTab(tab);
    // Close sidebar immediately
    closeSidebar();
  });
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("mobileMenuBtn");
    
    if (sidebar.classList.contains("open") && 
        !sidebar.contains(e.target) && 
        !menuBtn.contains(e.target)) {
      closeSidebar();
    }
  }
});

// Escape key closes sidebar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSidebar();
  }
});

// Initialize
window.switchTab = switchTab;
window.downloadQRCode = downloadQRCode;
window.closeSidebar = closeSidebar;
initAuth();

console.log("✅ HydroFit Loaded - Mobile Optimized with QR");