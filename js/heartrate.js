// ========================================
// HYDROFIT - HEART RATE LOGGER
// ========================================

let hrRecords = [];

function getHRInterpretation(bpm) {
  if (bpm < 60) return { text: 'Bradycardia (Low)', color: '#fdcb6e', advice: 'Below normal resting rate' };
  if (bpm < 100) return { text: 'Normal', color: '#00b894', advice: 'Healthy resting heart rate' };
  if (bpm < 120) return { text: 'Elevated', color: '#e17055', advice: 'Slightly above normal' };
  return { text: 'High', color: '#d63031', advice: 'Significantly elevated' };
}

function renderHeartRate() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Heart Rate Logger" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Heart Rate Input -->
    <div class="card">
      <h3><i class="fas fa-heart-pulse"></i> Log Heart Rate</h3>
      <p style="color:#64748b;margin-bottom:20px">Track your heart rate manually</p>
      
      <div class="hr-input-group">
        <div class="form-group">
          <label><i class="fas fa-heart" style="color:#d63031"></i> Before Exercise (BPM)</label>
          <input type="number" id="hrBefore" class="form-control" placeholder="e.g., 72" min="40" max="200">
        </div>
        <div class="form-group">
          <label><i class="fas fa-heart" style="color:#00b894"></i> After Exercise (BPM)</label>
          <input type="number" id="hrAfter" class="form-control" placeholder="e.g., 120" min="40" max="200">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Exercise Type (Optional)</label>
          <input type="text" id="hrExercise" class="form-control" placeholder="e.g., Running, Push-ups">
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="hrDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
        </div>
      </div>
      
      <div class="form-group">
        <label>Notes (Optional)</label>
        <input type="text" id="hrNotes" class="form-control" placeholder="How did you feel?">
      </div>
      
      <button class="btn" onclick="saveHRRecord()" style="width:100%">
        <i class="fas fa-save"></i> Save Record
      </button>
    </div>

    <!-- Live Interpretation -->
    <div class="card">
      <h3><i class="fas fa-stethoscope"></i> Interpretation</h3>
      <div id="hrInterpretation">
        <div style="text-align:center;padding:20px;color:#64748b">
          <i class="fas fa-heart" style="font-size:2rem;margin-bottom:12px"></i>
          <p>Enter heart rate values to see interpretation</p>
        </div>
      </div>
    </div>

    <!-- Trends Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Heart Rate Trends</h3>
      <div id="hrChartContainer" style="position:relative;height:250px;">
        <canvas id="hrChart" style="width:100%;height:100%"></canvas>
      </div>
    </div>

    <!-- History -->
    <div class="card">
      <h3><i class="fas fa-history"></i> Record History</h3>
      <div id="hrHistory">
        <div style="text-align:center;padding:20px;color:#64748b">
          <i class="fas fa-calendar-alt" style="font-size:2rem;margin-bottom:12px"></i>
          <p>No records yet</p>
        </div>
      </div>
    </div>
  `;
  
  // Live interpretation on input
  document.getElementById('hrBefore')?.addEventListener('input', updateHRInterpretation);
  document.getElementById('hrAfter')?.addEventListener('input', updateHRInterpretation);
  
  loadHRRecords();
}

function updateHRInterpretation() {
  const before = parseInt(document.getElementById('hrBefore').value);
  const after = parseInt(document.getElementById('hrAfter').value);
  
  if (!before || !after) return;
  
  const beforeInterp = getHRInterpretation(before);
  const afterInterp = getHRInterpretation(after);
  const diff = after - before;
  const recoveryRate = diff > 0 ? 'increased' : 'decreased';
  
  let recoveryColor = '#64748b';
  let recoveryText = '';
  if (diff > 30) {
    recoveryColor = '#e17055';
    recoveryText = 'Significant increase - intense workout';
  } else if (diff > 15) {
    recoveryColor = '#fdcb6e';
    recoveryText = 'Moderate increase - good workout';
  } else if (diff > 5) {
    recoveryColor = '#00b894';
    recoveryText = 'Mild increase - light activity';
  } else {
    recoveryColor = '#00b894';
    recoveryText = 'Minimal change - well conditioned';
  }
  
  const interpDiv = document.getElementById('hrInterpretation');
  interpDiv.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:center">
      <div style="padding:16px;background:#f8fafc;border-radius:16px">
        <div style="font-size:0.8rem;color:#64748b;margin-bottom:8px">BEFORE</div>
        <div style="font-size:2.5rem;font-weight:700;color:${beforeInterp.color}">${before}</div>
        <div style="font-size:1rem;font-weight:600;color:${beforeInterp.color}">${beforeInterp.text}</div>
        <div style="font-size:0.8rem;color:#94a3b8;margin-top:8px">${beforeInterp.advice}</div>
      </div>
      <div style="padding:16px;background:#f8fafc;border-radius:16px">
        <div style="font-size:0.8rem;color:#64748b;margin-bottom:8px">AFTER</div>
        <div style="font-size:2.5rem;font-weight:700;color:${afterInterp.color}">${after}</div>
        <div style="font-size:1rem;font-weight:600;color:${afterInterp.color}">${afterInterp.text}</div>
        <div style="font-size:0.8rem;color:#94a3b8;margin-top:8px">${afterInterp.advice}</div>
      </div>
    </div>
    <div style="margin-top:16px;padding:12px;background:#f0f9ff;border-radius:12px;text-align:center">
      <span style="color:#64748b">Change: </span>
      <span style="font-weight:700;color:${recoveryColor}">${diff > 0 ? '+' : ''}${diff} BPM</span>
      <span style="color:#94a3b8;margin-left:8px">(${recoveryText})</span>
    </div>
  `;
}

async function saveHRRecord() {
  const before = parseInt(document.getElementById('hrBefore').value);
  const after = parseInt(document.getElementById('hrAfter').value);
  const exercise = document.getElementById('hrExercise').value || 'General';
  const date = document.getElementById('hrDate').value;
  const notes = document.getElementById('hrNotes').value;
  
  if (!before || !after) {
    showToast('Please enter heart rate values', true);
    return;
  }
  
  const record = {
    id: 'HR' + Date.now(),
    before,
    after,
    exercise,
    date,
    notes,
    diff: after - before
  };
  
  // Store in localStorage
  const stored = localStorage.getItem('hydrofit_hr_' + window.currentUser.schoolId);
  let records = stored ? JSON.parse(stored) : [];
  records.unshift(record);
  localStorage.setItem('hydrofit_hr_' + window.currentUser.schoolId, JSON.stringify(records));
  
  showToast('Heart rate record saved!', false);
  document.getElementById('hrBefore').value = '';
  document.getElementById('hrAfter').value = '';
  document.getElementById('hrExercise').value = '';
  document.getElementById('hrNotes').value = '';
  document.getElementById('hrInterpretation').innerHTML = `
    <div style="text-align:center;padding:20px;color:#64748b">
      <i class="fas fa-heart" style="font-size:2rem;margin-bottom:12px"></i>
      <p>Enter heart rate values to see interpretation</p>
    </div>
  `;
  
  loadHRRecords();
}

function loadHRRecords() {
  const stored = localStorage.getItem('hydrofit_hr_' + window.currentUser.schoolId);
  hrRecords = stored ? JSON.parse(stored) : [];
  
  updateHRHistory();
  drawHRChart();
}

function updateHRHistory() {
  const historyDiv = document.getElementById('hrHistory');
  
  if (hrRecords.length === 0) {
    historyDiv.innerHTML = `
      <div style="text-align:center;padding:20px;color:#64748b">
        <i class="fas fa-calendar-alt" style="font-size:2rem;margin-bottom:12px"></i>
        <p>No records yet</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="history-list">';
  hrRecords.slice(0, 10).forEach(r => {
    const diffColor = r.diff > 20 ? '#e17055' : r.diff > 10 ? '#fdcb6e' : '#00b894';
    html += `
      <div class="history-item" style="display:flex;justify-content:space-between;align-items:center;padding:14px 12px;border-bottom:1px solid #e0e7ff">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#d63031,#00b894);display:flex;align-items:center;justify-content:center">
            <span style="font-size:0.9rem;font-weight:700;color:white">${r.before}→${r.after}</span>
          </div>
          <div>
            <div style="font-weight:600;color:#1a1a1a">${r.exercise}</div>
            <div style="font-size:0.75rem;color:#94a3b8">${new Date(r.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:0.9rem;font-weight:600;color:${diffColor}">${r.diff > 0 ? '+' : ''}${r.diff} BPM</span>
          <button onclick="deleteHRRecord('${r.id}')" style="background:none;border:none;color:#d63031;cursor:pointer;padding:6px">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  if (hrRecords.length > 10) {
    html += `<p style="text-align:center;margin-top:16px;color:#64748b">Showing last 10 of ${hrRecords.length} records</p>`;
  }
  
  historyDiv.innerHTML = html;
}

function drawHRChart() {
  const canvas = document.getElementById('hrChart');
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
  
  if (hrRecords.length < 2) {
    ctx.font = '500 14px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('Need at least 2 records to show chart', width/2, height/2);
    return;
  }
  
  const chartData = [...hrRecords].reverse().slice(0, 10);
  
  const padding = { top: 30, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const allValues = chartData.flatMap(r => [r.before, r.after]);
  const maxHR = Math.max(...allValues) + 10;
  const minHR = Math.max(40, Math.min(...allValues) - 10);
  
  // Grid
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 0.5;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 4; i++) {
    const value = minHR + (i / 4) * (maxHR - minHR);
    const y = padding.top + chartHeight - (i / 4) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(Math.round(value), padding.left - 6, y + 3);
  }
  
  // Draw lines
  ['before', 'after'].forEach((type, idx) => {
    ctx.beginPath();
    ctx.strokeStyle = type === 'before' ? '#d63031' : '#00b894';
    ctx.lineWidth = 2;
    
    chartData.forEach((r, i) => {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((r[type] - minHR) / (maxHR - minHR)) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });
  
  // Legend
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#d63031';
  ctx.fillText('Before', width - 120, 20);
  ctx.fillStyle = '#00b894';
  ctx.fillText('After', width - 60, 20);
  
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(padding.left, padding.top, chartWidth, chartHeight);
}

function deleteHRRecord(id) {
  if (!confirm('Delete this record?')) return;
  
  hrRecords = hrRecords.filter(r => r.id !== id);
  localStorage.setItem('hydrofit_hr_' + window.currentUser.schoolId, JSON.stringify(hrRecords));
  
  updateHRHistory();
  drawHRChart();
  showToast('Record deleted', false);
}

console.log("✅ Heart Rate Logger Loaded");