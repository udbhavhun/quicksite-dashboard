
import React, { useState } from 'react';
import { ProjectStage } from '@/lib/data';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Trophy, Zap, Server, Globe, Palette, Code, Flask } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface GamifiedProgressTrackerProps {
  stages: ProjectStage[];
}

const GamifiedProgressTracker: React.FC<GamifiedProgressTrackerProps> = ({ stages }) => {
  const totalStages = stages.length;
  const completedStages = stages.filter(stage => stage.status === 'completed').length;
  const overallProgress = Math.round((completedStages / totalStages) * 100);
  
  // Stage icons mapping
  const stageIcons: Record<string, React.ReactNode> = {
    'domain': <Globe className="h-5 w-5" />,
    'hosting': <Server className="h-5 w-5" />,
    'design': <Palette className="h-5 w-5" />,
    'development': <Code className="h-5 w-5" />,
    'testing': <Flask className="h-5 w-5" />
  };
  
  // Get icon or default
  const getStageIcon = (stageName: string) => {
    const key = Object.keys(stageIcons).find(key => stageName.toLowerCase().includes(key));
    return key ? stageIcons[key] : <Clock className="h-5 w-5" />;
  };
  
  // Calculate achievements
  const achievements = [
    { id: 'kick-off', title: 'Project Kick-off', icon: <Zap size={18} />, unlocked: true },
    { id: 'domain', title: 'Domain Secured', icon: <Globe size={18} />, unlocked: stages.some(s => s.name.includes('Domain') && s.status === 'completed') },
    { id: 'hosting', title: 'Hosting Ready', icon: <Server size={18} />, unlocked: stages.some(s => s.name.includes('Hosting') && s.status === 'completed') },
    { id: 'design', title: 'Design Approved', icon: <Palette size={18} />, unlocked: stages.some(s => s.name.includes('Design') && s.status === 'completed') },
    { id: 'halfway', title: 'Halfway There', icon: <Trophy size={18} />, unlocked: overallProgress >= 50 },
    { id: 'launch', title: 'Ready to Launch', icon: <CheckCircle2 size={18} />, unlocked: overallProgress === 100 }
  ];
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gradient">Project Progression</h3>
          <p className="text-sm text-gray-600 mt-1">Track your website build journey</p>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-quicksite-blue to-quicksite-dark-blue flex items-center justify-center text-lg font-bold text-white shadow-lg">
          {overallProgress}%
        </div>
      </div>
      
      {/* Achievements Section */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`achievement-badge p-1 ${achievement.unlocked ? '' : 'opacity-40'}`}
            >
              <div 
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
                  achievement.unlocked 
                    ? 'bg-quicksite-blue/10 text-quicksite-blue' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <div>{achievement.icon}</div>
                <span>{achievement.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Timeline Section */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Progress Timeline</h4>
        <div className="timeline-track">
          <div className="timeline-progress" style={{ width: `${overallProgress}%` }}></div>
          
          {stages.map((stage, index) => {
            const position = (index / (stages.length - 1)) * 100;
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'in-progress';
            
            return (
              <div 
                key={stage.id} 
                className={`timeline-point ${
                  isCompleted ? 'timeline-point-completed' : 
                  isActive ? 'timeline-point-active' : 'timeline-point-upcoming'
                }`}
                style={{ left: `${position}%` }}
              >
                <span className="timeline-label">{stage.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Detailed Stages Accordion */}
      <div className="mt-10">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Detailed Breakdown</h4>
        <Accordion type="single" collapsible className="w-full">
          {stages.map((stage, index) => (
            <AccordionItem key={stage.id} value={stage.id} className="border-b border-white/20">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center space-x-3 text-left">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.status === 'completed' ? 'bg-quicksite-success/20 text-quicksite-success' : 
                    stage.status === 'in-progress' ? 'bg-quicksite-blue/20 text-quicksite-blue' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {getStageIcon(stage.name)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{stage.name}</span>
                      <StatusBadge status={stage.status} size="sm" className="ml-2" />
                    </div>
                    {stage.status !== 'not-started' && (
                      <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full ${
                            stage.status === 'completed' ? 'bg-quicksite-success' : 
                            'bg-quicksite-blue'
                          }`}
                          style={{ width: `${stage.percentComplete}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-0">
                <Card className="border border-white/10 bg-white/40">
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-600 mb-4">{stage.description}</p>
                    
                    {stage.subSteps && stage.subSteps.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-xs font-medium text-gray-500">DETAILED STEPS</h5>
                        {stage.subSteps.map((subStep) => (
                          <div key={subStep.id} className="flex items-start">
                            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                              subStep.status === 'completed' ? 'bg-quicksite-success/20 text-quicksite-success' : 
                              subStep.status === 'in-progress' ? 'bg-quicksite-blue/20 text-quicksite-blue' :
                              'bg-gray-100 text-gray-400'
                            }`}>
                              {subStep.status === 'completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{subStep.name}</span>
                                <StatusBadge status={subStep.status} size="sm" />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{subStep.description}</p>
                              {subStep.status !== 'not-started' && (
                                <Progress 
                                  value={subStep.percentComplete} 
                                  className="h-1 mt-2" 
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {stage.status === 'in-progress' && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center text-quicksite-blue text-sm">
                          <Zap size={16} className="mr-2" />
                          <span>Currently in progress - estimated completion in 3 days</span>
                        </div>
                      </div>
                    )}
                    
                    {stage.status === 'pending' && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center text-quicksite-warning text-sm">
                          <Clock size={16} className="mr-2" />
                          <span>Waiting for your input - check your notifications</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default GamifiedProgressTracker;
