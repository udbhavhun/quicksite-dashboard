
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';
import { User, Users, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useUserStore(state => state.login);
  
  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login('customer', 'John Doe');
      toast({
        title: "Login successful",
        description: "Welcome back, John Doe!",
      });
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };
  
  const handleAdminLogin = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login('admin', 'Admin User');
      toast({
        title: "Admin login successful",
        description: "Welcome back, Admin!",
      });
      navigate('/');
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">quicksite</h1>
          <p className="text-gray-600">Sign in to your dashboard</p>
        </div>
        
        <div className="glass-card p-8 shadow-xl">
          <form onSubmit={handleCustomerLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-quicksite-blue focus:ring-quicksite-blue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-quicksite-blue hover:text-quicksite-dark-blue">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-quicksite-blue hover:bg-quicksite-dark-blue text-white flex items-center justify-center micro-bounce"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <User size={16} className="mr-2" />
              )}
              Sign in as Customer
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-gray-500 text-sm">or</span>
          </div>
          
          <Button
            onClick={handleAdminLogin}
            className="w-full mt-4 bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center micro-bounce"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Users size={16} className="mr-2" />
            )}
            Sign in as Admin
          </Button>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-quicksite-blue hover:text-quicksite-dark-blue">
                Contact us <ArrowRight size={14} className="inline" />
              </a>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
