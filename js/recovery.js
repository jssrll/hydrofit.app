// ========================================
// HYDROFIT - RECOVERY AND REST TRACKER
// ========================================

let recoveryRecords = [];

function renderRecoveryTracker() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/Beige%20White%20Minimalist%20Project%20Presentation.png" alt="Recovery Tracker" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Recovery Input -->
    <div class="card">
      <h3><i class="fas fa-bed"></i> Log Recovery</h3>
      <p style="color:#64748b;margin-bottom:20px">Track your rest and recovery status</p>
      
      <div class="recovery-form-row">
        <div class="recovery-form-group">
          <label><i class="fas fa-calendar"></i> Date</label>
          <input type="date" id="recoveryDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="recovery-form-group">
          <label><i class="fas fa-pause-circle"></i> Rest Day?</label>
          <select id="restDay" class="form-control">
            <option value="Yes">Yes - Complete Rest</option>
            <option value="Active">Active Recovery</option>
            <option value="No">No - Training Day</option>
          </select>
        </div>
      </div>
      
      <div class="recovery-form-row">
        <div class="recovery-form-group">
          <label><i class="fas fa-moon"></i> Sleep (hours)</label>
          <input type="number" id="sleepHours" class="form-control" placeholder="e.g., 7.5" min="0" max="24" step="0.5">
        </div>
        <div class="recovery-form-group">
          <label><i class="fas fa-star"></i> Sleep Quality</label>
          <select id="sleepQuality" class="form-control">
            <option value="5">Excellent</option>
            <option value="4">Good</option>
            <option value="3" selected>Fair</option>
            <option value="2">Poor</option>
            <option value="1">Very Poor</option>
          </select>
        </div>
      </div>
      
      <div class="recovery-form-row">
        <div class="recovery-form-group">
          <label><i class="fas fa-bolt"></i> Muscle Soreness</label>
          <select id="sorenessLevel" class="form-control">
            <option value="1">1 - None</option>
            <option value="2">2 - Very Light</option>
            <option value="3" selected>3 - Light</option>
            <option value="4">4 - Moderate</option>
            <option value="5">5 - Heavy</option>
            <option value="6">6 - Very Heavy</option>
          </select>
        </div>
        <div class="recovery-form-group">
          <label><i class="fas fa-battery-three-quarters"></i> Energy Level</label>
          <select id="energyLevel" class="form-control">
            <option value="5">Excellent</option>
            <option value="4">Good</option>
            <option value="3" selected>Fair</option>
            <option value="2">Low</option>
            <option value="1">Exhausted</option>
          </select>
        </div>
      </div>
      
      <div class="recovery-form-group">
        <label><i class="fas fa-pencil"></i> Notes (Optional)</label>
        <textarea id="recoveryNotes" class="form-control" rows="2" placeholder="How are you feeling?"></textarea>
      </div>
      
      <button class="save-btn" onclick="saveRecoveryRecord()">
        <i class="fas fa-save"></i> Save Record
      </button>
    </div>

    <!-- Recommendation -->
    <div class="card recommendation-card">
      <h3><i class="fas fa-clipboard-list"></i> Today's Recommendation</h3>
      <div id="recoveryRecommendation">
        <div class="recommendation-content">
          <div class="recommendation-icon">💪</div>
          <p class="recommendation-text" style="color: #1a1a1a;">Log your recovery data to get personalized recommendations</p>
        </div>
      </div>
    </div>

    <!-- Recovery Stats -->
    <div class="stats-grid" id="recoveryStats">
      <div class="stat-card">
        <i class="fas fa-bed"></i>
        <div class="stat-value" id="avgSleep">--</div>
        <div class="stat-label">Avg Sleep (hrs)</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-calendar-check"></i>
        <div class="stat-value" id="restDays">--</div>
        <div class="stat-label">Rest Days (7d)</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-bolt"></i>
        <div class="stat-value" id="avgEnergy">--</div>
        <div class="stat-label">Avg Energy</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-heart"></i>
        <div class="stat-value" id="recoveryScore">--</div>
        <div class="stat-label">Recovery Score</div>
      </div>
    </div>

    <!-- History -->
    <div class="card">
      <div class="recovery-history-header">
        <h3><i class="fas fa-history"></i> Recovery History</h3>
        <button class="refresh-btn" onclick="loadRecoveryRecords()">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      <div id="recoveryHistory">
        <div class="empty-state">
          <i class="fas fa-calendar-alt"></i>
          <p>No records yet</p>
          <p class="empty-hint">Data syncs with Google Sheets</p>
        </div>
      </div>
    </div>
  `;
  
  // Live recommendation update
  document.getElementById('restDay')?.addEventListener('change', updateRecommendation);
  document.getElementById('sleepHours')?.addEventListener('input', updateRecommendation);
  document.getElementById('sleepQuality')?.addEventListener('change', updateRecommendation);
  document.getElementById('sorenessLevel')?.addEventListener('change', updateRecommendation);
  document.getElementById('energyLevel')?.addEventListener('change', updateRecommendation);
  
  loadRecoveryRecords();
}

function updateRecommendation() {
  const restDay = document.getElementById('restDay')?.value;
  const sleepHours = parseFloat(document.getElementById('sleepHours')?.value) || 0;
  const soreness = parseInt(document.getElementById('sorenessLevel')?.value) || 3;
  const energy = parseInt(document.getElementById('energyLevel')?.value) || 3;
  
  if (!restDay) return;
  
  let recommendation = '';
  let icon = '💪';
  let bgColor = '#f0f9ff';
  let borderColor = '#00b4d8';
  
  if (restDay === 'Yes') {
    recommendation = 'Great choice! Complete rest is essential for muscle repair and growth. Focus on hydration and nutrition today.';
    icon = '🛌';
    bgColor = '#e8f8f5';
    borderColor = '#00b894';
  } else if (restDay === 'Active') {
    recommendation = 'Active recovery is excellent! Try light walking, stretching, or yoga to promote blood flow without stressing muscles.';
    icon = '🚶';
    bgColor = '#e0f7fa';
    borderColor = '#00b4d8';
  } else {
    if (soreness >= 5) {
      recommendation = 'High muscle soreness detected. Consider taking a rest day or light active recovery instead of intense training.';
      icon = '⚠️';
      bgColor = '#fdecea';
      borderColor = '#e17055';
    } else if (sleepHours < 6) {
      recommendation = 'You may be sleep-deprived. Ensure proper warm-up and listen to your body. Consider a lighter workout today.';
      icon = '😴';
      bgColor = '#fef9e7';
      borderColor = '#fdcb6e';
    } else if (energy <= 2) {
      recommendation = 'Low energy detected. Focus on proper nutrition and hydration. A lighter workout may be beneficial.';
      icon = '🔋';
      bgColor = '#fef9e7';
      borderColor = '#fdcb6e';
    } else {
      recommendation = 'You seem well-rested! Ready for a productive training session. Remember to warm up properly.';
      icon = '💪';
      bgColor = '#e8f8f5';
      borderColor = '#00b894';
    }
  }
  
  if (sleepHours < 7 && restDay !== 'Yes') {
    recommendation += ' Aim for 7-9 hours of sleep for optimal recovery.';
  }
  
  const recDiv = document.getElementById('recoveryRecommendation');
  recDiv.innerHTML = `
    <div class="recommendation-content" style="background: ${bgColor}; border-radius: 16px; padding: 24px; border-left: 4px solid ${borderColor};">
      <div class="recommendation-icon">${icon}</div>
      <p class="recommendation-text" style="color: #1a1a1a; font-weight: 500;">${recommendation}</p>
      ${restDay === 'No' && soreness < 4 && sleepHours >= 7 ? `
        <div class="recommendation-suggestion" style="background: white; color: #1a1a1a;">
          <i class="fas fa-dumbbell" style="color: #00b4d8;"></i> Suggested: Moderate to high intensity training
        </div>
      ` : ''}
      ${restDay === 'Yes' ? `
        <div class="recommendation-suggestion" style="background: white; color: #1a1a1a;">
          <i class="fas fa-check-circle" style="color: #00b894;"></i> Focus on: Hydration, nutrition, and quality sleep
        </div>
      ` : ''}
      ${restDay === 'Active' ? `
        <div class="recommendation-suggestion" style="background: white; color: #1a1a1a;">
          <i class="fas fa-walking" style="color: #00b4d8;"></i> Try: Light walking, stretching, foam rolling, or yoga
        </div>
      ` : ''}
    </div>
  `;
}

async function saveRecoveryRecord() {
  const date = document.getElementById('recoveryDate').value;
  const restDay = document.getElementById('restDay').value;
  const sleepHours = parseFloat(document.getElementById('sleepHours').value) || 0;
  const sleepQuality = parseInt(document.getElementById('sleepQuality').value) || 3;
  const sorenessLevel = parseInt(document.getElementById('sorenessLevel').value) || 3;
  const energyLevel = parseInt(document.getElementById('energyLevel').value) || 3;
  const notes = document.getElementById('recoveryNotes').value;
  
  if (!date || !sleepHours) {
    showToast('Please fill in required fields', true);
    return;
  }
  
  const recoveryScore = Math.round(
    (sleepQuality * 10) + 
    (Math.min(sleepHours, 9) * 5) + 
    ((6 - sorenessLevel) * 8) + 
    (energyLevel * 8)
  );
  
  const btn = document.querySelector('button[onclick="saveRecoveryRecord()"]');
  const originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  
  try {
    const result = await callAPI('saveRecovery', {
      schoolId: window.currentUser.schoolId,
      date,
      restDay,
      sleepHours,
      sleepQuality,
      sorenessLevel,
      energyLevel,
      recoveryScore,
      notes
    });
    
    if (result.success) {
      showToast('Recovery record saved!', false);
      document.getElementById('sleepHours').value = '';
      document.getElementById('recoveryNotes').value = '';
      document.getElementById('recoveryRecommendation').innerHTML = `
        <div class="recommendation-content" style="background: #f0f9ff; border-radius: 16px; padding: 24px; border-left: 4px solid #00b4d8;">
          <div class="recommendation-icon">💪</div>
          <p class="recommendation-text" style="color: #1a1a1a; font-weight: 500;">Log your recovery data to get personalized recommendations</p>
        </div>
      `;
      loadRecoveryRecords();
    } else {
      saveToLocalStorage(date, restDay, sleepHours, sleepQuality, sorenessLevel, energyLevel, recoveryScore, notes);
    }
  } catch (error) {
    saveToLocalStorage(date, restDay, sleepHours, sleepQuality, sorenessLevel, energyLevel, recoveryScore, notes);
  }
  
  btn.disabled = false;
  btn.innerHTML = originalText;
}

function saveToLocalStorage(date, restDay, sleepHours, sleepQuality, sorenessLevel, energyLevel, recoveryScore, notes) {
  const record = {
    id: 'REC' + Date.now(),
    schoolId: window.currentUser.schoolId,
    date,
    restDay,
    sleepHours,
    sleepQuality,
    sorenessLevel,
    energyLevel,
    recoveryScore,
    notes
  };
  
  const stored = localStorage.getItem('hydrofit_recovery_' + window.currentUser.schoolId);
  let records = stored ? JSON.parse(stored) : [];
  records.unshift(record);
  localStorage.setItem('hydrofit_recovery_' + window.currentUser.schoolId, JSON.stringify(records));
  
  showToast('Recovery record saved locally!', false);
  document.getElementById('sleepHours').value = '';
  document.getElementById('recoveryNotes').value = '';
  loadRecoveryRecords();
}

async function loadRecoveryRecords() {
  try {
    const result = await callAPI('getRecovery', { schoolId: window.currentUser.schoolId });
    
    if (result.success && result.records) {
      recoveryRecords = result.records;
    } else {
      const stored = localStorage.getItem('hydrofit_recovery_' + window.currentUser.schoolId);
      recoveryRecords = stored ? JSON.parse(stored) : [];
    }
  } catch (error) {
    const stored = localStorage.getItem('hydrofit_recovery_' + window.currentUser.schoolId);
    recoveryRecords = stored ? JSON.parse(stored) : [];
  }
  
  updateRecoveryStats();
  updateRecoveryHistory();
}

function updateRecoveryStats() {
  if (recoveryRecords.length === 0) {
    document.getElementById('avgSleep').innerText = '--';
    document.getElementById('restDays').innerText = '--';
    document.getElementById('avgEnergy').innerText = '--';
    document.getElementById('recoveryScore').innerText = '--';
    return;
  }
  
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentRecords = recoveryRecords.filter(r => new Date(r.date) >= sevenDaysAgo);
  
  if (recentRecords.length > 0) {
    const avgSleep = (recentRecords.reduce((sum, r) => sum + parseFloat(r.sleepHours), 0) / recentRecords.length).toFixed(1);
    const restDays = recentRecords.filter(r => r.restDay === 'Yes').length;
    const avgEnergy = (recentRecords.reduce((sum, r) => sum + parseInt(r.energyLevel), 0) / recentRecords.length).toFixed(1);
    const avgRecovery = Math.round(recentRecords.reduce((sum, r) => sum + parseInt(r.recoveryScore), 0) / recentRecords.length);
    
    document.getElementById('avgSleep').innerText = avgSleep;
    document.getElementById('restDays').innerText = restDays;
    document.getElementById('avgEnergy').innerText = avgEnergy;
    document.getElementById('recoveryScore').innerText = avgRecovery;
  }
}

function updateRecoveryHistory() {
  const historyDiv = document.getElementById('recoveryHistory');
  
  if (recoveryRecords.length === 0) {
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
  recoveryRecords.slice(0, 10).forEach(r => {
    const energyEmoji = r.energyLevel >= 4 ? '⚡' : r.energyLevel >= 3 ? '😊' : '😴';
    const badgeClass = r.restDay === 'Yes' ? 'rest' : r.restDay === 'Active' ? 'active' : 'training';
    const badgeIcon = r.restDay === 'Yes' ? '🛌' : r.restDay === 'Active' ? '🚶' : '💪';
    
    html += `
      <div class="history-item">
        <div class="history-item-left">
          <div class="recovery-badge ${badgeClass}">${badgeIcon}</div>
          <div class="history-details">
            <h5>${r.restDay === 'Yes' ? 'Rest Day' : r.restDay === 'Active' ? 'Active Recovery' : 'Training Day'}</h5>
            <div class="history-meta">
              <span><i class="fas fa-calendar"></i> ${new Date(r.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div class="history-item-right">
          <div class="recovery-metrics">
            <div class="metric-item">
              <div class="metric-label">Sleep</div>
              <div class="metric-value">${r.sleepHours}h</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Energy</div>
              <div class="metric-value">${energyEmoji} ${r.energyLevel}/5</div>
            </div>
          </div>
          <div class="recovery-score-badge">${r.recoveryScore}</div>
          <button class="delete-btn" onclick="deleteRecoveryRecord('${r.id}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  
  if (recoveryRecords.length > 10) {
    html += `<p style="text-align:center;margin-top:16px;color:#64748b">Showing last 10 of ${recoveryRecords.length} records</p>`;
  }
  
  historyDiv.innerHTML = html;
}

async function deleteRecoveryRecord(id) {
  if (!confirm('Delete this recovery record?')) return;
  
  try {
    const result = await callAPI('deleteRecovery', { recoveryId: id });
    if (result.success) {
      recoveryRecords = recoveryRecords.filter(r => r.id !== id);
    } else {
      recoveryRecords = recoveryRecords.filter(r => r.id !== id);
      localStorage.setItem('hydrofit_recovery_' + window.currentUser.schoolId, JSON.stringify(recoveryRecords));
    }
  } catch (error) {
    recoveryRecords = recoveryRecords.filter(r => r.id !== id);
    localStorage.setItem('hydrofit_recovery_' + window.currentUser.schoolId, JSON.stringify(recoveryRecords));
  }
  
  updateRecoveryStats();
  updateRecoveryHistory();
  showToast('Record deleted', false);
}

console.log("✅ Recovery Tracker Loaded");