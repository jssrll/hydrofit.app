// app.js - HYDROFIT Complete Application

// Global variables
let currentUser = null;
let timerInterval = null;
let activeChart = null;

// Default user data structure
let userData = {
  points: 0,
  level: 1,
  badges: [],
  assessments: [],
  movementScores: {},
  attendance: [],
  habitStreak: 0,
  lastWorkoutDate: null,
  calorieLogs: [],
  bmiHistory: [],
  heartLogs: [],
  goals: [],
  bodyTypeResult: null,
  attendanceRecords: []
};

// DOM Elements
const contentDiv = document.getElementById('tab-content');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const profileModal = document.getElementById('profileModal');

// Helper Functions
function showToast(msg, isError = false) {
  let toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = isError ? '#d63031' : '#2d3436';
  toast.style.color = 'white';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '40px';
  toast.style.zIndex = '9999';
  toast.style.fontWeight = 'bold';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  toast.style.animation = 'slideInRight 0.3s ease';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function playBeep() {
  let audio = document.getElementById('alertSound');
  if(audio) audio.play().catch(e=>console.log);
}

function updateUIStats() {
  document.getElementById('pointsDisplay').innerText = userData.points;
  let lvl = Math.floor(userData.points / 500) + 1;
  if(lvl < 1) lvl = 1;
  userData.level = lvl;
  document.getElementById('levelDisplay').innerText = userData.level;
}

function saveUserData() {
  if (currentUser) {
    localStorage.setItem(`hydrofit_${currentUser.schoolId}`, JSON.stringify(userData));
    // Also update points in accounts list
    const users = JSON.parse(localStorage.getItem('hydrofit_accounts') || '[]');
    const userIndex = users.findIndex(u => u.schoolId === currentUser.schoolId);
    if (userIndex !== -1) {
      users[userIndex].points = userData.points;
      users[userIndex].level = userData.level;
      localStorage.setItem('hydrofit_accounts', JSON.stringify(users));
    }
  }
  updateUIStats();
}

function awardPoints(pts, reason) {
  userData.points += pts;
  saveUserData();
  showToast(`+${pts} pts! ${reason || ''}`);
  checkLevelUp();
}

function checkLevelUp() {
  let newLvl = Math.floor(userData.points / 500) + 1;
  if(newLvl > userData.level) {
    userData.level = newLvl;
    showToast(`🎉 LEVEL UP! You are now level ${newLvl}!`);
    saveUserData();
  }
}

// ============ LOGIN / REGISTRATION ============

async function login(schoolId, password) {
  if (!schoolId || !password) {
    showToast('Please enter School ID and Password', true);
    return false;
  }
  
  // First try API if configured
  if (typeof CONFIG !== 'undefined' && CONFIG.API_URL && CONFIG.API_URL.includes('script.google.com')) {
    try {
      const result = await loginUser(schoolId, password);
      if (result && result.success) {
        currentUser = {
          schoolId: result.schoolId,
          fullName: result.fullName,
          program: result.program,
          subject: result.subject,
          points: result.points || 0,
          level: result.level || 1
        };
        
        localStorage.setItem('hydrofit_current_user', JSON.stringify(currentUser));
        
        const stored = localStorage.getItem(`hydrofit_${currentUser.schoolId}`);
        if (stored) {
          userData = JSON.parse(stored);
        } else {
          userData = {
            points: currentUser.points || 0,
            level: currentUser.level || 1,
            badges: [],
            assessments: [],
            attendance: [],
            habitStreak: 0,
            calorieLogs: [],
            bmiHistory: [],
            heartLogs: [],
            goals: [],
            attendanceRecords: []
          };
        }
        
        updateUIStats();
        loginModal.style.display = 'none';
        showToast(`✅ Welcome ${result.fullName}!`);
        switchTab('dashboard');
        return true;
      } else {
        showToast(result?.message || 'Invalid School ID or Password', true);
        return false;
      }
    } catch (error) {
      console.error('API login error:', error);
      // Fall back to localStorage
    }
  }
  
  // Fallback to localStorage
  const users = JSON.parse(localStorage.getItem('hydrofit_accounts') || '[]');
  const user = users.find(u => u.schoolId === schoolId && u.password === password);
  
  if (user) {
    currentUser = {
      schoolId: user.schoolId,
      fullName: user.fullName,
      program: user.program,
      subject: user.subject,
      points: user.points || 0,
      level: user.level || 1
    };
    
    localStorage.setItem('hydrofit_current_user', JSON.stringify(currentUser));
    
    const stored = localStorage.getItem(`hydrofit_${currentUser.schoolId}`);
    if (stored) {
      userData = JSON.parse(stored);
    } else {
      userData = {
        points: currentUser.points || 0,
        level: currentUser.level || 1,
        badges: [],
        assessments: [],
        attendance: [],
        habitStreak: 0,
        calorieLogs: [],
        bmiHistory: [],
        heartLogs: [],
        goals: [],
        attendanceRecords: []
      };
    }
    
    updateUIStats();
    loginModal.style.display = 'none';
    showToast(`✅ Welcome ${user.fullName}!`);
    switchTab('dashboard');
    return true;
  }
  
  showToast('Invalid School ID or Password', true);
  return false;
}

async function register(registrationData) {
  // Validate
  if (!registrationData.fullName) {
    showToast('Please enter your full name', true);
    return false;
  }
  if (!registrationData.schoolId) {
    showToast('Please enter your School ID', true);
    return false;
  }
  if (!registrationData.program) {
    showToast('Please select your program', true);
    return false;
  }
  if (!registrationData.password) {
    showToast('Please enter a password', true);
    return false;
  }
  if (registrationData.password !== registrationData.confirmPassword) {
    showToast('Passwords do not match', true);
    return false;
  }
  
  // Try API first
  if (typeof CONFIG !== 'undefined' && CONFIG.API_URL && CONFIG.API_URL.includes('script.google.com')) {
    try {
      const result = await registerUser(registrationData);
      if (result && result.success) {
        showToast('✅ Registration successful! Please login.');
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
        
        // Clear form
        document.getElementById('regFullName').value = '';
        document.getElementById('regSchoolId').value = '';
        document.getElementById('regSubject').value = '';
        document.getElementById('regProgram').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regConfirmPassword').value = '';
        return true;
      } else {
        showToast(result?.message || 'Registration failed', true);
        return false;
      }
    } catch (error) {
      console.error('API register error:', error);
    }
  }
  
  // Fallback to localStorage
  const users = JSON.parse(localStorage.getItem('hydrofit_accounts') || '[]');
  
  if (users.some(u => u.schoolId === registrationData.schoolId)) {
    showToast('School ID already exists', true);
    return false;
  }
  
  const newUser = {
    schoolId: registrationData.schoolId,
    password: registrationData.password,
    fullName: registrationData.fullName,
    program: registrationData.program,
    subject: registrationData.subject || 'Pathfit',
    points: 0,
    level: 1,
    registeredAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('hydrofit_accounts', JSON.stringify(users));
  
  showToast('✅ Registration successful! Please login.');
  registerModal.style.display = 'none';
  loginModal.style.display = 'flex';
  
  // Clear form
  document.getElementById('regFullName').value = '';
  document.getElementById('regSchoolId').value = '';
  document.getElementById('regSubject').value = '';
  document.getElementById('regProgram').value = '';
  document.getElementById('regPassword').value = '';
  document.getElementById('regConfirmPassword').value = '';
  
  return true;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('hydrofit_current_user');
  loginModal.style.display = 'flex';
  registerModal.style.display = 'none';
  profileModal.style.display = 'none';
  showToast('Logged out successfully');
}

function checkAuth() {
  const savedUser = localStorage.getItem('hydrofit_current_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    const stored = localStorage.getItem(`hydrofit_${currentUser.schoolId}`);
    if (stored) {
      userData = JSON.parse(stored);
    }
    updateUIStats();
    loginModal.style.display = 'none';
    switchTab('dashboard');
  } else {
    loginModal.style.display = 'flex';
  }
}

function showQRCode() {
  if (!currentUser) return;
  
  const qrContainer = document.getElementById('qrCodeContainer');
  qrContainer.innerHTML = '';
  
  const qrData = JSON.stringify({
    id: currentUser.schoolId,
    name: currentUser.fullName,
    program: currentUser.program
  });
  
  new QRCode(qrContainer, {
    text: qrData,
    width: 200,
    height: 200
  });
  
  document.getElementById('qrUserInfo').innerHTML = `
    <strong>${currentUser.fullName}</strong><br>
    School ID: ${currentUser.schoolId}<br>
    Program: ${currentUser.program}
  `;
  
  profileModal.style.display = 'flex';
}

// ============ RENDER FUNCTIONS ============

function renderDashboard() {
  if (!contentDiv) return;
  
  const attendanceCount = userData.attendanceRecords?.length || 0;
  const attendanceRate = Math.min(100, (attendanceCount / 30) * 100);
  
  contentDiv.innerHTML = `
    <div class="card-grid">
      <div class="card">
        <h3><i class="fas fa-user-circle"></i> Welcome, ${currentUser?.fullName?.split(',')[0] || 'User'}!</h3>
        <p>Program: ${currentUser?.program || 'N/A'}</p>
        <p>School ID: ${currentUser?.schoolId || 'N/A'}</p>
        <button class="btn btn-sm" id="showQRBtn"><i class="fas fa-qrcode"></i> Show QR Code</button>
      </div>
      <div class="card">
        <h3><i class="fas fa-fire"></i> Habit Streak</h3>
        <p>🔥 ${userData.habitStreak} day streak</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, (userData.habitStreak / 30) * 100)}%"></div></div>
      </div>
      <div class="card">
        <h3><i class="fas fa-trophy"></i> Level ${userData.level}</h3>
        <p>${userData.points} total points</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${(userData.points % 500) / 5}%"></div></div>
        <p>Next level: ${500 - (userData.points % 500)} pts</p>
      </div>
      <div class="card">
        <h3><i class="fas fa-clipboard-check"></i> Today's Challenge</h3>
        <p>Complete 20 pushups → +50 pts</p>
        <button class="btn btn-sm" id="completeDaily">✅ Complete</button>
      </div>
      <div class="card">
        <h3><i class="fas fa-calendar-check"></i> Class Attendance Record</h3>
        <p>Total Attendances: ${attendanceCount}</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${attendanceRate}%"></div></div>
        <button class="btn btn-sm" id="markAttendanceBtn"><i class="fas fa-check-circle"></i> Mark Today Present</button>
      </div>
    </div>
  `;
  
  document.getElementById('showQRBtn')?.addEventListener('click', showQRCode);
  document.getElementById('completeDaily')?.addEventListener('click', () => {
    awardPoints(50, 'Daily challenge completed!');
  });
  document.getElementById('markAttendanceBtn')?.addEventListener('click', () => {
    const today = new Date().toDateString();
    if (!userData.attendanceRecords?.includes(today)) {
      if (!userData.attendanceRecords) userData.attendanceRecords = [];
      userData.attendanceRecords.push(today);
      saveUserData();
      awardPoints(10, 'Attendance marked!');
      showToast('Attendance recorded!');
      renderDashboard();
    } else {
      showToast('Already marked today!');
    }
  });
}

function renderProfile() {
  if (!contentDiv) return;
  contentDiv.innerHTML = `
    <div class="card">
      <h3><i class="fas fa-user-circle"></i> My Profile</h3>
      <div style="text-align: center; padding: 20px;">
        <i class="fas fa-user" style="font-size: 80px; color: var(--primary);"></i>
        <h2>${currentUser?.fullName}</h2>
        <p><strong>School ID:</strong> ${currentUser?.schoolId}</p>
        <p><strong>Program:</strong> ${currentUser?.program}</p>
        <p><strong>Subject:</strong> ${currentUser?.subject || 'Pathfit'}</p>
        <p><strong>Total Points:</strong> ${userData.points}</p>
        <p><strong>Level:</strong> ${userData.level}</p>
        <button class="btn" id="profileQRBtn"><i class="fas fa-qrcode"></i> View QR Code</button>
      </div>
    </div>
  `;
  document.getElementById('profileQRBtn')?.addEventListener('click', showQRCode);
}

function renderGamified() {
  let badgesHtml = userData.badges.map(b => `<span class="badge">🏅 ${b}</span>`).join('');
  if (!badgesHtml) badgesHtml = '<span class="badge">⭐ Newbie</span>';
  contentDiv.innerHTML = `
    <div class="card"><h3><i class="fas fa-medal"></i> Your Badges</h3><div class="badge-list">${badgesHtml}</div><button class="btn btn-sm" id="unlockDemoBadge">Earn Demo Badge</button></div>
    <div class="card"><h3><i class="fas fa-ranking-star"></i> Class Ranking</h3><div class="leaderboard-item"><span>1. AthleteX</span><span>2450 pts</span></div><div class="leaderboard-item"><span>2. You</span><span>${userData.points} pts</span></div><div class="leaderboard-item"><span>3. FitPilot</span><span>1890 pts</span></div></div>
  `;
  document.getElementById('unlockDemoBadge')?.addEventListener('click', () => {
    if (!userData.badges.includes('Consistency Badge')) userData.badges.push('Consistency Badge');
    saveUserData();
    renderGamified();
    awardPoints(30, 'Badge earned!');
  });
}

// Simplified versions of other render functions (you can expand these)
function renderAssessment() { contentDiv.innerHTML = `<div class="card"><h3>Fitness Assessment</h3><p>Track your fitness progress here.</p><button class="btn" onclick="awardPoints(20, 'Assessment')">Log Assessment</button></div>`; }
function renderMovementLib() { contentDiv.innerHTML = `<div class="card"><h3>Movement Library</h3><p>Exercise videos and instructions coming soon!</p></div>`; }
function renderAIAssist() { contentDiv.innerHTML = `<div class="card"><h3>AI Exercise Guide</h3><p>Get personalized workout recommendations.</p><button class="btn" onclick="showToast('AI Coach: Try 10 pushups!')">Ask AI</button></div>`; }
function renderCompetency() { contentDiv.innerHTML = `<div class="card"><h3>Competency Tracker</h3><p>Track your exercise competency over time.</p><canvas id="compChart"></canvas></div>`; }
function renderScheduler() { contentDiv.innerHTML = `<div class="card"><h3>Workout Scheduler</h3><p>Plan your weekly workouts.</p><button class="btn">Set Schedule</button></div>`; }
function renderTimerSystem() { contentDiv.innerHTML = `<div class="card"><h3>Exercise Timer</h3><div class="timer-display" id="timerDisp">00:00</div><button class="btn" id="startTimer">Start 30s Timer</button></div>`; 
  document.getElementById('startTimer')?.addEventListener('click', () => { let t = 30, d = document.getElementById('timerDisp'), i = setInterval(() => { d.innerText = `${Math.floor(t/60)}:${(t%60).toString().padStart(2,'0')}`; if(t--<=0){clearInterval(i); playBeep(); awardPoints(10);} },1000); });
}
function renderWarmupGen() { contentDiv.innerHTML = `<div class="card"><h3>Warm-up Generator</h3><button class="btn" onclick="showToast('Arm circles, leg swings, light jog')">Generate Warmup</button></div>`; }
function renderInjuryGuide() { contentDiv.innerHTML = `<div class="card"><h3>Injury Prevention Guide</h3><p>✅ Proper form tips and safety guidelines.</p></div>`; }
function renderAttendance() { contentDiv.innerHTML = `<div class="card"><h3>Class Attendance</h3><p>Total attendances: ${userData.attendanceRecords?.length || 0}</p><button class="btn" id="markClassAttend">Mark Present</button></div>`;
  document.getElementById('markClassAttend')?.addEventListener('click', () => { const today = new Date().toDateString(); if(!userData.attendanceRecords?.includes(today)){ userData.attendanceRecords = userData.attendanceRecords || []; userData.attendanceRecords.push(today); saveUserData(); awardPoints(10); showToast('Attendance marked!'); renderAttendance(); } else { showToast('Already marked!'); } });
}
function renderHabitBuilder() { contentDiv.innerHTML = `<div class="card"><h3>Habit Builder</h3><p>🔥 Streak: ${userData.habitStreak} days</p><button class="btn" id="logHabit">Log Today's Workout</button></div>`;
  document.getElementById('logHabit')?.addEventListener('click', () => { userData.habitStreak++; saveUserData(); awardPoints(15); renderHabitBuilder(); });
}
function renderGoalPlanner() { contentDiv.innerHTML = `<div class="card"><h3>Goal Planner</h3><input id="goalInput" placeholder="Enter your fitness goal"><button id="setGoal" class="btn">Set Goal</button><div id="goalsList"></div></div>`;
  document.getElementById('setGoal')?.addEventListener('click', () => { let g = document.getElementById('goalInput').value; if(g){ userData.goals.push(g); saveUserData(); renderGoalPlanner(); } });
  document.getElementById('goalsList').innerHTML = userData.goals.map(g => `<div>🎯 ${g}</div>`).join('');
}
function renderBodyFocus() { contentDiv.innerHTML = `<div class="card"><h3>Body Focus Trainer</h3><select><option>Legs</option><option>Core</option><option>Arms</option></select><button class="btn">Start Workout</button></div>`; }
function renderCalorieTracker() { contentDiv.innerHTML = `<div class="card"><h3>Calorie Tracker</h3><input id="calMin" placeholder="Minutes"><button class="btn" id="calcCal">Calculate</button><div id="calRes"></div></div>`;
  document.getElementById('calcCal')?.addEventListener('click', () => { let min = parseInt(document.getElementById('calMin').value)||0; let cal = min*7; document.getElementById('calRes').innerHTML = `🔥 ${cal} kcal burned`; awardPoints(5); });
}
function renderBMITracker() { contentDiv.innerHTML = `<div class="card"><h3>BMI Tracker</h3><input id="bmiHeight" placeholder="Height (cm)"><input id="bmiWeight" placeholder="Weight (kg)"><button class="btn" id="calcBMI">Compute BMI</button><div id="bmiResult"></div></div>`;
  document.getElementById('calcBMI')?.addEventListener('click', () => { let h = parseFloat(document.getElementById('bmiHeight').value)/100; let w = parseFloat(document.getElementById('bmiWeight').value); let bmi = (w/(h*h)).toFixed(1); document.getElementById('bmiResult').innerHTML = `BMI: ${bmi} - ${bmi<18.5?'Underweight':bmi<25?'Normal':'Overweight'}`; userData.bmiHistory.push(bmi); saveUserData(); });
}
function renderRecovery() { contentDiv.innerHTML = `<div class="card"><h3>Recovery Tracker</h3><p>Track your rest and recovery days.</p><button class="btn">Log Rest Day</button></div>`; }
function renderHeartLogger() { contentDiv.innerHTML = `<div class="card"><h3>Heart Rate Logger</h3><input placeholder="Before workout"><input placeholder="After workout"><button class="btn">Log Heart Rate</button></div>`; }
function renderBodyType() { contentDiv.innerHTML = `<div class="card"><h3>Body Type Identifier</h3><select><option>Ectomorph (slim)</option><option>Mesomorph (athletic)</option><option>Endomorph (curvy)</option></select><button class="btn">Identify</button></div>`; }

// Tab switching
function renderTab(tabId) {
  switch(tabId) {
    case 'dashboard': renderDashboard(); break;
    case 'profile': renderProfile(); break;
    case 'gamified': renderGamified(); break;
    case 'assessment': renderAssessment(); break;
    case 'movement': renderMovementLib(); break;
    case 'ai-assist': renderAIAssist(); break;
    case 'tracker': renderCompetency(); break;
    case 'scheduler': renderScheduler(); break;
    case 'timer': renderTimerSystem(); break;
    case 'warmup': renderWarmupGen(); break;
    case 'injury': renderInjuryGuide(); break;
    case 'attendance': renderAttendance(); break;
    case 'habit': renderHabitBuilder(); break;
    case 'goals': renderGoalPlanner(); break;
    case 'bodyparts': renderBodyFocus(); break;
    case 'calorie': renderCalorieTracker(); break;
    case 'bmi': renderBMITracker(); break;
    case 'recovery': renderRecovery(); break;
    case 'heartrate': renderHeartLogger(); break;
    case 'bodytype': renderBodyType(); break;
    default: renderDashboard();
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  let activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  const titleElement = document.getElementById('active-title');
  if (titleElement) titleElement.innerText = activeBtn?.innerText?.trim() || 'HYDROFIT';
  renderTab(tabId);
  // Close mobile sidebar
  document.querySelector('.sidebar')?.classList.remove('open');
}

// Mobile menu toggle
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.querySelector('.sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }
}

// ============ EVENT LISTENERS ============

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    let tab = btn.getAttribute('data-tab');
    switchTab(tab);
  });
});

document.getElementById('logoutBtn')?.addEventListener('click', logout);

document.getElementById('showRegister')?.addEventListener('click', (e) => {
  e.preventDefault();
  loginModal.style.display = 'none';
  registerModal.style.display = 'flex';
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
  e.preventDefault();
  registerModal.style.display = 'none';
  loginModal.style.display = 'flex';
});

document.getElementById('closeProfileModal')?.addEventListener('click', () => {
  profileModal.style.display = 'none';
});

document.getElementById('loginBtn')?.addEventListener('click', async () => {
  const schoolId = document.getElementById('loginSchoolId').value;
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.textContent = 'Logging in...';
  await login(schoolId, password);
  btn.disabled = false;
  btn.textContent = 'Login';
});

document.getElementById('registerBtn')?.addEventListener('click', async () => {
  const registrationData = {
    fullName: document.getElementById('regFullName').value,
    schoolId: document.getElementById('regSchoolId').value,
    subject: document.getElementById('regSubject').value,
    program: document.getElementById('regProgram').value,
    password: document.getElementById('regPassword').value,
    confirmPassword: document.getElementById('regConfirmPassword').value
  };
  
  const btn = document.getElementById('registerBtn');
  btn.disabled = true;
  btn.textContent = 'Registering...';
  
  await register(registrationData);
  
  btn.disabled = false;
  btn.textContent = 'Register';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === loginModal) loginModal.style.display = 'none';
  if (e.target === registerModal) registerModal.style.display = 'none';
  if (e.target === profileModal) profileModal.style.display = 'none';
});

// Enter key support
document.getElementById('loginPassword')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('loginBtn').click();
});
document.getElementById('regConfirmPassword')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('registerBtn').click();
});

// ============ INITIALIZATION ============

async function init() {
  initMobileMenu();
  
  // Initialize Google Sheets API if configured
  if (typeof CONFIG !== 'undefined' && CONFIG.API_URL) {
    initSheetDB(CONFIG.API_URL);
    console.log('✅ API initialized with URL:', CONFIG.API_URL);
  } else {
    console.warn('⚠️ API URL not configured. Using local storage only.');
  }
  
  checkAuth();
}

// Start the app
init();