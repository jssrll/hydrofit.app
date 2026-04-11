// ========================================
// HYDROFIT - CALORIE TRACKER (SHEETS SYNC)
// ========================================

let calorieRecords = [];
let dailyGoal = 2000;
let commonFoods = [
  { name: 'Rice (1 cup)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Egg (1 large)', calories: 72, protein: 6.3, carbs: 0.4, fat: 5 },
  { name: 'Banana (1 medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Apple (1 medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Oatmeal (1 cup cooked)', calories: 158, protein: 5.5, carbs: 27, fat: 3.2 },
  { name: 'Bread (1 slice)', calories: 79, protein: 3, carbs: 15, fat: 1 },
  { name: 'Milk (1 cup)', calories: 103, protein: 8, carbs: 12, fat: 2.4 },
  { name: 'Greek Yogurt (1 cup)', calories: 130, protein: 23, carbs: 9, fat: 0 },
  { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { name: 'Sweet Potato (1 medium)', calories: 103, protein: 2.3, carbs: 24, fat: 0.2 },
  { name: 'Pasta (1 cup cooked)', calories: 220, protein: 8, carbs: 43, fat: 1.3 },
  { name: 'Tuna (1 can)', calories: 132, protein: 29, carbs: 0, fat: 1 }
];

let recentFoods = [];
let selectedDate = new Date().toISOString().split('T')[0];

function renderCalorieTracker() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Calorie Tracker" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Daily Summary Card -->
    <div class="card calorie-summary-card">
      <div class="calorie-header">
        <div>
          <h3><i class="fas fa-fire"></i> Today's Calories</h3>
          <p id="selectedDateDisplay">${formatDisplayDate(selectedDate)}</p>
        </div>
        <button class="btn btn-outline btn-sm" onclick="changeDate()">
          <i class="fas fa-calendar-alt"></i> Change Date
        </button>
      </div>
      
      <div class="calorie-progress">
        <div class="progress-circle-container">
          <svg viewBox="0 0 100 100" class="calorie-circle">
            <circle cx="50" cy="50" r="45" class="circle-bg"/>
            <circle cx="50" cy="50" r="45" class="circle-fill" id="calorieCircle"/>
          </svg>
          <div class="circle-content">
            <span class="consumed-calories" id="consumedCalories">0</span>
            <span class="goal-calories">/ <span id="dailyGoal">2000</span></span>
          </div>
        </div>
        <div class="calorie-stats">
          <div class="stat-item">
            <span class="stat-label">Remaining</span>
            <span class="stat-value" id="remainingCalories">2000</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Goal</span>
            <span class="stat-value" id="goalDisplay">2000</span>
          </div>
        </div>
      </div>
      
      <button class="btn btn-outline" onclick="openGoalModal()" style="width:100%;margin-top:16px">
        <i class="fas fa-bullseye"></i> Set Daily Goal
      </button>
    </div>

    <!-- Quick Add Food -->
    <div class="card">
      <h3><i class="fas fa-plus-circle"></i> Add Food</h3>
      
      <!-- Search Food -->
      <div class="food-search">
        <input type="text" id="foodSearch" class="form-control" placeholder="Search food..." oninput="searchFood()">
        <div id="searchResults" class="search-results"></div>
      </div>
      
      <!-- Recent Foods -->
      <div class="recent-foods" id="recentFoods"></div>
      
      <!-- Quick Add Common Foods -->
      <div class="common-foods">
        <h4>Common Foods</h4>
        <div class="common-foods-grid" id="commonFoods"></div>
      </div>
      
      <!-- Custom Food Input -->
      <div class="custom-food">
        <button class="btn btn-outline" onclick="openCustomFoodModal()" style="width:100%">
          <i class="fas fa-utensils"></i> Add Custom Food
        </button>
      </div>
    </div>

    <!-- Today's Food Log -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-list"></i> Today's Consumed</h3>
        <button class="refresh-btn" onclick="loadCalorieRecords()" title="Refresh">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="foodLog"></div>
      <div class="food-log-summary" id="foodLogSummary"></div>
    </div>

    <!-- Nutrition Summary -->
    <div class="card">
      <h3><i class="fas fa-chart-pie"></i> Nutrition Summary</h3>
      <div class="nutrition-stats">
        <div class="nutrition-item">
          <span class="nutrition-label">Protein</span>
          <span class="nutrition-value" id="totalProtein">0g</span>
          <div class="nutrition-bar">
            <div class="nutrition-fill protein" id="proteinBar" style="width:0%"></div>
          </div>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-label">Carbs</span>
          <span class="nutrition-value" id="totalCarbs">0g</span>
          <div class="nutrition-bar">
            <div class="nutrition-fill carbs" id="carbsBar" style="width:0%"></div>
          </div>
        </div>
        <div class="nutrition-item">
          <span class="nutrition-label">Fat</span>
          <span class="nutrition-value" id="totalFat">0g</span>
          <div class="nutrition-bar">
            <div class="nutrition-fill fat" id="fatBar" style="width:0%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Progress Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Weekly Progress</h3>
      <div id="weeklyChart"></div>
    </div>

    <!-- History -->
    <div class="card">
      <h3><i class="fas fa-history"></i> Recent History</h3>
      <div id="calorieHistory"></div>
    </div>

    <!-- Custom Food Modal -->
    <div id="customFoodModal" class="modal" style="display:none">
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-utensils"></i>
          <h3>Add Custom Food</h3>
        </div>
        <div class="modal-body">
          <input type="text" id="customFoodName" class="modal-input" placeholder="Food name">
          <input type="number" id="customCalories" class="modal-input" placeholder="Calories">
          <input type="number" id="customProtein" class="modal-input" placeholder="Protein (g)" value="0">
          <input type="number" id="customCarbs" class="modal-input" placeholder="Carbs (g)" value="0">
          <input type="number" id="customFat" class="modal-input" placeholder="Fat (g)" value="0">
          <button class="modal-btn" onclick="addCustomFood()">Add Food</button>
          <button class="modal-btn btn-outline" onclick="closeCustomFoodModal()">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Goal Modal -->
    <div id="goalModal" class="modal" style="display:none">
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-bullseye"></i>
          <h3>Set Daily Calorie Goal</h3>
        </div>
        <div class="modal-body">
          <input type="number" id="newGoal" class="modal-input" placeholder="Calories per day" value="${dailyGoal}">
          <button class="modal-btn" onclick="saveGoal()">Save Goal</button>
          <button class="modal-btn btn-outline" onclick="closeGoalModal()">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  displayCommonFoods();
  displayRecentFoods();
  loadCalorieRecords();
  loadGoal();
}

function formatDisplayDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function changeDate() {
  const newDate = prompt('Enter date (YYYY-MM-DD):', selectedDate);
  if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    selectedDate = newDate;
    document.getElementById('selectedDateDisplay').innerText = formatDisplayDate(selectedDate);
    loadCalorieRecords();
  }
}

function displayCommonFoods() {
  const container = document.getElementById('commonFoods');
  let html = '';
  commonFoods.slice(0, 6).forEach(food => {
    html += `
      <div class="common-food-item" onclick="quickAddFood('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
        <span class="food-name">${food.name}</span>
        <span class="food-calories">${food.calories} cal</span>
      </div>
    `;
  });
  container.innerHTML = html;
}

function displayRecentFoods() {
  const container = document.getElementById('recentFoods');
  if (recentFoods.length === 0) return;
  
  let html = '<h4>Recent Foods</h4><div class="recent-foods-grid">';
  recentFoods.slice(0, 4).forEach(food => {
    html += `
      <div class="recent-food-item" onclick="quickAddFood('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
        <span>${food.name}</span>
        <span>${food.calories} cal</span>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function searchFood() {
  const query = document.getElementById('foodSearch').value.toLowerCase();
  const resultsDiv = document.getElementById('searchResults');
  
  if (query.length < 2) {
    resultsDiv.innerHTML = '';
    resultsDiv.style.display = 'none';
    return;
  }
  
  const results = commonFoods.filter(f => f.name.toLowerCase().includes(query));
  
  if (results.length === 0) {
    resultsDiv.innerHTML = '<div class="search-item">No results found</div>';
  } else {
    let html = '';
    results.forEach(food => {
      html += `
        <div class="search-item" onclick="quickAddFood('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
          <span>${food.name}</span>
          <span>${food.calories} cal</span>
        </div>
      `;
    });
    resultsDiv.innerHTML = html;
  }
  resultsDiv.style.display = 'block';
}

async function quickAddFood(name, calories, protein, carbs, fat) {
  await saveFoodEntry(name, calories, protein, carbs, fat);
  
  // Add to recent foods
  const foodData = { name, calories, protein, carbs, fat };
  recentFoods = [foodData, ...recentFoods.filter(f => f.name !== name)].slice(0, 8);
  localStorage.setItem('hydrofit_recent_foods_' + window.currentUser?.schoolId, JSON.stringify(recentFoods));
  
  document.getElementById('foodSearch').value = '';
  document.getElementById('searchResults').style.display = 'none';
  displayRecentFoods();
}

async function saveFoodEntry(name, calories, protein, carbs, fat) {
  const entry = {
    id: 'CAL' + Date.now(),
    name,
    calories,
    protein,
    carbs,
    fat,
    date: selectedDate,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
  
  try {
    await callAPI('saveCalorieEntry', {
      schoolId: window.currentUser.schoolId,
      entryData: JSON.stringify(entry)
    });
    
    showToast(`${name} added!`, false);
    loadCalorieRecords();
  } catch (error) {
    console.error('Error saving food:', error);
    showToast('Failed to save food', true);
  }
}

async function loadCalorieRecords() {
  try {
    const result = await callAPI('getCalorieEntries', { 
      schoolId: window.currentUser.schoolId,
      date: selectedDate
    });
    
    if (result.success && result.entries) {
      calorieRecords = result.entries.filter(e => e.date === selectedDate);
    } else {
      calorieRecords = [];
    }
    
    updateDisplay();
    loadWeeklyData();
    loadHistory();
  } catch (error) {
    console.error('Error loading records:', error);
    calorieRecords = [];
    updateDisplay();
  }
}

function updateDisplay() {
  const totalCalories = calorieRecords.reduce((sum, e) => sum + parseFloat(e.calories), 0);
  const totalProtein = calorieRecords.reduce((sum, e) => sum + parseFloat(e.protein || 0), 0);
  const totalCarbs = calorieRecords.reduce((sum, e) => sum + parseFloat(e.carbs || 0), 0);
  const totalFat = calorieRecords.reduce((sum, e) => sum + parseFloat(e.fat || 0), 0);
  
  document.getElementById('consumedCalories').innerText = totalCalories;
  document.getElementById('remainingCalories').innerText = Math.max(0, dailyGoal - totalCalories);
  document.getElementById('totalProtein').innerText = Math.round(totalProtein) + 'g';
  document.getElementById('totalCarbs').innerText = Math.round(totalCarbs) + 'g';
  document.getElementById('totalFat').innerText = Math.round(totalFat) + 'g';
  
  // Update progress circle
  const percent = Math.min(100, (totalCalories / dailyGoal) * 100);
  const circle = document.getElementById('calorieCircle');
  if (circle) {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = totalCalories > dailyGoal ? '#d63031' : '#00b894';
  }
  
  // Update nutrition bars
  document.getElementById('proteinBar').style.width = Math.min(100, (totalProtein / 150) * 100) + '%';
  document.getElementById('carbsBar').style.width = Math.min(100, (totalCarbs / 300) * 100) + '%';
  document.getElementById('fatBar').style.width = Math.min(100, (totalFat / 65) * 100) + '%';
  
  // Alert if limit reached
  if (totalCalories >= dailyGoal) {
    document.getElementById('remainingCalories').style.color = '#d63031';
  }
  
  displayFoodLog();
}

function displayFoodLog() {
  const container = document.getElementById('foodLog');
  
  if (calorieRecords.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-utensils"></i>
        <p>No foods logged yet</p>
        <p class="empty-hint">Add your first meal above</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="food-log-list">';
  calorieRecords.sort((a, b) => b.time.localeCompare(a.time));
  
  calorieRecords.forEach(entry => {
    html += `
      <div class="food-log-item">
        <div class="food-log-info">
          <span class="food-log-name">${entry.name}</span>
          <span class="food-log-time">${entry.time}</span>
        </div>
        <div class="food-log-calories">${entry.calories} cal</div>
        <button class="delete-food" onclick="deleteFoodEntry('${entry.id}')">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

async function deleteFoodEntry(id) {
  if (!confirm('Remove this food entry?')) return;
  
  await callAPI('deleteCalorieEntry', { entryId: id });
  loadCalorieRecords();
  showToast('Entry removed', false);
}

function openCustomFoodModal() {
  document.getElementById('customFoodModal').style.display = 'flex';
}

function closeCustomFoodModal() {
  document.getElementById('customFoodModal').style.display = 'none';
}

async function addCustomFood() {
  const name = document.getElementById('customFoodName').value;
  const calories = parseFloat(document.getElementById('customCalories').value);
  const protein = parseFloat(document.getElementById('customProtein').value) || 0;
  const carbs = parseFloat(document.getElementById('customCarbs').value) || 0;
  const fat = parseFloat(document.getElementById('customFat').value) || 0;
  
  if (!name || !calories) {
    showToast('Please enter food name and calories', true);
    return;
  }
  
  await saveFoodEntry(name, calories, protein, carbs, fat);
  closeCustomFoodModal();
  
  document.getElementById('customFoodName').value = '';
  document.getElementById('customCalories').value = '';
  document.getElementById('customProtein').value = '0';
  document.getElementById('customCarbs').value = '0';
  document.getElementById('customFat').value = '0';
}

function openGoalModal() {
  document.getElementById('newGoal').value = dailyGoal;
  document.getElementById('goalModal').style.display = 'flex';
}

function closeGoalModal() {
  document.getElementById('goalModal').style.display = 'none';
}

function saveGoal() {
  const newGoal = parseInt(document.getElementById('newGoal').value);
  if (newGoal && newGoal > 0) {
    dailyGoal = newGoal;
    document.getElementById('dailyGoal').innerText = dailyGoal;
    document.getElementById('goalDisplay').innerText = dailyGoal;
    localStorage.setItem('hydrofit_calorie_goal_' + window.currentUser?.schoolId, dailyGoal);
    updateDisplay();
    closeGoalModal();
    showToast('Daily goal updated!', false);
  }
}

function loadGoal() {
  const stored = localStorage.getItem('hydrofit_calorie_goal_' + window.currentUser?.schoolId);
  if (stored) {
    dailyGoal = parseInt(stored);
    document.getElementById('dailyGoal').innerText = dailyGoal;
    document.getElementById('goalDisplay').innerText = dailyGoal;
  }
  
  const storedRecent = localStorage.getItem('hydrofit_recent_foods_' + window.currentUser?.schoolId);
  if (storedRecent) {
    recentFoods = JSON.parse(storedRecent);
  }
}

async function loadWeeklyData() {
  try {
    const result = await callAPI('getWeeklyCalories', { 
      schoolId: window.currentUser.schoolId 
    });
    
    if (result.success && result.weeklyData) {
      displayWeeklyChart(result.weeklyData);
    }
  } catch (error) {
    console.error('Error loading weekly data:', error);
  }
}

function displayWeeklyChart(data) {
  const container = document.getElementById('weeklyChart');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxCalories = Math.max(...data.map(d => d.calories), dailyGoal);
  
  let html = '<div class="weekly-bars">';
  data.forEach((day, i) => {
    const height = (day.calories / maxCalories) * 150;
    const isOver = day.calories > dailyGoal;
    
    html += `
      <div class="weekly-bar-item">
        <div class="bar-container">
          <div class="bar ${isOver ? 'over' : ''}" style="height:${Math.max(10, height)}px">
            <span class="bar-value">${day.calories}</span>
          </div>
        </div>
        <span class="bar-label">${days[i]}</span>
      </div>
    `;
  });
  html += '</div>';
  
  html += '<div class="weekly-goal-line" style="bottom:' + (dailyGoal / maxCalories * 150) + 'px">Goal</div>';
  container.innerHTML = html;
}

async function loadHistory() {
  try {
    const result = await callAPI('getCalorieHistory', { 
      schoolId: window.currentUser.schoolId 
    });
    
    if (result.success && result.history) {
      displayHistory(result.history);
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

function displayHistory(history) {
  const container = document.getElementById('calorieHistory');
  
  if (history.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center">No history yet</p>';
    return;
  }
  
  let html = '<div class="history-list">';
  history.slice(0, 5).forEach(day => {
    html += `
      <div class="history-item" onclick="viewHistoryDate('${day.date}')">
        <span>${formatDisplayDate(day.date)}</span>
        <span style="font-weight:600">${day.calories} / ${dailyGoal} cal</span>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function viewHistoryDate(date) {
  selectedDate = date;
  document.getElementById('selectedDateDisplay').innerText = formatDisplayDate(selectedDate);
  loadCalorieRecords();
}

console.log("✅ Calorie Tracker Loaded");