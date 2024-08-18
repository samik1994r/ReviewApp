import React, { useState } from 'react';
import ImageItem from './ImageItem';
import ImageViewer from './ImageViewer';
import { Upload, Search, Trash2, Download } from 'lucide-react';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentViewingImage, setCurrentViewingImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file: file,
      status: 'Needs Review',
      variations: [],
      comments: []
    }));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const updateImageStatus = (id, newStatus) => {
    setImages(prevImages => 
      prevImages.map(image =>
        updateImageStatusRecursive(image, id, newStatus)
      )
    );
  };

  const updateImageStatusRecursive = (image, id, newStatus) => {
    if (image.id === id) {
      return { ...image, status: newStatus };
    }
    if (image.variations) {
      return {
        ...image,
        variations: image.variations.map(variation => 
          updateImageStatusRecursive(variation, id, newStatus)
        )
      };
    }
    return image;
  };

  const addImageVariation = (parentId, file) => {
    setImages(prevImages => 
      prevImages.map(image => 
        addImageVariationRecursive(image, parentId, file)
      )
    );
  };

  const addImageVariationRecursive = (image, parentId, file) => {
    if (image.id === parentId) {
      return {
        ...image,
        variations: [...(image.variations || []), {
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(file),
          file: file,
          status: 'Needs Review',
          comments: [],
          variations: []
        }]
      };
    }
    if (image.variations) {
      return {
        ...image,
        variations: image.variations.map(variation => 
          addImageVariationRecursive(variation, parentId, file)
        )
      };
    }
    return image;
  };

  const openViewer = (id) => {
    const imageToView = findImageById(images, id);
    if (imageToView) {
      setCurrentViewingImage(imageToView);
    }
  };

  const findImageById = (images, id) => {
    for (const image of images) {
      if (image.id === id) return image;
      if (image.variations) {
        const found = findImageById(image.variations, id);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleImageSelection = (id) => {
    setSelectedImages(prevSelected => 
      prevSelected.includes(id)
        ? prevSelected.filter(imageId => imageId !== id)
        : [...prevSelected, id]
    );
  };

  const toggleVariationSelection = (parentId, variationId) => {
    setSelectedVariations(prevSelected => {
      const key = `${parentId}-${variationId}`;
      return prevSelected.includes(key)
        ? prevSelected.filter(id => id !== key)
        : [...prevSelected, key];
    });
  };

  const updateImageComments = (id, newComments) => {
    setImages(prevImages => 
      prevImages.map(image => 
        updateImageCommentsRecursive(image, id, newComments)
      )
    );
  };

  const updateImageCommentsRecursive = (image, id, newComments) => {
    if (image.id === id) {
      return { ...image, comments: newComments };
    }
    if (image.variations) {
      return {
        ...image,
        variations: image.variations.map(variation => 
          updateImageCommentsRecursive(variation, id, newComments)
        )
      };
    }
    return image;
  };

  const imageMatchesSearch = (image, term) => {
    if (image.file.name.toLowerCase().includes(term)) return true;
    if (image.variations) {
      return image.variations.some(variation => imageMatchesSearch(variation, term));
    }
    return false;
  };

  const filteredImages = images.filter(image => 
    imageMatchesSearch(image, searchTerm.toLowerCase())
  );

  const updateBatchStatus = (newStatus) => {
    setImages(prevImages => 
      prevImages.map(image => 
        updateBatchStatusRecursive(image, newStatus)
      )
    );
    setSelectedImages([]);
    setSelectedVariations([]);
  };

  const updateBatchStatusRecursive = (image, newStatus) => {
    let updatedImage = { ...image };
    if (selectedImages.includes(image.id)) {
      updatedImage.status = newStatus;
    }
    if (image.variations) {
      updatedImage.variations = image.variations.map(variation => {
        const key = `${image.id}-${variation.id}`;
        if (selectedVariations.includes(key)) {
          return { ...variation, status: newStatus };
        }
        return updateBatchStatusRecursive(variation, newStatus);
      });
    }
    return updatedImage;
  };

  const removeSelectedItems = () => {
    setImages(prevImages => 
      prevImages.filter(image => !selectedImages.includes(image.id))
        .map(image => removeSelectedItemsRecursive(image))
    );
    setSelectedImages([]);
    setSelectedVariations([]);
  };

  const removeSelectedItemsRecursive = (image) => {
    if (image.variations) {
      return {
        ...image,
        variations: image.variations
          .filter(variation => !selectedVariations.includes(`${image.id}-${variation.id}`))
          .map(variation => removeSelectedItemsRecursive(variation))
      };
    }
    return image;
  };

  const downloadSelectedItems = () => {
    const downloadImage = (image) => {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = image.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const processImage = (image) => {
      if (selectedImages.includes(image.id)) {
        downloadImage(image);
      }
      if (image.variations) {
        image.variations.forEach(variation => {
          if (selectedVariations.includes(`${image.id}-${variation.id}`)) {
            downloadImage(variation);
          }
          processImage(variation);
        });
      }
    };

    images.forEach(processImage);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center space-x-4">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded cursor-pointer"
          >
            <Upload size={20} className="mr-2" />
            Upload Images
          </label>
        </div>
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded"
            />
            <Search size={20} className="absolute left-3 top-2 text-gray-400" />
          </div>
        </div>
      </div>
      
      {(selectedImages.length > 0 || selectedVariations.length > 0) && (
        <div className="mb-4 flex space-x-2">
          <select
            onChange={(e) => updateBatchStatus(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Change Status</option>
            <option value="Ready">Ready</option>
            <option value="In Progress">In Progress</option>
            <option value="Needs Review">Needs Review</option>
          </select>
          <button
            onClick={removeSelectedItems}
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Trash2 size={20} className="mr-2" />
            Remove Selected
          </button>
          <button
            onClick={downloadSelectedItems}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Download size={20} className="mr-2" />
            Download Selected
          </button>
        </div>
      )}

      <div className="flex flex-wrap">
        {filteredImages.map((image) => (
          <ImageItem 
            key={image.id}
            image={image} 
            updateStatus={updateImageStatus}
            openViewer={openViewer}
            isSelected={selectedImages.includes(image.id)}
            toggleSelection={toggleImageSelection}
            addVariation={addImageVariation}
            updateVariationStatus={updateImageStatus}
            toggleVariationSelection={toggleVariationSelection}
            selectedVariations={selectedVariations}
          />
        ))}
      </div>
      {currentViewingImage && (
        <ImageViewer 
          image={currentViewingImage}
          onClose={() => setCurrentViewingImage(null)}
          updateComments={(newComments) => updateImageComments(currentViewingImage.id, newComments)}
        />
      )}
    </div>
  );
};

export default ImageList;