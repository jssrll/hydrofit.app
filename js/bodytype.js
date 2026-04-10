// ========================================
// HYDROFIT - BODY TYPE IDENTIFIER
// ========================================

let bodyTypeAnswers = {
  shape: '',
  weightBehavior: '',
  measurements: '',
  metabolism: ''
};

function renderBodyType() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="Body Type Identifier" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <!-- Introduction -->
    <div class="card">
      <h3><i class="fas fa-user"></i> Body Type Identifier (Somatotype)</h3>
      <p style="color:#64748b;margin-bottom:20px">Discover your body type to optimize your training and nutrition</p>
      
      <div class="somatotype-intro">
        <div class="somatotype-cards">
          <div class="type-card ectomorph">
            <div class="type-icon">🏃</div>
            <h4>Ectomorph</h4>
          </div>
          <div class="type-card mesomorph">
            <div class="type-icon">💪</div>
            <h4>Mesomorph</h4>
          </div>
          <div class="type-card endomorph">
            <div class="type-icon">🧸</div>
            <h4>Endomorph</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Questionnaire -->
    <div class="card">
      <h3><i class="fas fa-clipboard-question"></i> Answer These Questions</h3>
      
      <!-- Question 1: Body Shape -->
      <div class="question-section" id="q1">
        <h4>1. Look at your body shape</h4>
        <div class="option-grid">
          <div class="option-card ${bodyTypeAnswers.shape === 'endomorph' ? 'selected' : ''}" onclick="selectOption('shape', 'endomorph')">
            <i class="fas fa-circle"></i>
            <span>Wide waist, soft body</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.shape === 'mesomorph' ? 'selected' : ''}" onclick="selectOption('shape', 'mesomorph')">
            <i class="fas fa-circle"></i>
            <span>Muscular, defined</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.shape === 'ectomorph' ? 'selected' : ''}" onclick="selectOption('shape', 'ectomorph')">
            <i class="fas fa-circle"></i>
            <span>Thin, narrow</span>
          </div>
        </div>
      </div>

      <!-- Question 2: Weight Behavior -->
      <div class="question-section" id="q2">
        <h4>2. Check your weight behavior</h4>
        <div class="option-grid">
          <div class="option-card ${bodyTypeAnswers.weightBehavior === 'endomorph' ? 'selected' : ''}" onclick="selectOption('weightBehavior', 'endomorph')">
            <i class="fas fa-circle"></i>
            <span>Gains fat fast</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.weightBehavior === 'mesomorph' ? 'selected' : ''}" onclick="selectOption('weightBehavior', 'mesomorph')">
            <i class="fas fa-circle"></i>
            <span>Gains muscle fast</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.weightBehavior === 'ectomorph' ? 'selected' : ''}" onclick="selectOption('weightBehavior', 'ectomorph')">
            <i class="fas fa-circle"></i>
            <span>Struggles to gain weight</span>
          </div>
        </div>
      </div>

      <!-- Question 3: Body Measurements -->
      <div class="question-section" id="q3">
        <h4>3. Measure your body (Waist, Shoulders, Hips)</h4>
        <div class="option-grid">
          <div class="option-card ${bodyTypeAnswers.measurements === 'endomorph' ? 'selected' : ''}" onclick="selectOption('measurements', 'endomorph')">
            <i class="fas fa-circle"></i>
            <span>Larger waist</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.measurements === 'mesomorph' ? 'selected' : ''}" onclick="selectOption('measurements', 'mesomorph')">
            <i class="fas fa-circle"></i>
            <span>Broad shoulders, small waist</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.measurements === 'ectomorph' ? 'selected' : ''}" onclick="selectOption('measurements', 'ectomorph')">
            <i class="fas fa-circle"></i>
            <span>Small frame</span>
          </div>
        </div>
      </div>

      <!-- Question 4: Metabolism -->
      <div class="question-section" id="q4">
        <h4>4. Observe your metabolism</h4>
        <div class="option-grid">
          <div class="option-card ${bodyTypeAnswers.metabolism === 'endomorph' ? 'selected' : ''}" onclick="selectOption('metabolism', 'endomorph')">
            <i class="fas fa-circle"></i>
            <span>Slow</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.metabolism === 'mesomorph' ? 'selected' : ''}" onclick="selectOption('metabolism', 'mesomorph')">
            <i class="fas fa-circle"></i>
            <span>Moderate</span>
          </div>
          <div class="option-card ${bodyTypeAnswers.metabolism === 'ectomorph' ? 'selected' : ''}" onclick="selectOption('metabolism', 'ectomorph')">
            <i class="fas fa-circle"></i>
            <span>Fast</span>
          </div>
        </div>
      </div>

      <button class="calculate-btn" onclick="calculateBodyType()">
        <i class="fas fa-calculator"></i> Calculate My Body Type
      </button>
    </div>

    <!-- Result -->
    <div class="card" id="bodyTypeResult" style="display:none">
      <h3><i class="fas fa-chart-pie"></i> Your Body Type Result</h3>
      <div id="resultContent"></div>
    </div>
  `;
}

function selectOption(question, value) {
  bodyTypeAnswers[question] = value;
  
  // Update UI
  document.querySelectorAll(`[onclick*="selectOption('${question}"]`).forEach(card => {
    card.classList.remove('selected');
  });
  event.currentTarget.classList.add('selected');
}

function calculateBodyType() {
  // Check if all questions answered
  if (!bodyTypeAnswers.shape || !bodyTypeAnswers.weightBehavior || 
      !bodyTypeAnswers.measurements || !bodyTypeAnswers.metabolism) {
    showToast('Please answer all questions', true);
    return;
  }
  
  // Count occurrences
  const counts = {
    ectomorph: 0,
    mesomorph: 0,
    endomorph: 0
  };
  
  counts[bodyTypeAnswers.shape]++;
  counts[bodyTypeAnswers.weightBehavior]++;
  counts[bodyTypeAnswers.measurements]++;
  counts[bodyTypeAnswers.metabolism]++;
  
  // Find dominant type
  let dominantType = 'ectomorph';
  let maxCount = 0;
  
  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantType = type;
    }
  }
  
  displayResult(dominantType, counts);
}

function displayResult(type, counts) {
  const resultCard = document.getElementById('bodyTypeResult');
  const resultContent = document.getElementById('resultContent');
  
  const typeInfo = {
    ectomorph: {
      name: 'Ectomorph',
      icon: '🏃',
      color: '#00b4d8',
      description: 'You have a thin, narrow frame with a fast metabolism. You find it difficult to gain both muscle and fat.',
      explanation: 'Ectomorphs are naturally lean with long limbs and small joints. Your body burns calories quickly.',
      exercises: [
        'Compound lifts (Squats, Deadlifts, Bench Press)',
        'Limit cardio to preserve calories',
        'Focus on progressive overload',
        'Longer rest periods between sets'
      ],
      nutrition: [
        'Eat in caloric surplus',
        'Higher carbohydrate intake',
        'Frequent meals (5-6 per day)',
        'Protein: 1.6-2.2g per kg bodyweight'
      ]
    },
    mesomorph: {
      name: 'Mesomorph',
      icon: '💪',
      color: '#00b894',
      description: 'You have a naturally athletic, muscular build. You gain muscle easily and can lose fat with moderate effort.',
      explanation: 'Mesomorphs have broad shoulders, narrow waist, and respond well to training. This is the ideal body type for bodybuilding.',
      exercises: [
        'Mix of compound and isolation exercises',
        'Moderate cardio for heart health',
        'Can handle higher training volume',
        'Variety in training styles'
      ],
      nutrition: [
        'Balanced macros (40% carbs, 30% protein, 30% fat)',
        'Moderate caloric intake',
        '3-4 meals per day',
        'Protein: 1.6-2.0g per kg bodyweight'
      ]
    },
    endomorph: {
      name: 'Endomorph',
      icon: '🧸',
      color: '#e17055',
      description: 'You have a softer, rounder body with a slower metabolism. You gain fat easily but can also build muscle well.',
      explanation: 'Endomorphs have a wider waist and larger bone structure. Weight management requires more attention to diet.',
      exercises: [
        'High-intensity interval training (HIIT)',
        'Regular cardio (3-5 times per week)',
        'Compound movements with shorter rest',
        'Circuit training for calorie burn'
      ],
      nutrition: [
        'Caloric deficit or maintenance',
        'Lower carbohydrate, higher protein',
        'Focus on fiber and vegetables',
        'Protein: 1.8-2.2g per kg bodyweight'
      ]
    }
  };
  
  const info = typeInfo[type];
  
  resultContent.innerHTML = `
    <div class="result-header" style="background:${info.color}20;border-left:4px solid ${info.color}">
      <div class="result-icon">${info.icon}</div>
      <div>
        <h2 style="color:${info.color};margin:0">${info.name}</h2>
        <p style="margin:8px 0 0;color:#64748b">${counts[type]} out of 4 indicators</p>
      </div>
    </div>
    
    <p style="margin:20px 0;line-height:1.7;color:#1a1a1a">${info.description}</p>
    
    <div class="info-box">
      <h4><i class="fas fa-info-circle"></i> What This Means</h4>
      <p>${info.explanation}</p>
    </div>
    
    <div class="two-column">
      <div class="column">
        <h4><i class="fas fa-dumbbell"></i> Recommended Exercise Focus</h4>
        <ul class="check-list">
          ${info.exercises.map(ex => `<li><i class="fas fa-check"></i> ${ex}</li>`).join('')}
        </ul>
      </div>
      <div class="column">
        <h4><i class="fas fa-apple-alt"></i> Nutrition Tips</h4>
        <ul class="check-list">
          ${info.nutrition.map(nut => `<li><i class="fas fa-check"></i> ${nut}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div class="score-breakdown">
      <h4>Your Answers Breakdown</h4>
      <div class="score-bars">
        <div class="score-item">
          <span>Ectomorph</span>
          <div class="score-bar">
            <div class="score-fill ectomorph" style="width:${(counts.ectomorph/4)*100}%">${counts.ectomorph}</div>
          </div>
        </div>
        <div class="score-item">
          <span>Mesomorph</span>
          <div class="score-bar">
            <div class="score-fill mesomorph" style="width:${(counts.mesomorph/4)*100}%">${counts.mesomorph}</div>
          </div>
        </div>
        <div class="score-item">
          <span>Endomorph</span>
          <div class="score-bar">
            <div class="score-fill endomorph" style="width:${(counts.endomorph/4)*100}%">${counts.endomorph}</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  resultCard.style.display = 'block';
  resultCard.scrollIntoView({ behavior: 'smooth' });
}

console.log("✅ Body Type Identifier Loaded");