// ========================================
// HYDROFIT - GEMINI AI ASSISTANT (SMARTER)
// ========================================

const GEMINI_API_KEY = 'AIzaSyCYCfcv8okzyVYLRuBm1Be_6BNseL2LOlk';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

let chatHistory = [];
let isProcessing = false;

const FITNESS_CONTEXT = `You are HydroFit AI, an expert fitness coach and personal trainer with deep knowledge of exercise science, nutrition, and sports medicine.

Your expertise includes:
- Detailed exercise form and technique analysis
- Custom workout programming for all fitness levels
- Sports-specific training methodologies
- Nutrition and meal planning for performance
- Injury prevention and rehabilitation exercises
- Recovery optimization strategies
- Fitness assessment interpretation
- Motivational coaching and goal setting

Guidelines:
- Provide detailed, comprehensive answers (not just 2-3 sentences)
- Include specific sets, reps, rest periods, and progression plans
- Explain the "why" behind your recommendations
- Offer modifications and alternatives when appropriate
- Use scientific reasoning and evidence-based practices
- Be encouraging but also honest about realistic expectations
- Include safety disclaimers when discussing intense exercises or diets

You are talking to college students in a PathFit (Physical Education) class. Be thorough, educational, and genuinely helpful.`;

function renderGeminiAI() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="AI Assistant" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <div class="gemini-container">
      <div class="gemini-header">
        <div class="gemini-logo">
          <i class="fas fa-robot"></i>
        </div>
        <div>
          <h2>HydroFit AI Coach</h2>
          <p>Expert fitness advice powered by Google Gemini</p>
        </div>
      </div>

      <div class="gemini-chat-area" id="geminiChatArea">
        <div class="gemini-welcome" id="geminiWelcome">
          <div class="welcome-icon">🏋️</div>
          <h3>Your Personal AI Fitness Coach</h3>
          <p>Ask me detailed questions about workouts, form, nutrition, or training programs!</p>
          <div class="suggestion-chips">
            <span class="suggestion-chip" onclick="window.useSuggestion('Create a detailed 4-week workout plan for building muscle with progressive overload')">
              <i class="fas fa-dumbbell"></i> 4-Week Muscle Building Plan
            </span>
            <span class="suggestion-chip" onclick="window.useSuggestion('What are the best exercises for chest development and proper form tips?')">
              <i class="fas fa-question-circle"></i> Chest Exercises & Form
            </span>
            <span class="suggestion-chip" onclick="window.useSuggestion('How do I calculate my macros for fat loss while maintaining muscle?')">
              <i class="fas fa-apple-alt"></i> Fat Loss Macros
            </span>
            <span class="suggestion-chip" onclick="window.useSuggestion('What stretches should I do daily to improve flexibility for squats?')">
              <i class="fas fa-person-walking"></i> Squat Flexibility
            </span>
          </div>
        </div>
        <div id="chatMessages"></div>
      </div>

      <div class="gemini-input-area">
        <div class="input-wrapper">
          <textarea 
            id="geminiInput" 
            placeholder="Ask me anything about fitness..."
            rows="1"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();window.sendGeminiMessage();}"
          ></textarea>
          <button class="send-btn" onclick="window.sendGeminiMessage()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-footer">
          <span><i class="fas fa-shield-alt"></i> AI responses, use with discretion</span>
          <button class="clear-chat-btn" onclick="window.clearGeminiChat()">
            <i class="fas fa-trash-alt"></i> Clear Chat
          </button>
        </div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const input = document.getElementById('geminiInput');
    if (input) {
      input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      });
    }
    loadChatHistory();
  }, 100);
}

window.useSuggestion = function(text) {
  const input = document.getElementById('geminiInput');
  if (input) {
    input.value = text;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }
  window.sendGeminiMessage();
};

window.sendGeminiMessage = async function() {
  const input = document.getElementById('geminiInput');
  if (!input) return;
  
  const message = input.value.trim();
  if (!message || isProcessing) return;
  
  isProcessing = true;
  input.value = '';
  input.style.height = 'auto';
  
  const welcome = document.getElementById('geminiWelcome');
  if (welcome) welcome.style.display = 'none';
  
  addMessageToChat('user', message);
  showTypingIndicator();
  
  try {
    const response = await callGeminiAPI(message);
    removeTypingIndicator();
    addMessageToChat('assistant', response);
  } catch (error) {
    console.error('API Error:', error);
    removeTypingIndicator();
    addMessageToChat('assistant', getFallbackResponse(message));
  }
  
  isProcessing = false;
  scrollToBottom();
};

async function callGeminiAPI(message) {
  // Include recent chat history for context
  const recentHistory = chatHistory.slice(-6).map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
  
  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: FITNESS_CONTEXT }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will act as an expert fitness coach, providing detailed, educational, and helpful responses about exercise science, nutrition, and training.' }]
      },
      ...recentHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 800,
      topP: 0.95,
      topK: 40
    }
  };
  
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  
  throw new Error('Invalid response');
}

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('abs') || msg.includes('ab') || msg.includes('core')) {
    return "For optimal core development, you need both isolation and compound movements:\n\n**Isolation Exercises:**\n• Planks: 3-4 sets, hold 30-60 sec (progressive: add weight vest)\n• Dead Bug: 3 sets of 12-15 per side\n• Bird Dog: 3 sets of 10-12 per side\n• Pallof Press: 3 sets of 12-15\n\n**Compound Movements:**\n• Squats and Deadlifts (engage core as stabilizer)\n• Hanging Leg Raises: 3 sets of 10-15\n• Ab Wheel Rollouts: 3 sets of 8-12\n\n**Pro Tips:**\n• Breathe out during exertion\n• Quality > Quantity - slow controlled reps\n• Train abs 2-3x per week with 48h rest\n• Visible abs require low body fat (diet matters!)\n\nWant a full core workout program?";
  }
  
  if (msg.includes('push-up') || msg.includes('pushup') || msg.includes('chest')) {
    return "**Perfect Push-Up Form:**\n\n**Setup:**\n• Hands slightly wider than shoulders\n• Body in straight line from head to heels\n• Core and glutes engaged\n• Neck neutral (look at floor slightly ahead)\n\n**Execution:**\n• Lower chest to 2-3 inches from floor (2-3 sec descent)\n• Elbows at 45° angle to body\n• Explosive push up (1 sec)\n• Lock out elbows at top\n\n**Common Mistakes to Avoid:**\n• Sagging hips → Engage glutes more\n• Flared elbows → Tuck to 45°\n• Partial reps → Full range of motion\n• Holding breath → Exhale on push\n\n**Progression Path:**\n1. Knee push-ups (3x8-12)\n2. Standard push-ups (3x5-10)\n3. Diamond push-ups (triceps focus)\n4. Decline push-ups (upper chest)\n5. Archer push-ups (unilateral strength)\n\nTrack your max reps weekly!";
  }
  
  if (msg.includes('workout') || msg.includes('plan') || msg.includes('program') || msg.includes('routine')) {
    return "**4-Week Progressive Overload Program**\n\n**Week 1-2 (Foundation):**\n• Frequency: 3x/week (M/W/F)\n• Focus: Form mastery\n\nDay 1 (Push):\n• Push-ups: 3x8-12\n• Dumbbell/Chair Dips: 3x10-12\n• Plank: 3x30-45 sec\n\nDay 2 (Pull/Legs):\n• Bodyweight Squats: 3x15-20\n• Lunges: 3x10 per leg\n• Glute Bridges: 3x15\n• Superman Holds: 3x20 sec\n\nDay 3 (Full Body):\n• Burpees: 3x10\n• Mountain Climbers: 3x30 sec\n• Bicycle Crunches: 3x15 per side\n\n**Week 3-4 (Progression):**\n• Add 1 set to each exercise\n• Decrease rest from 90 sec → 60 sec\n• Add tempo (3 sec down, 1 sec up)\n\n**Week 5+ (Advanced):**\n• Add resistance bands or weights\n• Increase to 4x/week\n• Track all lifts for progressive overload\n\nWould you like a specific focus (strength/hypertrophy/endurance)?";
  }
  
  if (msg.includes('nutrition') || msg.includes('eat') || msg.includes('food') || msg.includes('diet') || msg.includes('macro')) {
    return "**Nutrition Fundamentals for Fitness:**\n\n**Calculate Your Macros:**\n1. Find BMR (Basal Metabolic Rate)\n2. Multiply by activity factor (1.375-1.725)\n3. Adjust based on goal:\n   • Fat loss: -300-500 calories\n   • Maintenance: no change\n   • Muscle gain: +200-300 calories\n\n**Protein (1.6-2.2g per kg bodyweight):**\n• Chicken breast (31g/100g)\n• Greek yogurt (10g/100g)\n• Eggs (6g per egg)\n• Lentils (9g/100g cooked)\n• Tofu (8g/100g)\n\n**Carbs (3-5g per kg):**\n• Oats, rice, potatoes\n• Fruits and vegetables\n• Timing: More carbs around workouts\n\n**Fats (0.5-1g per kg):**\n• Avocado, nuts, olive oil\n• Fatty fish (salmon, tuna)\n\n**Sample Day (2000 cal):**\n• Breakfast: Oatmeal + berries + eggs\n• Lunch: Chicken + quinoa + veggies\n• Snack: Greek yogurt + apple\n• Dinner: Salmon + sweet potato + broccoli\n\n**Hydration:** 35ml per kg bodyweight daily\n\nWant a personalized meal plan?";
  }
  
  if (msg.includes('stretch') || msg.includes('flexibility') || msg.includes('mobility')) {
    return "**Complete Flexibility Routine for Better Lifts**\n\n**Dynamic Warm-Up (Pre-Workout - 5-10 min):**\n• Leg swings: 10-15 per leg\n• Arm circles: 10 forward/backward\n• Torso twists: 10 per side\n• Cat-Cow: 8-10 reps\n• Walking lunges with twist: 10 per leg\n• World's greatest stretch: 5 per side\n\n**Static Stretching (Post-Workout - Hold 20-30 sec):**\n\n**For Squat Depth:**\n• Deep squat hold (use support if needed)\n• Couch stretch (quad/hip flexor)\n• Pigeon pose (glutes)\n• Ankle mobility drills\n\n**For Shoulder Mobility:**\n• Doorway chest stretch\n• Thread the needle\n• Wall slides\n• Band pull-aparts\n\n**For Deadlift/Hinge:**\n• Standing hamstring stretch\n• 90/90 hip stretch\n• Cat-Cow flow\n• Child's pose with lat reach\n\n**Pro Tips:**\n• Never stretch cold muscles\n• Breathe deeply into stretches\n• Consistency > Intensity\n• 10 min daily > 60 min weekly\n\nWant sport-specific mobility drills?";
  }
  
  return "I'm your expert AI fitness coach! I can provide detailed guidance on:\n\n• **Exercise form and technique** (with progressions)\n• **Custom workout programming** (any goal/level)\n• **Nutrition and meal planning** (macros, timing)\n• **Injury prevention and rehab** exercises\n• **Recovery and mobility** routines\n• **Sports-specific training**\n\nWhat would you like detailed help with? Be specific for the best answer! 💪";
}

function addMessageToChat(role, content) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = `gemini-message ${role}-message`;
  div.innerHTML = `
    <div class="message-avatar"><i class="fas fa-${role === 'user' ? 'user-circle' : 'robot'}"></i></div>
    <div class="message-content">
      <div class="message-text">${formatMessage(content)}</div>
      <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `;
  
  container.appendChild(div);
  
  chatHistory.push({ role, content, timestamp: new Date().toISOString() });
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
  localStorage.setItem('hydrofit_gemini_chat', JSON.stringify(chatHistory));
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/•/g, '<br>•')
    .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = 'gemini-message assistant-message';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="message-avatar"><i class="fas fa-robot"></i></div>
    <div class="message-content">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  container.appendChild(div);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

function scrollToBottom() {
  const area = document.getElementById('geminiChatArea');
  if (area) area.scrollTop = area.scrollHeight;
}

window.clearGeminiChat = function() {
  if (!confirm('Clear conversation?')) return;
  
  chatHistory = [];
  localStorage.removeItem('hydrofit_gemini_chat');
  
  const container = document.getElementById('chatMessages');
  if (container) container.innerHTML = '';
  
  const welcome = document.getElementById('geminiWelcome');
  if (welcome) welcome.style.display = 'block';
  
  showToast('Chat cleared', false);
};

function loadChatHistory() {
  const saved = localStorage.getItem('hydrofit_gemini_chat');
  if (!saved) return;
  
  try {
    chatHistory = JSON.parse(saved);
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    container.innerHTML = '';
    
    chatHistory.forEach(msg => {
      const div = document.createElement('div');
      div.className = `gemini-message ${msg.role}-message`;
      div.innerHTML = `
        <div class="message-avatar"><i class="fas fa-${msg.role === 'user' ? 'user-circle' : 'robot'}"></i></div>
        <div class="message-content">
          <div class="message-text">${formatMessage(msg.content)}</div>
          <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      `;
      container.appendChild(div);
    });
    
    if (chatHistory.length > 0) {
      const welcome = document.getElementById('geminiWelcome');
      if (welcome) welcome.style.display = 'none';
    }
    
    scrollToBottom();
  } catch (e) {
    console.error('Error loading chat:', e);
  }
}

console.log("✅ Gemini AI Coach Loaded");