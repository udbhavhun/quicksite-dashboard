
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  link: string;
  category?: string;
}

export interface VideoTutorialItem {
  id: string;
  title: string;
  duration: string;
  link: string;
  thumbnail?: string;
}

export interface ContactSupportItem {
  id: string;
  title: string;
  description: string;
  email: string;
  phone?: string;
}

// Function to log admin edits
export const logAdminEdit = async (
  entityType: string,
  entityId: string,
  fieldName: string,
  oldValue: string,
  newValue: string
) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from('admin_edits')
      .insert({
        user_id: userData.user.id,
        entity_type: entityType,
        entity_id: entityId,
        field_name: fieldName,
        old_value: oldValue,
        new_value: newValue
      });
      
    if (error) {
      console.error("Error logging admin edit:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error logging admin edit:', error);
    return false;
  }
};

// Generic function to update an item in local storage
export const updateLocalItem = <T extends { id: string }>(
  items: T[],
  updatedItem: T,
  storageKey: string
): T[] => {
  const updatedItems = items.map(item => 
    item.id === updatedItem.id ? updatedItem : item
  );
  
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  return updatedItems;
};

// Generic function to add a new item to local storage
export const addLocalItem = <T extends { id: string }>(
  items: T[],
  newItem: T,
  storageKey: string
): T[] => {
  const updatedItems = [...items, newItem];
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  return updatedItems;
};

// Generic function to delete an item from local storage
export const deleteLocalItem = <T extends { id: string }>(
  items: T[],
  itemId: string,
  storageKey: string
): T[] => {
  const updatedItems = items.filter(item => item.id !== itemId);
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  return updatedItems;
};

// Contact support section
export const getContactSupport = async (): Promise<ContactSupportItem[]> => {
  try {
    // First try to get from localStorage for quick loading
    const storedContactSupport = localStorage.getItem('admin-contact-support');
    
    if (storedContactSupport) {
      return JSON.parse(storedContactSupport);
    }
    
    // Default contact support options if none are found
    const defaultContactSupport: ContactSupportItem[] = [
      {
        id: 'contact-1',
        title: 'Technical Support',
        description: 'Get help with technical issues and website functionality',
        email: 'support@quicksite.com',
        phone: '+1 (555) 123-4567'
      },
      {
        id: 'contact-2',
        title: 'Billing & Account',
        description: 'Questions about your account, billing, or subscriptions',
        email: 'billing@quicksite.com',
        phone: '+1 (555) 987-6543'
      }
    ];
    
    // Store the default in localStorage for future use
    localStorage.setItem('admin-contact-support', JSON.stringify(defaultContactSupport));
    
    return defaultContactSupport;
  } catch (error) {
    console.error('Error getting contact support:', error);
    toast({
      title: 'Error',
      description: 'Failed to load contact support information',
      variant: 'destructive'
    });
    return [];
  }
};

// Update contact support
export const updateContactSupport = (
  contactSupport: ContactSupportItem[],
  updatedItem: ContactSupportItem
): ContactSupportItem[] => {
  return updateLocalItem(contactSupport, updatedItem, 'admin-contact-support');
};

// Add new contact support item
export const addContactSupport = (
  contactSupport: ContactSupportItem[],
  newItem: ContactSupportItem
): ContactSupportItem[] => {
  return addLocalItem(contactSupport, newItem, 'admin-contact-support');
};

// Delete contact support item
export const deleteContactSupport = (
  contactSupport: ContactSupportItem[],
  itemId: string
): ContactSupportItem[] => {
  return deleteLocalItem(contactSupport, itemId, 'admin-contact-support');
};
