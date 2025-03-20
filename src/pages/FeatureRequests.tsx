
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { Lightbulb, Plus, ThumbsUp, MessageSquare, Filter, Search, ChevronUp, ChevronDown, Tag, Check, X, Calendar, User, Users } from 'lucide-react';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

type FeatureStatus = 'requested' | 'under-review' | 'planned' | 'in-progress' | 'completed' | 'declined';
type FeatureCategory = 'ui' | 'functionality' | 'performance' | 'security' | 'accessibility' | 'other';

interface Comment {
  id: string;
  user: string;
  text: string;
  date: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  category: FeatureCategory;
  upvotes: number;
  requester: string;
  createdAt: string;
  updatedAt: string;
  targetDate?: string;
  comments: Comment[];
  upvotedBy: string[];
}

const mockFeatures: Feature[] = [
  {
    id: 'F-001',
    title: 'Dark mode support',
    description: 'Add dark mode theme option for better readability in low-light environments and reduced eye strain.',
    status: 'planned',
    category: 'ui',
    upvotes: 42,
    requester: 'John Doe',
    createdAt: '2023-10-15T10:30:00Z',
    updatedAt: '2023-11-01T14:15:00Z',
    targetDate: '2023-12-15T00:00:00Z',
    upvotedBy: ['John Doe', 'Admin User'],
    comments: [
      {
        id: 'c1',
        user: 'John Doe',
        text: 'This would be great for night time browsing!',
        date: '2023-10-15T10:35:00Z'
      },
      {
        id: 'c2',
        user: 'Admin User',
        text: 'We agree! This is planned for the next major release.',
        date: '2023-11-01T14:15:00Z'
      }
    ]
  },
  {
    id: 'F-002',
    title: 'Social media sharing buttons',
    description: 'Add social media sharing buttons to product pages to allow customers to easily share products with their network.',
    status: 'in-progress',
    category: 'functionality',
    upvotes: 28,
    requester: 'Marketing Team',
    createdAt: '2023-10-20T08:45:00Z',
    updatedAt: '2023-11-10T11:20:00Z',
    targetDate: '2023-11-30T00:00:00Z',
    upvotedBy: ['Marketing Team', 'Sales Team'],
    comments: [
      {
        id: 'c3',
        user: 'Marketing Team',
        text: 'This will help increase our product visibility on social platforms.',
        date: '2023-10-20T08:50:00Z'
      },
      {
        id: 'c4',
        user: 'Development Team',
        text: 'Development has started, we should have this ready by the end of the month.',
        date: '2023-11-10T11:20:00Z'
      }
    ]
  },
  {
    id: 'F-003',
    title: 'Improved search with filters',
    description: 'Enhance the search functionality with filters for categories, price range, and other product attributes.',
    status: 'completed',
    category: 'functionality',
    upvotes: 35,
    requester: 'Sales Team',
    createdAt: '2023-09-15T13:20:00Z',
    updatedAt: '2023-10-17T09:10:00Z',
    upvotedBy: ['Sales Team', 'Marketing Team', 'John Doe'],
    comments: [
      {
        id: 'c5',
        user: 'Sales Team',
        text: 'Our customers have been asking for better search options.',
        date: '2023-09-15T13:25:00Z'
      },
      {
        id: 'c6',
        user: 'Product Team',
        text: 'This feature has been implemented and is now live!',
        date: '2023-10-17T09:10:00Z'
      }
    ]
  },
  {
    id: 'F-004',
    title: 'Mobile app for customers',
    description: 'Develop a mobile app for iOS and Android to provide a better mobile shopping experience.',
    status: 'under-review',
    category: 'functionality',
    upvotes: 60,
    requester: 'Customer Support',
    createdAt: '2023-11-01T15:40:00Z',
    updatedAt: '2023-11-10T15:40:00Z',
    upvotedBy: ['Customer Support', 'John Doe', 'Marketing Team'],
    comments: [
      {
        id: 'c7',
        user: 'Customer Support',
        text: 'Many customers have requested a dedicated mobile app.',
        date: '2023-11-01T15:45:00Z'
      },
      {
        id: 'c8',
        user: 'Product Team',
        text: 'We\'re evaluating the resources required for this feature.',
        date: '2023-11-10T15:40:00Z'
      }
    ]
  },
  {
    id: 'F-005',
    title: 'Save for later / wishlist feature',
    description: 'Allow customers to save products to a wishlist for future reference.',
    status: 'requested',
    category: 'functionality',
    upvotes: 25,
    requester: 'Jane Smith',
    createdAt: '2023-11-12T09:15:00Z',
    updatedAt: '2023-11-12T09:15:00Z',
    upvotedBy: ['Jane Smith'],
    comments: [
      {
        id: 'c9',
        user: 'Jane Smith',
        text: 'I often find products I like but am not ready to purchase yet.',
        date: '2023-11-12T09:15:00Z'
      }
    ]
  }
];

const FeatureRequests = () => {
  const { userName, userType } = useUserStore();
  const [features, setFeatures] = useState<Feature[]>(mockFeatures);
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>(mockFeatures);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<FeatureCategory | 'all'>('all');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [newFeature, setNewFeature] = useState<Partial<Feature>>({
    title: '',
    description: '',
    category: 'ui',
    status: 'requested'
  });
  
  const applyFilters = () => {
    let filtered = features;
    
    if (searchQuery) {
      filtered = filtered.filter(feature => 
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(feature => feature.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(feature => feature.category === categoryFilter);
    }
    
    setFilteredFeatures(filtered);
  };
  
  React.useEffect(() => {
    applyFilters();
  }, [features, searchQuery, statusFilter, categoryFilter]);
  
  const toggleFeatureDetails = (featureId: string) => {
    if (expandedFeatureId === featureId) {
      setExpandedFeatureId(null);
    } else {
      setExpandedFeatureId(featureId);
    }
  };
  
  const addComment = (featureId: string) => {
    if (!newComment.trim()) return;
    
    const updatedFeatures = features.map(feature => {
      if (feature.id === featureId) {
        return {
          ...feature,
          comments: [
            ...feature.comments,
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
      return feature;
    });
    
    setFeatures(updatedFeatures);
    setNewComment('');
    toast({
      title: "Comment added",
      description: "Your comment has been added successfully."
    });
  };
  
  const toggleUpvote = (featureId: string) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === featureId) {
        const userIndex = feature.upvotedBy.indexOf(userName);
        if (userIndex === -1) {
          // User hasn't upvoted yet, add upvote
          return {
            ...feature,
            upvotes: feature.upvotes + 1,
            upvotedBy: [...feature.upvotedBy, userName],
            updatedAt: new Date().toISOString()
          };
        } else {
          // User has already upvoted, remove upvote
          const newUpvotedBy = [...feature.upvotedBy];
          newUpvotedBy.splice(userIndex, 1);
          return {
            ...feature,
            upvotes: feature.upvotes - 1,
            upvotedBy: newUpvotedBy,
            updatedAt: new Date().toISOString()
          };
        }
      }
      return feature;
    });
    
    setFeatures(updatedFeatures);
  };
  
  const handleFeatureSubmit = () => {
    if (!newFeature.title || !newFeature.description) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const createdAt = new Date().toISOString();
    const newFeatureItem: Feature = {
      id: `F-${(features.length + 1).toString().padStart(3, '0')}`,
      title: newFeature.title!,
      description: newFeature.description!,
      status: newFeature.status as FeatureStatus || 'requested',
      category: newFeature.category as FeatureCategory || 'other',
      upvotes: 1,
      requester: userName,
      createdAt,
      updatedAt: createdAt,
      comments: [],
      upvotedBy: [userName]
    };
    
    setFeatures([newFeatureItem, ...features]);
    setIsAddingFeature(false);
    setNewFeature({
      title: '',
      description: '',
      category: 'ui',
      status: 'requested'
    });
    
    toast({
      title: "Feature requested",
      description: "Your feature request has been submitted successfully."
    });
  };
  
  const getFeatureStatusColor = (status: FeatureStatus) => {
    switch (status) {
      case 'requested':
        return 'bg-blue-100 text-blue-700';
      case 'under-review':
        return 'bg-purple-100 text-purple-700';
      case 'planned':
        return 'bg-yellow-100 text-yellow-700';
      case 'in-progress':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
    }
  };
  
  const getFeatureCategoryColor = (category: FeatureCategory) => {
    switch (category) {
      case 'ui':
        return 'bg-pink-100 text-pink-700';
      case 'functionality':
        return 'bg-blue-100 text-blue-700';
      case 'performance':
        return 'bg-yellow-100 text-yellow-700';
      case 'security':
        return 'bg-red-100 text-red-700';
      case 'accessibility':
        return 'bg-green-100 text-green-700';
      case 'other':
        return 'bg-gray-100 text-gray-700';
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
                    <h1 className="text-3xl font-bold text-gradient">Feature Requests</h1>
                  </div>
                  <p className="text-gray-600">
                    {userType === 'customer' 
                      ? 'Submit and track requests for new features' 
                      : 'Manage and prioritize customer feature requests'}
                  </p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Dialog open={isAddingFeature} onOpenChange={setIsAddingFeature}>
                    <DialogTrigger asChild>
                      <Button className="micro-bounce">
                        <Plus size={16} className="mr-2" />
                        New Feature Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Submit a Feature Request</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                          <Input
                            value={newFeature.title || ''}
                            onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
                            placeholder="Brief description of the feature"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                          <Textarea
                            value={newFeature.description || ''}
                            onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                            placeholder="Detailed description of the feature and why it would be valuable"
                            className="min-h-[120px]"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={newFeature.category || 'ui'}
                            onChange={(e) => setNewFeature({...newFeature, category: e.target.value as FeatureCategory})}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm"
                          >
                            <option value="ui">User Interface</option>
                            <option value="functionality">Functionality</option>
                            <option value="performance">Performance</option>
                            <option value="security">Security</option>
                            <option value="accessibility">Accessibility</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        {userType === 'admin' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                              value={newFeature.status || 'requested'}
                              onChange={(e) => setNewFeature({...newFeature, status: e.target.value as FeatureStatus})}
                              className="w-full rounded-md border border-gray-300 p-2 text-sm"
                            >
                              <option value="requested">Requested</option>
                              <option value="under-review">Under Review</option>
                              <option value="planned">Planned</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="declined">Declined</option>
                            </select>
                          </div>
                        )}
                        
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline" onClick={() => setIsAddingFeature(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleFeatureSubmit}>
                            Submit Request
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-6">
              {['requested', 'under-review', 'planned', 'in-progress', 'completed', 'declined'].map((status) => {
                const count = features.filter(f => f.status === status).length;
                return (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-4 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className={`p-2 rounded-full inline-flex mx-auto mb-2 ${getFeatureStatusColor(status as FeatureStatus)}`}>
                        <Lightbulb size={20} />
                      </div>
                      <h3 className="text-lg font-bold">{count}</h3>
                      <p className="text-xs text-gray-600 capitalize">{status.replace('-', ' ')}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="glass-card p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <Input
                      placeholder="Search features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as FeatureStatus | 'all')}
                      className="rounded-md border border-gray-300 p-2 text-sm"
                    >
                      <option value="all">All Statuses</option>
                      <option value="requested">Requested</option>
                      <option value="under-review">Under Review</option>
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                  
                  <div>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as FeatureCategory | 'all')}
                      className="rounded-md border border-gray-300 p-2 text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="ui">UI</option>
                      <option value="functionality">Functionality</option>
                      <option value="performance">Performance</option>
                      <option value="security">Security</option>
                      <option value="accessibility">Accessibility</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <Button variant="outline" size="icon" onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}>
                    <X size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredFeatures.length > 0 ? (
                  filteredFeatures.map(feature => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-lg border border-gray-100 overflow-hidden"
                    >
                      <div className="p-4 flex flex-wrap md:flex-nowrap justify-between">
                        <div className="flex items-start flex-grow pr-4">
                          <div className="flex-shrink-0 mr-3">
                            <button 
                              className={`flex flex-col items-center justify-center p-1 rounded-lg transition-colors ${
                                feature.upvotedBy.includes(userName) 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                              onClick={() => toggleUpvote(feature.id)}
                            >
                              <ThumbsUp size={16} />
                              <span className="text-xs font-semibold mt-1">{feature.upvotes}</span>
                            </button>
                          </div>
                          <div className="flex-grow">
                            <div 
                              className="flex flex-wrap justify-between cursor-pointer" 
                              onClick={() => toggleFeatureDetails(feature.id)}
                            >
                              <h3 className="font-medium">{feature.title}</h3>
                              <div className="flex items-center mt-1 md:mt-0 text-xs text-gray-500">
                                <User size={14} className="mr-1" />
                                <span className="mr-2">{feature.requester}</span>
                                <span>
                                  {new Date(feature.createdAt).toLocaleDateString()}
                                </span>
                                <span className="ml-2">
                                  {expandedFeatureId === feature.id ? (
                                    <ChevronUp size={16} />
                                  ) : (
                                    <ChevronDown size={16} />
                                  )}
                                </span>
                              </div>
                            </div>
                            <p 
                              className="text-sm text-gray-600 mt-1 line-clamp-2 cursor-pointer" 
                              onClick={() => toggleFeatureDetails(feature.id)}
                            >
                              {feature.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getFeatureStatusColor(feature.status)}`}>
                                {feature.status.replace('-', ' ')}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getFeatureCategoryColor(feature.category)}`}>
                                {feature.category}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 flex items-center">
                                <MessageSquare size={12} className="mr-1" />
                                {feature.comments.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {expandedFeatureId === feature.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-100 p-4"
                        >
                          <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                  <User size={14} className="mr-1" /> Requested by
                                </h4>
                                <p className="text-sm">{feature.requester}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                  <Calendar size={14} className="mr-1" /> Requested on
                                </h4>
                                <p className="text-sm">
                                  {new Date(feature.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {feature.targetDate && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 flex items-center">
                                    <Calendar size={14} className="mr-1" /> Target Date
                                  </h4>
                                  <p className="text-sm">
                                    {new Date(feature.targetDate).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                            <p className="text-sm whitespace-pre-line">{feature.description}</p>
                            
                            {userType === 'admin' && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                <select
                                  value={feature.status}
                                  onChange={(e) => {
                                    const updatedFeatures = features.map(f => 
                                      f.id === feature.id ? {...f, status: e.target.value as FeatureStatus} : f
                                    );
                                    setFeatures(updatedFeatures);
                                  }}
                                  className="rounded-md border border-gray-300 text-sm py-0 h-9"
                                >
                                  <option value="requested">Requested</option>
                                  <option value="under-review">Under Review</option>
                                  <option value="planned">Planned</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="completed">Completed</option>
                                  <option value="declined">Declined</option>
                                </select>
                                
                                <select
                                  value={feature.category}
                                  onChange={(e) => {
                                    const updatedFeatures = features.map(f => 
                                      f.id === feature.id ? {...f, category: e.target.value as FeatureCategory} : f
                                    );
                                    setFeatures(updatedFeatures);
                                  }}
                                  className="rounded-md border border-gray-300 text-sm py-0 h-9"
                                >
                                  <option value="ui">UI</option>
                                  <option value="functionality">Functionality</option>
                                  <option value="performance">Performance</option>
                                  <option value="security">Security</option>
                                  <option value="accessibility">Accessibility</option>
                                  <option value="other">Other</option>
                                </select>
                                
                                <Input
                                  type="date"
                                  value={feature.targetDate ? feature.targetDate.split('T')[0] : ''}
                                  onChange={(e) => {
                                    const updatedFeatures = features.map(f => 
                                      f.id === feature.id ? {
                                        ...f, 
                                        targetDate: e.target.value ? `${e.target.value}T00:00:00Z` : undefined
                                      } : f
                                    );
                                    setFeatures(updatedFeatures);
                                  }}
                                  className="w-auto text-sm py-0 h-9"
                                  placeholder="Target Date"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                              Comments ({feature.comments.length})
                            </h4>
                            
                            <div className="space-y-4 mb-4">
                              {feature.comments.length > 0 ? (
                                feature.comments.map(comment => (
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
                                onClick={() => addComment(feature.id)}
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
                    <Lightbulb size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">No feature requests found matching your criteria.</p>
                    <Button className="mt-4" onClick={() => setIsAddingFeature(true)}>
                      <Plus size={16} className="mr-2" />
                      Submit a Feature Request
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

export default FeatureRequests;
