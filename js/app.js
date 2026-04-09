// ========================================
// HYDROFIT - SMOOTH ANIMATIONS & ENHANCED UI
// ========================================

let currentTab = "dashboard";
let currentUser = null;
let isLoading = false;

// Toast notification function
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = isError 
    ? "linear-gradient(135deg, #d63031, #e17055)" 
    : "linear-gradient(135deg, #03045e, #023e8a)";
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="margin-right: 8px;"></i> ${message}`;
  
  // Animate out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      toast.style.display = "none";
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 300);
  }, 3000);
}

function updatePageTitle(title) {
  const titleEl = document.getElementById("pageTitle");
  titleEl.style.opacity = '0';
  titleEl.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    titleEl.innerText = title;
    titleEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    titleEl.style.opacity = '1';
    titleEl.style.transform = 'translateY(0)';
  }, 150);
}

function updateUserStats() {
  if (currentUser) {
    const lastName = currentUser.fullName.split(',')[0];
    const displayEl = document.getElementById("userNameDisplay");
    displayEl.style.opacity = '0';
    
    setTimeout(() => {
      displayEl.innerHTML = `<i class="fas fa-user"></i> ${lastName}`;
      displayEl.style.transition = 'opacity 0.3s ease';
      displayEl.style.opacity = '1';
    }, 100);
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
          <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/images%20(4).jpg?updatedAt=1775655891511" alt="MinSU Logo">
          <div class="school-text">
            <strong>Mindoro State University</strong>
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
      <p style="line-height: 1.8; margin: 16px 0; color: #1a1a1a; font-size: 1rem;">
        HydroFit is an academic fitness tracking platform designed specifically for Mindoro State University students. 
        Track your PathFit activities, monitor your progress, and achieve your fitness goals while excelling in your academic journey.
      </p>
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <span style="background: #e0f2fe; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; color: #023e8a;">
          <i class="fas fa-check-circle" style="color: #00b894;"></i> Track Activities
        </span>
        <span style="background: #e0f2fe; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; color: #023e8a;">
          <i class="fas fa-check-circle" style="color: #00b894;"></i> Monitor Progress
        </span>
        <span style="background: #e0f2fe; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; color: #023e8a;">
          <i class="fas fa-check-circle" style="color: #00b894;"></i> Earn Badges
        </span>
      </div>
    </div>
  `;
  
  initSlideshow();
  
  // Animate cards on load
  setTimeout(() => {
    document.querySelectorAll('.card, .goals-card').forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 50);
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
      <span class="program-badge" style="background: ${programColors[currentUser.program] || '#00b4d8'}; color: white !important;">${currentUser.program}</span>
      <div class="profile-info-grid">
        <div class="info-item"><label>School ID</label><p>${currentUser.schoolId}</p></div>
        <div class="info-item"><label>Email</label><p>${currentUser.email}</p></div>
        <div class="info-item"><label>Year Level</label><p>${currentUser.yearLevel}${getYearSuffix(currentUser.yearLevel)} Year</p></div>
        <div class="info-item"><label>Section</label><p>${currentUser.section}</p></div>
      </div>
    </div>
    
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Academic Progress</h3>
      <p style="color: #64748b; margin: 16px 0;">Track your PathFit performance and achievements throughout the semester.</p>
      <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center;">
        <i class="fas fa-trophy" style="font-size: 3rem; color: #fdcb6e; margin-bottom: 12px;"></i>
        <p style="color: #1a1a1a; font-weight: 600;">Coming Soon!</p>
        <p style="color: #64748b; font-size: 0.9rem;">Activity tracking will be available in the next update.</p>
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
      <div style="text-align: center; padding: 60px 20px;">
        <i class="fas fa-pen-ruler" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
        <h3 style="color: #1a1a1a; margin-bottom: 12px;">Assignments Coming Soon</h3>
        <p style="color: #64748b;">Track your PathFit assignments and written outputs here.</p>
      </div>
    </div>
  `;
}

function renderRanking() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `
    <div class="card">
      <div style="text-align: center; padding: 60px 20px;">
        <i class="fas fa-trophy" style="font-size: 4rem; color: var(--primary); margin-bottom: 20px;"></i>
        <h3 style="color: #1a1a1a; margin-bottom: 12px;">Rankings Coming Soon</h3>
        <p style="color: #64748b;">Compete with classmates and climb the leaderboard.</p>
      </div>
    </div>
  `;
}

// ========================================
// TAB SWITCHING WITH SMOOTH ANIMATIONS
// ========================================

function switchTab(tab) {
  if (isLoading) return;
  isLoading = true;
  currentTab = tab;
  
  // Update active states with smooth animation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    }
  });
  
  const content = document.getElementById("tabContent");
  
  // Fade out animation
  content.style.opacity = '0';
  content.style.transform = 'translateY(10px)';
  content.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  
  setTimeout(async () => {
    // Update content
    if (tab === 'dashboard') { 
      updatePageTitle('Dashboard'); 
      renderDashboard(); 
    }
    else if (tab === 'profile') { 
      updatePageTitle('My Profile'); 
      await renderProfile(); 
    }
    else if (tab === 'assignment') { 
      updatePageTitle('Assignments'); 
      renderAssignment(); 
    }
    else if (tab === 'ranking') { 
      updatePageTitle('Ranking'); 
      renderRanking(); 
    }
    
    // Fade in animation
    setTimeout(() => {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 50);
    
    isLoading = false;
  }, 200);
  
  // Close sidebar on mobile after tab switch
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar.classList.remove("open");
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
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
    
    // Smooth modal close
    const modal = document.getElementById("authModal");
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = "none";
      updateUserStats();
      switchTab('dashboard');
      showToast(`Welcome back, ${currentUser.fullName.split(',')[0]}!`, false);
    }, 300);
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
    
    // Smooth form switch
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    
    registerForm.style.opacity = '0';
    registerForm.style.transform = 'translateX(-20px)';
    registerForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      registerForm.style.display = "none";
      loginForm.style.display = "block";
      loginForm.style.opacity = '0';
      loginForm.style.transform = 'translateX(20px)';
      loginForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        loginForm.style.opacity = '1';
        loginForm.style.transform = 'translateX(0)';
      }, 10);
      
      document.getElementById("loginSchoolId").value = schoolId;
    }, 200);
  } else {
    showToast(result.error || "Registration failed", true);
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("hydrofit_user");
  currentUser = null;
  
  const modal = document.getElementById("authModal");
  modal.style.display = "flex";
  modal.style.opacity = '0';
  
  setTimeout(() => {
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.opacity = '1';
  }, 10);
  
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginSchoolId").value = "";
  document.getElementById("loginPassword").value = "";
  showToast("Logged out successfully", false);
});

// Form toggles with smooth animations
document.getElementById("showRegister")?.addEventListener("click", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  
  loginForm.style.opacity = '0';
  loginForm.style.transform = 'translateX(-20px)';
  loginForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  setTimeout(() => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    registerForm.style.opacity = '0';
    registerForm.style.transform = 'translateX(20px)';
    registerForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      registerForm.style.opacity = '1';
      registerForm.style.transform = 'translateX(0)';
    }, 10);
  }, 200);
});

document.getElementById("showLogin")?.addEventListener("click", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  
  registerForm.style.opacity = '0';
  registerForm.style.transform = 'translateX(20px)';
  registerForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  setTimeout(() => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    loginForm.style.opacity = '0';
    loginForm.style.transform = 'translateX(-20px)';
    loginForm.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    setTimeout(() => {
      loginForm.style.opacity = '1';
      loginForm.style.transform = 'translateX(0)';
    }, 10);
  }, 200);
});

// Mobile menu with smooth animation and overlay
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
        backdrop-filter: blur(4px);
        z-index: 199;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(overlay);
      
      setTimeout(() => overlay.style.opacity = '1', 10);
      
      overlay.addEventListener('click', () => {
        sidebar.classList.remove("open");
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      });
    } else {
      const overlay = document.getElementById("sidebarOverlay");
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }
    }
  }
});

// Nav button listeners
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.getAttribute('data-tab'));
  });
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("mobileMenuBtn");
    
    if (sidebar.classList.contains("open") && 
        !sidebar.contains(e.target) && 
        !menuBtn.contains(e.target)) {
      sidebar.classList.remove("open");
      const overlay = document.getElementById("sidebarOverlay");
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }
    }
  }
});

// Initialize
window.switchTab = switchTab;
initAuth();

// Add escape key to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
      const overlay = document.getElementById("sidebarOverlay");
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
      }
    }
  }
});

console.log("✅ HydroFit Loaded - Smooth Animations Active");