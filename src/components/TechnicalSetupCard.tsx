
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Shield, Wifi, HardDrive, Clock } from 'lucide-react';

export interface TechnicalSetupCardProps {
  domainName: string;
  isSSLActive: boolean;
  diskUsage: number;
  bandwidthUsage: number;
  uptime: number;
  serverLocation: string;
}

const TechnicalSetupCard: React.FC<TechnicalSetupCardProps> = ({
  domainName = "example.com",
  isSSLActive = true,
  diskUsage = 25,
  bandwidthUsage = 5,
  uptime = 99.95,
  serverLocation = "US East"
}) => {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          Technical Setup
        </CardTitle>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${isSSLActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {isSSLActive ? "All Systems Active" : "Setup in Progress"}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <Server className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Hosting Plan</h3>
                <p className="text-xs text-gray-500">Premium Cloud Hosting</p>
                <p className="text-xs text-blue-600 mt-1">Active</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">SSL Certificate</h3>
                <p className="text-xs text-gray-500">Let's Encrypt</p>
                <p className="text-xs text-green-600 mt-1">{isSSLActive ? "Valid" : "Pending"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Wifi className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">CDN Status</h3>
                <p className="text-xs text-gray-500">Cloudflare</p>
                <p className="text-xs text-purple-600 mt-1">Enabled</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <HardDrive className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Server Location</h3>
                <p className="text-xs text-gray-500">{serverLocation}</p>
                <p className="text-xs text-orange-600 mt-1">Optimized</p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Technical Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-white p-2 border border-gray-100">
                <p className="text-xs text-gray-500">Disk Usage</p>
                <p className="text-lg font-semibold">{diskUsage}%</p>
              </div>
              <div className="rounded-lg bg-white p-2 border border-gray-100">
                <p className="text-xs text-gray-500">Bandwidth</p>
                <p className="text-lg font-semibold">{bandwidthUsage}GB</p>
              </div>
              <div className="rounded-lg bg-white p-2 border border-gray-100">
                <p className="text-xs text-gray-500">Uptime</p>
                <p className="text-lg font-semibold">{uptime}%</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center pt-2">
            <Clock className="h-3 w-3 text-gray-400 mr-1" />
            <span className="text-xs text-gray-500">Last backup: Today at 03:00 AM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSetupCard;
