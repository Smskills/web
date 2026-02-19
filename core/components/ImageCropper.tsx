
import React, { useState, useRef, useEffect } from 'react';

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // width / height
}

/**
 * Institutional Image Cropper
 * Optimized for card thumbnails to prevent localStorage quota issues.
 */
const ImageCropper: React.FC<ImageCropperProps> = ({ 
  imageSrc, 
  onCrop, 
  onCancel, 
  aspectRatio = 4/3 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Use a balanced resolution (800px) that is crisp but doesn't create massive base64 strings
  const INTERNAL_WIDTH = 800;
  const INTERNAL_HEIGHT = 800 / aspectRatio;

  // Draw preview on canvas
  useEffect(() => {
    if (!isReady || !canvasRef.current || !imgRef.current) return;

    const ctx = canvasRef.current.getContext('2d', { alpha: false });
    if (!ctx) return;

    const canvas = canvasRef.current;
    const img = imgRef.current;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const cw = canvas.width;
    const ch = canvas.height;

    const scale = Math.max(cw / iw, ch / ih) * zoom;
    const sw = iw * scale;
    const sh = ih * scale;

    const dx = (cw - sw) / 2 + offset.x;
    const dy = (ch - sh) / 2 + offset.y;

    ctx.drawImage(img, dx, dy, sw, sh);
  }, [isReady, zoom, offset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleSave = () => {
    if (!canvasRef.current) return;
    // Export with high quality (0.8) - balanced for size
    const croppedData = canvasRef.current.toDataURL('image/webp', 0.8);
    onCrop(croppedData);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-8 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-4xl flex flex-col border border-white/20">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
             <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Frame Program Card</h2>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Reposition the subject for the catalog grid</p>
           </div>
           <button onClick={onCancel} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
             <i className="fa-solid fa-xmark"></i>
           </button>
        </div>

        <div className="relative bg-slate-950 p-4 md:p-12 flex flex-col items-center gap-8 overflow-hidden">
          <img 
            src={imageSrc} 
            ref={imgRef} 
            onLoad={() => setIsReady(true)} 
            className="hidden" 
            alt="Source" 
          />
          
          <div className="relative group shadow-2xl">
            <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-3 grid-rows-3 rounded-3xl overflow-hidden border-4 border-transparent group-hover:border-emerald-500/30 transition-all duration-500">
               <div className="border-r border-b border-white/20"></div>
               <div className="border-r border-b border-white/20"></div>
               <div className="border-b border-white/20"></div>
               <div className="border-r border-b border-white/20"></div>
               <div className="border-r border-b border-white/20"></div>
               <div className="border-b border-white/20"></div>
               <div className="border-r border-white/20"></div>
               <div className="border-r border-white/20"></div>
               <div></div>
            </div>

            <canvas 
              ref={canvasRef}
              width={INTERNAL_WIDTH}
              height={INTERNAL_HEIGHT}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
              className="rounded-3xl cursor-move border-4 border-white/10 group-hover:border-emerald-500/50 transition-all bg-black"
            />
            <div className="absolute inset-x-0 -bottom-4 flex justify-center z-20">
               <div className="bg-[#10b981] text-white px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl border border-white/20 flex items-center gap-2">
                 <i className="fa-solid fa-arrows-up-down-left-right"></i> Drag to Compose
               </div>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-4 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scaling Factor</span>
                <span className="text-[10px] font-black text-emerald-500">{(zoom * 100).toFixed(0)}%</span>
             </div>
             <input 
               type="range" 
               min="1" 
               max="3" 
               step="0.01" 
               value={zoom} 
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
             />
          </div>
        </div>

        <div className="p-8 flex gap-4 bg-slate-50/50 border-t border-slate-100">
          <button 
            onClick={onCancel}
            className="flex-grow py-4 border-2 border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[11px]"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-grow py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-600/20"
          >
            Apply Framing <i className="fa-solid fa-check ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
