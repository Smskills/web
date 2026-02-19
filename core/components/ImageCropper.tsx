
import React, { useState, useRef, useEffect } from 'react';

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // width / height
}

/**
 * Institutional Image Cropper
 * Provides a high-fidelity interface for framing catalog thumbnails (4:3 aspect ratio).
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

  // Draw preview on canvas
  useEffect(() => {
    if (!isReady || !canvasRef.current || !imgRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    const img = imgRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to fill canvas
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

    // Draw overlay mask (Instagram style)
    ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
    // We want the whole canvas to be our crop area, so we don't need a hole for now
    // but we can add grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cw/3, 0); ctx.lineTo(cw/3, ch);
    ctx.moveTo(2*cw/3, 0); ctx.lineTo(2*cw/3, ch);
    ctx.moveTo(0, ch/3); ctx.lineTo(cw, ch/3);
    ctx.moveTo(0, 2*ch/3); ctx.lineTo(cw, 2*ch/3);
    ctx.stroke();

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
    const croppedData = canvasRef.current.toDataURL('image/webp', 0.8);
    onCrop(croppedData);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-8 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-4xl flex flex-col border border-white/20">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
             <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Frame Card View</h2>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Position the face or key subject in the center</p>
           </div>
           <button onClick={onCancel} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
             <i className="fa-solid fa-xmark"></i>
           </button>
        </div>

        <div className="relative bg-slate-900 p-4 md:p-8 flex flex-col items-center gap-8 overflow-hidden">
          <img 
            src={imageSrc} 
            ref={imgRef} 
            onLoad={() => setIsReady(true)} 
            className="hidden" 
            alt="Source" 
          />
          
          <div className="relative group shadow-2xl">
            <canvas 
              ref={canvasRef}
              width={400}
              height={300}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="rounded-3xl cursor-move border-4 border-white/10 group-hover:border-emerald-500/50 transition-colors"
            />
            <div className="absolute inset-x-0 -bottom-4 flex justify-center">
               <div className="bg-[#020617] text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl border border-white/10">
                 Drag to reposition subject
               </div>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zoom Control</span>
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

        <div className="p-8 flex gap-4 bg-slate-50/50">
          <button 
            onClick={onCancel}
            className="flex-grow py-4 border-2 border-slate-200 text-slate-500 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            className="flex-grow py-4 bg-[#020617] text-white font-black rounded-2xl hover:bg-emerald-600 transition-all uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-900/20"
          >
            Apply Framing <i className="fa-solid fa-check ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
