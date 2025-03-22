
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
  SidebarInner, 
  SidebarHeader, 
  SidebarBody, 
  SidebarLink, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupToggle 
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
      <SidebarInner className="border-r bg-white/95 backdrop-blur-sm">
        <SidebarHeader>
          <div className="flex items-center px-6 py-5">
            <Link to="/" className="text-2xl font-bold text-gradient">quicksite</Link>
            <div className="w-1.5 h-1.5 rounded-full bg-quicksite-blue ml-1.5 animate-pulse"></div>
          </div>
        </SidebarHeader>
        <SidebarBody>
          <SidebarLink to="/" active={location.pathname === '/'}>
            <LayoutDashboard size={18} className="opacity-75" />
            <span>Dashboard</span>
          </SidebarLink>
          <SidebarLink to="/orders" active={location.pathname.startsWith('/orders')}>
            <Package size={18} className="opacity-75" />
            <span>Orders</span>
          </SidebarLink>
          <SidebarLink to="/messages" active={location.pathname === '/messages'}>
            <MessageSquare size={18} className="opacity-75" />
            <span>Messages</span>
          </SidebarLink>
          
          <SidebarGroup>
            <SidebarGroupToggle 
              open={activeGroups.site} 
              onClick={() => toggleGroup('site')}
            >
              <SidebarGroupLabel>
                <span>Site Management</span>
                <ChevronRight size={16} className={`transition-transform ${activeGroups.site ? 'rotate-90' : ''}`} />
              </SidebarGroupLabel>
            </SidebarGroupToggle>
            {activeGroups.site && (
              <>
                <SidebarLink to="/site-performance" active={location.pathname === '/site-performance'} nested>
                  <BarChart3 size={18} className="opacity-75" />
                  <span>Performance</span>
                </SidebarLink>
                <SidebarLink to="/site-bugs" active={location.pathname === '/site-bugs'} nested>
                  <Bug size={18} className="opacity-75" />
                  <span>Bugs</span>
                </SidebarLink>
                <SidebarLink to="/feature-requests" active={location.pathname === '/feature-requests'} nested>
                  <Lightbulb size={18} className="opacity-75" />
                  <span>Feature Requests</span>
                </SidebarLink>
              </>
            )}
          </SidebarGroup>
          
          <SidebarLink to="/support" active={location.pathname === '/support'}>
            <Headphones size={18} className="opacity-75" />
            <span>Support</span>
          </SidebarLink>
          
          {isAdmin && (
            <>
              <SidebarLink to="/data-management" active={location.pathname === '/data-management'}>
                <Database size={18} className="opacity-75" />
                <span>Data Management</span>
              </SidebarLink>
              <SidebarLink to="/customer-management" active={location.pathname === '/customer-management'}>
                <Users size={18} className="opacity-75" />
                <span>Customer Management</span>
              </SidebarLink>
            </>
          )}
          
          <SidebarLink to="/settings" active={location.pathname === '/settings'}>
            <Settings size={18} className="opacity-75" />
            <span>Settings</span>
          </SidebarLink>
        </SidebarBody>
      </SidebarInner>
    </Sidebar>
  );
};

export default AppSidebar;
