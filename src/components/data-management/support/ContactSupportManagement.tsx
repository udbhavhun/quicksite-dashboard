
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
import { ContactSupportItem } from '@/models/support-data';
import EditableItem from '@/components/EditableItem';

interface ContactSupportManagementProps {
  contacts: ContactSupportItem[];
  onUpdate: (updatedContact: ContactSupportItem) => void;
  onDelete: (id: string) => void;
  setItemToDelete: (item: {id: string, type: string} | null) => void;
}

const ContactSupportManagement: React.FC<ContactSupportManagementProps> = ({ 
  contacts, 
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
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.id}</TableCell>
                <TableCell>{contact.title}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{contact.description}</div>
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditableItem
                      item={contact}
                      fields={[
                        { name: 'title', label: 'Title', type: 'text' },
                        { name: 'description', label: 'Description', type: 'textarea' },
                        { name: 'email', label: 'Email', type: 'text' },
                        { name: 'phone', label: 'Phone', type: 'text' }
                      ]}
                      onSave={onUpdate}
                      entityType="contact"
                    />
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setItemToDelete({ id: contact.id, type: 'contact' })}
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

export default ContactSupportManagement;
