// ========================================
// HYDROFIT - RANKING (FIXED)
// ========================================

let rankingData = [];

function getRatingColor(rating) {
  const r = parseFloat(rating);
  if (r >= 8.5) return '#00b894';
  if (r >= 7.0) return '#00b4d8';
  if (r >= 5.5) return '#fdcb6e';
  if (r >= 4.0) return '#e17055';
  return '#d63031';
}

async function renderRanking() {
  const container = document.getElementById("tabContent");
  
  // Show loading
  container.innerHTML = `
    <div class="ranking-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Exercise%20Presentation.png?updatedAt=1775725667841" alt="Ranking Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>
    <div class="card">
      <div style="text-align:center;padding:40px">
        <i class="fas fa-spinner fa-spin"></i> Loading rankings...
      </div>
    </div>
  `;
  
  console.log("Calling getAllAssessments...");
  
  try {
    const result = await callAPI('getAllAssessments', {});
    console.log("Ranking result:", result);
    
    if (result && result.success && result.assessments) {
      rankingData = result.assessments;
      console.log("Ranking data loaded:", rankingData.length, "assessments");
      displayRankings();
    } else {
      console.error("Failed to load rankings:", result);
      showError(container, result?.error || 'No assessment data found');
    }
  } catch (error) {
    console.error("Error loading rankings:", error);
    showError(container, error.message || 'Connection error');
  }
}

function showError(container, errorMsg) {
  container.innerHTML = `
    <div class="ranking-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Exercise%20Presentation.png?updatedAt=1775725667841" alt="Ranking Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>
    <div class="card">
      <div style="text-align:center;padding:40px">
        <i class="fas fa-exclamation-triangle" style="color:#d63031;font-size:3rem;margin-bottom:16px"></i>
        <p style="color:#d63031">Failed to load rankings</p>
        <p style="color:#64748b;margin-top:8px">${errorMsg}</p>
        <button class="btn btn-outline" onclick="renderRanking()" style="margin-top:20px">
          <i class="fas fa-sync-alt"></i> Retry
        </button>
      </div>
    </div>
  `;
}

function displayRankings() {
  const container = document.getElementById("tabContent");
  
  if (!rankingData || rankingData.length === 0) {
    container.innerHTML = `
      <div class="ranking-banner">
        <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Exercise%20Presentation.png?updatedAt=1775725667841" alt="Ranking Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
      </div>
      <div class="card">
        <div style="text-align:center;padding:40px">
          <i class="fas fa-trophy" style="font-size:3rem;color:#fdcb6e;margin-bottom:16px"></i>
          <h3>No rankings yet</h3>
          <p style="color:#64748b">Complete fitness assessments to appear on the leaderboard!</p>
        </div>
      </div>
    `;
    return;
  }
  
  const studentStats = {};
  
  rankingData.forEach(a => {
    // Handle both formats of data (with or without studentName)
    const schoolId = a.schoolId;
    const studentName = a.studentName || 'Student';
    
    if (!studentStats[schoolId]) {
      studentStats[schoolId] = {
        schoolId: schoolId,
        name: studentName,
        totalPoints: 0,
        assessmentCount: 0,
        ratingSum: 0,
        totalDuration: 0
      };
    }
    
    // Parse values - handle both string and number
    const rating = parseFloat(a.rating) || 0;
    const value = parseFloat(a.value) || 0;
    const intensity = parseFloat(a.intensity) || 5;
    
    let durationInSeconds = 0;
    const unit = a.unit || 'reps';
    
    if (unit === 'seconds') durationInSeconds = value;
    else if (unit === 'minutes') durationInSeconds = value * 60;
    else if (unit === 'reps') durationInSeconds = value * 2;
    else if (unit === 'meters') durationInSeconds = value * 0.5;
    else if (unit === 'laps') durationInSeconds = value * 60;
    
    studentStats[schoolId].totalPoints += rating * 10;
    studentStats[schoolId].assessmentCount++;
    studentStats[schoolId].ratingSum += rating;
    studentStats[schoolId].totalDuration += durationInSeconds;
  });
  
  const rankings = Object.values(studentStats).map(s => ({
    ...s,
    averageRating: s.assessmentCount > 0 ? (s.ratingSum / s.assessmentCount).toFixed(1) : '0.0'
  }));
  
  // Sort by total points, then duration, then assessment count
  rankings.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.totalDuration !== a.totalDuration) return b.totalDuration - a.totalDuration;
    return b.assessmentCount - a.assessmentCount;
  });
  
  const userRank = rankings.findIndex(r => r.schoolId === window.currentUser?.schoolId) + 1;
  const userData = rankings[userRank - 1];
  
  container.innerHTML = `
    <div class="ranking-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Exercise%20Presentation.png?updatedAt=1775725667841" alt="Ranking Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>
    
    ${userRank > 0 ? `
      <div class="user-rank-card">
        <div class="user-rank-content">
          <i class="fas fa-user"></i>
          <span>Your Rank: <strong>#${userRank}</strong> of ${rankings.length}</span>
          <span class="user-points">${Math.round(userData?.totalPoints || 0)} pts</span>
          <button class="refresh-rank-btn" onclick="renderRanking()" title="Refresh Rankings">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    ` : ''}
    
    <div class="card">
      <h3><i class="fas fa-trophy"></i> Leaderboard</h3>
      <div class="ranking-table-container">
        <table class="ranking-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Assessments</th>
              <th>Avg Rating</th>
              <th>Duration</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            ${rankings.map((r, i) => {
              const rank = i + 1;
              const isCurrentUser = r.schoolId === window.currentUser?.schoolId;
              let rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';
              return `
                <tr class="${isCurrentUser ? 'current-user-row' : ''}">
                  <td><span class="rank-badge ${rankClass}">${rank}</span></td>
                  <td><strong>${escapeHtml(r.name)}</strong>${isCurrentUser ? '<span class="you-badge">You</span>' : ''}</td>
                  <td>${r.assessmentCount}</td>
                  <td><span style="color:${getRatingColor(r.averageRating)};font-weight:600">${r.averageRating}</span></td>
                  <td>${formatDuration(r.totalDuration)}</td>
                  <td><strong>${Math.round(r.totalPoints)}</strong></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

console.log("✅ Ranking Loaded");