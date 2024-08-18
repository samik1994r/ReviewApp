import React from 'react';
import ImageItem from './ImageItem';

const ImageGrid = ({ 
  images, 
  updateStatus, 
  openViewer, 
  selectedItems, 
  toggleSelection, 
  addVariation,
  updateTodoNotes
}) => {
  return (
    <div className="flex flex-wrap">
      {images.map((image) => (
        <ImageItem 
          key={image.id}
          image={image}
          variations={images.filter(img => img.parentId === image.id)}
          updateStatus={updateStatus}
          openViewer={openViewer}
          isSelected={selectedItems.includes(image.id)}
          toggleSelection={toggleSelection}
          addVariation={addVariation}
          selectedItems={selectedItems}
          updateTodoNotes={updateTodoNotes}
        />
      ))}
    </div>
  );
};

export default ImageGrid;