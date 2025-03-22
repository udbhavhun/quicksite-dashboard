
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
import { mockSites } from '@/lib/site-data';
import { Edit, Trash, PlusCircle, Save } from 'lucide-react';

const SitePerformanceManagement: React.FC = () => {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes to site performance data have been saved."
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Site Performance Management</CardTitle>
        <Button size="sm">
          <PlusCircle size={16} className="mr-2" />
          Add New Site
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>{site.id}</TableCell>
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.url}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        site.status === 'online' ? 'bg-green-100 text-green-800' :
                        site.status === 'issues' ? 'bg-yellow-100 text-yellow-800' :
                        site.status === 'offline' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {site.status}
                      </span>
                    </TableCell>
                    <TableCell>{site.uptime}%</TableCell>
                    <TableCell>{site.responseTime}ms</TableCell>
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

export default SitePerformanceManagement;
