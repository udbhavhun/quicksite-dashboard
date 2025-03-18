
import React, { useState } from 'react';
import { Order, CustomerRequirement } from '@/lib/data';
import { CheckCircle, X, ChevronDown, ChevronUp, PenSquare, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerRequirementsProps {
  order: Order;
  userType?: 'customer' | 'admin';
}

const CustomerRequirements: React.FC<CustomerRequirementsProps> = ({ order, userType = 'customer' }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'design': true
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const renderRequirement = (req: CustomerRequirement) => {
    return (
      <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100 mb-3">
        <div className="mr-3 mt-1">
          {req.fulfilled ? (
            <CheckCircle className="h-5 w-5 text-quicksite-success" />
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
            <h4 className="font-medium text-sm">{req.title}</h4>
            <div className="flex items-center mt-1 sm:mt-0">
              {req.fulfilled && (
                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                  Fulfilled
                </span>
              )}
              {!req.fulfilled && userType === 'admin' && (
                <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full">
                  Pending
                </span>
              )}
              {req.priority === 'high' && (
                <span className="ml-2 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                  High Priority
                </span>
              )}
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mb-2">{req.description}</p>
          
          {userType === 'admin' && (
            <div className="flex gap-2">
              <button className="text-xs bg-quicksite-blue text-white px-2 py-0.5 rounded flex items-center">
                <CheckCircle size={12} className="mr-1" /> Mark as Fulfilled
              </button>
              <button className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded flex items-center">
                <MessageSquare size={12} className="mr-1" /> Request Clarification
              </button>
            </div>
          )}
          
          {req.feedback && (
            <div className="mt-2 p-2 bg-blue-50 text-xs text-blue-800 rounded">
              <span className="font-medium">Feedback:</span> {req.feedback}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Group requirements by category
  const requirementsByCategory: Record<string, CustomerRequirement[]> = {};
  
  order.requirements?.forEach(req => {
    if (!requirementsByCategory[req.category]) {
      requirementsByCategory[req.category] = [];
    }
    requirementsByCategory[req.category].push(req);
  });
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Project Requirements</h3>
        
        {userType === 'customer' && (
          <button className="flex items-center text-sm text-quicksite-blue">
            <PenSquare size={16} className="mr-1" /> Edit Requirements
          </button>
        )}
      </div>
      
      {Object.entries(requirementsByCategory).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(requirementsByCategory).map(([category, reqs]) => (
            <div key={category} className="border border-gray-100 rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleSection(category)}
              >
                <h4 className="font-medium capitalize">{category} Requirements</h4>
                <div className="flex items-center">
                  <span className="text-sm mr-2">
                    {reqs.filter(r => r.fulfilled).length}/{reqs.length} Completed
                  </span>
                  {expandedSections[category] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
              
              <AnimatePresence>
                {expandedSections[category] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 overflow-hidden"
                  >
                    {reqs.map((req) => renderRequirement(req))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <p className="text-gray-500">No requirements have been submitted yet.</p>
          {userType === 'customer' && (
            <button className="mt-4 flex items-center mx-auto text-sm text-quicksite-blue">
              <PenSquare size={16} className="mr-1" /> Add Requirements
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerRequirements;
