import { ActionIcon, Affix, Button } from '@mantine/core';
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
            {/* <div className="close-button"> */}
            {/* <Affix position={{ bottom: 500, right: 500 }}> */}
              <button onClick={() => setIsOpen(false)} style={closeButtonStyles}>
                <IconX />
              </button>
            {/* </Affix> */}
            {/* </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
