import { useState, useEffect, useRef } from 'react';
import styles from './ChatSystem.module.css';
import images from '../../../../images';
import { startChatSession, sendChatMessage } from '../../../../api/chatapi';

const ChatSystem = () => {
  // State Management
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]); // Array of { role: 'bob' | 'user', text: string }
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroller reference
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  // Boot up the chat when the component loads
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        const data = await startChatSession();
        setSessionId(data.session_id);
        setMessages([{ role: 'bob', text: data.bob_message }]);
      } catch (error) {
        // OFFLINE FALLBACK: So you can test the UI while the backend is down!
        setSessionId("dummy_offline_session_123");
        setMessages([{ role: 'bob', text: "Hey! I'm Bob. The backend API is offline right now, but you can test my UI!" }]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault(); 
    
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue(""); 

    // 1. Add User message to UI instantly
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    // 2. Format chat history for the API
    const chatHistory = messages.map(msg => ({ role: msg.role, content: msg.text }));

    try {
      setIsLoading(true);
      
      // 3. Call the external API file
      const response = await sendChatMessage(sessionId, userText, chatHistory);
      
      // 4. Add Bob's response to UI
      setMessages(prev => [...prev, { role: 'bob', text: response.bob_message }]);
      
      console.log("Current Funnel Stage:", response.funnel_stage);

    } catch (error) {
      // OFFLINE FALLBACK: Simulates Bob typing so you can test the scroll!
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bob', text: `[Offline Mode] I received: "${userText}". Connect my API to get real answers!` }]);
        setIsLoading(false); // Make sure to turn off loading in the fallback timeout
      }, 1000);
    } finally {
      // THE FIX: Always turn off the typing indicator when the live API finishes
      setIsLoading(false); 
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <section className={styles.chatSection}>
      
      {/* Title */}
      <h2 className={styles.title}>
        Meet Bob, your go-to guy for all<br />
        things <span className={styles.brandText}>Ferrn</span>
      </h2>

      {/* Chat Window */}
      <div className={styles.chatContainer}>
        
        <div className={styles.chatBox}>
          {/* Dynamic Message Rendering */}
          {messages.map((msg, index) => (
            msg.role === 'user' ? (
              /* User Message Row */
              <div key={index} className={styles.messageRowRight}>
                <div className={styles.bubbleRight}>{msg.text}</div>
                <div className={styles.avatarUser}>U</div>
              </div>
            ) : (
              /* Bob Message Row */
              <div key={index} className={styles.messageRowLeft}>
                <div className={styles.avatarBob}>
                  <img src={images.avatarBob} alt="Bob" className={styles.bobIcon} /> 
                </div>
                <div className={styles.bubbleLeft}>
                  {msg.text}
                </div>
              </div>
            )
          ))}

          {/* Loading Indicator for when Bob is "typing" */}
          {isLoading && messages.length > 0 && (
             <div className={styles.messageRowLeft}>
               <div className={styles.avatarBob}>
                 <img src={images.avatarBob} alt="Bob" className={styles.bobIcon} /> 
               </div>
               <div className={styles.bubbleLeft} style={{ opacity: 0.7 }}>
                 Bob is typing...
               </div>
             </div>
          )}

          {/* Invisible div to anchor the auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputArea}>
          <input 
            type="text" 
            placeholder="Ask Bob your questions..." 
            className={styles.chatInput} 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading} 
          />
          <button 
            className={styles.sendButton} 
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>

      {/* Bottom Button */}
      <button className={styles.customQuestionBtn}>
        I have a custom question Bob!
      </button>

    </section>
  );
};

export default ChatSystem;