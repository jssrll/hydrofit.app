// ========================================
// HYDROFIT - FITNESS ASSESSMENT
// ========================================

const exerciseTypes = ["Jumping Jacks","Arm Circles","High Knees","Butt Kicks","Neck Rotation","Torso Twists","Push-Ups","Sit-Ups","Crunches","Squats","Lunges","Plank","Wall Sit","Burpees","Deadlift","Bench Press","Bicep Curl","Tricep Dip","Running","Jogging","Walking","Skipping Rope","Cycling","Mountain Climbers","Stair Climbing","Stretching","Toe Touch","Side Stretch","Cobra Stretch","Hamstring Stretch","Quadriceps Stretch","Shoulder Stretch","One-Leg Stand","Heel-to-Toe Walk","Balance Walk","Single-Leg Squat","Bending","Twisting","Swaying","Swinging","Pushing","Pulling","Swimming","Water Walking","Water Jogging","Aqua Jumping Jacks","Flutter Kicks","Arm Pushes in Water"];

let assessments = [];

function renderAssignment() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="assessment-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Gold%20and%20Black%20Geometric%20Modern%20Gym%20Presentation%20Template.png" alt="Fitness Assessment Banner" style="width: 100%; border-radius: 20px; box-shadow: var(--shadow);">
    </div>
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
      <button class="btn" onclick="addAssessment()" style="width:100%;margin-top:16px"><i class="fas fa-save"></i> Save Assessment</button>
    </div>
    <div class="card"><h3><i class="fas fa-star"></i> Performance Rating</h3><div id="ratingDisplay"><div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-bar" style="font-size:2rem"></i><p>Complete an assessment to see your rating</p></div></div></div>
    <div class="card"><h3><i class="fas fa-history"></i> Assessment History</h3><div id="assessmentHistory"><div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-calendar-alt" style="font-size:2rem"></i><p>No assessments recorded yet</p></div></div></div>
    <div class="card"><h3><i class="fas fa-chart-line"></i> Progress Comparison</h3><div id="progressComparison"><div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-simple" style="font-size:2rem"></i><p>Complete multiple assessments to see progress</p></div></div></div>
  `;
  loadAssessments();
}

async function loadAssessments() {
  if (!window.currentUser) return;
  const result = await callAPI('getAssessments', { schoolId: window.currentUser.schoolId });
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
  const btn = document.querySelector('button[onclick="addAssessment()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  const result = await callAPI('saveAssessment', { schoolId: window.currentUser.schoolId, exercise, date, value: repetitions, unit, intensity, rating: ratingData.rating, grade: ratingData.grade, notes });
  
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
    showToast('Assessment saved!', false);
  } else { showToast(result.error || 'Failed to save', true); }
}

function updateRatingDisplay(assessment) {
  document.getElementById('ratingDisplay').innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:3.5rem;font-weight:800;color:${assessment.color}">${assessment.rating}</div>
      <div style="font-size:1.3rem;font-weight:600;color:${assessment.color}">${assessment.grade}</div>
      <p><strong>${escapeHtml(assessment.exercise)}</strong></p>
      <p style="color:#64748b">${assessment.value} ${assessment.unit} | Intensity: ${assessment.intensity}/10</p>
      <div style="margin-top:16px;padding:12px;background:#f0f9ff;border-radius:12px"><i class="fas fa-calendar"></i> ${new Date(assessment.date).toLocaleDateString()}</div>
      <p style="margin-top:12px;font-size:0.75rem;color:#94a3b8"><i class="fas fa-cloud-check"></i> Synced</p>
    </div>`;
}

function updateAssessmentHistory() {
  const historyDiv = document.getElementById('assessmentHistory');
  if (assessments.length === 0) {
    historyDiv.innerHTML = `<div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-calendar-alt" style="font-size:2rem"></i><p>No assessments yet</p></div>`;
    return;
  }
  let html = '<div class="history-list">';
  assessments.slice(0, 15).forEach(a => {
    html += `<div class="history-item" style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid #e0e7ff">
      <div><strong>${escapeHtml(a.exercise)}</strong><div style="font-size:0.8rem;color:#64748b">${a.value} ${a.unit} | Intensity: ${a.intensity}/10</div><div style="font-size:0.75rem;color:#94a3b8">${new Date(a.date).toLocaleDateString()}</div></div>
      <div style="display:flex;align-items:center;gap:12px"><span style="font-size:1.2rem;font-weight:700;color:${a.color}">${a.rating}</span><button onclick="deleteAssessment('${a.id}')" style="background:none;border:none;color:#d63031;cursor:pointer"><i class="fas fa-trash-alt"></i></button></div>
    </div>`;
  });
  html += '</div>';
  html += `<div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-outline" onclick="clearAllAssessments()" style="flex:1"><i class="fas fa-trash"></i> Clear All</button><button class="btn btn-outline" onclick="loadAssessments()" style="flex:1"><i class="fas fa-sync-alt"></i> Refresh</button></div>`;
  historyDiv.innerHTML = html;
}

function updateProgressComparison() {
  const progressDiv = document.getElementById('progressComparison');
  if (assessments.length < 2) {
    progressDiv.innerHTML = `<div style="text-align:center;padding:20px;color:#64748b"><i class="fas fa-chart-simple" style="font-size:2rem"></i><p>Complete at least 2 assessments</p></div>`;
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
      html += `<div style="background:#f8fafc;padding:12px;border-radius:12px;margin-bottom:12px"><div style="display:flex;justify-content:space-between"><strong>${escapeHtml(ex)}</strong><span style="color:${imp>0?'#00b894':'#d63031'}">${imp>0?'↑':'↓'} ${Math.abs(imp)}</span></div><div style="display:flex;justify-content:space-between;margin-top:8px"><span>First: ${first.rating}</span><span>→</span><span>Latest: ${last.rating}</span></div></div>`;
    }
  }
  progressDiv.innerHTML = has ? html+'</div>' : `<div style="text-align:center;padding:20px"><p>Complete same exercise multiple times</p></div>`;
}

async function deleteAssessment(id) {
  if (!confirm('Delete this assessment?')) return;
  const result = await callAPI('deleteAssessment', { assessmentId: id });
  if (result.success) {
    assessments = assessments.filter(a => a.id !== id);
    updateAssessmentHistory();
    updateProgressComparison();
    if (assessments.length > 0) updateRatingDisplay(assessments[0]);
    else document.getElementById('ratingDisplay').innerHTML = `<div style="text-align:center;padding:20px"><p>Complete an assessment</p></div>`;
    showToast('Deleted', false);
  } else { showToast(result.error || 'Failed', true); }
}

async function clearAllAssessments() {
  if (!confirm('Clear ALL assessment history?')) return;
  const result = await callAPI('clearAllAssessments', { schoolId: window.currentUser.schoolId });
  if (result.success) {
    assessments = [];
    document.getElementById('ratingDisplay').innerHTML = `<div style="text-align:center;padding:20px"><p>Complete an assessment</p></div>`;
    updateAssessmentHistory();
    updateProgressComparison();
    showToast('All assessments cleared', false);
  } else { showToast(result.error || 'Failed', true); }
}

console.log("✅ Assessment Loaded");