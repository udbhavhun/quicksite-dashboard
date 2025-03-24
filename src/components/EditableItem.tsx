
import React, { useState } from 'react';
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
  onChange?: (updatedItem: any) => void; // Make onChange optional when onSave is provided
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
  
  // Create local state for editing when using onSave pattern
  const [localData, setLocalData] = useState<any>(itemData);
  const isEditMode = !!onSave && !onChange;
  
  const handleChange = (field: string, newValue: any) => {
    if (isEditMode) {
      // Update local state when in edit mode
      setLocalData({
        ...localData,
        [field]: newValue
      });
    } else if (onChange) {
      // Use onChange directly when provided
      onChange({
        ...itemData,
        [field]: newValue
      });
    }
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(localData);
    }
  };
  
  // Use local state when in edit mode, otherwise use props
  const displayData = isEditMode ? localData : itemData;
  
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
              value={displayData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
          
          {field.type === 'textarea' && (
            <Textarea
              value={displayData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="min-h-[100px]"
            />
          )}
          
          {field.type === 'select' && field.options && (
            <Select
              value={displayData[field.name] || ''}
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
      
      {isEditMode && onSave && (
        <button 
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default EditableItem;
