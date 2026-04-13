// ========================================
// HYDROFIT - GOOGLE FIT STEP COUNTER
// ========================================

let stepHistory = [];
let dailyGoal = 10000;
let isGoogleFitConnected = false;
let googleFitToken = null;

const GOOGLE_FIT_CONFIG = {
  clientId: '803381828579-n65i55mqbm3uf2lba8kbfu0f8spsn3d6.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest']
};

function renderStepCounter() {
  const container = document.getElementById("tabContent");
  
  // Check if already connected
  const savedToken = localStorage.getItem('google_fit_token');
  if (savedToken) {
    googleFitToken = savedToken;
    isGoogleFitConnected = true;
  }
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Step Counter" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    ${!isGoogleFitConnected ? `
      <!-- Connect Google Fit -->
      <div class="card connect-card">
        <div class="connect-header">
          <i class="fab fa-google"></i>
          <h2>Connect Google Fit</h2>
        </div>
        <p style="color:#64748b;margin-bottom:24px;text-align:center">
          Connect your Google Fit account to automatically sync your step data
        </p>
        <button class="google-fit-btn" onclick="connectGoogleFit()">
          <i class="fab fa-google"></i> Connect Google Fit
        </button>
      </div>
    ` : `
      <!-- Connected Status -->
      <div class="card connected-card">
        <div class="connected-header">
          <i class="fab fa-google" style="color:#4285f4"></i>
          <div>
            <h3>Google Fit Connected</h3>
            <p>Your step data syncs automatically</p>
          </div>
        </div>
        <button class="btn btn-outline" onclick="syncFromGoogleFit()" style="margin-top:16px">
          <i class="fas fa-sync-alt"></i> Sync Now
        </button>
      </div>
    `}

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
      <h3><i class="fas fa-shoe-prints"></i> Today's Steps</h3>
      <div class="steps-progress">
        <div class="progress-circle-container">
          <svg viewBox="0 0 100 100" class="step-circle">
            <circle cx="50" cy="50" r="45" class="circle-bg"/>
            <circle cx="50" cy="50" r="45" class="circle-fill" id="stepCircle"/>
          </svg>
          <div class="circle-content">
            <span class="current-steps" id="currentSteps">0</span>
            <span class="goal-steps">/ ${dailyGoal.toLocaleString()}</span>
          </div>
        </div>
        <div class="steps-stats">
          <div class="stat-item">
            <span class="stat-label">Distance</span>
            <span class="stat-value" id="todayDistance">0 km</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Calories</span>
            <span class="stat-value" id="todayCalories">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Minutes</span>
            <span class="stat-value" id="todayActiveMinutes">0</span>
          </div>
        </div>
      </div>
      
      <button class="btn btn-outline" onclick="manualAddSteps()" style="width:100%;margin-top:16px">
        <i class="fas fa-plus"></i> Add Steps Manually
      </button>
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
          <input type="number" id="manualSteps" class="modal-input" placeholder="Number of steps">
          <input type="number" id="manualDistance" class="modal-input" placeholder="Distance (km)">
          <input type="number" id="manualCalories" class="modal-input" placeholder="Calories burned">
          <input type="number" id="manualActiveMinutes" class="modal-input" placeholder="Active minutes">
          <button class="modal-btn" onclick="saveManualSteps()">Save</button>
          <button class="modal-btn btn-outline" onclick="closeManualModal()">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  loadDailyGoal();
  loadTodaySteps();
  loadStepHistory();
}

function connectGoogleFit() {
  // Initialize Google API client
  gapi.load('client:auth2', async () => {
    try {
      await gapi.client.init({
        clientId: GOOGLE_FIT_CONFIG.clientId,
        scope: GOOGLE_FIT_CONFIG.scope,
        discoveryDocs: GOOGLE_FIT_CONFIG.discoveryDocs
      });
      
      const authInstance = gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      googleFitToken = user.getAuthResponse().access_token;
      isGoogleFitConnected = true;
      localStorage.setItem('google_fit_token', googleFitToken);
      
      showToast('Connected to Google Fit! 🎉', false);
      renderStepCounter();
      syncFromGoogleFit();
      
    } catch (error) {
      console.error('Google Fit connection error:', error);
      showToast('Failed to connect to Google Fit', true);
    }
  });
}

async function syncFromGoogleFit() {
  if (!googleFitToken) {
    const savedToken = localStorage.getItem('google_fit_token');
    if (savedToken) {
      googleFitToken = savedToken;
      isGoogleFitConnected = true;
    } else {
      showToast('Please connect to Google Fit first', true);
      return;
    }
  }
  
  showToast('Syncing from Google Fit...', false);
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endTime = new Date();
    
    // Get steps data
    const stepsResponse = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${googleFitToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: today.getTime(),
        endTimeMillis: endTime.getTime()
      })
    });
    
    const stepsData = await stepsResponse.json();
    let steps = 0;
    
    if (stepsData.bucket) {
      stepsData.bucket.forEach(bucket => {
        bucket.dataset.forEach(dataset => {
          dataset.point.forEach(point => {
            point.value.forEach(val => { steps += val.intVal || 0; });
          });
        });
      });
    }
    
    // Calculate distance (rough estimate: steps * 0.762m per step)
    const distance = (steps * 0.000762).toFixed(2);
    
    // Calculate calories (rough estimate: steps * 0.04)
    const calories = Math.round(steps * 0.04);
    
    // Get active minutes
    const activeResponse = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${googleFitToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        aggregateBy: [{
          dataTypeName: 'com.google.active_minutes'
        }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: today.getTime(),
        endTimeMillis: endTime.getTime()
      })
    });
    
    const activeData = await activeResponse.json();
    let activeMinutes = 0;
    
    if (activeData.bucket) {
      activeData.bucket.forEach(bucket => {
        bucket.dataset.forEach(dataset => {
          dataset.point.forEach(point => {
            point.value.forEach(val => { activeMinutes += val.intVal || 0; });
          });
        });
      });
    }
    
    // Save to sheets
    const result = await callAPI('saveStepData', {
      schoolId: window.currentUser.schoolId,
      date: today.toISOString().split('T')[0],
      steps: steps,
      distance: distance,
      calories: calories,
      activeMinutes: activeMinutes
    });
    
    if (result.success) {
      showToast(`Synced ${steps.toLocaleString()} steps! 🎉`, false);
      loadTodaySteps();
      loadStepHistory();
    }
    
  } catch (error) {
    console.error('Sync error:', error);
    showToast('Failed to sync from Google Fit', true);
  }
}

async function loadTodaySteps() {
  const result = await callAPI('getStepData', {
    schoolId: window.currentUser.schoolId,
    date: new Date().toISOString().split('T')[0]
  });
  
  if (result.success && result.data) {
    const data = result.data;
    document.getElementById('currentSteps').innerText = data.steps.toLocaleString();
    document.getElementById('todayDistance').innerText = `${data.distance} km`;
    document.getElementById('todayCalories').innerText = data.calories.toLocaleString();
    document.getElementById('todayActiveMinutes').innerText = `${data.activeMinutes} min`;
    
    // Update progress circle
    const percent = Math.min(100, (data.steps / dailyGoal) * 100);
    const circle = document.getElementById('stepCircle');
    if (circle) {
      const circumference = 2 * Math.PI * 45;
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
      circle.style.stroke = data.steps >= dailyGoal ? '#00b894' : '#00b4d8';
    }
  } else {
    document.getElementById('currentSteps').innerText = '0';
    document.getElementById('todayDistance').innerText = '0 km';
    document.getElementById('todayCalories').innerText = '0';
    document.getElementById('todayActiveMinutes').innerText = '0 min';
  }
}

async function loadStepHistory() {
  const result = await callAPI('getStepHistory', {
    schoolId: window.currentUser.schoolId,
    days: 7
  });
  
  if (result.success) {
    stepHistory = result.history;
    displayStepHistory();
    drawStepChart();
  }
}

function displayStepHistory() {
  const container = document.getElementById('stepHistoryList');
  
  if (stepHistory.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No step data yet</p>';
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
  if (!canvas) return;
  
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
  
  if (stepHistory.length === 0) {
    ctx.font = '500 14px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('No step data available', width/2, height/2);
    return;
  }
  
  const chartData = [...stepHistory].reverse();
  
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxSteps = Math.max(dailyGoal, ...chartData.map(d => d.steps));
  
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
    const x = padding.left + (i / chartData.length) * chartWidth + (chartWidth / chartData.length - barWidth) / 2;
    const barHeight = (d.steps / maxSteps) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    
    ctx.fillStyle = d.steps >= dailyGoal ? '#00b894' : '#00b4d8';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Date label
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    const date = new Date(d.date);
    ctx.fillText(date.toLocaleDateString('en-US', { weekday: 'short' }), x + barWidth / 2, height - 20);
    
    // Value label
    ctx.font = 'bold 9px Inter, sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(d.steps.toLocaleString(), x + barWidth / 2, y - 5);
  });
}

function setStepGoal() {
  const newGoal = parseInt(document.getElementById('stepGoal').value);
  if (newGoal && newGoal >= 1000) {
    dailyGoal = newGoal;
    localStorage.setItem('hydrofit_step_goal', dailyGoal);
    document.querySelector('.goal-steps').innerText = `/ ${dailyGoal.toLocaleString()}`;
    loadTodaySteps();
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
  const steps = parseInt(document.getElementById('manualSteps').value);
  const distance = parseFloat(document.getElementById('manualDistance').value) || (steps * 0.000762).toFixed(2);
  const calories = parseInt(document.getElementById('manualCalories').value) || Math.round(steps * 0.04);
  const activeMinutes = parseInt(document.getElementById('manualActiveMinutes').value) || 0;
  
  if (!steps) {
    showToast('Please enter steps', true);
    return;
  }
  
  const result = await callAPI('saveStepData', {
    schoolId: window.currentUser.schoolId,
    date: new Date().toISOString().split('T')[0],
    steps: steps,
    distance: distance,
    calories: calories,
    activeMinutes: activeMinutes
  });
  
  if (result.success) {
    showToast('Steps saved! 🎉', false);
    closeManualModal();
    loadTodaySteps();
    loadStepHistory();
  }
}

console.log("✅ Step Counter Loaded");