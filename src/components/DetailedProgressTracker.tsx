
import React, { useState } from 'react';
import { ProjectStage, DetailedSubStep } from '@/lib/data';
import StatusBadge from './StatusBadge';
import { CheckCircle2, Clock, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';

interface DetailedProgressTrackerProps {
  stages: ProjectStage[];
}

const DetailedProgressTracker: React.FC<DetailedProgressTrackerProps> = ({ stages }) => {
  const totalStages = stages.length;
  const completedStages = stages.filter(stage => stage.status === 'completed').length;
  const overallProgress = Math.round((completedStages / totalStages) * 100);
  
  // Track which stages are expanded
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>(
    stages.reduce((acc, stage) => ({
      ...acc,
      [stage.id]: stage.status === 'in-progress'
    }), {})
  );
  
  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Detailed Project Progress</h3>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-quicksite-blue/10 flex items-center justify-center text-sm font-semibold text-quicksite-blue">
            {overallProgress}%
          </div>
        </div>
      </div>
      
      <div className="w-full mb-8">
        <Progress value={overallProgress} className="h-2" />
      </div>
      
      <div className="space-y-8">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative">
            {index < stages.length - 1 && (
              <div 
                className="absolute top-12 left-4 w-0.5 h-[calc(100%-2rem)]"
                style={{ 
                  backgroundColor: stage.status === 'completed' ? '#10b981' : 
                                  stage.status === 'in-progress' ? '#0080ff' : '#e5e7eb'
                }}
              ></div>
            )}
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-300">
              <div className="flex items-start">
                <div 
                  className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    stage.status === 'completed' ? 'bg-quicksite-success text-white' : 
                    stage.status === 'in-progress' ? 'bg-quicksite-blue text-white' :
                    stage.status === 'pending' ? 'bg-quicksite-warning/20 text-quicksite-warning' :
                    'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stage.status === 'completed' ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={stage.status} size="sm" />
                      <button 
                        onClick={() => toggleStage(stage.id)}
                        className="ml-2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        {expandedStages[stage.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>
                  
                  {stage.status !== 'not-started' && (
                    <div className="w-full mb-4">
                      <Progress 
                        value={stage.percentComplete} 
                        className={`h-1.5 ${
                          stage.status === 'completed' ? 'bg-quicksite-success/30' : 
                          stage.status === 'in-progress' ? 'bg-quicksite-blue/30' : 
                          'bg-quicksite-warning/30'
                        }`}
                      />
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {expandedStages[stage.id] && stage.subSteps && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <h5 className="text-sm font-medium mb-2">Sub Steps</h5>
                          <div className="space-y-3">
                            {stage.subSteps.map((subStep) => (
                              <div key={subStep.id} className="flex items-center">
                                <div 
                                  className={`relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                    subStep.status === 'completed' ? 'bg-quicksite-success/20 text-quicksite-success' : 
                                    subStep.status === 'in-progress' ? 'bg-quicksite-blue/20 text-quicksite-blue' :
                                    subStep.status === 'pending' ? 'bg-quicksite-warning/20 text-quicksite-warning' :
                                    subStep.status === 'delayed' ? 'bg-red-100 text-red-600' :
                                    'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {subStep.status === 'completed' ? (
                                    <CheckCircle2 size={14} />
                                  ) : subStep.status === 'delayed' ? (
                                    <AlertTriangle size={14} />
                                  ) : (
                                    <Clock size={14} />
                                  )}
                                </div>
                                
                                <div className="flex-grow">
                                  <div className="flex justify-between items-start">
                                    <span className="text-sm">{subStep.name}</span>
                                    <StatusBadge status={subStep.status} size="sm" />
                                  </div>
                                  {subStep.status !== 'not-started' && (
                                    <div className="w-full mt-2">
                                      <Progress 
                                        value={subStep.percentComplete}
                                        className={`h-1 ${
                                          subStep.status === 'completed' ? 'bg-quicksite-success/30' : 
                                          subStep.status === 'in-progress' ? 'bg-quicksite-blue/30' : 
                                          subStep.status === 'delayed' ? 'bg-red-100' :
                                          'bg-quicksite-warning/30'
                                        }`}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedProgressTracker;
