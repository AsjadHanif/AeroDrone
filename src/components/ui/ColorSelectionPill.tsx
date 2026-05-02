import React from 'react';
import { motion } from 'framer-motion';

export type DroneColor = 'forest' | 'stealth' | 'arctic';

interface ColorSelectionPillProps {
  selectedColor: DroneColor;
  onSelect: (color: DroneColor) => void;
}

export const ColorSelectionPill: React.FC<ColorSelectionPillProps> = ({ selectedColor, onSelect }) => {
  const colors: { id: DroneColor; label: string; colorCode: string }[] = [
    { id: 'forest', label: 'Forest Green', colorCode: '#0B1C10' },
    { id: 'stealth', label: 'Stealth Black', colorCode: '#111111' },
    { id: 'arctic', label: 'Arctic White', colorCode: '#FFFFFF' },
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full cursor-pointer pointer-events-auto backdrop-blur-md bg-white/10 dark:bg-black/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-white/20 transition-all duration-500">
      {colors.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelect(c.id)}
          className="relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
        >
          {selectedColor === c.id && (
            <motion.div
              layoutId="activePill"
              className="absolute inset-0 bg-[#D4F060] rounded-full shadow-[0_0_20px_rgba(212,240,96,0.3)]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className="w-3 h-3 rounded-full border border-black/10 z-10 shadow-sm transition-transform duration-300"
            style={{ backgroundColor: c.colorCode, transform: selectedColor === c.id ? 'scale(1.2)' : 'scale(1)' }}
          />
          <span className={`relative z-10 text-sm font-sans tracking-wide transition-colors duration-300 ${selectedColor === c.id
            ? 'text-black font-semibold'
            : 'text-[#0B1C10] dark:text-white/80 hover:text-black dark:hover:text-white'
            }`}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
};
