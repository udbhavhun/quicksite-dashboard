
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Login from "./pages/Login";
import SitePerformance from "./pages/SitePerformance";
import SiteBugs from "./pages/SiteBugs";
import FeatureRequests from "./pages/FeatureRequests";
import Messages from "./pages/Messages";
import DataManagement from "./pages/DataManagement";
import { useUserStore } from "./stores/userStore";
import NotificationCenter from "./components/NotificationCenter";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin-only route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userType } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (userType !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const { isAuthenticated, profile, updateProfile } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from Supabase session
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          try {
            // Fetch user profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileData) {
              updateProfile({
                id: session.user.id,
                email: session.user.email || '',
                name: profileData.name || '',
                role: profileData.role as 'customer' | 'admin',
                avatar: profileData.avatar_url,
              });
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsInitialized(true);
      
      if (!session) return;
      
      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          updateProfile({
            id: session.user.id,
            email: session.user.email || '',
            name: profileData.name || '',
            role: profileData.role as 'customer' | 'admin',
            avatar: profileData.avatar_url,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isInitialized) {
    // You can add a loading state here if needed
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-quicksite-blue border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <Routes>
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
              
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="/site-performance" element={<ProtectedRoute><SitePerformance /></ProtectedRoute>} />
              <Route path="/site-bugs" element={<ProtectedRoute><SiteBugs /></ProtectedRoute>} />
              <Route path="/feature-requests" element={<ProtectedRoute><FeatureRequests /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/data-management" element={<AdminRoute><DataManagement /></AdminRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Notification Center */}
            {isAuthenticated && <NotificationCenter />}
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
