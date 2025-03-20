
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Save, Trash2, Check, ShoppingCart, CreditCard } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  status: 'available' | 'purchased' | 'pending';
}

interface AddOnManagerProps {
  orderId: string;
  userType: 'customer' | 'admin';
}

const AddOnManager: React.FC<AddOnManagerProps> = ({ orderId, userType }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedAddOn, setSelectedAddOn] = useState<AddOn | null>(null);
  
  // Sample data - in a real app, this would come from an API
  const [addOns, setAddOns] = useState<AddOn[]>([
    {
      id: 'addon-1',
      name: 'SEO Optimization',
      description: 'Comprehensive SEO setup including meta tags, sitemap, and search engine submission.',
      price: 4999,
      status: 'available'
    },
    {
      id: 'addon-2',
      name: 'Content Management System',
      description: 'Custom CMS integration allowing you to manage your website content without technical knowledge.',
      price: 7999,
      status: 'purchased'
    },
    {
      id: 'addon-3',
      name: 'Social Media Integration',
      description: 'Connect your website with social media platforms for enhanced engagement.',
      price: 2999,
      status: 'available'
    }
  ]);
  
  const [editableAddOns, setEditableAddOns] = useState<AddOn[]>(addOns);
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setAddOns(editableAddOns);
      toast({
        title: "Changes saved",
        description: "Add-ons have been updated successfully.",
      });
    }
    setIsEditing(!isEditing);
  };
  
  const updateAddOn = (id: string, field: string, value: any) => {
    setEditableAddOns(prev => 
      prev.map(addon => 
        addon.id === id ? { ...addon, [field]: value } : addon
      )
    );
  };
  
  const addNewAddOn = () => {
    const newAddOn: AddOn = {
      id: `addon-${Date.now()}`,
      name: 'New Add-on',
      description: 'Description of the new add-on',
      price: 999,
      status: 'available'
    };
    setEditableAddOns([...editableAddOns, newAddOn]);
  };
  
  const removeAddOn = (id: string) => {
    setEditableAddOns(editableAddOns.filter(addon => addon.id !== id));
  };
  
  const handlePurchase = (addon: AddOn) => {
    setSelectedAddOn(addon);
    setShowCheckout(true);
  };
  
  const completeCheckout = () => {
    if (selectedAddOn) {
      setAddOns(prev => 
        prev.map(addon => 
          addon.id === selectedAddOn.id 
            ? { ...addon, status: 'purchased' } 
            : addon
        )
      );
      
      toast({
        title: "Purchase Complete",
        description: `You have successfully purchased the ${selectedAddOn.name} add-on.`,
      });
      
      setShowCheckout(false);
      setSelectedAddOn(null);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header section with title and controls */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Enhance your project with these additional features.</p>
        
        {userType === 'admin' && (
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={handleEditToggle}
            className={isEditing ? "bg-quicksite-blue text-white" : ""}
          >
            {isEditing ? (
              <>
                <Save size={14} className="mr-1.5" />
                Save Changes
              </>
            ) : (
              <>
                <Edit size={14} className="mr-1.5" />
                Edit Add-ons
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Checkout modal */}
      {showCheckout && selectedAddOn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full m-4"
          >
            <h3 className="text-xl font-semibold mb-4">Purchase Add-on</h3>
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-medium">{selectedAddOn.name}</h4>
              <p className="text-sm text-gray-600 my-2">{selectedAddOn.description}</p>
              <p className="text-lg font-semibold text-quicksite-blue">₹{selectedAddOn.price.toLocaleString()}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Payment Method</h4>
              <div className="border rounded-lg p-3 bg-gray-50 flex items-center">
                <CreditCard size={20} className="mr-2 text-gray-700" />
                <span>Credit/Debit Card (ending in 4242)</span>
                <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">Default</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCheckout(false)}>
                Cancel
              </Button>
              <Button 
                onClick={completeCheckout}
                className="bg-quicksite-blue hover:bg-quicksite-dark-blue"
              >
                <Check size={16} className="mr-2" />
                Complete Purchase
              </Button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Add-ons list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(isEditing ? editableAddOns : addOns).map((addon) => (
          <motion.div
            key={addon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {isEditing ? (
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Input 
                    value={addon.name}
                    onChange={(e) => updateAddOn(addon.id, 'name', e.target.value)}
                    className="font-medium mb-2"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeAddOn(addon.id)}
                    className="text-red-500 p-1 h-auto"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <Textarea
                  value={addon.description}
                  onChange={(e) => updateAddOn(addon.id, 'description', e.target.value)}
                  className="text-sm text-gray-600 mb-2 min-h-[100px]"
                  placeholder="Description"
                />
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm">₹</span>
                  <Input
                    type="number"
                    value={addon.price}
                    onChange={(e) => updateAddOn(addon.id, 'price', parseFloat(e.target.value))}
                    className="font-semibold"
                  />
                </div>
                
                <div className="mt-2">
                  <select
                    value={addon.status}
                    onChange={(e) => updateAddOn(addon.id, 'status', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="available">Available</option>
                    <option value="purchased">Purchased</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{addon.name}</h3>
                  {addon.status === 'purchased' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Purchased
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 my-2 line-clamp-3">{addon.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-quicksite-blue">₹{addon.price.toLocaleString()}</span>
                  {userType === 'customer' && addon.status === 'available' && (
                    <Button 
                      size="sm" 
                      onClick={() => handlePurchase(addon)}
                      className="bg-quicksite-blue hover:bg-quicksite-dark-blue"
                    >
                      <ShoppingCart size={14} className="mr-1.5" />
                      Purchase
                    </Button>
                  )}
                  {addon.status === 'purchased' && (
                    <Check size={18} className="text-green-600" />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}
        
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center h-full min-h-[200px] cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={addNewAddOn}
          >
            <div className="w-12 h-12 rounded-full bg-quicksite-blue/10 flex items-center justify-center mb-2">
              <Plus size={24} className="text-quicksite-blue" />
            </div>
            <h3 className="font-medium">Add New Add-on</h3>
            <p className="text-sm text-gray-600 mt-1">Create a new purchasable feature</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddOnManager;
