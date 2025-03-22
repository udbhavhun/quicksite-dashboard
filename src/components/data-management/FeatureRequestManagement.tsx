
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
import { Edit, Trash, PlusCircle, Save } from 'lucide-react';

const FeatureRequestManagement: React.FC = () => {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes to feature requests data have been saved."
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Feature Request Management</CardTitle>
        <Button size="sm">
          <PlusCircle size={16} className="mr-2" />
          Add New Feature Request
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>FR-2023-001</TableCell>
                  <TableCell>Add Dark Mode to Dashboard</TableCell>
                  <TableCell>UI Enhancement</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Under Review
                    </span>
                  </TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>11/15/2023</TableCell>
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
                <TableRow>
                  <TableCell>FR-2023-002</TableCell>
                  <TableCell>Integrate with Shopify</TableCell>
                  <TableCell>Integration</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Approved
                    </span>
                  </TableCell>
                  <TableCell>Sarah Wilson</TableCell>
                  <TableCell>11/20/2023</TableCell>
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

export default FeatureRequestManagement;
