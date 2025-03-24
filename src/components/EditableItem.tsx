
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface EditableItemField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required?: boolean;
  options?: string[] | { value: string; label: string }[];
}

export interface EditableItemProps {
  item?: any; // For backward compatibility
  value?: any; // New prop name
  onChange: (updatedItem: any) => void;
  fields: EditableItemField[];
  entityType?: string;
  onSave?: (item: any) => void;
}

const EditableItem: React.FC<EditableItemProps> = ({ 
  item, 
  value,
  onChange, 
  fields,
  entityType,
  onSave
}) => {
  // Use either item or value prop (allows backward compatibility)
  const itemData = value || item;
  
  const handleChange = (field: string, newValue: any) => {
    onChange({
      ...itemData,
      [field]: newValue
    });
  };
  
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'text' && (
            <Input
              type="text"
              value={itemData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
          
          {field.type === 'textarea' && (
            <Textarea
              value={itemData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="min-h-[100px]"
            />
          )}
          
          {field.type === 'select' && field.options && (
            <Select
              value={itemData[field.name] || ''}
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => {
                  const value = typeof option === 'string' ? option : option.value;
                  const label = typeof option === 'string' ? option : option.label;
                  
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </div>
  );
};

export default EditableItem;
