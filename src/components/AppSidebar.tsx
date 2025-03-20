
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  HelpCircle, 
  Users, 
  BarChart, 
  Settings, 
  User, 
  LogOut,
  AlertTriangle,
  ListTodo,
  Activity,
  Zap,
  FileText
} from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppSidebar = () => {
  const location = useLocation();
  const { userType, logout } = useUserStore();
  const navigate = useNavigate();
  
  const customerNavItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: location.pathname === '/' },
    { name: 'Orders', href: '/orders', icon: ShoppingBag, current: location.pathname.startsWith('/orders') },
    { name: 'Messages', href: '/messages', icon: MessageSquare, current: location.pathname.startsWith('/messages') },
    { name: 'Feature Requests', href: '/feature-requests', icon: ListTodo, current: location.pathname.startsWith('/feature-requests') },
    { name: 'Site Performance', href: '/site-performance', icon: Activity, current: location.pathname.startsWith('/site-performance') },
    { name: 'Support', href: '/support', icon: HelpCircle, current: location.pathname.startsWith('/support') },
  ];
  
  const adminNavItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: location.pathname === '/' },
    { name: 'Orders', href: '/orders', icon: ShoppingBag, current: location.pathname.startsWith('/orders') },
    { name: 'Customers', href: '/customers', icon: Users, current: location.pathname.startsWith('/customers') },
    { name: 'Analytics', href: '/analytics', icon: BarChart, current: location.pathname.startsWith('/analytics') },
    { name: 'Site Bugs', href: '/site-bugs', icon: AlertTriangle, current: location.pathname.startsWith('/site-bugs') },
    { name: 'Site Performance', href: '/site-performance', icon: Activity, current: location.pathname.startsWith('/site-performance') },
    { name: 'Feature Management', href: '/feature-requests', icon: ListTodo, current: location.pathname.startsWith('/feature-requests') },
  ];
  
  const navItems = userType === 'admin' ? adminNavItems : customerNavItems;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-2">
        <Link to="/" className="text-xl font-bold text-quicksite-blue flex items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="mr-2"
          >
            <Zap size={24} />
          </motion.div>
          quicksite
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.current}
                    tooltip={item.name}
                  >
                    <Link to={item.href} className="micro-bounce">
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <item.icon />
                      </motion.div>
                      <motion.span
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.1, duration: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Profile">
                  <Link to="/profile" className="micro-bounce">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/settings" className="micro-bounce">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Documentation">
                  <Link to="/support" className="micro-bounce">
                    <FileText />
                    <span>Documentation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign out">
              <button className="w-full text-left" onClick={handleSignOut}>
                <LogOut />
                <span>Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
