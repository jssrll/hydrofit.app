// ========================================
// HYDROFIT - INJURY PREVENTION GUIDE
// ========================================

const injuryGuide = [
  {
    exercise: 'Jumping Jacks',
    commonInjuries: ['Ankle sprains', 'Knee pain', 'Shoulder strain'],
    properForm: [
      'Land softly on balls of feet',
      'Keep knees slightly bent',
      'Maintain straight back',
      'Controlled arm movement'
    ],
    dos: [
      'Warm up before starting',
      'Wear supportive shoes',
      'Keep movements controlled',
      'Breathe rhythmically'
    ],
    donts: [
      'Lock your knees when landing',
      'Slouch or hunch shoulders',
      'Overextend arms',
      'Hold your breath'
    ],
    icon: '🏃'
  },
  {
    exercise: 'Push-Ups',
    commonInjuries: ['Wrist strain', 'Shoulder impingement', 'Lower back pain'],
    properForm: [
      'Hands shoulder-width apart',
      'Body in straight line',
      'Elbows at 45° angle',
      'Core engaged throughout'
    ],
    dos: [
      'Keep neck neutral',
      'Lower chest to ground',
      'Squeeze glutes',
      'Breathe out when pushing up'
    ],
    donts: [
      'Sag hips or pike up',
      'Flare elbows wide',
      'Drop head forward',
      'Rush through reps'
    ],
    icon: '💪'
  },
  {
    exercise: 'Squats',
    commonInjuries: ['Knee pain', 'Lower back strain', 'Hip discomfort'],
    properForm: [
      'Feet shoulder-width apart',
      'Chest up, back straight',
      'Knees track over toes',
      'Weight in heels'
    ],
    dos: [
      'Keep core braced',
      'Go to parallel depth',
      'Drive through heels',
      'Maintain neutral spine'
    ],
    donts: [
      'Let knees cave inward',
      'Round lower back',
      'Lift heels off ground',
      'Look down at feet'
    ],
    icon: '🦵'
  },
  {
    exercise: 'Lunges',
    commonInjuries: ['Knee instability', 'Hip flexor strain', 'Ankle sprains'],
    properForm: [
      'Step forward with control',
      'Front knee at 90°',
      'Back knee hovers above ground',
      'Torso upright'
    ],
    dos: [
      'Keep weight in front heel',
      'Engage core for balance',
      'Step wide enough for stability',
      'Push through front foot to return'
    ],
    donts: [
      'Let front knee pass toes',
      'Lean torso forward',
      'Bang back knee on ground',
      'Take too narrow stance'
    ],
    icon: '🚶'
  },
  {
    exercise: 'Plank',
    commonInjuries: ['Shoulder strain', 'Lower back pain', 'Wrist discomfort'],
    properForm: [
      'Elbows under shoulders',
      'Body in straight line',
      'Glutes and abs engaged',
      'Neck neutral'
    ],
    dos: [
      'Start with shorter holds',
      'Squeeze glutes tight',
      'Breathe steadily',
      'Modify on knees if needed'
    ],
    donts: [
      'Sag hips or pike up',
      'Hold breath',
      'Drop head or look up',
      'Push through pain'
    ],
    icon: '📏'
  },
  {
    exercise: 'Burpees',
    commonInjuries: ['Shoulder strain', 'Wrist pain', 'Lower back stress'],
    properForm: [
      'Control descent to ground',
      'Jump feet back with control',
      'Land softly from jump',
      'Maintain neutral spine'
    ],
    dos: [
      'Step back instead of jump',
      'Modify without push-up',
      'Land with bent knees',
      'Pace yourself'
    ],
    donts: [
      'Slap feet on ground',
      'Arch lower back',
      'Lock knees on landing',
      'Rush through movements'
    ],
    icon: '🔥'
  },
  {
    exercise: 'Running',
    commonInjuries: ['Shin splints', 'Runner\'s knee', 'Plantar fasciitis', 'IT band syndrome'],
    properForm: [
      'Upright posture, slight lean',
      'Midfoot strike',
      'Arms swing front to back',
      'Cadence 170-180 steps/min'
    ],
    dos: [
      'Replace shoes every 400-500 miles',
      'Increase mileage gradually (10% rule)',
      'Warm up with dynamic stretches',
      'Cool down with walking'
    ],
    donts: [
      'Overstride (land heel first)',
      'Run through sharp pain',
      'Cross arms over chest',
      'Skip rest days'
    ],
    icon: '🏃'
  },
  {
    exercise: 'Deadlift',
    commonInjuries: ['Lower back strain', 'Hamstring pull', 'Grip issues'],
    properForm: [
      'Bar over midfoot',
      'Shoulders slightly ahead of bar',
      'Chest up, back flat',
      'Hinge at hips, not waist'
    ],
    dos: [
      'Keep bar close to body',
      'Brace core before lift',
      'Squeeze glutes at top',
      'Lower with control'
    ],
    donts: [
      'Round lower back',
      'Pull with arms',
      'Hyperextend at top',
      'Look up at ceiling'
    ],
    icon: '🏋️'
  }
];

let currentInjuryIndex = 0;

function renderInjuryGuide() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Injury Prevention Guide" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Exercise Selector -->
    <div class="card">
      <h3><i class="fas fa-shield-heart"></i> Select Exercise</h3>
      <select id="injuryExerciseSelect" class="form-control" onchange="selectInjuryExercise()">
        ${injuryGuide.map((ex, i) => `<option value="${i}" ${i === 0 ? 'selected' : ''}>${ex.icon} ${ex.exercise}</option>`).join('')}
      </select>
    </div>

    <!-- Injury Information -->
    <div class="card" id="injuryDetails">
      <!-- Will be populated by JS -->
    </div>

    <!-- General Safety Tips -->
    <div class="card tips-card">
      <h3><i class="fas fa-lightbulb"></i> General Safety Tips</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:16px">
        <div class="tip-item">
          <i class="fas fa-temperature-high" style="color:#e17055;font-size:1.5rem"></i>
          <h4>Always Warm Up</h4>
          <p>5-10 minutes of light cardio and dynamic stretches before exercise</p>
        </div>
        <div class="tip-item">
          <i class="fas fa-droplet" style="color:#00b4d8;font-size:1.5rem"></i>
          <h4>Stay Hydrated</h4>
          <p>Drink water before, during, and after exercise</p>
        </div>
        <div class="tip-item">
          <i class="fas fa-ear-listen" style="color:#00b894;font-size:1.5rem"></i>
          <h4>Listen to Your Body</h4>
          <p>Stop if you feel sharp pain or discomfort</p>
        </div>
        <div class="tip-item">
          <i class="fas fa-arrow-trend-up" style="color:#fdcb6e;font-size:1.5rem"></i>
          <h4>Progress Gradually</h4>
          <p>Increase intensity and duration slowly over time</p>
        </div>
      </div>
    </div>
  `;
  
  displayInjuryDetails(0);
}

function selectInjuryExercise() {
  const select = document.getElementById('injuryExerciseSelect');
  const index = parseInt(select.value);
  currentInjuryIndex = index;
  displayInjuryDetails(index);
}

function displayInjuryDetails(index) {
  const exercise = injuryGuide[index];
  const container = document.getElementById('injuryDetails');
  
  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <span style="font-size:3rem">${exercise.icon}</span>
      <h3 style="margin:0;color:var(--darker)">${exercise.exercise}</h3>
    </div>
    
    <!-- Common Injuries -->
    <div style="margin-bottom:24px">
      <h4 style="color:#d63031;margin-bottom:12px"><i class="fas fa-exclamation-triangle"></i> Common Injuries</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${exercise.commonInjuries.map(injury => `
          <span style="background:#ffeaa7;padding:6px 14px;border-radius:20px;font-size:0.85rem;font-weight:500">${injury}</span>
        `).join('')}
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <!-- Proper Form -->
      <div>
        <h4 style="color:#00b894;margin-bottom:12px"><i class="fas fa-check-circle"></i> Proper Form</h4>
        <ul style="list-style:none;padding:0">
          ${exercise.properForm.map(tip => `
            <li style="padding:8px 0;display:flex;align-items:center;gap:8px">
              <i class="fas fa-circle" style="font-size:0.4rem;color:#00b894"></i>
              ${tip}
            </li>
          `).join('')}
        </ul>
      </div>
      
      <!-- Do's -->
      <div>
        <h4 style="color:#00b894;margin-bottom:12px"><i class="fas fa-thumbs-up"></i> Do's</h4>
        <ul style="list-style:none;padding:0">
          ${exercise.dos.map(dos => `
            <li style="padding:8px 0;display:flex;align-items:center;gap:8px">
              <i class="fas fa-check" style="color:#00b894"></i>
              ${dos}
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
    
    <!-- Don'ts -->
    <div style="margin-top:20px">
      <h4 style="color:#d63031;margin-bottom:12px"><i class="fas fa-thumbs-down"></i> Don'ts</h4>
      <ul style="list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px">
        ${exercise.donts.map(dont => `
          <li style="padding:8px 0;display:flex;align-items:center;gap:8px">
            <i class="fas fa-times" style="color:#d63031"></i>
            ${dont}
          </li>
        `).join('')}
      </ul>
    </div>
    
    <!-- Navigation -->
    <div style="display:flex;justify-content:space-between;margin-top:24px;padding-top:20px;border-top:1px solid #e0e7ff">
      <button class="btn btn-outline" onclick="previousInjury()" ${index === 0 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <span style="color:#64748b">${index + 1} of ${injuryGuide.length}</span>
      <button class="btn btn-outline" onclick="nextInjury()" ${index === injuryGuide.length - 1 ? 'disabled' : ''}>
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `;
}

function previousInjury() {
  if (currentInjuryIndex > 0) {
    currentInjuryIndex--;
    document.getElementById('injuryExerciseSelect').value = currentInjuryIndex;
    displayInjuryDetails(currentInjuryIndex);
  }
}

function nextInjury() {
  if (currentInjuryIndex < injuryGuide.length - 1) {
    currentInjuryIndex++;
    document.getElementById('injuryExerciseSelect').value = currentInjuryIndex;
    displayInjuryDetails(currentInjuryIndex);
  }
}

console.log("✅ Injury Prevention Guide Loaded");