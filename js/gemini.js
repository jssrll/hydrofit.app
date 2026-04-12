// ========================================
// HYDROFIT - FULL POWER GEMINI AI
// ========================================

const GEMINI_API_KEY = 'AIzaSyCYCfcv8okzyVYLRuBm1Be_6BNseL2LOlk';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;

let chatHistory = [];
let isProcessing = false;

function renderGeminiAI() {
  const container = document.getElementById("tabContent");
  
  container.innerHTML = `
    <div class="page-banner">
      <img src="https://ik.imagekit.io/0sf7uub8b/HydroFit/Black%20White%20Simple%20Fitness%20Tracker%20Banner.png?updatedAt=1775723329394" alt="AI Assistant" style="width:100%;border-radius:20px;box-shadow:var(--shadow)">
    </div>

    <div class="gemini-container">
      <div class="gemini-header">
        <div class="gemini-logo">
          <i class="fas fa-brain"></i>
        </div>
        <div>
          <h2>Gemini AI - Full Power Mode</h2>
          <p>Powered by Gemini 2.5 Flash • No restrictions • Ask anything!</p>
        </div>
      </div>

      <div class="gemini-chat-area" id="geminiChatArea">
        <div class="gemini-welcome" id="geminiWelcome">
          <div class="welcome-icon">🧠</div>
          <h3>Gemini AI is Ready</h3>
          <p>Ask me anything - complex questions, creative tasks, deep analysis, or just chat!</p>
          <div class="suggestion-chips">
            <span class="suggestion-chip" onclick="window.useSuggestion('Explain quantum computing like I\'m 10 years old')">
              <i class="fas fa-atom"></i> Quantum Computing
            </span>
            <span class="suggestion-chip" onclick="window.useSuggestion('Write a short motivational poem about never giving up')">
              <i class="fas fa-feather"></i> Write a Poem
            </span>
            <span class="suggestion-chip" onclick="window.useSuggestion('What are the most mind-blowing facts about the universe?')">
              <i class="fas fa-globe"></i> Universe Facts
            </span>
            <span class="suggestion-chip" onclick="window.useSuggestion('Explain the plot of Inception and all its fan theories')">
              <i class="fas fa-film"></i> Inception Explained
            </span>
          </div>
        </div>
        <div id="chatMessages"></div>
      </div>

      <div class="gemini-input-area">
        <div class="input-wrapper">
          <textarea 
            id="geminiInput" 
            placeholder="Ask anything... seriously, anything!"
            rows="1"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();window.sendGeminiMessage();}"
          ></textarea>
          <button class="send-btn" onclick="window.sendGeminiMessage()">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        <div class="input-footer">
          <span><i class="fas fa-infinity"></i> Full Gemini 2.5 Flash • No filters • Pure AI</span>
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
    addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again. 🙁');
  }
  
  isProcessing = false;
  scrollToBottom();
};

async function callGeminiAPI(message) {
  // NO SYSTEM PROMPT - Complete freedom!
  const requestBody = {
    contents: [{
      parts: [{ text: message }]
    }],
    generationConfig: {
      temperature: 1.0,        // Maximum creativity
      maxOutputTokens: 8192,   // Maximum response length
      topP: 1.0,               // Full diversity
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

function addMessageToChat(role, content) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = `gemini-message ${role}-message`;
  div.innerHTML = `
    <div class="message-avatar"><i class="fas fa-${role === 'user' ? 'user-circle' : 'brain'}"></i></div>
    <div class="message-content">
      <div class="message-text">${formatMessage(content)}</div>
      <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  `;
  
  container.appendChild(div);
  
  chatHistory.push({ role, content, timestamp: new Date().toISOString() });
  if (chatHistory.length > 50) chatHistory = chatHistory.slice(-50);
  localStorage.setItem('hydrofit_gemini_chat', JSON.stringify(chatHistory));
}

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\n/g, '<br>');
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  const div = document.createElement('div');
  div.className = 'gemini-message assistant-message';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="message-avatar"><i class="fas fa-brain"></i></div>
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
        <div class="message-avatar"><i class="fas fa-${msg.role === 'user' ? 'user-circle' : 'brain'}"></i></div>
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

console.log("✅ Full Power Gemini Loaded - No Limits!");