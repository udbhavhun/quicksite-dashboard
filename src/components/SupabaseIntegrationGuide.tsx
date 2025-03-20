
import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Database, Shield, Key, UserCircle, Link, Code, Globe } from 'lucide-react';

const SupabaseIntegrationGuide = () => {
  const steps = [
    {
      title: "Create a Supabase account",
      description: "Sign up for a free Supabase account at supabase.com",
      icon: <UserCircle />,
      codeSnippet: null,
      link: "https://supabase.com"
    },
    {
      title: "Create a new project",
      description: "Set up a new project in Supabase dashboard and note your project URL and API keys",
      icon: <Database />,
      codeSnippet: null,
      link: null
    },
    {
      title: "Install Supabase client",
      description: "Add the Supabase JavaScript client to your project",
      icon: <Code />,
      codeSnippet: `npm install @supabase/supabase-js`,
      link: null
    },
    {
      title: "Configure environment variables",
      description: "Store your Supabase URL and anon key securely",
      icon: <Key />,
      codeSnippet: `
// Create a .env file with:
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
      `,
      link: null
    },
    {
      title: "Initialize Supabase client",
      description: "Create a client instance to interact with your Supabase project",
      icon: <Link />,
      codeSnippet: `
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
      `,
      link: null
    },
    {
      title: "Set up authentication",
      description: "Implement user sign-up, sign-in, and session management",
      icon: <Shield />,
      codeSnippet: `
// Example auth functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
      `,
      link: null
    },
    {
      title: "Create database tables",
      description: "Design your database schema and create tables",
      icon: <Database />,
      codeSnippet: `
-- Example SQL for Quicksite tables
CREATE TABLE users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  package_id TEXT NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT,
  payment_status TEXT,
  total_amount DECIMAL(10,2)
);
      `,
      link: null
    },
    {
      title: "Deploy your application",
      description: "Deploy your Quicksite application with Supabase integration",
      icon: <Globe />,
      codeSnippet: null,
      link: null
    }
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gradient">Supabase Integration Guide</h2>
      
      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex"
          >
            <div className="relative mr-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-quicksite-blue text-white">
                {step.icon || <Check />}
              </div>
              {index < steps.length - 1 && (
                <div className="absolute top-10 left-1/2 w-0.5 h-16 -ml-0.5 bg-gray-200"></div>
              )}
            </div>
            
            <div className="pb-8 -mt-1">
              <h3 className="text-xl font-medium mb-2 flex items-center">
                <span>{index + 1}. {step.title}</span>
              </h3>
              <p className="text-gray-600 mb-3">{step.description}</p>
              
              {step.codeSnippet && (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto my-3">
                  <pre className="text-sm">
                    <code>{step.codeSnippet}</code>
                  </pre>
                </div>
              )}
              
              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-quicksite-blue hover:underline mt-2"
                >
                  Learn more <ArrowRight size={14} className="ml-1" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-quicksite-blue/10 rounded-lg">
        <h3 className="font-medium mb-2">Need help with Supabase integration?</h3>
        <p className="text-sm text-gray-600">
          Check out the official Supabase documentation for detailed guides on authentication, database management, and more:
        </p>
        <a
          href="https://supabase.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-quicksite-blue hover:underline mt-2"
        >
          Supabase Documentation <ArrowRight size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default SupabaseIntegrationGuide;
