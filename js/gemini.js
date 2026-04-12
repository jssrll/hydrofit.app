// ========================================
// HYDROFIT - GEMINI AI ASSISTANT
// ========================================

const GEMINI_API_KEY = 'AIzaSyCYCfcv8okzyVYLRuBm1Be_6BNseL2LOlk';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

let chatHistory = [];
let isProcessing = false;

const FITNESS_CONTEXT = `You are HydroFit AI, a friendly fitness assistant for students. 
Keep responses short (2-3 sentences max), encouraging, and helpful.
Focus on: exercise form, workout tips, nutrition, recovery, and motivation.`;

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
          <h2>HydroFit AI Assistant</h2>
          <p>Powered by Gemini 2.5 Flash • Ask me anything!</p>
        </div>
      </div>

      <div class="gemini-chat-area" id="geminiChatArea">
        <div class="gemini-welcome" id="geminiWelcome">
          <div class="welcome-icon">🤖</div>
          <h3>Hello! I'm your HydroFit AI Assistant</h3>
          <p>I can help you with workout tips, exercise form, nutrition advice, and more!</p>
          <div class="suggestion-chips">
            <span class="suggestion-chip" data-query="What are the best exercises for abs?">
              <i class="fas fa-dumbbell"></i> Best ab exercises?
            </span>
            <span class="suggestion-chip" data-query="How do I do proper push-ups?">
              <i class="fas fa-question-circle"></i> Proper push-up form?
            </span>
            <span class="suggestion-chip" data-query="What should I eat after a workout?">
              <i class="fas fa-apple-alt"></i> Post-workout nutrition?
            </span>
            <span class="suggestion-chip" data-query="Create a simple 3-day beginner workout plan">
              <i class="fas fa-calendar"></i> Beginner workout plan
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
          ></textarea>
          <button class="send-btn" id="sendMessageBtn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-footer">
          <span><i class="fas fa-shield-alt"></i> AI responses, use with discretion</span>
          <button class="clear-chat-btn" id="clearChatBtn">
            <i class="fas fa-trash-alt"></i> Clear Chat
          </button>
        </div>
      </div>
    </div>
  `;
  
  setupEventListeners();
  loadChatHistory();
}

function setupEventListeners() {
  document.getElementById('geminiInput')?.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  
  document.getElementById('geminiInput')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  document.getElementById('sendMessageBtn')?.addEventListener('click', sendMessage);
  document.getElementById('clearChatBtn')?.addEventListener('click', clearChat);
  
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      document.getElementById('geminiInput').value = this.dataset.query;
      sendMessage();
    });
  });
}

async function sendMessage() {
  const input = document.getElementById('geminiInput');
  const message = input.value.trim();
  
  if (!message || isProcessing) return;
  
  isProcessing = true;
  input.value = '';
  input.style.height = 'auto';
  
  document.getElementById('geminiWelcome').style.display = 'none';
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
}

async function callGeminiAPI(message) {
  const requestBody = {
    contents: [{
      parts: [{
        text: `${FITNESS_CONTEXT}\n\nUser: ${message}\n\nAssistant:`
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300
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
  
  if (msg.includes('abs') || msg.includes('ab')) {
    return "Great question! The best ab exercises include planks (hold 30-60 seconds), bicycle crunches (3 sets of 20), leg raises (3 sets of 12-15), and Russian twists (3 sets of 20). Engage your core throughout! 💪";
  }
  if (msg.includes('push-up') || msg.includes('pushup')) {
    return "For proper push-ups: Hands shoulder-width apart, body straight, lower until chest nearly touches ground, then push up. Keep core tight! Do 3 sets of as many as you can with good form. 🎯";
  }
  if (msg.includes('eat') || msg.includes('nutrition') || msg.includes('food')) {
    return "Post-workout: Aim for protein (20-30g) and carbs within 30-60 minutes. Good options: Greek yogurt with fruit, protein shake with banana, or eggs with toast. Stay hydrated! 🥗";
  }
  if (msg.includes('workout') || msg.includes('plan') || msg.includes('routine')) {
    return "3-day beginner plan:\n• Day 1: Push-ups, squats, planks\n• Day 2: Rest/light walk\n• Day 3: Lunges, bridges, crunches\n• Day 4: Rest\n• Day 5: Repeat\n3 sets of 10-12 reps each. 📋";
  }
  if (msg.includes('cardio') || msg.includes('running')) {
    return "Start with 20-30 min brisk walking/jogging, 3-4x weekly. Gradually increase. Always warm up 5 min and cool down with stretching! 🏃";
  }
  if (msg.includes('stretch') || msg.includes('flexibility')) {
    return "Hold each stretch 15-30 seconds without bouncing. Focus on hamstrings, quads, chest, back, shoulders. Never stretch to pain! 🧘";
  }
  
  return "I'm here to help with fitness! Ask about exercises, nutrition, or workout plans. What would you like to know? 💪";
}

function addMessageToChat(role, content) {
  const container = document.getElementById('chatMessages');
  
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
    .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
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
  document.getElementById('typingIndicator')?.remove();
}

function scrollToBottom() {
  const area = document.getElementById('geminiChatArea');
  area.scrollTop = area.scrollHeight;
}

function clearChat() {
  if (!confirm('Clear conversation?')) return;
  chatHistory = [];
  localStorage.removeItem('hydrofit_gemini_chat');
  document.getElementById('chatMessages').innerHTML = '';
  document.getElementById('geminiWelcome').style.display = 'block';
  showToast('Chat cleared', false);
}

function loadChatHistory() {
  const saved = localStorage.getItem('hydrofit_gemini_chat');
  if (!saved) return;
  
  try {
    chatHistory = JSON.parse(saved);
    const container = document.getElementById('chatMessages');
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
      document.getElementById('geminiWelcome').style.display = 'none';
    }
  } catch (e) {
    console.error('Error loading chat:', e);
  }
}

console.log("✅ Gemini AI Loaded");