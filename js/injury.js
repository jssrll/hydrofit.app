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
    ]
  },
  {
    exercise: 'Arm Circles',
    commonInjuries: ['Shoulder impingement', 'Rotator cuff strain', 'Neck tension'],
    properForm: [
      'Arms extended at shoulder height',
      'Keep shoulders relaxed and down',
      'Maintain straight posture',
      'Controlled circular motion'
    ],
    dos: [
      'Start with small circles',
      'Keep core engaged',
      'Breathe steadily',
      'Reverse direction halfway'
    ],
    donts: [
      'Hunch shoulders up',
      'Make jerky movements',
      'Lock your elbows',
      'Hold your breath'
    ]
  },
  {
    exercise: 'High Knees',
    commonInjuries: ['Knee strain', 'Hip flexor tightness', 'Ankle sprains'],
    properForm: [
      'Lift knees to hip height',
      'Land on balls of feet',
      'Keep chest up and back straight',
      'Pump arms in rhythm'
    ],
    dos: [
      'Engage core throughout',
      'Maintain quick but controlled pace',
      'Land softly with each step',
      'Keep shoulders relaxed'
    ],
    donts: [
      'Lean back or slouch',
      'Stomp feet heavily',
      'Let knees collapse inward',
      'Hold tension in shoulders'
    ]
  },
  {
    exercise: 'Butt Kicks',
    commonInjuries: ['Hamstring strain', 'Knee hyperextension', 'Ankle sprains'],
    properForm: [
      'Kick heels toward glutes',
      'Keep thighs perpendicular to ground',
      'Maintain upright posture',
      'Quick, light steps'
    ],
    dos: [
      'Keep core engaged',
      'Land on balls of feet',
      'Maintain steady rhythm',
      'Stay relaxed in upper body'
    ],
    donts: [
      'Kick too hard or fast',
      'Lean forward excessively',
      'Lock knees when landing',
      'Hold breath during movement'
    ]
  },
  {
    exercise: 'Neck Rotation',
    commonInjuries: ['Neck strain', 'Cervical spine irritation', 'Tension headaches'],
    properForm: [
      'Sit or stand with spine straight',
      'Move slowly and controlled',
      'Keep shoulders relaxed and down',
      'Breathe deeply throughout'
    ],
    dos: [
      'Move within comfortable range',
      'Keep chin slightly tucked',
      'Stop if you feel pain',
      'Do equal rotations both directions'
    ],
    donts: [
      'Roll head backward forcefully',
      'Rush through movements',
      'Shrug shoulders up',
      'Hold your breath'
    ]
  },
  {
    exercise: 'Torso Twists',
    commonInjuries: ['Lower back strain', 'Spinal disc irritation', 'Oblique pulls'],
    properForm: [
      'Keep hips stable and facing forward',
      'Rotate from waist, not hips',
      'Maintain tall spine',
      'Move within comfortable range'
    ],
    dos: [
      'Engage core throughout',
      'Keep knees slightly bent',
      'Breathe out as you twist',
      'Keep movements controlled'
    ],
    donts: [
      'Force the rotation',
      'Move hips with torso',
      'Hold your breath',
      'Bounce at end range'
    ]
  },
  {
    exercise: 'Push-Ups',
    commonInjuries: ['Wrist strain', 'Shoulder impingement', 'Lower back pain'],
    properForm: [
      'Hands shoulder-width apart',
      'Body in straight line',
      'Elbows at 45-degree angle',
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
    ]
  },
  {
    exercise: 'Sit-Ups',
    commonInjuries: ['Lower back strain', 'Neck pain', 'Hip flexor tightness'],
    properForm: [
      'Knees bent, feet flat on floor',
      'Support head without pulling',
      'Curl up using abdominal muscles',
      'Keep lower back pressed to floor'
    ],
    dos: [
      'Exhale on the way up',
      'Keep chin off chest',
      'Move in controlled manner',
      'Engage core throughout'
    ],
    donts: [
      'Pull on neck with hands',
      'Use momentum to swing up',
      'Arch lower back off floor',
      'Hold breath during movement'
    ]
  },
  {
    exercise: 'Crunches',
    commonInjuries: ['Neck strain', 'Lower back discomfort', 'Abdominal muscle pulls'],
    properForm: [
      'Lie on back with knees bent',
      'Hands behind head for support',
      'Lift shoulders slightly off ground',
      'Keep lower back pressed down'
    ],
    dos: [
      'Focus on contracting abs',
      'Keep movements small and controlled',
      'Breathe out as you lift',
      'Keep neck relaxed'
    ],
    donts: [
      'Pull head forward with hands',
      'Lift entire back off floor',
      'Hold breath during crunch',
      'Tuck chin to chest'
    ]
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
    ]
  },
  {
    exercise: 'Lunges',
    commonInjuries: ['Knee instability', 'Hip flexor strain', 'Ankle sprains'],
    properForm: [
      'Step forward with control',
      'Front knee at 90 degrees',
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
    ]
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
      'Push through sharp pain'
    ]
  },
  {
    exercise: 'Wall Sit',
    commonInjuries: ['Knee strain', 'Lower back discomfort', 'Quadriceps fatigue'],
    properForm: [
      'Back flat against wall',
      'Knees at 90-degree angle',
      'Feet shoulder-width apart',
      'Weight in heels'
    ],
    dos: [
      'Keep core engaged',
      'Breathe steadily',
      'Start with shorter holds',
      'Keep shoulders relaxed'
    ],
    donts: [
      'Let knees extend past toes',
      'Hold breath during exercise',
      'Arch lower back off wall',
      'Slide down too low'
    ]
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
    ]
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
    ]
  },
  {
    exercise: 'Bench Press',
    commonInjuries: ['Shoulder impingement', 'Pectoral strain', 'Wrist pain'],
    properForm: [
      'Feet flat on floor',
      'Shoulder blades retracted',
      'Bar path to lower chest',
      'Elbows at 45-degree angle'
    ],
    dos: [
      'Keep wrists straight',
      'Control the descent',
      'Drive feet into floor',
      'Use spotter for heavy lifts'
    ],
    donts: [
      'Bounce bar off chest',
      'Flare elbows to 90 degrees',
      'Lift head off bench',
      'Hold breath during lift'
    ]
  },
  {
    exercise: 'Bicep Curl',
    commonInjuries: ['Elbow strain', 'Wrist pain', 'Shoulder impingement'],
    properForm: [
      'Elbows at sides',
      'Wrists straight',
      'Full range of motion',
      'Control both phases'
    ],
    dos: [
      'Keep shoulders back and down',
      'Squeeze biceps at top',
      'Lower with control',
      'Use appropriate weight'
    ],
    donts: [
      'Swing weights with momentum',
      'Let elbows drift forward',
      'Arch back to lift',
      'Lock elbows at bottom'
    ]
  },
  {
    exercise: 'Tricep Dip',
    commonInjuries: ['Shoulder impingement', 'Elbow strain', 'Wrist pain'],
    properForm: [
      'Hands shoulder-width apart',
      'Shoulders down and back',
      'Elbows point backward',
      'Controlled descent'
    ],
    dos: [
      'Keep chest up',
      'Lower to 90-degree elbow bend',
      'Keep shoulders away from ears',
      'Use assisted version if needed'
    ],
    donts: [
      'Drop below shoulder comfort',
      'Shrug shoulders up',
      'Lock elbows at top',
      'Rush through reps'
    ]
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
    ]
  }
];

function renderInjuryGuide() {
  const container = document.getElementById("tabContent");
  
  let options = '';
  injuryGuide.forEach((ex, i) => {
    options += `<option value="${i}" ${i === 0 ? 'selected' : ''}>${ex.exercise}</option>`;
  });
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Orange%20and%20Black%20Bold%20Start%20Training%20Today%20Banner%20Landscape.png" alt="Injury Prevention Guide" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Exercise Selector -->
    <div class="card exercise-selector-card">
      <h3><i class="fas fa-shield-heart"></i> Select Exercise</h3>
      <select id="injuryExerciseSelect" class="form-control" onchange="selectInjuryExercise()">
        ${options}
      </select>
    </div>

    <!-- Injury Information -->
    <div class="card injury-details-card" id="injuryDetails">
      <!-- Will be populated by JS -->
    </div>

    <!-- General Safety Tips -->
    <div class="card safety-tips-card">
      <h3><i class="fas fa-lightbulb"></i> General Safety Tips</h3>
      <div class="safety-tips-grid">
        <div class="tip-item">
          <i class="fas fa-temperature-high" style="color:#e17055;font-size:2rem"></i>
          <h4>Always Warm Up</h4>
          <p>5-10 minutes of light cardio and dynamic stretches before exercise</p>
        </div>
        <div class="tip-item">
          <i class="fas fa-droplet" style="color:#00b4d8;font-size:2rem"></i>
          <h4>Stay Hydrated</h4>
          <p>Drink water before, during, and after exercise</p>
        </div>
        <div class="tip-item">
          <i class="fas fa-ear-listen" style="color:#00b894;font-size:2rem"></i>
          <h4>Listen to Your Body</h4>
          <p>Stop if you feel sharp pain or discomfort</p>
        </div>
        <div class="tip-item">
          <i class="fas fa-arrow-trend-up" style="color:#fdcb6e;font-size:2rem"></i>
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
  displayInjuryDetails(index);
}

function displayInjuryDetails(index) {
  const exercise = injuryGuide[index];
  const container = document.getElementById('injuryDetails');
  
  container.innerHTML = `
    <div class="injury-header">
      <div class="injury-title-section">
        <h3 class="injury-title">${exercise.exercise}</h3>
        <p class="injury-subtitle">Proper form and injury prevention guide</p>
      </div>
    </div>
    
    <!-- Common Injuries -->
    <div class="common-injuries-section">
      <h4><i class="fas fa-exclamation-triangle"></i> Common Injuries</h4>
      <div class="injury-tags">
        ${exercise.commonInjuries.map(injury => `
          <span class="injury-tag">${injury}</span>
        `).join('')}
      </div>
    </div>
    
    <div class="injury-two-column">
      <!-- Proper Form -->
      <div class="proper-form-section">
        <h4><i class="fas fa-check-circle"></i> Proper Form</h4>
        <ul class="form-list">
          ${exercise.properForm.map(tip => `
            <li><i class="fas fa-circle"></i> ${tip}</li>
          `).join('')}
        </ul>
      </div>
      
      <!-- Do's -->
      <div class="dos-section">
        <h4><i class="fas fa-thumbs-up"></i> Do's</h4>
        <ul class="dos-list">
          ${exercise.dos.map(dos => `
            <li><i class="fas fa-check"></i> ${dos}</li>
          `).join('')}
        </ul>
      </div>
    </div>
    
    <!-- Don'ts -->
    <div class="donts-section">
      <h4><i class="fas fa-thumbs-down"></i> Don'ts</h4>
      <div class="donts-grid">
        ${exercise.donts.map(dont => `
          <div class="dont-item">
            <i class="fas fa-times"></i>
            <span>${dont}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

console.log("✅ Injury Prevention Guide Loaded");