import { ActionIcon, Affix, Button, Space } from '@mantine/core';
import { IconHeart, IconX } from '@tabler/icons-react';
//import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useState } from 'react';
import React from 'react';
import './CVModal.css';

// interface ModalProps {
//   showModal: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }


export function ComputerVis(){

  const [isOpen, setIsOpen] = useState(false);

  const closeButtonStyles: React.CSSProperties = {
    position: 'relative',
    bottom: '10px',   // Adjust these values to move the X closer or further
    left: '710px', // Adjust these values to move the X closer or further
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#333',
  };

  // const [preview, setPreview] = useState<string>('');

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDelete = () => {
    // Clean up the preview URL to free memory
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    // Clear the image
    setSelectedImage(null);
    setPreviewUrl(null);
  };

    return (
    <div>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Button
          radius="xl" 
          w={40}      
          h={40}      
          p={0}  
          onClick={() => setIsOpen(true)}   
        >
          <ActionIcon
            ><IconHeart />
          </ActionIcon>
        </Button>
      </Affix>
      {isOpen && (
        <div className="modal-container">
          <div className="modal">
              <button onClick={() => setIsOpen(false)} style={closeButtonStyles}>
                <IconX />
              </button>
              <div className="container img">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageSelect}
                />
                {previewUrl && (
                  <div>
                    <img src={previewUrl} alt="Preview" />
                    <button onClick={handleDelete}>Clear</button>
                  </div>
                )}
                {/* <input type="file" accept="image/*" onChange={handleChange} />
                {preview && 
                <div>
                  <img src={preview} alt="Preview" className="image" /> */}
                {/* </div>} */}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
