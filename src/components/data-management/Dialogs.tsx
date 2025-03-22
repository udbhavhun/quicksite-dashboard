
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface DialogsProps {
  isAddFaqOpen: boolean;
  setIsAddFaqOpen: (open: boolean) => void;
  isAddDocOpen: boolean;
  setIsAddDocOpen: (open: boolean) => void;
  isAddVideoOpen: boolean;
  setIsAddVideoOpen: (open: boolean) => void;
  isAddContactOpen: boolean;
  setIsAddContactOpen: (open: boolean) => void;
  itemToDelete: {id: string, type: string} | null;
  setItemToDelete: (item: {id: string, type: string} | null) => void;
  handleAddFaq: (newFaq: any) => void;
  handleAddDoc: (newDoc: any) => void;
  handleAddVideo: (newVideo: any) => void;
  handleAddContactSupport: (newContact: any) => void;
  handleDeleteFaq: (id: string) => void;
  handleDeleteDoc: (id: string) => void;
  handleDeleteVideo: (id: string) => void;
  handleDeleteContactSupport: (id: string) => void;
}

const Dialogs: React.FC<DialogsProps> = ({
  isAddFaqOpen,
  setIsAddFaqOpen,
  isAddDocOpen,
  setIsAddDocOpen,
  isAddVideoOpen,
  setIsAddVideoOpen,
  isAddContactOpen,
  setIsAddContactOpen,
  itemToDelete,
  setItemToDelete,
  handleAddFaq,
  handleAddDoc,
  handleAddVideo,
  handleAddContactSupport,
  handleDeleteFaq,
  handleDeleteDoc,
  handleDeleteVideo,
  handleDeleteContactSupport
}) => {
  const { toast } = useToast();

  return (
    <>
      {/* Add FAQ Dialog */}
      <Dialog open={isAddFaqOpen} onOpenChange={setIsAddFaqOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input id="faq-question" placeholder="Enter the question" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <Textarea id="faq-answer" placeholder="Enter the answer" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (Optional)</label>
              <Input id="faq-category" placeholder="E.g., General, Account, Billing" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFaqOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const question = (document.getElementById('faq-question') as HTMLInputElement).value;
              const answer = (document.getElementById('faq-answer') as HTMLTextAreaElement).value;
              const category = (document.getElementById('faq-category') as HTMLInputElement).value;
              
              if (!question || !answer) {
                toast({
                  title: "Missing Information",
                  description: "Please provide both a question and an answer.",
                  variant: "destructive"
                });
                return;
              }
              
              handleAddFaq({ question, answer, category });
            }}>Add FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Documentation Dialog */}
      <Dialog open={isAddDocOpen} onOpenChange={setIsAddDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Documentation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input id="doc-title" placeholder="Enter the title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea id="doc-description" placeholder="Enter the description" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <Input id="doc-link" placeholder="Enter the document URL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category (Optional)</label>
              <Input id="doc-category" placeholder="E.g., Tutorial, Reference, Guide" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDocOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const title = (document.getElementById('doc-title') as HTMLInputElement).value;
              const description = (document.getElementById('doc-description') as HTMLTextAreaElement).value;
              const link = (document.getElementById('doc-link') as HTMLInputElement).value;
              const category = (document.getElementById('doc-category') as HTMLInputElement).value;
              
              if (!title || !description || !link) {
                toast({
                  title: "Missing Information",
                  description: "Please provide a title, description, and link.",
                  variant: "destructive"
                });
                return;
              }
              
              handleAddDoc({ title, description, link, category });
            }}>Add Documentation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Video Tutorial Dialog */}
      <Dialog open={isAddVideoOpen} onOpenChange={setIsAddVideoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Video Tutorial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input id="video-title" placeholder="Enter the title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration</label>
              <Input id="video-duration" placeholder="E.g., 5:30, 12 mins" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link</label>
              <Input id="video-link" placeholder="Enter the video URL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail URL (Optional)</label>
              <Input id="video-thumbnail" placeholder="Enter the thumbnail image URL" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddVideoOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const title = (document.getElementById('video-title') as HTMLInputElement).value;
              const duration = (document.getElementById('video-duration') as HTMLInputElement).value;
              const link = (document.getElementById('video-link') as HTMLInputElement).value;
              const thumbnail = (document.getElementById('video-thumbnail') as HTMLInputElement).value;
              
              if (!title || !duration || !link) {
                toast({
                  title: "Missing Information",
                  description: "Please provide a title, duration, and link.",
                  variant: "destructive"
                });
                return;
              }
              
              handleAddVideo({ title, duration, link, thumbnail });
            }}>Add Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Support Dialog */}
      <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact Support</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input id="contact-title" placeholder="E.g., Technical Support, Billing & Account" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea id="contact-description" placeholder="Enter a description of this support option" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input id="contact-email" placeholder="support@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone (Optional)</label>
              <Input id="contact-phone" placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              const title = (document.getElementById('contact-title') as HTMLInputElement).value;
              const description = (document.getElementById('contact-description') as HTMLTextAreaElement).value;
              const email = (document.getElementById('contact-email') as HTMLInputElement).value;
              const phone = (document.getElementById('contact-phone') as HTMLInputElement).value;
              
              if (!title || !description || !email) {
                toast({
                  title: "Missing Information",
                  description: "Please provide a title, description, and email.",
                  variant: "destructive"
                });
                return;
              }
              
              handleAddContactSupport({ title, description, email, phone });
            }}>Add Contact Support</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (!itemToDelete) return;
              
              if (itemToDelete.type === 'faq') {
                handleDeleteFaq(itemToDelete.id);
              } else if (itemToDelete.type === 'doc') {
                handleDeleteDoc(itemToDelete.id);
              } else if (itemToDelete.type === 'video') {
                handleDeleteVideo(itemToDelete.id);
              } else if (itemToDelete.type === 'contact') {
                handleDeleteContactSupport(itemToDelete.id);
              }
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dialogs;
