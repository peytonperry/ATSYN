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
  const [message, setMessage] = useState('');

  const handleButtonClick = () => {
    setMessage('hi');
  }
    // const Modal: React.FC<ModalProps> = ({ showModal, onClose, children }) => {
    //   if (!showModal) {
    //     return null; // Don't render if not shown
    //   }
    // }

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
            <button onClick={handleButtonClick}>
              Click Me
            </button>
            {message && <p>{message}</p>}
            <button onClick={() => setIsOpen(false)}>
              Close
            </button>
            {/* <Affix position={{ bottom: 500, right: 500 }}> */}
              <button onClick={() => setIsOpen(false)}>
                <IconX />
                
              </button>
            {/* </Affix> */}
          </div>
        </div>
      )}
    </div>
  );
}
