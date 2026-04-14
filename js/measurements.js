// ========================================
// HYDROFIT - BODY MEASUREMENTS TRACKER
// ========================================

let measurementRecords = [];

const measurementTypes = [
  { id: 'chest', label: 'Chest', unit: 'cm', icon: '📏', color: '#00b4d8' },
  { id: 'waist', label: 'Waist', unit: 'cm', icon: '📐', color: '#00b894' },
  { id: 'hips', label: 'Hips', unit: 'cm', icon: '🔄', color: '#e17055' },
  { id: 'leftArm', label: 'Left Arm', unit: 'cm', icon: '💪', color: '#fdcb6e' },
  { id: 'rightArm', label: 'Right Arm', unit: 'cm', icon: '💪', color: '#fdcb6e' },
  { id: 'leftThigh', label: 'Left Thigh', unit: 'cm', icon: '🦵', color: '#6c5ce7' },
  { id: 'rightThigh', label: 'Right Thigh', unit: 'cm', icon: '🦵', color: '#6c5ce7' }
];

function renderMeasurements() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/Fitness%20Gym%20Facebook%20Cover.png" alt="Body Measurements" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Measurement Input -->
    <div class="card">
      <h3><i class="fas fa-ruler"></i> Log Measurements</h3>
      <p style="color:#64748b;margin-bottom:20px">Track your body measurements over time</p>
      
      <div class="measurement-form">
        <div class="measurement-grid">
          ${measurementTypes.map(m => `
            <div class="measurement-input">
              <label>
                <span class="measurement-icon">${m.icon}</span>
                ${m.label} (${m.unit})
              </label>
              <input type="number" id="${m.id}" class="form-control" placeholder="${m.label}" step="0.1" min="0">
            </div>
          `).join('')}
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label><i class="fas fa-calendar"></i> Date</label>
            <input type="date" id="measurementDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label><i class="fas fa-weight-scale"></i> Weight (kg) - Optional</label>
            <input type="number" id="measurementWeight" class="form-control" placeholder="Current weight" step="0.1">
          </div>
        </div>
        
        <div class="form-group">
          <label><i class="fas fa-pencil"></i> Notes (Optional)</label>
          <input type="text" id="measurementNotes" class="form-control" placeholder="e.g., Morning measurement">
        </div>
        
        <button class="btn" id="saveMeasurementsBtn" style="width:100%">
          <i class="fas fa-save"></i> Save Measurements
        </button>
      </div>
    </div>

    <!-- Latest Measurements Summary -->
    <div class="card">
      <h3><i class="fas fa-chart-simple"></i> Latest Measurements</h3>
      <div id="latestMeasurements"></div>
    </div>

    <!-- Side-by-Side Comparison -->
    <div class="card">
      <h3><i class="fas fa-balance-scale"></i> Side-by-Side Comparison</h3>
      <div class="comparison-controls">
        <select id="compareDate1" class="form-control">
          <option value="">Select first date</option>
        </select>
        <span>vs</span>
        <select id="compareDate2" class="form-control">
          <option value="">Select second date</option>
        </select>
        <button class="btn btn-outline" onclick="compareMeasurements()">
          <i class="fas fa-arrows-left-right"></i> Compare
        </button>
      </div>
      <div id="comparisonResult"></div>
    </div>

    <!-- Measurement Charts -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Progress Charts</h3>
      <div class="chart-selector">
        <select id="chartMetric" class="form-control" onchange="updateChart()">
          ${measurementTypes.map(m => `<option value="${m.id}">${m.label}</option>`).join('')}
          <option value="weight">Weight</option>
        </select>
      </div>
      <div id="measurementChartContainer" style="position:relative;height:280px">
        <canvas id="measurementChart" style="width:100%;height:100%"></canvas>
      </div>
    </div>

    <!-- History -->
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin:0"><i class="fas fa-history"></i> Measurement History</h3>
        <button class="refresh-btn" onclick="loadMeasurementRecords()" title="Refresh">
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
      <div id="measurementHistory"></div>
    </div>
  `;
  
  document.getElementById('saveMeasurementsBtn').addEventListener('click', saveMeasurements);
  loadMeasurementRecords();
}

async function saveMeasurements() {
  const date = document.getElementById('measurementDate').value;
  const weight = document.getElementById('measurementWeight').value;
  const notes = document.getElementById('measurementNotes').value;
  
  const measurements = {};
  measurementTypes.forEach(m => {
    const value = document.getElementById(m.id).value;
    if (value) measurements[m.id] = parseFloat(value);
  });
  
  if (Object.keys(measurements).length === 0) {
    showToast('Please enter at least one measurement', true);
    return;
  }
  
  const btn = document.getElementById('saveMeasurementsBtn');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  const result = await callAPI('saveMeasurements', {
    schoolId: window.currentUser.schoolId,
    date,
    measurements: JSON.stringify(measurements),
    weight: weight || null,
    notes
  });
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast('Measurements saved! 📏', false);
    measurementTypes.forEach(m => document.getElementById(m.id).value = '');
    document.getElementById('measurementWeight').value = '';
    document.getElementById('measurementNotes').value = '';
    loadMeasurementRecords();
  } else {
    showToast(result.error || 'Failed to save', true);
  }
}

async function loadMeasurementRecords() {
  const result = await callAPI('getMeasurements', { schoolId: window.currentUser.schoolId });
  
  if (result.success && result.records) {
    measurementRecords = result.records;
    updateLatestMeasurements();
    updateMeasurementHistory();
    updateDateSelectors();
    updateChart();
  }
}

function updateLatestMeasurements() {
  const container = document.getElementById('latestMeasurements');
  
  if (measurementRecords.length === 0) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">No measurements yet</p>';
    return;
  }
  
  const latest = measurementRecords[0];
  
  let html = `
    <div class="latest-header">
      <span><i class="fas fa-calendar"></i> ${new Date(latest.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      ${latest.weight ? `<span><i class="fas fa-weight-scale"></i> ${latest.weight} kg</span>` : ''}
    </div>
    <div class="latest-grid">
  `;
  
  measurementTypes.forEach(m => {
    const value = latest.measurements[m.id];
    if (value) {
      html += `
        <div class="latest-item" style="border-left-color: ${m.color}">
          <span class="latest-icon">${m.icon}</span>
          <span class="latest-label">${m.label}</span>
          <span class="latest-value">${value} ${m.unit}</span>
        </div>
      `;
    }
  });
  
  html += '</div>';
  
  if (latest.notes) {
    html += `<p class="latest-notes"><i class="fas fa-pencil"></i> ${escapeHtml(latest.notes)}</p>`;
  }
  
  container.innerHTML = html;
}

function updateMeasurementHistory() {
  const container = document.getElementById('measurementHistory');
  
  if (measurementRecords.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-ruler"></i>
        <p>No measurements yet</p>
        <p class="empty-hint">Data syncs with Google Sheets</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="history-list">';
  measurementRecords.slice(0, 10).forEach(record => {
    const measurementCount = Object.keys(record.measurements).length;
    
    html += `
      <div class="history-item">
        <div class="history-item-left">
          <div class="measurement-badge">
            <i class="fas fa-ruler"></i>
          </div>
          <div class="history-details">
            <h5>${new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h5>
            <div class="history-meta">
              <span><i class="fas fa-chart-bar"></i> ${measurementCount} measurements</span>
              ${record.weight ? `<span><i class="fas fa-weight-scale"></i> ${record.weight} kg</span>` : ''}
            </div>
          </div>
        </div>
        <div class="history-item-right">
          <button class="delete-btn" onclick="deleteMeasurementRecord('${record.id}')" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  if (measurementRecords.length > 10) {
    html += `<p style="text-align:center;margin-top:16px;color:#64748b">Showing last 10 of ${measurementRecords.length} records</p>`;
  }
  
  container.innerHTML = html;
}

function updateDateSelectors() {
  const select1 = document.getElementById('compareDate1');
  const select2 = document.getElementById('compareDate2');
  
  if (!select1 || !select2) return;
  
  const options = measurementRecords.map(r => 
    `<option value="${r.date}">${new Date(r.date).toLocaleDateString()}</option>`
  ).join('');
  
  select1.innerHTML = '<option value="">Select first date</option>' + options;
  select2.innerHTML = '<option value="">Select second date</option>' + options;
}

function compareMeasurements() {
  const date1 = document.getElementById('compareDate1').value;
  const date2 = document.getElementById('compareDate2').value;
  const container = document.getElementById('comparisonResult');
  
  if (!date1 || !date2) {
    container.innerHTML = '<p style="color:#64748b;text-align:center;padding:20px">Select two dates to compare</p>';
    return;
  }
  
  const record1 = measurementRecords.find(r => r.date === date1);
  const record2 = measurementRecords.find(r => r.date === date2);
  
  if (!record1 || !record2) {
    container.innerHTML = '<p style="color:#d63031;text-align:center;padding:20px">Records not found</p>';
    return;
  }
  
  let html = `
    <div class="comparison-table">
      <div class="comparison-header">
        <span>Measurement</span>
        <span>${new Date(date1).toLocaleDateString()}</span>
        <span>${new Date(date2).toLocaleDateString()}</span>
        <span>Change</span>
      </div>
  `;
  
  measurementTypes.forEach(m => {
    const val1 = record1.measurements[m.id];
    const val2 = record2.measurements[m.id];
    
    if (val1 || val2) {
      const diff = val2 && val1 ? (val2 - val1).toFixed(1) : '-';
      const diffClass = diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'no-change';
      const diffSign = diff > 0 ? '+' : '';
      
      html += `
        <div class="comparison-row">
          <span><span class="measurement-icon">${m.icon}</span> ${m.label}</span>
          <span>${val1 ? val1 + ' ' + m.unit : '-'}</span>
          <span>${val2 ? val2 + ' ' + m.unit : '-'}</span>
          <span class="${diffClass}">${diff !== '-' ? diffSign + diff + ' ' + m.unit : '-'}</span>
        </div>
      `;
    }
  });
  
  // Weight comparison
  if (record1.weight || record2.weight) {
    const weightDiff = record2.weight && record1.weight ? (record2.weight - record1.weight).toFixed(1) : '-';
    const weightDiffClass = weightDiff > 0 ? 'increase' : weightDiff < 0 ? 'decrease' : 'no-change';
    const weightDiffSign = weightDiff > 0 ? '+' : '';
    
    html += `
      <div class="comparison-row weight-row">
        <span><i class="fas fa-weight-scale"></i> Weight</span>
        <span>${record1.weight ? record1.weight + ' kg' : '-'}</span>
        <span>${record2.weight ? record2.weight + ' kg' : '-'}</span>
        <span class="${weightDiffClass}">${weightDiff !== '-' ? weightDiffSign + weightDiff + ' kg' : '-'}</span>
      </div>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}

function updateChart() {
  const canvas = document.getElementById('measurementChart');
  if (!canvas) return;
  
  const metric = document.getElementById('chartMetric')?.value || 'chest';
  
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
  
  if (measurementRecords.length < 2) {
    ctx.font = '500 14px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('Need at least 2 records to show chart', width/2, height/2);
    return;
  }
  
  const chartData = [...measurementRecords].reverse();
  
  const padding = { top: 30, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const values = chartData.map(r => {
    if (metric === 'weight') return r.weight;
    return r.measurements[metric];
  }).filter(v => v !== null && v !== undefined);
  
  if (values.length < 2) {
    ctx.font = '500 14px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText(`No ${metric} data available`, width/2, height/2);
    return;
  }
  
  const maxVal = Math.max(...values) + 5;
  const minVal = Math.max(0, Math.min(...values) - 5);
  
  // Grid
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 0.5;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 4; i++) {
    const value = minVal + (i / 4) * (maxVal - minVal);
    const y = padding.top + chartHeight - (i / 4) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(value.toFixed(1), padding.left - 6, y + 3);
  }
  
  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = '#00b4d8';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  
  chartData.forEach((r, i) => {
    const value = metric === 'weight' ? r.weight : r.measurements[metric];
    if (value === null || value === undefined) return;
    
    const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((value - minVal) / (maxVal - minVal)) * chartHeight;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Points
  chartData.forEach((r, i) => {
    const value = metric === 'weight' ? r.weight : r.measurements[metric];
    if (value === null || value === undefined) return;
    
    const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((value - minVal) / (maxVal - minVal)) * chartHeight;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#00b4d8';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.stroke();
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
  
  const metricLabel = measurementTypes.find(m => m.id === metric)?.label || 'Weight';
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = '#00b4d8';
  ctx.textAlign = 'left';
  ctx.fillText(`${metricLabel} Progress`, padding.left + 5, padding.top - 8);
}

async function deleteMeasurementRecord(id) {
  if (!confirm('Delete this measurement record?')) return;
  
  const result = await callAPI('deleteMeasurement', { measurementId: id });
  
  if (result.success) {
    measurementRecords = measurementRecords.filter(r => r.id !== id);
    updateLatestMeasurements();
    updateMeasurementHistory();
    updateDateSelectors();
    updateChart();
    showToast('Record deleted', false);
  } else {
    showToast(result.error || 'Failed to delete', true);
  }
}

console.log("✅ Body Measurements Tracker Loaded");