// ========================================
// HYDROFIT - MOVEMENT DEMO LIBRARY
// ========================================

const exerciseLibrary = [
  { name: 'Jumping Jacks', videoId: 'c4DAnQ6DtF8', instructions: 'Stand with feet together, arms at sides. Jump while spreading legs and raising arms overhead. Return to start. Repeat for desired reps.' },
  { name: 'Arm Circles', videoId: '140RTNMciH8', instructions: 'Extend arms out to sides at shoulder height. Make small circles forward for 30 seconds, then reverse direction. Keep arms straight.' },
  { name: 'High Knees', videoId: 'oDdkytliOqE', instructions: 'Run in place while lifting knees as high as possible toward chest. Pump arms and maintain quick pace. Keep core engaged.' },
  { name: 'Butt Kicks', videoId: 'e0mKtC9A8iA', instructions: 'Run in place while kicking heels up toward glutes. Keep upper body steady and pump arms. Maintain quick rhythm.' },
  { name: 'Neck Rotation', videoId: '2NOEzxAMl6I', instructions: 'Stand or sit with spine straight. Slowly rotate head in circular motion. Do 5 rotations each direction. Keep shoulders relaxed.' },
  { name: 'Torso Twists', videoId: 'ZMRUxMOc4Eo', instructions: 'Stand with feet shoulder-width apart. Rotate torso left and right while keeping hips stable. Arms can be crossed over chest or extended.' },
  { name: 'Push-Ups', videoId: 'IODxDxX7oi4', instructions: 'Start in plank position with hands shoulder-width apart. Lower body until chest nearly touches ground. Push back up. Keep body straight.' },
  { name: 'Sit-Ups', videoId: 'jDwoBqPH0jk', instructions: 'Lie on back with knees bent and feet flat. Place hands behind head. Lift upper body toward knees. Lower back down with control.' },
  { name: 'Crunches', videoId: 'Xyd_fa5zoEU', instructions: 'Lie on back with knees bent. Place hands behind head. Lift shoulders off ground using abs. Hold briefly, then lower. Keep neck relaxed.' },
  { name: 'Squats', videoId: 'aclHkVaku9U', instructions: 'Stand with feet shoulder-width apart. Lower hips back and down as if sitting. Keep chest up and knees behind toes. Return to standing.' },
  { name: 'Lunges', videoId: 'QOVaHwm-Q6w', instructions: 'Step forward with one leg. Lower hips until both knees bent at 90°. Front knee over ankle, back knee near ground. Push back to start.' },
  { name: 'Plank', videoId: 'pSHjTRCQxIw', instructions: 'Hold push-up position with body in straight line from head to heels. Engage core and glutes. Hold for desired time without sagging.' },
  { name: 'Wall Sit', videoId: 'y-wV4Venusw', instructions: 'Stand with back against wall. Slide down until knees bent at 90°. Hold position keeping back flat against wall. Engage core.' },
  { name: 'Burpees', videoId: 'TU8QYVW0gDU', instructions: 'Start standing. Drop to squat, kick feet back to plank. Do push-up. Jump feet forward and explode up into jump. Land softly and repeat.' },
  { name: 'Deadlift', videoId: 'ytGaGQ3zNRY', instructions: 'Stand with feet hip-width apart. Hinge at hips, keeping back straight. Lower weight along shins. Drive through heels to stand up. Squeeze glutes at top.' },
  { name: 'Bench Press', videoId: 'rT7DgCr-3pg', instructions: 'Lie on bench with feet flat. Grip bar slightly wider than shoulders. Lower bar to chest, then press up. Keep elbows at 45° angle.' },
  { name: 'Bicep Curl', videoId: 'ykJmrZ5v0Oo', instructions: 'Stand holding weights at sides, palms forward. Curl weights toward shoulders keeping elbows stationary. Squeeze biceps at top. Lower with control.' },
  { name: 'Tricep Dip', videoId: '0326dy_-CzM', instructions: 'Sit on edge of bench, hands beside hips. Slide forward, lower body by bending elbows to 90°. Push back up. Keep shoulders down.' },
  { name: 'Running', videoId: 'k0Q1Qe7h6tY', instructions: 'Maintain upright posture with slight forward lean. Land midfoot, keep cadence quick. Arms swing front to back, not across body. Breathe rhythmically.' }
];

let currentVideoIndex = 0;

function renderMovementLibrary() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Movement Library" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Featured Video -->
    <div class="card">
      <h3><i class="fas fa-play-circle"></i> Featured Exercise</h3>
      <div id="featuredVideo"></div>
    </div>

    <!-- Exercise Grid -->
    <div class="card">
      <h3><i class="fas fa-dumbbell"></i> Exercise Library</h3>
      <div class="exercise-search">
        <input type="text" id="exerciseSearch" class="form-control" placeholder="Search exercises..." oninput="filterExercises()">
      </div>
      <div class="exercise-grid" id="exerciseGrid"></div>
    </div>

    <!-- Instructions Modal -->
    <div id="instructionModal" class="modal" style="display:none">
      <div class="modal-content" style="max-width:550px">
        <div class="modal-header">
          <i class="fas fa-info-circle" style="font-size:2.5rem"></i>
          <h3 id="modalExerciseName">Exercise Name</h3>
        </div>
        <div class="modal-body">
          <div id="modalVideoContainer"></div>
          <div class="modal-instructions">
            <p id="modalInstructions"></p>
          </div>
          <button class="modal-btn" onclick="closeInstructionModal()">Close</button>
        </div>
      </div>
    </div>
  `;
  
  displayFeaturedExercise(0);
  displayExerciseGrid();
}

function displayFeaturedExercise(index) {
  const exercise = exerciseLibrary[index];
  const container = document.getElementById('featuredVideo');
  
  container.innerHTML = `
    <div class="featured-video-container">
      <iframe 
        src="https://www.youtube.com/embed/${exercise.videoId}?rel=0&modestbranding=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
    <h4 class="featured-video-title">${exercise.name}</h4>
    <p class="featured-video-description">${exercise.instructions}</p>
    <div class="featured-video-controls">
      <button class="btn btn-outline" onclick="previousExercise()" ${index === 0 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      <button class="btn btn-outline" onclick="nextExercise()" ${index === exerciseLibrary.length - 1 ? 'disabled' : ''}>
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `;
  
  currentVideoIndex = index;
}

function nextExercise() {
  if (currentVideoIndex < exerciseLibrary.length - 1) {
    displayFeaturedExercise(currentVideoIndex + 1);
  }
}

function previousExercise() {
  if (currentVideoIndex > 0) {
    displayFeaturedExercise(currentVideoIndex - 1);
  }
}

function displayExerciseGrid() {
  const grid = document.getElementById('exerciseGrid');
  
  let html = '';
  exerciseLibrary.forEach(ex => {
    html += `
      <div class="exercise-card" onclick="showExerciseDetails('${ex.name}')">
        <div class="exercise-thumbnail">
          <img src="https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg" alt="${ex.name}" loading="lazy" onerror="this.src='https://ik.imagekit.io/0sf7uub8b/HydroFit/exercise-placeholder.jpg'">
          <div class="play-overlay">
            <i class="fas fa-play"></i>
          </div>
        </div>
        <div class="exercise-info">
          <h4>${ex.name}</h4>
          <p>${ex.instructions.substring(0, 50)}...</p>
        </div>
      </div>
    `;
  });
  
  grid.innerHTML = html;
}

function filterExercises() {
  const searchTerm = document.getElementById('exerciseSearch').value.toLowerCase();
  const grid = document.getElementById('exerciseGrid');
  
  const filtered = exerciseLibrary.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm) || 
    ex.instructions.toLowerCase().includes(searchTerm)
  );
  
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <i class="fas fa-search"></i>
        <p>No exercises found</p>
      </div>
    `;
    return;
  }
  
  let html = '';
  filtered.forEach(ex => {
    html += `
      <div class="exercise-card" onclick="showExerciseDetails('${ex.name}')">
        <div class="exercise-thumbnail">
          <img src="https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg" alt="${ex.name}" loading="lazy" onerror="this.src='https://ik.imagekit.io/0sf7uub8b/HydroFit/exercise-placeholder.jpg'">
          <div class="play-overlay">
            <i class="fas fa-play"></i>
          </div>
        </div>
        <div class="exercise-info">
          <h4>${ex.name}</h4>
          <p>${ex.instructions.substring(0, 50)}...</p>
        </div>
      </div>
    `;
  });
  
  grid.innerHTML = html;
}

function showExerciseDetails(exerciseName) {
  const exercise = exerciseLibrary.find(ex => ex.name === exerciseName);
  if (!exercise) return;
  
  document.getElementById('modalExerciseName').innerText = exercise.name;
  document.getElementById('modalVideoContainer').innerHTML = `
    <div class="modal-video-container">
      <iframe 
        src="https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&rel=0&modestbranding=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `;
  document.getElementById('modalInstructions').innerText = exercise.instructions;
  document.getElementById('instructionModal').style.display = 'flex';
}

function closeInstructionModal() {
  document.getElementById('instructionModal').style.display = 'none';
  document.getElementById('modalVideoContainer').innerHTML = '';
}

console.log("✅ Movement Library Loaded");