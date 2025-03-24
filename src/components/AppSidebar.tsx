
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
  Users,
  FileText,
  Activity
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
  const isAdmin = profile?.role === 'admin';
  
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

          {isAdmin && (
            <Button
              variant={isActive('/customer-management') ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => navigate('/customer-management')}
            >
              <Users className="mr-2 h-4 w-4" />
              Customers
            </Button>
          )}
          
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
          
          {isAdmin && (
            <Button
              variant={isActive('/data-management') ? 'secondary' : 'ghost'}
              className="w-full justify-start mb-1"
              onClick={() => navigate('/data-management')}
            >
              <Database className="mr-2 h-4 w-4" />
              Data Management
            </Button>
          )}

          <Button
            variant={isActive('/site-performance') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/site-performance')}
          >
            <Activity className="mr-2 h-4 w-4" />
            Site Performance
          </Button>
          
          <Button
            variant={isActive('/site-bugs') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/site-bugs')}
          >
            <Bug className="mr-2 h-4 w-4" />
            Bug Reports
          </Button>
          
          <Button
            variant={isActive('/feature-requests') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/feature-requests')}
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Feature Requests
          </Button>
          
          <Button
            variant={isActive('/support') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/support')}
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Support
          </Button>
          
          <Button
            variant={isActive('/settings') ? 'secondary' : 'ghost'}
            className="w-full justify-start mb-1"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </SidebarGroup>
        
        <SidebarFooter className="pt-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
