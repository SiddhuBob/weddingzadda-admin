import React, { createContext, useContext, useState } from "react";

const ImageResizer = createContext();

export const useImageResizer = () => useContext(ImageResizer);

export default function ImageResizerProvider({ children }) {
  const [files, setFiles] = useState(null);

  const resizeImage = (file, maxSize, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scaleSize = maxSize / Math.max(img.width, img.height);
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            callback(blob);
          },
          file.type,
          0.7
        ); // Adjust quality as needed
      };
    };
  };

  const handleFileChange = (e, size) => {
    const selectedFiles = e.target.files[0];
    resizeImage(selectedFiles, size, (resizedBlob) => {
      setFiles(
        new File([resizedBlob], selectedFiles.name, {
          type: selectedFiles.type,
        })
      );
    });
  };
  
  const value = {
    handleFileChange,
    files,
    setFiles,
  };
  return (
    <ImageResizer.Provider value={value}>{children}</ImageResizer.Provider>
  );
}
