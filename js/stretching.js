// ========================================
// HYDROFIT - STRETCHING EXERCISES LIBRARY
// ========================================

const stretchingRoutines = [
  {
    id: 'general-back-pain',
    title: 'General Back Pain Relief',
    description: 'This routine focuses on relieving general back pain and protecting spinal health. It also improves muscles flexibility and helps you move better. You can do this after a sedentary workday, after any kind of workout, in the morning or before you go to bed.',
    duration: '9 MINS',
    exercises: 20,
    exercisesList: [
      { name: 'Overhead Arm Clockwise Circles', duration: '00:20' },
      { name: 'Overhead Arm Counterclockwise Circles', duration: '00:20' },
      { name: 'Shoulder Outward Rotation', duration: '00:30' },
      { name: 'Side-to-Side Turns', duration: '00:20' },
      { name: 'Side-to-Side Tilts', duration: '00:20' },
      { name: 'Up & Down Nods', duration: '00:20' },
      { name: 'Cat Cow Pose', duration: '00:30' },
      { name: 'Thoracic Spine Cat Cow', duration: '00:30' },
      { name: 'Lumbar Cat Cow', duration: '00:30' },
      { name: 'Cobra Stretch', duration: '00:20' },
      { name: 'Child\'s Pose', duration: '00:30' },
      { name: 'The No-Gap', duration: '00:30' },
      { name: 'Double Knees to Chest', duration: '00:30' },
      { name: 'Straight Leg Raise Left', duration: '00:30' },
      { name: 'Straight Leg Raise Right', duration: '00:30' },
      { name: 'Glute Stretch Left', duration: '00:30' },
      { name: 'Glute Stretch Right', duration: '00:30' },
      { name: 'Lying Twist Stretch Left', duration: '00:30' },
      { name: 'Lying Twist Stretch Right', duration: '00:30' },
      { name: 'Relaxation Lying Pose', duration: '00:30' }
    ]
  },
  {
    id: 'neck-shoulder-pain',
    title: 'Neck & Shoulder Pain Relief',
    description: 'Work at a computer screen all day? Keep your eyes glued on your phone? This simple and mat-free workout is perfect for screen lovers. It will relieve neck, shoulders and upper back pain, help your body recover quickly from fatigue. You can do it at home or as a perfect little office break.',
    duration: '6 MINS',
    exercises: 14,
    exercisesList: [
      { name: 'Rhomboid Pulls', duration: '00:30' },
      { name: 'Overhead Arm Clockwise Circles', duration: '00:30' },
      { name: 'Shoulder Gators', duration: '00:30' },
      { name: 'Clockwise Shoulder Rolls', duration: '00:30' },
      { name: 'Side-to-Side Turns', duration: '00:30' },
      { name: 'Up & Down Nods', duration: '00:30' },
      { name: 'Side Neck Stretch Left', duration: '00:20' },
      { name: 'Side Neck Stretch Right', duration: '00:20' },
      { name: 'Levator Scapulae Stretch Left', duration: '00:20' },
      { name: 'Levator Scapulae Stretch Right', duration: '00:20' },
      { name: 'Anterior Scalene Stretch Left', duration: '00:20' },
      { name: 'Anterior Scalene Stretch Right', duration: '00:20' },
      { name: 'Back Arches', duration: '00:30' },
      { name: 'Shoulder Shrugs', duration: '00:30' }
    ]
  },
  {
    id: 'relaxation-office',
    title: 'Relaxation for Hunched Over Office Workers',
    description: 'If you often hunch over the desk for a long time, this workout is for you! It can improve your rounded shoulders, unlock your stiff back, and make you look more confident. Do it after work to relax and leave the day behind you!',
    duration: '6 MINS',
    exercises: 12,
    exercisesList: [
      { name: 'Torso Twist', duration: '00:30' },
      { name: 'Thoracic Spine Cat Cow', duration: '00:30' },
      { name: 'Lumbar Cat Cow', duration: '00:30' },
      { name: 'Cat Cow Pose', duration: '00:30' },
      { name: 'Floor Y Raises', duration: '00:30' },
      { name: 'Superman', duration: '00:30' },
      { name: 'Thoracic Spine Cat Cow', duration: '00:30' },
      { name: 'Lumbar Cat Cow', duration: '00:30' },
      { name: 'Cat Cow Pose', duration: '00:30' },
      { name: 'Floor Y Raises', duration: '00:30' },
      { name: 'Superman', duration: '00:30' },
      { name: 'Child\'s Pose', duration: '00:30' }
    ]
  },
  {
    id: 'sitting-too-much',
    title: 'Sitting Too Much Stretch',
    description: 'Sit too long? Have sciatic nerve pain occasionally? This 6-minute workout can help you relieve lower back pain efficiently, and improve the mobility of the lumbar spine and hips.',
    duration: '5 MINS',
    exercises: 11,
    exercisesList: [
      { name: 'Double Knees to Chest', duration: '00:30' },
      { name: 'Knee to Chest Stretch Left', duration: '00:30' },
      { name: 'Spine Lumbar Twist Stretch Left', duration: '00:30' },
      { name: 'Knee to Chest Stretch Right', duration: '00:30' },
      { name: 'Spine Lumbar Twist Stretch Right', duration: '00:30' },
      { name: 'Supine Hamstring Stretch Left', duration: '00:30' },
      { name: 'Supine Hamstring Stretch Right', duration: '00:30' },
      { name: 'Cobras', duration: '00:30' },
      { name: 'Prone Scorpion Kicks', duration: '00:30' },
      { name: 'Lumbar Cat Cow', duration: '00:30' },
      { name: 'Child\'s Pose', duration: '00:30' }
    ]
  },
  {
    id: 'yoga-weight-loss',
    title: 'Yoga for Weight Loss',
    description: 'In this workout, your muscles will be activated through the basic yoga poses, and the fat-burning process will kick in.',
    duration: '7 MINS',
    exercises: 9,
    exercisesList: [
      { name: 'Child\'s Pose', duration: '00:50' },
      { name: 'Seated Side Bend Right', duration: '00:40' },
      { name: 'Seated Side Bend Left', duration: '00:40' },
      { name: 'Crescent Low Lunge with Arm Extended Up Left', duration: '00:40' },
      { name: 'Sphinx Pose', duration: '00:50' },
      { name: 'Downward Facing Dog with Bent Knees', duration: '00:50' },
      { name: 'Crescent Low Lunge with Arm Extended Up Right', duration: '00:40' },
      { name: 'Lying Butterfly Stretch', duration: '00:50' },
      { name: 'Relaxation Lying Pose', duration: '01:00' }
    ]
  },
  {
    id: 'morning-warmup',
    title: 'Morning Warmup',
    description: 'Wake up with energy, make your body primed for the day.',
    duration: '4 MINS',
    exercises: 10,
    exercisesList: [
      { name: 'Bridge', duration: '00:20' },
      { name: 'Reverse Crunches', duration: '00:20' },
      { name: 'Abdominal Crunches', duration: '00:20' },
      { name: 'Butt Bridge', duration: '00:30' },
      { name: 'Bird Dog', duration: '00:25' },
      { name: 'Plank', duration: '00:30' },
      { name: 'Cobra Stretch', duration: '00:30' },
      { name: 'Shoulder Stretch', duration: '00:20' },
      { name: 'Butt Kicks', duration: '00:30' },
      { name: 'Jumping Jacks', duration: '00:30' }
    ]
  },
  {
    id: 'sleepy-time',
    title: 'Sleepy Time Stretching',
    description: 'Relax yourself and get a high-quality sleep.',
    duration: '6 MINS',
    exercises: 13,
    exercisesList: [
      { name: 'Left Quad Stretch with Wall', duration: '00:20' },
      { name: 'Right Quad Stretch with Wall', duration: '00:20' },
      { name: 'Calf Stretch Left', duration: '00:20' },
      { name: 'Calf Stretch Right', duration: '00:20' },
      { name: 'Triceps Stretch Left', duration: '00:30' },
      { name: 'Triceps Stretch Right', duration: '00:30' },
      { name: 'Cobra Stretch', duration: '00:30' },
      { name: 'Child\'s Pose', duration: '00:30' },
      { name: 'Cat Cow Pose', duration: '00:40' },
      { name: 'Bridge', duration: '00:30' },
      { name: 'Lying Butterfly Stretch', duration: '00:50' },
      { name: 'Lying Twist Stretch Left', duration: '00:20' },
      { name: 'Lying Twist Stretch Right', duration: '00:20' }
    ]
  }
];

let currentFilter = 'all';

function renderStretching() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Stretching Exercises" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Quick Filters -->
    <div class="card filter-card">
      <h3><i class="fas fa-filter"></i> Filter Routines</h3>
      <div class="filter-tabs">
        <button class="filter-tab active" onclick="filterRoutines('all')">All Routines</button>
        <button class="filter-tab" onclick="filterRoutines('pain')">Pain Relief</button>
        <button class="filter-tab" onclick="filterRoutines('flexibility')">Flexibility</button>
        <button class="filter-tab" onclick="filterRoutines('yoga')">Yoga</button>
        <button class="filter-tab" onclick="filterRoutines('warmup')">Warmup/Cool down</button>
      </div>
    </div>

    <!-- Routines List -->
    <div id="routinesList"></div>
  `;
  
  displayRoutines(stretchingRoutines);
}

function filterRoutines(filter) {
  currentFilter = filter;
  
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');
  
  let filtered = stretchingRoutines;
  
  if (filter === 'pain') {
    filtered = stretchingRoutines.filter(r => 
      r.title.includes('Pain') || r.title.includes('Relief')
    );
  } else if (filter === 'flexibility') {
    filtered = stretchingRoutines.filter(r => 
      r.title.includes('Stretch') || r.title.includes('Flexibility')
    );
  } else if (filter === 'yoga') {
    filtered = stretchingRoutines.filter(r => r.title.includes('Yoga'));
  } else if (filter === 'warmup') {
    filtered = stretchingRoutines.filter(r => 
      r.title.includes('Warmup') || r.title.includes('Cool')
    );
  }
  
  displayRoutines(filtered);
}

function displayRoutines(routines) {
  const container = document.getElementById('routinesList');
  
  let html = '';
  routines.forEach(routine => {
    html += `
      <div class="card routine-card" onclick="toggleRoutine('${routine.id}')">
        <div class="routine-header">
          <div class="routine-info">
            <h3>${routine.title}</h3>
            <div class="routine-meta">
              <span class="routine-duration"><i class="fas fa-clock"></i> ${routine.duration}</span>
              <span class="routine-exercises"><i class="fas fa-dumbbell"></i> ${routine.exercises} exercises</span>
            </div>
          </div>
          <i class="fas fa-chevron-down expand-icon" id="icon-${routine.id}"></i>
        </div>
        <div class="routine-description">
          <p>${routine.description}</p>
        </div>
        <div class="routine-exercises-list" id="exercises-${routine.id}" style="display: none;">
          <div class="exercises-header">
            <span>Exercise</span>
            <span>Duration</span>
          </div>
          ${routine.exercisesList.map(ex => `
            <div class="exercise-row">
              <span class="exercise-name">${ex.name}</span>
              <span class="exercise-duration">${ex.duration}</span>
            </div>
          `).join('')}
          <div class="routine-actions">
            <button class="btn btn-outline" onclick="event.stopPropagation(); startRoutineTimer('${routine.id}')">
              <i class="fas fa-play"></i> Start Routine
            </button>
            <button class="btn btn-outline" onclick="event.stopPropagation(); shareRoutine('${routine.id}')">
              <i class="fas fa-share-alt"></i> Share
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function toggleRoutine(id) {
  const exercisesDiv = document.getElementById(`exercises-${id}`);
  const icon = document.getElementById(`icon-${id}`);
  
  if (exercisesDiv.style.display === 'none') {
    document.querySelectorAll('.routine-exercises-list').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.expand-icon').forEach(el => {
      el.classList.remove('fa-chevron-up');
      el.classList.add('fa-chevron-down');
    });
    
    exercisesDiv.style.display = 'block';
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
  } else {
    exercisesDiv.style.display = 'none';
    icon.classList.remove('fa-chevron-up');
    icon.classList.add('fa-chevron-down');
  }
}

function startRoutineTimer(id) {
  const routine = stretchingRoutines.find(r => r.id === id);
  if (!routine) return;
  
  showToast(`Starting: ${routine.title} 🎯`, false);
  
  if (typeof switchTab === 'function') {
    switchTab('timer');
  }
}

function shareRoutine(id) {
  const routine = stretchingRoutines.find(r => r.id === id);
  if (!routine) return;
  
  const text = `Check out this stretching routine: ${routine.title} - ${routine.duration}, ${routine.exercises} exercises! 💪`;
  
  if (navigator.share) {
    navigator.share({
      title: routine.title,
      text: text
    }).catch(() => {});
  } else {
    showToast('Routine saved to your list!', false);
  }
}

console.log("✅ Stretching Exercises Loaded");