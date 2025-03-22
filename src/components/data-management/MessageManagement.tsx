
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { MOCK_MESSAGE_THREADS } from '@/lib/message-data';
import { Edit, Trash, PlusCircle, Save } from 'lucide-react';

const MessageManagement: React.FC = () => {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes to messages data have been saved."
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Message Management</CardTitle>
        <Button size="sm">
          <PlusCircle size={16} className="mr-2" />
          Create New Message Thread
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thread ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MESSAGE_THREADS.map((thread) => (
                  <TableRow key={thread.id}>
                    <TableCell>{thread.id}</TableCell>
                    <TableCell>{thread.subject}</TableCell>
                    <TableCell>
                      {thread.participants.map(p => p.name).join(', ')}
                    </TableCell>
                    <TableCell>
                      {new Date(thread.lastMessage.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        thread.isUnread ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {thread.isUnread ? 'Unread' : 'Read'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive">
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
          <div className="text-right">
            <Button onClick={handleSaveChanges}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageManagement;
