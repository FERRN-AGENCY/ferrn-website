// src/api/chatApi.js

// THE LIVE RAILWAY URL
const BASE_URL = 'https://bob-ai.up.railway.app';

export const startChatSession = async () => {
  try {
    const response = await fetch(`${BASE_URL}/chat/start`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to start chat session');
    
    return await response.json(); 
  } catch (error) {
    console.error("Error starting live chat:", error);
    throw error; // Let the ChatSystem.jsx catch block handle the fallback
  }
};

export const sendChatMessage = async (sessionId, message, chatHistory) => {
  try {
    const response = await fetch(`${BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
        chat_history: chatHistory
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("API Validation Error:", errData);
      throw new Error('Message failed to send');
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending live message:", error);
    throw error;
  }
};