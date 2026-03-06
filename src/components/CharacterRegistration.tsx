import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, X, Check, ArrowRight, ArrowLeft, Target } from 'lucide-react';
import { useApp } from '../store';
import { Character, FaceAnchor } from '../types';

interface CharacterRegistrationProps {
  onComplete: (char: Character) => void;
  onCancel: () => void;
}

export default function CharacterRegistration({ onComplete, onCancel }: CharacterRegistrationProps) {
  const { addCharacter } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<FaceAnchor>({
    center_x: 0.5,
    center_y: 0.4,
    radius: 0.1,
    is_provisional: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (step !== 2 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setAnchor(prev => ({ ...prev, center_x: x, center_y: y }));
  };

  const handleSave = () => {
    if (!image || !name) return;
    const newChar: Character = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      base_image_url: image,
      tags: [],
      face_anchor: { ...anchor, is_provisional: false }
    };
    addCharacter(newChar);
    onComplete(newChar);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">キャラクター登録</h1>
        <button onClick={onCancel} className="p-2 hover:bg-zinc-800 rounded-full">
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              step >= s ? 'bg-white' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
        {step === 1 && (
          <div className="p-6 md:p-12 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold">キャラクター名と画像をアップロード</h2>
              <p className="text-sm text-zinc-400">背景が透過されたPNGファイル（立ち絵）を推奨します。</p>
            </div>
            
            <input
              type="text"
              placeholder="キャラクター名 (例: 七海)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-md px-4 md:px-6 py-3 md:py-4 bg-zinc-800 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md mx-auto aspect-square border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-white/30 transition-all group"
            >
              <Upload className="w-12 h-12 text-zinc-500 group-hover:text-white transition-colors" />
              <span className="mt-4 font-bold">PNGをアップロード</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {step === 2 && image && (
          <div className="p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-2xl font-bold">顔アンカーの設定</h2>
              <p className="text-sm text-zinc-400">顔の中心をクリックして、表情を重ねる位置を決めます。</p>
            </div>

            <div className="relative max-w-md mx-auto aspect-[3/4] bg-zinc-800 rounded-2xl overflow-hidden cursor-crosshair" ref={containerRef} onClick={handleCanvasClick}>
              <img src={image} className="w-full h-full object-contain" alt="Preview" />
              
              {/* Anchor Guide */}
              <div 
                className="absolute border-2 border-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] pointer-events-none"
                style={{
                  left: `${anchor.center_x * 100}%`,
                  top: `${anchor.center_y * 100}%`,
                  width: `${anchor.radius * 200}%`,
                  height: `${anchor.radius * 200}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white opacity-50" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
               <div className="w-full max-w-xs space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">円のサイズ調整</label>
                  <input 
                    type="range" 
                    min="0.05" 
                    max="0.3" 
                    step="0.01" 
                    value={anchor.radius}
                    onChange={(e) => setAnchor(prev => ({ ...prev, radius: parseFloat(e.target.value) }))}
                    className="w-full accent-white"
                  />
               </div>
               <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full justify-center">
                  <button onClick={() => setStep(1)} className="px-8 py-3 bg-zinc-800 rounded-full font-bold order-2 md:order-1">戻る</button>
                  <button onClick={() => setStep(3)} className="px-8 py-3 bg-white text-black rounded-full font-bold order-1 md:order-2">次へ</button>
               </div>
            </div>
          </div>
        )}

        {step === 3 && image && (
          <div className="p-12 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">最終確認</h2>
              <p className="text-zinc-400">これでキャラクター登録を完了しますか？</p>
            </div>

            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white/10">
               <img src={image} className="w-full h-full object-cover" alt="Final" />
            </div>

            <div className="space-y-2">
               <p className="text-xl font-bold">{name}</p>
               <p className="text-zinc-500 text-sm">顔アンカー設定済み</p>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => setStep(2)} className="px-8 py-4 bg-zinc-800 rounded-full font-bold">アンカーを直す</button>
              <button onClick={handleSave} className="px-12 py-4 bg-white text-black rounded-full font-bold flex items-center gap-2">
                <Check className="w-5 h-5" />
                登録を完了する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
