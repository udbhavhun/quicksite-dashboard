
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnailUrl?: string;
}

interface VideoManagementProps {
  videos: VideoItem[];
  onUpdateVideos: (videos: VideoItem[]) => void;
}

const VideoManagement: React.FC<VideoManagementProps> = ({ videos, onUpdateVideos }) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newVideo, setNewVideo] = useState<Omit<VideoItem, 'id'>>({
    title: '',
    description: '',
    url: '',
    category: 'tutorial'
  });
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.url) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const videoItem: VideoItem = {
      id: `video-${Date.now()}`,
      ...newVideo
    };

    onUpdateVideos([...videos, videoItem]);
    setIsAddDialogOpen(false);
    setNewVideo({ title: '', description: '', url: '', category: 'tutorial' });
    
    toast({
      title: 'Success',
      description: 'Video added successfully',
    });
  };

  const handleEditVideo = () => {
    if (!selectedVideo || !selectedVideo.title || !selectedVideo.url) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const updatedVideos = videos.map(video => 
      video.id === selectedVideo.id ? selectedVideo : video
    );

    onUpdateVideos(updatedVideos);
    setIsEditDialogOpen(false);
    setSelectedVideo(null);
    
    toast({
      title: 'Success',
      description: 'Video updated successfully',
    });
  };

  const handleDeleteVideo = (id: string) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    onUpdateVideos(updatedVideos);
    
    toast({
      title: 'Success',
      description: 'Video deleted successfully',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Support Videos</h2>
        <Button 
          size="sm" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Video
        </Button>
      </div>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500 my-8">No videos found. Add some to get started.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {videos.map(video => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative pt-[56.25%] bg-gray-100">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400">No thumbnail</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium truncate">{video.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                  <div className="text-xs text-gray-500">Category: {video.category}</div>
                  <div className="flex justify-between items-center pt-2">
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Watch Video
                    </a>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedVideo(video);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteVideo(video.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Video Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={newVideo.title} 
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} 
                placeholder="Enter video title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newVideo.description} 
                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})} 
                placeholder="Enter video description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <Input 
                value={newVideo.url} 
                onChange={(e) => setNewVideo({...newVideo, url: e.target.value})} 
                placeholder="E.g., https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input 
                value={newVideo.category} 
                onChange={(e) => setNewVideo({...newVideo, category: e.target.value})} 
                placeholder="E.g., Tutorial, Walkthrough"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail URL (Optional)</label>
              <Input 
                value={newVideo.thumbnailUrl || ''} 
                onChange={(e) => setNewVideo({...newVideo, thumbnailUrl: e.target.value})} 
                placeholder="Enter thumbnail image URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddVideo}>Add Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Video Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={selectedVideo.title} 
                  onChange={(e) => setSelectedVideo({...selectedVideo, title: e.target.value})} 
                  placeholder="Enter video title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={selectedVideo.description} 
                  onChange={(e) => setSelectedVideo({...selectedVideo, description: e.target.value})} 
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL</label>
                <Input 
                  value={selectedVideo.url} 
                  onChange={(e) => setSelectedVideo({...selectedVideo, url: e.target.value})} 
                  placeholder="E.g., https://youtube.com/watch?v=..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input 
                  value={selectedVideo.category} 
                  onChange={(e) => setSelectedVideo({...selectedVideo, category: e.target.value})} 
                  placeholder="E.g., Tutorial, Walkthrough"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail URL (Optional)</label>
                <Input 
                  value={selectedVideo.thumbnailUrl || ''} 
                  onChange={(e) => setSelectedVideo({...selectedVideo, thumbnailUrl: e.target.value})} 
                  placeholder="Enter thumbnail image URL"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditVideo}>Update Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoManagement;
