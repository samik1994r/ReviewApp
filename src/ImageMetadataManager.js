import { storage } from './firebase';
import { ref, getMetadata, updateMetadata } from 'firebase/storage';

const ImageMetadataManager = {
  updateImageMetadata: async (imageId, updates, images) => {
    const image = images.find(img => img.id === imageId) ||
                  images.flatMap(img => img.variations || []).find(variation => variation.id === imageId);
    if (!image) return;

    const imageRef = ref(storage, `images/${image.isVariation ? image.parentId + '/variations/' : ''}${image.name}`);
    
    try {
      const metadata = await getMetadata(imageRef);
      const updatedMetadata = {
        ...metadata,
        customMetadata: {
          ...metadata.customMetadata,
          ...updates,
          status: updates.status || metadata.customMetadata?.status,
          todoNotes: JSON.stringify(updates.todoNotes || []),
          comments: JSON.stringify(updates.comments || [])
        }
      };
      await updateMetadata(imageRef, updatedMetadata);
    } catch (error) {
      console.error("Error updating image metadata: ", error);
    }
  },

  updateImageStatus: async (id, newStatus, images, setImages) => {
    setImages(prevImages =>
      prevImages.map(image => {
        if (image.id === id) {
          const updatedImage = { ...image, status: newStatus };
          this.updateImageMetadata(id, { status: newStatus }, prevImages);
          return updatedImage;
        }
        if (image.variations) {
          const updatedVariations = image.variations.map(variation =>
            variation.id === id ? { ...variation, status: newStatus } : variation
          );
          if (updatedVariations !== image.variations) {
            return { ...image, variations: updatedVariations };
          }
        }
        return image;
      })
    );
  },

  updateImageComments: async (id, newComments, images, setImages) => {
    setImages(prevImages =>
      prevImages.map(image => {
        if (image.id === id) {
          const updatedImage = { ...image, comments: newComments };
          this.updateImageMetadata(id, { comments: newComments }, prevImages);
          return updatedImage;
        }
        if (image.variations) {
          const updatedVariations = image.variations.map(variation =>
            variation.id === id ? { ...variation, comments: newComments } : variation
          );
          if (updatedVariations !== image.variations) {
            return { ...image, variations: updatedVariations };
          }
        }
        return image;
      })
    );
  },

  updateTodoNotes: async (id, newNotes, images, setImages) => {
    setImages(prevImages =>
      prevImages.map(image => {
        if (image.id === id) {
          const updatedImage = { ...image, todoNotes: newNotes };
          this.updateImageMetadata(id, { todoNotes: newNotes }, prevImages);
          return updatedImage;
        }
        if (image.variations) {
          const updatedVariations = image.variations.map(variation =>
            variation.id === id ? { ...variation, todoNotes: newNotes } : variation
          );
          if (updatedVariations !== image.variations) {
            return { ...image, variations: updatedVariations };
          }
        }
        return image;
      })
    );
  }
};

export default ImageMetadataManager;