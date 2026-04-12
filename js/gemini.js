// ========================================
// HYDROFIT - GEMINI AI ASSISTANT
// ========================================

const GEMINI_API_KEY = 'AIzaSyCYCfcv8okzyVYLRuBm1Be_6BNseL2LOlk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

let chatHistory = [];
let isProcessing = false;

// Fitness context to make AI more relevant
const FITNESS_CONTEXT = `You are HydroFit AI, a friendly and knowledgeable fitness assistant for students using the HydroFit academic fitness tracker app. 

Your role is to help with:
- Exercise form and technique
- Workout planning and routines
- Nutrition and hydration advice
- Recovery and injury prevention
- Fitness assessment interpretation
- Motivation and goal setting

Keep responses:
- Concise and practical (2-3 paragraphs max)
- Encouraging and supportive
- Safe (include disclaimers when appropriate)
- Student-friendly

The user is a college student in a PathFit (Physical Education) class.`;

function renderGeminiAI() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="AI Assistant" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <div class="gemini-container">
      <!-- Chat Header -->
      <div class="gemini-header">
        <div class="gemini-logo">
          <i class="fas fa-robot"></i>
        </div>
        <div>
          <h2>HydroFit AI Assistant</h2>
          <p>Powered by Google Gemini • Ask me anything about fitness!</p>
        </div>
      </div>

      <!-- Chat Messages Area -->
      <div class="gemini-chat-area" id="geminiChatArea">
        <div class="gemini-welcome">
          <div class="welcome-icon">🤖</div>
          <h3>Hello! I'm your HydroFit AI Assistant</h3>
          <p>I can help you with workout tips, exercise form, nutrition advice, and more!</p>
          <div class="suggestion-chips">
            <span class="suggestion-chip" onclick="useSuggestion('What are the best exercises for abs?')">
              <i class="fas fa-dumbbell"></i> Best ab exercises?
            </span>
            <span class="suggestion-chip" onclick="useSuggestion('How do I do proper push-ups?')">
              <i class="fas fa-question-circle"></i> Proper push-up form?
            </span>
            <span class="suggestion-chip" onclick="useSuggestion('What should I eat after a workout?')">
              <i class="fas fa-apple-alt"></i> Post-workout nutrition?
            </span>
            <span class="suggestion-chip" onclick="useSuggestion('Create a 3-day beginner workout plan')">
              <i class="fas fa-calendar"></i> Beginner workout plan
            </span>
          </div>
        </div>
        <div id="chatMessages"></div>
      </div>

      <!-- Chat Input -->
      <div class="gemini-input-area">
        <div class="input-wrapper">
          <textarea 
            id="geminiInput" 
            placeholder="Ask me anything about fitness, workouts, nutrition..."
            rows="1"
            onkeydown="handleKeyDown(event)"
          ></textarea>
          <button class="send-btn" id="sendMessageBtn" onclick="sendMessage()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-footer">
          <span><i class="fas fa-shield-alt"></i> Responses are AI-generated, use with discretion</span>
          <button class="clear-chat-btn" onclick="clearChat()">
            <i class="fas fa-trash-alt"></i> Clear Chat
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Auto-resize textarea
  const textarea = document.getElementById('geminiInput');
  textarea?.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });
  
  // Load chat history
  loadChatHistory();
}

function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function useSuggestion(text) {
  document.getElementById('geminiInput').value = text;
  sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('geminiInput');
  const message = input.value.trim();
  
  if (!message || isProcessing) return;
  
  isProcessing = true;
  input.value = '';
  input.style.height = 'auto';
  
  // Hide welcome message if exists
  const welcome = document.querySelector('.gemini-welcome');
  if (welcome) welcome.style.display = 'none';
  
  // Add user message to chat
  addMessageToChat('user', message);
  
  // Show typing indicator
  showTypingIndicator();
  
  try {
    const response = await callGeminiAPI(message);
    removeTypingIndicator();
    addMessageToChat('assistant', response);
  } catch (error) {
    console.error('Gemini API Error:', error);
    removeTypingIndicator();
    addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again. 🙁');
  }
  
  isProcessing = false;
  
  // Scroll to bottom
  scrollToBottom();
}

async function callGeminiAPI(message) {
  // Build conversation context
  const recentMessages = chatHistory.slice(-6).map(msg => ({
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
        parts: [{ text: 'I understand. I will act as a helpful fitness assistant for HydroFit students, providing practical and encouraging advice about exercise, nutrition, and wellness.' }]
      },
      ...recentMessages,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
      topP: 0.8,
      topK: 40
    }
  };
  
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function addMessageToChat(role, content) {
  const messagesContainer = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `gemini-message ${role}-message`;
  
  const avatar = role === 'user' ? 
    '<i class="fas fa-user-circle"></i>' : 
    '<i class="fas fa-robot"></i>';
  
  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">
      <div class="message-text">${formatMessage(content)}</div>
      <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  
  // Save to history
  chatHistory.push({ role, content, timestamp: new Date().toISOString() });
  saveChatHistory();
}

function formatMessage(text) {
  // Convert markdown-style to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
    .replace(/•/g, '<br>•');
}

function showTypingIndicator() {
  const messagesContainer = document.getElementById('chatMessages');
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'gemini-message assistant-message typing-indicator-container';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="message-avatar"><i class="fas fa-robot"></i></div>
    <div class="message-content">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(typingDiv);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

function scrollToBottom() {
  const chatArea = document.getElementById('geminiChatArea');
  chatArea.scrollTop = chatArea.scrollHeight;
}

function clearChat() {
  if (!confirm('Clear conversation history?')) return;
  
  chatHistory = [];
  localStorage.removeItem('hydrofit_gemini_chat');
  
  document.getElementById('chatMessages').innerHTML = '';
  
  // Show welcome again
  const welcome = document.querySelector('.gemini-welcome');
  if (welcome) welcome.style.display = 'block';
  
  showToast('Chat cleared', false);
}

function saveChatHistory() {
  // Keep only last 20 messages
  if (chatHistory.length > 20) {
    chatHistory = chatHistory.slice(-20);
  }
  localStorage.setItem('hydrofit_gemini_chat', JSON.stringify(chatHistory));
}

function loadChatHistory() {
  const saved = localStorage.getItem('hydrofit_gemini_chat');
  if (saved) {
    try {
      chatHistory = JSON.parse(saved);
      
      // Display saved messages
      const messagesContainer = document.getElementById('chatMessages');
      messagesContainer.innerHTML = '';
      
      chatHistory.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `gemini-message ${msg.role}-message`;
        
        const avatar = msg.role === 'user' ? 
          '<i class="fas fa-user-circle"></i>' : 
          '<i class="fas fa-robot"></i>';
        
        messageDiv.innerHTML = `
          <div class="message-avatar">${avatar}</div>
          <div class="message-content">
            <div class="message-text">${formatMessage(msg.content)}</div>
            <div class="message-time">${new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
      });
      
      // Hide welcome if there are messages
      if (chatHistory.length > 0) {
        const welcome = document.querySelector('.gemini-welcome');
        if (welcome) welcome.style.display = 'none';
      }
      
      scrollToBottom();
    } catch (e) {
      console.error('Error loading chat history:', e);
    }
  }
}

console.log("✅ Gemini AI Assistant Loaded");