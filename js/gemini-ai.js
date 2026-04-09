// ========== GEMINI AI INTEGRATION ==========

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Get from https://aistudio.google.com/app/apikey
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

let chatHistory = [];

// Create floating chat button
function initGeminiChat() {
    // Create chat widget container
    const chatWidget = document.createElement('div');
    chatWidget.id = 'geminiChatWidget';
    chatWidget.innerHTML = `
        <button class="gemini-chat-btn" id="geminiChatBtn">
            <i class="fas fa-robot"></i>
        </button>
        <div class="gemini-chat-window" id="geminiChatWindow" style="display: none;">
            <div class="gemini-chat-header">
                <span><i class="fas fa-robot"></i> AI Assistant</span>
                <button class="gemini-close-btn" id="geminiCloseBtn">&times;</button>
            </div>
            <div class="gemini-chat-messages" id="geminiMessages">
                <div class="gemini-message bot">
                    <i class="fas fa-robot"></i>
                    <p>👋 Hi! I'm your Pixel Academy AI assistant. Ask me anything about books, studying, or research!</p>
                </div>
            </div>
            <div class="gemini-chat-input">
                <input type="text" id="geminiInput" placeholder="Type your question...">
                <button id="geminiSendBtn"><i class="fas fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .gemini-chat-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4285f4, #8b5cf6);
            color: white;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: transform 0.2s;
        }
        .gemini-chat-btn:hover {
            transform: scale(1.1);
        }
        .gemini-chat-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .gemini-chat-header {
            background: linear-gradient(135deg, #4285f4, #8b5cf6);
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .gemini-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
        .gemini-chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .gemini-message {
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }
        .gemini-message.user {
            flex-direction: row-reverse;
        }
        .gemini-message i {
            width: 32px;
            height: 32px;
            background: #e0e7ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #4285f4;
        }
        .gemini-message.user i {
            background: #4285f4;
            color: white;
        }
        .gemini-message p {
            background: #f3f4f6;
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 75%;
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        .gemini-message.user p {
            background: #4285f4;
            color: white;
        }
        .gemini-chat-input {
            padding: 16px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 10px;
        }
        .gemini-chat-input input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 30px;
            font-size: 0.9rem;
            outline: none;
        }
        .gemini-chat-input input:focus {
            border-color: #4285f4;
        }
        .gemini-chat-input button {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: #4285f4;
            color: white;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
        }
        .gemini-chat-input button:hover {
            background: #3367d6;
        }
        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
        }
        .typing-indicator span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #9ca3af;
            animation: typing 1.4s infinite;
        }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-8px); opacity: 1; }
        }
        @media (max-width: 500px) {
            .gemini-chat-window {
                width: 100%;
                height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
        }
        body.dark .gemini-chat-window {
            background: #1c1c1e;
        }
        body.dark .gemini-message p {
            background: #2c2c2e;
            color: #e5e5ea;
        }
        body.dark .gemini-chat-input input {
            background: #2c2c2e;
            border-color: #3a3a3c;
            color: white;
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    document.getElementById('geminiChatBtn').addEventListener('click', () => {
        document.getElementById('geminiChatWindow').style.display = 'flex';
        document.getElementById('geminiChatBtn').style.display = 'none';
    });
    
    document.getElementById('geminiCloseBtn').addEventListener('click', () => {
        document.getElementById('geminiChatWindow').style.display = 'none';
        document.getElementById('geminiChatBtn').style.display = 'block';
    });
    
    document.getElementById('geminiSendBtn').addEventListener('click', sendGeminiMessage);
    document.getElementById('geminiInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendGeminiMessage();
    });
}

async function sendGeminiMessage() {
    const input = document.getElementById('geminiInput');
    const message = input.value.trim();
    if (!message) return;
    
    input.value = '';
    
    // Add user message
    addGeminiMessage('user', message);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const context = `You are a helpful AI assistant for Pixel Academy, a digital library app for students. 
        Provide helpful, educational responses about books, studying, research, and academic topics. 
        Keep responses concise and friendly.`;
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${context}\n\nUser: ${message}\nAssistant:` }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
            })
        });
        
        const data = await response.json();
        removeTypingIndicator();
        
        if (data.candidates && data.candidates[0]) {
            const reply = data.candidates[0].content.parts[0].text;
            addGeminiMessage('bot', reply);
        } else {
            addGeminiMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        removeTypingIndicator();
        addGeminiMessage('bot', 'Sorry, there was an error connecting. Please try again.');
    }
}

function addGeminiMessage(sender, text) {
    const messages = document.getElementById('geminiMessages');
    const div = document.createElement('div');
    div.className = `gemini-message ${sender}`;
    div.innerHTML = `
        <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
        <p>${text.replace(/\n/g, '<br>')}</p>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    const messages = document.getElementById('geminiMessages');
    const div = document.createElement('div');
    div.className = 'gemini-message bot';
    div.id = 'typingIndicator';
    div.innerHTML = `
        <i class="fas fa-robot"></i>
        <div class="typing-indicator"><span></span><span></span><span></span></div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// Initialize when page loads
if (document.readyState === 'complete') {
    initGeminiChat();
} else {
    window.addEventListener('load', initGeminiChat);
}