// ========================================
// HYDROFIT - STEP COUNTER (SIMPLE & WORKING)
// ========================================

let stepHistory = [];
let dailyGoal = 10000;
let stepCount = 0;
let isTracking = false;
let motionPermission = false;
let lastStepTime = 0;
let motionListener = null;

const STEP_THRESHOLD = 15;
const MIN_STEP_INTERVAL = 300;

function renderStepCounter() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Step Counter" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Daily Step Goal -->
    <div class="card">
      <h3><i class="fas fa-bullseye"></i> Daily Step Goal</h3>
      <div class="goal-setting">
        <input type="number" id="stepGoal" class="form-control" value="${dailyGoal}" min="1000" max="50000" step="1000">
        <button class="btn" onclick="window.setStepGoal()">Set Goal</button>
      </div>
    </div>

    <!-- Today's Steps -->
    <div class="card steps-today-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-shoe-prints"></i> Today's Steps</h3>
        <button class="tracking-toggle ${isTracking ? 'active' : ''}" onclick="window.toggleTracking()" id="trackingToggleBtn">
          <i class="fas ${isTracking ? 'fa-pause' : 'fa-play'}"></i> 
          <span id="trackingBtnText">${isTracking ? 'Stop' : 'Start'} Tracking</span>
        </button>
      </div>
      <div class="steps-progress">
        <div class="progress-circle-container">
          <svg viewBox="0 0 100 100" class="step-circle">
            <circle cx="50" cy="50" r="45" class="circle-bg"/>
            <circle cx="50" cy="50" r="45" class="circle-fill" id="stepCircle"/>
          </svg>
          <div class="circle-content">
            <span class="current-steps" id="currentSteps">${stepCount.toLocaleString()}</span>
            <span class="goal-steps">/ ${dailyGoal.toLocaleString()}</span>
          </div>
        </div>
        <div class="steps-stats">
          <div class="stat-item">
            <span class="stat-label">Distance</span>
            <span class="stat-value" id="todayDistance">${(stepCount * 0.000762).toFixed(2)} km</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Calories</span>
            <span class="stat-value" id="todayCalories">${Math.round(stepCount * 0.04)}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Minutes</span>
            <span class="stat-value" id="todayActiveMinutes">${Math.round(stepCount / 100)}</span>
          </div>
        </div>
      </div>
      
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-outline" onclick="window.manualAddSteps()" style="flex:1">
          <i class="fas fa-plus"></i> Add Steps
        </button>
        <button class="btn btn-outline" onclick="window.resetSteps()" style="flex:1">
          <i class="fas fa-undo-alt"></i> Reset
        </button>
      </div>
    </div>

    <!-- Manual Add Modal -->
    <div id="manualStepsModal" class="modal" style="display:none">
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-shoe-prints"></i>
          <h3>Add Steps Manually</h3>
        </div>
        <div class="modal-body">
          <input type="number" id="manualStepsInput" class="modal-input" placeholder="Number of steps" value="1000" min="1">
          <p style="color:#64748b;font-size:0.85rem;margin:8px 0">
            <i class="fas fa-info-circle"></i> Distance and calories calculated automatically
          </p>
          <button class="modal-btn" onclick="window.saveManualSteps()">Add Steps</button>
          <button class="modal-btn btn-outline" onclick="window.closeManualModal()">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Step History -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-history"></i> Recent Activity</h3>
        <button class="refresh-btn" onclick="window.refreshHistory()">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="stepHistoryList">
        <p style="color:#64748b;text-align:center;padding:20px">Loading history...</p>
      </div>
    </div>
  `;
  
  // Load saved data
  loadDailyGoal();
  loadSavedSteps();
  loadStepHistory();
  updateStepDisplay();
}

// ========================================
// STEP TRACKING FUNCTIONS
// ========================================

function toggleTracking() {
  if (!isTracking) {
    startTracking();
  } else {
    stopTracking();
  }
}

function startTracking() {
  // Check if DeviceMotion is supported
  if (typeof DeviceMotionEvent === 'undefined') {
    showToast('Your device does not support motion tracking', true);
    return;
  }
  
  // iOS requires permission
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          enableMotionTracking();
        } else {
          showToast('Motion permission denied', true);
        }
      })
      .catch(err => {
        console.error('Permission error:', err);
        showToast('Could not get motion permission', true);
      });
  } else {
    // Android/Desktop - just enable
    enableMotionTracking();
  }
}

function enableMotionTracking() {
  if (motionListener) {
    window.removeEventListener('devicemotion', motionListener);
  }
  
  motionListener = function(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    
    const now = Date.now();
    if (now - lastStepTime < MIN_STEP_INTERVAL) return;
    
    // Calculate movement magnitude
    const magnitude = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    
    // Detect step based on threshold
    if (magnitude > STEP_THRESHOLD) {
      stepCount++;
      lastStepTime = now;
      updateStepDisplay();
      
      // Save to localStorage every 10 steps
      if (stepCount % 10 === 0) {
        saveStepsLocally();
      }
    }
  };
  
  window.addEventListener('devicemotion', motionListener);
  isTracking = true;
  motionPermission = true;
  
  // Update UI
  const btn = document.getElementById('trackingToggleBtn');
  if (btn) {
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-pause"></i> <span>Stop Tracking</span>';
  }
  
  showToast('Step tracking started! Walk to count steps', false);
}

function stopTracking() {
  if (motionListener) {
    window.removeEventListener('devicemotion', motionListener);
    motionListener = null;
  }
  isTracking = false;
  
  // Update UI
  const btn = document.getElementById('trackingToggleBtn');
  if (btn) {
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fas fa-play"></i> <span>Start Tracking</span>';
  }
  
  // Save steps
  saveStepsLocally();
  showToast('Tracking stopped. Steps saved!', false);
}

function resetSteps() {
  if (confirm('Reset today\'s steps to 0?')) {
    stepCount = 0;
    updateStepDisplay();
    saveStepsLocally();
    showToast('Steps reset to 0', false);
  }
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================

function updateStepDisplay() {
  const stepsEl = document.getElementById('currentSteps');
  const distanceEl = document.getElementById('todayDistance');
  const caloriesEl = document.getElementById('todayCalories');
  const minutesEl = document.getElementById('todayActiveMinutes');
  
  if (stepsEl) {
    const distance = (stepCount * 0.000762).toFixed(2);
    const calories = Math.round(stepCount * 0.04);
    const minutes = Math.round(stepCount / 100);
    
    stepsEl.innerText = stepCount.toLocaleString();
    if (distanceEl) distanceEl.innerText = distance + ' km';
    if (caloriesEl) caloriesEl.innerText = calories.toLocaleString();
    if (minutesEl) minutesEl.innerText = minutes.toLocaleString();
    
    // Update progress circle
    const percent = Math.min(100, (stepCount / dailyGoal) * 100);
    const circle = document.getElementById('stepCircle');
    if (circle) {
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
      circle.style.stroke = stepCount >= dailyGoal ? '#00b894' : '#00b4d8';
    }
  }
}

function setStepGoal() {
  const input = document.getElementById('stepGoal');
  if (!input) return;
  
  const newGoal = parseInt(input.value);
  if (newGoal && newGoal >= 1000) {
    dailyGoal = newGoal;
    localStorage.setItem('hydrofit_step_goal', dailyGoal);
    
    // Update goal display
    const goalSpan = document.querySelector('.goal-steps');
    if (goalSpan) goalSpan.innerText = '/ ' + dailyGoal.toLocaleString();
    
    updateStepDisplay();
    showToast(`Daily goal set to ${dailyGoal.toLocaleString()} steps!`, false);
  }
}

function loadDailyGoal() {
  const saved = localStorage.getItem('hydrofit_step_goal');
  if (saved) {
    dailyGoal = parseInt(saved);
  }
}

function saveStepsLocally() {
  const today = new Date().toISOString().split('T')[0];
  const stepData = {
    date: today,
    steps: stepCount,
    distance: (stepCount * 0.000762).toFixed(2),
    calories: Math.round(stepCount * 0.04),
    activeMinutes: Math.round(stepCount / 100)
  };
  
  // Save to localStorage
  const history = JSON.parse(localStorage.getItem('hydrofit_step_history') || '[]');
  const existingIndex = history.findIndex(h => h.date === today);
  
  if (existingIndex >= 0) {
    history[existingIndex] = stepData;
  } else {
    history.push(stepData);
  }
  
  // Keep only last 30 days
  const sortedHistory = history.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30);
  localStorage.setItem('hydrofit_step_history', JSON.stringify(sortedHistory));
  
  // Try to save to sheets if API available
  if (typeof callAPI === 'function' && window.currentUser) {
    callAPI('saveStepData', {
      schoolId: window.currentUser.schoolId,
      date: today,
      steps: stepCount,
      distance: stepData.distance,
      calories: stepData.calories,
      activeMinutes: stepData.activeMinutes
    }).catch(err => console.log('Sheet save error:', err));
  }
}

function loadSavedSteps() {
  const today = new Date().toISOString().split('T')[0];
  const history = JSON.parse(localStorage.getItem('hydrofit_step_history') || '[]');
  const todayData = history.find(h => h.date === today);
  
  if (todayData) {
    stepCount = todayData.steps || 0;
  }
}

function loadStepHistory() {
  const container = document.getElementById('stepHistoryList');
  if (!container) return;
  
  const history = JSON.parse(localStorage.getItem('hydrofit_step_history') || '[]');
  stepHistory = history.slice(0, 7);
  
  if (stepHistory.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No step data yet. Start walking!</p>';
    return;
  }
  
  let html = '<div class="history-list">';
  stepHistory.forEach(day => {
    const date = new Date(day.date);
    const isToday = date.toDateString() === new Date().toDateString();
    const percent = Math.round((day.steps / dailyGoal) * 100);
    
    html += `
      <div class="history-item ${isToday ? 'today' : ''}">
        <div class="history-date">
          <span class="date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          ${isToday ? '<span class="today-badge">Today</span>' : ''}
        </div>
        <div class="history-steps">
          <span class="steps">${(day.steps || 0).toLocaleString()}</span>
          <span class="goal">/ ${dailyGoal.toLocaleString()}</span>
        </div>
        <div class="progress-bar-small">
          <div class="progress-fill-small" style="width:${Math.min(100, percent)}%; background: ${day.steps >= dailyGoal ? '#00b894' : '#00b4d8'}"></div>
        </div>
        <div class="history-stats">
          <span><i class="fas fa-road"></i> ${day.distance || 0} km</span>
          <span><i class="fas fa-fire"></i> ${day.calories || 0}</span>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function refreshHistory() {
  loadStepHistory();
  showToast('History refreshed', false);
}

// ========================================
// MANUAL STEP ENTRY
// ========================================

function manualAddSteps() {
  const modal = document.getElementById('manualStepsModal');
  if (modal) modal.style.display = 'flex';
}

function closeManualModal() {
  const modal = document.getElementById('manualStepsModal');
  if (modal) modal.style.display = 'none';
}

function saveManualSteps() {
  const input = document.getElementById('manualStepsInput');
  if (!input) return;
  
  const steps = parseInt(input.value) || 0;
  if (steps <= 0) {
    showToast('Please enter a valid number of steps', true);
    return;
  }
  
  stepCount += steps;
  updateStepDisplay();
  saveStepsLocally();
  loadStepHistory();
  
  closeManualModal();
  showToast(`Added ${steps.toLocaleString()} steps!`, false);
}

// ========================================
// CLEANUP
// ========================================

window.addEventListener('beforeunload', function() {
  if (isTracking) {
    stopTracking();
  }
  saveStepsLocally();
});

// Expose functions globally
window.toggleTracking = toggleTracking;
window.setStepGoal = setStepGoal;
window.resetSteps = resetSteps;
window.manualAddSteps = manualAddSteps;
window.closeManualModal = closeManualModal;
window.saveManualSteps = saveManualSteps;
window.refreshHistory = refreshHistory;

console.log("✅ Step Counter Loaded - Simple & Working");