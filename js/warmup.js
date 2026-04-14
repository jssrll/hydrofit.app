// ========================================
// HYDROFIT - WARM-UP & COOLDOWN GENERATOR
// ========================================

let currentWarmupIndex = 0;
let currentCooldownIndex = 0;
let warmupTimer = null;
let cooldownTimer = null;
let warmupSeconds = 0;
let cooldownSeconds = 0;
let warmupRunning = false;
let cooldownRunning = false;

const warmupExercises = {
  cardio: [
    { name: 'Jumping Jacks', duration: 30, instructions: 'Stand with feet together, jump while spreading legs and raising arms' },
    { name: 'High Knees', duration: 30, instructions: 'Run in place lifting knees to hip height' },
    { name: 'Butt Kicks', duration: 30, instructions: 'Run in place kicking heels toward glutes' },
    { name: 'Arm Circles Forward', duration: 20, instructions: 'Extend arms, make small circles forward' },
    { name: 'Arm Circles Backward', duration: 20, instructions: 'Reverse direction, circles backward' },
    { name: 'Torso Twists', duration: 30, instructions: 'Rotate torso left and right, keep hips stable' },
    { name: 'Leg Swings Forward', duration: 20, instructions: 'Swing one leg forward and back, hold support' },
    { name: 'Leg Swings Side', duration: 20, instructions: 'Swing leg side to side across body' }
  ],
  strength: [
    { name: 'Light Jogging', duration: 60, instructions: 'Slow jog to increase heart rate' },
    { name: 'Arm Circles', duration: 30, instructions: 'Forward and backward circles' },
    { name: 'Bodyweight Squats', duration: 30, instructions: 'Slow controlled squats, no weight' },
    { name: 'Cat-Cow Stretch', duration: 30, instructions: 'On all fours, alternate arching and rounding back' },
    { name: 'Hip Circles', duration: 30, instructions: 'Hands on hips, make circles with hips' },
    { name: 'Shoulder Rotations', duration: 30, instructions: 'Roll shoulders forward then backward' },
    { name: 'Walking Lunges', duration: 40, instructions: 'Step forward into lunge, alternate legs' },
    { name: 'Inchworms', duration: 40, instructions: 'Walk hands out to plank, walk feet to hands' }
  ],
  flexibility: [
    { name: 'Neck Rolls', duration: 30, instructions: 'Slowly roll head in circles, both directions' },
    { name: 'Shoulder Shrugs', duration: 20, instructions: 'Lift shoulders to ears, hold, release' },
    { name: 'Standing Side Bend', duration: 30, instructions: 'Reach arm overhead, bend to opposite side' },
    { name: 'Forward Fold', duration: 40, instructions: 'Bend at hips, let arms hang toward floor' },
    { name: 'Quad Stretch', duration: 30, instructions: 'Pull heel toward glutes, hold support' },
    { name: 'Butterfly Stretch', duration: 40, instructions: 'Sit, soles together, gently press knees down' },
    { name: 'Spinal Twist', duration: 30, instructions: 'Sit, twist torso, place hand behind for support' },
    { name: 'Childs Pose', duration: 40, instructions: 'Kneel, sit back on heels, reach arms forward' }
  ],
  hiit: [
    { name: 'Light Jogging', duration: 45, instructions: 'Easy pace to warm up muscles' },
    { name: 'Jumping Jacks', duration: 30, instructions: 'Full range of motion, controlled pace' },
    { name: 'High Knees', duration: 30, instructions: 'Quick tempo, pump arms' },
    { name: 'Mountain Climbers', duration: 30, instructions: 'Slow controlled pace for warm-up' },
    { name: 'Leg Swings', duration: 30, instructions: 'Forward/back and side to side' },
    { name: 'Arm Swings', duration: 20, instructions: 'Swing arms across chest and open wide' },
    { name: 'Squat to Stand', duration: 40, instructions: 'Squat down, reach up, stand and stretch' },
    { name: 'Burpee Warm-up', duration: 30, instructions: 'Slow burpees without jump, focus on form' }
  ]
};

const cooldownExercises = {
  cardio: [
    { name: 'Light Walking', duration: 60, instructions: 'Slow walk to bring heart rate down' },
    { name: 'Standing Quad Stretch', duration: 30, instructions: 'Hold each leg for 15 seconds' },
    { name: 'Hamstring Stretch', duration: 40, instructions: 'Reach toward toes, keep back straight' },
    { name: 'Calf Stretch', duration: 30, instructions: 'Step back, press heel into ground' },
    { name: 'Chest Opener', duration: 30, instructions: 'Clasp hands behind back, open chest' },
    { name: 'Side Stretch', duration: 30, instructions: 'Reach arm overhead, stretch each side' }
  ],
  strength: [
    { name: 'Slow Walking', duration: 60, instructions: 'Gradually decrease pace' },
    { name: 'Chest Stretch', duration: 30, instructions: 'Hold doorway or wall, stretch chest' },
    { name: 'Lat Stretch', duration: 30, instructions: 'Reach arms forward, round upper back' },
    { name: 'Pigeon Pose', duration: 40, instructions: 'One leg bent in front, extend back leg' },
    { name: 'Downward Dog', duration: 40, instructions: 'Hips up, heels toward ground' },
    { name: 'Deep Breathing', duration: 60, instructions: 'Inhale 4 seconds, exhale 6 seconds' }
  ],
  flexibility: [
    { name: 'Deep Breathing', duration: 60, instructions: 'Focus on slow deep breaths' },
    { name: 'Seated Forward Fold', duration: 40, instructions: 'Reach toward toes, relax into stretch' },
    { name: 'Happy Baby Pose', duration: 40, instructions: 'Lie on back, grab feet, gently rock' },
    { name: 'Supine Twist', duration: 40, instructions: 'Lie on back, drop knees to one side' },
    { name: 'Savasana', duration: 60, instructions: 'Lie flat, palms up, completely relax' }
  ],
  hiit: [
    { name: 'Slow Walking', duration: 90, instructions: 'Walk slowly, focus on breathing' },
    { name: 'Standing Forward Fold', duration: 40, instructions: 'Let upper body hang heavy' },
    { name: 'Quad Stretch', duration: 30, instructions: 'Hold each leg, keep knees together' },
    { name: 'Figure Four Stretch', duration: 40, instructions: 'Ankle over opposite knee, sit back' },
    { name: 'Childs Pose', duration: 50, instructions: 'Rest forehead on ground, breathe deeply' },
    { name: 'Deep Breathing', duration: 60, instructions: 'Slow inhale, longer exhale' }
  ]
};

function renderWarmup() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/Orange%20Black%20and%20White%20Neon%20Gradient%20Geometric%20Shape%20Modern%20Bold%20Running%20Club%20Sport%20Presentation.png" alt="Warm-up Generator" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Activity Selector -->
    <div class="card">
      <h3><i class="fas fa-fire"></i> Select Activity Type</h3>
      <p style="color:#64748b;margin-bottom:20px">Choose your workout type to generate the perfect warm-up and cooldown</p>
      
      <div class="activity-selector">
        <div class="activity-option" onclick="selectActivity('cardio')" id="activity-cardio">
          <i class="fas fa-heart"></i>
          <span>Cardio</span>
          <small>Running, Cycling, HIIT</small>
        </div>
        <div class="activity-option" onclick="selectActivity('strength')" id="activity-strength">
          <i class="fas fa-dumbbell"></i>
          <span>Strength</span>
          <small>Weight Training</small>
        </div>
        <div class="activity-option" onclick="selectActivity('flexibility')" id="activity-flexibility">
          <i class="fas fa-person-walking"></i>
          <span>Flexibility</span>
          <small>Yoga, Stretching</small>
        </div>
        <div class="activity-option" onclick="selectActivity('hiit')" id="activity-hiit">
          <i class="fas fa-bolt"></i>
          <span>HIIT</span>
          <small>High Intensity</small>
        </div>
      </div>
    </div>

    <!-- Warm-up Section -->
    <div class="card warmup-card" id="warmupSection" style="display:none">
      <div class="section-header-with-icon">
        <div>
          <h3><i class="fas fa-temperature-high" style="color:#e17055"></i> Warm-up Routine</h3>
          <p style="color:#64748b">Prepare your body for exercise</p>
        </div>
        <div class="total-time">
          <i class="fas fa-clock"></i>
          <span id="warmupTotalTime">0:00</span>
        </div>
      </div>
      
      <div class="current-exercise" id="warmupCurrent">
        <div class="exercise-display">
          <div class="exercise-number">Exercise 1</div>
          <h2 id="warmupName">Select an activity</h2>
          <p id="warmupInstructions">Choose an activity type above to generate your warm-up</p>
        </div>
        <div class="timer-display" id="warmupTimer">00:00</div>
      </div>
      
      <div class="exercise-list-container">
        <h4>Warm-up Exercises</h4>
        <div class="exercise-list" id="warmupList"></div>
      </div>
      
      <div class="timer-controls">
        <button class="timer-control-btn btn-success" id="warmupStartBtn" onclick="startWarmupTimer()">
          <i class="fas fa-play"></i> Start Warm-up
        </button>
        <button class="timer-control-btn btn-warning" id="warmupPauseBtn" onclick="pauseWarmupTimer()" style="display:none">
          <i class="fas fa-pause"></i> Pause
        </button>
        <button class="timer-control-btn btn-danger" onclick="resetWarmupTimer()">
          <i class="fas fa-undo-alt"></i> Reset
        </button>
      </div>
    </div>

    <!-- Cooldown Section -->
    <div class="card cooldown-card" id="cooldownSection" style="display:none">
      <div class="section-header-with-icon">
        <div>
          <h3><i class="fas fa-temperature-low" style="color:#00b4d8"></i> Cooldown Routine</h3>
          <p style="color:#64748b">Gradually bring heart rate down</p>
        </div>
        <div class="total-time">
          <i class="fas fa-clock"></i>
          <span id="cooldownTotalTime">0:00</span>
        </div>
      </div>
      
      <div class="current-exercise" id="cooldownCurrent">
        <div class="exercise-display">
          <div class="exercise-number">Exercise 1</div>
          <h2 id="cooldownName">Select an activity</h2>
          <p id="cooldownInstructions">Choose an activity type above to generate your cooldown</p>
        </div>
        <div class="timer-display" id="cooldownTimer">00:00</div>
      </div>
      
      <div class="exercise-list-container">
        <h4>Cooldown Exercises</h4>
        <div class="exercise-list" id="cooldownList"></div>
      </div>
      
      <div class="timer-controls">
        <button class="timer-control-btn btn-success" id="cooldownStartBtn" onclick="startCooldownTimer()">
          <i class="fas fa-play"></i> Start Cooldown
        </button>
        <button class="timer-control-btn btn-warning" id="cooldownPauseBtn" onclick="pauseCooldownTimer()" style="display:none">
          <i class="fas fa-pause"></i> Pause
        </button>
        <button class="timer-control-btn btn-danger" onclick="resetCooldownTimer()">
          <i class="fas fa-undo-alt"></i> Reset
        </button>
      </div>
    </div>

    <!-- Tips Card -->
    <div class="card tips-card">
      <h3><i class="fas fa-lightbulb"></i> Why Warm-up & Cooldown?</h3>
      <div class="benefits-grid">
        <div class="benefit-item">
          <i class="fas fa-shield-heart"></i>
          <h4>Prevents Injury</h4>
          <p>Prepares muscles and joints for exercise</p>
        </div>
        <div class="benefit-item">
          <i class="fas fa-heart"></i>
          <h4>Improves Performance</h4>
          <p>Increases blood flow and oxygen to muscles</p>
        </div>
        <div class="benefit-item">
          <i class="fas fa-droplet"></i>
          <h4>Reduces Soreness</h4>
          <p>Helps remove lactic acid after workout</p>
        </div>
        <div class="benefit-item">
          <i class="fas fa-brain"></i>
          <h4>Mental Preparation</h4>
          <p>Focuses mind for the workout ahead</p>
        </div>
      </div>
    </div>
  `;
}

function selectActivity(type) {
  // Update UI
  document.querySelectorAll('.activity-option').forEach(opt => {
    opt.classList.remove('active');
  });
  document.getElementById(`activity-${type}`).classList.add('active');
  
  // Show sections
  document.getElementById('warmupSection').style.display = 'block';
  document.getElementById('cooldownSection').style.display = 'block';
  
  // Reset timers
  resetWarmupTimer();
  resetCooldownTimer();
  
  // Generate warmup
  const warmup = warmupExercises[type];
  currentWarmupIndex = 0;
  displayWarmupExercise(warmup[0], 0, warmup.length);
  displayWarmupList(warmup);
  
  // Generate cooldown
  const cooldown = cooldownExercises[type];
  currentCooldownIndex = 0;
  displayCooldownExercise(cooldown[0], 0, cooldown.length);
  displayCooldownList(cooldown);
  
  // Scroll to warmup
  document.getElementById('warmupSection').scrollIntoView({ behavior: 'smooth' });
}

function displayWarmupExercise(exercise, index, total) {
  document.getElementById('warmupName').innerText = exercise.name;
  document.getElementById('warmupInstructions').innerText = exercise.instructions;
  document.querySelector('#warmupCurrent .exercise-number').innerText = `Exercise ${index + 1} of ${total}`;
  
  warmupSeconds = exercise.duration;
  updateWarmupTimerDisplay();
}

function displayWarmupList(exercises) {
  const listDiv = document.getElementById('warmupList');
  let totalTime = 0;
  
  let html = '';
  exercises.forEach((ex, i) => {
    totalTime += ex.duration;
    html += `
      <div class="list-item ${i === 0 ? 'active' : ''}" id="warmupItem${i}">
        <span class="list-number">${i + 1}</span>
        <span class="list-name">${ex.name}</span>
        <span class="list-duration">${ex.duration}s</span>
      </div>
    `;
  });
  
  listDiv.innerHTML = html;
  
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  document.getElementById('warmupTotalTime').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function displayCooldownExercise(exercise, index, total) {
  document.getElementById('cooldownName').innerText = exercise.name;
  document.getElementById('cooldownInstructions').innerText = exercise.instructions;
  document.querySelector('#cooldownCurrent .exercise-number').innerText = `Exercise ${index + 1} of ${total}`;
  
  cooldownSeconds = exercise.duration;
  updateCooldownTimerDisplay();
}

function displayCooldownList(exercises) {
  const listDiv = document.getElementById('cooldownList');
  let totalTime = 0;
  
  let html = '';
  exercises.forEach((ex, i) => {
    totalTime += ex.duration;
    html += `
      <div class="list-item ${i === 0 ? 'active' : ''}" id="cooldownItem${i}">
        <span class="list-number">${i + 1}</span>
        <span class="list-name">${ex.name}</span>
        <span class="list-duration">${ex.duration}s</span>
      </div>
    `;
  });
  
  listDiv.innerHTML = html;
  
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  document.getElementById('cooldownTotalTime').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Warm-up Timer Functions
function startWarmupTimer() {
  if (warmupRunning) return;
  
  const activity = getSelectedActivity();
  if (!activity) {
    showToast('Please select an activity type first', true);
    return;
  }
  
  warmupRunning = true;
  document.getElementById('warmupStartBtn').style.display = 'none';
  document.getElementById('warmupPauseBtn').style.display = 'inline-block';
  
  warmupTimer = setInterval(() => {
    if (warmupSeconds > 0) {
      warmupSeconds--;
      updateWarmupTimerDisplay();
    } else {
      // Move to next exercise
      const exercises = warmupExercises[activity];
      currentWarmupIndex++;
      
      if (currentWarmupIndex < exercises.length) {
        displayWarmupExercise(exercises[currentWarmupIndex], currentWarmupIndex, exercises.length);
        updateWarmupListActive();
      } else {
        // Warm-up complete
        pauseWarmupTimer();
        showToast('Warm-up complete! Ready for your workout! 🎉', false);
        playCompletionSound();
      }
    }
  }, 1000);
}

function pauseWarmupTimer() {
  warmupRunning = false;
  clearInterval(warmupTimer);
  document.getElementById('warmupStartBtn').style.display = 'inline-block';
  document.getElementById('warmupPauseBtn').style.display = 'none';
}

function resetWarmupTimer() {
  pauseWarmupTimer();
  const activity = getSelectedActivity();
  if (activity) {
    const exercises = warmupExercises[activity];
    currentWarmupIndex = 0;
    displayWarmupExercise(exercises[0], 0, exercises.length);
    updateWarmupListActive();
  }
}

function updateWarmupTimerDisplay() {
  const minutes = Math.floor(warmupSeconds / 60);
  const seconds = warmupSeconds % 60;
  document.getElementById('warmupTimer').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateWarmupListActive() {
  const activity = getSelectedActivity();
  if (!activity) return;
  
  const exercises = warmupExercises[activity];
  for (let i = 0; i < exercises.length; i++) {
    const item = document.getElementById(`warmupItem${i}`);
    if (item) {
      item.classList.toggle('active', i === currentWarmupIndex);
      item.classList.toggle('completed', i < currentWarmupIndex);
    }
  }
}

// Cooldown Timer Functions
function startCooldownTimer() {
  if (cooldownRunning) return;
  
  const activity = getSelectedActivity();
  if (!activity) {
    showToast('Please select an activity type first', true);
    return;
  }
  
  cooldownRunning = true;
  document.getElementById('cooldownStartBtn').style.display = 'none';
  document.getElementById('cooldownPauseBtn').style.display = 'inline-block';
  
  cooldownTimer = setInterval(() => {
    if (cooldownSeconds > 0) {
      cooldownSeconds--;
      updateCooldownTimerDisplay();
    } else {
      const exercises = cooldownExercises[activity];
      currentCooldownIndex++;
      
      if (currentCooldownIndex < exercises.length) {
        displayCooldownExercise(exercises[currentCooldownIndex], currentCooldownIndex, exercises.length);
        updateCooldownListActive();
      } else {
        pauseCooldownTimer();
        showToast('Cooldown complete! Great job! 🎉', false);
        playCompletionSound();
      }
    }
  }, 1000);
}

function pauseCooldownTimer() {
  cooldownRunning = false;
  clearInterval(cooldownTimer);
  document.getElementById('cooldownStartBtn').style.display = 'inline-block';
  document.getElementById('cooldownPauseBtn').style.display = 'none';
}

function resetCooldownTimer() {
  pauseCooldownTimer();
  const activity = getSelectedActivity();
  if (activity) {
    const exercises = cooldownExercises[activity];
    currentCooldownIndex = 0;
    displayCooldownExercise(exercises[0], 0, exercises.length);
    updateCooldownListActive();
  }
}

function updateCooldownTimerDisplay() {
  const minutes = Math.floor(cooldownSeconds / 60);
  const seconds = cooldownSeconds % 60;
  document.getElementById('cooldownTimer').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateCooldownListActive() {
  const activity = getSelectedActivity();
  if (!activity) return;
  
  const exercises = cooldownExercises[activity];
  for (let i = 0; i < exercises.length; i++) {
    const item = document.getElementById(`cooldownItem${i}`);
    if (item) {
      item.classList.toggle('active', i === currentCooldownIndex);
      item.classList.toggle('completed', i < currentCooldownIndex);
    }
  }
}

function getSelectedActivity() {
  const active = document.querySelector('.activity-option.active');
  if (!active) return null;
  return active.id.replace('activity-', '');
}

function playCompletionSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    console.log('Sound not supported');
  }
}

console.log("✅ Warm-up & Cooldown Generator Loaded");