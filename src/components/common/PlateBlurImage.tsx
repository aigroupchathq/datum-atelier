import { useState } from 'react';
import type { FC } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';

interface PlateBlurImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  allowToggle?: boolean;
}

export const PlateBlurImage: FC<PlateBlurImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[16/10]',
  allowToggle = true,
}) => {
  const [isBlurred, setIsBlurred] = useState<boolean>(true);

  return (
    <div className={`relative overflow-hidden rounded-xl bg-zinc-900 group ${aspectRatio} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        loading="lazy"
      />

      {/* Plate blur indicator badge */}
      {allowToggle && (
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full plate-blur border border-white/10 text-[10.5px] font-mono-numbers text-zinc-300 shadow-lg">
          <Shield className="w-3 h-3 text-emerald-400" />
          <span>Plate: {isBlurred ? 'Redacted' : 'Revealed'}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsBlurred(!isBlurred);
            }}
            className="ml-1 text-zinc-400 hover:text-white transition"
            title={isBlurred ? 'Reveal plate' : 'Blur plate'}
          >
            {isBlurred ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* Simulated plate blur filter overlay area */}
      {isBlurred && (
        <div
          aria-hidden="true"
          className="absolute bottom-12 right-12 w-28 h-7 rounded-sm plate-blur border border-white/20 pointer-events-none flex items-center justify-center opacity-85 shadow-sm"
        >
          <span className="text-[9px] font-mono-numbers text-zinc-400 tracking-widest uppercase">
            [REDACTED]
          </span>
        </div>
      )}
    </div>
  );
};
