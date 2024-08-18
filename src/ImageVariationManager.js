import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import ImageMetadataManager from './ImageMetadataManager';

const ImageVariationManager = {
  loadVariations: async (parentPath) => {
    const variationsRef = ref(storage, `${parentPath}/variations`);
    try {
      const res = await listAll(variationsRef);
      const variationPromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        return {
          id: uuidv4(),
          name: itemRef.name,
          url: url,
          status: metadata.customMetadata?.status || 'Needs Review',
          isVariation: true,
          parentId: parentPath.split('/').pop(),
          todoNotes: JSON.parse(metadata.customMetadata?.todoNotes || '[]'),
          comments: JSON.parse(metadata.customMetadata?.comments || '[]')
        };
      });
      return await Promise.all(variationPromises);
    } catch (error) {
      console.error("Error loading variations: ", error);
      return [];
    }
  },

  addImageVariation: async (parentId, file, images, setImages) => {
    const parentImage = images.find(img => img.id === parentId);
    if (!parentImage) return;

    const variationRef = ref(storage, `images/${parentImage.name}/variations/${file.name}`);

    try {
      const snapshot = await uploadBytes(variationRef, file);
      const url = await getDownloadURL(snapshot.ref);

      const newVariation = {
        id: uuidv4(),
        name: file.name,
        url: url,
        status: 'Needs Review',
        isVariation: true,
        parentId: parentId,
        todoNotes: [],
        comments: []
      };

      await ImageMetadataManager.updateImageMetadata(newVariation.id, {
        status: newVariation.status,
        todoNotes: newVariation.todoNotes,
        comments: newVariation.comments
      }, images);

      setImages(prevImages => 
        prevImages.map(image => 
          image.id === parentId
            ? { ...image, variations: [...(image.variations || []), newVariation] }
            : image
        )
      );
    } catch (error) {
      console.error("Error uploading variation: ", error);
    }
  }
};

export default ImageVariationManager;