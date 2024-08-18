import React from 'react';
import { Upload } from 'lucide-react';

const UploadButton = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    onUpload(files);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
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
  );
};

export default UploadButton;