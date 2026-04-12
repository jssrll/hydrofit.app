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
        <button class="btn btn-outline" onclick="previousPeriod()">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 id="calendarTitle">${getCalendarTitle()}</h2>
        <button class="btn btn-outline" onclick="nextPeriod()">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="calendar-view-selector">
        <button class="view-btn ${currentView === 'month' ? 'active' : ''}" onclick="switchView('month')">
          <i class="fas fa-calendar-alt"></i> Month
        </button>
        <button class="view-btn ${currentView === 'week' ? 'active' : ''}" onclick="switchView('week')">
          <i class="fas fa-calendar-week"></i> Week
        </button>
        <button class="view-btn ${currentView === 'day' ? 'active' : ''}" onclick="switchView('day')">
          <i class="fas fa-calendar-day"></i> Day
        </button>
        <button class="view-btn" onclick="goToToday()">
          <i class="fas fa-calendar-check"></i> Today
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="card calendar-grid-card">
      <div id="calendarGrid"></div>
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
            <option value="🦵 Leg Day">🦵 Leg Day</option>
            <option value="💪 Upper Body">💪 Upper Body</option>
            <option value="🎯 Core">🎯 Core</option>
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
      
      <div class="form-row">
        <div class="form-group">
          <label>Reminder</label>
          <select id="eventReminder" class="form-control">
            <option value="5">5 minutes before</option>
            <option value="15">15 minutes before</option>
            <option value="30" selected>30 minutes before</option>
            <option value="60">1 hour before</option>
            <option value="120">2 hours before</option>
          </select>
        </div>
        <div class="form-group">
          <label>Location (Optional)</label>
          <input type="text" id="eventLocation" class="form-control" placeholder="Gym, Home, Park...">
        </div>
      </div>
      
      <div class="form-group">
        <label>Notes (Optional)</label>
        <textarea id="eventNotes" class="form-control" rows="2" placeholder="Any additional notes..."></textarea>
      </div>
      
      <button class="btn" onclick="addToCalendar()" style="width:100%">
        <i class="far fa-calendar-plus"></i> Add to Google Calendar
      </button>
    </div>

    <!-- Sync Scheduler Workouts -->
    <div class="card">
      <h3><i class="fas fa-sync-alt"></i> Sync Scheduled Workouts</h3>
      <p style="color:#64748b;margin-bottom:16px">Add all your scheduled workouts to Google Calendar</p>
      <button class="btn btn-outline" onclick="syncScheduledWorkouts()" style="width:100%">
        <i class="fab fa-google"></i> Sync Workout Schedule to Calendar
      </button>
    </div>

    <!-- Upcoming Events -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-list"></i> Upcoming Workouts</h3>
        <button class="refresh-btn" onclick="loadCalendarEvents()">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="upcomingEvents"></div>
    </div>
  `;
  
  renderCalendarGrid();
  loadCalendarEvents();
}

function getCalendarTitle() {
  const options = { year: 'numeric', month: 'long' };
  if (currentView === 'day') {
    return selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  return selectedDate.toLocaleDateString('en-US', options);
}

function previousPeriod() {
  if (currentView === 'month') {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
  } else if (currentView === 'week') {
    selectedDate.setDate(selectedDate.getDate() - 7);
  } else {
    selectedDate.setDate(selectedDate.getDate() - 1);
  }
  renderCalendar();
}

function nextPeriod() {
  if (currentView === 'month') {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
  } else if (currentView === 'week') {
    selectedDate.setDate(selectedDate.getDate() + 7);
  } else {
    selectedDate.setDate(selectedDate.getDate() + 1);
  }
  renderCalendar();
}

function goToToday() {
  selectedDate = new Date();
  renderCalendar();
}

function switchView(view) {
  currentView = view;
  renderCalendar();
}

function renderCalendarGrid() {
  const container = document.getElementById('calendarGrid');
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
  if (currentView === 'month') {
    renderMonthView(container, year, month);
  } else if (currentView === 'week') {
    renderWeekView(container);
  } else {
    renderDayView(container);
  }
}

function renderMonthView(container, year, month) {
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
  
  // Empty cells for days before month starts
  for (let i = 0; i < startDay; i++) {
    html += '<div class="calendar-day empty"></div>';
  }
  
  // Days of the month
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const isToday = date.toDateString() === today.toDateString();
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = calendarEvents.filter(e => e.startTime.startsWith(dateStr));
    
    html += `
      <div class="calendar-day ${isToday ? 'today' : ''}" onclick="selectDate('${dateStr}')">
        <span class="day-number">${i}</span>
        ${dayEvents.length > 0 ? `<span class="event-indicator">${dayEvents.length} workout${dayEvents.length > 1 ? 's' : ''}</span>` : ''}
      </div>
    `;
  }
  
  html += '</div></div>';
  container.innerHTML = html;
}

function renderWeekView(container) {
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  
  let html = '<div class="calendar-week">';
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayEvents = calendarEvents.filter(e => e.startTime.startsWith(dateStr));
    const isToday = date.toDateString() === new Date().toDateString();
    
    html += `
      <div class="week-day ${isToday ? 'today' : ''}" onclick="selectDate('${dateStr}')">
        <div class="week-day-header">
          <span class="day-name">${date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
          <span class="day-date">${date.getDate()}</span>
        </div>
        <div class="week-events">
          ${dayEvents.map(e => `
            <div class="week-event">
              <span class="event-time">${new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span class="event-title">${e.title}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function renderDayView(container) {
  const dateStr = selectedDate.toISOString().split('T')[0];
  const dayEvents = calendarEvents.filter(e => e.startTime.startsWith(dateStr));
  
  let html = '<div class="calendar-day-view">';
  html += `<h3>${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>`;
  
  if (dayEvents.length === 0) {
    html += '<p style="color:#64748b;text-align:center;padding:40px">No workouts scheduled</p>';
  } else {
    dayEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    dayEvents.forEach(event => {
      html += `
        <div class="day-event">
          <div class="event-time-block">
            <span class="event-start">${new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span class="event-end">${new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="event-details">
            <h4>${event.title}</h4>
            ${event.description ? `<p>${event.description}</p>` : ''}
            ${event.location ? `<p><i class="fas fa-map-pin"></i> ${event.location}</p>` : ''}
          </div>
          <button class="delete-event-btn" onclick="deleteCalendarEvent('${event.id}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    });
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function selectDate(dateStr) {
  selectedDate = new Date(dateStr);
  document.getElementById('eventDate').value = dateStr;
  currentView = 'day';
  renderCalendar();
}

async function addToCalendar() {
  const title = document.getElementById('eventType').value;
  const date = document.getElementById('eventDate').value;
  const startTime = document.getElementById('eventStartTime').value;
  const endTime = document.getElementById('eventEndTime').value;
  const reminder = document.getElementById('eventReminder').value;
  const location = document.getElementById('eventLocation').value;
  const notes = document.getElementById('eventNotes').value;
  
  if (!title || !date || !startTime || !endTime) {
    showToast('Please fill all required fields', true);
    return;
  }
  
  const startDateTime = `${date}T${startTime}:00`;
  const endDateTime = `${date}T${endTime}:00`;
  const description = `${notes}\n\nLocation: ${location || 'N/A'}`;
  
  const btn = document.querySelector('button[onclick="addToCalendar()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  
  const result = await callAPI('createCalendarEvent', {
    schoolId: window.currentUser.schoolId,
    title,
    description,
    startTime: startDateTime,
    endTime: endDateTime,
    reminderMinutes: reminder
  });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast('Workout added to Google Calendar! 📅', false);
    document.getElementById('eventNotes').value = '';
    document.getElementById('eventLocation').value = '';
    loadCalendarEvents();
  } else {
    showToast(result.error || 'Failed to add event', true);
  }
}

async function loadCalendarEvents() {
  const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
  const result = await callAPI('getCalendarEvents', {
    schoolId: window.currentUser.schoolId,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  });
  
  if (result.success) {
    calendarEvents = result.events || [];
    renderCalendarGrid();
    displayUpcomingEvents();
  }
}

function displayUpcomingEvents() {
  const container = document.getElementById('upcomingEvents');
  const now = new Date();
  const upcoming = calendarEvents
    .filter(e => new Date(e.startTime) >= now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);
  
  if (upcoming.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No upcoming workouts</p>';
    return;
  }
  
  let html = '<div class="upcoming-list">';
  upcoming.forEach(event => {
    const eventDate = new Date(event.startTime);
    const isToday = eventDate.toDateString() === now.toDateString();
    const isTomorrow = eventDate.toDateString() === new Date(now.setDate(now.getDate() + 1)).toDateString();
    
    let dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (isToday) dateLabel = 'Today';
    else if (isTomorrow) dateLabel = 'Tomorrow';
    
    html += `
      <div class="upcoming-event">
        <div class="event-date">
          <span class="date-label">${dateLabel}</span>
          <span class="event-time">${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div class="event-info">
          <strong>${event.title}</strong>
          ${event.location ? `<p><i class="fas fa-map-pin"></i> ${event.location}</p>` : ''}
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

async function deleteCalendarEvent(eventId) {
  if (!confirm('Remove this workout from calendar?')) return;
  
  const result = await callAPI('deleteCalendarEvent', {
    schoolId: window.currentUser.schoolId,
    eventId: eventId
  });
  
  if (result.success) {
    showToast('Event removed', false);
    loadCalendarEvents();
  } else {
    showToast(result.error || 'Failed to delete', true);
  }
}

async function syncScheduledWorkouts() {
  const result = await callAPI('getSchedule', { schoolId: window.currentUser.schoolId });
  
  if (!result.success || !result.schedule || result.schedule.length === 0) {
    showToast('No scheduled workouts to sync', true);
    return;
  }
  
  showToast('Syncing workouts to calendar...', false);
  
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
}

console.log("✅ Calendar Integration Loaded");