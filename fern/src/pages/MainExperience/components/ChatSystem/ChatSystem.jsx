import { useState, useEffect, useRef } from 'react';
import { BiSolidSend } from "react-icons/bi"; 
import styles from './ChatSystem.module.css';
import images from '../../../../images';
import { startChatSession, sendChatMessage } from '../../../../api/chatapi';

// --- THE LINK SCANNER ---
// This regex hunts down any URLs in a string and wraps them in a clickable React <a> tag
const renderMessageWithLinks = (text) => {
  if (!text) return null;
  
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: "underline", fontWeight: "600", wordBreak: "break-all" }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const ChatSystem = () => {
  // State Management
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroller reference
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
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

    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    const chatHistory = messages.map(msg => ({ role: msg.role, content: msg.text }));

    try {
      setIsLoading(true);
      
      const response = await sendChatMessage(sessionId, userText, chatHistory);
      setMessages(prev => [...prev, { role: 'bob', text: response.bob_message }]);
      
      console.log("Current Funnel Stage:", response.funnel_stage);

    } catch (error) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bob', text: `[Offline Mode] I received: "${userText}". Connect my API to get real answers!` }]);
        setIsLoading(false); 
      }, 1000);
    } finally {
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
          {messages.map((msg, index) => (
            msg.role === 'user' ? (
              <div key={index} className={styles.messageRowRight}>
                {/* APPLIED THE LINK SCANNER HERE */}
                <div className={styles.bubbleRight}>{renderMessageWithLinks(msg.text)}</div>
                <div className={styles.avatarUser}>U</div>
              </div>
            ) : (
              <div key={index} className={styles.messageRowLeft}>
                <div className={styles.avatarBob}>
                  <img src={images.avatarBob} alt="Bob" className={styles.bobIcon} /> 
                </div>
                {/* APPLIED THE LINK SCANNER HERE */}
                <div className={styles.bubbleLeft}>
                  {renderMessageWithLinks(msg.text)}
                </div>
              </div>
            )
          ))}

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
            <BiSolidSend size={22} color="white" />
          </button>
        </div>

      </div>

      {/* Bottom Button (Now links directly to Cal.com) */}
      <button 
        className={styles.customQuestionBtn}
        onClick={() => window.open('https://cal.com/ferrn-agency/discovery-call', '_blank')}
      >
        Book a call, before Spaces are filled
      </button>

    </section>
  );
};

export default ChatSystem;