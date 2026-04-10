// ========================================
// HYDROFIT - HEART RATE LOGGER (SHEETS SYNC)
// ========================================

let hrRecords = [];

// Exercise types for dropdown
const hrExerciseTypes = [
  "Jumping Jacks", "Arm Circles", "High Knees", "Butt Kicks", "Neck Rotation",
  "Torso Twists", "Push-Ups", "Sit-Ups", "Crunches", "Squats",
  "Lunges", "Plank", "Wall Sit", "Burpees", "Deadlift",
  "Bench Press", "Bicep Curl", "Tricep Dip", "Running"
];

function getHRInterpretation(bpm) {
  if (bpm < 60) return { text: 'Bradycardia (Low)', color: '#fdcb6e', advice: 'Below normal resting rate' };
  if (bpm < 100) return { text: 'Normal', color: '#00b894', advice: 'Healthy resting heart rate' };
  if (bpm < 120) return { text: 'Elevated', color: '#e17055', advice: 'Slightly above normal' };
  return { text: 'High', color: '#d63031', advice: 'Significantly elevated' };
}

function getChangeInterpretation(diff) {
  if (diff > 30) return { text: 'Significant increase - intense workout', color: '#e17055' };
  if (diff > 15) return { text: 'Moderate increase - good workout', color: '#fdcb6e' };
  if (diff > 5) return { text: 'Mild increase - light activity', color: '#00b894' };
  if (diff >= 0) return { text: 'Minimal change - well conditioned', color: '#00b894' };
  return { text: 'Heart rate decreased - good recovery', color: '#00b894' };
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
          <label>Exercise Type</label>
          <select id="hrExercise" class="form-control">
            <option value="">Select Exercise</option>
            ${hrExerciseTypes.map(ex => `<option value="${ex}">${ex}</option>`).join('')}
          </select>
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

    <!-- Heart Rate Zones -->
    <div class="card tips-card">
      <h4><i class="fas fa-chart-pie"></i> Heart Rate Zones</h4>
      <div class="hr-zones">
        <div class="zone-bar"></div>
        <div class="zone-labels">
          <span>Rest</span>
          <span>Fat Burn</span>
          <span>Cardio</span>
          <span>Peak</span>
        </div>
      </div>
      <ul style="margin-top:16px">
        <li><i class="fas fa-check-circle"></i> Rest: 60-100 BPM</li>
        <li><i class="fas fa-check-circle"></i> Fat Burn: 100-130 BPM</li>
        <li><i class="fas fa-check-circle"></i> Cardio: 130-160 BPM</li>
        <li><i class="fas fa-check-circle"></i> Peak: 160+ BPM</li>
      </ul>
    </div>

    <!-- Trends Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Heart Rate Trends</h3>
      <div id="hrChartContainer" style="position:relative;height:250px;">
        <canvas id="hrChart" style="width:100%;height:100%"></canvas>
      </div>
      <div class="chart-legend">
        <div class="legend-item"><span class="legend-dot before"></span> Before Exercise</div>
        <div class="legend-item"><span class="legend-dot after"></span> After Exercise</div>
      </div>
    </div>

    <!-- History -->
    <div class="card">
      <h3><i class="fas fa-history"></i> Record History</h3>
      <div id="hrHistory">
        <div class="empty-state">
          <i class="fas fa-calendar-alt"></i>
          <p>No records yet</p>
          <p class="empty-hint">Data syncs with Google Sheets</p>
        </div>
      </div>
    </div>
  `;
  
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
  const changeInterp = getChangeInterpretation(diff);
  
  const interpDiv = document.getElementById('hrInterpretation');
  interpDiv.innerHTML = `
    <div class="interpretation-grid">
      <div class="interpretation-card">
        <div class="interpretation-label"><i class="fas fa-heart" style="color:#d63031"></i> BEFORE</div>
        <div class="interpretation-value" style="color:${beforeInterp.color}">${before}</div>
        <div class="interpretation-text" style="color:${beforeInterp.color}">${beforeInterp.text}</div>
        <div class="interpretation-advice">${beforeInterp.advice}</div>
      </div>
      <div class="interpretation-card">
        <div class="interpretation-label"><i class="fas fa-heart" style="color:#00b894"></i> AFTER</div>
        <div class="interpretation-value" style="color:${afterInterp.color}">${after}</div>
        <div class="interpretation-text" style="color:${afterInterp.color}">${afterInterp.text}</div>
        <div class="interpretation-advice">${afterInterp.advice}</div>
      </div>
    </div>
    <div class="interpretation-change">
      <span class="change-label">Change:</span>
      <span class="change-value" style="color:${changeInterp.color}">${diff > 0 ? '+' : ''}${diff} BPM</span>
      <span class="change-description">(${changeInterp.text})</span>
    </div>
  `;
}

async function saveHRRecord() {
  const before = parseInt(document.getElementById('hrBefore').value);
  const after = parseInt(document.getElementById('hrAfter').value);
  const exercise = document.getElementById('hrExercise').value;
  const date = document.getElementById('hrDate').value;
  const notes = document.getElementById('hrNotes').value;
  
  if (!before || !after) {
    showToast('Please enter heart rate values', true);
    return;
  }
  
  if (!exercise) {
    showToast('Please select an exercise type', true);
    return;
  }
  
  const diff = after - before;
  const changeInterp = getChangeInterpretation(diff);
  const interpretation = changeInterp.text;
  
  const btn = document.querySelector('button[onclick="saveHRRecord()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  const result = await callAPI('saveHeartRate', {
    schoolId: window.currentUser.schoolId,
    date,
    exercise,
    before,
    after,
    difference: diff,
    interpretation,
    notes
  });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast('Heart rate record saved to Sheets!', false);
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
  } else {
    showToast(result.error || 'Failed to save', true);
  }
}

async function loadHRRecords() {
  const result = await callAPI('getHeartRate', { schoolId: window.currentUser.schoolId });
  
  if (result.success && result.records) {
    hrRecords = result.records;
    updateHRHistory();
    drawHRChart();
  }
}

function updateHRHistory() {
  const historyDiv = document.getElementById('hrHistory');
  
  if (hrRecords.length === 0) {
    historyDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-alt"></i>
        <p>No records yet</p>
        <p class="empty-hint">Data syncs with Google Sheets</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="history-list">';
  hrRecords.slice(0, 15).forEach(r => {
    const diff = parseInt(r.difference) || 0;
    const diffClass = diff > 20 ? 'positive' : diff > 10 ? 'neutral' : 'negative';
    const diffSign = diff > 0 ? '+' : '';
    
    html += `
      <div class="history-item">
        <div class="history-item-left">
          <div class="hr-badge">
            <span>${r.before}→${r.after}</span>
          </div>
          <div class="history-details">
            <h5>${escapeHtml(r.exercise)}</h5>
            <div class="history-meta">
              <span><i class="fas fa-calendar"></i> ${new Date(r.date).toLocaleDateString()}</span>
              <span><i class="fas fa-cloud" style="color:#00b894" title="Synced to Sheets"></i></span>
            </div>
            ${r.notes ? `<div style="font-size:0.75rem;color:#94a3b8;margin-top:4px">${escapeHtml(r.notes)}</div>` : ''}
          </div>
        </div>
        <div class="history-item-right">
          <span class="hr-change ${diffClass}">${diffSign}${diff} BPM</span>
          <button class="delete-btn" onclick="deleteHRRecord('${r.id}')" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  if (hrRecords.length > 15) {
    html += `<p style="text-align:center;margin-top:16px;color:#64748b;font-size:0.85rem">Showing last 15 of ${hrRecords.length} records</p>`;
  }
  
  html += `
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-outline" onclick="loadHRRecords()" style="flex:1">
        <i class="fas fa-sync-alt"></i> Refresh
      </button>
    </div>
  `;
  
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
  
  const allValues = chartData.flatMap(r => [parseInt(r.before), parseInt(r.after)]);
  const maxHR = Math.max(...allValues) + 10;
  const minHR = Math.max(40, Math.min(...allValues) - 10);
  
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
  
  ['before', 'after'].forEach((type) => {
    ctx.beginPath();
    ctx.strokeStyle = type === 'before' ? '#d63031' : '#00b894';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    chartData.forEach((r, i) => {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((parseInt(r[type]) - minHR) / (maxHR - minHR)) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    chartData.forEach((r, i) => {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((parseInt(r[type]) - minHR) / (maxHR - minHR)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = type === 'before' ? '#d63031' : '#00b894';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  });
  
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  const dateInterval = Math.max(1, Math.floor(chartData.length / 5));
  chartData.forEach((r, i) => {
    if (i % dateInterval === 0 || i === chartData.length - 1) {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const dateStr = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillText(dateStr, x, height - 20);
    }
  });
  
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(padding.left, padding.top, chartWidth, chartHeight);
  
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#d63031';
  ctx.textAlign = 'left';
  ctx.fillText('Before', padding.left + 5, padding.top - 8);
  ctx.fillStyle = '#00b894';
  ctx.fillText('After', padding.left + 80, padding.top - 8);
}

async function deleteHRRecord(id) {
  if (!confirm('Delete this heart rate record?')) return;
  
  const result = await callAPI('deleteHeartRate', { hrId: id });
  
  if (result.success) {
    hrRecords = hrRecords.filter(r => r.id !== id);
    updateHRHistory();
    drawHRChart();
    showToast('Record deleted', false);
  } else {
    showToast(result.error || 'Failed to delete', true);
  }
}

console.log("✅ Heart Rate Logger Loaded with Sheets Sync");