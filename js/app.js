// ========================================
// HYDROFIT - WITH TEACHER DASHBOARD
// ========================================

let currentTab = "dashboard";
let currentUser = null;
let isLoading = false;
let html5QrCode = null;
let selectedClass = null;

// Toast notification
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.style.display = "block";
  toast.style.background = isError ? "#d63031" : "#03045e";
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="margin-right: 8px;"></i> ${message}`;
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function updatePageTitle(title) {
  const titleEl = document.getElementById("pageTitle");
  if (titleEl) titleEl.innerText = title;
}

function updateUserStats() {
  if (currentUser) {
    const lastName = currentUser.fullName.split(',')[0];
    const roleBadge = document.getElementById("userRoleBadge");
    const nameDisplay = document.getElementById("userNameDisplay");
    const isTeacher = currentUser.role === 'teacher';
    
    if (roleBadge) {
      roleBadge.innerHTML = `<i class="fas ${isTeacher ? 'fa-chalkboard-user' : 'fa-user-graduate'}"></i> ${isTeacher ? 'TEACHER' : 'STUDENT'}`;
      roleBadge.style.background = isTeacher ? '#48cae4' : '#00b4d8';
    }
    
    if (nameDisplay) {
      nameDisplay.innerHTML = `<i class="fas fa-user"></i> ${lastName}`;
    }
  }
}

function updateNavMenu() {
  const navMenu = document.getElementById("navMenu");
  if (!navMenu) return;
  
  const isTeacher = currentUser?.role === 'teacher';
  
  if (isTeacher) {
    navMenu.innerHTML = `
      <button class="nav-btn active" data-tab="teacherDashboard">
        <i class="fas fa-chalkboard"></i> Teacher Dashboard
      </button>
      <button class="nav-btn" data-tab="myStudents">
        <i class="fas fa-users"></i> My Students
      </button>
      <button class="nav-btn" data-tab="takeAttendance">
        <i class="fas fa-camera"></i> Take Attendance
      </button>
      <button class="nav-btn" data-tab="attendanceRecords">
        <i class="fas fa-clipboard-list"></i> Attendance Records
      </button>
      <button class="nav-btn" data-tab="teacherProfile">
        <i class="fas fa-user-circle"></i> My Profile
      </button>
    `;
  } else {
    navMenu.innerHTML = `
      <button class="nav-btn active" data-tab="dashboard">
        <i class="fas fa-chalkboard-user"></i> Dashboard
      </button>
      <button class="nav-btn" data-tab="profile">
        <i class="fas fa-user-circle"></i> My Profile
      </button>
      <button class="nav-btn" data-tab="assignment">
        <i class="fas fa-pen-ruler"></i> Assignment
      </button>
      <button class="nav-btn" data-tab="ranking">
        <i class="fas fa-trophy"></i> Ranking
      </button>
    `;
  }
  
  // Re-attach listeners
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.getAttribute('data-tab'));
    });
  });
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.remove();
}

// ========================================
// API CALL
// ========================================

async function callAPI(action, data = {}) {
  try {
    const params = new URLSearchParams({ action, ...data });
    const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch(error) {
    console.error("Error:", error);
    return { success: false, error: error.message };
  }
}

// ========================================
// QR CODE GENERATOR (Student)
// ========================================

function generateQRCodeSVG(userData) {
  const qrData = JSON.stringify({
    name: userData.fullName,
    schoolId: userData.schoolId,
    email: userData.email,
    program: userData.program,
    yearLevel: userData.yearLevel,
    section: userData.section
  });
  
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000&format=png`;
  return qrUrl;
}

function generateQRCodeCanvas(userData, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = 250;
  canvas.height = 250;
  const ctx = canvas.getContext('2d');
  
  const dataStr = userData.schoolId + userData.fullName;
  let hash = 0;
  for (let i = 0; i < dataStr.length; i++) {
    hash = ((hash << 5) - hash) + dataStr.charCodeAt(i);
    hash = hash & hash;
  }
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 250, 250);
  
  ctx.fillStyle = '#000000';
  const cellSize = 10;
  const cells = 25;
  
  drawPositionMarker(ctx, 0, 0);
  drawPositionMarker(ctx, 190, 0);
  drawPositionMarker(ctx, 0, 190);
  
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      if ((i < 7 && j < 7) || (i > 17 && j < 7) || (i < 7 && j > 17)) continue;
      
      const value = (hash >> (i * j) % 32) & 1;
      if (value) {
        ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }
  
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText(userData.schoolId, 125, 240);
  
  container.innerHTML = '';
  container.appendChild(canvas);
  
  window.qrCanvas = canvas;
}

function drawPositionMarker(ctx, x, y) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, 70, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 10, y + 10, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + 20, y + 20, 30, 30);
}

function downloadQRCode() {
  if (window.qrCanvas) {
    const link = document.createElement('a');
    link.download = `HydroFit_QR_${currentUser.schoolId}.png`;
    link.href = window.qrCanvas.toDataURL('image/png');
    link.click();
    showToast('QR Code downloaded!', false);
  } else if (window.currentQRCodeUrl) {
    fetch(window.currentQRCodeUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HydroFit_QR_${currentUser.schoolId}.png`;
        link.click();
        URL.revokeObjectURL(url);
        showToast('QR Code downloaded!', false);
      })
      .catch(() => {
        window.open(window.currentQRCodeUrl, '_blank');
        showToast('Right-click the QR code to save it', false);
      });
  }
}

function printQRCode() {
  const qrContainer = document.querySelector('.qr-container');
  if (!qrContainer) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>HydroFit QR Code - ${currentUser.fullName}</title>
        <style>
          body { font-family: 'Inter', sans-serif; text-align: center; padding: 40px; }
          h2 { color: #023e8a; }
          img, canvas { width: 250px; height: 250px; }
        </style>
      </head>
      <body>
        <div style="max-width: 400px; margin: 0 auto;">
          <h2>HydroFit Attendance QR</h2>
          ${qrContainer.innerHTML}
          <p><strong>${escapeHtml(currentUser.fullName)}</strong></p>
          <p>School ID: ${currentUser.schoolId}</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}

// ========================================
// STUDENT DASHBOARD
// ========================================

function renderDashboard() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `
    <div class="slideshow-wrapper">
      <div class="slideshow-container" id="slideshowContainer">
        <div class="slide active" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_1.jpg?updatedAt=1775652185255'); background-size: cover; background-position: center;"></div>
        <div class="slide" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_2.jpg?updatedAt=1775652283140'); background-size: cover; background-position: center;"></div>
        <div class="slide" style="background-image: url('https://ik.imagekit.io/0sf7uub8b/HydroFit/slides_3.jpg?updatedAt=1775652127029'); background-size: cover; background-position: center;"></div>
        <div class="slide-dots" id="slideDots"></div>
      </div>
      <div class="slideshow-overlay">
        <div class="school-badge">
          <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/images%20(4).jpg?updatedAt=1775655891511" alt="MinSU Logo">
          <div class="school-text">
            <strong>Mindoro State University</strong>
            <span>PathFit Class</span>
          </div>
        </div>
      </div>
    </div>

    <div class="welcome-card">
      <h2>Welcome to HydroFit</h2>
      <p>Your Academic Fitness Tracker for PathFit Class</p>
    </div>

    <div class="card">
      <h3><i class="fas fa-info-circle"></i> About HydroFit</h3>
      <p style="margin-bottom: 16px;">
        HydroFit is an academic fitness tracking web application designed specifically for the PathFit program at Mindoro State University. 
        Its purpose is to help students monitor their physical activity, track hydration goals, and stay engaged with their fitness journey throughout the semester.
      </p>
      <p style="margin-bottom: 16px;">
        The platform was created to support the PathFit curriculum by providing a simple and modern digital tool where students can log their progress, 
        view assignments, and check their rankings—all in one place.
      </p>
      
      <div class="dev-credits">
        <p><i class="fas fa-users"></i> Developed by:</p>
        <ul>
          <li><i class="fas fa-user-graduate"></i> Jessrell M. Custodio</li>
          <li><i class="fas fa-user-graduate"></i> John Daniel C. Soriano</li>
          <li><i class="fas fa-user-graduate"></i> John Roberth C. Marchina</li>
        </ul>
        <p class="completion-date">
          <i class="fas fa-calendar-check"></i> Completed April 15, 2026
        </p>
      </div>
    </div>
  `;
  
  initSlideshow();
}

function initSlideshow() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('slideDots');
  if (!slides.length) return;
  
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    });
  }
  
  function goToSlide(n) {
    slides.forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    slides[n].classList.add('active');
    if (document.querySelectorAll('.dot')[n]) {
      document.querySelectorAll('.dot')[n].classList.add('active');
    }
    currentSlide = n;
  }
  
  setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, 4000);
}

// ========================================
// STUDENT PROFILE
// ========================================

async function renderProfile() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading profile...</div>`;
  
  let userData = currentUser;
  
  const programColors = {
    'BSIT': '#00b4d8', 'BSED': '#48cae4', 'BSHM': '#90e0ef', 'BSTM': '#00b894',
    'BS PSYCHOLOGY': '#fdcb6e', 'BSCRIM': '#e17055', 'BTLED': '#6c5ce7', 'BTVTED': '#a29bfe'
  };
  
  const qrCodeUrl = generateQRCodeSVG(userData);
  window.currentQRCodeUrl = qrCodeUrl;
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar"><i class="fas fa-user-graduate"></i></div>
      <h2>${escapeHtml(userData.fullName)}</h2>
      <p>PathFit Student</p>
      <span class="program-badge" style="background: ${programColors[userData.program] || '#00b4d8'}; color: white;">${userData.program}</span>
      <div class="profile-info-grid">
        <div class="info-item"><label>School ID</label><p>${userData.schoolId}</p></div>
        <div class="info-item"><label>Email</label><p>${userData.email}</p></div>
        <div class="info-item"><label>Year Level</label><p>${userData.yearLevel}${getYearSuffix(userData.yearLevel)} Year</p></div>
        <div class="info-item"><label>Section</label><p>${userData.section}</p></div>
      </div>
    </div>
    
    <div class="card qr-card">
      <h3><i class="fas fa-qrcode"></i> Attendance QR Code</h3>
      <p style="color: #64748b; margin-bottom: 20px; font-size: 0.9rem;">Scan this QR code for attendance tracking</p>
      <div style="text-align: center;">
        <div class="qr-container" style="background: white; padding: 20px; border-radius: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <img src="${qrCodeUrl}" alt="QR Code" style="width: 200px; height: 200px; display: block;" id="qrImage" onerror="this.onerror=null; generateQRCodeCanvas(currentUser, 'qrCanvasContainer'); this.style.display='none'; document.getElementById('qrCanvasContainer').style.display='block';">
          <div id="qrCanvasContainer" style="display: none;"></div>
        </div>
        <p style="margin-top: 16px; color: #1a1a1a; font-weight: 600;">
          <i class="fas fa-user"></i> ${escapeHtml(userData.fullName)}
        </p>
        <p style="color: #64748b; font-size: 0.85rem;">
          <i class="fas fa-id-card"></i> ${userData.schoolId}
        </p>
        <button class="btn btn-outline" onclick="window.downloadQRCode()" style="margin-top: 16px; width: 100%;">
          <i class="fas fa-download"></i> Download QR Code
        </button>
        <button class="btn btn-outline" onclick="window.printQRCode()" style="margin-top: 8px; width: 100%;">
          <i class="fas fa-print"></i> Print QR Code
        </button>
      </div>
    </div>
  `;
}

// ========================================
// TEACHER DASHBOARD
// ========================================

async function renderTeacherDashboard() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading dashboard...</div>`;
  
  // Get student count
  const studentsResult = await callAPI("getStudents", { teacherId: currentUser.schoolId });
  const studentCount = studentsResult.success ? studentsResult.students.length : 0;
  
  // Get today's attendance
  const today = new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
  const attendanceResult = await callAPI("getAttendance", { date: today, teacherId: currentUser.schoolId });
  const todayAttendance = attendanceResult.success ? attendanceResult.records.length : 0;
  
  container.innerHTML = `
    <div class="welcome-card">
      <h2>Welcome, ${escapeHtml(currentUser.fullName.split(',')[0])}!</h2>
      <p>Teacher Dashboard - ${currentUser.program} Department</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-users"></i>
        <div class="stat-value">${studentCount}</div>
        <div class="stat-label">Total Students</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-user-check"></i>
        <div class="stat-value">${todayAttendance}</div>
        <div class="stat-label">Present Today</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-door-open"></i>
        <div class="stat-value">2</div>
        <div class="stat-label">Sections</div>
      </div>
    </div>
    
    <div class="card">
      <h3><i class="fas fa-clock"></i> Quick Actions</h3>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;">
        <button class="btn" onclick="window.switchTab('takeAttendance')">
          <i class="fas fa-camera"></i> Take Attendance
        </button>
        <button class="btn btn-outline" onclick="window.switchTab('myStudents')">
          <i class="fas fa-users"></i> View Students
        </button>
        <button class="btn btn-outline" onclick="window.switchTab('attendanceRecords')">
          <i class="fas fa-clipboard-list"></i> View Records
        </button>
      </div>
    </div>
    
    <div class="card">
      <h3><i class="fas fa-calendar-check"></i> Today's Attendance (${today})</h3>
      <div id="todayAttendanceList">
        ${todayAttendance > 0 ? '<p style="color: #64748b;">Loading attendance...</p>' : '<p style="color: #64748b; text-align: center; padding: 20px;">No attendance recorded today. Click "Take Attendance" to start.</p>'}
      </div>
    </div>
  `;
  
  if (todayAttendance > 0) {
    const recordsHtml = attendanceResult.records.slice(0, 5).map(r => `
      <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
        <span><i class="fas fa-user"></i> ${escapeHtml(r.studentName)}</span>
        <span style="color: #00b894;"><i class="fas fa-check-circle"></i> ${r.timeIn}</span>
      </div>
    `).join('');
    const listEl = document.getElementById('todayAttendanceList');
    if (listEl) listEl.innerHTML = recordsHtml || '<p style="color: #64748b;">No records</p>';
  }
}

// ========================================
// TEACHER - MY STUDENTS
// ========================================

async function renderMyStudents() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading students...</div>`;
  
  const result = await callAPI("getStudents", { teacherId: currentUser.schoolId });
  
  if (!result.success) {
    container.innerHTML = `<div class="card"><p style="color: #d63031;">Error loading students</p></div>`;
    return;
  }
  
  const students = result.students;
  const sections = [...new Set(students.map(s => s.section))];
  
  container.innerHTML = `
    <div class="card">
      <h3><i class="fas fa-users"></i> My Students (${students.length})</h3>
      
      <div class="class-selector">
        <button class="class-btn active" onclick="window.filterStudents('all')">All Sections</button>
        ${sections.map(s => `<button class="class-btn" onclick="window.filterStudents('${s}')">Section ${s}</button>`).join('')}
      </div>
      
      <div style="overflow-x: auto;">
        <table class="student-table" id="studentTable">
          <thead>
            <tr>
              <th>School ID</th>
              <th>Full Name</th>
              <th>Program</th>
              <th>Year</th>
              <th>Section</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="studentTableBody">
            ${students.map(s => `
              <tr data-section="${s.section}">
                <td>${s.schoolId}</td>
                <td>${escapeHtml(s.fullName)}</td>
                <td>${s.program}</td>
                <td>${s.yearLevel}</td>
                <td>${s.section}</td>
                <td><span class="status-badge status-present">${s.status || 'Active'}</span></td>
                <td>
                  <button class="btn btn-sm" onclick="window.markAttendance('${s.schoolId}', '${escapeHtml(s.fullName).replace(/'/g, "\\'")}')">
                    <i class="fas fa-check"></i> Mark Present
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  window.filterStudents = function(section) {
    document.querySelectorAll('.class-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const rows = document.querySelectorAll('#studentTableBody tr');
    rows.forEach(row => {
      if (section === 'all' || row.dataset.section === section) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };
  
  window.markAttendance = async function(studentId, studentName) {
    const result = await callAPI("recordAttendance", {
      studentId: studentId,
      teacherId: currentUser.schoolId,
      status: 'Present'
    });
    
    if (result.success) {
      showToast(`Marked ${studentName} as present`, false);
    } else {
      showToast('Failed to mark attendance', true);
    }
  };
}

// ========================================
// TEACHER - TAKE ATTENDANCE (QR Scanner)
// ========================================

function renderTakeAttendance() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `
    <div class="card">
      <h3><i class="fas fa-camera"></i> Scan Student QR Code</h3>
      <p style="color: #64748b; margin-bottom: 20px;">Point your camera at a student's QR code to mark attendance</p>
      
      <div style="text-align: center;">
        <button class="btn" onclick="window.startQRScanner()" style="padding: 16px 32px; font-size: 1.1rem;">
          <i class="fas fa-qrcode"></i> Open QR Scanner
        </button>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 16px;">
        <h4 style="margin-bottom: 16px;"><i class="fas fa-history"></i> Recent Scans</h4>
        <div id="recentScans" style="color: #64748b;">
          <p><i class="fas fa-info-circle"></i> No recent scans</p>
        </div>
      </div>
    </div>
  `;
  
  window.recentScans = window.recentScans || [];
}

function startQRScanner() {
  const modal = document.getElementById("qrScannerModal");
  if (!modal) return;
  
  modal.style.display = "flex";
  
  if (html5QrCode) {
    html5QrCode.stop().then(() => {
      html5QrCode.clear();
      initQRScanner();
    }).catch(() => {
      initQRScanner();
    });
  } else {
    initQRScanner();
  }
}

function initQRScanner() {
  const qrReader = document.getElementById("qr-reader");
  if (!qrReader) return;
  
  html5QrCode = new Html5Qrcode("qr-reader");
  
  const config = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0
  };
  
  html5QrCode.start(
    { facingMode: "environment" },
    config,
    onScanSuccess,
    onScanFailure
  ).catch(err => {
    showToast("Camera access denied or not available", true);
  });
}

async function onScanSuccess(decodedText) {
  try {
    const qrData = JSON.parse(decodedText);
    const studentId = qrData.schoolId;
    
    if (!studentId) {
      showToast("Invalid QR code", true);
      return;
    }
    
    // Stop scanner
    if (html5QrCode) {
      await html5QrCode.stop();
    }
    
    // Record attendance
    const result = await callAPI("recordAttendance", {
      studentId: studentId,
      teacherId: currentUser.schoolId,
      status: 'Present'
    });
    
    const qrResult = document.getElementById("qr-result");
    
    if (result.success) {
      if (qrResult) {
        qrResult.innerHTML = `
          <div style="color: #00b894; padding: 16px;">
            <i class="fas fa-check-circle" style="font-size: 2rem;"></i>
            <p style="margin-top: 8px; font-weight: 600;">${result.record.studentName}</p>
            <p style="font-size: 0.9rem;">Attendance recorded at ${result.record.timeIn}</p>
          </div>
        `;
      }
      showToast(`${result.record.studentName} marked present`, false);
      
      // Add to recent scans
      window.recentScans = window.recentScans || [];
      window.recentScans.unshift({
        name: result.record.studentName,
        time: result.record.timeIn,
        id: studentId
      });
      if (window.recentScans.length > 5) window.recentScans.pop();
      
      updateRecentScansDisplay();
    } else {
      if (qrResult) {
        qrResult.innerHTML = `
          <div style="color: #d63031; padding: 16px;">
            <i class="fas fa-exclamation-circle" style="font-size: 2rem;"></i>
            <p style="margin-top: 8px;">Failed to record attendance</p>
          </div>
        `;
      }
    }
    
    // Restart scanner after 3 seconds
    setTimeout(() => {
      const qrResultEl = document.getElementById("qr-result");
      if (qrResultEl) qrResultEl.innerHTML = '';
      if (html5QrCode) {
        initQRScanner();
      }
    }, 3000);
    
  } catch (error) {
    showToast("Invalid QR code format", true);
  }
}

function onScanFailure(error) {
  // Silently ignore scan failures
}

function updateRecentScansDisplay() {
  const container = document.getElementById("recentScans");
  if (!container) return;
  
  if (!window.recentScans || window.recentScans.length === 0) {
    container.innerHTML = '<p><i class="fas fa-info-circle"></i> No recent scans</p>';
    return;
  }
  
  container.innerHTML = window.recentScans.map(scan => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
      <span><i class="fas fa-user-check" style="color: #00b894;"></i> ${escapeHtml(scan.name)}</span>
      <span style="color: #64748b; font-size: 0.85rem;">${scan.time}</span>
    </div>
  `).join('');
}

// ========================================
// TEACHER - ATTENDANCE RECORDS
// ========================================

async function renderAttendanceRecords() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading records...</div>`;
  
  const result = await callAPI("getAttendance", { teacherId: currentUser.schoolId });
  
  if (!result.success) {
    container.innerHTML = `<div class="card"><p style="color: #d63031;">Error loading records</p></div>`;
    return;
  }
  
  const records = result.records || [];
  const dates = [...new Set(records.map(r => r.date))];
  
  container.innerHTML = `
    <div class="card">
      <h3><i class="fas fa-clipboard-list"></i> Attendance Records</h3>
      
      <div style="margin-bottom: 20px;">
        <select id="dateFilter" class="modal-input" style="width: auto; min-width: 200px;" onchange="window.filterByDate()">
          <option value="all">All Dates</option>
          ${dates.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>
      
      <div style="overflow-x: auto;">
        <table class="student-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Time In</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="recordsTableBody">
            ${records.map(r => `
              <tr data-date="${r.date}">
                <td>${r.date}</td>
                <td>${r.studentId}</td>
                <td>${escapeHtml(r.studentName)}</td>
                <td>${r.timeIn || '--'}</td>
                <td><span class="status-badge status-${r.status?.toLowerCase() || 'present'}">${r.status || 'Present'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      ${records.length === 0 ? '<p style="color: #64748b; text-align: center; padding: 40px;">No attendance records found</p>' : ''}
    </div>
  `;
  
  window.filterByDate = function() {
    const filter = document.getElementById('dateFilter')?.value || 'all';
    const rows = document.querySelectorAll('#recordsTableBody tr');
    rows.forEach(row => {
      if (filter === 'all' || row.dataset.date === filter) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };
}

// ========================================
// TEACHER PROFILE
// ========================================

async function renderTeacherProfile() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  const programColors = {
    'BSIT': '#00b4d8', 'BSED': '#48cae4', 'BSHM': '#90e0ef', 'BSTM': '#00b894',
    'BS PSYCHOLOGY': '#fdcb6e', 'BSCRIM': '#e17055', 'BTLED': '#6c5ce7', 'BTVTED': '#a29bfe'
  };
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar"><i class="fas fa-chalkboard-user"></i></div>
      <h2>${escapeHtml(currentUser.fullName)}</h2>
      <p>PathFit Instructor</p>
      <span class="program-badge" style="background: ${programColors[currentUser.program] || '#48cae4'}; color: white;">${currentUser.program}</span>
      <div class="profile-info-grid">
        <div class="info-item"><label>Teacher ID</label><p>${currentUser.schoolId}</p></div>
        <div class="info-item"><label>Email</label><p>${currentUser.email}</p></div>
        <div class="info-item"><label>Department</label><p>${currentUser.program}</p></div>
        <div class="info-item"><label>Sections</label><p>${currentUser.section || 'Multiple'}</p></div>
      </div>
    </div>
    
    <div class="card">
      <h3><i class="fas fa-chart-bar"></i> Teaching Summary</h3>
      <div class="stats-grid" style="margin-top: 16px;">
        <div class="stat-card">
          <i class="fas fa-users"></i>
          <div class="stat-value" id="teacherStudentCount">--</div>
          <div class="stat-label">Students</div>
        </div>
        <div class="stat-card">
          <i class="fas fa-calendar-check"></i>
          <div class="stat-value" id="teacherAttendanceCount">--</div>
          <div class="stat-label">Total Attendance</div>
        </div>
      </div>
    </div>
  `;
  
  // Load stats
  const studentsResult = await callAPI("getStudents", { teacherId: currentUser.schoolId });
  if (studentsResult.success) {
    const countEl = document.getElementById("teacherStudentCount");
    if (countEl) countEl.innerText = studentsResult.students.length;
  }
  
  const attendanceResult = await callAPI("getAttendance", { teacherId: currentUser.schoolId });
  if (attendanceResult.success) {
    const countEl = document.getElementById("teacherAttendanceCount");
    if (countEl) countEl.innerText = attendanceResult.records.length;
  }
}

// ========================================
// ASSIGNMENT & RANKING (Student)
// ========================================

function renderAssignment() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `
    <div class="card">
      <div style="text-align: center; padding: 40px 20px;">
        <i class="fas fa-pen-ruler" style="font-size: 3.5rem; color: #00b4d8; margin-bottom: 16px;"></i>
        <h3 style="color: #1a1a1a; margin-bottom: 8px;">Assignments Coming Soon</h3>
        <p style="color: #64748b;">Track your PathFit assignments here.</p>
      </div>
    </div>
  `;
}

function renderRanking() {
  const container = document.getElementById("tabContent");
  if (!container) return;
  
  container.innerHTML = `
    <div class="card">
      <div style="text-align: center; padding: 40px 20px;">
        <i class="fas fa-trophy" style="font-size: 3.5rem; color: #00b4d8; margin-bottom: 16px;"></i>
        <h3 style="color: #1a1a1a; margin-bottom: 8px;">Rankings Coming Soon</h3>
        <p style="color: #64748b;">Compete with classmates and climb the leaderboard.</p>
      </div>
    </div>
  `;
}

// ========================================
// TAB SWITCHING
// ========================================

async function switchTab(tab) {
  if (isLoading) return;
  isLoading = true;
  currentTab = tab;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) {
      btn.classList.add('active');
    }
  });
  
  closeSidebar();
  
  // Page titles
  const titles = {
    'dashboard': 'Dashboard', 'profile': 'My Profile', 'assignment': 'Assignments', 'ranking': 'Ranking',
    'teacherDashboard': 'Teacher Dashboard', 'myStudents': 'My Students', 'takeAttendance': 'Take Attendance',
    'attendanceRecords': 'Attendance Records', 'teacherProfile': 'My Profile'
  };
  updatePageTitle(titles[tab] || 'HydroFit');
  
  // Render based on tab
  if (tab === 'dashboard') renderDashboard();
  else if (tab === 'profile') await renderProfile();
  else if (tab === 'assignment') renderAssignment();
  else if (tab === 'ranking') renderRanking();
  else if (tab === 'teacherDashboard') await renderTeacherDashboard();
  else if (tab === 'myStudents') await renderMyStudents();
  else if (tab === 'takeAttendance') renderTakeAttendance();
  else if (tab === 'attendanceRecords') await renderAttendanceRecords();
  else if (tab === 'teacherProfile') await renderTeacherProfile();
  
  isLoading = false;
}

// ========================================
// AUTHENTICATION
// ========================================

async function initAuth() {
  const stored = localStorage.getItem("hydrofit_user");
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      const modal = document.getElementById("authModal");
      if (modal) modal.style.display = "none";
      updateNavMenu();
      updateUserStats();
      
      const defaultTab = currentUser.role === 'teacher' ? 'teacherDashboard' : 'dashboard';
      switchTab(defaultTab);
    } catch(e) { 
      localStorage.removeItem("hydrofit_user"); 
    }
  }
}

// Login
document.getElementById("loginBtn")?.addEventListener("click", async (e) => {
  const btn = e.target;
  const schoolId = document.getElementById("loginSchoolId")?.value.trim();
  const password = document.getElementById("loginPassword")?.value;
  
  if (!schoolId || !password) {
    showToast("Please enter School ID and Password", true);
    return;
  }
  
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  
  const result = await callAPI("login", { schoolId, password });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    currentUser = result.user;
    localStorage.setItem("hydrofit_user", JSON.stringify(currentUser));
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
    updateNavMenu();
    updateUserStats();
    
    const defaultTab = currentUser.role === 'teacher' ? 'teacherDashboard' : 'dashboard';
    switchTab(defaultTab);
    showToast(`Welcome back, ${currentUser.fullName.split(',')[0]}!`, false);
  } else {
    showToast(result.error || "Invalid credentials", true);
  }
});

// Register
document.getElementById("registerBtn")?.addEventListener("click", async (e) => {
  const btn = e.target;
  const fullName = document.getElementById("regFullName")?.value.trim();
  const schoolId = document.getElementById("regSchoolId")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const program = document.getElementById("regProgram")?.value;
  const yearLevel = document.getElementById("regYearLevel")?.value;
  const section = document.getElementById("regSection")?.value.trim();
  const password = document.getElementById("regPassword")?.value;
  const confirmPassword = document.getElementById("regConfirmPassword")?.value;
  const role = document.getElementById("regRole")?.value || 'student';
  
  if (!fullName || !schoolId || !email || !program || !yearLevel || !section || !password) {
    showToast("Please fill in all fields", true);
    return;
  }
  
  if (password !== confirmPassword) {
    showToast("Passwords do not match", true);
    return;
  }
  
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
  
  const result = await callAPI("register", { fullName, schoolId, email, program, yearLevel, section, password, role });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast("Registration successful! Please login.", false);
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    if (registerForm) registerForm.style.display = "none";
    if (loginForm) loginForm.style.display = "block";
    const loginSchoolId = document.getElementById("loginSchoolId");
    if (loginSchoolId) loginSchoolId.value = schoolId;
  } else {
    showToast(result.error || "Registration failed", true);
  }
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  if (html5QrCode) {
    html5QrCode.stop().catch(() => {});
  }
  localStorage.removeItem("hydrofit_user");
  currentUser = null;
  const modal = document.getElementById("authModal");
  if (modal) modal.style.display = "flex";
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  if (loginForm) loginForm.style.display = "block";
  if (registerForm) registerForm.style.display = "none";
  const loginSchoolId = document.getElementById("loginSchoolId");
  const loginPassword = document.getElementById("loginPassword");
  if (loginSchoolId) loginSchoolId.value = "";
  if (loginPassword) loginPassword.value = "";
  closeSidebar();
  showToast("Logged out successfully", false);
});

// Form toggles
document.getElementById("showRegister")?.addEventListener("click", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  if (loginForm) loginForm.style.display = "none";
  if (registerForm) registerForm.style.display = "block";
});

document.getElementById("showLogin")?.addEventListener("click", () => {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  if (registerForm) registerForm.style.display = "none";
  if (loginForm) loginForm.style.display = "block";
});

// Role toggle in login
document.getElementById("studentRoleBtn")?.addEventListener("click", function() {
  this.style.background = "#00b4d8";
  this.style.color = "white";
  this.style.borderColor = "#00b4d8";
  const teacherBtn = document.getElementById("teacherRoleBtn");
  if (teacherBtn) {
    teacherBtn.style.background = "white";
    teacherBtn.style.color = "#64748b";
    teacherBtn.style.borderColor = "#e0e0e0";
  }
  const loginSchoolId = document.getElementById("loginSchoolId");
  if (loginSchoolId) loginSchoolId.placeholder = "School ID (e.g., MCC2025-00001)";
});

document.getElementById("teacherRoleBtn")?.addEventListener("click", function() {
  this.style.background = "#48cae4";
  this.style.color = "white";
  this.style.borderColor = "#48cae4";
  const studentBtn = document.getElementById("studentRoleBtn");
  if (studentBtn) {
    studentBtn.style.background = "white";
    studentBtn.style.color = "#64748b";
    studentBtn.style.borderColor = "#e0e0e0";
  }
  const loginSchoolId = document.getElementById("loginSchoolId");
  if (loginSchoolId) loginSchoolId.placeholder = "Teacher ID (e.g., TCH2025-00001)";
});

// Role toggle in register
document.getElementById("regStudentBtn")?.addEventListener("click", function() {
  this.style.background = "#00b4d8";
  this.style.color = "white";
  const teacherBtn = document.getElementById("regTeacherBtn");
  if (teacherBtn) {
    teacherBtn.style.background = "white";
    teacherBtn.style.color = "#64748b";
  }
  const regRole = document.getElementById("regRole");
  if (regRole) regRole.value = "student";
  const regYearLevel = document.getElementById("regYearLevel");
  if (regYearLevel) regYearLevel.disabled = false;
  const regSchoolId = document.getElementById("regSchoolId");
  if (regSchoolId) regSchoolId.placeholder = "School ID (e.g., MCC2025-00001)";
});

document.getElementById("regTeacherBtn")?.addEventListener("click", function() {
  this.style.background = "#48cae4";
  this.style.color = "white";
  const studentBtn = document.getElementById("regStudentBtn");
  if (studentBtn) {
    studentBtn.style.background = "white";
    studentBtn.style.color = "#64748b";
  }
  const regRole = document.getElementById("regRole");
  if (regRole) regRole.value = "teacher";
  const regYearLevel = document.getElementById("regYearLevel");
  if (regYearLevel) {
    regYearLevel.disabled = true;
    regYearLevel.value = "";
  }
  const regSchoolId = document.getElementById("regSchoolId");
  if (regSchoolId) regSchoolId.placeholder = "Teacher ID (e.g., TCH2025-00001)";
});

// Show test credentials
document.getElementById("showTestCredentials")?.addEventListener("click", () => {
  showToast("Student: MCC2025-00001 / password123 | Teacher: TCH2025-00001 / teacher123", false);
});

// Mobile menu
document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;
  
  sidebar.classList.toggle("open");
  
  if (window.innerWidth <= 768) {
    if (sidebar.classList.contains("open")) {
      const overlay = document.createElement('div');
      overlay.id = 'sidebarOverlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 199;
      `;
      overlay.addEventListener('click', closeSidebar);
      document.body.appendChild(overlay);
    } else {
      const overlay = document.getElementById("sidebarOverlay");
      if (overlay) overlay.remove();
    }
  }
});

// Close scanner modal
document.getElementById("closeScannerBtn")?.addEventListener("click", () => {
  const modal = document.getElementById("qrScannerModal");
  if (modal) modal.style.display = "none";
  if (html5QrCode) {
    html5QrCode.stop().catch(() => {});
  }
});

// Close modals on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSidebar();
    const qrModal = document.getElementById("qrScannerModal");
    if (qrModal) qrModal.style.display = "none";
    if (html5QrCode) {
      html5QrCode.stop().catch(() => {});
    }
  }
});

// Click outside sidebar to close
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("mobileMenuBtn");
    
    if (sidebar && sidebar.classList.contains("open") && 
        !sidebar.contains(e.target) && 
        menuBtn && !menuBtn.contains(e.target)) {
      closeSidebar();
    }
  }
});

// Utility functions
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

function getYearSuffix(year) {
  if (year == 1) return 'st';
  if (year == 2) return 'nd';
  if (year == 3) return 'rd';
  return 'th';
}

// Initialize
window.switchTab = switchTab;
window.downloadQRCode = downloadQRCode;
window.printQRCode = printQRCode;
window.startQRScanner = startQRScanner;
window.closeSidebar = closeSidebar;
window.generateQRCodeCanvas = generateQRCodeCanvas;
window.filterStudents = () => {};
window.markAttendance = () => {};
window.filterByDate = () => {};

// Start auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

console.log("✅ HydroFit Loaded - Teacher Dashboard Ready");