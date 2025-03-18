
import React, { useState } from 'react';
import { Bell, Menu, User, X } from 'lucide-react';

interface HeaderProps {
  userType?: 'customer' | 'admin';
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userType = 'customer',
  userName = 'John Doe'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-quicksite-blue">quicksite</span>
          </a>
          
          <nav className="hidden md:flex ml-10 space-x-8">
            <a href="/" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Orders
            </a>
            <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Packages
            </a>
            {userType === 'admin' && (
              <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
                Customers
              </a>
            )}
            <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Support
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-quicksite-blue rounded-full"></span>
          </button>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-quicksite-blue/10 flex items-center justify-center">
              <User size={16} className="text-quicksite-blue" />
            </div>
            <span className="text-sm font-medium">{userName}</span>
          </div>
          
          <button 
            className="block md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 py-4 px-6 shadow-lg animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <a href="/" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Dashboard
            </a>
            <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Orders
            </a>
            <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Packages
            </a>
            {userType === 'admin' && (
              <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
                Customers
              </a>
            )}
            <a href="#" className="text-gray-700 hover:text-quicksite-blue transition-colors duration-200">
              Support
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
