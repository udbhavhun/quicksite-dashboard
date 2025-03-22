
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Headphones, 
  BarChart3, 
  Bug,
  Lightbulb,
  MessageSquare,
  Database,
  Users,
  ChevronRight
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/userStore';

const AppSidebar = () => {
  const location = useLocation();
  const { profile } = useUserStore();
  const [activeGroups, setActiveGroups] = useState<Record<string, boolean>>({
    site: false,
  });
  
  const isAdmin = profile?.role === 'admin';
  
  useEffect(() => {
    // Auto-expand groups based on current path
    const newActiveGroups = { ...activeGroups };
    
    if (location.pathname.includes('/site-')) {
      newActiveGroups.site = true;
    }
    
    setActiveGroups(newActiveGroups);
  }, [location.pathname]);
  
  const toggleGroup = (group: string) => {
    setActiveGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-6 py-5">
          <Link to="/" className="text-2xl font-bold text-gradient">quicksite</Link>
          <div className="w-1.5 h-1.5 rounded-full bg-quicksite-blue ml-1.5 animate-pulse"></div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/'}>
              <Link to="/">
                <LayoutDashboard size={18} className="opacity-75" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname.startsWith('/orders')}>
              <Link to="/orders">
                <Package size={18} className="opacity-75" />
                <span>Orders</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/messages'}>
              <Link to="/messages">
                <MessageSquare size={18} className="opacity-75" />
                <span>Messages</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarGroup>
          <SidebarGroupLabel onClick={() => toggleGroup('site')}>
            <span>Site Management</span>
            <ChevronRight size={16} className={`transition-transform ${activeGroups.site ? 'rotate-90' : ''}`} />
          </SidebarGroupLabel>
          
          {activeGroups.site && (
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/site-performance'}>
                    <Link to="/site-performance">
                      <BarChart3 size={18} className="opacity-75" />
                      <span>Performance</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/site-bugs'}>
                    <Link to="/site-bugs">
                      <Bug size={18} className="opacity-75" />
                      <span>Bugs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === '/feature-requests'}>
                    <Link to="/feature-requests">
                      <Lightbulb size={18} className="opacity-75" />
                      <span>Feature Requests</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/support'}>
              <Link to="/support">
                <Headphones size={18} className="opacity-75" />
                <span>Support</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isAdmin && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/data-management'}>
                  <Link to="/data-management">
                    <Database size={18} className="opacity-75" />
                    <span>Data Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/customer-management'}>
                  <Link to="/customer-management">
                    <Users size={18} className="opacity-75" />
                    <span>Customer Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname === '/settings'}>
              <Link to="/settings">
                <Settings size={18} className="opacity-75" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
