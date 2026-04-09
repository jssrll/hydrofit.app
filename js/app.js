// ========================================
// HYDROFIT - SIMPLE WORKING VERSION
// ========================================

let currentTab = "dashboard";
let currentUser = null;

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = isError ? "#d63031" : "#03045e";
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> ${message}`;
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

// ========================================
// API CALL
// ========================================

async function callAPI(action, data = {}) {
  try {
    const params = new URLSearchParams({ action, ...data });
    const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    console.log("Calling:", url);
    
    const response = await fetch(url);
    const result = await response.json();
    console.log("Response:", result);
    return result;
  } catch(error) {
    console.error("Error:", error);
    return { success: false, error: error.message };
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
          <div class="school-text">
            <strong>🏫 Mindoro State University</strong>
            <span>PathFit Class</span>
          </div>
        </div>
      </div>
    </div>

    <div class="goals-card">
      <h2>🎯 Welcome to HydroFit</h2>
      <p>Your Academic Fitness Tracker for PathFit Class</p>
      <div class="goals-stats">
        <div class="goal-item"><div class="value">💪</div><div class="label">Stay Active</div></div>
        <div class="goal-item"><div class="value">📚</div><div class="label">Learn & Grow</div></div>
        <div class="goal-item"><div class="value">🏆</div><div class="label">Excel</div></div>
      </div>
    </div>

    <div class="card">
      <h3><i class="fas fa-info-circle"></i> About HydroFit</h3>
      <p style="line-height: 1.6; margin: 16px 0;">
        HydroFit is an academic fitness tracking platform for Mindoro State University students.
      </p>
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
    if (document.querySelectorAll('.dot')[n]) document.querySelectorAll('.dot')[n].classList.add('active');
    currentSlide = n;
  }
  
  setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, 4000);
}

// ========================================
// PROFILE PAGE
// ========================================

async function renderProfile() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading profile...</div>`;
  
  const result = await callAPI("getProfile", { schoolId: currentUser.schoolId });
  if (result.success) {
    currentUser = result.user;
    localStorage.setItem("hydrofit_user", JSON.stringify(currentUser));
  }
  
  const programColors = {
    'BSIT': '#00b4d8', 'BSED': '#48cae4', 'BSHM': '#90e0ef', 'BSTM': '#00b894',
    'BS PSYCHOLOGY': '#fdcb6e', 'BSCRIM': '#e17055', 'BTLED': '#6c5ce7', 'BTVTED': '#a29bfe'
  };
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar"><i class="fas fa-user-graduate"></i></div>
      <h2>${escapeHtml(currentUser.fullName)}</h2>
      <p>PathFit Student</p>
      <span class="program-badge" style="background: ${programColors[currentUser.program] || '#00b4d8'}">${currentUser.program}</span>
      <div class="profile-info-grid">
        <div class="info-item"><label>School ID</label><p>${currentUser.schoolId}</p></div>
        <div class="info-item"><label>Email</label><p>${currentUser.email}</p></div>
        <div class="info-item"><label>Year Level</label><p>${currentUser.yearLevel}</p></div>
        <div class="info-item"><label>Section</label><p>${currentUser.section}</p></div>
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

// ========================================
// ASSIGNMENT & RANKING (Disabled)
// ========================================

function renderAssignment() {
  document.getElementById("tabContent").innerHTML = `
    <div class="card"><div class="text-center" style="padding: 60px 20px;">
      <i class="fas fa-pen-ruler" style="font-size: 4rem; color: var(--primary);"></i>
      <h3>Assignments Coming Soon</h3>
    </div></div>`;
}

function renderRanking() {
  document.getElementById("tabContent").innerHTML = `
    <div class="card"><div class="text-center" style="padding: 60px 20px;">
      <i class="fas fa-trophy" style="font-size: 4rem; color: var(--primary);"></i>
      <h3>Rankings Coming Soon</h3>
    </div></div>`;
}

// ========================================
// TAB SWITCHING
// ========================================

let isLoading = false;

function switchTab(tab) {
  if (isLoading) return;
  isLoading = true;
  currentTab = tab;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) btn.classList.add('active');
  });
  
  document.getElementById("tabContent").innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;
  
  setTimeout(async () => {
    if (tab === 'dashboard') { updatePageTitle('Dashboard'); renderDashboard(); }
    else if (tab === 'profile') { updatePageTitle('My Profile'); await renderProfile(); }
    else if (tab === 'assignment') { updatePageTitle('Assignments'); renderAssignment(); }
    else if (tab === 'ranking') { updatePageTitle('Ranking'); renderRanking(); }
    isLoading = false;
  }, 50);
}

// ========================================
// LOGIN & REGISTER
// ========================================

async function initAuth() {
  const stored = localStorage.getItem("hydrofit_user");
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      document.getElementById("authModal").style.display = "none";
      updateUserStats();
      switchTab('dashboard');
    } catch(e) { localStorage.removeItem("hydrofit_user"); }
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
    showToast(`Welcome, ${currentUser.fullName.split(',')[0]}!`, false);
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
  showToast("Logged out", false);
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
  document.getElementById("sidebar").classList.toggle("open");
});

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.getAttribute('data-tab'));
    if (window.innerWidth <= 768) document.getElementById("sidebar").classList.remove("open");
  });
});

window.switchTab = switchTab;
initAuth();