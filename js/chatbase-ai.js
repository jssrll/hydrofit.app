// chatbase-ai.js - Chatbase AI Integration
class ChatbaseAI {
  constructor(apiKey, botId) {
    this.apiKey = apiKey;
    this.botId = botId;
    this.apiUrl = 'https://www.chatbase.co/api/v1';
  }

  // Send message to AI bot
  async sendMessage(message, conversationId = null) {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          botId: this.botId,
          message: message,
          conversationId: conversationId
        })
      });
      
      const data = await response.json();
      return {
        reply: data.text,
        conversationId: data.conversationId
      };
    } catch (error) {
      console.error('Chatbase error:', error);
      return { reply: 'Sorry, AI assistant is unavailable. Please try again later.', conversationId: null };
    }
  }

  // Get exercise recommendation
  async getExerciseRecommendation(goal, fitnessLevel) {
    const prompt = `I want a workout routine for ${goal} at ${fitnessLevel} fitness level. Provide exercises, sets, reps, and rest time.`;
    return await this.sendMessage(prompt);
  }

  // Get form correction tips
  async getFormTips(exerciseName) {
    const prompt = `Give me 3 key form tips for doing ${exerciseName} correctly to avoid injury.`;
    return await this.sendMessage(prompt);
  }

  // Generate personalized workout plan
  async generateWorkoutPlan(preferences) {
    const prompt = `Create a weekly workout plan based on: ${preferences}. Include warmup, main workout, and cooldown.`;
    return await this.sendMessage(prompt);
  }
}

// Embed chat widget
function initChatbaseWidget(botId) {
  window.embeddedChatbotConfig = {
    chatbotId: botId,
    domain: 'www.chatbase.co'
  };
  
  const script = document.createElement('script');
  script.src = 'https://www.chatbase.co/embed.min.js';
  script.defer = true;
  document.body.appendChild(script);
}