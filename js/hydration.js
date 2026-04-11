// ========================================
// HYDROFIT - HYDRATION TRACKER
// ========================================

let hydrationProfile = {
  gender: '',
  age: 0,
  weight: 0,
  height: 0,
  wakeTime: '06:00',
  bedTime: '22:00'
};

let dailyWaterGoal = 0;
let waterMin = 0;
let waterMax = 0;
let waterConsumed = 0;
let waterLogs = [];

function renderHydration() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Hydration Tracker" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Profile Setup Card -->
    <div class="card profile-setup-card" id="profileSetupCard" style="display: ${hydrationProfile.weight > 0 ? 'none' : 'block'}">
      <h3><i class="fas fa-user-circle"></i> Set Up Your Profile</h3>
      <p style="color:#64748b;margin-bottom:20px">Enter your details to calculate your daily water goal</p>
      
      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-venus-mars"></i> Gender</label>
          <select id="gender" class="form-control">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div class="form-group">
          <label><i class="fas fa-calendar"></i> Age</label>
          <input type="number" id="age" class="form-control" placeholder="Years" min="14" max="100">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-weight-scale"></i> Weight (kg)</label>
          <input type="number" id="weight" class="form-control" placeholder="e.g., 60" min="30" max="200" step="0.1">
        </div>
        <div class="form-group">
          <label><i class="fas fa-ruler-vertical"></i> Height (cm)</label>
          <input type="number" id="height" class="form-control" placeholder="e.g., 170" min="100" max="250">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-sun"></i> Wake-up Time</label>
          <input type="time" id="wakeTime" class="form-control" value="06:00">
        </div>
        <div class="form-group">
          <label><i class="fas fa-moon"></i> Bedtime</label>
          <input type="time" id="bedTime" class="form-control" value="22:00">
        </div>
      </div>
      
      <button class="btn" onclick="calculateHydrationGoal()" style="width:100%">
        <i class="fas fa-calculator"></i> Calculate My Water Goal
      </button>
    </div>

    <!-- Water Goal Display -->
    <div class="card water-goal-card" id="waterGoalCard" style="display: ${hydrationProfile.weight > 0 ? 'block' : 'none'}">
      <div class="goal-header">
        <div>
          <h3><i class="fas fa-droplet"></i> Daily Water Goal</h3>
          <p>Based on your profile</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="editProfile()">
          <i class="fas fa-edit"></i> Edit
        </button>
      </div>
      
      <div class="water-progress">
        <div class="progress-circle-water">
          <svg viewBox="0 0 100 100" class="water-circle">
            <circle cx="50" cy="50" r="45" class="circle-bg"/>
            <circle cx="50" cy="50" r="45" class="circle-fill" id="waterCircle"/>
          </svg>
          <div class="circle-content">
            <span class="consumed-water" id="consumedWater">0</span>
            <span class="goal-water">/ <span id="dailyWaterGoal">0</span> ml</span>
          </div>
        </div>
        <div class="water-stats">
          <div class="stat-item">
            <span class="stat-label">Target Range</span>
            <span class="stat-value" id="waterRange">0 - 0 ml</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Remaining</span>
            <span class="stat-value" id="remainingWater">0 ml</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">% Complete</span>
            <span class="stat-value" id="waterPercent">0%</span>
          </div>
        </div>
      </div>
      
      <!-- Profile Summary -->
      <div class="profile-summary" id="profileSummary"></div>
    </div>

    <!-- Quick Add Water -->
    <div class="card quick-add-card" id="quickAddCard" style="display: ${hydrationProfile.weight > 0 ? 'block' : 'none'}">
      <h3><i class="fas fa-plus-circle"></i> Log Water Intake</h3>
      <div class="quick-add-buttons">
        <button class="water-btn" onclick="addWater(100)">
          <i class="fas fa-glass-water"></i> 100ml
        </button>
        <button class="water-btn" onclick="addWater(250)">
          <i class="fas fa-cup"></i> 250ml
        </button>
        <button class="water-btn" onclick="addWater(350)">
          <i class="fas fa-bottle-water"></i> 350ml
        </button>
        <button class="water-btn" onclick="addWater(500)">
          <i class="fas fa-bottle-droplet"></i> 500ml
        </button>
      </div>
      
      <div class="custom-add">
        <input type="number" id="customWater" class="form-control" placeholder="Custom amount (ml)" min="50" max="2000" step="50">
        <button class="btn" onclick="addCustomWater()">
          <i class="fas fa-plus"></i> Add
        </button>
      </div>
    </div>

    <!-- Today's Log -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-list"></i> Today's Water Log</h3>
        <button class="refresh-btn" onclick="loadWaterLogs()" title="Refresh">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="waterLogList"></div>
    </div>

    <!-- Hydration Tips -->
    <div class="card tips-card">
      <h3><i class="fas fa-lightbulb"></i> Hydration Tips</h3>
      <div class="tips-grid">
        <div class="tip">
          <i class="fas fa-clock"></i>
          <span>Drink water first thing in the morning</span>
        </div>
        <div class="tip">
          <i class="fas fa-utensils"></i>
          <span>Drink a glass before each meal</span>
        </div>
        <div class="tip">
          <i class="fas fa-person-walking"></i>
          <span>Carry a water bottle with you</span>
        </div>
        <div class="tip">
          <i class="fas fa-bell"></i>
          <span>Set reminders every 2 hours</span>
        </div>
      </div>
    </div>

    <!-- How It's Calculated -->
    <div class="card calculation-card">
      <h3><i class="fas fa-calculator"></i> How Your Goal Is Calculated</h3>
      <div id="calculationBreakdown"></div>
    </div>
  `;
  
  loadHydrationData();
}

function calculateHydrationGoal() {
  const gender = document.getElementById('gender').value;
  const age = parseInt(document.getElementById('age').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseInt(document.getElementById('height').value);
  const wakeTime = document.getElementById('wakeTime').value;
  const bedTime = document.getElementById('bedTime').value;
  
  if (!gender || !age || !weight || !height) {
    showToast('Please fill in all fields', true);
    return;
  }
  
  hydrationProfile = { gender, age, weight, height, wakeTime, bedTime };
  
  // Step 1: Base water from weight (30-35 ml per kg)
  let baseMin = weight * 30;
  let baseMax = weight * 35;
  
  // Step 2: Adjust by gender
  let recommended = 0;
  if (gender === 'male') {
    recommended = baseMax * 0.95; // Male: higher end
  } else {
    recommended = baseMin * 1.05; // Female: lower to mid range
  }
  
  // Step 3: Adjust by age
  let ageAdjustment = 0;
  if (age >= 31 && age <= 55) {
    ageAdjustment = -100;
  } else if (age >= 56) {
    ageAdjustment = -200;
  }
  recommended += ageAdjustment;
  
  // Step 4: Adjust by height
  let heightAdjustment = 0;
  if (height > 170) {
    heightAdjustment = Math.floor((height - 170) / 10) * 100;
  } else if (height < 160) {
    heightAdjustment = -Math.floor((160 - height) / 10) * 100;
  }
  recommended += heightAdjustment;
  
  // Step 5: Adjust by awake time
  const wakeParts = wakeTime.split(':');
  const bedParts = bedTime.split(':');
  const wakeHour = parseInt(wakeParts[0]) + parseInt(wakeParts[1]) / 60;
  let bedHour = parseInt(bedParts[0]) + parseInt(bedParts[1]) / 60;
  
  // Handle bedtime after midnight
  if (bedHour < wakeHour) {
    bedHour += 24;
  }
  
  const awakeHours = bedHour - wakeHour;
  const baselineHours = 16;
  const awakeAdjustment = Math.round((awakeHours - baselineHours) * 100);
  recommended += awakeAdjustment;
  
  // Set final values
  waterMin = Math.round(baseMin + ageAdjustment + heightAdjustment + awakeAdjustment);
  waterMax = Math.round(baseMax + ageAdjustment + heightAdjustment + awakeAdjustment);
  dailyWaterGoal = Math.round(recommended);
  
  // Ensure minimum values
  waterMin = Math.max(1500, waterMin);
  waterMax = Math.max(2000, waterMax);
  dailyWaterGoal = Math.max(1800, dailyWaterGoal);
  
  // Save profile
  localStorage.setItem('hydrofit_hydration_profile', JSON.stringify(hydrationProfile));
  localStorage.setItem('hydrofit_water_goal', dailyWaterGoal);
  localStorage.setItem('hydrofit_water_min', waterMin);
  localStorage.setItem('hydrofit_water_max', waterMax);
  
  // Update display
  updateWaterDisplay();
  showProfileSummary();
  showCalculationBreakdown(baseMin, baseMax, ageAdjustment, heightAdjustment, awakeAdjustment, awakeHours);
  
  document.getElementById('profileSetupCard').style.display = 'none';
  document.getElementById('waterGoalCard').style.display = 'block';
  document.getElementById('quickAddCard').style.display = 'block';
  
  showToast(`Daily water goal: ${dailyWaterGoal} ml 💧`, false);
}

function showProfileSummary() {
  const p = hydrationProfile;
  const summary = document.getElementById('profileSummary');
  
  const genderDisplay = p.gender === 'male' ? 'Male ♂️' : 'Female ♀️';
  const ageDisplay = `${p.age} years`;
  const weightDisplay = `${p.weight} kg`;
  const heightDisplay = `${p.height} cm`;
  const wakeDisplay = p.wakeTime;
  const bedDisplay = p.bedTime;
  
  summary.innerHTML = `
    <div class="summary-row">
      <span><i class="fas fa-venus-mars"></i> ${genderDisplay}</span>
      <span><i class="fas fa-calendar"></i> ${ageDisplay}</span>
    </div>
    <div class="summary-row">
      <span><i class="fas fa-weight-scale"></i> ${weightDisplay}</span>
      <span><i class="fas fa-ruler-vertical"></i> ${heightDisplay}</span>
    </div>
    <div class="summary-row">
      <span><i class="fas fa-sun"></i> Wake: ${wakeDisplay}</span>
      <span><i class="fas fa-moon"></i> Bed: ${bedDisplay}</span>
    </div>
  `;
}

function showCalculationBreakdown(baseMin, baseMax, ageAdj, heightAdj, awakeAdj, awakeHours) {
  const breakdown = document.getElementById('calculationBreakdown');
  const p = hydrationProfile;
  
  breakdown.innerHTML = `
    <div class="breakdown-steps">
      <div class="breakdown-step">
        <span class="step-label">Step 1: Base from weight</span>
        <span class="step-value">${p.weight} kg × 30-35 = ${Math.round(baseMin)}-${Math.round(baseMax)} ml</span>
      </div>
      <div class="breakdown-step">
        <span class="step-label">Step 2: Gender (${p.gender})</span>
        <span class="step-value">${p.gender === 'male' ? 'Higher end' : 'Lower to mid range'}</span>
      </div>
      <div class="breakdown-step">
        <span class="step-label">Step 3: Age adjustment</span>
        <span class="step-value ${ageAdj < 0 ? 'negative' : 'positive'}">${ageAdj > 0 ? '+' : ''}${ageAdj} ml</span>
      </div>
      <div class="breakdown-step">
        <span class="step-label">Step 4: Height adjustment</span>
        <span class="step-value ${heightAdj < 0 ? 'negative' : 'positive'}">${heightAdj > 0 ? '+' : ''}${heightAdj} ml</span>
      </div>
      <div class="breakdown-step">
        <span class="step-label">Step 5: Awake time (${awakeHours.toFixed(1)} hrs)</span>
        <span class="step-value ${awakeAdj < 0 ? 'negative' : 'positive'}">${awakeAdj > 0 ? '+' : ''}${awakeAdj} ml</span>
      </div>
      <div class="breakdown-step total">
        <span class="step-label">Final Goal Range</span>
        <span class="step-value">${waterMin} - ${waterMax} ml</span>
      </div>
      <div class="breakdown-step recommended">
        <span class="step-label">Recommended Daily Goal</span>
        <span class="step-value">${dailyWaterGoal} ml</span>
      </div>
    </div>
  `;
}

function editProfile() {
  document.getElementById('profileSetupCard').style.display = 'block';
  document.getElementById('waterGoalCard').style.display = 'none';
  document.getElementById('quickAddCard').style.display = 'none';
  
  // Pre-fill form
  document.getElementById('gender').value = hydrationProfile.gender;
  document.getElementById('age').value = hydrationProfile.age;
  document.getElementById('weight').value = hydrationProfile.weight;
  document.getElementById('height').value = hydrationProfile.height;
  document.getElementById('wakeTime').value = hydrationProfile.wakeTime;
  document.getElementById('bedTime').value = hydrationProfile.bedTime;
}

function updateWaterDisplay() {
  document.getElementById('dailyWaterGoal').innerText = dailyWaterGoal;
  document.getElementById('waterRange').innerText = `${waterMin} - ${waterMax} ml`;
  
  const remaining = Math.max(0, dailyWaterGoal - waterConsumed);
  document.getElementById('remainingWater').innerText = `${remaining} ml`;
  
  const percent = Math.min(100, Math.round((waterConsumed / dailyWaterGoal) * 100));
  document.getElementById('waterPercent').innerText = `${percent}%`;
  document.getElementById('consumedWater').innerText = waterConsumed;
  
  // Update circle
  const circle = document.getElementById('waterCircle');
  if (circle) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = percent >= 100 ? '#00b894' : '#00b4d8';
  }
}

function addWater(amount) {
  waterConsumed += amount;
  updateWaterDisplay();
  logWater(amount);
  saveWaterData();
  showToast(`Added ${amount} ml of water! 💧`, false);
}

function addCustomWater() {
  const amount = parseInt(document.getElementById('customWater').value);
  if (!amount || amount < 50) {
    showToast('Please enter at least 50 ml', true);
    return;
  }
  
  waterConsumed += amount;
  updateWaterDisplay();
  logWater(amount);
  saveWaterData();
  document.getElementById('customWater').value = '';
  showToast(`Added ${amount} ml of water! 💧`, false);
}

function logWater(amount) {
  const log = {
    id: Date.now(),
    amount: amount,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString().split('T')[0]
  };
  
  waterLogs.unshift(log);
  displayWaterLogs();
}

function displayWaterLogs() {
  const container = document.getElementById('waterLogList');
  
  // Filter today's logs
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = waterLogs.filter(log => log.date === today);
  
  if (todayLogs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-droplet"></i>
        <p>No water logged yet today</p>
        <p class="empty-hint">Start tracking your hydration!</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="water-log-list">';
  todayLogs.forEach(log => {
    html += `
      <div class="water-log-item">
        <div class="log-info">
          <i class="fas fa-droplet" style="color:#00b4d8"></i>
          <span class="log-amount">${log.amount} ml</span>
        </div>
        <span class="log-time">${log.time}</span>
        <button class="delete-log" onclick="deleteWaterLog('${log.id}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  });
  html += '</div>';
  
  // Total for today
  const totalToday = todayLogs.reduce((sum, log) => sum + log.amount, 0);
  html += `
    <div class="log-total">
      <span>Total Today:</span>
      <strong>${totalToday} ml</strong>
    </div>
  `;
  
  container.innerHTML = html;
}

function deleteWaterLog(id) {
  waterLogs = waterLogs.filter(log => log.id !== id);
  
  // Recalculate consumed
  const today = new Date().toISOString().split('T')[0];
  waterConsumed = waterLogs
    .filter(log => log.date === today)
    .reduce((sum, log) => sum + log.amount, 0);
  
  updateWaterDisplay();
  displayWaterLogs();
  saveWaterData();
  showToast('Entry removed', false);
}

function saveWaterData() {
  localStorage.setItem('hydrofit_water_logs', JSON.stringify(waterLogs));
  localStorage.setItem('hydrofit_water_consumed', waterConsumed);
  localStorage.setItem('hydrofit_water_date', new Date().toISOString().split('T')[0]);
}

function loadHydrationData() {
  // Load profile
  const savedProfile = localStorage.getItem('hydrofit_hydration_profile');
  if (savedProfile) {
    hydrationProfile = JSON.parse(savedProfile);
  }
  
  // Load goals
  const savedGoal = localStorage.getItem('hydrofit_water_goal');
  const savedMin = localStorage.getItem('hydrofit_water_min');
  const savedMax = localStorage.getItem('hydrofit_water_max');
  
  if (savedGoal) dailyWaterGoal = parseInt(savedGoal);
  if (savedMin) waterMin = parseInt(savedMin);
  if (savedMax) waterMax = parseInt(savedMax);
  
  // Load logs
  const savedLogs = localStorage.getItem('hydrofit_water_logs');
  if (savedLogs) {
    waterLogs = JSON.parse(savedLogs);
  }
  
  // Check if new day - reset consumed
  const savedDate = localStorage.getItem('hydrofit_water_date');
  const today = new Date().toISOString().split('T')[0];
  
  if (savedDate !== today) {
    waterConsumed = 0;
  } else {
    const savedConsumed = localStorage.getItem('hydrofit_water_consumed');
    if (savedConsumed) {
      waterConsumed = parseInt(savedConsumed);
    }
  }
  
  if (hydrationProfile.weight > 0) {
    updateWaterDisplay();
    showProfileSummary();
    displayWaterLogs();
    
    // Show calculation breakdown
    const p = hydrationProfile;
    const baseMin = p.weight * 30;
    const baseMax = p.weight * 35;
    
    let ageAdjustment = 0;
    if (p.age >= 31 && p.age <= 55) ageAdjustment = -100;
    else if (p.age >= 56) ageAdjustment = -200;
    
    let heightAdjustment = 0;
    if (p.height > 170) heightAdjustment = Math.floor((p.height - 170) / 10) * 100;
    else if (p.height < 160) heightAdjustment = -Math.floor((160 - p.height) / 10) * 100;
    
    const wakeParts = p.wakeTime.split(':');
    const bedParts = p.bedTime.split(':');
    const wakeHour = parseInt(wakeParts[0]) + parseInt(wakeParts[1]) / 60;
    let bedHour = parseInt(bedParts[0]) + parseInt(bedParts[1]) / 60;
    if (bedHour < wakeHour) bedHour += 24;
    const awakeHours = bedHour - wakeHour;
    const awakeAdjustment = Math.round((awakeHours - 16) * 100);
    
    showCalculationBreakdown(baseMin, baseMax, ageAdjustment, heightAdjustment, awakeAdjustment, awakeHours);
  }
}

function loadWaterLogs() {
  loadHydrationData();
  showToast('Logs refreshed! 🔄', false);
}

console.log("✅ Hydration Tracker Loaded");