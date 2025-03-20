
import React from 'react';
import { motion } from 'framer-motion';
import { Server, Globe, Shield, Cpu, BarChart, Zap, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface HostingStatusCardProps {
  domainName: string;
  isSSLActive: boolean;
  diskUsage: number;
  bandwidthUsage: number;
  serverLocation: string;
  uptime: number;
}

const HostingStatusCard: React.FC<HostingStatusCardProps> = ({
  domainName,
  isSSLActive,
  diskUsage,
  bandwidthUsage,
  serverLocation,
  uptime
}) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gradient">Hosting Status</h3>
        <button className="glass-button px-3 py-1.5 rounded-lg flex items-center text-sm micro-bounce">
          <ExternalLink size={14} className="mr-1.5" />
          Access Panel
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-white/20 bg-white/40 backdrop-blur-md overflow-hidden">
          <CardContent className="pt-6">
            {/* Domain Status */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-quicksite-blue/10 text-quicksite-blue mr-3">
                <Globe size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Domain</h4>
                  <span className="status-indicator">
                    <span className="status-dot status-active"></span>
                    <span className="text-xs">Active</span>
                  </span>
                </div>
                <p className="text-sm font-medium text-quicksite-blue mt-1">{domainName}</p>
              </div>
            </div>
            
            {/* SSL Status */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-quicksite-success/10 text-quicksite-success mr-3">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">SSL Certificate</h4>
                  <span className="status-indicator">
                    <span className={`status-dot ${isSSLActive ? 'status-active' : 'status-pending'}`}></span>
                    <span className="text-xs">{isSSLActive ? 'Active' : 'Provisioning'}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {isSSLActive ? 'Valid until Dec 31, 2025' : 'Will be ready in 24 hours'}
                </p>
              </div>
            </div>
            
            {/* Server Location */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 mr-3">
                <Server size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Server Location</h4>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">Optimized</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{serverLocation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-white/20 bg-white/40 backdrop-blur-md overflow-hidden">
          <CardContent className="pt-6">
            {/* Disk Usage */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center">
                  <Cpu size={16} className="text-quicksite-blue mr-1.5" />
                  <h4 className="text-sm font-medium">Disk Usage</h4>
                </div>
                <span className="text-xs font-medium">{diskUsage}% used</span>
              </div>
              <Progress value={diskUsage} className="h-1.5" />
              <p className="text-xs text-gray-500 mt-1.5">2.3 GB of 10 GB used</p>
            </div>
            
            {/* Bandwidth Usage */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center">
                  <BarChart size={16} className="text-quicksite-blue mr-1.5" />
                  <h4 className="text-sm font-medium">Bandwidth</h4>
                </div>
                <span className="text-xs font-medium">{bandwidthUsage}% used</span>
              </div>
              <Progress value={bandwidthUsage} className="h-1.5" />
              <p className="text-xs text-gray-500 mt-1.5">7.2 GB of 100 GB used this month</p>
            </div>
            
            {/* Uptime */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center">
                  <Zap size={16} className="text-quicksite-success mr-1.5" />
                  <h4 className="text-sm font-medium">Uptime</h4>
                </div>
                <span className="text-xs font-medium">{uptime}%</span>
              </div>
              <Progress value={uptime} className="h-1.5" />
              <p className="text-xs text-gray-500 mt-1.5">Last 30 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4 text-center">
        <motion.div 
          className="inline-block"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-gray-500">
            All systems operational. View{' '}
            <a href="#" className="text-quicksite-blue hover:underline">detailed status</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HostingStatusCard;
