
import React, { useEffect, useState } from 'react';
import { ProjectStage } from '@/lib/data';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';

interface ProjectProgressAnimationProps {
  stages: ProjectStage[];
}

const ProjectProgressAnimation: React.FC<ProjectProgressAnimationProps> = ({ stages }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const totalStages = stages.length;
  
  // Find the current active stage index
  useEffect(() => {
    const inProgressIndex = stages.findIndex(stage => stage.status === 'in-progress');
    if (inProgressIndex !== -1) {
      setActiveStageIndex(inProgressIndex);
    } else {
      // If no in-progress stage, find the first pending or not-started stage
      const pendingIndex = stages.findIndex(stage => 
        stage.status === 'pending' || stage.status === 'not-started'
      );
      
      if (pendingIndex !== -1) {
        setActiveStageIndex(pendingIndex);
      } else {
        // If all stages are completed, set to the last stage
        setActiveStageIndex(stages.length - 1);
      }
    }
  }, [stages]);
  
  const completedStages = stages.filter(stage => stage.status === 'completed').length;
  const overallProgress = Math.round((completedStages / totalStages) * 100);
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Project Progress</h3>
        <div className="text-sm text-gray-600">
          {completedStages} of {totalStages} stages completed
        </div>
      </div>
      
      <div className="relative mb-8">
        <div className="w-full h-2 bg-gray-100 rounded-full">
          <motion.div 
            className="h-2 bg-quicksite-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        
        {/* Progress light effect */}
        <motion.div 
          className="absolute top-0 left-0 h-2 w-16 bg-white/30 blur-sm rounded-full"
          initial={{ left: 0 }}
          animate={{ left: `calc(${overallProgress}% - 16px)` }}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            repeatType: "reverse",
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: activeStageIndex === index ? 1.02 : 1,
              boxShadow: activeStageIndex === index ? "0 8px 30px rgba(0, 0, 0, 0.12)" : "none"
            }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              scale: { duration: 0.3 },
              boxShadow: { duration: 0.3 }
            }}
            className={`relative overflow-hidden rounded-lg border p-4 flex items-start ${
              activeStageIndex === index ? 'border-quicksite-blue bg-quicksite-blue/5' : 'border-gray-100'
            }`}
          >
            {/* Animated highlight for active stage */}
            {activeStageIndex === index && (
              <motion.div 
                className="absolute inset-0 bg-quicksite-blue/5"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.1 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
            )}
            
            <div className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
              stage.status === 'completed' ? 'bg-quicksite-success text-white' : 
              stage.status === 'in-progress' ? 'bg-quicksite-blue text-white' :
              stage.status === 'pending' ? 'bg-quicksite-warning/20 text-quicksite-warning' :
              'bg-gray-200 text-gray-500'
            }`}>
              {stage.status === 'completed' ? (
                <CheckCircle2 size={16} />
              ) : (
                <Clock size={16} />
              )}
              
              {/* Pulse animation for in-progress stage */}
              {stage.status === 'in-progress' && (
                <motion.span 
                  className="absolute inset-0 rounded-full bg-quicksite-blue"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                  }}
                />
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-sm">{stage.name}</h4>
                {stage.status === 'completed' && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle2 size={10} className="mr-1" /> Completed
                  </span>
                )}
                {stage.status === 'in-progress' && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center">
                    <span className="h-1.5 w-1.5 bg-quicksite-blue rounded-full mr-1 animate-pulse"></span> In Progress
                  </span>
                )}
              </div>
              
              <p className="text-xs text-gray-600 mt-1 mb-2 line-clamp-2">{stage.description}</p>
              
              {stage.status !== 'not-started' && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-1.5 rounded-full ${
                      stage.status === 'completed' ? 'bg-quicksite-success' : 
                      'bg-quicksite-blue'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.percentComplete}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectProgressAnimation;
