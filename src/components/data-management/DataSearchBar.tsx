
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DataSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DataSearchBar: React.FC<DataSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default DataSearchBar;
