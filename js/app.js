// ========================================
// HYDROFIT - COMPLETE WITH AI GUIDE & ENHANCED RANKINGS
// ========================================

let currentTab = "dashboard";
let currentUser = null;
let isLoading = false;
let assessments = [];

// Custom Confirm Dialog
function showCustomConfirm(message, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease;
  `;
  
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    border-radius: 24px;
    padding: 28px;
    max-width: 380px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
    text-align: center;
  `;
  
  dialog.innerHTML = `
    <div style="font-size: 3rem; color: #d63031; margin-bottom: 16px;">
      <i class="fas fa-exclamation-triangle"></i>
    </div>
    <h3 style="color: #1a1a1a; margin-bottom: 12px; font-size: 1.3rem;">Confirm Delete</h3>
    <p style="color: #64748b; margin-bottom: 24px; line-height: 1.5;">${message}</p>
    <div style="display: flex; gap: 12px;">
      <button id="customConfirmCancel" style="flex: 1; padding: 12px; border: 2px solid #e0e7ff; background: white; border-radius: 12px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s;">
        Cancel
      </button>
      <button id="customConfirmOk" style="flex: 1; padding: 12px; border: none; background: #d63031; color: white; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
        Delete All
      </button>
    </div>
  `;
  
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.getElementById('customConfirmCancel').onclick = () => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 200);
  };
  
  document.getElementById('customConfirmOk').onclick = () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      onConfirm();
    }, 200);
  };
  
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 200);
    }
  };
}

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = isError ? "#d63031" : "#03045e";
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="margin-right: 8px;"></i> ${message}`;
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function updatePageTitle(title) {
  document.getElementById("pageTitle").innerText = title;
}

function updateUserStats() {
  if (currentUser) {
    const lastName = currentUser.fullName.split(',')[0];
    document.getElementById("userNameDisplay").innerHTML = `<i class="fas fa-user"></i> ${lastName}`;
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.remove();
}

function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
        <p style="color: #64748b; margin-top: 8px;">Loading...</p>
      </div>
    `;
  }
}

function showButtonLoading(btn) {
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  return originalText;
}

function restoreButton(btn, originalText) {
  btn.disabled = false;
  btn.innerHTML = originalText;
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
// QR CODE GENERATOR
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
          .print-container { max-width: 400px; margin: 0 auto; }
          h2 { color: #023e8a; }
          img, canvas { width: 250px; height: 250px; }
          p { margin: 10px 0; color: #333; }
        </style>
      </head>
      <body>
        <div class="print-container">
          <h2>HydroFit Attendance QR</h2>
          ${qrContainer.innerHTML}
          <p><strong>${escapeHtml(currentUser.fullName)}</strong></p>
          <p>School ID: ${currentUser.schoolId}</p>
          <p>${currentUser.program} - ${currentUser.yearLevel}${getYearSuffix(currentUser.yearLevel)} Year</p>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">Scan for attendance</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    return m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;';
  });
}

function getYearSuffix(year) {
  if (year == 1) return 'st';
  if (year == 2) return 'nd';
  if (year == 3) return 'rd';
  return 'th';
}

// ========================================
// DASHBOARD
// ========================================

function renderDashboard() {
  const container = document.getElementById("tabContent");
  
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
        view assignments, and check their rankings—all in one place. HydroFit aims to promote a healthy and active lifestyle among students while making fitness tracking easy and accessible.
      </p>
      
      <div class="dev-credits">
        <p><i class="fas fa-users"></i> HydroFit was developed by:</p>
        <ul>
          <li><i class="fas fa-user-graduate"></i> Jessrell M. Custodio</li>
          <li><i class="fas fa-user-graduate"></i> John Daniel C. Soriano</li>
          <li><i class="fas fa-user-graduate"></i> John Roberth C. Marchina</li>
        </ul>
        <p class="completion-date">
          <i class="fas fa-calendar-check"></i> The application was completed on April 15, 2026, as a project dedicated to enhancing the PathFit learning experience through technology and innovation.
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
  
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
  
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
// PROFILE PAGE WITH QR CODE
// ========================================

async function renderProfile() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading profile...</div>`;
  
  let userData = currentUser;
  if (!userData || !userData.schoolId) {
    const result = await callAPI("getProfile", { schoolId: currentUser?.schoolId });
    if (result.success) {
      userData = result.user;
      currentUser = userData;
      localStorage.setItem("hydrofit_user", JSON.stringify(currentUser));
    }
  }
  
  if (!userData) {
    container.innerHTML = `<div class="card"><p style="color: #d63031;">Error loading profile. Please try again.</p></div>`;
    isLoading = false;
    return;
  }
  
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
        <p style="margin-top: 12px; font-size: 0.75rem; color: #94a3b8;">
          <i class="fas fa-info-circle"></i> Present this QR code for attendance
        </p>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const img = document.getElementById('qrImage');
    if (img && !img.complete) {
      img.onerror = function() {
        this.onerror = null;
        generateQRCodeCanvas(userData, 'qrCanvasContainer');
        this.style.display = 'none';
        document.getElementById('qrCanvasContainer').style.display = 'block';
      };
    }
  }, 100);
}

// ========================================
// ASSESSMENT SYSTEM
// ========================================

async function loadAssessments() {
  if (!currentUser) return;
  
  showLoading('assessmentHistory');
  
  const result = await callAPI('getAssessments', { schoolId: currentUser.schoolId });
  
  if (result.success && result.assessments) {
    assessments = result.assessments.map(a => ({
      id: a.id,
      exercise: a.exercise,
      date: a.date,
      value: parseFloat(a.value),
      unit: a.unit,
      intensity: parseInt(a.intensity),
      notes: a.notes,
      rating: parseFloat(a.rating),
      grade: a.grade,
      color: getGradeColor(a.grade)
    }));
    
    assessments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    updateAssessmentHistory();
    updateProgressComparison();
    
    if (assessments.length > 0) {
      updateRatingDisplay(assessments[0]);
    }
  } else {
    updateAssessmentHistory();
    updateProgressComparison();
  }
}

function getGradeColor(grade) {
  const colors = {
    'Excellent': '#00b894',
    'Very Good': '#00b4d8',
    'Good': '#fdcb6e',
    'Fair': '#e17055',
    'Needs Improvement': '#d63031'
  };
  return colors[grade] || '#64748b';
}

function calculateRating(exercise, value, unit, intensity) {
  let baseScore = 0;
  
  if (unit === 'reps') {
    baseScore = Math.min(value / 10, 10);
  } else if (unit === 'seconds') {
    baseScore = Math.min(value / 30, 10);
  } else if (unit === 'minutes') {
    baseScore = Math.min(value * 2, 10);
  } else if (unit === 'meters') {
    baseScore = Math.min(value / 100, 10);
  } else if (unit === 'laps') {
    baseScore = Math.min(value * 2, 10);
  }
  
  const rating = (baseScore * 0.6 + intensity * 0.4).toFixed(1);
  
  let grade = '';
  if (rating >= 8.5) grade = 'Excellent';
  else if (rating >= 7.0) grade = 'Very Good';
  else if (rating >= 5.5) grade = 'Good';
  else if (rating >= 4.0) grade = 'Fair';
  else grade = 'Needs Improvement';
  
  return { rating, grade };
}

async function addAssessment() {
  const exercise = document.getElementById('exerciseType')?.value;
  const date = document.getElementById('assessmentDate')?.value;
  const repetitions = parseInt(document.getElementById('repetitions')?.value);
  const unit = document.getElementById('unit')?.value;
  const intensity = parseInt(document.getElementById('intensity')?.value);
  const notes = document.getElementById('notes')?.value || '';
  
  if (!exercise || !date || !repetitions) {
    showToast('Please fill in all required fields', true);
    return;
  }
  
  const ratingData = calculateRating(exercise, repetitions, unit, intensity);
  
  const btn = document.querySelector('button[onclick="window.addAssessment()"]');
  const originalText = showButtonLoading(btn);
  
  const result = await callAPI('saveAssessment', {
    schoolId: currentUser.schoolId,
    exercise,
    date,
    value: repetitions,
    unit,
    intensity,
    rating: ratingData.rating,
    grade: ratingData.grade,
    notes
  });
  
  restoreButton(btn, originalText);
  
  if (result.success) {
    const assessment = {
      id: result.assessmentId,
      exercise,
      date,
      value: repetitions,
      unit,
      intensity,
      notes,
      rating: ratingData.rating,
      grade: ratingData.grade,
      color: getGradeColor(ratingData.grade)
    };
    
    assessments.unshift(assessment);
    
    updateRatingDisplay(assessment);
    updateAssessmentHistory();
    updateProgressComparison();
    
    document.getElementById('exerciseType').value = '';
    document.getElementById('repetitions').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('intensity').value = 5;
    if (document.getElementById('intensityValue')) {
      document.getElementById('intensityValue').innerText = 5;
    }
    
    showToast('Assessment saved!', false);
  } else {
    showToast(result.error || 'Failed to save assessment', true);
  }
}

async function deleteAssessment(assessmentId) {
  showCustomConfirm('Are you sure you want to delete this assessment?', async () => {
    const result = await callAPI('deleteAssessment', { assessmentId });
    
    if (result.success) {
      assessments = assessments.filter(a => a.id !== assessmentId);
      updateAssessmentHistory();
      updateProgressComparison();
      
      if (assessments.length > 0) {
        updateRatingDisplay(assessments[0]);
      } else {
        document.getElementById('ratingDisplay').innerHTML = `
          <div style="text-align: center; padding: 20px; color: #64748b;">
            <i class="fas fa-chart-bar" style="font-size: 2rem; margin-bottom: 12px;"></i>
            <p>Complete an assessment to see your rating</p>
          </div>
        `;
      }
      
      showToast('Assessment deleted', false);
    } else {
      showToast(result.error || 'Failed to delete', true);
    }
  });
}

async function clearAllAssessments() {
  showCustomConfirm('Are you sure you want to delete ALL assessment history? This action cannot be undone.', async () => {
    const btn = document.querySelector('button[onclick="window.clearAllAssessments()"]');
    const originalText = btn ? showButtonLoading(btn) : '';
    
    const result = await callAPI('clearAllAssessments', { schoolId: currentUser.schoolId });
    
    if (btn) restoreButton(btn, originalText);
    
    if (result.success) {
      assessments = [];
      
      document.getElementById('ratingDisplay').innerHTML = `
        <div style="text-align: center; padding: 20px; color: #64748b;">
          <i class="fas fa-chart-bar" style="font-size: 2rem; margin-bottom: 12px;"></i>
          <p>Complete an assessment to see your rating</p>
        </div>
      `;
      
      updateAssessmentHistory();
      updateProgressComparison();
      
      showToast('All assessments cleared', false);
    } else {
      showToast(result.error || 'Failed to clear assessments', true);
    }
  });
}

async function refreshAssessments() {
  const btn = document.querySelector('button[onclick="window.refreshAssessments()"]');
  const originalText = showButtonLoading(btn);
  
  await loadAssessments();
  
  restoreButton(btn, originalText);
  showToast('Data refreshed!', false);
}

function updateRatingDisplay(assessment) {
  const display = document.getElementById('ratingDisplay');
  if (!display) return;
  
  display.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-size: 3.5rem; font-weight: 800; color: ${assessment.color};">${assessment.rating}</div>
      <div style="font-size: 1.3rem; font-weight: 600; color: ${assessment.color}; margin-bottom: 8px;">${assessment.grade}</div>
      <p style="color: #1a1a1a; font-weight: 600;">${escapeHtml(assessment.exercise)}</p>
      <p style="color: #64748b;">${assessment.value} ${assessment.unit}</p>
      <p style="color: #64748b; font-size: 0.85rem;">Intensity: ${assessment.intensity}/10</p>
      <div style="margin-top: 16px; padding: 12px; background: #f0f9ff; border-radius: 12px;">
        <i class="fas fa-calendar"></i> ${new Date(assessment.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </div>
  `;
}

function updateAssessmentHistory() {
  const historyDiv = document.getElementById('assessmentHistory');
  if (!historyDiv) return;
  
  if (assessments.length === 0) {
    historyDiv.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #64748b;">
        <i class="fas fa-calendar-alt" style="font-size: 2rem; margin-bottom: 12px;"></i>
        <p>No assessments recorded yet</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="history-list">';
  assessments.slice(0, 15).forEach(a => {
    html += `
      <div class="history-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e0e7ff;">
        <div style="flex: 1;">
          <strong>${escapeHtml(a.exercise)}</strong>
          <div style="font-size: 0.8rem; color: #64748b;">
            ${a.value} ${a.unit} | Intensity: ${a.intensity}/10
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8;">
            ${new Date(a.date).toLocaleDateString()}
          </div>
        </div>
        <div style="text-align: right; display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.2rem; font-weight: 700; color: ${a.color};">${a.rating}</span>
          <span style="font-size: 0.7rem; color: ${a.color};">${a.grade}</span>
          <button onclick="window.deleteAssessment('${a.id}')" style="background: none; border: none; color: #d63031; cursor: pointer; padding: 4px 8px;">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  if (assessments.length > 15) {
    html += `<p style="text-align: center; margin-top: 12px; color: #64748b; font-size: 0.85rem;">Showing last 15 of ${assessments.length} assessments</p>`;
  }
  
  html += `
    <div style="display: flex; gap: 8px; margin-top: 16px;">
      <button class="btn btn-outline" onclick="window.clearAllAssessments()" style="flex: 1;">
        <i class="fas fa-trash"></i> Clear All
      </button>
      <button class="btn btn-outline" onclick="window.refreshAssessments()" style="flex: 1;">
        <i class="fas fa-sync-alt"></i> Refresh
      </button>
    </div>
  `;
  
  historyDiv.innerHTML = html;
}

function updateProgressComparison() {
  const progressDiv = document.getElementById('progressComparison');
  if (!progressDiv) return;
  
  if (assessments.length < 2) {
    progressDiv.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #64748b;">
        <i class="fas fa-chart-simple" style="font-size: 2rem; margin-bottom: 12px;"></i>
        <p>Complete at least 2 assessments to compare progress</p>
      </div>
    `;
    return;
  }
  
  const exerciseGroups = {};
  assessments.forEach(a => {
    if (!exerciseGroups[a.exercise]) {
      exerciseGroups[a.exercise] = [];
    }
    exerciseGroups[a.exercise].push(a);
  });
  
  let html = '<div style="margin-bottom: 16px;">';
  let hasComparison = false;
  
  for (const [exercise, items] of Object.entries(exerciseGroups)) {
    if (items.length >= 2) {
      hasComparison = true;
      const sorted = items.sort((a, b) => new Date(a.date) - new Date(b.date));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const improvement = (last.rating - first.rating).toFixed(1);
      const improved = improvement > 0;
      
      html += `
        <div style="background: #f8fafc; padding: 12px; border-radius: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>${escapeHtml(exercise)}</strong>
            <span style="color: ${improved ? '#00b894' : '#d63031'};">
              ${improved ? '↑' : '↓'} ${Math.abs(improvement)} points
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.85rem;">
            <span>First: ${first.rating} (${first.grade})</span>
            <span>→</span>
            <span>Latest: ${last.rating} (${last.grade})</span>
          </div>
          <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 4px;">
            ${items.length} assessment${items.length > 1 ? 's' : ''}
          </div>
        </div>
      `;
    }
  }
  
  html += '</div>';
  
  if (!hasComparison) {
    html = `
      <div style="text-align: center; padding: 20px; color: #64748b;">
        <i class="fas fa-chart-simple" style="font-size: 2rem; margin-bottom: 12px;"></i>
        <p>Complete multiple assessments of the same exercise to see progress</p>
      </div>
    `;
  }
  
  progressDiv.innerHTML = html;
}

function renderAssessment() {
  const container = document.getElementById("tabContent");
  
  const exerciseTypes = [
    "Jumping Jacks", "Arm Circles", "High Knees", "Butt Kicks", "Neck Rotation",
    "Torso Twists", "Push-Ups", "Sit-Ups", "Crunches", "Squats",
    "Lunges", "Plank", "Wall Sit", "Burpees", "Deadlift",
    "Bench Press", "Bicep Curl", "Tricep Dip", "Running", "Jogging",
    "Walking", "Skipping Rope", "Cycling", "Mountain Climbers", "Stair Climbing",
    "Stretching", "Toe Touch", "Side Stretch", "Cobra Stretch", "Hamstring Stretch",
    "Quadriceps Stretch", "Shoulder Stretch", "One-Leg Stand", "Heel-to-Toe Walk", "Balance Walk",
    "Single-Leg Squat", "Bending", "Twisting", "Swaying", "Swinging",
    "Pushing", "Pulling", "Swimming", "Water Walking", "Water Jogging",
    "Aqua Jumping Jacks", "Flutter Kicks", "Arm Pushes in Water"
  ];
  
  container.innerHTML = `
    <div class="fitness-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png" alt="Fitness Assessment Banner">
    </div>

    <div class="card">
      <h3><i class="fas fa-plus-circle"></i> New Assessment</h3>
      <div class="form-row">
        <div class="form-group">
          <label>Exercise Type</label>
          <select id="exerciseType" class="form-control">
            <option value="">Select Exercise</option>
            ${exerciseTypes.map(ex => `<option value="${ex}">${ex}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="assessmentDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Repetitions / Duration</label>
          <input type="number" id="repetitions" class="form-control" placeholder="e.g., 20 reps or 60 seconds" min="0">
        </div>
        <div class="form-group">
          <label>Unit</label>
          <select id="unit" class="form-control">
            <option value="reps">Repetitions</option>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="meters">Meters</option>
            <option value="laps">Laps</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Intensity Level (1-10)</label>
          <input type="range" id="intensity" class="form-control" min="1" max="10" value="5" step="1" oninput="document.getElementById('intensityValue').innerText = this.value">
          <span id="intensityValue" style="font-weight: 600; color: var(--primary);">5</span>/10
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Notes (Optional)</label>
          <textarea id="notes" class="form-control" rows="2" placeholder="Any additional notes..."></textarea>
        </div>
      </div>
      
      <button class="btn" onclick="window.addAssessment()" style="width: 100%; margin-top: 16px;">
        <i class="fas fa-save"></i> Save Assessment
      </button>
    </div>

    <div class="card">
      <h3><i class="fas fa-star"></i> Performance Rating</h3>
      <div id="ratingDisplay">
        <div style="text-align: center; padding: 20px; color: #64748b;">
          <i class="fas fa-chart-bar" style="font-size: 2rem; margin-bottom: 12px;"></i>
          <p>Complete an assessment to see your rating</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3><i class="fas fa-history"></i> Assessment History</h3>
      <div id="assessmentHistory">
        <div style="text-align: center; padding: 20px;">
          <i class="fas fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
          <p style="color: #64748b; margin-top: 8px;">Loading...</p>
        </div>
      </div>
    </div>

    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Progress Comparison</h3>
      <div id="progressComparison">
        <div style="text-align: center; padding: 20px; color: #64748b;">
          <i class="fas fa-chart-simple" style="font-size: 2rem; margin-bottom: 12px;"></i>
          <p>Complete at least 2 assessments to compare progress</p>
        </div>
      </div>
    </div>
  `;
  
  loadAssessments();
}

// ========================================
// RANKING PAGE - ENHANCED WITH DURATION & INTENSITY
// ========================================

function renderRanking() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="ranking-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Exercise%20Presentation.png" alt="Exercise Rankings Banner" style="width: 100%; border-radius: 20px; margin-bottom: 20px;">
    </div>
    <div id="rankingsContainer">
      <div class="loading-placeholder">
        <i class="fas fa-spinner fa-spin"></i> Loading rankings...
      </div>
    </div>
  `;
  
  loadRankings();
}

async function loadRankings() {
  if (!currentUser) return;
  
  const result = await callAPI('getAllAssessments', {});
  
  const container = document.getElementById('rankingsContainer');
  
  if (!result.success || !result.assessments || result.assessments.length === 0) {
    container.innerHTML = `
      <div class="card">
        <div style="text-align: center; padding: 40px 20px;">
          <i class="fas fa-trophy" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 16px;"></i>
          <p style="color: #64748b;">No assessments available for ranking yet.</p>
          <p style="color: #94a3b8; font-size: 0.9rem; margin-top: 8px;">Complete assessments to see rankings!</p>
        </div>
      </div>
    `;
    return;
  }
  
  const exerciseRankings = {};
  
  result.assessments.forEach(a => {
    if (!exerciseRankings[a.exercise]) {
      exerciseRankings[a.exercise] = [];
    }
    
    const existingIndex = exerciseRankings[a.exercise].findIndex(
      e => e.schoolId === a.schoolId
    );
    
    const entry = {
      schoolId: a.schoolId,
      studentName: a.studentName || 'Student',
      rating: parseFloat(a.rating),
      grade: a.grade,
      value: parseFloat(a.value),
      unit: a.unit,
      intensity: parseInt(a.intensity) || 5,
      date: a.date
    };
    
    if (existingIndex === -1) {
      exerciseRankings[a.exercise].push(entry);
    } else {
      // Keep the best performance based on rating, then value, then intensity
      const existing = exerciseRankings[a.exercise][existingIndex];
      if (parseFloat(a.rating) > existing.rating ||
          (parseFloat(a.rating) === existing.rating && parseFloat(a.value) > existing.value) ||
          (parseFloat(a.rating) === existing.rating && parseFloat(a.value) === existing.value && parseInt(a.intensity) > existing.intensity)) {
        exerciseRankings[a.exercise][existingIndex] = entry;
      }
    }
  });
  
  // Sort by rating, then value, then intensity
  for (const exercise in exerciseRankings) {
    exerciseRankings[exercise].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.value !== a.value) return b.value - a.value;
      return b.intensity - a.intensity;
    });
  }
  
  let html = '';
  
  for (const [exercise, rankings] of Object.entries(exerciseRankings)) {
    html += `
      <div class="card ranking-card" style="margin-bottom: 24px;">
        <h3 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-medal" style="color: #fdcb6e;"></i>
          ${escapeHtml(exercise)}
          <span style="font-size: 0.8rem; color: #64748b; margin-left: auto;">
            ${rankings.length} participant${rankings.length !== 1 ? 's' : ''}
          </span>
        </h3>
        
        <table class="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Rating</th>
              <th>Grade</th>
              <th>Performance</th>
              <th>Intensity</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    rankings.slice(0, 10).forEach((r, index) => {
      const rank = index + 1;
      let rankClass = 'rank-other';
      if (rank === 1) rankClass = 'rank-1';
      else if (rank === 2) rankClass = 'rank-2';
      else if (rank === 3) rankClass = 'rank-3';
      
      const isCurrentUser = r.schoolId === currentUser.schoolId;
      
      // Format unit display
      let unitDisplay = r.unit;
      if (r.unit === 'reps') unitDisplay = 'reps';
      else if (r.unit === 'seconds') unitDisplay = 'sec';
      else if (r.unit === 'minutes') unitDisplay = 'min';
      else if (r.unit === 'meters') unitDisplay = 'm';
      else if (r.unit === 'laps') unitDisplay = 'laps';
      
      html += `
        <tr style="${isCurrentUser ? 'background: #e0f2fe; font-weight: 600;' : ''}">
          <td>
            <span class="rank-badge ${rankClass}">${rank}</span>
          </td>
          <td>
            ${escapeHtml(r.studentName)}
            ${isCurrentUser ? ' <span style="color: var(--primary); font-size: 0.75rem;">(You)</span>' : ''}
          </td>
          <td style="font-weight: 700; color: ${getGradeColor(r.grade)};">${r.rating}</td>
          <td style="color: ${getGradeColor(r.grade)};">${r.grade}</td>
          <td style="color: #1a1a1a; font-weight: 500;">${r.value} ${unitDisplay}</td>
          <td style="color: #64748b;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <div style="width: 40px; height: 6px; background: #e0e7ff; border-radius: 3px; overflow: hidden;">
                <div style="width: ${r.intensity * 10}%; height: 100%; background: ${getIntensityColor(r.intensity)}; border-radius: 3px;"></div>
              </div>
              <span style="font-size: 0.8rem;">${r.intensity}/10</span>
            </div>
          </td>
        </tr>
      `;
    });
    
    if (rankings.length > 10) {
      html += `
        <tr>
          <td colspan="6" style="text-align: center; color: #64748b; font-size: 0.85rem; padding: 12px;">
            ... and ${rankings.length - 10} more participants
          </td>
        </tr>
      `;
    }
    
    html += `
          </tbody>
        </table>
      </div>
    `;
  }
  
  container.innerHTML = html;
}

function getIntensityColor(intensity) {
  if (intensity >= 8) return '#00b894';
  if (intensity >= 6) return '#00b4d8';
  if (intensity >= 4) return '#fdcb6e';
  return '#e17055';
}

// ========================================
// AI EXERCISE GUIDE PAGE
// ========================================
// Chatbase AI Integration
function initChatbaseAI() {
  if (window.chatbase && window.chatbase("getState") === "initialized") return;
  
  window.chatbaseConfig = { chatbotId: "Zqs29nX4-jV3VlilBTsjp" };
  
  const script = document.createElement('script');
  script.src = "https://www.chatbase.co/embed.min.js";
  script.id = "Zqs29nX4-jV3VlilBTsjp";
  script.defer = true;
  script.onload = () => {
    console.log('✅ Chatbase AI loaded');
  };
  
  document.body.appendChild(script);
}

// ========================================
// TAB SWITCHING
// ========================================

function switchTab(tab) {
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
  
  if (tab === 'dashboard') { 
    updatePageTitle('Dashboard'); 
    renderDashboard(); 
    isLoading = false;
  }
  else if (tab === 'profile') { 
    updatePageTitle('My Profile'); 
    renderProfile().then(() => isLoading = false);
    return;
  }
  else if (tab === 'assessment') { 
    updatePageTitle('Fitness Assessment'); 
    renderAssessment(); 
    isLoading = false;
  }
  else if (tab === 'ranking') { 
    updatePageTitle('Rankings'); 
    renderRanking(); 
    isLoading = false;
  }
  else if (tab === 'aiguide') { 
    updatePageTitle('AI Exercise Guide'); 
    renderAIGuide(); 
    isLoading = false;
  }
}

// ========================================
// AUTHENTICATION
// ========================================

async function initAuth() {
  const stored = localStorage.getItem("hydrofit_user");
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      document.getElementById("authModal").style.display = "none";
      updateUserStats();
      switchTab('dashboard');
    } catch(e) { 
      localStorage.removeItem("hydrofit_user"); 
    }
  }
}

document.getElementById("loginBtn")?.addEventListener("click", async (e) => {
  const btn = e.target;
  const schoolId = document.getElementById("loginSchoolId").value.trim();
  const password = document.getElementById("loginPassword").value;
  
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
    document.getElementById("authModal").style.display = "none";
    updateUserStats();
    switchTab('dashboard');
    showToast(`Welcome back, ${currentUser.fullName.split(',')[0]}!`, false);
  } else {
    showToast(result.error || "Invalid School ID or Password", true);
  }
});

document.getElementById("registerBtn")?.addEventListener("click", async (e) => {
  const btn = e.target;
  const fullName = document.getElementById("regFullName").value.trim();
  const schoolId = document.getElementById("regSchoolId").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const program = document.getElementById("regProgram").value;
  const yearLevel = document.getElementById("regYearLevel").value;
  const section = document.getElementById("regSection").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  
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
  
  const result = await callAPI("register", { fullName, schoolId, email, program, yearLevel, section, password });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast("Registration successful! Please login.", false);
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("loginSchoolId").value = schoolId;
  } else {
    showToast(result.error || "Registration failed", true);
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("hydrofit_user");
  currentUser = null;
  document.getElementById("authModal").style.display = "flex";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginSchoolId").value = "";
  document.getElementById("loginPassword").value = "";
  closeSidebar();
  showToast("Logged out successfully", false);
});

document.getElementById("showRegister")?.addEventListener("click", () => {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
});

document.getElementById("showLogin")?.addEventListener("click", () => {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
});

document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
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

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    switchTab(btn.getAttribute('data-tab'));
  });
});

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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

// Initialize
window.switchTab = switchTab;
window.downloadQRCode = downloadQRCode;
window.printQRCode = printQRCode;
window.closeSidebar = closeSidebar;
window.generateQRCodeCanvas = generateQRCodeCanvas;
window.addAssessment = addAssessment;
window.clearAllAssessments = clearAllAssessments;
window.deleteAssessment = deleteAssessment;
window.loadAssessments = loadAssessments;
window.refreshAssessments = refreshAssessments;
window.setPrompt = setPrompt;

initAuth();

console.log("✅ HydroFit Loaded - Complete with AI Guide");