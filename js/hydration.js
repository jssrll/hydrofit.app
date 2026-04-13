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

function renderHydration() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Orange%20Black%20Dynamic%20GYM%20Fitness%20Presentation.png" alt="Hydration Tracker" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Profile Setup Card -->
    <div class="card profile-setup-card" id="profileSetupCard">
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

    <!-- Results Container (shown after calculation) -->
    <div id="resultsContainer" style="display: none;"></div>
  `;
  
  // Check if profile already exists
  const savedProfile = localStorage.getItem('hydrofit_hydration_profile');
  if (savedProfile) {
    hydrationProfile = JSON.parse(savedProfile);
    const savedGoal = localStorage.getItem('hydrofit_water_goal');
    if (savedGoal) {
      dailyWaterGoal = parseInt(savedGoal);
      waterMin = parseInt(localStorage.getItem('hydrofit_water_min') || dailyWaterGoal - 200);
      waterMax = parseInt(localStorage.getItem('hydrofit_water_max') || dailyWaterGoal + 200);
      
      // Pre-fill form
      document.getElementById('gender').value = hydrationProfile.gender;
      document.getElementById('age').value = hydrationProfile.age;
      document.getElementById('weight').value = hydrationProfile.weight;
      document.getElementById('height').value = hydrationProfile.height;
      document.getElementById('wakeTime').value = hydrationProfile.wakeTime;
      document.getElementById('bedTime').value = hydrationProfile.bedTime;
      
      // Show results
      displayResults();
    }
  }
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
    recommended = baseMax * 0.95;
  } else {
    recommended = baseMin * 1.05;
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
  
  // Display results
  displayResults();
  
  showToast(`Daily water goal calculated! 💧`, false);
}

function displayResults() {
  const container = document.getElementById('resultsContainer');
  const p = hydrationProfile;
  
  // Calculate glasses (1 glass = 250ml)
  const glassesLow = Math.round(waterMin / 250 * 10) / 10;
  const glassesHigh = Math.round(waterMax / 250 * 10) / 10;
  const glassesGoal = Math.round(dailyWaterGoal / 250 * 10) / 10;
  
  container.innerHTML = `
    <!-- Daily Water Goal Display -->
    <div class="card result-card">
      <div class="result-header">
        <i class="fas fa-droplet"></i>
        <h2>Your Daily Water Goal</h2>
      </div>
      
      <div class="goal-display-large">
        <div class="goal-number">${dailyWaterGoal} ml</div>
        <div class="goal-range">Recommended Range: ${waterMin} - ${waterMax} ml</div>
        <div class="goal-glasses">
          <i class="fas fa-glass-water"></i> 
          About ${glassesGoal} glasses of water (250ml each)
        </div>
      </div>
      
      <div class="profile-badges">
        <div class="badge">
          <i class="fas fa-venus-mars"></i>
          <span>${p.gender === 'male' ? 'Male' : 'Female'}</span>
        </div>
        <div class="badge">
          <i class="fas fa-calendar"></i>
          <span>${p.age} years</span>
        </div>
        <div class="badge">
          <i class="fas fa-weight-scale"></i>
          <span>${p.weight} kg</span>
        </div>
        <div class="badge">
          <i class="fas fa-ruler-vertical"></i>
          <span>${p.height} cm</span>
        </div>
      </div>
      
      <button class="btn btn-outline" onclick="resetProfile()" style="width:100%;margin-top:16px">
        <i class="fas fa-edit"></i> Recalculate
      </button>
    </div>

    <!-- Importance of Hydration -->
    <div class="card importance-card">
      <h3><i class="fas fa-heart"></i> Why Hydration Matters</h3>
      <div class="importance-grid">
        <div class="importance-item">
          <div class="importance-icon">💪</div>
          <h4>Boosts Performance</h4>
          <p>Proper hydration improves strength, power, and endurance during workouts</p>
        </div>
        <div class="importance-item">
          <div class="importance-icon">🧠</div>
          <h4>Sharpens Focus</h4>
          <p>Even mild dehydration can impair concentration and cognitive function</p>
        </div>
        <div class="importance-item">
          <div class="importance-icon">🔥</div>
          <h4>Aids Metabolism</h4>
          <p>Water helps your body burn calories more efficiently</p>
        </div>
        <div class="importance-item">
          <div class="importance-icon">🛡️</div>
          <h4>Prevents Cramps</h4>
          <p>Staying hydrated reduces muscle cramps and joint pain</p>
        </div>
      </div>
    </div>

    <!-- Benefits of Reaching Goal -->
    <div class="card benefits-card">
      <h3><i class="fas fa-star"></i> Benefits of Reaching Your Daily Goal</h3>
      <div class="benefits-list">
        <div class="benefit">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Better Skin Health</strong>
            <p>Hydrated skin looks more radiant and youthful</p>
          </div>
        </div>
        <div class="benefit">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Improved Digestion</strong>
            <p>Water helps break down food and prevents constipation</p>
          </div>
        </div>
        <div class="benefit">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Body Temperature Regulation</strong>
            <p>Essential for cooling down during exercise</p>
          </div>
        </div>
        <div class="benefit">
          <i class="fas fa-check-circle"></i>
          <div>
            <strong>Nutrient Transport</strong>
            <p>Helps deliver essential nutrients throughout your body</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hydration Tips -->
    <div class="card tips-card">
      <h3><i class="fas fa-lightbulb"></i> Tips to Reach Your Goal</h3>
      <div class="tips-grid">
        <div class="tip">
          <span class="tip-number">1</span>
          <div>
            <strong>Start Early</strong>
            <p>Drink a glass of water right after waking up</p>
          </div>
        </div>
        <div class="tip">
          <span class="tip-number">2</span>
          <div>
            <strong>Use a Bottle</strong>
            <p>Carry a reusable water bottle everywhere you go</p>
          </div>
        </div>
        <div class="tip">
          <span class="tip-number">3</span>
          <div>
            <strong>Set Reminders</strong>
            <p>Use your phone to remind you every 1-2 hours</p>
          </div>
        </div>
        <div class="tip">
          <span class="tip-number">4</span>
          <div>
            <strong>Drink Before Meals</strong>
            <p>Have a glass 30 minutes before each meal</p>
          </div>
        </div>
        <div class="tip">
          <span class="tip-number">5</span>
          <div>
            <strong>Eat Water-Rich Foods</strong>
            <p>Cucumber, watermelon, oranges, and celery</p>
          </div>
        </div>
        <div class="tip">
          <span class="tip-number">6</span>
          <div>
            <strong>Track Your Intake</strong>
            <p>Keep a mental note or use a tracking app</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Signs of Dehydration -->
    <div class="card warning-card">
      <h3><i class="fas fa-exclamation-triangle"></i> Signs You Need More Water</h3>
      <div class="signs-grid">
        <div class="sign">
          <i class="fas fa-tint"></i>
          <span>Dark yellow urine</span>
        </div>
        <div class="sign">
          <i class="fas fa-head-side-virus"></i>
          <span>Headaches</span>
        </div>
        <div class="sign">
          <i class="fas fa-face-tired"></i>
          <span>Fatigue or dizziness</span>
        </div>
        <div class="sign">
          <i class="fas fa-mouth"></i>
          <span>Dry mouth or bad breath</span>
        </div>
        <div class="sign">
          <i class="fas fa-brain"></i>
          <span>Difficulty concentrating</span>
        </div>
        <div class="sign">
          <i class="fas fa-person-walking"></i>
          <span>Muscle cramps</span>
        </div>
      </div>
    </div>
  `;
  
  container.style.display = 'block';
  
  // Scroll to results
  setTimeout(() => {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function resetProfile() {
  document.getElementById('resultsContainer').style.display = 'none';
  showToast('You can update your profile above', false);
}

console.log("✅ Hydration Tracker Loaded");