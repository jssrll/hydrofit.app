// ========================================
// HYDROFIT - RANKING
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
  
  // Show skeleton loader while fetching
  container.innerHTML = `
    <div class="ranking-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Exercise%20Presentation.png?updatedAt=1775725667841" alt="Ranking Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>
    <div class="card">
      <div style="text-align:center;padding:40px"><i class="fas fa-spinner fa-spin"></i> Loading rankings...</div>
    </div>
  `;
  
  const result = await callAPI('getAllAssessments', {});
  if (result.success && result.assessments) {
    rankingData = result.assessments;
    displayRankings();
  } else { 
    container.innerHTML = `<div class="ranking-banner"><img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Exercise%20Presentation.png?updatedAt=1775725667841" alt="Ranking Banner" style="width:100%;border-radius:20px;box-shadow:var(--shadow)"></div><div class="card"><p style="color:#d63031;text-align:center">Failed to load rankings</p></div>`; 
  }
}

function displayRankings() {
  const container = document.getElementById("tabContent");
  const studentStats = {};
  
  rankingData.forEach(a => {
    if (!studentStats[a.schoolId]) {
      studentStats[a.schoolId] = {
        schoolId: a.schoolId, name: a.studentName, totalPoints: 0,
        assessmentCount: 0, ratingSum: 0, totalDuration: 0
      };
    }
    const rating = parseFloat(a.rating) || 0;
    const value = parseFloat(a.value) || 0;
    let durationInSeconds = 0;
    if (a.unit === 'seconds') durationInSeconds = value;
    else if (a.unit === 'minutes') durationInSeconds = value * 60;
    else if (a.unit === 'reps') durationInSeconds = value * 2;
    else if (a.unit === 'meters') durationInSeconds = value * 0.5;
    else if (a.unit === 'laps') durationInSeconds = value * 60;
    
    studentStats[a.schoolId].totalPoints += rating * 10;
    studentStats[a.schoolId].assessmentCount++;
    studentStats[a.schoolId].ratingSum += rating;
    studentStats[a.schoolId].totalDuration += durationInSeconds;
  });
  
  const rankings = Object.values(studentStats).map(s => ({
    ...s, averageRating: s.assessmentCount > 0 ? (s.ratingSum / s.assessmentCount).toFixed(1) : '0.0'
  }));
  
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