
import React, { useState, useRef } from 'react';
import { Order, FeedbackItem, FeedbackAttachment } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Send, File, X, Image, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/userStore';

export interface ProjectFeedbackProps {
  order: Order;
}

const ProjectFeedback: React.FC<ProjectFeedbackProps> = ({ order }) => {
  const { toast } = useToast();
  const { profile } = useUserStore();
  const isAdmin = profile?.role === 'admin';
  
  const [feedback, setFeedback] = useState<FeedbackItem[]>(order.feedback || []);
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) {
      toast({
        title: "Empty message",
        description: "Please enter a message or attach a file.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate upload delay for attachments
    setTimeout(() => {
      const now = new Date().toISOString();
      
      const newFeedbackAttachments: FeedbackAttachment[] = attachments.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file), // In a real app, this would be the uploaded file URL
        type: file.type
      }));
      
      const newFeedback: FeedbackItem = {
        sender: isAdmin ? 'team' : 'client',
        message: message.trim(),
        timestamp: now,
        attachments: newFeedbackAttachments.length > 0 ? newFeedbackAttachments : undefined
      };
      
      setFeedback([...feedback, newFeedback]);
      setMessage('');
      setAttachments([]);
      setIsSubmitting(false);
      
      toast({
        title: "Feedback sent",
        description: "Your message has been sent successfully.",
      });
    }, 1000);
  };
  
  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      if (fileList.length + attachments.length > 5) {
        toast({
          title: "Too many files",
          description: "You can only attach up to 5 files at once.",
          variant: "destructive",
        });
        return;
      }
      
      // Add new files to the attachments array
      setAttachments(prevAttachments => [...prevAttachments, ...fileList]);
      
      // Clear the input value so the same file can be selected again
      e.target.value = '';
    }
  };
  
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return timestamp;
    }
  };
  
  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle>Project Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[500px]">
          <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">
            {feedback.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <p>No feedback messages yet.</p>
                  <p className="text-sm">Start the conversation by sending a message.</p>
                </div>
              </div>
            ) : (
              feedback.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex ${item.sender === 'team' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${item.sender === 'team' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <Avatar className={`h-8 w-8 ${item.sender === 'team' ? 'bg-blue-500' : 'bg-green-500'}`}>
                      <AvatarFallback>
                        {item.sender === 'team' ? 'TS' : 'CL'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`space-y-2 ${item.sender === 'team' ? 'items-start' : 'items-end'}`}>
                      <div 
                        className={`rounded-lg p-3 break-words ${
                          item.sender === 'team' 
                            ? 'bg-blue-50 text-blue-900' 
                            : 'bg-green-50 text-green-900'
                        }`}
                      >
                        {item.message}
                        
                        {item.attachments && item.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {item.attachments.map((attachment, i) => (
                              <a
                                key={i}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={attachment.name}
                                className="flex items-center p-2 rounded bg-white/50 hover:bg-white/80 transition-colors"
                              >
                                {getFileIcon(attachment.type)}
                                <span className="ml-2 text-sm truncate">{attachment.name}</span>
                                <Download className="ml-auto h-3 w-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(item.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
                {attachments.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm"
                  >
                    {getFileIcon(file.type)}
                    <span className="truncate max-w-[120px]">{file.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[80px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAttachFile}
                  disabled={isSubmitting || attachments.length >= 5}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || (!message.trim() && attachments.length === 0)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFeedback;
