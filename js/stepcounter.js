// ========================================
// HYDROFIT - STEP COUNTER (STANDALONE)
// ========================================

console.log("✅ Step Counter loading...");

// Initialize variables
if (typeof window.stepCounterInitialized === 'undefined') {
  window.stepCounterInitialized = true;
  window.stepCount = 0;
  window.dailyGoal = 10000;
  window.isTracking = false;
  window.stepHistory = [];
}

// Safe render function
function renderStepCounter() {
  console.log("🎯 renderStepCounter called");
  
  try {
    const container = document.getElementById("tabContent");
    if (!container) {
      console.error("Container not found");
      return;
    }
    
    const goal = window.dailyGoal || 10000;
    const steps = window.stepCount || 0;
    
    container.innerHTML = `
      <div style="margin-bottom:20px">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Step Counter" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
      </div>

      <div class="card">
        <h3><i class="fas fa-bullseye"></i> Daily Step Goal</h3>
        <div style="display:flex;gap:12px">
          <input type="number" id="stepGoalInput" value="${goal}" min="1000" max="50000" step="1000" style="flex:1;padding:12px;border-radius:12px;border:1px solid #ddd">
          <button onclick="window.setGoal()" style="padding:12px 24px;background:#00b4d8;color:white;border:none;border-radius:12px;font-weight:600">Set Goal</button>
        </div>
      </div>

      <div class="card" style="text-align:center">
        <h3><i class="fas fa-shoe-prints"></i> Today's Steps</h3>
        <div style="display:flex;justify-content:center;margin:20px 0">
          <div style="position:relative;width:150px;height:150px">
            <svg viewBox="0 0 100 100" style="transform:rotate(-90deg)">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e7ff" stroke-width="8"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#00b4d8" stroke-width="8" stroke-dasharray="283" stroke-dashoffset="${283 - (Math.min(100, (steps/goal)*100) / 100) * 283}" stroke-linecap="round"/>
            </svg>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
              <div style="font-size:32px;font-weight:800;color:#023e8a">${steps.toLocaleString()}</div>
              <div style="font-size:12px;color:#64748b">/ ${goal.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <div style="display:flex;justify-content:space-around;margin:20px 0">
          <div><small style="color:#64748b">Distance</small><br><strong>${(steps * 0.000762).toFixed(2)} km</strong></div>
          <div><small style="color:#64748b">Calories</small><br><strong>${Math.round(steps * 0.04)}</strong></div>
          <div><small style="color:#64748b">Minutes</small><br><strong>${Math.round(steps / 100)}</strong></div>
        </div>
        
        <div style="display:flex;gap:10px;margin-top:20px">
          <button onclick="window.addStepsManually()" style="flex:1;padding:12px;background:transparent;border:2px solid #00b4d8;color:#00b4d8;border-radius:30px;font-weight:600">
            <i class="fas fa-plus"></i> Add Steps
          </button>
          <button onclick="window.resetStepsCounter()" style="flex:1;padding:12px;background:transparent;border:2px solid #d63031;color:#d63031;border-radius:30px;font-weight:600">
            <i class="fas fa-undo-alt"></i> Reset
          </button>
        </div>
      </div>

      <div class="card">
        <h3><i class="fas fa-history"></i> How to Track Steps</h3>
        <p style="color:#64748b;margin-bottom:16px">Use the manual entry to log your steps from your phone's health app or fitness tracker.</p>
        <div style="background:#f0f9ff;padding:16px;border-radius:12px">
          <p><i class="fas fa-info-circle" style="color:#00b4d8"></i> <strong>Tip:</strong> Most smartphones have a built-in step counter. Check your Health app (iPhone) or Google Fit (Android) and manually enter your steps here.</p>
        </div>
      </div>
    `;
    
    console.log("✅ Step Counter rendered successfully");
    
  } catch (error) {
    console.error("❌ Error rendering step counter:", error);
    const container = document.getElementById("tabContent");
    if (container) {
      container.innerHTML = '<div class="card"><p style="color:#d63031">Error loading step counter. Please refresh.</p></div>';
    }
  }
}

// Simple functions that won't freeze
window.setGoal = function() {
  try {
    const input = document.getElementById('stepGoalInput');
    if (input) {
      const newGoal = parseInt(input.value);
      if (newGoal && newGoal >= 1000) {
        window.dailyGoal = newGoal;
        localStorage.setItem('step_goal', newGoal);
        alert('✅ Daily goal set to ' + newGoal.toLocaleString() + ' steps!');
        renderStepCounter();
      }
    }
  } catch(e) {
    console.error(e);
  }
};

window.addStepsManually = function() {
  try {
    const steps = prompt('Enter number of steps to add:', '1000');
    if (steps !== null) {
      const stepNum = parseInt(steps);
      if (stepNum > 0) {
        window.stepCount += stepNum;
        localStorage.setItem('step_count', window.stepCount);
        renderStepCounter();
        alert('✅ Added ' + stepNum.toLocaleString() + ' steps!');
      }
    }
  } catch(e) {
    console.error(e);
  }
};

window.resetStepsCounter = function() {
  try {
    if (confirm('Reset today\'s steps to 0?')) {
      window.stepCount = 0;
      localStorage.setItem('step_count', 0);
      renderStepCounter();
      alert('✅ Steps reset to 0');
    }
  } catch(e) {
    console.error(e);
  }
};

// Load saved data
(function() {
  try {
    const savedGoal = localStorage.getItem('step_goal');
    if (savedGoal) window.dailyGoal = parseInt(savedGoal);
    
    const savedSteps = localStorage.getItem('step_count');
    if (savedSteps) window.stepCount = parseInt(savedSteps);
    
    // Reset at midnight
    const lastDate = localStorage.getItem('step_date');
    const today = new Date().toDateString();
    if (lastDate !== today) {
      window.stepCount = 0;
      localStorage.setItem('step_date', today);
      localStorage.setItem('step_count', 0);
    }
  } catch(e) {
    console.error(e);
  }
})();

console.log("✅ Step Counter module loaded");