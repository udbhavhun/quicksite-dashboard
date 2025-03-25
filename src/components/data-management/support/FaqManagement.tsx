
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQManagementProps {
  faqs: FAQItem[];
  onUpdateFaqs: (faqs: FAQItem[]) => void;
}

const FAQManagement: React.FC<FAQManagementProps> = ({ faqs, onUpdateFaqs }) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newFAQ, setNewFAQ] = useState<Omit<FAQItem, 'id'>>({
    question: '',
    answer: '',
    category: 'general'
  });
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);

  const handleAddFAQ = () => {
    if (!newFAQ.question || !newFAQ.answer) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const faqItem: FAQItem = {
      id: `faq-${Date.now()}`,
      ...newFAQ
    };

    onUpdateFaqs([...faqs, faqItem]);
    setIsAddDialogOpen(false);
    setNewFAQ({ question: '', answer: '', category: 'general' });
    
    toast({
      title: 'Success',
      description: 'FAQ item added successfully',
    });
  };

  const handleEditFAQ = () => {
    if (!selectedFAQ || !selectedFAQ.question || !selectedFAQ.answer) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const updatedFaqs = faqs.map(faq => 
      faq.id === selectedFAQ.id ? selectedFAQ : faq
    );

    onUpdateFaqs(updatedFaqs);
    setIsEditDialogOpen(false);
    setSelectedFAQ(null);
    
    toast({
      title: 'Success',
      description: 'FAQ item updated successfully',
    });
  };

  const handleDeleteFAQ = (id: string) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== id);
    onUpdateFaqs(updatedFaqs);
    
    toast({
      title: 'Success',
      description: 'FAQ item deleted successfully',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <Button 
          size="sm" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add FAQ
        </Button>
      </div>

      {faqs.length === 0 ? (
        <p className="text-center text-gray-500 my-8">No FAQ items found. Add some to get started.</p>
      ) : (
        <div className="grid gap-4">
          {faqs.map(faq => (
            <Card key={faq.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="font-medium">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                    <div className="text-xs text-gray-500">Category: {faq.category}</div>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedFAQ(faq);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add FAQ Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input 
                value={newFAQ.question} 
                onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})} 
                placeholder="Enter question"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea 
                value={newFAQ.answer} 
                onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})} 
                placeholder="Enter answer"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input 
                value={newFAQ.category} 
                onChange={(e) => setNewFAQ({...newFAQ, category: e.target.value})} 
                placeholder="E.g., General, Account, Billing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFAQ}>Add FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          {selectedFAQ && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Question</label>
                <Input 
                  value={selectedFAQ.question} 
                  onChange={(e) => setSelectedFAQ({...selectedFAQ, question: e.target.value})} 
                  placeholder="Enter question"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Answer</label>
                <Textarea 
                  value={selectedFAQ.answer} 
                  onChange={(e) => setSelectedFAQ({...selectedFAQ, answer: e.target.value})} 
                  placeholder="Enter answer"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input 
                  value={selectedFAQ.category} 
                  onChange={(e) => setSelectedFAQ({...selectedFAQ, category: e.target.value})} 
                  placeholder="E.g., General, Account, Billing"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditFAQ}>Update FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQManagement;
