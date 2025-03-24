
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
import { DocumentationItem } from '@/models/support-data';
import EditableItem from '@/components/EditableItem';

export interface DocumentationManagementProps {
  docs: DocumentationItem[];
  onUpdate: (updatedDoc: DocumentationItem) => void;
  onDelete: (id: string) => void;
  setItemToDelete: (item: {id: string, type: string} | null) => void;
}

const DocumentationManagement: React.FC<DocumentationManagementProps> = ({ 
  docs, 
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
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.id}</TableCell>
                <TableCell>{doc.title}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate">{doc.description}</div>
                </TableCell>
                <TableCell>
                  <a 
                    href={doc.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    View
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditableItem
                      item={doc}
                      fields={[
                        { name: 'title', label: 'Title', type: 'text' },
                        { name: 'description', label: 'Description', type: 'textarea' },
                        { name: 'link', label: 'Link', type: 'text' },
                        { name: 'category', label: 'Category', type: 'text' }
                      ]}
                      onSave={onUpdate}
                      entityType="documentation"
                    />
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setItemToDelete({ id: doc.id, type: 'doc' })}
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

export default DocumentationManagement;
