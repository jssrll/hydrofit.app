// ========================================
// HYDROFIT - RECOVERY AND REST TRACKER
// ========================================

let recoveryRecords = [];

function renderRecoveryTracker() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Recovery Tracker" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Recovery Input -->
    <div class="card">
      <h3><i class="fas fa-bed"></i> Log Recovery</h3>
      <p style="color:#64748b;margin-bottom:20px">Track your rest and recovery status</p>
      
      <div class="form-row">
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="recoveryDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
        </div>
        <div class="form-group">
          <label>Rest Day?</label>
          <select id="restDay" class="form-control">
            <option value="Yes">Yes - Complete Rest</option>
            <option value="Active">Active Recovery</option>
            <option value="No">No - Training Day</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Sleep Duration (hours)</label>
          <input type="number" id="sleepHours" class="form-control" placeholder="e.g., 7.5" min="0" max="24" step="0.5">
        </div>
        <div class="form-group">
          <label>Sleep Quality</label>
          <select id="sleepQuality" class="form-control">
            <option value="5">😊 Excellent</option>
            <option value="4">🙂 Good</option>
            <option value="3">😐 Fair</option>
            <option value="2">😕 Poor</option>
            <option value="1">😫 Very Poor</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Muscle Soreness Level</label>
          <select id="sorenessLevel" class="form-control">
            <option value="1">1 - None</option>
            <option value="2">2 - Very Light</option>
            <option value="3">3 - Light</option>
            <option value="4">4 - Moderate</option>
            <option value="5">5 - Heavy</option>
            <option value="6">6 - Very Heavy</option>
          </select>
        </div>
        <div class="form-group">
          <label>Energy Level</label>
          <select id="energyLevel" class="form-control">
            <option value="5">⚡ Excellent</option>
            <option value="4">😊 Good</option>
            <option value="3">😐 Fair</option>
            <option value="2">😕 Low</option>
            <option value="1">😫 Exhausted</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Notes (Optional)</label>
        <textarea id="recoveryNotes" class="form-control" rows="2" placeholder="How are you feeling?"></textarea>
      </div>
      
      <button class="btn" onclick="saveRecoveryRecord()" style="width:100%">
        <i class="fas fa-save"></i> Save Record
      </button>
    </div>

    <!-- Recommendation -->
    <div class="card" id="recommendationCard">
      <h3><i class="fas fa-clipboard-list"></i> Today's Recommendation</h3>
      <div id="recoveryRecommendation">
        <div style="text-align:center;padding:20px;color:#64748b">
          <i class="fas fa-heart" style="font-size:2rem;margin-bottom:12px"></i>
          <p>Log your recovery data to get personalized recommendations</p>
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
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 style="margin-bottom:0"><i class="fas fa-history"></i> Recovery History</h3>
        <button class="btn btn-outline btn-sm" onclick="loadRecoveryRecords()">
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
  const sleepQuality = parseInt(document.getElementById('sleepQuality')?.value) || 3;
  const soreness = parseInt(document.getElementById('sorenessLevel')?.value) || 3;
  const energy = parseInt(document.getElementById('energyLevel')?.value) || 3;
  
  if (!restDay) return;
  
  let recommendation = '';
  let color = '#00b894';
  let icon = '✅';
  
  // Calculate recommendation based on inputs
  if (restDay === 'Yes') {
    recommendation = 'Great choice! Complete rest is essential for muscle repair and growth. Focus on hydration and nutrition today.';
    icon = '🛌';
  } else if (restDay === 'Active') {
    recommendation = 'Active recovery is excellent! Try light walking, stretching, or yoga to promote blood flow without stressing muscles.';
    icon = '🚶';
    color = '#00b4d8';
  } else {
    if (soreness >= 5) {
      recommendation = '⚠️ High muscle soreness detected. Consider taking a rest day or light active recovery instead of intense training.';
      color = '#e17055';
      icon = '⚠️';
    } else if (sleepHours < 6) {
      recommendation = '😴 You may be sleep-deprived. Ensure proper warm-up and listen to your body. Consider a lighter workout today.';
      color = '#fdcb6e';
      icon = '😴';
    } else if (energy <= 2) {
      recommendation = '🔋 Low energy detected. Focus on proper nutrition and hydration. A lighter workout may be beneficial.';
      color = '#fdcb6e';
      icon = '🔋';
    } else {
      recommendation = '💪 You seem well-rested! Ready for a productive training session. Remember to warm up properly.';
      icon = '💪';
    }
  }
  
  // Additional sleep recommendation
  if (sleepHours < 7 && restDay !== 'Yes') {
    recommendation += ' Aim for 7-9 hours of sleep for optimal recovery.';
  }
  
  const recDiv = document.getElementById('recoveryRecommendation');
  recDiv.innerHTML = `
    <div style="text-align:center;padding:20px">
      <div style="font-size:3rem;margin-bottom:12px">${icon}</div>
      <p style="font-size:1.1rem;color:${color};line-height:1.6">${recommendation}</p>
      ${restDay === 'No' && soreness < 4 && sleepHours >= 7 ? `
        <div style="margin-top:16px;padding:12px;background:#f0f9ff;border-radius:12px">
          <i class="fas fa-dumbbell"></i> Suggested: Moderate to high intensity training
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
  
  // Calculate recovery score (0-100)
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
  
  btn.disabled = false;
  btn.innerHTML = originalText;
  
  if (result.success) {
    showToast('Recovery record saved!', false);
    document.getElementById('sleepHours').value = '';
    document.getElementById('recoveryNotes').value = '';
    document.getElementById('recoveryRecommendation').innerHTML = `
      <div style="text-align:center;padding:20px;color:#64748b">
        <i class="fas fa-heart" style="font-size:2rem;margin-bottom:12px"></i>
        <p>Log your recovery data to get personalized recommendations</p>
      </div>
    `;
    loadRecoveryRecords();
  } else {
    showToast(result.error || 'Failed to save', true);
  }
}

async function loadRecoveryRecords() {
  const result = await callAPI('getRecovery', { schoolId: window.currentUser.schoolId });
  
  if (result.success && result.records) {
    recoveryRecords = result.records;
    updateRecoveryStats();
    updateRecoveryHistory();
  }
}

function updateRecoveryStats() {
  if (recoveryRecords.length === 0) {
    document.getElementById('avgSleep').innerText = '--';
    document.getElementById('restDays').innerText = '--';
    document.getElementById('avgEnergy').innerText = '--';
    document.getElementById('recoveryScore').innerText = '--';
    return;
  }
  
  // Last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentRecords = recoveryRecords.filter(r => new Date(r.date) >= sevenDaysAgo);
  
  const avgSleep = (recentRecords.reduce((sum, r) => sum + parseFloat(r.sleepHours), 0) / recentRecords.length).toFixed(1);
  const restDays = recentRecords.filter(r => r.restDay === 'Yes').length;
  const avgEnergy = (recentRecords.reduce((sum, r) => sum + parseInt(r.energyLevel), 0) / recentRecords.length).toFixed(1);
  const avgRecovery = recentRecords.length > 0 
    ? Math.round(recentRecords.reduce((sum, r) => sum + parseInt(r.recoveryScore), 0) / recentRecords.length)
    : 0;
  
  document.getElementById('avgSleep').innerText = avgSleep;
  document.getElementById('restDays').innerText = restDays;
  document.getElementById('avgEnergy').innerText = avgEnergy;
  document.getElementById('recoveryScore').innerText = avgRecovery;
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
    const restColor = r.restDay === 'Yes' ? '#00b894' : r.restDay === 'Active' ? '#00b4d8' : '#e17055';
    
    html += `
      <div class="history-item" style="display:flex;justify-content:space-between;align-items:center;padding:14px 12px;border-bottom:1px solid #e0e7ff">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:45px;height:45px;border-radius:12px;background:${restColor}20;display:flex;align-items:center;justify-content:center">
            <span style="font-size:1.2rem">${r.restDay === 'Yes' ? '🛌' : r.restDay === 'Active' ? '🚶' : '💪'}</span>
          </div>
          <div>
            <div style="font-weight:600;color:#1a1a1a">${r.restDay === 'Yes' ? 'Rest Day' : r.restDay === 'Active' ? 'Active Recovery' : 'Training Day'}</div>
            <div style="font-size:0.75rem;color:#94a3b8">${new Date(r.date).toLocaleDateString()}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:16px">
          <div style="text-align:center">
            <div style="font-size:0.7rem;color:#64748b">Sleep</div>
            <div style="font-weight:600">${r.sleepHours}h</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.7rem;color:#64748b">Energy</div>
            <div>${energyEmoji} ${r.energyLevel}/5</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:0.7rem;color:#64748b">Score</div>
            <div style="font-weight:700;color:#00b894">${r.recoveryScore}</div>
          </div>
          <button onclick="deleteRecoveryRecord('${r.id}')" style="background:none;border:none;color:#d63031;cursor:pointer">
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
  
  const result = await callAPI('deleteRecovery', { recoveryId: id });
  
  if (result.success) {
    recoveryRecords = recoveryRecords.filter(r => r.id !== id);
    updateRecoveryStats();
    updateRecoveryHistory();
    showToast('Record deleted', false);
  } else {
    showToast(result.error || 'Failed to delete', true);
  }
}

console.log("✅ Recovery Tracker Loaded");