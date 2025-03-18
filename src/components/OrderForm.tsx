
import React, { useState } from 'react';
import { Order, ProjectStage, CustomerRequirement, Package, PACKAGES } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import StatusBadge from '@/components/StatusBadge';
import { Save, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderFormProps {
  order: Order;
  onSave: (updatedOrder: Order) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Order>({...order});
  const [expandedSection, setExpandedSection] = useState<string | null>('customer');
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  const handleCustomerChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
  };
  
  const handleOrderChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePackageChange = (packageId: string) => {
    const selectedPackage = PACKAGES.find(p => p.id === packageId);
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        package: selectedPackage,
        totalAmount: selectedPackage.price
      }));
    }
  };
  
  const handleStageChange = (stageId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map(stage => 
        stage.id === stageId ? { ...stage, [field]: value } : stage
      )
    }));
  };
  
  const handleRequirementChange = (reqId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.map(req => 
        req.id === reqId ? { ...req, [field]: value } : req
      )
    }));
  };
  
  const addRequirement = () => {
    const newRequirement: CustomerRequirement = {
      id: `req-${Date.now()}`,
      title: 'New Requirement',
      description: 'Enter requirement details here',
      category: 'design',
      priority: 'medium',
      fulfilled: false
    };
    
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), newRequirement]
    }));
  };
  
  const removeRequirement = (reqId: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter(req => req.id !== reqId)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div 
          className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('customer')}
        >
          <h3 className="text-lg font-semibold">Customer Information</h3>
          {expandedSection === 'customer' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        <AnimatePresence>
          {expandedSection === 'customer' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <Input
                    value={formData.customer.name}
                    onChange={(e) => handleCustomerChange('name', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) => handleCustomerChange('email', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                  <Input
                    type="tel"
                    value={formData.customer.phone || ''}
                    onChange={(e) => handleCustomerChange('phone', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Order Details Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div 
          className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('orderDetails')}
        >
          <h3 className="text-lg font-semibold">Order Details</h3>
          {expandedSection === 'orderDetails' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        <AnimatePresence>
          {expandedSection === 'orderDetails' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                  <Input
                    value={formData.id}
                    onChange={(e) => handleOrderChange('id', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                  <select
                    value={formData.package.id}
                    onChange={(e) => handlePackageChange(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ₹{pkg.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Date</label>
                    <Input
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => handleOrderChange('orderDate', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
                    <Input
                      type="date"
                      value={formData.estimatedDelivery}
                      onChange={(e) => handleOrderChange('estimatedDelivery', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => handleOrderChange('paymentStatus', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <Input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => handleOrderChange('totalAmount', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Project Stages Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div 
          className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('stages')}
        >
          <h3 className="text-lg font-semibold">Project Stages</h3>
          {expandedSection === 'stages' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        <AnimatePresence>
          {expandedSection === 'stages' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {formData.stages.map((stage, index) => (
                  <div key={stage.id} className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">{index + 1}. {stage.name}</h4>
                      <StatusBadge status={stage.status} size="sm" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input
                          value={stage.name}
                          onChange={(e) => handleStageChange(stage.id, 'name', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={stage.status}
                          onChange={(e) => handleStageChange(stage.id, 'status', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Textarea
                        value={stage.description}
                        onChange={(e) => handleStageChange(stage.id, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress ({stage.percentComplete}%)
                      </label>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        value={stage.percentComplete}
                        onChange={(e) => handleStageChange(stage.id, 'percentComplete', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Requirements Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div 
          className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('requirements')}
        >
          <h3 className="text-lg font-semibold">Requirements</h3>
          {expandedSection === 'requirements' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        <AnimatePresence>
          {expandedSection === 'requirements' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6">
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="flex items-center text-quicksite-blue hover:text-quicksite-dark-blue transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Requirement
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.requirements?.map((req) => (
                    <div key={req.id} className="p-4 border border-gray-100 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <Input
                          value={req.title}
                          onChange={(e) => handleRequirementChange(req.id, 'title', e.target.value)}
                          className="flex-grow mr-2"
                          placeholder="Requirement Title"
                        />
                        <button
                          type="button"
                          onClick={() => removeRequirement(req.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="mb-3">
                        <Textarea
                          value={req.description}
                          onChange={(e) => handleRequirementChange(req.id, 'description', e.target.value)}
                          placeholder="Describe the requirement"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Category</label>
                          <select
                            value={req.category}
                            onChange={(e) => handleRequirementChange(req.id, 'category', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                          >
                            <option value="design">Design</option>
                            <option value="functionality">Functionality</option>
                            <option value="integration">Integration</option>
                            <option value="content">Content</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Priority</label>
                          <select
                            value={req.priority}
                            onChange={(e) => handleRequirementChange(req.id, 'priority', e.target.value as 'low' | 'medium' | 'high')}
                            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Status</label>
                          <div className="flex items-center h-8">
                            <input
                              type="checkbox"
                              checked={req.fulfilled}
                              onChange={(e) => handleRequirementChange(req.id, 'fulfilled', e.target.checked)}
                              className="mr-2 h-4 w-4"
                            />
                            <span className="text-sm">Fulfilled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {(!formData.requirements || formData.requirements.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      No requirements added. Click "Add Requirement" to create one.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="py-2 px-4 bg-quicksite-blue text-white rounded-lg hover:bg-quicksite-dark-blue transition-colors flex items-center"
        >
          <Save size={16} className="mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
