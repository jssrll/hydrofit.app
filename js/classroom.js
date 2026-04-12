// ========================================
// HYDROFIT - CLASSROOM (STUDENT PORTAL) - FIXED
// ========================================

let studentClasses = [];
let currentClass = null;
let classFeed = { announcements: [], assignments: [], performanceTasks: [] };
let autoRefreshInterval = null;

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
        <button class="btn" id="joinClassBtn">
          <i class="fas fa-sign-in-alt"></i> Join Class
        </button>
      </div>
    </div>

    <!-- My Classes -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-book-open"></i> My Classes</h3>
        <button class="refresh-btn" onclick="loadStudentClasses()" title="Refresh">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
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
        <div style="display:flex;gap:10px">
          <button class="refresh-btn" onclick="loadClassFeed(currentClass?.classId)" title="Refresh Feed">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button class="btn btn-outline" id="backFromClassBtn">
            <i class="fas fa-arrow-left"></i> Back
          </button>
        </div>
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

    <!-- Submit Modal -->
    <div id="submitModal" class="modal" style="display:none">
      <div class="modal-content" style="max-width:500px">
        <div class="modal-header">
          <i class="fas fa-tasks"></i>
          <h3 id="modalTitle">Submit Assignment</h3>
        </div>
        <div class="modal-body">
          <p id="modalDescription" style="margin-bottom:16px"></p>
          <p style="color:#64748b;margin-bottom:16px" id="modalDueDate"></p>
          <textarea id="submissionContent" class="modal-input" rows="4" placeholder="Type your answer or submission here..."></textarea>
          <button class="modal-btn" id="submitBtn">Submit</button>
          <button class="modal-btn btn-outline" id="cancelSubmitBtn">Cancel</button>
        </div>
      </div>
    </div>
  `;
  
  // Use direct event listeners for faster response
  document.getElementById('joinClassBtn').addEventListener('click', joinClass);
  document.getElementById('backFromClassBtn').addEventListener('click', closeClassFeed);
  document.getElementById('cancelSubmitBtn').addEventListener('click', () => {
    document.getElementById('submitModal').style.display = 'none';
  });
  
  loadStudentClasses();
  
  // Clear any existing auto-refresh
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }
  
  // Auto-refresh every 3 seconds when in classroom view
  autoRefreshInterval = setInterval(() => {
    if (currentClass) {
      loadClassFeed(currentClass.classId, true); // silent refresh
    }
  }, 3000);
}

// Clean up interval when leaving page
window.addEventListener('beforeunload', () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }
});

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
      <div class="class-card" data-classid="${cls.classId}">
        <div class="class-card-header">
          <i class="fas fa-chalkboard"></i>
          <h4>${escapeHtml(cls.className)}</h4>
        </div>
        <p class="class-section">${escapeHtml(cls.section || 'No Section')}</p>
        <p class="class-teacher"><i class="fas fa-user-tie"></i> ${escapeHtml(cls.teacherName)}</p>
        <p class="class-code">Code: ${cls.classCode}</p>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
  
  // Add click listeners
  document.querySelectorAll('.class-card').forEach(card => {
    card.addEventListener('click', () => {
      openClass(card.dataset.classid);
    });
  });
}

async function joinClass() {
  const classCode = document.getElementById('classCode').value.trim().toUpperCase();
  
  if (!classCode || classCode.length < 4) {
    showToast('Please enter a valid class code', true);
    return;
  }
  
  const btn = document.getElementById('joinClassBtn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
  
  const result = await callAPI('joinClass', {
    studentId: window.currentUser.schoolId,
    studentName: window.currentUser.fullName,
    classCode: classCode
  });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
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

async function loadClassFeed(classId, silent = false) {
  if (!silent) {
    document.getElementById('announcementsList').innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Loading...</p>';
    document.getElementById('assignmentsList').innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Loading...</p>';
    document.getElementById('performanceTasksList').innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Loading...</p>';
  }
  
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
  
  if (!classFeed.announcements || classFeed.announcements.length === 0) {
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
          <span class="feed-date">${new Date(ann.publishedDate).toLocaleString()}</span>
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
  
  if (!classFeed.assignments || classFeed.assignments.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No assignments yet</p>';
    return;
  }
  
  let html = '<div class="feed-list">';
  classFeed.assignments.forEach(asgn => {
    html += `
      <div class="feed-item assignment">
        <div class="feed-header">
          <i class="fas fa-tasks"></i>
          <span class="feed-title">${escapeHtml(asgn.title)}</span>
          <span class="feed-due">Due: ${asgn.dueDate || 'No due date'}</span>
        </div>
        <p class="feed-content">${escapeHtml(asgn.description)}</p>
        <button class="btn btn-sm btn-outline submit-assignment-btn" data-id="${asgn.id}" data-title="${escapeHtml(asgn.title)}" data-desc="${escapeHtml(asgn.description)}" data-due="${asgn.dueDate || ''}" data-max="${asgn.maxScore || 100}">
          <i class="fas fa-upload"></i> Submit
        </button>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
  
  // Add click listeners
  document.querySelectorAll('.submit-assignment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const desc = btn.dataset.desc;
      const due = btn.dataset.due;
      const max = btn.dataset.max;
      
      document.getElementById('modalTitle').innerText = title;
      document.getElementById('modalDescription').innerText = desc;
      document.getElementById('modalDueDate').innerHTML = `
        <i class="fas fa-calendar"></i> Due: ${due || 'No due date'}<br>
        <i class="fas fa-star"></i> Max Score: ${max}
      `;
      document.getElementById('submitModal').style.display = 'flex';
      
      // Set up submit handler
      const submitBtn = document.getElementById('submitBtn');
      const newSubmitBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
      
      newSubmitBtn.addEventListener('click', async () => {
        const content = document.getElementById('submissionContent').value;
        if (!content) {
          showToast('Please enter your submission', true);
          return;
        }
        
        newSubmitBtn.disabled = true;
        newSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        const result = await callAPI('submitAssignment', {
          assignmentId: id,
          studentId: window.currentUser.schoolId,
          studentName: window.currentUser.fullName,
          content: content
        });
        
        if (result.success) {
          showToast('Assignment submitted! 🎉', false);
          document.getElementById('submitModal').style.display = 'none';
          document.getElementById('submissionContent').value = '';
        } else {
          showToast(result.error || 'Failed to submit', true);
          newSubmitBtn.disabled = false;
          newSubmitBtn.innerHTML = 'Submit';
        }
      });
    });
  });
}

function displayPerformanceTasks() {
  const container = document.getElementById('performanceTasksList');
  
  if (!classFeed.performanceTasks || classFeed.performanceTasks.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No performance tasks yet</p>';
    return;
  }
  
  let html = '<div class="feed-list">';
  classFeed.performanceTasks.forEach(task => {
    html += `
      <div class="feed-item task">
        <div class="feed-header">
          <i class="fas fa-star"></i>
          <span class="feed-title">${escapeHtml(task.title)}</span>
          <span class="feed-due">Due: ${task.dueDate || 'No due date'}</span>
        </div>
        <p class="feed-content">${escapeHtml(task.description)}</p>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

console.log("✅ Classroom Loaded with Auto-Refresh");