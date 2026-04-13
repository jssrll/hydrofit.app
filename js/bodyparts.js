// ========================================
// HYDROFIT - BODY PARTS FOCUS TRAINER
// ========================================

const exercisesByBodyPart = {
  legs: [
    { name: 'Squat', difficulty: 'Beginner', sets: 3, reps: '12-15' },
    { name: 'Jump Squat', difficulty: 'Intermediate', sets: 3, reps: '10-12' },
    { name: 'Bulgarian Split Squat', difficulty: 'Advanced', sets: 3, reps: '8-10 per leg' },
    { name: 'Lunges', difficulty: 'Beginner', sets: 3, reps: '10 per leg' },
    { name: 'Walking Lunges', difficulty: 'Intermediate', sets: 3, reps: '12 per leg' },
    { name: 'Leg Press', difficulty: 'Beginner', sets: 3, reps: '10-12' },
    { name: 'Leg Extension', difficulty: 'Beginner', sets: 3, reps: '12-15' },
    { name: 'Hamstring Curl', difficulty: 'Beginner', sets: 3, reps: '12-15' },
    { name: 'Deadlift', difficulty: 'Intermediate', sets: 3, reps: '8-10' },
    { name: 'Romanian Deadlift', difficulty: 'Intermediate', sets: 3, reps: '10-12' },
    { name: 'Calf Raises', difficulty: 'Beginner', sets: 4, reps: '15-20' },
    { name: 'Step-ups', difficulty: 'Beginner', sets: 3, reps: '10 per leg' }
  ],
  core: [
    { name: 'Plank', difficulty: 'Beginner', sets: 3, reps: '30-60 sec' },
    { name: 'Side Plank', difficulty: 'Beginner', sets: 3, reps: '30 sec per side' },
    { name: 'Crunches', difficulty: 'Beginner', sets: 3, reps: '15-20' },
    { name: 'Bicycle Crunch', difficulty: 'Intermediate', sets: 3, reps: '20 total' },
    { name: 'Leg Raises', difficulty: 'Beginner', sets: 3, reps: '12-15' },
    { name: 'Hanging Leg Raise', difficulty: 'Advanced', sets: 3, reps: '8-12' },
    { name: 'Russian Twist', difficulty: 'Intermediate', sets: 3, reps: '20 total' },
    { name: 'Mountain Climbers', difficulty: 'Intermediate', sets: 3, reps: '30 sec' },
    { name: 'Flutter Kicks', difficulty: 'Intermediate', sets: 3, reps: '30 sec' },
    { name: 'V-ups', difficulty: 'Advanced', sets: 3, reps: '10-12' },
    { name: 'Sit-ups', difficulty: 'Beginner', sets: 3, reps: '15-20' },
    { name: 'Dead Bug', difficulty: 'Beginner', sets: 3, reps: '10 per side' }
  ],
  arms: [
    { name: 'Push-ups', difficulty: 'Beginner', sets: 3, reps: '10-15' },
    { name: 'Diamond Push-ups', difficulty: 'Intermediate', sets: 3, reps: '8-12' },
    { name: 'Incline Push-ups', difficulty: 'Beginner', sets: 3, reps: '12-15' },
    { name: 'Pull-ups', difficulty: 'Advanced', sets: 3, reps: '5-8' },
    { name: 'Chin-ups', difficulty: 'Advanced', sets: 3, reps: '5-8' },
    { name: 'Bicep Curl', difficulty: 'Beginner', sets: 3, reps: '10-12' },
    { name: 'Hammer Curl', difficulty: 'Beginner', sets: 3, reps: '10-12' },
    { name: 'Concentration Curl', difficulty: 'Intermediate', sets: 3, reps: '10-12' },
    { name: 'Tricep Dips', difficulty: 'Beginner', sets: 3, reps: '10-12' },
    { name: 'Tricep Pushdown', difficulty: 'Beginner', sets: 3, reps: '12-15' },
    { name: 'Overhead Tricep Extension', difficulty: 'Intermediate', sets: 3, reps: '10-12' },
    { name: 'Close-grip Bench Press', difficulty: 'Intermediate', sets: 3, reps: '8-10' }
  ],
  fullbody: [
    { name: 'Burpees', difficulty: 'Intermediate', sets: 3, reps: '10-12' },
    { name: 'Jumping Jacks', difficulty: 'Beginner', sets: 3, reps: '30 sec' },
    { name: 'Mountain Climbers', difficulty: 'Intermediate', sets: 3, reps: '30 sec' },
    { name: 'Kettlebell Swing', difficulty: 'Intermediate', sets: 3, reps: '12-15' },
    { name: 'Thrusters', difficulty: 'Advanced', sets: 3, reps: '8-10' }
  ]
};

let selectedBodyPart = 'legs';
let selectedDifficulty = 'all';

function renderBodyParts() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20and%20White%20Modern%20Fitness%20YouTube%20Intro%20Video.png" alt="Body Parts Focus Trainer" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Body Part Selector -->
    <div class="card">
      <h3><i class="fas fa-person"></i> Select Target Area</h3>
      <div class="body-part-selector">
        <div class="part-option ${selectedBodyPart === 'legs' ? 'active' : ''}" onclick="selectBodyPart('legs')">
          <i class="fas fa-running"></i>
          <span>LEGS</span>
        </div>
        <div class="part-option ${selectedBodyPart === 'core' ? 'active' : ''}" onclick="selectBodyPart('core')">
          <i class="fas fa-circle"></i>
          <span>CORE</span>
        </div>
        <div class="part-option ${selectedBodyPart === 'arms' ? 'active' : ''}" onclick="selectBodyPart('arms')">
          <i class="fas fa-dumbbell"></i>
          <span>ARMS</span>
        </div>
        <div class="part-option ${selectedBodyPart === 'fullbody' ? 'active' : ''}" onclick="selectBodyPart('fullbody')">
          <i class="fas fa-star"></i>
          <span>FULL BODY</span>
        </div>
      </div>
    </div>

    <!-- Difficulty Filter -->
    <div class="card">
      <h3><i class="fas fa-filter"></i> Filter by Difficulty</h3>
      <div class="difficulty-filter">
        <button class="filter-btn ${selectedDifficulty === 'all' ? 'active' : ''}" onclick="filterByDifficulty('all')">
          All Levels
        </button>
        <button class="filter-btn ${selectedDifficulty === 'Beginner' ? 'active' : ''}" onclick="filterByDifficulty('Beginner')">
          Beginner
        </button>
        <button class="filter-btn ${selectedDifficulty === 'Intermediate' ? 'active' : ''}" onclick="filterByDifficulty('Intermediate')">
          Intermediate
        </button>
        <button class="filter-btn ${selectedDifficulty === 'Advanced' ? 'active' : ''}" onclick="filterByDifficulty('Advanced')">
          Advanced
        </button>
      </div>
    </div>

    <!-- Exercise List -->
    <div class="card">
      <h3><i class="fas fa-list"></i> Suggested Exercises</h3>
      <div id="exerciseList"></div>
    </div>

    <!-- Workout Tips -->
    <div class="card">
      <h3><i class="fas fa-lightbulb"></i> Workout Tips</h3>
      <ul class="tips-list">
        <li>Rest 60-90 seconds between sets</li>
        <li>Warm up for 5-10 minutes before starting</li>
        <li>Focus on proper form over weight</li>
        <li>Cool down and stretch after workout</li>
        ${selectedBodyPart === 'legs' ? '<li>Keep knees aligned with toes during squats and lunges</li>' : ''}
        ${selectedBodyPart === 'core' ? '<li>Breathe steadily and avoid holding your breath</li>' : ''}
        ${selectedBodyPart === 'arms' ? '<li>Control the negative (lowering) phase of each rep</li>' : ''}
      </ul>
    </div>
  `;
  
  updateExerciseList();
}

function selectBodyPart(part) {
  selectedBodyPart = part;
  
  document.querySelectorAll('.part-option').forEach(opt => {
    opt.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  updateExerciseList();
  renderBodyParts();
}

function filterByDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.currentTarget.classList.add('active');
  
  updateExerciseList();
}

function updateExerciseList() {
  const listContainer = document.getElementById('exerciseList');
  let exercises = exercisesByBodyPart[selectedBodyPart] || [];
  
  if (selectedDifficulty !== 'all') {
    exercises = exercises.filter(ex => ex.difficulty === selectedDifficulty);
  }
  
  if (exercises.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-dumbbell"></i>
        <p>No exercises match this filter</p>
        <p class="empty-hint">Try selecting a different difficulty level</p>
      </div>
    `;
    return;
  }
  
  let html = '<div class="exercise-table">';
  html += `
    <div class="table-header">
      <span>Exercise</span>
      <span>Difficulty</span>
      <span>Sets</span>
      <span>Reps</span>
    </div>
  `;
  
  exercises.forEach(ex => {
    const difficultyColor = ex.difficulty === 'Beginner' ? '#00b894' : 
                           ex.difficulty === 'Intermediate' ? '#fdcb6e' : '#e17055';
    
    html += `
      <div class="table-row">
        <span class="exercise-name">${ex.name}</span>
        <span class="difficulty-badge" style="background:${difficultyColor}20;color:${difficultyColor}">${ex.difficulty}</span>
        <span>${ex.sets}</span>
        <span>${ex.reps}</span>
      </div>
    `;
  });
  
  html += '</div>';
  listContainer.innerHTML = html;
}

console.log("✅ Body Parts Focus Trainer Loaded");