// ========================================
// HYDROFIT - DAILY WORKOUT SCHEDULER (SHEETS SYNC)
// ========================================

let workoutSchedule = [];
let dailyChecklist = [];
let reminderPermission = false;

const workoutTypes = [
  'Cardio', 'Strength Training', 'HIIT', 'Flexibility/Yoga', 
  'Leg Day', 'Upper Body', 'Core Workout', 'Full Body',
  'Rest Day', 'Active Recovery'
];

function renderScheduler() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Workout Scheduler" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Schedule Setup -->
    <div class="card">
      <h3><i class="fas fa-calendar-plus"></i> Set Your Workout Schedule</h3>
      <p style="color:#64748b;margin-bottom:20px">Plan your week and stay consistent</p>
      
      <div class="schedule-form">
        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-calendar-day"></i> Day of Week</label>
            <select id="scheduleDay" class="form-control">
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div class="form-group">
            <label><i class="fas fa-clock"></i> Time</label>
            <input type="time" id="scheduleTime" class="form-control" value="07:00">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-dumbbell"></i> Workout Type</label>
            <select id="scheduleType" class="form-control">
              ${workoutTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label><i class="fas fa-hourglass-half"></i> Duration (mins)</label>
            <input type="number" id="scheduleDuration" class="form-control" value="30" min="5" max="180">
          </div>
        </div>
        <div class="form-group">
          <label><i class="fas fa-pencil"></i> Notes (Optional)</label>
          <input type="text" id="scheduleNotes" class="form-control" placeholder="e.g., Focus on form, light weights">
        </div>
        <button class="btn" onclick="addToSchedule()" style="width:100%">
          <i class="fas fa-plus"></i> Add to Schedule
        </button>
      </div>
    </div>

    <!-- Weekly Schedule Overview -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-calendar-week"></i> Weekly Schedule</h3>
        <button class="btn btn-outline btn-sm" onclick="clearAllSchedule()">
          <i class="fas fa-trash"></i> Clear All
        </button>
      </div>
      <div class="weekly-schedule" id="weeklySchedule"></div>
    </div>

    <!-- Today's Checklist -->
    <div class="card checklist-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div style="display:flex;align-items:center;gap:12px">
          <h3 style="margin:0"><i class="fas fa-check-square"></i> Today's Checklist</h3>
          <span class="today-date" id="todayDate"></span>
        </div>
        <button class="refresh-btn" onclick="refreshChecklist()" title="Refresh Checklist">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="dailyChecklist"></div>
    </div>

    <!-- Completion Tracking -->
    <div class="card">
      <h3><i class="fas fa-chart-bar"></i> Weekly Progress</h3>
      <div class="progress-overview">
        <div class="progress-stats">
          <div class="progress-stat">
            <div class="stat-circle" id="completionRate">
              <svg viewBox="0 0 36 36">
                <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                <path class="circle-fill" id="progressCircle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              </svg>
              <span class="percentage" id="completionPercent">0%</span>
            </div>
            <span class="stat-label">Completion Rate</span>
          </div>
          <div class="progress-numbers">
            <div class="number-item">
              <span class="number-value" id="workoutsCompleted">0</span>
              <span class="number-label">Workouts Completed</span>
            </div>
            <div class="number-item">
              <span class="number-value" id="workoutsPlanned">0</span>
              <span class="number-label">Workouts Planned</span>
            </div>
            <div class="number-item">
              <span class="number-value" id="currentStreak">0</span>
              <span class="number-label">Day Streak 🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  displayTodayDate();
  loadScheduleFromSheets();
  
  // Auto-refresh checklist every minute to check time
  setInterval(() => {
    if (currentTab === 'scheduler') {
      checkWorkoutTimes();
    }
  }, 60000);
  
  // Initial time check
  setTimeout(() => {
    checkWorkoutTimes();
  }, 1000);
}

function displayTodayDate() {
  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('todayDate').innerText = today.toLocaleDateString('en-US', options);
}

function refreshChecklist() {
  loadChecklist();
  showToast('Checklist refreshed! 🔄', false);
}

function checkWorkoutTimes() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const todayWorkouts = workoutSchedule.filter(w => w.day === today && !w.completed);
  
  todayWorkouts.forEach(workout => {
    const [hours, minutes] = workout.time.split(':');
    const workoutTime = parseInt(hours) * 60 + parseInt(minutes);
    
    // If workout time has passed (within last 2 hours), highlight it
    if (currentTime >= workoutTime && currentTime <= workoutTime + 120) {
      highlightWorkoutItem(workout.id);
    }
  });
}

function highlightWorkoutItem(workoutId) {
  const items = document.querySelectorAll('.checklist-item');
  items.forEach(item => {
    if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(workoutId)) {
      item.style.background = '#fef9e7';
      item.style.borderColor = '#fdcb6e';
    }
  });
}

async function loadScheduleFromSheets() {
  try {
    const result = await callAPI('getSchedule', { schoolId: window.currentUser.schoolId });
    
    if (result.success && result.schedule) {
      workoutSchedule = result.schedule.map(item => ({
        ...item,
        id: item.id,
        day: item.day,
        time: item.time,
        type: item.type,
        duration: parseInt(item.duration),
        notes: item.notes,
        completed: item.completed
      }));
      
      // Sort by day
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      workoutSchedule.sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));
      
      displayWeeklySchedule();
      loadChecklist();
      updateProgress();
    } else {
      // Load from localStorage as fallback
      loadScheduleFromLocal();
    }
  } catch (error) {
    console.error('Error loading schedule:', error);
    loadScheduleFromLocal();
  }
}

function loadScheduleFromLocal() {
  const stored = localStorage.getItem('hydrofit_schedule_' + window.currentUser?.schoolId);
  if (stored) {
    workoutSchedule = JSON.parse(stored);
    displayWeeklySchedule();
    loadChecklist();
    updateProgress();
  } else {
    displayWeeklySchedule();
  }
}

async function syncScheduleWithSheets() {
  if (workoutSchedule.length === 0) return;
  
  const result = await callAPI('saveSchedule', {
    schoolId: window.currentUser.schoolId,
    scheduleData: JSON.stringify(workoutSchedule)
  });
  
  if (result.success) {
    console.log('✅ Schedule synced automatically');
  }
}

function addToSchedule() {
  const day = document.getElementById('scheduleDay').value;
  const time = document.getElementById('scheduleTime').value;
  const type = document.getElementById('scheduleType').value;
  const duration = document.getElementById('scheduleDuration').value;
  const notes = document.getElementById('scheduleNotes').value;
  
  const scheduleItem = {
    id: 'SCH' + Date.now() + Math.random().toString(36).substr(2, 5),
    day,
    time,
    type,
    duration,
    notes,
    completed: false
  };
  
  workoutSchedule.push(scheduleItem);
  workoutSchedule.sort((a, b) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(a.day) - days.indexOf(b.day);
  });
  
  saveScheduleLocal();
  displayWeeklySchedule();
  updateProgress();
  syncScheduleWithSheets();
  
  // Clear form
  document.getElementById('scheduleNotes').value = '';
  
  showToast(`${type} added to ${day}!`, false);
}

function displayWeeklySchedule() {
  const container = document.getElementById('weeklySchedule');
  
  if (workoutSchedule.length === 0) {
    container.innerHTML = `
      <div class="empty-schedule">
        <i class="fas fa-calendar"></i>
        <p>No workouts scheduled yet</p>
        <p class="hint">Add your first workout above</p>
      </div>
    `;
    return;
  }
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let html = '<div class="schedule-grid">';
  
  days.forEach(day => {
    const dayWorkouts = workoutSchedule.filter(w => w.day === day);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isToday = day === today;
    
    html += `
      <div class="schedule-day ${isToday ? 'today' : ''}">
        <div class="day-header">
          <span class="day-name">${day.slice(0, 3)}</span>
          ${isToday ? '<span class="today-badge">Today</span>' : ''}
        </div>
        <div class="day-workouts">
    `;
    
    if (dayWorkouts.length === 0) {
      html += `<div class="no-workout">Rest Day</div>`;
    } else {
      dayWorkouts.forEach(workout => {
        html += `
          <div class="workout-item ${workout.completed ? 'completed' : ''}">
            <div class="workout-time">${formatTime(workout.time)}</div>
            <div class="workout-type">${workout.type}</div>
            <div class="workout-duration">${workout.duration} min</div>
            ${workout.notes ? `<div class="workout-notes">${workout.notes}</div>` : ''}
            <button class="delete-workout" onclick="deleteWorkout('${workout.id}')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `;
      });
    }
    
    html += `</div></div>`;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

function formatTime(timeStr) {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

async function deleteWorkout(id) {
  if (!confirm('Remove this workout from schedule?')) return;
  
  workoutSchedule = workoutSchedule.filter(w => w.id !== id);
  saveScheduleLocal();
  displayWeeklySchedule();
  loadChecklist();
  updateProgress();
  
  // Delete from Sheets
  await callAPI('deleteScheduleItem', {
    schoolId: window.currentUser.schoolId,
    workoutId: id
  });
  
  showToast('Workout removed from schedule', false);
}

async function clearAllSchedule() {
  if (!confirm('Clear ALL scheduled workouts? This cannot be undone.')) return;
  
  workoutSchedule = [];
  saveScheduleLocal();
  displayWeeklySchedule();
  loadChecklist();
  updateProgress();
  
  await callAPI('clearSchedule', { schoolId: window.currentUser.schoolId });
  
  showToast('Schedule cleared', false);
}

function saveScheduleLocal() {
  localStorage.setItem('hydrofit_schedule_' + window.currentUser?.schoolId, JSON.stringify(workoutSchedule));
}

function loadChecklist() {
  const stored = localStorage.getItem('hydrofit_checklist_' + window.currentUser?.schoolId);
  if (stored) {
    dailyChecklist = JSON.parse(stored);
  }
  
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayWorkouts = workoutSchedule.filter(w => w.day === today);
  
  todayWorkouts.forEach(workout => {
    const existing = dailyChecklist.find(c => c.workoutId === workout.id && c.date === new Date().toDateString());
    if (!existing) {
      dailyChecklist.push({
        id: Date.now() + Math.random(),
        workoutId: workout.id,
        date: new Date().toDateString(),
        completed: workout.completed || false,
        type: workout.type,
        duration: workout.duration
      });
    }
  });
  
  dailyChecklist = dailyChecklist.filter(c => c.date === new Date().toDateString());
  saveChecklistLocal();
  displayChecklist();
}

function saveChecklistLocal() {
  localStorage.setItem('hydrofit_checklist_' + window.currentUser?.schoolId, JSON.stringify(dailyChecklist));
}

function displayChecklist() {
  const container = document.getElementById('dailyChecklist');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayWorkouts = workoutSchedule.filter(w => w.day === today);
  
  if (todayWorkouts.length === 0) {
    container.innerHTML = `
      <div class="empty-checklist">
        <i class="fas fa-check-circle"></i>
        <p>No workouts scheduled for today</p>
        <p class="hint">Enjoy your rest day! 🌟</p>
      </div>
    `;
    return;
  }
  
  // Check current time for each workout
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  let html = '<div class="checklist-items">';
  
  todayWorkouts.forEach(workout => {
    const checklistItem = dailyChecklist.find(c => c.workoutId === workout.id);
    const completed = checklistItem?.completed || workout.completed || false;
    
    const [hours, minutes] = workout.time.split(':');
    const workoutTime = parseInt(hours) * 60 + parseInt(minutes);
    const isTimeReached = currentTime >= workoutTime;
    const timeStatus = isTimeReached ? 'ready' : 'upcoming';
    
    html += `
      <div class="checklist-item ${completed ? 'checked' : ''} ${timeStatus}" onclick="toggleChecklistItem('${workout.id}')" id="workout-${workout.id}">
        <div class="checkbox ${completed ? 'checked' : ''}">
          ${completed ? '<i class="fas fa-check"></i>' : ''}
        </div>
        <div class="checklist-content">
          <div class="checklist-title">
            ${workout.type}
            ${!completed && isTimeReached ? '<span class="time-badge">⏰ Now</span>' : ''}
            ${!completed && !isTimeReached ? '<span class="time-badge upcoming">📅 ' + formatTime(workout.time) + '</span>' : ''}
          </div>
          <div class="checklist-details">
            <span><i class="fas fa-clock"></i> ${formatTime(workout.time)}</span>
            <span><i class="fas fa-hourglass-half"></i> ${workout.duration} min</span>
          </div>
          ${workout.notes ? `<div class="checklist-notes">${workout.notes}</div>` : ''}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  html += `
    <div class="extra-checklist">
      <div class="checklist-item extra" onclick="toggleExtraItem('water')">
        <div class="checkbox" id="waterCheck">
          <i class="fas fa-check" style="display:none"></i>
        </div>
        <div class="checklist-content">
          <div class="checklist-title">💧 Drink Water</div>
          <div class="checklist-details">Stay hydrated! Aim for 8 glasses today</div>
        </div>
      </div>
      <div class="checklist-item extra" onclick="toggleExtraItem('stretch')">
        <div class="checkbox" id="stretchCheck">
          <i class="fas fa-check" style="display:none"></i>
        </div>
        <div class="checklist-content">
          <div class="checklist-title">🧘 Stretch</div>
          <div class="checklist-details">5-10 minutes of stretching</div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

async function toggleChecklistItem(workoutId) {
  const item = dailyChecklist.find(c => c.workoutId === workoutId);
  if (item) {
    item.completed = !item.completed;
    
    const workout = workoutSchedule.find(w => w.id === workoutId);
    if (workout) {
      workout.completed = item.completed;
      saveScheduleLocal();
      
      // Update in Sheets
      await callAPI('updateWorkoutCompletion', {
        schoolId: window.currentUser.schoolId,
        workoutId: workoutId,
        completed: item.completed,
        completedDate: item.completed ? new Date().toISOString() : ''
      });
    }
    
    saveChecklistLocal();
    displayChecklist();
    displayWeeklySchedule();
    updateProgress();
    
    if (item.completed) {
      showToast('Great job! Workout completed! 🎉', false);
    }
  }
}

function toggleExtraItem(type) {
  const checkbox = document.getElementById(type + 'Check');
  const icon = checkbox.querySelector('i');
  
  if (icon.style.display === 'none') {
    icon.style.display = 'inline-block';
    showToast(type === 'water' ? 'Stay hydrated! 💧' : 'Great stretch! 🧘', false);
  } else {
    icon.style.display = 'none';
  }
}

function updateProgress() {
  const totalWorkouts = workoutSchedule.length;
  const completedWorkouts = workoutSchedule.filter(w => w.completed).length;
  
  document.getElementById('workoutsPlanned').innerText = totalWorkouts;
  document.getElementById('workoutsCompleted').innerText = completedWorkouts;
  
  const percent = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
  document.getElementById('completionPercent').innerText = percent + '%';
  
  const circle = document.getElementById('progressCircle');
  if (circle) {
    const circumference = 2 * Math.PI * 15.9155;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
  }
  
  calculateStreak();
}

function calculateStreak() {
  const dates = dailyChecklist
    .filter(c => c.completed)
    .map(c => new Date(c.date).toDateString())
    .sort();
  
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  const uniqueDates = [...new Set(dates)];
  
  if (uniqueDates.includes(today)) {
    streak = 1;
    for (let i = 1; i < 30; i++) {
      const checkDate = new Date(Date.now() - i * 86400000).toDateString();
      if (uniqueDates.includes(checkDate)) {
        streak++;
      } else {
        break;
      }
    }
  } else if (uniqueDates.includes(yesterday)) {
    streak = 1;
    for (let i = 1; i < 30; i++) {
      const checkDate = new Date(Date.now() - (i + 1) * 86400000).toDateString();
      if (uniqueDates.includes(checkDate)) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  document.getElementById('currentStreak').innerText = streak;
}

console.log("✅ Daily Workout Scheduler Loaded");