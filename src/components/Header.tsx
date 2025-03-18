
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, Settings, LogOut, Package, BarChart, MessageSquare, Users, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";

interface HeaderProps {
  userType?: 'customer' | 'admin';
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userType = 'customer',
  userName = 'John Doe'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const handleToggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/', current: location.pathname === '/' },
    { name: 'Orders', href: '/orders', current: location.pathname.startsWith('/orders') },
    { name: 'Messages', href: '/messages', current: location.pathname.startsWith('/messages') },
    { name: 'Support', href: '/support', current: location.pathname.startsWith('/support') },
  ];
  
  // Admin-specific navigation items
  const adminNavigation = [
    ...navigation,
    { name: 'Customers', href: '/customers', current: location.pathname.startsWith('/customers') },
    { name: 'Analytics', href: '/analytics', current: location.pathname.startsWith('/analytics') },
  ];
  
  // Determine which navigation to use based on userType
  const navItems = userType === 'admin' ? adminNavigation : navigation;

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-quicksite-blue">
                quicksite
              </Link>
            </div>
            <nav className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    item.current
                      ? 'bg-gray-50 text-quicksite-blue'
                      : 'text-gray-600 hover:text-quicksite-blue hover:bg-gray-50',
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:block">
              <div className="flex items-center">
                <div className="relative group">
                  <button className="flex items-center text-sm rounded-full focus:outline-none">
                    <div className="flex items-center transition-colors text-gray-700 hover:text-quicksite-blue">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <User size={16} />
                      </div>
                      <span className="font-medium">{userName}</span>
                    </div>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform group-hover:translate-y-0 translate-y-1 z-50">
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <Package size={16} className="mr-2" />
                        Orders
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="sm:hidden ml-2 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-50 focus:outline-none"
              onClick={handleToggleMenu}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                item.current
                  ? 'bg-gray-50 text-quicksite-blue'
                  : 'text-gray-600 hover:text-quicksite-blue hover:bg-gray-50',
                'block px-3 py-2 text-base font-medium transition-colors duration-150'
              )}
              aria-current={item.current ? 'page' : undefined}
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={20} />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">{userName}</div>
              <div className="text-sm font-medium text-gray-500">{userType}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <Link
              to="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-quicksite-blue hover:bg-gray-50 flex items-center"
              onClick={closeMenu}
            >
              <User size={18} className="mr-2" />
              Your Profile
            </Link>
            <Link
              to="/orders"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-quicksite-blue hover:bg-gray-50 flex items-center"
              onClick={closeMenu}
            >
              <ShoppingBag size={18} className="mr-2" />
              Orders
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-quicksite-blue hover:bg-gray-50 flex items-center"
              onClick={closeMenu}
            >
              <Settings size={18} className="mr-2" />
              Settings
            </Link>
            <button
              className="w-full text-left block px-4 py-2 text-base font-medium text-gray-600 hover:text-quicksite-blue hover:bg-gray-50 flex items-center"
              onClick={closeMenu}
            >
              <LogOut size={18} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
