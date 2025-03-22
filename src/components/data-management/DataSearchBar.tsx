
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DataSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilter?: () => void;
  filterLabel?: string;
}

const DataSearchBar: React.FC<DataSearchBarProps> = ({ searchQuery, setSearchQuery, onFilter, filterLabel = "Filter" }) => {
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
        {onFilter && (
          <Button variant="outline" onClick={onFilter} className="self-start md:self-center">
            <Filter size={16} className="mr-2" />
            {filterLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataSearchBar;
