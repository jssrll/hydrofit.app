// ========================================
// HYDROFIT - STEP COUNTER (API + MOTION SENSOR)
// ========================================

let stepHistory = [];
let dailyGoal = 10000;
let stepCount = 0;
let isTracking = false;
let motionPermission = false;
let useGoogleFit = false;

// Motion detection variables
let lastAcceleration = { x: 0, y: 0, z: 0 };
const STEP_THRESHOLD = 1.2;
const MIN_STEP_INTERVAL = 250;
let lastStepTime = 0;
let motionListener = null;

// Google Fit Config
const GOOGLE_FIT_CONFIG = {
  clientId: '803381828579-n65i55mqbm3uf2lba8kbfu0f8spsn3d6.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/fitness.activity.read',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest']
};

function renderStepCounter() {
  const container = document.getElementById("tabContent");
  
  // Check if Google API is available
  const googleApiAvailable = typeof gapi !== 'undefined';
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Step Counter" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Connection Options -->
    <div class="card">
      <h3><i class="fas fa-link"></i> Step Tracking Method</h3>
      <div class="tracking-options">
        ${googleApiAvailable ? `
          <button class="tracking-option-btn" onclick="tryGoogleFit()">
            <i class="fab fa-google"></i> Connect Google Fit
          </button>
        ` : ''}
        <button class="tracking-option-btn" onclick="useDeviceMotion()">
          <i class="fas fa-mobile-alt"></i> Use Device Sensor
        </button>
        <button class="tracking-option-btn" onclick="manualAddSteps()">
          <i class="fas fa-keyboard"></i> Manual Entry
        </button>
      </div>
      <p style="color:#64748b;font-size:0.85rem;margin-top:16px;text-align:center">
        ${useGoogleFit ? '✓ Connected to Google Fit' : motionPermission ? '✓ Using device motion sensor' : 'Select a tracking method above'}
      </p>
    </div>

    <!-- Daily Step Goal -->
    <div class="card">
      <h3><i class="fas fa-bullseye"></i> Daily Step Goal</h3>
      <div class="goal-setting">
        <input type="number" id="stepGoal" class="form-control" value="${dailyGoal}" min="1000" max="50000" step="1000">
        <button class="btn" onclick="setStepGoal()">Set Goal</button>
      </div>
    </div>

    <!-- Today's Steps -->
    <div class="card steps-today-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-shoe-prints"></i> Today's Steps</h3>
        ${motionPermission ? `
          <button class="tracking-toggle ${isTracking ? 'active' : ''}" onclick="toggleTracking()">
            <i class="fas ${isTracking ? 'fa-pause' : 'fa-play'}"></i> 
            ${isTracking ? 'Stop' : 'Start'} Tracking
          </button>
        ` : ''}
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
        <button class="btn btn-outline" onclick="manualAddSteps()" style="flex:1">
          <i class="fas fa-plus"></i> Add Steps
        </button>
        <button class="btn btn-outline" onclick="saveCurrentSteps()" style="flex:1">
          <i class="fas fa-save"></i> Save Progress
        </button>
      </div>
    </div>

    <!-- Step History Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Step History (Last 7 Days)</h3>
      <div id="stepChartContainer" style="position:relative;height:250px">
        <canvas id="stepChart" style="width:100%;height:100%"></canvas>
      </div>
    </div>

    <!-- History List -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-history"></i> Recent History</h3>
        <button class="refresh-btn" onclick="loadStepHistory()">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="stepHistoryList"></div>
    </div>

    <!-- Manual Add Modal -->
    <div id="manualStepsModal" class="modal" style="display:none">
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-shoe-prints"></i>
          <h3>Add Steps Manually</h3>
        </div>
        <div class="modal-body">
          <input type="number" id="manualSteps" class="modal-input" placeholder="Number of steps" value="0">
          <p style="color:#64748b;font-size:0.85rem;margin:8px 0">
            <i class="fas fa-info-circle"></i> Distance and calories will be calculated automatically
          </p>
          <button class="modal-btn" onclick="saveManualSteps()">Save</button>
          <button class="modal-btn btn-outline" onclick="closeManualModal()">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  loadDailyGoal();
  loadTodaySteps();
  loadStepHistory();
  updateStepDisplay();
}

// ========================================
// TRACKING METHODS
// ========================================

async function tryGoogleFit() {
  showToast('Connecting to Google Fit...', false);
  
  // Load Google API if not already loaded
  if (typeof gapi === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => initGoogleFit();
    script.onerror = () => {
      showToast('Google Fit unavailable, using device sensor', false);
      useDeviceMotion();
    };
    document.head.appendChild(script);
  } else {
    initGoogleFit();
  }
}

async function initGoogleFit() {
  try {
    await gapi.load('client:auth2');
    await gapi.client.init(GOOGLE_FIT_CONFIG);
    
    const authInstance = gapi.auth2.getAuthInstance();
    const user = await authInstance.signIn();
    
    const token = user.getAuthResponse().access_token;
    localStorage.setItem('google_fit_token', token);
    
    useGoogleFit = true;
    showToast('Connected to Google Fit!', false);
    
    await syncFromGoogleFit();
    renderStepCounter();
  } catch (error) {
    console.log('Google Fit error:', error);
    showToast('Falling back to device sensor', false);
    useDeviceMotion();
  }
}

async function syncFromGoogleFit() {
  const token = localStorage.getItem('google_fit_token');
  if (!token) return;
  
  showToast('Syncing steps...', false);
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: today.getTime(),
        endTimeMillis: new Date().getTime()
      })
    });
    
    const data = await response.json();
    let steps = 0;
    
    if (data.bucket) {
      data.bucket.forEach(bucket => {
        bucket.dataset.forEach(dataset => {
          dataset.point.forEach(point => {
            point.value.forEach(val => { steps += val.intVal || 0; });
          });
        });
      });
    }
    
    stepCount = steps;
    await saveStepData(steps);
    updateStepDisplay();
    showToast(`Synced ${steps.toLocaleString()} steps!`, false);
  } catch (error) {
    console.log('Sync error:', error);
    useDeviceMotion();
  }
}

function useDeviceMotion() {
  motionPermission = true;
  useGoogleFit = false;
  showToast('Using device motion sensor', false);
  renderStepCounter();
  requestMotionPermission();
}

function requestMotionPermission() {
  if (typeof DeviceMotionEvent !== 'undefined') {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            startMotionTracking();
          } else {
            showToast('Motion permission denied', true);
          }
        })
        .catch(console.error);
    } else {
      // Android/Desktop
      startMotionTracking();
    }
  } else {
    showToast('Device motion not supported', true);
  }
}

function startMotionTracking() {
  if (motionListener) {
    window.removeEventListener('devicemotion', motionListener);
  }
  
  motionListener = (event) => {
    if (!isTracking) return;
    
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    
    const now = Date.now();
    if (now - lastStepTime < MIN_STEP_INTERVAL) return;
    
    const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
    const deltaX = Math.abs(acc.x - lastAcceleration.x);
    const deltaY = Math.abs(acc.y - lastAcceleration.y);
    const deltaZ = Math.abs(acc.z - lastAcceleration.z);
    const delta = deltaX + deltaY + deltaZ;
    
    if (delta > STEP_THRESHOLD && magnitude > 10 && magnitude < 14) {
      stepCount++;
      lastStepTime = now;
      updateStepDisplay();
    }
    
    lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
  };
  
  window.addEventListener('devicemotion', motionListener);
  isTracking = true;
  showToast('Step tracking started!', false);
}

function toggleTracking() {
  if (isTracking) {
    isTracking = false;
    showToast('Tracking paused', false);
  } else {
    if (!motionListener) {
      requestMotionPermission();
    } else {
      isTracking = true;
      showToast('Tracking resumed', false);
    }
  }
  renderStepCounter();
}

// ========================================
// STEP DATA MANAGEMENT
// ========================================

function updateStepDisplay() {
  const stepsEl = document.getElementById('currentSteps');
  const distanceEl = document.getElementById('todayDistance');
  const caloriesEl = document.getElementById('todayCalories');
  const minutesEl = document.getElementById('todayActiveMinutes');
  
  if (stepsEl) {
    stepsEl.innerText = stepCount.toLocaleString();
    distanceEl.innerText = (stepCount * 0.000762).toFixed(2) + ' km';
    caloriesEl.innerText = Math.round(stepCount * 0.04).toLocaleString();
    minutesEl.innerText = Math.round(stepCount / 100).toLocaleString();
    
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

async function saveCurrentSteps() {
  if (stepCount === 0) {
    showToast('No steps to save', true);
    return;
  }
  
  await saveStepData(stepCount);
  showToast('Steps saved!', false);
  loadStepHistory();
}

async function saveStepData(steps) {
  const distance = (steps * 0.000762).toFixed(2);
  const calories = Math.round(steps * 0.04);
  const activeMinutes = Math.round(steps / 100);
  
  return await callAPI('saveStepData', {
    schoolId: window.currentUser.schoolId,
    date: new Date().toISOString().split('T')[0],
    steps: steps,
    distance: distance,
    calories: calories,
    activeMinutes: activeMinutes
  });
}

async function loadTodaySteps() {
  const result = await callAPI('getStepData', {
    schoolId: window.currentUser.schoolId,
    date: new Date().toISOString().split('T')[0]
  });
  
  if (result.success && result.data) {
    stepCount = result.data.steps || 0;
    updateStepDisplay();
  }
}

async function loadStepHistory() {
  const result = await callAPI('getStepHistory', {
    schoolId: window.currentUser.schoolId,
    days: 7
  });
  
  if (result.success) {
    stepHistory = result.history || [];
    displayStepHistory();
    drawStepChart();
  }
}

function displayStepHistory() {
  const container = document.getElementById('stepHistoryList');
  if (!container) return;
  
  if (!stepHistory || stepHistory.length === 0) {
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
          <span class="steps">${day.steps.toLocaleString()}</span>
          <span class="goal">/ ${dailyGoal.toLocaleString()}</span>
        </div>
        <div class="progress-bar-small">
          <div class="progress-fill-small" style="width:${Math.min(100, percent)}%; background: ${day.steps >= dailyGoal ? '#00b894' : '#00b4d8'}"></div>
        </div>
        <div class="history-stats">
          <span><i class="fas fa-road"></i> ${day.distance} km</span>
          <span><i class="fas fa-fire"></i> ${day.calories}</span>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function drawStepChart() {
  const canvas = document.getElementById('stepChart');
  if (!canvas || !stepHistory || stepHistory.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth;
  
  canvas.width = containerWidth * 2;
  canvas.height = 250 * 2;
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = '250px';
  
  ctx.scale(2, 2);
  
  const width = containerWidth;
  const height = 250;
  
  ctx.clearRect(0, 0, width, height);
  
  const chartData = [...stepHistory].reverse();
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxSteps = Math.max(dailyGoal, ...chartData.map(d => d.steps || 0));
  
  // Draw goal line
  const goalY = padding.top + chartHeight - (dailyGoal / maxSteps) * chartHeight;
  ctx.beginPath();
  ctx.strokeStyle = '#d63031';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.moveTo(padding.left, goalY);
  ctx.lineTo(width - padding.right, goalY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw bars
  const barWidth = (chartWidth / chartData.length) * 0.7;
  
  chartData.forEach((d, i) => {
    const steps = d.steps || 0;
    const x = padding.left + (i / chartData.length) * chartWidth + (chartWidth / chartData.length - barWidth) / 2;
    const barHeight = (steps / maxSteps) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    
    ctx.fillStyle = steps >= dailyGoal ? '#00b894' : '#00b4d8';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Date label
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    const date = new Date(d.date);
    ctx.fillText(date.toLocaleDateString('en-US', { weekday: 'short' }), x + barWidth / 2, height - 20);
    
    // Value label
    if (steps > 0) {
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText(steps.toLocaleString(), x + barWidth / 2, y - 5);
    }
  });
}

function setStepGoal() {
  const newGoal = parseInt(document.getElementById('stepGoal').value);
  if (newGoal && newGoal >= 1000) {
    dailyGoal = newGoal;
    localStorage.setItem('hydrofit_step_goal', dailyGoal);
    updateStepDisplay();
    displayStepHistory();
    showToast(`Daily goal set to ${dailyGoal.toLocaleString()} steps!`, false);
  }
}

function loadDailyGoal() {
  const saved = localStorage.getItem('hydrofit_step_goal');
  if (saved) {
    dailyGoal = parseInt(saved);
  }
}

function manualAddSteps() {
  document.getElementById('manualStepsModal').style.display = 'flex';
}

function closeManualModal() {
  document.getElementById('manualStepsModal').style.display = 'none';
}

async function saveManualSteps() {
  const steps = parseInt(document.getElementById('manualSteps').value) || 0;
  
  if (steps <= 0) {
    showToast('Please enter steps', true);
    return;
  }
  
  stepCount += steps;
  updateStepDisplay();
  
  await saveStepData(stepCount);
  showToast(`Added ${steps.toLocaleString()} steps!`, false);
  closeManualModal();
  loadStepHistory();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (motionListener) {
    window.removeEventListener('devicemotion', motionListener);
  }
  if (stepCount > 0) {
    saveStepData(stepCount);
  }
});

console.log("✅ Step Counter Loaded - API + Motion Sensor Fallback");