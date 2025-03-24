
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "url";
  options?: string[];
  required?: boolean;
}

export interface EditableItemProps {
  item: Record<string, any>;
  fields: FieldConfig[];
  onSave: (updatedItem: Record<string, any>) => void;
  onChange?: (value: Record<string, any>) => void;
  entityType: string;
}

const EditableItem: React.FC<EditableItemProps> = ({
  item,
  fields,
  onSave,
  onChange,
  entityType
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(item || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(item || {});
  }, [item]);

  const handleChange = (fieldName: string, value: any) => {
    const updatedData = { ...formData, [fieldName]: value };
    setFormData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error(`Error saving ${entityType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'textarea' && (
            <Textarea
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
              className="min-h-[100px]"
            />
          )}
          
          {field.type === 'select' && field.options && (
            <Select
              value={formData[field.name] || ''}
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {(field.type === 'text' || field.type === 'url') && (
            <Input
              id={field.name}
              type={field.type === 'url' ? 'url' : 'text'}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          )}
        </div>
      ))}
      
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditableItem;
