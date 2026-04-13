// ========================================
// HYDROFIT - BMI TRACKER (SIMPLIFIED)
// ========================================

let bmiRecords = [];

function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return bmi.toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { category: 'Underweight', color: '#fdcb6e', bgColor: 'rgba(253, 203, 110, 0.15)' };
  if (bmi < 25) return { category: 'Normal Weight', color: '#00b894', bgColor: 'rgba(0, 184, 148, 0.15)' };
  if (bmi < 30) return { category: 'Overweight', color: '#e17055', bgColor: 'rgba(225, 112, 85, 0.15)' };
  return { category: 'Obese', color: '#d63031', bgColor: 'rgba(214, 48, 49, 0.15)' };
}

function renderBMI() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="bmi-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20Purple%20Modern%20GYM%20Fitness%20Presentation%20.png" alt="BMI Tracker Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- BMI Calculator -->
    <div class="card">
      <h3><i class="fas fa-weight-scale"></i> BMI Calculator</h3>
      <p style="color:#64748b;margin-bottom:20px">Monitor your body status</p>
      
      <div class="form-row">
        <div class="form-group">
          <label>Height (cm)</label>
          <input type="number" id="bmiHeight" class="form-control" placeholder="e.g., 170" min="0" step="0.1">
        </div>
        <div class="form-group">
          <label>Weight (kg)</label>
          <input type="number" id="bmiWeight" class="form-control" placeholder="e.g., 65" min="0" step="0.1">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="bmiDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label>Notes (Optional)</label>
          <input type="text" id="bmiNotes" class="form-control" placeholder="e.g., After workout">
        </div>
      </div>
      
      <button class="btn" onclick="calculateAndShowBMI()" style="width:100%">
        <i class="fas fa-calculator"></i> Calculate BMI
      </button>
      
      <!-- BMI Result -->
      <div id="bmiResult" style="display:none;margin-top:20px;padding:20px;background:#f0f9ff;border-radius:16px;text-align:center">
        <div style="font-size:0.9rem;color:#64748b">Your BMI</div>
        <div style="font-size:3rem;font-weight:800" id="bmiValue">0.0</div>
        <div style="font-size:1.2rem;font-weight:600;margin-bottom:16px" id="bmiCategory">-</div>
        <button class="btn" onclick="saveBMIRecord()" style="width:100%">
          <i class="fas fa-save"></i> Save Record
        </button>
      </div>
    </div>

    <!-- Progress Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Progress Chart</h3>
      <div id="bmiChartContainer" style="position:relative;height:300px;">
        <canvas id="bmiChart" style="width:100%;height:100%"></canvas>
      </div>
      <!-- Category Legend -->
      <div style="display:flex;justify-content:center;gap:20px;margin-top:16px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:#fdcb6e"></span><span style="font-size:0.75rem;color:#64748b">Underweight</span></div>
        <div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:#00b894"></span><span style="font-size:0.75rem;color:#64748b">Normal</span></div>
        <div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:#e17055"></span><span style="font-size:0.75rem;color:#64748b">Overweight</span></div>
        <div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:#d63031"></span><span style="font-size:0.75rem;color:#64748b">Obese</span></div>
      </div>
    </div>

    <!-- BMI History -->
    <div class="card">
      <h3><i class="fas fa-history"></i> BMI History</h3>
      <div id="bmiHistory">
        <div style="text-align:center;padding:20px;color:#64748b">
          <i class="fas fa-calendar-alt" style="font-size:2rem;margin-bottom:12px"></i>
          <p>No history yet</p>
        </div>
      </div>
    </div>
  `;
  
  loadBMIRecords();
}

let currentBMIValue = 0;
let currentBMICategory = '';

function calculateAndShowBMI() {
  const height = parseFloat(document.getElementById('bmiHeight').value);
  const weight = parseFloat(document.getElementById('bmiWeight').value);
  
  if (!height || !weight) {
    showToast('Please enter height and weight', true);
    return;
  }
  
  currentBMIValue = calculateBMI(weight, height);
  const categoryData = getBMICategory(currentBMIValue);
  currentBMICategory = categoryData.category;
  
  const resultDiv = document.getElementById('bmiResult');
  document.getElementById('bmiValue').innerText = currentBMIValue;
  document.getElementById('bmiValue').style.color = categoryData.color;
  document.getElementById('bmiCategory').innerText = categoryData.category;
  document.getElementById('bmiCategory').style.color = categoryData.color;
  resultDiv.style.display = 'block';
}

async function saveBMIRecord() {
  const height = parseFloat(document.getElementById('bmiHeight').value);
  const weight = parseFloat(document.getElementById('bmiWeight').value);
  const date = document.getElementById('bmiDate').value;
  const notes = document.getElementById('bmiNotes').value;
  
  if (!height || !weight || !date) {
    showToast('Missing required fields', true);
    return;
  }
  
  const result = await callAPI('saveBMI', {
    schoolId: window.currentUser.schoolId,
    date,
    height,
    weight,
    bmi: currentBMIValue,
    category: currentBMICategory,
    notes
  });
  
  if (result.success) {
    showToast('BMI record saved!', false);
    document.getElementById('bmiHeight').value = '';
    document.getElementById('bmiWeight').value = '';
    document.getElementById('bmiNotes').value = '';
    document.getElementById('bmiResult').style.display = 'none';
    loadBMIRecords();
  } else {
    showToast(result.error || 'Failed to save', true);
  }
}

async function loadBMIRecords() {
  const result = await callAPI('getBMI', { schoolId: window.currentUser.schoolId });
  
  if (result.success && result.records) {
    bmiRecords = result.records;
    updateBMIHistory();
    drawDigitalBMIChart();
  }
}

function updateBMIHistory() {
  const historyDiv = document.getElementById('bmiHistory');
  
  if (bmiRecords.length === 0) {
    historyDiv.innerHTML = `
      <div style="text-align:center;padding:20px;color:#64748b">
        <i class="fas fa-calendar-alt" style="font-size:2rem;margin-bottom:12px"></i>
        <p>No history yet</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="history-list">';
  bmiRecords.slice(0, 10).forEach(r => {
    const categoryData = getBMICategory(parseFloat(r.bmi));
    html += `
      <div class="history-item" style="display:flex;justify-content:space-between;align-items:center;padding:14px 12px;border-bottom:1px solid #e0e7ff">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:12px;background:${categoryData.bgColor};display:flex;align-items:center;justify-content:center">
            <span style="font-size:1.1rem;font-weight:700;color:${categoryData.color}">${r.bmi}</span>
          </div>
          <div>
            <div style="font-weight:600;color:#1a1a1a">${r.height} cm / ${r.weight} kg</div>
            <div style="font-size:0.75rem;color:#94a3b8">${new Date(r.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:0.8rem;font-weight:600;color:${categoryData.color}">${r.category}</span>
          <button onclick="deleteBMIRecord('${r.id}')" style="background:none;border:none;color:#d63031;cursor:pointer;padding:6px">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  if (bmiRecords.length > 10) {
    html += `<p style="text-align:center;margin-top:16px;color:#64748b;font-size:0.85rem">Showing last 10 of ${bmiRecords.length} records</p>`;
  }
  
  historyDiv.innerHTML = html;
}

function drawDigitalBMIChart() {
  const canvas = document.getElementById('bmiChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  const containerWidth = container.clientWidth;
  
  canvas.width = containerWidth * 2;
  canvas.height = 300 * 2;
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = '300px';
  
  ctx.scale(2, 2);
  
  const width = containerWidth;
  const height = 300;
  
  ctx.clearRect(0, 0, width, height);
  
  if (bmiRecords.length < 2) {
    ctx.font = '500 14px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('Need at least 2 records to show chart', width/2, height/2);
    ctx.font = '400 40px Inter, sans-serif';
    ctx.fillStyle = '#e0e7ff';
    ctx.fillText('📊', width/2, height/2 - 40);
    return;
  }
  
  const chartData = [...bmiRecords].reverse();
  
  const padding = { top: 40, right: 30, bottom: 50, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const bmiValues = chartData.map(r => parseFloat(r.bmi));
  const maxBMI = Math.max(...bmiValues) + 2;
  const minBMI = Math.max(14, Math.min(...bmiValues) - 2);
  
  // Draw category zones
  const zones = [
    { min: 0, max: 18.5, color: 'rgba(253, 203, 110, 0.08)' },
    { min: 18.5, max: 25, color: 'rgba(0, 184, 148, 0.08)' },
    { min: 25, max: 30, color: 'rgba(225, 112, 85, 0.08)' },
    { min: 30, max: 50, color: 'rgba(214, 48, 49, 0.08)' }
  ];
  
  zones.forEach(zone => {
    if (zone.max > minBMI && zone.min < maxBMI) {
      const y1 = padding.top + chartHeight - ((Math.min(zone.max, maxBMI) - minBMI) / (maxBMI - minBMI)) * chartHeight;
      const y2 = padding.top + chartHeight - ((Math.max(zone.min, minBMI) - minBMI) / (maxBMI - minBMI)) * chartHeight;
      ctx.fillStyle = zone.color;
      ctx.fillRect(padding.left, y1, chartWidth, y2 - y1);
    }
  });
  
  // Grid lines
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 0.5;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'right';
  
  for (let i = 0; i <= 5; i++) {
    const value = minBMI + (i / 5) * (maxBMI - minBMI);
    const y = padding.top + chartHeight - (i / 5) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(value.toFixed(1), padding.left - 8, y + 4);
  }
  
  // Draw line
  ctx.beginPath();
  const gradient = ctx.createLinearGradient(padding.left, 0, width - padding.right, 0);
  gradient.addColorStop(0, '#00b4d8');
  gradient.addColorStop(0.5, '#48cae4');
  gradient.addColorStop(1, '#0096c7');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  
  chartData.forEach((r, i) => {
    const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((parseFloat(r.bmi) - minBMI) / (maxBMI - minBMI)) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Area fill
  ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.closePath();
  const areaGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
  areaGradient.addColorStop(0, 'rgba(0, 180, 216, 0.15)');
  areaGradient.addColorStop(1, 'rgba(0, 180, 216, 0.02)');
  ctx.fillStyle = areaGradient;
  ctx.fill();
  
  // Data points
  chartData.forEach((r, i) => {
    const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((parseFloat(r.bmi) - minBMI) / (maxBMI - minBMI)) * chartHeight;
    const categoryData = getBMICategory(parseFloat(r.bmi));
    
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = categoryData.color + '30';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = categoryData.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = categoryData.color;
    ctx.textAlign = 'center';
    ctx.fillText(r.bmi, x, y - 12);
  });
  
  // Date labels
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
  
  ctx.font = 'bold 12px Inter, sans-serif';
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.fillText('BMI Progress Over Time', width/2, 22);
}

async function deleteBMIRecord(id) {
  if (!confirm('Delete this BMI record?')) return;
  
  const result = await callAPI('deleteBMI', { bmiId: id });
  
  if (result.success) {
    bmiRecords = bmiRecords.filter(r => r.id !== id);
    updateBMIHistory();
    drawDigitalBMIChart();
    showToast('Record deleted', false);
  } else {
    showToast(result.error || 'Failed to delete', true);
  }
}

console.log("✅ BMI Tracker Loaded");