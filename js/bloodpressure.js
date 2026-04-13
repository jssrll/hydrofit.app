// ========================================
// HYDROFIT - BLOOD PRESSURE TRACKER
// ========================================

let bpRecords = [];

function getBPCategory(systolic, diastolic) {
  if (systolic > 180 || diastolic > 120) {
    return { 
      category: 'Hypertensive Crisis', 
      color: '#d63031', 
      bgColor: 'rgba(214, 48, 49, 0.15)',
      icon: '⚠️',
      advice: 'Seek emergency medical attention immediately!'
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { 
      category: 'High BP Stage 2', 
      color: '#e17055', 
      bgColor: 'rgba(225, 112, 85, 0.15)',
      icon: '🔴',
      advice: 'Consult your doctor. Medication may be needed.'
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return { 
      category: 'High BP Stage 1', 
      color: '#fdcb6e', 
      bgColor: 'rgba(253, 203, 110, 0.15)',
      icon: '🟠',
      advice: 'Monitor regularly. Consider lifestyle changes.'
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return { 
      category: 'Elevated', 
      color: '#fdcb6e', 
      bgColor: 'rgba(253, 203, 110, 0.1)',
      icon: '🟡',
      advice: 'Adopt heart-healthy habits to lower BP.'
    };
  }
  if (systolic < 90 || diastolic < 60) {
    return { 
      category: 'Low BP (Hypotension)', 
      color: '#00b4d8', 
      bgColor: 'rgba(0, 180, 216, 0.15)',
      icon: '💙',
      advice: 'Stay hydrated. Consult doctor if symptomatic.'
    };
  }
  return { 
    category: 'Normal', 
    color: '#00b894', 
    bgColor: 'rgba(0, 184, 148, 0.15)',
    icon: '🟢',
    advice: 'Great! Maintain your healthy lifestyle.'
  };
}

function renderBloodPressure() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/GYM%20FITNESS%20(Banner%20(Landscape)).png" alt="Blood Pressure Tracker" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- BP Input Card -->
    <div class="card">
      <h3><i class="fas fa-heart"></i> Log Blood Pressure</h3>
      <p style="color:#64748b;margin-bottom:20px">Enter your blood pressure reading</p>
      
      <div class="bp-input-group">
        <div class="form-group">
          <label><i class="fas fa-arrow-up" style="color:#e17055"></i> Systolic (mmHg)</label>
          <input type="number" id="bpSystolic" class="form-control" placeholder="e.g., 120" min="70" max="250">
          <small style="color:#64748b">Top number - pressure when heart beats</small>
        </div>
        <div class="form-group">
          <label><i class="fas fa-arrow-down" style="color:#00b4d8"></i> Diastolic (mmHg)</label>
          <input type="number" id="bpDiastolic" class="form-control" placeholder="e.g., 80" min="40" max="150">
          <small style="color:#64748b">Bottom number - pressure when heart rests</small>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-heart-pulse"></i> Pulse (Optional)</label>
          <input type="number" id="bpPulse" class="form-control" placeholder="e.g., 72" min="40" max="200">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label><i class="fas fa-calendar"></i> Date</label>
          <input type="date" id="bpDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label><i class="fas fa-clock"></i> Time</label>
          <input type="time" id="bpTime" class="form-control" value="${new Date().toTimeString().slice(0,5)}">
        </div>
      </div>
      
      <div class="form-group">
        <label><i class="fas fa-pencil"></i> Notes (Optional)</label>
        <input type="text" id="bpNotes" class="form-control" placeholder="e.g., After exercise, Morning reading">
      </div>
      
      <button class="btn" id="saveBPBtn" style="width:100%">
        <i class="fas fa-save"></i> Save Reading
      </button>
    </div>

    <!-- Live Category Display -->
    <div class="card" id="categoryCard" style="display:none">
      <div id="categoryDisplay"></div>
    </div>

    <!-- BP Category Guide -->
    <div class="card">
      <h3><i class="fas fa-chart-simple"></i> Blood Pressure Categories</h3>
      <div class="bp-categories">
        <div class="bp-category normal">
          <div class="category-color" style="background:#00b894"></div>
          <div class="category-info">
            <strong>🟢 Normal</strong>
            <span>Systolic: < 120 | Diastolic: < 80</span>
          </div>
        </div>
        <div class="bp-category elevated">
          <div class="category-color" style="background:#fdcb6e"></div>
          <div class="category-info">
            <strong>🟡 Elevated</strong>
            <span>Systolic: 120-129 | Diastolic: < 80</span>
          </div>
        </div>
        <div class="bp-category stage1">
          <div class="category-color" style="background:#fdcb6e"></div>
          <div class="category-info">
            <strong>🟠 High BP Stage 1</strong>
            <span>Systolic: 130-139 OR Diastolic: 80-89</span>
          </div>
        </div>
        <div class="bp-category stage2">
          <div class="category-color" style="background:#e17055"></div>
          <div class="category-info">
            <strong>🔴 High BP Stage 2</strong>
            <span>Systolic: ≥ 140 OR Diastolic: ≥ 90</span>
          </div>
        </div>
        <div class="bp-category crisis">
          <div class="category-color" style="background:#d63031"></div>
          <div class="category-info">
            <strong>⚠️ Hypertensive Crisis</strong>
            <span>Systolic: > 180 and/or Diastolic: > 120</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" id="bpStats">
      <div class="stat-card">
        <i class="fas fa-heart"></i>
        <div class="stat-value" id="avgSystolic">--</div>
        <div class="stat-label">Avg Systolic</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-heart" style="color:#00b4d8"></i>
        <div class="stat-value" id="avgDiastolic">--</div>
        <div class="stat-label">Avg Diastolic</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-chart-line"></i>
        <div class="stat-value" id="bpTrend">--</div>
        <div class="stat-label">Trend</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-calendar-check"></i>
        <div class="stat-value" id="bpReadings">--</div>
        <div class="stat-label">Total Readings</div>
      </div>
    </div>

    <!-- BP Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Blood Pressure Trends</h3>
      <div id="bpChartContainer" style="position:relative;height:280px">
        <canvas id="bpChart" style="width:100%;height:100%"></canvas>
      </div>
      <div class="chart-legend">
        <div class="legend-item"><span class="legend-dot" style="background:#e17055"></span> Systolic</div>
        <div class="legend-item"><span class="legend-dot" style="background:#00b4d8"></span> Diastolic</div>
      </div>
    </div>

    <!-- History -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-history"></i> Reading History</h3>
        <button class="refresh-btn" onclick="loadBPRecords()" title="Refresh">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="bpHistory"></div>
    </div>
  `;
  
  // Live category update
  document.getElementById('bpSystolic')?.addEventListener('input', updateCategoryDisplay);
  document.getElementById('bpDiastolic')?.addEventListener('input', updateCategoryDisplay);
  
  // Save button
  document.getElementById('saveBPBtn')?.addEventListener('click', saveBPRecord);
  
  loadBPRecords();
}

function updateCategoryDisplay() {
  const systolic = parseInt(document.getElementById('bpSystolic').value);
  const diastolic = parseInt(document.getElementById('bpDiastolic').value);
  
  if (!systolic || !diastolic) {
    document.getElementById('categoryCard').style.display = 'none';
    return;
  }
  
  const categoryData = getBPCategory(systolic, diastolic);
  
  document.getElementById('categoryCard').style.display = 'block';
  document.getElementById('categoryDisplay').innerHTML = `
    <div style="display:flex;align-items:center;gap:16px">
      <div style="font-size:3rem">${categoryData.icon}</div>
      <div>
        <h3 style="color:${categoryData.color};margin-bottom:4px">${categoryData.category}</h3>
        <p style="color:#1a1a1a">${systolic}/${diastolic} mmHg</p>
        <p style="color:#64748b;font-size:0.9rem;margin-top:4px">${categoryData.advice}</p>
      </div>
    </div>
  `;
}

async function saveBPRecord() {
  const systolic = parseInt(document.getElementById('bpSystolic').value);
  const diastolic = parseInt(document.getElementById('bpDiastolic').value);
  const pulse = document.getElementById('bpPulse').value;
  const date = document.getElementById('bpDate').value;
  const time = document.getElementById('bpTime').value;
  const notes = document.getElementById('bpNotes').value;
  
  if (!systolic || !diastolic) {
    showToast('Please enter systolic and diastolic values', true);
    return;
  }
  
  const categoryData = getBPCategory(systolic, diastolic);
  
  const btn = document.getElementById('saveBPBtn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  const result = await callAPI('saveBloodPressure', {
    schoolId: window.currentUser.schoolId,
    date,
    time,
    systolic,
    diastolic,
    pulse,
    category: categoryData.category,
    notes
  });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast('Blood pressure record saved! 🫀', false);
    document.getElementById('bpSystolic').value = '';
    document.getElementById('bpDiastolic').value = '';
    document.getElementById('bpPulse').value = '';
    document.getElementById('bpNotes').value = '';
    document.getElementById('categoryCard').style.display = 'none';
    loadBPRecords();
  } else {
    showToast(result.error || 'Failed to save', true);
  }
}

async function loadBPRecords() {
  const result = await callAPI('getBloodPressure', { schoolId: window.currentUser.schoolId });
  
  if (result.success && result.records) {
    bpRecords = result.records;
    updateBPStats();
    updateBPHistory();
    drawBPChart();
  }
}

function updateBPStats() {
  if (bpRecords.length === 0) {
    document.getElementById('avgSystolic').innerText = '--';
    document.getElementById('avgDiastolic').innerText = '--';
    document.getElementById('bpTrend').innerText = '--';
    document.getElementById('bpReadings').innerText = '0';
    return;
  }
  
  const avgSystolic = Math.round(bpRecords.reduce((sum, r) => sum + r.systolic, 0) / bpRecords.length);
  const avgDiastolic = Math.round(bpRecords.reduce((sum, r) => sum + r.diastolic, 0) / bpRecords.length);
  
  document.getElementById('avgSystolic').innerText = avgSystolic;
  document.getElementById('avgDiastolic').innerText = avgDiastolic;
  document.getElementById('bpReadings').innerText = bpRecords.length;
  
  // Calculate trend (comparing last 3 vs previous 3)
  if (bpRecords.length >= 6) {
    const recent = bpRecords.slice(0, 3);
    const previous = bpRecords.slice(3, 6);
    const recentAvg = recent.reduce((sum, r) => sum + r.systolic, 0) / 3;
    const previousAvg = previous.reduce((sum, r) => sum + r.systolic, 0) / 3;
    
    if (recentAvg < previousAvg - 3) {
      document.getElementById('bpTrend').innerHTML = '<span style="color:#00b894">📉 Improving</span>';
    } else if (recentAvg > previousAvg + 3) {
      document.getElementById('bpTrend').innerHTML = '<span style="color:#e17055">📈 Worsening</span>';
    } else {
      document.getElementById('bpTrend').innerHTML = '<span style="color:#64748b">➡️ Stable</span>';
    }
  } else {
    document.getElementById('bpTrend').innerText = 'Need more data';
  }
}

function updateBPHistory() {
  const historyDiv = document.getElementById('bpHistory');
  
  if (bpRecords.length === 0) {
    historyDiv.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart"></i>
        <p>No readings yet</p>
        <p class="empty-hint">Data syncs with Google Sheets</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="history-list">';
  bpRecords.slice(0, 15).forEach(r => {
    const categoryData = getBPCategory(r.systolic, r.diastolic);
    const timeStr = r.time || '--:--';
    
    html += `
      <div class="history-item">
        <div class="history-item-left">
          <div class="bp-badge" style="background:${categoryData.bgColor};border-left:4px solid ${categoryData.color}">
            <span style="font-size:1.2rem">${categoryData.icon}</span>
          </div>
          <div class="history-details">
            <h5>${r.systolic}/${r.diastolic} mmHg</h5>
            <div class="history-meta">
              <span><i class="fas fa-calendar"></i> ${new Date(r.date).toLocaleDateString()}</span>
              <span><i class="fas fa-clock"></i> ${timeStr}</span>
              ${r.pulse ? `<span><i class="fas fa-heart-pulse"></i> ${r.pulse} BPM</span>` : ''}
            </div>
            ${r.notes ? `<div style="font-size:0.75rem;color:#94a3b8;margin-top:4px">${escapeHtml(r.notes)}</div>` : ''}
          </div>
        </div>
        <div class="history-item-right">
          <span class="category-tag" style="background:${categoryData.bgColor};color:${categoryData.color}">${r.category}</span>
          <button class="delete-btn" onclick="deleteBPRecord('${r.id}')" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  if (bpRecords.length > 15) {
    html += `<p style="text-align:center;margin-top:16px;color:#64748b">Showing last 15 of ${bpRecords.length} records</p>`;
  }
  
  historyDiv.innerHTML = html;
}

function drawBPChart() {
  const canvas = document.getElementById('bpChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth;
  
  canvas.width = containerWidth * 2;
  canvas.height = 280 * 2;
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = '280px';
  
  ctx.scale(2, 2);
  
  const width = containerWidth;
  const height = 280;
  
  ctx.clearRect(0, 0, width, height);
  
  if (bpRecords.length < 2) {
    ctx.font = '500 14px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('Need at least 2 readings to show chart', width/2, height/2);
    return;
  }
  
  const chartData = [...bpRecords].reverse().slice(0, 10);
  
  const padding = { top: 30, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const allSystolic = chartData.map(r => r.systolic);
  const allDiastolic = chartData.map(r => r.diastolic);
  const maxBP = Math.max(...allSystolic, ...allDiastolic) + 20;
  const minBP = Math.max(40, Math.min(...allSystolic, ...allDiastolic) - 20);
  
  // Category zones
  const zones = [
    { min: 0, max: 90, color: 'rgba(0, 180, 216, 0.05)', label: 'Low' },
    { min: 90, max: 120, color: 'rgba(0, 184, 148, 0.05)', label: 'Normal' },
    { min: 120, max: 130, color: 'rgba(253, 203, 110, 0.08)', label: 'Elevated' },
    { min: 130, max: 140, color: 'rgba(253, 203, 110, 0.12)', label: 'Stage 1' },
    { min: 140, max: 180, color: 'rgba(225, 112, 85, 0.1)', label: 'Stage 2' },
    { min: 180, max: 250, color: 'rgba(214, 48, 49, 0.1)', label: 'Crisis' }
  ];
  
  zones.forEach(zone => {
    if (zone.max > minBP && zone.min < maxBP) {
      const y1 = padding.top + chartHeight - ((Math.min(zone.max, maxBP) - minBP) / (maxBP - minBP)) * chartHeight;
      const y2 = padding.top + chartHeight - ((Math.max(zone.min, minBP) - minBP) / (maxBP - minBP)) * chartHeight;
      ctx.fillStyle = zone.color;
      ctx.fillRect(padding.left, y1, chartWidth, y2 - y1);
    }
  });
  
  // Grid
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 0.5;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 4; i++) {
    const value = minBP + (i / 4) * (maxBP - minBP);
    const y = padding.top + chartHeight - (i / 4) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(Math.round(value), padding.left - 6, y + 3);
  }
  
  // Draw lines
  [
    { type: 'systolic', color: '#e17055', label: 'Systolic' },
    { type: 'diastolic', color: '#00b4d8', label: 'Diastolic' }
  ].forEach((series) => {
    ctx.beginPath();
    ctx.strokeStyle = series.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    chartData.forEach((r, i) => {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((r[series.type] - minBP) / (maxBP - minBP)) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    
    // Points
    chartData.forEach((r, i) => {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((r[series.type] - minBP) / (maxBP - minBP)) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = series.color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  });
  
  // Date labels
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  chartData.forEach((r, i) => {
    if (i % 2 === 0 || i === chartData.length - 1) {
      const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
      const dateStr = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillText(dateStr, x, height - 20);
    }
  });
  
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 1;
  ctx.strokeRect(padding.left, padding.top, chartWidth, chartHeight);
}

async function deleteBPRecord(id) {
  if (!confirm('Delete this blood pressure reading?')) return;
  
  const result = await callAPI('deleteBloodPressure', { bpId: id });
  
  if (result.success) {
    bpRecords = bpRecords.filter(r => r.id !== id);
    updateBPStats();
    updateBPHistory();
    drawBPChart();
    showToast('Record deleted', false);
  } else {
    showToast(result.error || 'Failed to delete', true);
  }
}

console.log("✅ Blood Pressure Tracker Loaded");