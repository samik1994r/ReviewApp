import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative flex-grow">
      <input
        type="text"
        placeholder="Search images..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 pl-10 border rounded"
      />
      <Search size={20} className="absolute left-3 top-2 text-gray-400" />
    </div>
  );
};

export default SearchBar;