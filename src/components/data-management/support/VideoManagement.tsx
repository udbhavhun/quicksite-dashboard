
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
import { VideoTutorialItem } from '@/models/support-data';
import EditableItem from '@/components/EditableItem';

interface VideoManagementProps {
  videos: VideoTutorialItem[];
  onUpdate: (updatedVideo: VideoTutorialItem) => void;
  onDelete: (id: string) => void;
  setItemToDelete: (item: {id: string, type: string} | null) => void;
}

const VideoManagement: React.FC<VideoManagementProps> = ({ 
  videos, 
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
              <TableHead>Duration</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>{video.id}</TableCell>
                <TableCell>{video.title}</TableCell>
                <TableCell>{video.duration}</TableCell>
                <TableCell>
                  <a 
                    href={video.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline text-blue-600 hover:text-blue-800"
                  >
                    Watch
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditableItem
                      item={video}
                      fields={[
                        { name: 'title', label: 'Title', type: 'text' },
                        { name: 'duration', label: 'Duration', type: 'text' },
                        { name: 'link', label: 'Link', type: 'url' },
                        { name: 'thumbnail', label: 'Thumbnail URL', type: 'url' }
                      ]}
                      onSave={onUpdate}
                      entityType="video"
                    />
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setItemToDelete({ id: video.id, type: 'video' })}
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

export default VideoManagement;
