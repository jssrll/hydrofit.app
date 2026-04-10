// ========================================
// HYDROFIT - COMPLETE APPLICATION
// ========================================

let currentTab = "dashboard";
let currentUser = null;
let isLoading = false;
let assessments = [];

// Toast notification
function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = isError ? "#d63031" : "#03045e";
  toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="margin-right: 8px;"></i> ${message}`;
  setTimeout(() => { toast.style.display = "none"; }, 3000);
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
  sidebar.classList.remove("open");
  if (overlay) overlay.remove();
}

// API Call
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

// QR Code Generator
function generateQRCodeSVG(userData) {
  const qrData = JSON.stringify({
    name: userData.fullName,
    schoolId: userData.schoolId,
    email: userData.email,
    program: userData.program,
    yearLevel: userData.yearLevel,
    section: userData.section
  });
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000&format=png`;
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
  
  // Position markers
  ctx.fillRect(0, 0, 70, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, 10, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillRect(20, 20, 30, 30);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(180, 0, 70, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(190, 10, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillRect(200, 20, 30, 30);
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 180, 70, 70);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, 190, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillRect(20, 200, 30, 30);
  
  const cellSize = 10;
  for (let i = 0; i < 25; i++) {
    for (let j = 0; j < 25; j++) {
      if ((i < 7 && j < 7) || (i > 17 && j < 7) || (i < 7 && j > 17)) continue;
      const value = (hash >> (i * j) % 32) & 1;
      if (value) {
        ctx.fillStyle = '#000000';
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
        showToast('Right-click to save', false);
      });
  }
}

function printQRCode() {
  const qrContainer = document.querySelector('.qr-container');
  if (!qrContainer) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html><head><title>HydroFit QR - ${currentUser.fullName}</title>
    <style>body{font-family:Inter,sans-serif;text-align:center;padding:40px}img,canvas{width:250px;height:250px}</style></head>
    <body><div style="max-width:400px;margin:0 auto"><h2>HydroFit Attendance QR</h2>${qrContainer.innerHTML}
    <p><strong>${escapeHtml(currentUser.fullName)}</strong></p><p>ID: ${currentUser.schoolId}</p></div></body></html>
  `);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);
}

function getYearSuffix(year) {
  if (year == 1) return 'st';
  if (year == 2) return 'nd';
  if (year == 3) return 'rd';
  return 'th';
}

// Dashboard
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
          <div class="school-text"><strong>Mindoro State University</strong><span>PathFit Class</span></div>
        </div>
      </div>
    </div>
    <div class="welcome-card"><h2>Welcome to HydroFit</h2><p>Your Academic Fitness Tracker for PathFit Class</p></div>
    <div class="card">
      <h3><i class="fas fa-info-circle"></i> About HydroFit</h3>
      <p style="margin-bottom:16px">HydroFit is an academic fitness tracking web application designed specifically for the PathFit program at Mindoro State University. Its purpose is to help students monitor their physical activity, track hydration goals, and stay engaged with their fitness journey throughout the semester.</p>
      <p style="margin-bottom:16px">The platform was created to support the PathFit curriculum by providing a simple and modern digital tool where students can log their progress, view assessments, and check their rankings—all in one place.</p>
      <div class="dev-credits">
        <p><i class="fas fa-users"></i> Developed by:</p>
        <ul><li><i class="fas fa-user-graduate"></i> Jessrell M. Custodio</li><li><i class="fas fa-user-graduate"></i> John Daniel C. Soriano</li><li><i class="fas fa-user-graduate"></i> John Roberth C. Marchina</li></ul>
        <p class="completion-date"><i class="fas fa-calendar-check"></i> Completed April 15, 2026</p>
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
    if (document.querySelectorAll('.dot')[n]) document.querySelectorAll('.dot')[n].classList.add('active');
    currentSlide = n;
  }
  
  setInterval(() => { goToSlide((currentSlide + 1) % slides.length); }, 4000);
}

// Profile
async function renderProfile() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `<div class="loading-placeholder"><i class="fas fa-spinner fa-spin"></i> Loading profile...</div>`;
  
  let userData = currentUser;
  if (!userData || !userData.schoolId) {
    const result = await callAPI("getProfile", { schoolId: currentUser?.schoolId });
    if (result.success) { userData = result.user; currentUser = userData; localStorage.setItem("hydrofit_user", JSON.stringify(currentUser)); }
  }
  
  if (!userData) { container.innerHTML = `<div class="card"><p style="color:#d63031">Error loading profile</p></div>`; isLoading = false; return; }
  
  const programColors = {'BSIT':'#00b4d8','BSED':'#48cae4','BSHM':'#90e0ef','BSTM':'#00b894','BS PSYCHOLOGY':'#fdcb6e','BSCRIM':'#e17055','BTLED':'#6c5ce7','BTVTED':'#a29bfe'};
  const qrCodeUrl = generateQRCodeSVG(userData);
  window.currentQRCodeUrl = qrCodeUrl;
  
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar"><i class="fas fa-user-graduate"></i></div>
      <h2>${escapeHtml(userData.fullName)}</h2><p>PathFit Student</p>
      <span class="program-badge" style="background:${programColors[userData.program]||'#00b4d8'};color:white">${userData.program}</span>
      <div class="profile-info-grid">
        <div class="info-item"><label>School ID</label><p>${userData.schoolId}</p></div>
        <div class="info-item"><label>Email</label><p>${userData.email}</p></div>
        <div class="info-item"><label>Year Level</label><p>${userData.yearLevel}${getYearSuffix(userData.yearLevel)} Year</p></div>
        <div class="info-item"><label>Section</label><p>${userData.section}</p></div>
      </div>
    </div>
    <div class="card qr-card">
      <h3><i class="fas fa-qrcode"></i> Attendance QR Code</h3>
      <p style="color:#64748b;margin-bottom:20px">Scan for attendance tracking</p>
      <div style="text-align:center">
        <div class="qr-container" style="background:white;padding:20px;border-radius:16px;display:inline-block;box-shadow:0 4px 12px rgba(0,0,0,0.1)">
          <img src="${qrCodeUrl}" alt="QR Code" style="width:200px;height:200px;display:block" id="qrImage" onerror="this.onerror=null;generateQRCodeCanvas(currentUser,'qrCanvasContainer');this.style.display='none';document.getElementById('qrCanvasContainer').style.display='block'">
          <div id="qrCanvasContainer" style="display:none"></div>
        </div>
        <p style="margin-top:16px"><i class="fas fa-user"></i> ${escapeHtml(userData.fullName)}</p>
        <p style="color:#64748b"><i class="fas fa-id-card"></i> ${userData.schoolId}</p>
        <button class="btn btn-outline" onclick="window.downloadQRCode()" style="margin-top:16px;width:100%"><i class="fas fa-download"></i> Download</button>
        <button class="btn btn-outline" onclick="window.printQRCode()" style="margin-top:8px;width:100%"><i class="fas fa-print"></i> Print</button>
      </div>
    </div>
  `;
}

// Fitness Assessment System
const exerciseTypes = ["Jumping Jacks","Arm Circles","High Knees","Butt Kicks","Neck Rotation","Torso Twists","Push-Ups","Sit-Ups","Crunches","Squats","Lunges","Plank","Wall Sit","Burpees","Deadlift","Bench Press","Bicep Curl","Tricep Dip","Running","Jogging","Walking","Skipping Rope","Cycling","Mountain Climbers","Stair Climbing","Stretching","Toe Touch","Side Stretch","Cobra Stretch","Hamstring Stretch","Quadriceps Stretch","Shoulder Stretch","One-Leg Stand","Heel-to-Toe Walk","Balance Walk","Single-Leg Squat","Bending","Twisting","Swaying","Swinging","Pushing","Pulling","Swimming","Water Walking","Water Jogging","Aqua Jumping Jacks","Flutter Kicks","Arm Pushes in Water"];

function renderAssignment() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `
    <div class="fitness-header"><h2><i class="fas fa-clipboard-list"></i> Fitness Assessment System</h2><p>Tracks physical performance and compares results over time</p></div>
    <div class="card">
      <h3><i class="fas fa-plus-circle"></i> New Assessment</h3>
      <div class="form-row">
        <div class="form-group"><label>Exercise Type</label><select id="exerciseType" class="form-control"><option value="">Select Exercise</option>${exerciseTypes.map(ex=>`<option value="${ex}">${ex}</option>`).join('')}</select></div>
        <div class="form-group"><label>Date</label><input type="date" id="assessmentDate" class="form-control" value="${new Date().toISOString().split('T')[0]}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Repetitions / Duration</label><input type="number" id="repetitions" class="form-control" placeholder="e.g., 20" min="0"></div>
        <div class="form-group"><label>Unit</label><select id="unit" class="form-control"><option value="reps">Repetitions</option><option value="seconds">Seconds</option><option value="minutes">Minutes</option><option value="meters">Meters</option><option value="laps">Laps</option></select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Intensity (1-10)</label><input type="range" id="intensity" class="form-control" min="1" max="10" value="5" oninput="document.getElementById('intensityValue').innerText=this.value"><span id="intensityValue">5</span>/10</div>
      </div>
      <div class="form-group"><label>Notes</label><textarea id="notes" class="form-control" rows="2"></textarea></div>
      <button class="btn" onclick="window.addAssessment()" style="width:100%;margin-top:16px"><i class="fas fa-save"></i> Save Assessment</button>
    </div>
    <div class="card"><h3><i class="fas fa-star"></i> Performance Rating</h3><div id="ratingDisplay"><div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-bar" style="font-size:2rem"></i><p>Complete an assessment to see your rating</p></div></div></div>
    <div class="card"><h3><i class="fas fa-history"></i> Assessment History</h3><div id="assessmentHistory"><div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-calendar-alt" style="font-size:2rem"></i><p>No assessments recorded yet</p></div></div></div>
    <div class="card"><h3><i class="fas fa-chart-line"></i> Progress Comparison</h3><div id="progressComparison"><div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-simple" style="font-size:2rem"></i><p>Complete multiple assessments to see progress</p></div></div></div>
  `;
  loadAssessments();
}

async function loadAssessments() {
  if (!currentUser) return;
  const result = await callAPI('getAssessments', { schoolId: currentUser.schoolId });
  if (result.success && result.assessments) {
    assessments = result.assessments.map(a => ({
      id: a.id, exercise: a.exercise, date: a.date, value: parseFloat(a.value), unit: a.unit,
      intensity: parseInt(a.intensity), notes: a.notes, rating: parseFloat(a.rating), grade: a.grade,
      color: {'Excellent':'#00b894','Very Good':'#00b4d8','Good':'#fdcb6e','Fair':'#e17055','Needs Improvement':'#d63031'}[a.grade]||'#64748b'
    }));
    assessments.sort((a,b) => new Date(b.date) - new Date(a.date));
    updateAssessmentHistory();
    updateProgressComparison();
    if (assessments.length > 0) updateRatingDisplay(assessments[0]);
  }
}

function calculateRating(exercise, value, unit, intensity) {
  let baseScore = 0;
  if (unit === 'reps') baseScore = Math.min(value/10, 10);
  else if (unit === 'seconds') baseScore = Math.min(value/30, 10);
  else if (unit === 'minutes') baseScore = Math.min(value*2, 10);
  else if (unit === 'meters') baseScore = Math.min(value/100, 10);
  else if (unit === 'laps') baseScore = Math.min(value*2, 10);
  const rating = (baseScore*0.6 + intensity*0.4).toFixed(1);
  let grade = rating>=8.5?'Excellent':rating>=7.0?'Very Good':rating>=5.5?'Good':rating>=4.0?'Fair':'Needs Improvement';
  return { rating, grade };
}

async function addAssessment() {
  const exercise = document.getElementById('exerciseType').value;
  const date = document.getElementById('assessmentDate').value;
  const repetitions = parseInt(document.getElementById('repetitions').value);
  const unit = document.getElementById('unit').value;
  const intensity = parseInt(document.getElementById('intensity').value);
  const notes = document.getElementById('notes').value;
  
  if (!exercise || !date || !repetitions) { showToast('Please fill all required fields', true); return; }
  
  const ratingData = calculateRating(exercise, repetitions, unit, intensity);
  const btn = document.querySelector('button[onclick="window.addAssessment()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  const result = await callAPI('saveAssessment', { schoolId: currentUser.schoolId, exercise, date, value: repetitions, unit, intensity, rating: ratingData.rating, grade: ratingData.grade, notes });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    const assessment = { id: result.assessmentId, exercise, date, value: repetitions, unit, intensity, notes, rating: ratingData.rating, grade: ratingData.grade, color: {'Excellent':'#00b894','Very Good':'#00b4d8','Good':'#fdcb6e','Fair':'#e17055','Needs Improvement':'#d63031'}[ratingData.grade] };
    assessments.unshift(assessment);
    updateRatingDisplay(assessment);
    updateAssessmentHistory();
    updateProgressComparison();
    document.getElementById('exerciseType').value = '';
    document.getElementById('repetitions').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('intensity').value = 5;
    document.getElementById('intensityValue').innerText = 5;
    showToast('Assessment saved to Sheets!', false);
  } else { showToast(result.error || 'Failed to save', true); }
}

function updateRatingDisplay(assessment) {
  document.getElementById('ratingDisplay').innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:3.5rem;font-weight:800;color:${assessment.color}">${assessment.rating}</div>
      <div style="font-size:1.3rem;font-weight:600;color:${assessment.color};margin-bottom:8px">${assessment.grade}</div>
      <p style="color:#1a1a1a;font-weight:600">${escapeHtml(assessment.exercise)}</p>
      <p style="color:#64748b">${assessment.value} ${assessment.unit} | Intensity: ${assessment.intensity}/10</p>
      <div style="margin-top:16px;padding:12px;background:#f0f9ff;border-radius:12px"><i class="fas fa-calendar"></i> ${new Date(assessment.date).toLocaleDateString()}</div>
      <p style="margin-top:12px;font-size:0.75rem;color:#94a3b8"><i class="fas fa-cloud-check"></i> Synced to Google Sheets</p>
    </div>`;
}

function updateAssessmentHistory() {
  const historyDiv = document.getElementById('assessmentHistory');
  if (assessments.length === 0) {
    historyDiv.innerHTML = `<div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-calendar-alt" style="font-size:2rem"></i><p>No assessments recorded yet</p><p style="font-size:0.85rem">Data syncs with Google Sheets</p></div>`;
    return;
  }
  let html = '<div class="history-list">';
  assessments.slice(0, 15).forEach(a => {
    html += `<div class="history-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #e0e7ff">
      <div style="flex:1"><strong>${escapeHtml(a.exercise)}</strong><div style="font-size:0.8rem;color:#64748b">${a.value} ${a.unit} | Intensity: ${a.intensity}/10</div><div style="font-size:0.75rem;color:#94a3b8">${new Date(a.date).toLocaleDateString()} <i class="fas fa-cloud" style="color:#00b894" title="Synced"></i></div></div>
      <div style="text-align:right;display:flex;align-items:center;gap:12px"><span style="font-size:1.2rem;font-weight:700;color:${a.color}">${a.rating}</span><span style="font-size:0.7rem;color:${a.color}">${a.grade}</span><button onclick="window.deleteAssessment('${a.id}')" style="background:none;border:none;color:#d63031;cursor:pointer"><i class="fas fa-trash-alt"></i></button></div>
    </div>`;
  });
  html += '</div>';
  if (assessments.length > 15) html += `<p style="text-align:center;margin-top:12px;color:#64748b">Showing last 15 of ${assessments.length}</p>`;
  html += `<div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-outline" onclick="window.clearAllAssessments()" style="flex:1"><i class="fas fa-trash"></i> Clear All</button><button class="btn btn-outline" onclick="window.loadAssessments()" style="flex:1"><i class="fas fa-sync-alt"></i> Refresh</button></div>`;
  historyDiv.innerHTML = html;
}

function updateProgressComparison() {
  const progressDiv = document.getElementById('progressComparison');
  if (assessments.length < 2) {
    progressDiv.innerHTML = `<div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-simple" style="font-size:2rem"></i><p>Complete at least 2 assessments to compare</p></div>`;
    return;
  }
  const groups = {}; assessments.forEach(a => { if(!groups[a.exercise]) groups[a.exercise]=[]; groups[a.exercise].push(a); });
  let html = '<div>', has = false;
  for (const [ex, items] of Object.entries(groups)) {
    if (items.length >= 2) {
      has = true;
      const sorted = items.sort((a,b) => new Date(a.date) - new Date(b.date));
      const first = sorted[0], last = sorted[sorted.length-1];
      const imp = (last.rating - first.rating).toFixed(1);
      html += `<div style="background:#f8fafc;padding:12px;border-radius:12px;margin-bottom:12px"><div style="display:flex;justify-content:space-between"><strong>${escapeHtml(ex)}</strong><span style="color:${imp>0?'#00b894':'#d63031'}">${imp>0?'↑':'↓'} ${Math.abs(imp)}</span></div><div style="display:flex;justify-content:space-between;margin-top:8px;font-size:0.85rem"><span>First: ${first.rating} (${first.grade})</span><span>→</span><span>Latest: ${last.rating} (${last.grade})</span></div><div style="font-size:0.75rem;color:#94a3b8;margin-top:4px">${items.length} assessments</div></div>`;
    }
  }
  progressDiv.innerHTML = has ? html+'</div>' : `<div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-simple" style="font-size:2rem"></i><p>Complete same exercise multiple times to compare</p></div>`;
}

async function deleteAssessment(id) {
  if (!confirm('Delete this assessment?')) return;
  const result = await callAPI('deleteAssessment', { assessmentId: id });
  if (result.success) {
    assessments = assessments.filter(a => a.id !== id);
    updateAssessmentHistory();
    updateProgressComparison();
    if (assessments.length > 0) updateRatingDisplay(assessments[0]);
    else document.getElementById('ratingDisplay').innerHTML = `<div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-bar" style="font-size:2rem"></i><p>Complete an assessment</p></div>`;
    showToast('Deleted', false);
  } else { showToast(result.error || 'Failed', true); }
}

async function clearAllAssessments() {
  if (!confirm('Clear ALL assessment history? This cannot be undone.')) return;
  const result = await callAPI('clearAllAssessments', { schoolId: currentUser.schoolId });
  if (result.success) {
    assessments = [];
    document.getElementById('ratingDisplay').innerHTML = `<div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-bar" style="font-size:2rem"></i><p>Complete an assessment</p></div>`;
    updateAssessmentHistory();
    updateProgressComparison();
    showToast('All assessments cleared', false);
  } else { showToast(result.error || 'Failed', true); }
}

// Ranking
function renderRanking() {
  const container = document.getElementById("tabContent");
  container.innerHTML = `
    <div class="card">
      <div style="text-align:center;padding:40px 20px">
        <i class="fas fa-trophy" style="font-size:3.5rem;color:#fdcb6e;margin-bottom:16px"></i>
        <h3 style="color:#1a1a1a;margin-bottom:8px">Rankings Coming Soon</h3>
        <p style="color:#64748b">Compete with classmates and climb the leaderboard</p>
      </div>
    </div>
  `;
}

// Tab Switching
function switchTab(tab) {
  if (isLoading) return;
  isLoading = true;
  currentTab = tab;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tab) btn.classList.add('active');
  });
  
  closeSidebar();
  
  if (tab === 'dashboard') { updatePageTitle('Dashboard'); renderDashboard(); isLoading = false; }
  else if (tab === 'profile') { updatePageTitle('My Profile'); renderProfile().then(() => isLoading = false); return; }
  else if (tab === 'assignment') { updatePageTitle('Fitness Assessment'); renderAssignment(); isLoading = false; }
  else if (tab === 'ranking') { updatePageTitle('Ranking'); renderRanking(); isLoading = false; }
}

// Auth
async function initAuth() {
  const stored = localStorage.getItem("hydrofit_user");
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      document.getElementById("authModal").style.display = "none";
      updateUserStats();
      switchTab('dashboard');
    } catch(e) { localStorage.removeItem("hydrofit_user"); }
  }
}

document.getElementById("loginBtn")?.addEventListener("click", async (e) => {
  const btn = e.target;
  const schoolId = document.getElementById("loginSchoolId").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!schoolId || !password) { showToast("Please enter School ID and Password", true); return; }
  const originalText = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  const result = await callAPI("login", { schoolId, password });
  btn.disabled = false; btn.innerHTML = originalText;
  if (result.success) {
    currentUser = result.user;
    localStorage.setItem("hydrofit_user", JSON.stringify(currentUser));
    document.getElementById("authModal").style.display = "none";
    updateUserStats();
    switchTab('dashboard');
    showToast(`Welcome, ${currentUser.fullName.split(',')[0]}!`, false);
  } else { showToast(result.error || "Invalid credentials", true); }
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
  const confirm = document.getElementById("regConfirmPassword").value;
  if (!fullName || !schoolId || !email || !program || !yearLevel || !section || !password) { showToast("All fields required", true); return; }
  if (password !== confirm) { showToast("Passwords don't match", true); return; }
  const originalText = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
  const result = await callAPI("register", { fullName, schoolId, email, program, yearLevel, section, password });
  btn.disabled = false; btn.innerHTML = originalText;
  if (result.success) {
    showToast("Registration successful! Please login.", false);
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("loginSchoolId").value = schoolId;
  } else { showToast(result.error || "Registration failed", true); }
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
  showToast("Logged out", false);
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
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:199';
      overlay.addEventListener('click', closeSidebar);
      document.body.appendChild(overlay);
    } else { document.getElementById("sidebarOverlay")?.remove(); }
  }
});

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
});

document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("mobileMenuBtn");
    if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) closeSidebar();
  }
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });

// Exports
window.switchTab = switchTab;
window.downloadQRCode = downloadQRCode;
window.printQRCode = printQRCode;
window.closeSidebar = closeSidebar;
window.generateQRCodeCanvas = generateQRCodeCanvas;
window.addAssessment = addAssessment;
window.clearAllAssessments = clearAllAssessments;
window.deleteAssessment = deleteAssessment;
window.loadAssessments = loadAssessments;

initAuth();
console.log("✅ HydroFit Loaded");