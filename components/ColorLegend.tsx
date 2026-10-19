import React from 'react';

// Inline key for the tile colors, shown until the player finishes their first game.
const Swatch: React.FC<{ className: string; label: string }> = ({ className, label }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={`w-3.5 h-3.5 rounded-[4px] border-2 ${className}`} aria-hidden="true" />
    <span>{label}</span>
  </span>
);

const ColorLegend: React.FC = () => (
  <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-medium text-muted animate-fade-in">
    <Swatch className="bg-accent border-accent" label="Дұрыс орын" />
    <Swatch className="bg-present border-accent" label="Сөзде бар" />
    <Swatch className="bg-absent border-absent" label="Сөзде жоқ" />
  </p>
);

export default ColorLegend;
