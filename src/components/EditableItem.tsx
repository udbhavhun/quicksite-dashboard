
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { logAdminEdit } from '@/models/support-data';

interface EditableItemProps {
  item: Record<string, any>;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'url' | 'select';
    options?: string[];
  }>;
  onSave: (updatedItem: Record<string, any>) => void;
  entityType: string;
}

const EditableItem: React.FC<EditableItemProps> = ({ 
  item, 
  fields, 
  onSave,
  entityType
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleChange = (field: string, value: string) => {
    setEditedItem(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Log changes for each field
    const changedFields = fields.filter(field => 
      editedItem[field.name] !== item[field.name]
    );
    
    if (changedFields.length === 0) {
      setIsEditing(false);
      return;
    }
    
    // Log each change to admin_edits table
    for (const field of changedFields) {
      await logAdminEdit(
        entityType,
        item.id,
        field.name,
        String(item[field.name] || ''),
        String(editedItem[field.name] || '')
      );
    }
    
    onSave(editedItem);
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your changes have been successfully saved."
    });
  };

  const handleCancel = () => {
    setEditedItem({ ...item });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex w-full justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsEditing(true)}
          className="flex items-center"
        >
          <Edit size={14} className="mr-1" />
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-md mt-2">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label className="text-sm font-medium">{field.label}</label>
          {field.type === 'textarea' ? (
            <Textarea
              value={editedItem[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="min-h-[100px]"
            />
          ) : field.type === 'select' && field.options ? (
            <select
              value={editedItem[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <Input
              type={field.type}
              value={editedItem[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
      <div className="flex space-x-2 justify-end">
        <Button size="sm" variant="outline" onClick={handleCancel}>
          <X size={14} className="mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Save size={14} className="mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditableItem;
