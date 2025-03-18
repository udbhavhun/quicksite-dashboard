
import React from 'react';
import { ProjectStage } from '@/lib/data';
import StatusBadge from './StatusBadge';
import { CheckCircle2, Clock } from 'lucide-react';

interface ProgressTrackerProps {
  stages: ProjectStage[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stages }) => {
  const totalStages = stages.length;
  const completedStages = stages.filter(stage => stage.status === 'completed').length;
  const overallProgress = Math.round((completedStages / totalStages) * 100);
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Project Progress</h3>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-quicksite-blue/10 flex items-center justify-center text-sm font-semibold text-quicksite-blue">
            {overallProgress}%
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
        <div 
          className="bg-quicksite-blue h-2 rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${overallProgress}%` }}
        ></div>
      </div>
      
      <div className="space-y-6">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative">
            {index < stages.length - 1 && (
              <div 
                className="absolute top-8 left-4 w-0.5 h-16 bg-gray-200"
                style={{ 
                  backgroundColor: stage.status === 'completed' ? '#10b981' : 
                                  stage.status === 'in-progress' ? '#0080ff' : '#e5e7eb'
                }}
              ></div>
            )}
            
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
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{stage.name}</h4>
                  <StatusBadge status={stage.status} size="sm" />
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                
                {stage.status !== 'not-started' && (
                  <div className="w-full bg-gray-100 h-1.5 rounded-full">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-1000 ease-in-out ${
                        stage.status === 'completed' ? 'bg-quicksite-success' : 
                        stage.status === 'in-progress' ? 'bg-quicksite-blue' : 
                        'bg-quicksite-warning'
                      }`}
                      style={{ width: `${stage.percentComplete}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
