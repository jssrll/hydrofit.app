// ========================================
// HYDROFIT - MAIN APPLICATION LOGIC
// Dashboard, Profile, Assignment, Ranking
// ========================================

let currentTab = "dashboard";
let activityChart = null;

// ========================================
// UTILITY FUNCTIONS
// ========================================

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = isError ? "var(--danger)" : "var(--darker)";
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
    document.getElementById("userNameDisplay").innerHTML = `<i class="fas fa-user"></i> ${currentUser.fullName.split(" ")[0]}`;
    document.getElementById("hydrationPoints").innerText = currentUser.hydrationPoints || 0;
  }
}

// ========================================
// DASHBOARD PAGE
// ========================================

function renderDashboard() {
  const container = document.getElementById("tabContent");
  
  const hydrationPercent = (hydrationData.daily.current / hydrationData.daily.target) * 100;
  
  container.innerHTML = `
    <!-- Slideshow Banner -->
    <div class="slideshow-wrapper">
      <div class="slideshow-container" id="slideshowContainer">
        <div class="slide active slide-placeholder">🏃‍♂️ Daily Workout Challenge</div>
        <div class="slide slide-placeholder">💧 Drink 8 Glasses Today!</div>
        <div class="slide slide-placeholder">🎯 Reach Your Fitness Goals</div>
        <div class="slide-dots" id="slideDots"></div>
      </div>
      <div class="slideshow-overlay">
        <div class="school-badge">
          <div class="school-text">
            <strong>📚 Academic Year 2025-2026</strong>
            <span>Physical Education Department</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Hydration Card -->
    <div class="card-grid">
      <div class="card">
        <h3><i class="fas fa-tint"></i> Daily Hydration</h3>
        <div class="flex-between">
          <span>Progress: ${hydrationData.daily.current}/${hydrationData.daily.target} ${hydrationData.daily.unit}</span>
          <span class="badge">${hydrationPercent}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${hydrationPercent}%"></div>
        </div>
        <div class="flex-between mt-4">
          <span>🔥 Current Streak: ${hydrationData.streak} days</span>
          <button class="btn btn-sm" onclick="addWater()"><i class="fas fa-plus"></i> Log Water</button>
        </div>
        <div class="badge-list">
          ${hydrationData.badges.map(badge => `<span class="badge">🏅 ${badge}</span>`).join('')}
        </div>
      </div>

      <!-- Workout Summary -->
      <div class="card">
        <h3><i class="fas fa-heartbeat"></i> Today's Workout</h3>
        ${workoutSessions.map(session => `
          <div class="flex-between" style="margin: 12px 0;">
            <span>
              <i class="fas ${session.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
              <strong>${session.name}</strong>
              <small>(${session.duration})</small>
            </span>
            <span>🔥 ${session.calories} cal</span>
          </div>
        `).join('')}
        <button class="btn btn-outline btn-sm mt-4" onclick="startWorkout()">
          <i class="fas fa-play"></i> Start Workout
        </button>
      </div>

      <!-- Activity Chart -->
      <div class="card">
        <h3><i class="fas fa-chart-line"></i> Weekly Activity</h3>
        <div class="chart-container">
          <canvas id="activityChart"></canvas>
        </div>
      </div>
    </div>
  `;
  
  initSlideshow();
  initActivityChart();
}

function initSlideshow() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  
  if (!slides.length) return;
  
  // Create dots
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
    document.querySelectorAll('.dot')[n].classList.add('active');
    currentSlide = n;
  }
  
  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }
  
  setInterval(nextSlide, 4000);
  window.goToSlide = goToSlide;
}

function initActivityChart() {
  const ctx = document.getElementById('activityChart');
  if (!ctx) return;
  
  if (activityChart) activityChart.destroy();
  
  activityChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Hydration (glasses)',
        data: hydrationData.weekly,
        borderColor: '#00b4d8',
        backgroundColor: 'rgba(0, 180, 216, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function addWater() {
  if (hydrationData.daily.current < hydrationData.daily.target) {
    hydrationData.daily.current++;
    showToast("💧 +1 glass of water! Keep going!", false);
    renderDashboard();
    // Add points to user
    if (currentUser) {
      currentUser.hydrationPoints = (currentUser.hydrationPoints || 0) + 10;
      updateUserStats();
      showToast("✨ +10 Hydration Points earned!", false);
    }
  } else {
    showToast("🎉 You've reached your daily goal!", false);
  }
}

function startWorkout() {
  showToast("🏋️ Starting workout session... Track your progress!", false);
}

// ========================================
// PROFILE PAGE
// ========================================

function renderProfile() {
  const container = document.getElementById("tabContent");
  
  const userRank = classRanking.findIndex(u => u.phone === currentUser?.phone) + 1;
  const rankName = userRank ? (userRank === 1 ? "🥇 Gold" : userRank === 2 ? "🥈 Silver" : userRank === 3 ? "🥉 Bronze" : "⭐ Student") : "⭐ Student";
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar">
        <i class="fas fa-user-graduate"></i>
      </div>
      <h2>${currentUser?.fullName || "Student"}</h2>
      <p>${rankName} Athlete</p>
      <div class="profile-info-grid">
        <div class="info-item">
          <label>Student ID</label>
          <p>${currentUser?.studentId || "2024-001"}</p>
        </div>
        <div class="info-item">
          <label>Phone Number</label>
          <p>${currentUser?.phone || "09123456789"}</p>
        </div>
        <div class="info-item">
          <label>Hydration Points</label>
          <p>${currentUser?.hydrationPoints || 0} HP</p>
        </div>
        <div class="info-item">
          <label>Global Rank</label>
          <p>#${userRank || "N/A"}</p>
        </div>
        <div class="info-item">
          <label>Class Section</label>
          <p>BSIT-3A</p>
        </div>
        <div class="info-item">
          <label>Member Since</label>
          <p>2025</p>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h3><i class="fas fa-medal"></i> Achievements</h3>
      <div class="badge-list">
        <span class="badge">🏅 7-Day Streak</span>
        <span class="badge">💧 Hydration Master</span>
        <span class="badge">🏃 Workout Warrior</span>
        <span class="badge">📚 Academic Excellence</span>
        <span class="badge">🎯 Goal Crusher</span>
      </div>
    </div>
    
    <div class="card">
      <h3><i class="fas fa-history"></i> Recent Activity</h3>
      <div class="leaderboard-item">
        <span><i class="fas fa-tint"></i> Logged water</span>
        <span>2 hours ago</span>
      </div>
      <div class="leaderboard-item">
        <span><i class="fas fa-running"></i> Completed morning run</span>
        <span>Yesterday</span>
      </div>
      <div class="leaderboard-item">
        <span><i class="fas fa-check-circle"></i> Submitted assignment</span>
        <span>2 days ago</span>
      </div>
    </div>
  `;
}

// ========================================
// ASSIGNMENT PAGE
// ========================================

function renderAssignment() {
  const container = document.getElementById("tabContent");
  
  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const submittedAssignments = assignments.filter(a => a.status === "submitted" || a.status === "completed");
  
  container.innerHTML = `
    <div class="card-grid">
      <!-- Pending Assignments -->
      <div class="card">
        <h3><i class="fas fa-clock"></i> Pending Tasks</h3>
        ${pendingAssignments.length === 0 ? '<p>No pending assignments! 🎉</p>' : 
          pendingAssignments.map(assignment => `
            <div style="border-bottom: 1px solid var(--gray); padding: 12px 0;">
              <div class="flex-between">
                <strong>${assignment.title}</strong>
                <span class="badge">Due: ${assignment.dueDate}</span>
              </div>
              <p style="font-size: 0.8rem; color: #666; margin: 6px 0;">${assignment.subject}</p>
              <p style="font-size: 0.85rem;">${assignment.description}</p>
              <div class="flex-between mt-2">
                <span>🏆 ${assignment.points} points</span>
                <button class="btn btn-sm" onclick="submitAssignment(${assignment.id})">
                  <i class="fas fa-paper-plane"></i> Submit
                </button>
              </div>
            </div>
          `).join('')
        }
      </div>
      
      <!-- Completed Assignments -->
      <div class="card">
        <h3><i class="fas fa-check-circle"></i> Completed</h3>
        ${submittedAssignments.length === 0 ? '<p>No completed assignments yet.</p>' :
          submittedAssignments.map(assignment => `
            <div style="border-bottom: 1px solid var(--gray); padding: 12px 0;">
              <div class="flex-between">
                <strong>${assignment.title}</strong>
                <span class="badge" style="background: #00b894; color: white;">✓ Done</span>
              </div>
              <p style="font-size: 0.8rem; color: #666;">${assignment.subject}</p>
              <div class="flex-between mt-2">
                <span>🏆 ${assignment.points} points earned</span>
                ${assignment.score ? `<span>Score: ${assignment.score}%</span>` : ''}
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
    
    <!-- QR Attendance Card -->
    <div class="card" style="margin-top: 20px;">
      <h3><i class="fas fa-qrcode"></i> QR Attendance System</h3>
      <p>Scan the class QR code to mark your attendance and earn points!</p>
      <button class="btn" onclick="openQrScanner()" style="margin-top: 16px;">
        <i class="fas fa-camera"></i> Scan QR Code
      </button>
    </div>
  `;
}

function submitAssignment(id) {
  const assignment = assignments.find(a => a.id === id);
  if (assignment) {
    assignment.status = "submitted";
    showToast(`✅ "${assignment.title}" submitted! +${assignment.points} points`, false);
    if (currentUser) {
      currentUser.hydrationPoints = (currentUser.hydrationPoints || 0) + assignment.points;
      updateUserStats();
      renderAssignment();
    }
  }
}

function openQrScanner() {
  const modal = document.getElementById("qrModal");
  modal.style.display = "flex";
  
  // Simulate QR scan (academic QR code)
  setTimeout(() => {
    const resultDiv = document.getElementById("qr-result");
    resultDiv.innerHTML = `
      <div style="text-align: center; padding: 16px; background: var(--light); border-radius: 12px;">
        <i class="fas fa-check-circle" style="color: var(--success); font-size: 2rem;"></i>
        <p style="margin-top: 8px;">✅ Attendance marked for PE Class!</p>
        <p><strong>+50 Hydration Points</strong></p>
      </div>
    `;
    if (currentUser) {
      currentUser.hydrationPoints = (currentUser.hydrationPoints || 0) + 50;
      updateUserStats();
    }
    setTimeout(() => {
      resultDiv.innerHTML = "";
    }, 3000);
  }, 2000);
}

// ========================================
// RANKING PAGE
// ========================================

function renderRanking() {
  const container = document.getElementById("tabContent");
  
  // Get current user's rank
  const currentUserRank = classRanking.findIndex(u => u.phone === currentUser?.phone) + 1;
  
  container.innerHTML = `
    <!-- User's Current Rank Card -->
    <div class="profile-card" style="background: linear-gradient(135deg, var(--primary), var(--dark)); margin-bottom: 24px;">
      <h2>Your Current Rank</h2>
      <div style="font-size: 4rem; font-weight: 800; margin: 16px 0;">#${currentUserRank || "N/A"}</div>
      <p>${currentUserRank === 1 ? "🥇 Top of the Class!" : currentUserRank <= 3 ? "🎖️ Top Performer" : "💪 Keep Going!"}</p>
      <div style="margin-top: 16px;">
        <span class="badge" style="background: rgba(255,255,255,0.2);">HP: ${currentUser?.hydrationPoints || 0}</span>
      </div>
    </div>
    
    <!-- Individual Leaderboard -->
    <div class="ranking-section">
      <h3><i class="fas fa-users"></i> Individual Rankings</h3>
      <div style="overflow-x: auto;">
        <table class="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Hydration Points</th>
            </tr>
          </thead>
          <tbody>
            ${classRanking.map(student => `
              <tr ${currentUser?.phone === student.phone ? 'class="tied-rank"' : ''}>
                <td>${student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : student.rank === 3 ? '🥉' : `#${student.rank}`}</td>
                <td><strong>${student.name}</strong> ${currentUser?.phone === student.phone ? '(You)' : ''}</td>
                <td>${student.studentId}</td>
                <td>🏆 ${student.hydrationPoints} HP</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Section Rankings -->
    <div class="ranking-section">
      <h3><i class="fas fa-school"></i> Class Section Rankings</h3>
      <div style="overflow-x: auto;">
        <table class="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Section</th>
              <th>Average Points</th>
              <th>Students</th>
            </tr>
          </thead>
          <tbody>
            ${sectionRanking.map(section => `
              <tr>
                <td>${section.rank === 1 ? '🏆' : `#${section.rank}`}</td>
                <td><strong>${section.section}</strong></td>
                <td>📊 ${section.averagePoints} HP</td>
                <td>👥 ${section.studentCount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ========================================
// TAB SWITCHING
// ========================================

function switchTab(tab) {
  currentTab = tab;
  
  // Update active button
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    }
  });
  
  // Render content
  switch(tab) {
    case 'dashboard':
      updatePageTitle('Dashboard');
      renderDashboard();
      break;
    case 'profile':
      updatePageTitle('My Profile');
      renderProfile();
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
}

// ========================================
// AUTHENTICATION
// ========================================

function initAuth() {
  const storedUser = loadStoredUser();
  if (storedUser) {
    currentUser = storedUser;
    document.getElementById("authModal").style.display = "none";
    updateUserStats();
    switchTab('dashboard');
  } else {
    document.getElementById("authModal").style.display = "flex";
  }
}

document.getElementById("loginBtn")?.addEventListener("click", () => {
  const phone = document.getElementById("loginPhone").value;
  const password = document.getElementById("loginPassword").value;
  
  const user = authenticateUser(phone, password);
  if (user) {
    currentUser = user;
    setCurrentUser(user);
    document.getElementById("authModal").style.display = "none";
    updateUserStats();
    switchTab('dashboard');
    showToast(`Welcome back, ${user.fullName}!`, false);
  } else {
    showToast("Invalid phone number or password", true);
  }
});

document.getElementById("showRegister")?.addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
});

document.getElementById("showLogin")?.addEventListener("click", () => {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

document.getElementById("registerBtn")?.addEventListener("click", () => {
  const fullName = document.getElementById("regFullName").value;
  const phone = document.getElementById("regPhone").value;
  const password = document.getElementById("regPassword").value;
  const studentId = document.getElementById("regStudentId").value;
  
  if (!fullName || !phone || !password || !studentId) {
    showToast("Please fill in all fields", true);
    return;
  }
  
  // Check if user exists
  const existing = usersDB.find(u => u.phone === phone);
  if (existing) {
    showToast("Phone number already registered", true);
    return;
  }
  
  // Create new user
  const newUser = {
    id: usersDB.length + 1,
    fullName: fullName,
    phone: phone,
    password: password,
    studentId: studentId,
    hydrationPoints: 100,
    rank: usersDB.length + 1,
    avatar: fullName.split(" ").map(n => n[0]).join("")
  };
  
  usersDB.push(newUser);
  classRanking.push({
    rank: classRanking.length + 1,
    name: fullName,
    hydrationPoints: 100,
    studentId: studentId,
    phone: phone,
    class: "BSIT-3A"
  });
  
  currentUser = newUser;
  setCurrentUser(newUser);
  document.getElementById("authModal").style.display = "none";
  updateUserStats();
  switchTab('dashboard');
  showToast(`Welcome to HydroFit, ${fullName}!`, false);
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  setCurrentUser(null);
  currentUser = null;
  document.getElementById("authModal").style.display = "flex";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginPhone").value = "";
  document.getElementById("loginPassword").value = "";
});

document.getElementById("closeQrModal")?.addEventListener("click", () => {
  document.getElementById("qrModal").style.display = "none";
  document.getElementById("qr-result").innerHTML = "";
});

// ========================================
// MOBILE MENU
// ========================================

document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tab = btn.getAttribute('data-tab');
    switchTab(tab);
    // Close mobile menu on click
    if (window.innerWidth <= 768) {
      document.getElementById("sidebar").classList.remove("open");
    }
  });
});

// ========================================
// INITIALIZATION
// ========================================

// Make functions globally available
window.addWater = addWater;
window.startWorkout = startWorkout;
window.submitAssignment = submitAssignment;
window.openQrScanner = openQrScanner;
window.renderDashboard = renderDashboard;
window.renderProfile = renderProfile;
window.renderAssignment = renderAssignment;
window.renderRanking = renderRanking;
window.switchTab = switchTab;

// Start the app
initAuth();