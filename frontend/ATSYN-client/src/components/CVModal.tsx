// import React from 'react';
//     import './CVModal.css'; // Optional: for styling
//     import './CV.tsx';

//     interface ModalProps {
//       showModal: boolean;
//       onClose: () => void;
//       children: React.ReactNode;
//     }

//     const Modal: React.FC<ModalProps> = ({ showModal, onClose, children }) => {
//       if (!showModal) {
//         return null; // Don't render if not shown
//       }

//       return (
//         <div className="modal-backdrop" onClick={onClose}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             {children}
//             <button onClick={onClose}>Close</button>
//           </div>
//         </div>
//       );
//     };

//     export default Modal;