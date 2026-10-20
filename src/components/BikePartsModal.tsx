'use client';

import React from 'react';
import { BikePartsGuide } from './BikePartsGuide';

interface BikePartsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BikePartsModal: React.FC<BikePartsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <div className="overflow-y-auto flex-1">
          <BikePartsGuide onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  );
};
