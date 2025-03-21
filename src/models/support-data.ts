
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
      
    if (error) throw error;
    
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
