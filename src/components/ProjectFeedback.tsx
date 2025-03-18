
import React, { useState } from 'react';
import { Order, FeedbackItem } from '@/lib/data';
import { MessageSquare, Check, Star, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectFeedbackProps {
  order: Order;
  userType?: 'customer' | 'admin';
}

const ProjectFeedback: React.FC<ProjectFeedbackProps> = ({ order, userType = 'customer' }) => {
  const [newMessage, setNewMessage] = useState('');
  
  const feedbackItems = order.feedback || [];
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <h3 className="text-xl font-semibold mb-6">Project Feedback & Communication</h3>
      
      {userType === 'admin' && order.rating && (
        <div className="mb-6 flex items-center p-4 bg-blue-50 rounded-lg">
          <div className="mr-4">
            <div className="text-lg font-bold text-blue-700">{order.rating.score}/5</div>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < order.rating.score ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Client Satisfaction Rating</div>
            <div className="text-xs text-gray-600">{order.rating.comment}</div>
          </div>
        </div>
      )}
      
      <div className="h-[400px] flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {feedbackItems.length > 0 ? (
            feedbackItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${item.sender === 'client' ? 'justify-end' : ''}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    item.sender === 'client' 
                      ? 'bg-quicksite-blue/10 text-quicksite-blue rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium">
                      {item.sender === 'client' ? 'You' : 'Project Manager'}
                    </span>
                    <span className="text-xs opacity-70 ml-2">
                      {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm">{item.message}</p>
                  
                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.attachments.map((attachment, idx) => (
                        <a 
                          key={idx}
                          href={attachment.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded flex items-center"
                        >
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z" fill="currentColor"/>
                          </svg>
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  )}
                  
                  {userType === 'admin' && item.sender === 'client' && (
                    <div className="mt-2 flex gap-2">
                      <button className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                        <ThumbsUp size={12} className="mr-1" /> Helpful
                      </button>
                      <button className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center">
                        <Check size={12} className="mr-1" /> Acknowledge
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Send a message to get started</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-quicksite-blue focus:border-transparent"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-quicksite-blue text-white px-4 py-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex justify-between mt-2">
            <button className="text-xs text-gray-500 flex items-center">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z" fill="currentColor"/>
              </svg>
              Attach File
            </button>
            
            {userType === 'customer' && (
              <button className="text-xs text-quicksite-blue">
                Request Priority Support
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFeedback;
