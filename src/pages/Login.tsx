
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/userStore';
import { toast } from '@/hooks/use-toast';
import { User, Users, Lock, ArrowRight, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUserStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo credentials
  const demoCredentials = [
    {
      type: 'Customer',
      email: 'customer@example.com',
      password: 'password123'
    },
    {
      type: 'Admin',
      email: 'admin@example.com',
      password: 'admin123'
    }
  ];
  
  const fillDemoCredentials = (type: 'Customer' | 'Admin') => {
    const credentials = type === 'Customer' ? demoCredentials[0] : demoCredentials[1];
    setEmail(credentials.email);
    setPassword(credentials.password);
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
          <Alert className="mb-6 bg-blue-50 border-blue-100">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700 text-sm">
              <strong>Demo Credentials:</strong><br />
              Customer: customer@example.com / password123<br />
              Admin: admin@example.com / admin123
            </AlertDescription>
          </Alert>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              Sign in
            </Button>
          </form>
          
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={() => fillDemoCredentials('Customer')} 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              Fill Customer Demo
            </Button>
            <Button 
              onClick={() => fillDemoCredentials('Admin')} 
              variant="outline" 
              size="sm" 
              className="flex-1"
            >
              Fill Admin Demo
            </Button>
          </div>
          
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
