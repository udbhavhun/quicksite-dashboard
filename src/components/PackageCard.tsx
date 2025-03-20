
import React from 'react';
import { Package } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

interface PackageCardProps {
  package: Package;
  onClick?: () => void;
  className?: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onClick,
  className = '',
}) => {
  return (
    <div 
      className={`relative overflow-hidden glass-card group transition-all duration-300 hover-lift ${className}`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="badge-blue mb-4">Starting ₹{pkg.price.toLocaleString()}</div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-quicksite-blue transition-colors duration-200">{pkg.name}</h3>
        <p className="text-gray-600 mb-4">{pkg.description}</p>
        
        <ul className="space-y-2 mb-6">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-quicksite-blue mr-2">•</span>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button className="w-full py-2.5 px-4 glass-button bg-quicksite-blue/10 text-quicksite-blue hover:bg-quicksite-blue hover:text-white rounded-xl flex items-center justify-center transition-all duration-200">
          <span>Order Now</span>
          <ArrowRight size={16} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
      
      <div className="absolute bottom-0 right-0 w-1/4 h-1 bg-quicksite-blue rounded-tl-lg transform transition-all duration-300 scale-x-0 origin-right group-hover:scale-x-100"></div>
    </div>
  );
};

export default PackageCard;
