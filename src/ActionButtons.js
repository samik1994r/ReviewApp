import React from 'react';
import { Trash2, Download } from 'lucide-react';

const ActionButtons = ({ onRemove, onDownload }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onRemove}
        className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
      >
        <Trash2 size={20} className="mr-2" />
        Remove Selected
      </button>
      <button
        onClick={onDownload}
        className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
      >
        <Download size={20} className="mr-2" />
        Download Selected
      </button>
    </div>
  );
};

export default ActionButtons;
