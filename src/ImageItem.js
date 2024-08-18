import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

const ImageItem = ({ 
  image, 
  updateStatus, 
  openViewer, 
  isSelected, 
  toggleSelection, 
  addVariation, 
  updateVariationStatus, 
  toggleVariationSelection,
  selectedVariations,
  level = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    'Ready': 'bg-green-500',
    'In Progress': 'bg-yellow-500',
    'Needs Review': 'bg-red-500'
  };

  const handleVariationUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      addVariation(image.id, file);
    }
  };

  const renderVariations = () => {
    return image.variations && image.variations.length > 0 && (
      <div className="pl-4 mt-2 space-y-2">
        {image.variations.map((variation) => (
          <ImageItem
            key={variation.id}
            image={variation}
            updateStatus={(id, status) => updateVariationStatus(image.id, id, status)}
            openViewer={openViewer}
            isSelected={selectedVariations.includes(`${image.id}-${variation.id}`)}
            toggleSelection={() => toggleVariationSelection(image.id, variation.id)}
            addVariation={(parentId, file) => addVariation(image.id, parentId, file)}
            updateVariationStatus={(parentId, id, status) => updateVariationStatus(image.id, parentId, id, status)}
            toggleVariationSelection={toggleVariationSelection}
            selectedVariations={selectedVariations}
            level={level + 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded overflow-hidden shadow-lg m-4 ${level > 0 ? 'ml-8' : ''}`}>
      <div className="relative h-48">
        <img 
          className="w-full h-full object-contain cursor-pointer" 
          src={image.url} 
          alt={image.file.name} 
          onClick={() => openViewer(image.id)}
        />
        <div className={`absolute top-0 right-0 m-2 px-2 py-1 rounded text-white text-sm ${statusColors[image.status]}`}>
          {image.status}
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(image.id)}
          className="absolute top-2 left-2"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 truncate">
          {image.file.name}
        </div>
        <select 
          value={image.status} 
          onChange={(e) => updateStatus(image.id, e.target.value)}
          className="block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-4"
        >
          <option>Ready</option>
          <option>In Progress</option>
          <option>Needs Review</option>
        </select>
        <div className="flex justify-between mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleVariationUpload}
            className="hidden"
            id={`file-upload-${image.id}`}
          />
          <label
            htmlFor={`file-upload-${image.id}`}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
          >
            <Plus size={20} className="mr-2" />
            Add Variation
          </label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            {isExpanded ? <ChevronUp size={20} className="mr-2" /> : <ChevronDown size={20} className="mr-2" />}
            {isExpanded ? "Hide Variations" : "Show Variations"}
          </button>
        </div>
      </div>
      {isExpanded && renderVariations()}
    </div>
  );
};

export default ImageItem;