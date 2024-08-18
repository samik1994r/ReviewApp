import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Trash2, Edit2, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ImageViewer = ({ image, onClose, updateComments }) => {
  const [comments, setComments] = useState(image.comments || []);
  const [newComment, setNewComment] = useState('');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fitImageToContainer();
    window.addEventListener('resize', fitImageToContainer);
    return () => window.removeEventListener('resize', fitImageToContainer);
  }, [image]);

  const fitImageToContainer = () => {
    if (imgRef.current && containerRef.current) {
      const container = containerRef.current;
      const img = imgRef.current;
      const containerAspectRatio = container.clientWidth / container.clientHeight;
      const imageAspectRatio = img.naturalWidth / img.naturalHeight;

      let newScale;
      if (containerAspectRatio > imageAspectRatio) {
        newScale = container.clientHeight / img.naturalHeight;
      } else {
        newScale = container.clientWidth / img.naturalWidth;
      }
      setScale(newScale * 0.9); // 90% of the container size for some padding
    }
  };

  const addComment = () => {
    if (newComment.trim() !== '') {
      const updatedComments = [...comments, { id: Date.now(), text: newComment }];
      setComments(updatedComments);
      updateComments(updatedComments);
      setNewComment('');
    }
  };

  const removeComment = (id) => {
    const updatedComments = comments.filter(comment => comment.id !== id);
    setComments(updatedComments);
    updateComments(updatedComments);
  };

  const editComment = (id, newText) => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, text: newText } : comment
    );
    setComments(updatedComments);
    updateComments(updatedComments);
  };

  const handleZoom = (delta) => {
    setScale(prevScale => Math.max(0.1, Math.min(5, prevScale + delta)));
  };

  const handleRotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-full h-full flex flex-col">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold truncate">{image.file.name}</h2>
          <div className="flex space-x-2">
            <button onClick={() => handleZoom(0.1)} className="bg-blue-500 text-white px-2 py-1 rounded">
              <ZoomIn size={20} />
            </button>
            <button onClick={() => handleZoom(-0.1)} className="bg-blue-500 text-white px-2 py-1 rounded">
              <ZoomOut size={20} />
            </button>
            <button onClick={handleRotate} className="bg-blue-500 text-white px-2 py-1 rounded">
              <RotateCw size={20} />
            </button>
            <button onClick={onClose} className="bg-red-500 text-white px-2 py-1 rounded">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-grow flex">
          <div ref={containerRef} className="w-3/4 h-full flex items-center justify-center bg-gray-200 overflow-hidden">
            <img 
              ref={imgRef}
              src={image.url} 
              alt={image.file.name} 
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease-in-out',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className="w-1/4 h-full overflow-y-auto p-4 bg-gray-100">
            <h3 className="text-lg font-bold mb-4">Comments</h3>
            <div className="mb-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Add a comment..."
              />
              <button
                onClick={addComment}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center"
              >
                <MessageCircle size={20} className="mr-2" />
                Add Comment
              </button>
            </div>
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-2 rounded shadow mb-2">
                <p>{comment.text}</p>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      const newText = prompt('Edit comment:', comment.text);
                      if (newText !== null) {
                        editComment(comment.id, newText);
                      }
                    }}
                    className="text-blue-500 mr-2"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => removeComment(comment.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;