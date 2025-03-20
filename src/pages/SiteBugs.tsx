
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { AlertTriangle, Bug, Check, ChevronDown, ChevronUp, Filter, MessageSquare, Plus, Trash2, UserPlus, X } from 'lucide-react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

type BugStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
type BugPriority = 'low' | 'medium' | 'high' | 'critical';

interface Bug {
  id: string;
  title: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  reporter: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  comments: {
    id: string;
    user: string;
    text: string;
    date: string;
  }[];
}

const mockBugs: Bug[] = [
  {
    id: 'BUG-001',
    title: 'Mobile menu not working on iOS devices',
    description: 'The hamburger menu is not responding to taps on iOS devices, specifically iPhone 12 and newer.',
    status: 'open',
    priority: 'high',
    reporter: 'John Doe',
    assignee: 'Tech Team',
    createdAt: '2023-11-20T10:30:00Z',
    updatedAt: '2023-11-21T14:15:00Z',
    comments: [
      {
        id: 'c1',
        user: 'John Doe',
        text: 'This is happening consistently on my iPhone 13.',
        date: '2023-11-20T10:35:00Z'
      },
      {
        id: 'c2',
        user: 'Tech Team',
        text: 'We are investigating this issue. Could you please provide the iOS version?',
        date: '2023-11-21T14:15:00Z'
      }
    ]
  },
  {
    id: 'BUG-002',
    title: 'Contact form submissions not being received',
    description: 'Customers have reported that contact form submissions are not being delivered to the inbox.',
    status: 'in-progress',
    priority: 'critical',
    reporter: 'Admin User',
    assignee: 'Backend Team',
    createdAt: '2023-11-18T08:45:00Z',
    updatedAt: '2023-11-19T11:20:00Z',
    comments: [
      {
        id: 'c3',
        user: 'Admin User',
        text: 'Multiple customers have reported this issue. Please prioritize.',
        date: '2023-11-18T08:50:00Z'
      },
      {
        id: 'c4',
        user: 'Backend Team',
        text: 'We identified an issue with the email service provider. Working on a fix.',
        date: '2023-11-19T11:20:00Z'
      }
    ]
  },
  {
    id: 'BUG-003',
    title: 'Images not loading on the product page',
    description: 'Some product images are not loading properly, showing a broken image icon instead.',
    status: 'resolved',
    priority: 'medium',
    reporter: 'Sales Team',
    assignee: 'Frontend Team',
    createdAt: '2023-11-15T13:20:00Z',
    updatedAt: '2023-11-17T09:10:00Z',
    comments: [
      {
        id: 'c5',
        user: 'Sales Team',
        text: 'This is affecting about 20% of products.',
        date: '2023-11-15T13:25:00Z'
      },
      {
        id: 'c6',
        user: 'Frontend Team',
        text: 'Fixed an issue with the image CDN. Should be resolved now.',
        date: '2023-11-17T09:10:00Z'
      }
    ]
  },
  {
    id: 'BUG-004',
    title: 'Checkout process hangs at payment step',
    description: 'Users are reporting that the checkout process freezes when reaching the payment method selection.',
    status: 'open',
    priority: 'critical',
    reporter: 'Customer Support',
    createdAt: '2023-11-21T15:40:00Z',
    updatedAt: '2023-11-21T15:40:00Z',
    comments: []
  },
  {
    id: 'BUG-005',
    title: 'Blog post formatting issues',
    description: 'Some blog posts are displaying with broken formatting, particularly those with embedded videos.',
    status: 'closed',
    priority: 'low',
    reporter: 'Content Team',
    assignee: 'Frontend Team',
    createdAt: '2023-11-10T09:15:00Z',
    updatedAt: '2023-11-12T16:30:00Z',
    comments: [
      {
        id: 'c7',
        user: 'Frontend Team',
        text: 'This was caused by a CSS conflict. Fixed in the latest update.',
        date: '2023-11-12T16:30:00Z'
      }
    ]
  }
];

const SiteBugs = () => {
  const { userName, userType } = useUserStore();
  const [bugs, setBugs] = useState<Bug[]>(mockBugs);
  const [filteredBugs, setFilteredBugs] = useState<Bug[]>(mockBugs);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BugStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<BugPriority | 'all'>('all');
  const [expandedBugId, setExpandedBugId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isAddingBug, setIsAddingBug] = useState(false);
  const [newBug, setNewBug] = useState<Partial<Bug>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open'
  });
  
  const applyFilters = () => {
    let filtered = bugs;
    
    if (searchQuery) {
      filtered = filtered.filter(bug => 
        bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bug => bug.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(bug => bug.priority === priorityFilter);
    }
    
    setFilteredBugs(filtered);
  };
  
  React.useEffect(() => {
    applyFilters();
  }, [bugs, searchQuery, statusFilter, priorityFilter]);
  
  const toggleBugDetails = (bugId: string) => {
    if (expandedBugId === bugId) {
      setExpandedBugId(null);
    } else {
      setExpandedBugId(bugId);
    }
  };
  
  const addComment = (bugId: string) => {
    if (!newComment.trim()) return;
    
    const updatedBugs = bugs.map(bug => {
      if (bug.id === bugId) {
        return {
          ...bug,
          comments: [
            ...bug.comments,
            {
              id: `c${Date.now()}`,
              user: userName,
              text: newComment,
              date: new Date().toISOString()
            }
          ],
          updatedAt: new Date().toISOString()
        };
      }
      return bug;
    });
    
    setBugs(updatedBugs);
    setNewComment('');
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully."
    });
  };
  
  const handleBugSubmit = () => {
    if (!newBug.title || !newBug.description) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const createdAt = new Date().toISOString();
    const newBugItem: Bug = {
      id: `BUG-${(bugs.length + 1).toString().padStart(3, '0')}`,
      title: newBug.title!,
      description: newBug.description!,
      status: newBug.status as BugStatus || 'open',
      priority: newBug.priority as BugPriority || 'medium',
      reporter: userName,
      createdAt,
      updatedAt: createdAt,
      comments: []
    };
    
    setBugs([newBugItem, ...bugs]);
    setIsAddingBug(false);
    setNewBug({
      title: '',
      description: '',
      priority: 'medium',
      status: 'open'
    });
    
    toast({
      title: "Bug reported",
      description: "Your bug report has been submitted successfully."
    });
  };
  
  const getBugStatusColor = (status: BugStatus) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getBugPriorityColor = (priority: BugPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-700';
      case 'medium':
        return 'bg-blue-100 text-blue-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'critical':
        return 'bg-red-100 text-red-700';
    }
  };
  
  return (
    <div className="min-h-screen w-full flex">
      <AppSidebar />
      <SidebarInset className="overflow-auto">
        <Header userName={userName} />
        
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <SidebarTrigger className="mr-2 sm:hidden" />
                    <h1 className="text-3xl font-bold text-gradient">Site Bugs</h1>
                  </div>
                  <p className="text-gray-600">Track and manage website issues</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Dialog open={isAddingBug} onOpenChange={setIsAddingBug}>
                    <DialogTrigger asChild>
                      <Button className="micro-bounce">
                        <Plus size={16} className="mr-2" />
                        Report Bug
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Report a Bug</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                          <Input
                            value={newBug.title || ''}
                            onChange={(e) => setNewBug({...newBug, title: e.target.value})}
                            placeholder="Brief description of the issue"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                          <Textarea
                            value={newBug.description || ''}
                            onChange={(e) => setNewBug({...newBug, description: e.target.value})}
                            placeholder="Detailed description of the bug, including steps to reproduce"
                            className="min-h-[120px]"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                            <select
                              value={newBug.priority || 'medium'}
                              onChange={(e) => setNewBug({...newBug, priority: e.target.value as BugPriority})}
                              className="w-full rounded-md border border-gray-300 p-2 text-sm"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                            </select>
                          </div>
                          
                          {userType === 'admin' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                              <select
                                value={newBug.status || 'open'}
                                onChange={(e) => setNewBug({...newBug, status: e.target.value as BugStatus})}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm"
                              >
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" onClick={() => setIsAddingBug(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleBugSubmit}>
                            Submit Bug
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-6 flex items-center justify-center lg:col-span-1"
              >
                <div className="text-center">
                  <div className="bg-red-50 p-3 rounded-full inline-flex mx-auto mb-2">
                    <AlertTriangle size={24} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold">{bugs.filter(b => b.status === 'open').length}</h3>
                  <p className="text-gray-600">Open Bugs</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="glass-card p-6 flex items-center justify-center lg:col-span-1"
              >
                <div className="text-center">
                  <div className="bg-blue-50 p-3 rounded-full inline-flex mx-auto mb-2">
                    <Bug size={24} className="text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold">{bugs.filter(b => b.status === 'in-progress').length}</h3>
                  <p className="text-gray-600">In Progress</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="glass-card p-6 flex items-center justify-center lg:col-span-1"
              >
                <div className="text-center">
                  <div className="bg-green-50 p-3 rounded-full inline-flex mx-auto mb-2">
                    <Check size={24} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold">{bugs.filter(b => b.status === 'resolved').length}</h3>
                  <p className="text-gray-600">Resolved</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="glass-card p-6 flex items-center justify-center lg:col-span-1"
              >
                <div className="text-center">
                  <div className="bg-gray-50 p-3 rounded-full inline-flex mx-auto mb-2">
                    <X size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold">{bugs.filter(b => b.status === 'closed').length}</h3>
                  <p className="text-gray-600">Closed</p>
                </div>
              </motion.div>
            </div>
            
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <Input
                      placeholder="Search bugs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Bug size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as BugStatus | 'all')}
                      className="rounded-md border border-gray-300 p-2 text-sm"
                    >
                      <option value="all">All Statuses</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as BugPriority | 'all')}
                      className="rounded-md border border-gray-300 p-2 text-sm"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <Button variant="outline" size="icon" onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setPriorityFilter('all');
                  }}>
                    <X size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredBugs.length > 0 ? (
                  filteredBugs.map(bug => (
                    <motion.div
                      key={bug.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-lg border border-gray-100 overflow-hidden"
                    >
                      <div 
                        className="p-4 flex flex-wrap md:flex-nowrap items-start justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleBugDetails(bug.id)}
                      >
                        <div className="flex items-start flex-grow pr-4">
                          <div className="flex-shrink-0 mr-3">
                            <Bug size={20} className="text-gray-500 mt-1" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-wrap justify-between">
                              <h3 className="font-medium">{bug.title}</h3>
                              <div className="flex items-center mt-1 md:mt-0 text-xs text-gray-500">
                                <span className="mr-2">ID: {bug.id}</span>
                                <span>
                                  {new Date(bug.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{bug.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-3 md:mt-0 space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getBugStatusColor(bug.status)}`}>
                            {bug.status.replace('-', ' ')}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getBugPriorityColor(bug.priority)}`}>
                            {bug.priority}
                          </span>
                          <div className="ml-2">
                            {expandedBugId === bug.id ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedBugId === bug.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100 p-4"
                        >
                          <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Reported by</h4>
                                <p>{bug.reporter}</p>
                              </div>
                              {bug.assignee && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Assigned to</h4>
                                  <p>{bug.assignee}</p>
                                </div>
                              )}
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Full Description</h4>
                            <p className="text-sm whitespace-pre-line">{bug.description}</p>
                            
                            {userType === 'admin' && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {bug.status !== 'closed' && (
                                  <Button variant="outline" size="sm">
                                    <UserPlus size={14} className="mr-1" /> Assign
                                  </Button>
                                )}
                                
                                <select
                                  value={bug.status}
                                  onChange={(e) => {
                                    const updatedBugs = bugs.map(b => 
                                      b.id === bug.id ? {...b, status: e.target.value as BugStatus} : b
                                    );
                                    setBugs(updatedBugs);
                                  }}
                                  className="rounded-md border border-gray-300 text-sm py-0 h-9"
                                >
                                  <option value="open">Open</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="resolved">Resolved</option>
                                  <option value="closed">Closed</option>
                                </select>
                                
                                <select
                                  value={bug.priority}
                                  onChange={(e) => {
                                    const updatedBugs = bugs.map(b => 
                                      b.id === bug.id ? {...b, priority: e.target.value as BugPriority} : b
                                    );
                                    setBugs(updatedBugs);
                                  }}
                                  className="rounded-md border border-gray-300 text-sm py-0 h-9"
                                >
                                  <option value="low">Low</option>
                                  <option value="medium">Medium</option>
                                  <option value="high">High</option>
                                  <option value="critical">Critical</option>
                                </select>
                                
                                {bug.status !== 'closed' && (
                                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={14} className="mr-1" /> Delete
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                              Comments ({bug.comments.length})
                            </h4>
                            
                            <div className="space-y-4 mb-4">
                              {bug.comments.length > 0 ? (
                                bug.comments.map(comment => (
                                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-sm">{comment.user}</h5>
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.date).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-line">{comment.text}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[80px]"
                              />
                              <Button
                                className="self-end"
                                disabled={!newComment.trim()}
                                onClick={() => addComment(bug.id)}
                              >
                                <MessageSquare size={16} className="mr-2" />
                                Comment
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Bug size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">No bugs found matching your criteria.</p>
                    <Button className="mt-4" onClick={() => setIsAddingBug(true)}>
                      <Plus size={16} className="mr-2" />
                      Report a Bug
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default SiteBugs;
