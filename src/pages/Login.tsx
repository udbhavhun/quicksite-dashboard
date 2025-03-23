
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/stores/userStore";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, error: storeError, clearError } = useUserStore();
  
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
  });
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("login");
  
  // Clear any existing auth errors when component mounts or tab changes
  React.useEffect(() => {
    clearError();
  }, [activeTab, clearError]);
  
  // Show error toast if store has an error
  React.useEffect(() => {
    if (storeError) {
      toast({
        title: "Authentication Error",
        description: storeError,
        variant: "destructive",
      });
    }
  }, [storeError]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      // Error will be handled by the userStore and shown via toast
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.name);
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      // Error will be handled by the userStore and shown via toast
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize demo customer in Supabase if it doesn't exist
  const createDemoCustomerIfNeeded = async () => {
    // Check if customer demo user exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', 'customer@example.com')
      .limit(1);
    
    if (!existingUsers || existingUsers.length === 0) {
      // Create the demo customer user
      const { data, error } = await supabase.auth.signUp({
        email: 'customer@example.com',
        password: 'customer123',
        options: {
          data: {
            name: 'Customer Demo',
          },
        }
      });
      
      if (error) {
        console.error("Failed to create demo customer:", error);
      } else if (data.user) {
        // Set the role to customer explicitly
        await supabase
          .from('profiles')
          .update({ role: 'customer' })
          .eq('id', data.user.id);
      }
    }
  };
  
  // Create demo accounts if needed when component mounts
  React.useEffect(() => {
    createDemoCustomerIfNeeded();
  }, []);
  
  const setDemoLogin = (type: 'admin' | 'customer') => {
    if (type === 'admin') {
      setFormData({
        email: "admin@example.com",
        password: "admin123",
        name: "",
      });
    } else {
      setFormData({
        email: "customer@example.com",
        password: "customer123",
        name: "",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <Card className="glass-card w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gradient">
              QuickSite Management
            </CardTitle>
            <CardDescription className="text-center">
              Log in to your account to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      required 
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input 
                      id="signup-name" 
                      name="name" 
                      placeholder="John Doe" 
                      required 
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      name="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      required 
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      name="password" 
                      type="password" 
                      required 
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-center text-gray-500">
              Demo Accounts
            </div>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={() => setDemoLogin('admin')}>
                Admin Demo
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setDemoLogin('customer')}>
                Customer Demo
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
