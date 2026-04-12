// ========================================
// HYDROFIT - CLASSROOM (STUDENT PORTAL)
// ========================================

let studentClasses = [];
let currentClass = null;
let classFeed = { announcements: [], assignments: [], performanceTasks: [] };

function renderClassroom() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Classroom" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Join Class Card -->
    <div class="card join-class-card">
      <h3><i class="fas fa-door-open"></i> Join a Class</h3>
      <p style="color:#64748b;margin-bottom:16px">Enter the class code provided by your teacher</p>
      <div class="join-class-form">
        <input type="text" id="classCode" class="form-control" placeholder="Enter 6-digit class code" maxlength="6" style="text-transform:uppercase">
        <button class="btn" onclick="joinClass()">
          <i class="fas fa-sign-in-alt"></i> Join Class
        </button>
      </div>
    </div>

    <!-- My Classes -->
    <div class="card">
      <h3><i class="fas fa-book-open"></i> My Classes</h3>
      <div id="myClassesList">
        <div class="loading-placeholder">
          <i class="fas fa-spinner fa-spin"></i> Loading classes...
        </div>
      </div>
    </div>

    <!-- Class Feed (shown when class is selected) -->
    <div id="classFeedContainer" style="display:none">
      <!-- Class Header -->
      <div class="card class-header-card">
        <div class="class-header-info">
          <h2 id="classNameDisplay">Class Name</h2>
          <p id="classDetailsDisplay">Section • Teacher</p>
        </div>
        <button class="btn btn-outline" onclick="closeClassFeed()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>

      <!-- Announcements -->
      <div class="card">
        <h3><i class="fas fa-bullhorn"></i> Announcements</h3>
        <div id="announcementsList"></div>
      </div>

      <!-- Assignments -->
      <div class="card">
        <h3><i class="fas fa-tasks"></i> Assignments</h3>
        <div id="assignmentsList"></div>
      </div>

      <!-- Performance Tasks -->
      <div class="card">
        <h3><i class="fas fa-star"></i> Performance Tasks</h3>
        <div id="performanceTasksList"></div>
      </div>
    </div>
  `;
  
  loadStudentClasses();
}

async function loadStudentClasses() {
  if (!window.currentUser) return;
  
  const result = await callAPI('getStudentClasses', { 
    studentId: window.currentUser.schoolId 
  });
  
  if (result.success) {
    studentClasses = result.classes;
    displayMyClasses();
  } else {
    document.getElementById('myClassesList').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book"></i>
        <p>No classes yet</p>
        <p class="empty-hint">Join a class using a code from your teacher</p>
      </div>
    `;
  }
}

function displayMyClasses() {
  const container = document.getElementById('myClassesList');
  
  if (studentClasses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-book"></i>
        <p>No classes yet</p>
        <p class="empty-hint">Join a class using a code from your teacher</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="classes-grid">';
  studentClasses.forEach(cls => {
    html += `
      <div class="class-card" onclick="openClass('${cls.classId}')">
        <div class="class-card-header">
          <i class="fas fa-chalkboard"></i>
          <h4>${cls.className}</h4>
        </div>
        <p class="class-section">${cls.section || 'No Section'}</p>
        <p class="class-teacher"><i class="fas fa-user-tie"></i> ${cls.teacherName}</p>
        <p class="class-code">Code: ${cls.classCode}</p>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

async function joinClass() {
  const classCode = document.getElementById('classCode').value.trim().toUpperCase();
  
  if (!classCode || classCode.length < 4) {
    showToast('Please enter a valid class code', true);
    return;
  }
  
  const result = await callAPI('joinClass', {
    studentId: window.currentUser.schoolId,
    studentName: window.currentUser.fullName,
    classCode: classCode
  });
  
  if (result.success) {
    showToast(`Joined ${result.classInfo.className}! 🎉`, false);
    document.getElementById('classCode').value = '';
    loadStudentClasses();
  } else {
    showToast(result.error || 'Failed to join class', true);
  }
}

async function openClass(classId) {
  currentClass = studentClasses.find(c => c.classId === classId);
  if (!currentClass) return;
  
  document.getElementById('myClassesList').parentElement.style.display = 'none';
  document.querySelector('.join-class-card').style.display = 'none';
  document.getElementById('classFeedContainer').style.display = 'block';
  
  document.getElementById('classNameDisplay').innerText = currentClass.className;
  document.getElementById('classDetailsDisplay').innerText = 
    `${currentClass.section || 'No Section'} • ${currentClass.teacherName}`;
  
  await loadClassFeed(classId);
}

function closeClassFeed() {
  currentClass = null;
  document.getElementById('myClassesList').parentElement.style.display = 'block';
  document.querySelector('.join-class-card').style.display = 'block';
  document.getElementById('classFeedContainer').style.display = 'none';
}

async function loadClassFeed(classId) {
  const result = await callAPI('getClassFeed', { classId });
  
  if (result.success) {
    classFeed = result.feed;
    displayAnnouncements();
    displayAssignments();
    displayPerformanceTasks();
  }
}

function displayAnnouncements() {
  const container = document.getElementById('announcementsList');
  
  if (classFeed.announcements.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No announcements yet</p>';
    return;
  }
  
  let html = '<div class="feed-list">';
  classFeed.announcements.forEach(ann => {
    html += `
      <div class="feed-item announcement">
        <div class="feed-header">
          <i class="fas fa-bullhorn"></i>
          <span class="feed-title">${escapeHtml(ann.title)}</span>
          <span class="feed-date">${new Date(ann.publishedDate).toLocaleDateString()}</span>
        </div>
        <p class="feed-content">${escapeHtml(ann.content)}</p>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function displayAssignments() {
  const container = document.getElementById('assignmentsList');
  
  if (classFeed.assignments.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No assignments yet</p>';
    return;
  }
  
  let html = '<div class="feed-list">';
  classFeed.assignments.forEach(asgn => {
    html += `
      <div class="feed-item assignment" onclick="openAssignmentModal('${asgn.id}', '${escapeHtml(asgn.title)}', '${escapeHtml(asgn.description)}', '${asgn.dueDate}', '${asgn.maxScore}')">
        <div class="feed-header">
          <i class="fas fa-tasks"></i>
          <span class="feed-title">${escapeHtml(asgn.title)}</span>
          <span class="feed-due">Due: ${asgn.dueDate || 'No due date'}</span>
        </div>
        <p class="feed-content">${escapeHtml(asgn.description).substring(0, 100)}...</p>
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); openAssignmentModal('${asgn.id}', '${escapeHtml(asgn.title)}', '${escapeHtml(asgn.description)}', '${asgn.dueDate}', '${asgn.maxScore}')">
          <i class="fas fa-upload"></i> Submit
        </button>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function displayPerformanceTasks() {
  const container = document.getElementById('performanceTasksList');
  
  if (classFeed.performanceTasks.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No performance tasks yet</p>';
    return;
  }
  
  let html = '<div class="feed-list">';
  classFeed.performanceTasks.forEach(task => {
    html += `
      <div class="feed-item task" onclick="openTaskModal('${task.id}', '${escapeHtml(task.title)}', '${escapeHtml(task.description)}', '${task.dueDate}')">
        <div class="feed-header">
          <i class="fas fa-star"></i>
          <span class="feed-title">${escapeHtml(task.title)}</span>
          <span class="feed-due">Due: ${task.dueDate || 'No due date'}</span>
        </div>
        <p class="feed-content">${escapeHtml(task.description).substring(0, 100)}...</p>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function openAssignmentModal(id, title, description, dueDate, maxScore) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content" style="max-width:500px">
      <div class="modal-header">
        <i class="fas fa-tasks"></i>
        <h3>${title}</h3>
      </div>
      <div class="modal-body">
        <p style="margin-bottom:16px">${description}</p>
        <p style="color:#64748b;margin-bottom:16px">
          <i class="fas fa-calendar"></i> Due: ${dueDate || 'No due date'}<br>
          <i class="fas fa-star"></i> Max Score: ${maxScore || 100}
        </p>
        <textarea id="submissionContent" class="modal-input" rows="4" placeholder="Type your answer or submission here..."></textarea>
        <button class="modal-btn" onclick="submitAssignment('${id}')">Submit Assignment</button>
        <button class="modal-btn btn-outline" onclick="this.closest('.modal').remove()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function submitAssignment(assignmentId) {
  const content = document.getElementById('submissionContent').value;
  
  if (!content) {
    showToast('Please enter your submission', true);
    return;
  }
  
  const result = await callAPI('submitAssignment', {
    assignmentId: assignmentId,
    studentId: window.currentUser.schoolId,
    studentName: window.currentUser.fullName,
    content: content
  });
  
  if (result.success) {
    showToast('Assignment submitted! 🎉', false);
    document.querySelector('.modal').remove();
  } else {
    showToast(result.error || 'Failed to submit', true);
  }
}

console.log("✅ Classroom Loaded");