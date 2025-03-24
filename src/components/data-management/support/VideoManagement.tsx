import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash } from 'lucide-react';
import EditableItem, { FieldConfig } from '@/components/EditableItem';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

const VideoManagement = () => {
  const { toast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: 'video-1',
      title: 'Introduction to the Platform',
      description: 'A brief overview of the platform and its features.',
      url: 'https://example.com/video1',
      thumbnail: 'https://example.com/thumbnail1.jpg',
    },
    {
      id: 'video-2',
      title: 'Setting Up Your Profile',
      description: 'Learn how to set up your profile and customize your settings.',
      url: 'https://example.com/video2',
      thumbnail: 'https://example.com/thumbnail2.jpg',
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [newVideo, setNewVideo] = useState<Omit<VideoItem, 'id'>>({
    title: '',
    description: '',
    url: '',
    thumbnail: '',
  });

  const handleAddVideo = () => {
    const newId = `video-${Math.random().toString(36).substring(2, 9)}`;
    const video: VideoItem = {
      id: newId,
      title: newVideo.title,
      description: newVideo.description,
      url: newVideo.url,
      thumbnail: newVideo.thumbnail,
    };

    setVideos([...videos, video]);
    setIsDialogOpen(false);
    setNewVideo({
      title: '',
      description: '',
      url: '',
      thumbnail: '',
    });

    toast({
      title: 'Video added',
      description: 'The new video has been added successfully.',
    });
  };

  const handleEditVideo = () => {
    if (!editingVideo) return;

    setVideos(vids => vids.map(vid =>
      vid.id === editingVideo.id ? editingVideo : vid
    ));

    setIsDialogOpen(false);
    setEditingVideo(null);

    toast({
      title: 'Video updated',
      description: 'The video has been updated successfully.',
    });
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(vids => vids.filter(vid => vid.id !== id));

    toast({
      title: 'Video deleted',
      description: 'The video has been deleted successfully.',
    });
  };

  const fields = [
  { name: 'title', label: 'Title', type: 'text' as const },
  { name: 'description', label: 'Description', type: 'textarea' as const },
  { name: 'url', label: 'Video URL', type: 'text' as const },
  { name: 'thumbnail', label: 'Thumbnail URL', type: 'text' as const },
];

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-xl">Video Management</CardTitle>
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {videos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No videos found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 object-cover mb-2 rounded-md"
                  />
                  <h3 className="font-medium">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.description}</p>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        setEditingVideo(video);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add Video'}</DialogTitle>
          </DialogHeader>

          <EditableItem
            item={editingVideo || newVideo}
            fields={fields}
            onSave={editingVideo ? handleEditVideo : handleAddVideo}
            onChange={editingVideo ? setEditingVideo : setNewVideo}
            entityType="video"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingVideo ? handleEditVideo : handleAddVideo}>
              {editingVideo ? 'Update Video' : 'Add Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VideoManagement;
