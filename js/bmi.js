// ========================================
// HYDROFIT - BMI TRACKER
// ========================================

let bmiRecords = [];

function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return bmi.toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { category: 'Underweight', color: '#fdcb6e' };
  if (bmi < 25) return { category: 'Normal Weight', color: '#00b894' };
  if (bmi < 30) return { category: 'Overweight', color: '#e17055' };
  return { category: 'Obese', color: '#d63031' };
}

function renderBMI() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="bmi-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="BMI Tracker Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
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

    <!-- Current BMI Status -->
    <div class="card">
      <h3><i class="fas fa-chart-pie"></i> Current Status</h3>
      <div id="currentBMIStatus">
        <div style="text-align:center;padding:20px;color:#64748b">
          <i class="fas fa-weight-scale" style="font-size:2rem;margin-bottom:12px"></i>
          <p>No BMI records yet</p>
        </div>
      </div>
    </div>

    <!-- Progress Chart -->
    <div class="card">
      <h3><i class="fas fa-chart-line"></i> Progress Chart</h3>
      <div id="bmiChartContainer">
        <canvas id="bmiChart" style="width:100%;height:250px"></canvas>
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
    updateBMIStatus();
    updateBMIHistory();
    drawBMIChart();
  }
}

function updateBMIStatus() {
  const statusDiv = document.getElementById('currentBMIStatus');
  
  if (bmiRecords.length === 0) {
    statusDiv.innerHTML = `
      <div style="text-align:center;padding:20px;color:#64748b">
        <i class="fas fa-weight-scale" style="font-size:2rem;margin-bottom:12px"></i>
        <p>No BMI records yet</p>
      </div>
    `;
    return;
  }
  
  const latest = bmiRecords[0];
  const categoryData = getBMICategory(parseFloat(latest.bmi));
  const previous = bmiRecords[1];
  let trend = '';
  if (previous) {
    const diff = (parseFloat(latest.bmi) - parseFloat(previous.bmi)).toFixed(1);
    trend = diff > 0 ? `↑ ${diff}` : diff < 0 ? `↓ ${Math.abs(diff)}` : '→ 0.0';
  }
  
  statusDiv.innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:3.5rem;font-weight:800;color:${categoryData.color}">${latest.bmi}</div>
      <div style="font-size:1.2rem;font-weight:600;color:${categoryData.color};margin-bottom:8px">${latest.category}</div>
      <div style="display:flex;justify-content:center;gap:24px;margin-top:16px">
        <div><span style="color:#64748b">Height:</span> <strong>${latest.height} cm</strong></div>
        <div><span style="color:#64748b">Weight:</span> <strong>${latest.weight} kg</strong></div>
        ${trend ? `<div><span style="color:#64748b">Trend:</span> <strong style="color:${trend.includes('↓')?'#00b894':'#e17055'}">${trend}</strong></div>` : ''}
      </div>
      <div style="margin-top:12px;color:#94a3b8;font-size:0.85rem">
        <i class="fas fa-calendar"></i> ${new Date(latest.date).toLocaleDateString()}
      </div>
    </div>
  `;
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
      <div class="history-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #e0e7ff">
        <div>
          <strong>BMI: ${r.bmi}</strong>
          <span style="margin-left:8px;color:${categoryData.color};font-size:0.85rem">${r.category}</span>
          <div style="font-size:0.8rem;color:#64748b">${r.height} cm | ${r.weight} kg</div>
          <div style="font-size:0.75rem;color:#94a3b8">${new Date(r.date).toLocaleDateString()}</div>
        </div>
        <button onclick="deleteBMIRecord('${r.id}')" style="background:none;border:none;color:#d63031;cursor:pointer">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  });
  html += '</div>';
  
  if (bmiRecords.length > 10) {
    html += `<p style="text-align:center;margin-top:12px;color:#64748b">Showing last 10 of ${bmiRecords.length}</p>`;
  }
  
  historyDiv.innerHTML = html;
}

function drawBMIChart() {
  const canvas = document.getElementById('bmiChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (bmiRecords.length < 2) {
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('Need at least 2 records to show chart', canvas.width/2, canvas.height/2);
    return;
  }
  
  // Sort by date (oldest first for chart)
  const chartData = [...bmiRecords].reverse();
  
  const padding = 40;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  
  const bmiValues = chartData.map(r => parseFloat(r.bmi));
  const maxBMI = Math.max(...bmiValues) + 2;
  const minBMI = Math.max(0, Math.min(...bmiValues) - 2);
  
  // Draw axes
  ctx.beginPath();
  ctx.strokeStyle = '#e0e7ff';
  ctx.lineWidth = 1;
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();
  
  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = '#00b4d8';
  ctx.lineWidth = 3;
  
  chartData.forEach((r, i) => {
    const x = padding + (i / (chartData.length - 1)) * chartWidth;
    const y = canvas.height - padding - ((parseFloat(r.bmi) - minBMI) / (maxBMI - minBMI)) * chartHeight;
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Draw points
  chartData.forEach((r, i) => {
    const x = padding + (i / (chartData.length - 1)) * chartWidth;
    const y = canvas.height - padding - ((parseFloat(r.bmi) - minBMI) / (maxBMI - minBMI)) * chartHeight;
    
    ctx.beginPath();
    ctx.fillStyle = getBMICategory(parseFloat(r.bmi)).color;
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Draw labels
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'center';
  
  // Date labels
  ctx.fillText(chartData[0].date, padding, canvas.height - 10);
  ctx.fillText(chartData[chartData.length-1].date, canvas.width - padding, canvas.height - 10);
}

async function deleteBMIRecord(id) {
  if (!confirm('Delete this BMI record?')) return;
  
  const result = await callAPI('deleteBMI', { bmiId: id });
  
  if (result.success) {
    bmiRecords = bmiRecords.filter(r => r.id !== id);
    updateBMIStatus();
    updateBMIHistory();
    drawBMIChart();
    showToast('Record deleted', false);
  } else {
    showToast(result.error || 'Failed to delete', true);
  }
}

console.log("✅ BMI Tracker Loaded");