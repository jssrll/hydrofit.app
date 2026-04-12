// ========================================
// HYDROFIT - GOOGLE CALENDAR INTEGRATION
// ========================================

let calendarEvents = [];
let selectedDate = new Date();
let currentView = 'month';

function renderCalendar() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Calendar" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Calendar Header -->
    <div class="card calendar-header-card">
      <div class="calendar-nav">
        <button class="btn btn-outline" onclick="window.previousPeriod()">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 id="calendarTitle">${getCalendarTitle()}</h2>
        <button class="btn btn-outline" onclick="window.nextPeriod()">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="calendar-view-selector">
        <button class="view-btn ${currentView === 'month' ? 'active' : ''}" onclick="window.switchView('month')">
          <i class="fas fa-calendar-alt"></i> Month
        </button>
        <button class="view-btn ${currentView === 'week' ? 'active' : ''}" onclick="window.switchView('week')">
          <i class="fas fa-calendar-week"></i> Week
        </button>
        <button class="view-btn" onclick="window.goToToday()">
          <i class="fas fa-calendar-check"></i> Today
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="card calendar-grid-card">
      <div id="calendarGrid">Loading calendar...</div>
    </div>

    <!-- Add Event -->
    <div class="card">
      <h3><i class="fas fa-plus-circle"></i> Add Workout to Calendar</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Workout Type</label>
          <select id="eventType" class="form-control">
            <option value="🏋️ Strength Training">🏋️ Strength Training</option>
            <option value="🏃 Cardio">🏃 Cardio</option>
            <option value="🧘 Yoga/Stretching">🧘 Yoga/Stretching</option>
            <option value="🔥 HIIT">🔥 HIIT</option>
            <option value="💪 Full Body">💪 Full Body</option>
          </select>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="eventDate" class="form-control" value="${selectedDate.toISOString().split('T')[0]}">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Start Time</label>
          <input type="time" id="eventStartTime" class="form-control" value="09:00">
        </div>
        <div class="form-group">
          <label>End Time</label>
          <input type="time" id="eventEndTime" class="form-control" value="10:00">
        </div>
      </div>
      
      <div class="form-group">
        <label>Notes (Optional)</label>
        <textarea id="eventNotes" class="form-control" rows="2" placeholder="Any additional notes..."></textarea>
      </div>
      
      <button class="btn" onclick="window.addToCalendar()" style="width:100%">
        <i class="far fa-calendar-plus"></i> Add to Google Calendar
      </button>
    </div>

    <!-- Sync Scheduler Workouts -->
    <div class="card">
      <h3><i class="fas fa-sync-alt"></i> Sync Scheduled Workouts</h3>
      <p style="color:#64748b;margin-bottom:16px">Add all your scheduled workouts to Google Calendar</p>
      <button class="btn btn-outline" onclick="window.syncScheduledWorkouts()" style="width:100%">
        <i class="fab fa-google"></i> Sync Workout Schedule to Calendar
      </button>
    </div>
  `;
  
  // Load events after render
  setTimeout(() => {
    loadCalendarEvents();
  }, 100);
}

function getCalendarTitle() {
  const options = { year: 'numeric', month: 'long' };
  return selectedDate.toLocaleDateString('en-US', options);
}

window.previousPeriod = function() {
  if (currentView === 'month') {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
  } else {
    selectedDate.setDate(selectedDate.getDate() - 7);
  }
  renderCalendar();
};

window.nextPeriod = function() {
  if (currentView === 'month') {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
  } else {
    selectedDate.setDate(selectedDate.getDate() + 7);
  }
  renderCalendar();
};

window.goToToday = function() {
  selectedDate = new Date();
  renderCalendar();
};

window.switchView = function(view) {
  currentView = view;
  renderCalendar();
};

function renderCalendarGrid() {
  const container = document.getElementById('calendarGrid');
  if (!container) return;
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  let html = '<div class="calendar-month">';
  html += '<div class="calendar-weekdays">';
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
    html += `<div class="weekday">${day}</div>`;
  });
  html += '</div><div class="calendar-days">';
  
  // Empty cells
  for (let i = 0; i < startDay; i++) {
    html += '<div class="calendar-day empty"></div>';
  }
  
  // Days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const isToday = date.toDateString() === today.toDateString();
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = calendarEvents.filter(e => e.startTime && e.startTime.startsWith(dateStr));
    
    html += `
      <div class="calendar-day ${isToday ? 'today' : ''}" onclick="window.selectDate('${dateStr}')">
        <span class="day-number">${i}</span>
        ${dayEvents.length > 0 ? `<span class="event-indicator">${dayEvents.length}</span>` : ''}
      </div>
    `;
  }
  
  html += '</div></div>';
  container.innerHTML = html;
}

window.selectDate = function(dateStr) {
  selectedDate = new Date(dateStr);
  const dateInput = document.getElementById('eventDate');
  if (dateInput) dateInput.value = dateStr;
};

async function loadCalendarEvents() {
  try {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const result = await callAPI('getCalendarEvents', {
      schoolId: window.currentUser?.schoolId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    
    if (result.success) {
      calendarEvents = result.events || [];
    } else {
      calendarEvents = [];
    }
    
    renderCalendarGrid();
  } catch (error) {
    console.error('Error loading events:', error);
    calendarEvents = [];
    renderCalendarGrid();
  }
}

window.addToCalendar = async function() {
  const title = document.getElementById('eventType')?.value;
  const date = document.getElementById('eventDate')?.value;
  const startTime = document.getElementById('eventStartTime')?.value;
  const endTime = document.getElementById('eventEndTime')?.value;
  const notes = document.getElementById('eventNotes')?.value;
  
  if (!title || !date || !startTime || !endTime) {
    showToast('Please fill all required fields', true);
    return;
  }
  
  if (!window.currentUser || !window.currentUser.schoolId) {
    showToast('Please log in first', true);
    return;
  }
  
  const startDateTime = `${date}T${startTime}:00`;
  const endDateTime = `${date}T${endTime}:00`;
  
  const btn = document.querySelector('button[onclick="window.addToCalendar()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  
  try {
    const result = await callAPI('createCalendarEvent', {
      schoolId: window.currentUser.schoolId,
      title: title,
      description: notes || 'HydroFit Workout',
      startTime: startDateTime,
      endTime: endDateTime,
      reminderMinutes: '30'
    });
    
    if (result.success) {
      showToast('Workout added to Google Calendar! 📅', false);
      const notesInput = document.getElementById('eventNotes');
      if (notesInput) notesInput.value = '';
      loadCalendarEvents();
    } else {
      showToast(result.error || 'Failed to add event', true);
    }
  } catch (error) {
    showToast('Error adding event', true);
  }
  
  btn.disabled = false;
  btn.innerHTML = originalText;
};

window.syncScheduledWorkouts = async function() {
  if (!window.currentUser || !window.currentUser.schoolId) {
    showToast('Please log in first', true);
    return;
  }
  
  const btn = document.querySelector('button[onclick="window.syncScheduledWorkouts()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
  
  try {
    const result = await callAPI('getSchedule', { schoolId: window.currentUser.schoolId });
    
    if (!result.success || !result.schedule || result.schedule.length === 0) {
      showToast('No scheduled workouts to sync', true);
      btn.disabled = false;
      btn.innerHTML = originalText;
      return;
    }
    
    const workouts = result.schedule;
    let synced = 0;
    
    for (const workout of workouts) {
      if (workout.completed) continue;
      
      const today = new Date();
      const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        .indexOf(workout.day);
      
      let workoutDate = new Date();
      workoutDate.setDate(today.getDate() + ((dayIndex + 7 - today.getDay()) % 7));
      
      const [hours, minutes] = workout.time.split(':');
      const startTime = new Date(workoutDate);
      startTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + parseInt(workout.duration || 60));
      
      const workoutData = {
        type: workout.type,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        description: workout.notes || `${workout.type} - ${workout.duration} min`
      };
      
      const syncResult = await callAPI('syncWorkoutToCalendar', {
        schoolId: window.currentUser.schoolId,
        workoutData: JSON.stringify(workoutData)
      });
      
      if (syncResult.success) synced++;
    }
    
    showToast(`${synced} workouts synced to calendar! 📅`, false);
    loadCalendarEvents();
  } catch (error) {
    showToast('Error syncing workouts', true);
  }
  
  btn.disabled = false;
  btn.innerHTML = originalText;
};

// Make functions globally available
window.renderCalendar = renderCalendar;
window.loadCalendarEvents = loadCalendarEvents;

console.log("✅ Calendar Integration Loaded");