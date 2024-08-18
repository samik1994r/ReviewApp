import React, { useState, useEffect } from 'react';
import { storage } from './firebase';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import UploadButton from './UploadButton';
import SearchBar from './SearchBar';
import ActionButtons from './ActionButtons';
import ImageGrid from './ImageGrid';
import ImageViewer from './ImageViewer';
import ImageManager from './ImageManager';
import ImageMetadataManager from './ImageMetadataManager';
import ImageVariationManager from './ImageVariationManager';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentViewingImage, setCurrentViewingImage] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    loadImagesFromFirebase();
  }, []);

  const loadImagesFromFirebase = async () => {
    const imagesRef = ref(storage, 'images');
    try {
      const res = await listAll(imagesRef);
      const imagePromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        const variations = await ImageVariationManager.loadVariations(itemRef.fullPath);
        const mainImage = {
          id: uuidv4(),
          name: itemRef.name,
          url: url,
          status: metadata.customMetadata?.status || 'Needs Review',
          isVariation: false,
          parentId: null,
          variations: variations,
          todoNotes: JSON.parse(metadata.customMetadata?.todoNotes || '[]'),
          comments: JSON.parse(metadata.customMetadata?.comments || '[]')
        };
        return mainImage;
      });
      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);
    } catch (error) {
      console.error("Error loading images: ", error);
    }
  };

  const openViewer = (id) => {
    const imageToView = images.find(img => img.id === id) || 
                        images.flatMap(img => img.variations || []).find(variation => variation.id === id);
    if (imageToView) {
      setCurrentViewingImage(imageToView);
    }
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center space-x-4">
        <UploadButton onUpload={(files) => ImageManager.handleImageUpload(files, setImages)} />
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>
      
      {selectedItems.length > 0 && (
        <div className="mb-4">
          <ActionButtons 
            onRemove={() => ImageManager.removeSelectedItems(selectedItems, images, setImages, setSelectedItems)} 
            onDownload={() => ImageManager.downloadSelectedItems(selectedItems, images)} 
          />
        </div>
      )}

      <ImageGrid 
        images={filteredImages}
        updateStatus={(id, newStatus) => ImageMetadataManager.updateImageStatus(id, newStatus, images, setImages)}
        openViewer={openViewer}
        selectedItems={selectedItems}
        toggleSelection={toggleItemSelection}
        addVariation={(parentId, file) => ImageVariationManager.addImageVariation(parentId, file, images, setImages)}
        updateTodoNotes={(id, newNotes) => ImageMetadataManager.updateTodoNotes(id, newNotes, images, setImages)}
      />

      {currentViewingImage && (
        <ImageViewer 
          image={currentViewingImage}
          onClose={() => setCurrentViewingImage(null)}
          updateComments={(newComments) => ImageMetadataManager.updateImageComments(currentViewingImage.id, newComments, images, setImages)}
          updateTodoNotes={(newNotes) => ImageMetadataManager.updateTodoNotes(currentViewingImage.id, newNotes, images, setImages)}
        />
      )}
    </div>
  );
};

export default ImageList;