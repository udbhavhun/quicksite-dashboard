import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import EditableItem from '@/components/EditableItem';

export interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  content: string;
  link: string;
}

interface DocumentationManagementProps {
  documentation: DocumentationItem[];
  onUpdateDocumentation: (documentation: DocumentationItem[]) => void;
}

const DocumentationManagement: React.FC<DocumentationManagementProps> = ({ 
  documentation: initialDocumentation, 
  onUpdateDocumentation 
}) => {
  const { toast } = useToast();
  const [documentation, setDocumentation] = useState<DocumentationItem[]>(initialDocumentation);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentationItem | null>(null);
  const [newDoc, setNewDoc] = useState<Omit<DocumentationItem, 'id'>>({
    title: '',
    description: '',
    content: '',
    link: '',
  });

  const handleAddDoc = () => {
    const newId = `doc-${Math.random().toString(36).substring(2, 9)}`;
    const newItem: DocumentationItem = {
      id: newId,
      ...newDoc,
    };
    setDocumentation([...documentation, newItem]);
    onUpdateDocumentation([...documentation, newItem]);
    setIsDialogOpen(false);
    setNewDoc({
      title: '',
      description: '',
      content: '',
      link: '',
    });
    toast({
      title: 'Documentation added',
      description: 'The new documentation has been added successfully.',
    });
  };

  const handleEditDoc = () => {
    if (!editingDoc) return;
    const updatedDocumentation = documentation.map(doc =>
      doc.id === editingDoc.id ? editingDoc : doc
    );
    setDocumentation(updatedDocumentation);
    onUpdateDocumentation(updatedDocumentation);
    setIsDialogOpen(false);
    setEditingDoc(null);
    toast({
      title: 'Documentation updated',
      description: 'The documentation has been updated successfully.',
    });
  };

  const handleDeleteDoc = (id: string) => {
    const updatedDocumentation = documentation.filter(doc => doc.id !== id);
    setDocumentation(updatedDocumentation);
    onUpdateDocumentation(updatedDocumentation);
    toast({
      title: 'Documentation deleted',
      description: 'The documentation has been deleted successfully.',
    });
  };

  // Modify the fields array in the component to use text type instead of URL
  const fields = [
    { name: 'title', label: 'Title', type: 'text' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'content', label: 'Content', type: 'textarea' as const },
    { name: 'link', label: 'Link', type: 'text' as const }, // Changed from "url" to "text"
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xl">Documentation</CardTitle>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Documentation
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {documentation.map((doc) => (
            <Card key={doc.id} className="border">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>{doc.description}</div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingDoc(doc);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteDoc(doc.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDoc ? 'Edit Documentation' : 'Add Documentation'}</DialogTitle>
          </DialogHeader>
          <EditableItem
            item={editingDoc || newDoc}
            fields={fields}
            onChange={(data) => {
              if (editingDoc) {
                setEditingDoc(data as DocumentationItem);
              } else {
                setNewDoc(data as Omit<DocumentationItem, 'id'>);
              }
            }}
            onSave={() => {
              if (editingDoc) {
                handleEditDoc();
              } else {
                handleAddDoc();
              }
            }}
            entityType="documentation"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editingDoc) {
                handleEditDoc();
              } else {
                handleAddDoc();
              }
            }}>
              {editingDoc ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DocumentationManagement;
