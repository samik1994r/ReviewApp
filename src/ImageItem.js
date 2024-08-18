import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import TodoNotes from './TodoNotes';

const ImageItem = ({ 
  image, 
  updateStatus, 
  openViewer, 
  isSelected, 
  toggleSelection, 
  addVariation, 
  selectedItems,
  updateTodoNotes
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

  const renderVariationStatusIndicators = () => {
    if (!image.variations || image.variations.length === 0) return null;

    return (
      <div className="absolute top-12 right-0 m-2 flex flex-col space-y-1">
        {image.variations.map((variation, index) => (
          <div 
            key={index} 
            className={`w-3 h-3 rounded-full ${statusColors[variation.status]}`} 
            title={`${variation.name}: ${variation.status}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="rounded overflow-hidden shadow-lg m-4">
      <div className="relative h-48">
        <img 
          className="w-full h-full object-contain cursor-pointer" 
          src={image.url} 
          alt={image.name} 
          onClick={() => openViewer(image.id)}
        />
        <div className={`absolute top-0 right-0 m-2 px-2 py-1 rounded text-white text-sm ${statusColors[image.status]}`}>
          {image.status}
        </div>
        {renderVariationStatusIndicators()}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(image.id)}
          className="absolute top-2 left-2"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 truncate">
          {image.name}
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
        <TodoNotes 
          notes={image.todoNotes} 
          onUpdateNotes={(updatedNotes) => updateTodoNotes(image.id, updatedNotes)} 
        />
        {!image.isVariation && (
          <div className="flex justify-between mt-4">
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
            {image.variations && image.variations.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                {isExpanded ? <ChevronUp size={20} className="mr-2" /> : <ChevronDown size={20} className="mr-2" />}
                {isExpanded ? "Hide Variations" : "Show Variations"}
              </button>
            )}
          </div>
        )}
      </div>
      {!image.isVariation && isExpanded && image.variations && image.variations.length > 0 && (
        <div className="px-6 py-4 bg-gray-100">
          <h4 className="font-bold mb-2">Variations:</h4>
          <div className="space-y-4">
            {image.variations.map((variation) => (
              <ImageItem
                key={variation.id}
                image={variation}
                updateStatus={updateStatus}
                openViewer={openViewer}
                isSelected={selectedItems.includes(variation.id)}
                toggleSelection={toggleSelection}
                addVariation={() => {}}
                selectedItems={selectedItems}
                updateTodoNotes={updateTodoNotes}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageItem;