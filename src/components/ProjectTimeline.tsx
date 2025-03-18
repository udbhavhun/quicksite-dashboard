
import React, { useState } from 'react';
import { Order, StageUpdate } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageSquare, FileText, Link, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface ProjectTimelineProps {
  order: Order;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ order }) => {
  const [expandedUpdates, setExpandedUpdates] = useState<Record<string, boolean>>({});
  
  const toggleUpdate = (stageId: string) => {
    setExpandedUpdates(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };
  
  // Create a timeline of events based on stages
  const timelineEvents = order.stages.map(stage => {
    let date = "";
    let status = "";
    
    // Mock dates based on status
    if (stage.status === 'completed') {
      // Random date between order date and now
      const orderDate = new Date(order.orderDate);
      const now = new Date();
      const randomTime = orderDate.getTime() + Math.random() * (now.getTime() - orderDate.getTime());
      date = new Date(randomTime).toLocaleDateString('en-US', { 
        day: 'numeric', month: 'short', year: 'numeric' 
      });
      status = 'Completed';
    } else if (stage.status === 'in-progress') {
      date = 'In progress';
      status = 'Active';
    } else if (stage.status === 'pending') {
      date = 'Pending input';
      status = 'Waiting';
    } else {
      date = 'Upcoming';
      status = 'Not started';
    }
    
    return {
      stage,
      date,
      status
    };
  });
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <h3 className="text-xl font-semibold mb-6">Project Timeline</h3>
      
      <div className="space-y-10">
        {timelineEvents.map((event, index) => (
          <div key={event.stage.id} className="relative">
            {/* Timeline connector */}
            {index < timelineEvents.length - 1 && (
              <div 
                className={`absolute top-6 left-3 w-0.5 h-[calc(100%+2.5rem)] ${
                  event.stage.status === 'completed' ? 'bg-quicksite-success/30' : 
                  event.stage.status === 'in-progress' ? 'bg-quicksite-blue/30' : 
                  'bg-gray-200'
                }`}
              ></div>
            )}
            
            <div className="flex">
              {/* Timeline dot */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative z-10 w-6 h-6 rounded-full flex-shrink-0 mr-4 ${
                  event.stage.status === 'completed' ? 'bg-quicksite-success' : 
                  event.stage.status === 'in-progress' ? 'bg-quicksite-blue' : 
                  event.stage.status === 'pending' ? 'bg-quicksite-warning' :
                  'bg-gray-200'
                }`}
              >
                {event.stage.status === 'in-progress' && (
                  <span className="absolute top-0 left-0 w-full h-full rounded-full bg-quicksite-blue/30 animate-ping"></span>
                )}
              </motion.div>
              
              <div className="flex-grow">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                    <h4 className="font-medium">{event.stage.name}</h4>
                    <span className={`text-sm mt-1 sm:mt-0 ${
                      event.stage.status === 'completed' ? 'text-quicksite-success' : 
                      event.stage.status === 'in-progress' ? 'text-quicksite-blue' : 
                      event.stage.status === 'pending' ? 'text-quicksite-warning' :
                      'text-gray-500'
                    }`}>
                      <Calendar size={14} className="inline mr-1" />
                      {event.date}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{event.stage.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <StatusBadge status={event.stage.status} size="sm" />
                    
                    {event.stage.updates && event.stage.updates.length > 0 && (
                      <button 
                        onClick={() => toggleUpdate(event.stage.id)}
                        className="text-xs text-quicksite-blue flex items-center ml-2"
                      >
                        {expandedUpdates[event.stage.id] ? (
                          <>Hide Updates <ChevronUp size={14} className="ml-1" /></>
                        ) : (
                          <>Show Updates ({event.stage.updates.length}) <ChevronDown size={14} className="ml-1" /></>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedUpdates[event.stage.id] && event.stage.updates && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 pl-2 border-l-2 border-dashed border-gray-200">
                          {event.stage.updates.map((update, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                            >
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium">{update.title}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(update.date).toLocaleDateString('en-US', { 
                                    day: 'numeric', month: 'short'
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{update.description}</p>
                              
                              <div className="flex flex-wrap gap-2">
                                {update.type === 'message' && (
                                  <div className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                    <MessageSquare size={12} className="mr-1" /> Message
                                  </div>
                                )}
                                
                                {update.type === 'file' && (
                                  <div className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                    <FileText size={12} className="mr-1" /> File
                                  </div>
                                )}
                                
                                {update.link && (
                                  <a 
                                    href={update.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                                  >
                                    <ExternalLink size={12} className="mr-1" /> View
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline;
