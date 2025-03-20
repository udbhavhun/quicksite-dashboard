
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
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
  SidebarMenuItem,
  SidebarProvider
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
  LogOut
} from 'lucide-react';

interface AppSidebarProps {
  userType?: 'customer' | 'admin';
}

const AppSidebar: React.FC<AppSidebarProps> = ({ userType = 'customer' }) => {
  const location = useLocation();
  
  const customerNavItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: location.pathname === '/' },
    { name: 'Orders', href: '/orders', icon: ShoppingBag, current: location.pathname.startsWith('/orders') },
    { name: 'Messages', href: '/messages', icon: MessageSquare, current: location.pathname.startsWith('/messages') },
    { name: 'Support', href: '/support', icon: HelpCircle, current: location.pathname.startsWith('/support') },
  ];
  
  const adminNavItems = [
    ...customerNavItems,
    { name: 'Customers', href: '/customers', icon: Users, current: location.pathname.startsWith('/customers') },
    { name: 'Analytics', href: '/analytics', icon: BarChart, current: location.pathname.startsWith('/analytics') },
  ];
  
  const navItems = userType === 'admin' ? adminNavItems : customerNavItems;

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-2">
        <Link to="/" className="text-xl font-bold text-quicksite-blue flex items-center justify-center">
          quicksite
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={item.current}
                    tooltip={item.name}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
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
                  <Link to="/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/settings">
                    <Settings />
                    <span>Settings</span>
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
              <button className="w-full text-left">
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
