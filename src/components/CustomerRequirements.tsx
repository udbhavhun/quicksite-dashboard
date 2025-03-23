
import React, { useState } from 'react';
import { Order, CustomerRequirement } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CheckSquare, Filter, MessageSquare, Plus, Tag } from 'lucide-react';
import EditableItem from './EditableItem';
import { useUserStore } from '@/stores/userStore';

export interface CustomerRequirementsProps {
  order: Order;
}

const CustomerRequirements: React.FC<CustomerRequirementsProps> = ({ order }) => {
  const { toast } = useToast();
  const { profile } = useUserStore();
  const isAdmin = profile?.role === 'admin';
  
  const [requirements, setRequirements] = useState<CustomerRequirement[]>(order.requirements || []);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<CustomerRequirement | null>(null);
  const [newRequirement, setNewRequirement] = useState({
    title: '',
    description: '',
    category: 'design',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });
  
  const categories = Array.from(new Set(requirements.map(req => req.category)));
  
  const filteredRequirements = requirements.filter(req => {
    if (selectedFilter === 'fulfilled') return req.fulfilled;
    if (selectedFilter === 'unfulfilled') return !req.fulfilled;
    if (selectedCategory) return req.category === selectedCategory;
    return true;
  });
  
  const handleToggleFulfilled = (id: string, fulfilled: boolean) => {
    setRequirements(reqs => reqs.map(req => 
      req.id === id ? { ...req, fulfilled } : req
    ));
    
    toast({
      title: fulfilled ? 'Requirement fulfilled' : 'Requirement marked as unfulfilled',
      description: fulfilled ? 
        'The requirement has been marked as completed.' : 
        'The requirement has been reopened.',
    });
  };
  
  const handleAddRequirement = () => {
    const newId = `req-${Math.random().toString(36).substring(2, 9)}`;
    const requirement: CustomerRequirement = {
      id: newId,
      title: newRequirement.title,
      description: newRequirement.description,
      category: newRequirement.category,
      priority: newRequirement.priority,
      fulfilled: false
    };
    
    setRequirements([...requirements, requirement]);
    setIsAddDialogOpen(false);
    setNewRequirement({
      title: '',
      description: '',
      category: 'design',
      priority: 'medium'
    });
    
    toast({
      title: 'Requirement added',
      description: 'The new requirement has been added successfully.',
    });
  };
  
  const handleEditRequirement = () => {
    if (!editingRequirement) return;
    
    setRequirements(reqs => reqs.map(req => 
      req.id === editingRequirement.id ? editingRequirement : req
    ));
    
    setIsEditDialogOpen(false);
    setEditingRequirement(null);
    
    toast({
      title: 'Requirement updated',
      description: 'The requirement has been updated successfully.',
    });
  };
  
  const handleDeleteRequirement = (id: string) => {
    setRequirements(reqs => reqs.filter(req => req.id !== id));
    
    toast({
      title: 'Requirement deleted',
      description: 'The requirement has been deleted successfully.',
    });
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="default" className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="default" className="bg-blue-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xl">Customer Requirements</CardTitle>
        
        <div className="flex space-x-2">
          <Tabs 
            value={selectedFilter || 'all'} 
            onValueChange={(value) => setSelectedFilter(value === 'all' ? null : value)}
            className="h-9"
          >
            <TabsList className="bg-gray-100 h-9">
              <TabsTrigger value="all" className="h-7 px-3">All</TabsTrigger>
              <TabsTrigger value="fulfilled" className="h-7 px-3">Fulfilled</TabsTrigger>
              <TabsTrigger value="unfulfilled" className="h-7 px-3">Unfulfilled</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {categories.length > 0 && (
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => setSelectedCategory(null)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {selectedCategory || 'Categories'}
              </Button>
              {selectedCategory && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {categories.length}
                </Badge>
              )}
            </div>
          )}
          
          {isAdmin && (
            <Button 
              size="sm" 
              className="h-9"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredRequirements.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">No Requirements Found</h3>
              <p>There are no requirements matching your current filters.</p>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequirements.map((requirement) => (
                <div 
                  key={requirement.id} 
                  className={`border rounded-lg p-4 transition-colors ${
                    requirement.fulfilled 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start mb-2">
                    {isAdmin && (
                      <Checkbox 
                        checked={requirement.fulfilled}
                        onCheckedChange={(checked) => 
                          handleToggleFulfilled(requirement.id, checked === true)
                        }
                        className="mt-1 mr-3"
                      />
                    )}
                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={`font-medium ${
                          requirement.fulfilled ? 'text-gray-500' : ''
                        }`}>
                          {requirement.title}
                        </h3>
                        {getPriorityBadge(requirement.priority)}
                      </div>
                      <p className="text-sm text-gray-600">{requirement.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
                    <Badge variant="outline" className="capitalize">
                      <Tag className="h-3 w-3 mr-1" />
                      {requirement.category}
                    </Badge>
                    
                    {isAdmin && (
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setEditingRequirement(requirement);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteRequirement(requirement.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                    
                    {!isAdmin && requirement.feedback && (
                      <div className="flex items-center text-gray-500 text-xs">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Feedback provided
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Add Requirement Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Requirement</DialogTitle>
          </DialogHeader>
          
          <EditableItem 
            value={newRequirement}
            onChange={setNewRequirement}
            fields={[
              { name: 'title', label: 'Title', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
              { 
                name: 'category', 
                label: 'Category', 
                type: 'select',
                options: [
                  { value: 'design', label: 'Design' },
                  { value: 'functionality', label: 'Functionality' },
                  { value: 'content', label: 'Content' },
                  { value: 'integration', label: 'Integration' },
                  { value: 'performance', label: 'Performance' },
                ]
              },
              { 
                name: 'priority', 
                label: 'Priority', 
                type: 'select',
                options: [
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]
              },
            ]}
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRequirement}>
              Add Requirement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Requirement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Requirement</DialogTitle>
          </DialogHeader>
          
          {editingRequirement && (
            <EditableItem 
              value={editingRequirement}
              onChange={setEditingRequirement}
              fields={[
                { name: 'title', label: 'Title', type: 'text', required: true },
                { name: 'description', label: 'Description', type: 'textarea' },
                { 
                  name: 'category', 
                  label: 'Category', 
                  type: 'select',
                  options: [
                    { value: 'design', label: 'Design' },
                    { value: 'functionality', label: 'Functionality' },
                    { value: 'content', label: 'Content' },
                    { value: 'integration', label: 'Integration' },
                    { value: 'performance', label: 'Performance' },
                  ]
                },
                { 
                  name: 'priority', 
                  label: 'Priority', 
                  type: 'select',
                  options: [
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ]
                },
              ]}
            />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRequirement}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerRequirements;
