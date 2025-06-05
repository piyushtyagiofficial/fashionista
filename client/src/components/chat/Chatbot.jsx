import { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/auth/AuthContext';
import axios from 'axios';
import Loader from '../common/Loader';
import api from '../../utils/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      content: 'Hello! How can I help you with your fashion needs today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isAuthenticated } = useContext(AuthContext);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Send message to server if authenticated
      if (isAuthenticated) {
        const response = await api.post(`/chatbot/message`, {
          message: userMessage.content
        });
        
        // Add bot response
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            content: response.data.message,
            timestamp: new Date(response.data.timestamp)
          }
        ]);
      } else {
        // Simulate bot response for non-authenticated users
        setTimeout(() => {
          const responses = [
            "I'd be happy to help you with that! To get personalized assistance, please log in or create an account.",
            "That's a great question about our products. For detailed information, please sign in to your account.",
            "Thanks for your interest! To access all our features and get help with your fashion needs, please log in first."
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          setMessages(prev => [
            ...prev,
            {
              sender: 'bot',
              content: randomResponse,
              timestamp: new Date()
            }
          ]);
        }, 1000);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-4 shadow-lg z-50 hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 150px)' }}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Chat Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <h3 className="font-medium">Fashion Assistant</h3>
              <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Online</span>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ minHeight: '300px', maxHeight: '400px' }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary-100 text-primary-900'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                    <Loader size="small" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t p-4 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md hover:bg-primary-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;