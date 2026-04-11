// ========================================
// HYDROFIT - CALORIE TRACKER (SHEETS SYNC)
// ========================================

let calorieRecords = [];
let dailyGoal = 2000;
let selectedDate = new Date().toISOString().split('T')[0];

const commonFoods = [
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
            <span class="goal-calories">/ <span id="dailyGoal">${dailyGoal}</span></span>
          </div>
        </div>
        <div class="calorie-stats">
          <div class="stat-item">
            <span class="stat-label">Remaining</span>
            <span class="stat-value" id="remainingCalories">${dailyGoal}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Goal</span>
            <span class="stat-value" id="goalDisplay">${dailyGoal}</span>
          </div>
        </div>
      </div>
      
      <button class="btn btn-outline" onclick="openGoalModal()" style="width:100%;margin-top:16px">
        <i class="fas fa-bullseye"></i> Set Daily Goal
      </button>
    </div>

    <!-- Add Food -->
    <div class="card">
      <h3><i class="fas fa-plus-circle"></i> Add Food</h3>
      
      <!-- Search Food -->
      <div class="food-search">
        <input type="text" id="foodSearch" class="form-control" placeholder="Search food..." oninput="searchFood()">
        <div id="searchResults" class="search-results"></div>
      </div>
      
      <!-- Common Foods -->
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

    <!-- Daily Progress Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Daily Progress</h3>
      <div id="dailyChartContainer" style="position:relative;height:250px;">
        <canvas id="dailyChart" style="width:100%;height:100%"></canvas>
      </div>
    </div>

    <!-- Daily History -->
    <div class="card">
      <h3><i class="fas fa-history"></i> Daily History</h3>
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
          <input type="number" id="customCalories" class="modal-input" placeholder="Calories (required)">
          <input type="number" id="customProtein" class="modal-input" placeholder="Protein (g)">
          <input type="number" id="customCarbs" class="modal-input" placeholder="Carbs (g)">
          <input type="number" id="customFat" class="modal-input" placeholder="Fat (g)">
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
  commonFoods.slice(0, 8).forEach(food => {
    html += `
      <div class="common-food-item" onclick="quickAddFood('${food.name}', ${food.calories}, ${food.protein}, ${food.carbs}, ${food.fat})">
        <span class="food-name">${food.name}</span>
        <span class="food-calories">${food.calories} cal</span>
      </div>
    `;
  });
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
  
  document.getElementById('foodSearch').value = '';
  document.getElementById('searchResults').style.display = 'none';
}

async function saveFoodEntry(name, calories, protein, carbs, fat) {
  const entry = {
    id: 'CAL' + Date.now(),
    name,
    calories: parseFloat(calories),
    protein: parseFloat(protein) || 0,
    carbs: parseFloat(carbs) || 0,
    fat: parseFloat(fat) || 0,
    date: selectedDate,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
  
  try {
    const result = await callAPI('saveCalorieEntry', {
      schoolId: window.currentUser.schoolId,
      entryData: JSON.stringify(entry)
    });
    
    if (result.success) {
      showToast(`${name} added!`, false);
      loadCalorieRecords();
    }
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
    loadDailyHistory();
    drawDailyChart();
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
  const proteinPercent = Math.min(100, (totalProtein / 150) * 100);
  const carbsPercent = Math.min(100, (totalCarbs / 300) * 100);
  const fatPercent = Math.min(100, (totalFat / 65) * 100);
  
  document.getElementById('proteinBar').style.width = proteinPercent + '%';
  document.getElementById('carbsBar').style.width = carbsPercent + '%';
  document.getElementById('fatBar').style.width = fatPercent + '%';
  
  // Alert if limit reached
  if (totalCalories >= dailyGoal) {
    document.getElementById('remainingCalories').style.color = '#d63031';
  } else {
    document.getElementById('remainingCalories').style.color = '#00b894';
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
          <div class="food-log-macros">
            <span>P: ${Math.round(entry.protein || 0)}g</span>
            <span>C: ${Math.round(entry.carbs || 0)}g</span>
            <span>F: ${Math.round(entry.fat || 0)}g</span>
          </div>
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
  document.getElementById('customFoodName').value = '';
  document.getElementById('customCalories').value = '';
  document.getElementById('customProtein').value = '';
  document.getElementById('customCarbs').value = '';
  document.getElementById('customFat').value = '';
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
}

async function loadDailyHistory() {
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
  history.slice(0, 7).forEach(day => {
    const isOver = day.calories > dailyGoal;
    html += `
      <div class="history-item" onclick="viewHistoryDate('${day.date}')">
        <div>
          <span class="history-date">${formatDisplayDate(day.date)}</span>
          <span class="history-calories ${isOver ? 'over' : ''}">${day.calories} cal</span>
        </div>
        <span class="history-goal">/ ${dailyGoal} cal</span>
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

function drawDailyChart() {
  const canvas = document.getElementById('dailyChart');
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
  
  // Get last 7 days of data
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayRecords = calorieRecords.filter(r => r.date === dateStr);
    const calories = dayRecords.reduce((sum, r) => sum + parseFloat(r.calories), 0);
    chartData.push({
      date: dateStr,
      calories: calories,
      label: date.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }
  
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const maxCalories = Math.max(dailyGoal, ...chartData.map(d => d.calories)) + 200;
  
  // Draw goal line
  const goalY = padding.top + chartHeight - (dailyGoal / maxCalories) * chartHeight;
  ctx.beginPath();
  ctx.strokeStyle = '#d63031';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.moveTo(padding.left, goalY);
  ctx.lineTo(width - padding.right, goalY);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw goal label
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = '#d63031';
  ctx.textAlign = 'right';
  ctx.fillText('Goal', padding.left - 5, goalY + 3);
  
  // Draw bars
  const barWidth = (chartWidth / chartData.length) * 0.7;
  
  chartData.forEach((d, i) => {
    const x = padding.left + (i / chartData.length) * chartWidth + (chartWidth / chartData.length - barWidth) / 2;
    const barHeight = (d.calories / maxCalories) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    
    // Bar color
    ctx.fillStyle = d.calories > dailyGoal ? '#e17055' : '#00b894';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Bar value
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'center';
    ctx.fillText(d.calories, x + barWidth / 2, y - 5);
    
    // Date label
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(d.label, x + barWidth / 2, height - 20);
  });
  
  // Y-axis labels
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 4; i++) {
    const value = Math.round((i / 4) * maxCalories);
    const y = padding.top + chartHeight - (i / 4) * chartHeight;
    ctx.fillText(value, padding.left - 8, y + 3);
  }
}

console.log("✅ Calorie Tracker Loaded");