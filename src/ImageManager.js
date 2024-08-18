import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import ImageMetadataManager from './ImageMetadataManager';

const ImageManager = {
  handleImageUpload: async (files, setImages) => {
    const newImages = [];

    for (const file of files) {
      const storageRef = ref(storage, 'images/' + file.name);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);

        const newImage = {
          id: uuidv4(),
          name: file.name,
          url: url,
          status: 'Needs Review',
          isVariation: false,
          parentId: null,
          variations: [],
          todoNotes: [],
          comments: []
        };

        await ImageMetadataManager.updateImageMetadata(newImage.id, {
          status: newImage.status,
          todoNotes: newImage.todoNotes,
          comments: newImage.comments
        });

        newImages.push(newImage);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }

    setImages(prevImages => [...prevImages, ...newImages]);
  },

  removeSelectedItems: async (selectedItems, images, setImages, setSelectedItems) => {
    for (const id of selectedItems) {
      const image = images.find(img => img.id === id) || 
                    images.flatMap(img => img.variations || []).find(variation => variation.id === id);
      if (image) {
        const storageRef = ref(storage, `images/${image.isVariation ? image.parentId + '/variations/' : ''}${image.name}`);
        try {
          await deleteObject(storageRef);
          if (!image.isVariation && image.variations) {
            // Delete variations if it's a main image
            for (const variation of image.variations) {
              const variationRef = ref(storage, `images/${image.name}/variations/${variation.name}`);
              await deleteObject(variationRef);
            }
          }
        } catch (error) {
          console.error("Error deleting file: ", error);
        }
      }
    }

    setImages(prevImages => 
      prevImages.filter(image => {
        if (selectedItems.includes(image.id)) {
          return false;
        }
        if (image.variations) {
          image.variations = image.variations.filter(variation => !selectedItems.includes(variation.id));
        }
        return true;
      })
    );
    setSelectedItems([]);
  },

  downloadSelectedItems: (selectedItems, images) => {
    selectedItems.forEach(id => {
      const image = images.find(img => img.id === id) || 
                    images.flatMap(img => img.variations || []).find(variation => variation.id === id);
      if (image) {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = image.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }
};

export default ImageManager;