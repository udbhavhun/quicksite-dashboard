
import React, { useState } from 'react';
import { Order, ProjectStage } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, FileText, MessageSquare } from 'lucide-react';

export interface ProjectTimelineProps {
  order: Order;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ order }) => {
  const stages = order.stages || [];
  
  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time helper
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Get icon for update type
  const getUpdateIcon = (type: string) => {
    switch(type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'file':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'update':
      default:
        return <Clock className="h-4 w-4 text-green-500" />;
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 border-l-2 border-gray-200 space-y-10">
          {stages.map((stage) => (
            <div key={stage.id} className="relative">
              <div className="absolute -left-[25px] top-0 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                {stage.status === 'completed' ? (
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                ) : stage.status === 'in-progress' ? (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                ) : (
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                )}
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{stage.name}</h3>
                  <Badge 
                    variant={
                      stage.status === 'completed' ? 'default' : 
                      stage.status === 'in-progress' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {stage.status.charAt(0).toUpperCase() + stage.status.slice(1).replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-gray-500 text-sm mt-1">{stage.description}</p>
              </div>
              
              {stage.updates && stage.updates.length > 0 && (
                <div className="border rounded-md p-4 bg-gray-50 mt-4">
                  <h4 className="text-sm font-medium mb-3">Updates</h4>
                  <div className="space-y-4">
                    {stage.updates.map((update, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <Separator className="my-3" />}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getUpdateIcon(update.type)}
                            <span className="font-medium text-sm">{update.title}</span>
                            <div className="flex items-center ml-auto text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{formatDate(update.date)}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 ml-6">{update.description}</p>
                          {update.link && (
                            <a 
                              href={update.link} 
                              className="text-xs text-blue-500 hover:underline ml-6 block mt-1"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              View attachment →
                            </a>
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
