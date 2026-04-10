// ========================================
// HYDROFIT - MOVEMENT DEMO LIBRARY
// ========================================

const exerciseLibrary = [
  { name: 'Jumping Jacks', videoId: 'c4DAnQ6DtF8', instructions: 'Stand with feet together, arms at sides. Jump while spreading legs and raising arms overhead. Return to start.' },
  { name: 'Push-Ups', videoId: 'IODxDxX7oi4', instructions: 'Start in plank position. Lower body until chest nearly touches ground. Push back up.' },
  { name: 'Squats', videoId: 'aclHkVaku9U', instructions: 'Stand with feet shoulder-width apart. Lower hips back and down. Keep chest up. Return to standing.' },
  { name: 'Lunges', videoId: 'QOVaHwm-Q6w', instructions: 'Step forward with one leg. Lower hips until both knees bent at 90°. Push back to start.' },
  { name: 'Plank', videoId: 'pSHjTRCQxIw', instructions: 'Hold push-up position with body in straight line. Engage core. Hold for desired time.' },
  { name: 'Burpees', videoId: 'TU8QYVW0gDU', instructions: 'Start standing. Drop to squat, kick feet back to plank. Do push-up. Jump feet forward and leap up.' },
  { name: 'High Knees', videoId: 'oDdkytliOqE', instructions: 'Run in place while lifting knees as high as possible. Pump arms.' },
  { name: 'Mountain Climbers', videoId: 'nmwgirgXLYM', instructions: 'In plank position, alternate bringing knees toward chest quickly.' },
  { name: 'Crunches', videoId: 'Xyd_fa5zoEU', instructions: 'Lie on back, knees bent. Lift shoulders off ground using abs. Lower back down.' },
  { name: 'Jump Rope', videoId: 'u3zgHI8QnqE', instructions: 'Hold rope handles. Swing rope and jump with both feet. Keep rhythm steady.' },
  { name: 'Arm Circles', videoId: '140RTNMciH8', instructions: 'Extend arms to sides. Make small circles forward, then backward.' },
  { name: 'Butt Kicks', videoId: 'e0mKtC9A8iA', instructions: 'Run in place while kicking heels up toward glutes.' }
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
      <div id="featuredVideo">
        <!-- Will be populated by JS -->
      </div>
    </div>

    <!-- Exercise Grid -->
    <div class="card">
      <h3><i class="fas fa-dumbbell"></i> Exercise Library</h3>
      <div class="exercise-search">
        <input type="text" id="exerciseSearch" class="form-control" placeholder="Search exercises..." oninput="filterExercises()">
      </div>
      <div class="exercise-grid" id="exerciseGrid">
        <!-- Will be populated by JS -->
      </div>
    </div>

    <!-- Instructions Modal -->
    <div id="instructionModal" class="modal" style="display:none">
      <div class="modal-content" style="max-width:500px">
        <div class="modal-header">
          <i class="fas fa-info-circle" style="font-size:2rem"></i>
          <h3 id="modalExerciseName">Exercise Name</h3>
        </div>
        <div class="modal-body">
          <div id="modalVideoContainer"></div>
          <p id="modalInstructions" style="margin-top:16px;line-height:1.6"></p>
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
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:16px;margin-bottom:16px">
      <iframe 
        src="https://www.youtube.com/embed/${exercise.videoId}?rel=0&modestbranding=1" 
        style="position:absolute;top:0;left:0;width:100%;height:100%" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
    <h4 style="margin-bottom:8px;color:#1a1a1a">${exercise.name}</h4>
    <p style="color:#64748b;margin-bottom:16px">${exercise.instructions}</p>
    <div style="display:flex;gap:8px">
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
          <img src="https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg" alt="${ex.name}">
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
  
  let html = '';
  filtered.forEach(ex => {
    html += `
      <div class="exercise-card" onclick="showExerciseDetails('${ex.name}')">
        <div class="exercise-thumbnail">
          <img src="https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg" alt="${ex.name}">
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
  
  grid.innerHTML = html || '<p style="text-align:center;padding:40px;color:#64748b">No exercises found</p>';
}

function showExerciseDetails(exerciseName) {
  const exercise = exerciseLibrary.find(ex => ex.name === exerciseName);
  if (!exercise) return;
  
  document.getElementById('modalExerciseName').innerText = exercise.name;
  document.getElementById('modalVideoContainer').innerHTML = `
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px">
      <iframe 
        src="https://www.youtube.com/embed/${exercise.videoId}?autoplay=1&rel=0&modestbranding=1" 
        style="position:absolute;top:0;left:0;width:100%;height:100%" 
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