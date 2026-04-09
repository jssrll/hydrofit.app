// ========================================
// HYDROFIT - MAIN APPLICATION LOGIC (CLEAN VERSION)
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
// LOADING BUTTON FUNCTION
// ========================================

async function withLoading(button, asyncFunction) {
  if (!button) return await asyncFunction();
  
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  
  try {
    return await asyncFunction();
  } finally {
    button.disabled = false;
    button.innerHTML = originalText;
  }
}

// ========================================
// API CALL FUNCTION
// ========================================

async function callGoogleScript(action, data = {}) {
  try {
    const params = new URLSearchParams({ action, ...data });
    const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    
    console.log("📡 Calling API:", action);
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log("📦 Response:", result);
    return result;
  } catch (error) {
    console.error("❌ API Error:", error);
    return { success: false, error: error.message };
  }
}

// ========================================
// DASHBOARD PAGE
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
        <div class="goal-item">
          <div class="value">💪</div>
          <div class="label">Stay Active</div>
        </div>
        <div class="goal-item">
          <div class="value">📚</div>
          <div class="label">Learn & Grow</div>
        </div>
        <div class="goal-item">
          <div class="value">🏆</div>
          <div class="label">Excel</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h3><i class="fas fa-info-circle"></i> About HydroFit</h3>
      <p style="line-height: 1.6; margin: 16px 0;">
        HydroFit is an academic fitness tracking platform for Mindoro State University students. 
        Track your physical activities, log your fitness progress, and stay motivated throughout 
        your PathFit class journey.
      </p>
      <div class="flex-between">
        <span><i class="fas fa-calendar-check"></i> Active Semester: 2025-2026</span>
        <span><i class="fas fa-users"></i> PathFit Program</span>
      </div>
    </div>
  `;
  
  initSlideshow();
}

function initSlideshow() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  
  if (!slides.length || !dotsContainer) return;
  
  dotsContainer.innerHTML = '';
  
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  
  function goToSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
    slides[n].classList.add('active');
    const dots = document.querySelectorAll('.dot');
    if (dots[n]) dots[n].classList.add('active');
    currentSlide = n;
  }
  
  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }
  
  setInterval(nextSlide, 4000);
}

// ========================================
// PROFILE PAGE
// ========================================

async function renderProfile() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading profile...</div>`;
  
  const profileResult = await callGoogleScript("getProfile", { schoolId: currentUser.schoolId });
  if (profileResult.success) {
    currentUser = profileResult.user;
    localStorage.setItem("hydrofit_user", JSON.stringify(currentUser));
  }
  
  const programColors = {
    'BSIT': '#00b4d8',
    'BSED': '#48cae4',
    'BSHM': '#90e0ef',
    'BSTM': '#00b894',
    'BS PSYCHOLOGY': '#fdcb6e',
    'BSCRIM': '#e17055',
    'BTLED': '#6c5ce7',
    'BTVTED': '#a29bfe'
  };
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">
        <i class="fas fa-user-graduate"></i>
      </div>
      <h2>${escapeHtml(currentUser.fullName)}</h2>
      <p>PathFit Student</p>
      <span class="program-badge" style="background: ${programColors[currentUser.program] || '#00b4d8'}">${currentUser.program}</span>
      <div class="profile-info-grid">
        <div class="info-item">
          <label>School ID</label>
          <p>${currentUser.schoolId}</p>
        </div>
        <div class="info-item">
          <label>Email</label>
          <p>${currentUser.email}</p>
        </div>
        <div class="info-item">
          <label>Year Level</label>
          <p>${currentUser.yearLevel}</p>
        </div>
        <div class="info-item">
          <label>Section</label>
          <p>${currentUser.section}</p>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ========================================
// ASSIGNMENT PAGE (Disabled)
// ========================================

function renderAssignment() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="card">
      <div class="text-center" style="padding: 60px 20px;">
        <i class="fas fa-pen-ruler" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
        <h3>Assignments Coming Soon</h3>
        <p style="margin-top: 12px; color: #666;">Check back later for your PathFit assignments.</p>
      </div>
    </div>
  `;
}

// ========================================
// RANKING PAGE (Disabled)
// ========================================

function renderRanking() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="card">
      <div class="text-center" style="padding: 60px 20px;">
        <i class="fas fa-trophy" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
        <h3>Rankings Coming Soon</h3>
        <p style="margin-top: 12px; color: #666;">Class rankings will be available soon.</p>
      </div>
    </div>
  `;
}

// ========================================
// TAB SWITCHING
// ========================================

let isLoadingPage = false;

function switchTab(tab) {
  if (isLoadingPage) return;
  
  currentTab = tab;
  isLoadingPage = true;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    }
  });
  
  const container = document.getElementById("tabContent");
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;
  
  setTimeout(async () => {
    switch(tab) {
      case 'dashboard':
        updatePageTitle('Dashboard');
        renderDashboard();
        break;
      case 'profile':
        updatePageTitle('My Profile');
        await renderProfile();
        break;
      case 'assignment':
        updatePageTitle('Assignments');
        renderAssignment();
        break;
      case 'ranking':
        updatePageTitle('Ranking');
        renderRanking();
        break;
    }
    isLoadingPage = false;
  }, 50);
}

// ========================================
// AUTHENTICATION
// ========================================

async function initAuth() {
  const storedUser = localStorage.getItem("hydrofit_user");
  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
      document.getElementById("authModal").style.display = "none";
      updateUserStats();
      switchTab('dashboard');
      return;
    } catch(e) {
      localStorage.removeItem("hydrofit_user");
    }
  }
}

// Login handler
document.getElementById("loginBtn")?.addEventListener("click", async (e) => {
  const button = e.target;
  const schoolId = document.getElementById("loginSchoolId").value.trim();
  const password = document.getElementById("loginPassword").value;
  
  if (!schoolId || !password) {
    showToast("Please enter School ID and Password", true);
    return;
  }
  
  await withLoading(button, async () => {
    const result = await callGoogleScript("login", { schoolId, password });
    
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
});

// Register handler
document.getElementById("registerBtn")?.addEventListener("click", async (e) => {
  const button = e.target;
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
  
  await withLoading(button, async () => {
    const result = await callGoogleScript("register", {
      fullName,
      schoolId,
      email,
      program,
      yearLevel,
      section,
      password
    });
    
    if (result.success) {
      showToast("Registration successful! Please login.", false);
      document.getElementById("registerForm").style.display = "none";
      document.getElementById("loginForm").style.display = "block";
      document.getElementById("loginSchoolId").value = schoolId;
    } else {
      showToast(result.error || "Registration failed", true);
    }
  });
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
  document.getElementById("sidebar").classList.toggle("open");
});

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tab = btn.getAttribute('data-tab');
    switchTab(tab);
    if (window.innerWidth <= 768) {
      document.getElementById("sidebar").classList.remove("open");
    }
  });
});

window.switchTab = switchTab;
initAuth();