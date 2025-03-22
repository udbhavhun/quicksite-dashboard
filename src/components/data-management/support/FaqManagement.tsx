
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { FAQItem } from '@/models/support-data';
import EditableItem from '@/components/EditableItem';

interface FaqManagementProps {
  faqs: FAQItem[];
  onUpdate: (updatedFaq: FAQItem) => void;
  onDelete: (id: string) => void;
  setItemToDelete: (item: {id: string, type: string} | null) => void;
}

const FaqManagement: React.FC<FaqManagementProps> = ({ 
  faqs, 
  onUpdate, 
  onDelete,
  setItemToDelete
}) => {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id} className="group">
                <TableCell>{faq.id}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{faq.question}</div>
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="max-h-16 overflow-hidden">{faq.answer}</div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditableItem
                      item={faq}
                      fields={[
                        { name: 'question', label: 'Question', type: 'text' },
                        { name: 'answer', label: 'Answer', type: 'textarea' },
                        { name: 'category', label: 'Category', type: 'text' }
                      ]}
                      onSave={onUpdate}
                      entityType="faq"
                    />
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setItemToDelete({ id: faq.id, type: 'faq' })}
                    >
                      <Trash size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FaqManagement;
