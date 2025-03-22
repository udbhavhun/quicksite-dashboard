
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  User, 
  Settings, 
  HelpCircle, 
  BarChart2, 
  Bug, 
  Lightbulb, 
  MessageCircle,
  Database,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent,
  SidebarInset,
  SidebarGroup,
  SidebarFooter,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/userStore';
import { useIsMobile } from '@/hooks/use-mobile';

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { profile, logout } = useUserStore();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <Sidebar className="border-r bg-white/80 backdrop-blur-md">
      <SidebarContent className="p-2">
        <div className="flex items-center h-16 px-4">
          <span className="text-xl font-bold text-gradient">quicksite</span>
          <SidebarTrigger className="ml-auto" />
        </div>
        
        <SidebarGroup>
          <Button
            variant={isActive('/') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={isActive('/orders') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/orders')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Orders
          </Button>
          
          <Button
            variant={isActive('/profile') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/profile')}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          
          <Button
            variant={isActive('/messages') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/messages')}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Messages
          </Button>
        </SidebarGroup>
        
        <SidebarGroup title="Support">
          <Button
            variant={isActive('/support') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/support')}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Center
          </Button>
          
          <Button
            variant={isActive('/site-performance') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/site-performance')}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Site Performance
          </Button>
          
          <Button
            variant={isActive('/site-bugs') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/site-bugs')}
          >
            <Bug className="mr-2 h-4 w-4" />
            Report Bugs
          </Button>
          
          <Button
            variant={isActive('/feature-requests') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/feature-requests')}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Feature Requests
          </Button>
        </SidebarGroup>
        
        {profile?.role === 'admin' && (
          <SidebarGroup title="Administration">
            <Button
              variant={isActive('/data-management') ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => navigate('/data-management')}
            >
              <Database className="mr-2 h-4 w-4" />
              Data Management
            </Button>
            
            <Button
              variant={isActive('/customer-management') ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => navigate('/customer-management')}
            >
              <Users className="mr-2 h-4 w-4" />
              Customer Management
            </Button>
          </SidebarGroup>
        )}
        
        <SidebarGroup title="Account">
          <Button
            variant={isActive('/settings') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 mb-1"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </Button>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-2">
        <div className="flex items-center gap-2 px-2">
          <div className="rounded-full w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
            {profile?.role === 'admin' ? 'A' : 'C'}
          </div>
          <div className="text-xs">
            <p className="font-medium">{profile?.role === 'admin' ? 'Admin' : 'Customer'}</p>
            <p className="text-gray-500">v1.0.0</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
