import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Rect, Group } from 'react-konva';
import useImage from 'use-image';
import { motion } from 'motion/react';
import { 
  ChevronLeft, Download, Save, User as UserIcon, 
  Image as ImageIcon, Sparkles, Type, Smile, 
  Layers, Maximize, Move, Trash2, Plus, X
} from 'lucide-react';
import { useApp } from '../store';
import { Template, LayerConfig, Asset, Character } from '../types';
import { ASSETS, EXPRESSIONS } from '../constants';

interface EditorProps {
  template: Template;
  projectId: string | null;
  onBack: () => void;
}

const CanvasImage = ({ url, x, y, width, height, opacity = 1 }: any) => {
  const [image] = useImage(url, 'anonymous');
  if (!image) return null;
  return <KonvaImage image={image} x={x} y={y} width={width} height={height} opacity={opacity} />;
};

export default function Editor({ template, projectId, onBack }: EditorProps) {
  const { characters, addProject, updateProject, projects, user } = useApp();
  const [config, setConfig] = useState<LayerConfig>(template.default_config);
  const [activeTab, setActiveTab] = useState<'char' | 'bg' | 'eff' | 'text' | 'exp'>('char');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || '');
  const [stageScale, setStageScale] = useState(0.5);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 48; // padding
        const scale = width / template.size_w;
        setStageScale(Math.min(scale, 0.8));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [template.size_w]);

  useEffect(() => {
    if (projectId) {
      const proj = projects.find(p => p.id === projectId);
      if (proj) {
        setConfig(proj.config);
        setSelectedCharId(proj.character_id);
      }
    }
  }, [projectId, projects]);

  const selectedChar = characters.find(c => c.id === selectedCharId);

  const handleSave = () => {
    if (projectId) {
      updateProject({
        id: projectId,
        title: `Project ${new Date().toLocaleDateString()}`,
        character_id: selectedCharId,
        template_id: template.id,
        config,
        updated_at: new Date().toISOString()
      });
    } else {
      addProject({
        id: Math.random().toString(36).substr(2, 9),
        title: `Project ${new Date().toLocaleDateString()}`,
        character_id: selectedCharId,
        template_id: template.id,
        config,
        updated_at: new Date().toISOString()
      });
    }
    // alert('保存しました！');
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `vtuber_studio_${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate expression position based on face anchor
  const getExpressionProps = () => {
    if (!selectedChar || !config.character.expression_id) return null;
    const expAsset = ASSETS.find(a => a.id === config.character.expression_id);
    if (!expAsset) return null;

    const { center_x, center_y, radius } = selectedChar.face_anchor;
    // We need to know original image dimensions to scale correctly, 
    // but for mock we assume square or relative scaling.
    // In real app, we'd load the image first to get naturalWidth/Height.
    
    // Simplified relative positioning
    return {
      url: expAsset.image_url,
      x: config.character.position.x + (center_x - 0.5) * 500 * config.character.scale,
      y: config.character.position.y + (center_y - 0.5) * 500 * config.character.scale,
      width: radius * 1000 * config.character.scale,
      height: radius * 1000 * config.character.scale,
    };
  };

  const expProps = getExpressionProps();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="h-14 md:h-16 border-b border-white/10 bg-zinc-900 px-4 md:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-sm md:text-base truncate max-w-[120px] md:max-w-none">{template.name}</h2>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button onClick={handleSave} className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/10 transition-colors text-xs md:text-sm">
            <Save className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            <span className="hidden sm:inline">保存</span>
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors text-xs md:text-sm">
            <Download className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            <span className="hidden sm:inline">出力</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar Tabs (Bottom on Mobile, Left on Desktop) */}
        <aside className="fixed bottom-0 left-0 right-0 md:relative md:w-20 bg-zinc-950 border-t md:border-t-0 md:border-r border-white/10 flex md:flex-col items-center justify-around md:justify-start py-3 md:py-6 gap-0 md:gap-6 z-30">
          <TabButton active={activeTab === 'char'} onClick={() => { setActiveTab('char'); setIsSidebarOpen(true); }} icon={<UserIcon className="w-5 h-5 md:w-6 md:h-6" />} label="キャラ" />
          <TabButton active={activeTab === 'exp'} onClick={() => { setActiveTab('exp'); setIsSidebarOpen(true); }} icon={<Smile className="w-5 h-5 md:w-6 md:h-6" />} label="表情" />
          <TabButton active={activeTab === 'bg'} onClick={() => { setActiveTab('bg'); setIsSidebarOpen(true); }} icon={<ImageIcon className="w-5 h-5 md:w-6 md:h-6" />} label="背景" />
          <TabButton active={activeTab === 'eff'} onClick={() => { setActiveTab('eff'); setIsSidebarOpen(true); }} icon={<Sparkles className="w-5 h-5 md:w-6 md:h-6" />} label="効果" />
          <TabButton active={activeTab === 'text'} onClick={() => { setActiveTab('text'); setIsSidebarOpen(true); }} icon={<Type className="w-5 h-5 md:w-6 md:h-6" />} label="文字" />
        </aside>

        {/* Sidebar Content (Slide-up on Mobile, Fixed on Desktop) */}
        <aside className={`
          fixed inset-x-0 bottom-16 md:relative md:inset-auto md:bottom-auto
          md:w-80 bg-zinc-900 border-t md:border-t-0 md:border-r border-white/10 
          overflow-y-auto p-6 space-y-8 z-20 transition-transform duration-300
          ${isSidebarOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          max-h-[60vh] md:max-h-none
        `}>
          <div className="flex items-center justify-between mb-4 md:hidden">
             <h3 className="font-bold uppercase text-xs tracking-widest text-zinc-500">編集ツール</h3>
             <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-zinc-800 rounded-full">
                <X size={16} />
             </button>
          </div>
          {activeTab === 'char' && (
            <div className="space-y-6">
              <h3 className="font-bold">キャラクター設定</h3>
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">キャラ選択</label>
                <select 
                  value={selectedCharId} 
                  onChange={(e) => setSelectedCharId(e.target.value)}
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg p-3 outline-none"
                >
                  {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">位置 (X, Y)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={config.character.position.x} onChange={(e) => setConfig({...config, character: {...config.character, position: {...config.character.position, x: parseInt(e.target.value)}}})} className="bg-zinc-800 rounded p-2 text-center" />
                  <input type="number" value={config.character.position.y} onChange={(e) => setConfig({...config, character: {...config.character, position: {...config.character.position, y: parseInt(e.target.value)}}})} className="bg-zinc-800 rounded p-2 text-center" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">スケール</label>
                <input type="range" min="0.5" max="2" step="0.1" value={config.character.scale} onChange={(e) => setConfig({...config, character: {...config.character, scale: parseFloat(e.target.value)}})} className="w-full accent-white" />
              </div>
            </div>
          )}

          {activeTab === 'exp' && (
            <div className="space-y-6">
              <h3 className="font-bold">表情オーバーレイ</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setConfig({...config, character: {...config.character, expression_id: null}})}
                  className={`p-4 rounded-xl border transition-all text-center ${!config.character.expression_id ? 'bg-white text-black border-white' : 'bg-zinc-800 border-white/5'}`}
                >
                  なし
                </button>
                {EXPRESSIONS.map(exp => (
                  <button 
                    key={exp.id}
                    onClick={() => setConfig({...config, character: {...config.character, expression_id: exp.asset_id}})}
                    className={`p-4 rounded-xl border transition-all text-center ${config.character.expression_id === exp.asset_id ? 'bg-white text-black border-white' : 'bg-zinc-800 border-white/5'}`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bg' && (
            <div className="space-y-6">
              <h3 className="font-bold">背景選択</h3>
              <div className="grid grid-cols-2 gap-3">
                {ASSETS.filter(a => a.type === 'background').map(asset => (
                  <button 
                    key={asset.id}
                    onClick={() => setConfig({...config, background_id: asset.id})}
                    className={`aspect-square rounded-xl border overflow-hidden transition-all ${config.background_id === asset.id ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : 'border-white/5'}`}
                  >
                    <img src={asset.image_url} className="w-full h-full object-cover" alt="BG" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-6">
              <h3 className="font-bold">テキスト編集</h3>
              {config.text.map((t, idx) => (
                <div key={t.id} className="space-y-4 p-4 bg-zinc-800 rounded-xl">
                  <input 
                    type="text" 
                    value={t.content} 
                    onChange={(e) => {
                      const newText = [...config.text];
                      newText[idx].content = e.target.value;
                      setConfig({...config, text: newText});
                    }}
                    className="w-full bg-zinc-900 border border-white/10 rounded p-2"
                  />
                  <div className="flex gap-2">
                     <input type="color" value={t.color} onChange={(e) => {
                        const newText = [...config.text];
                        newText[idx].color = e.target.value;
                        setConfig({...config, text: newText});
                     }} className="w-10 h-10 rounded bg-transparent border-none" />
                     <input type="number" value={t.fontSize} onChange={(e) => {
                        const newText = [...config.text];
                        newText[idx].fontSize = parseInt(e.target.value);
                        setConfig({...config, text: newText});
                     }} className="flex-1 bg-zinc-900 rounded p-2 text-center" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-zinc-950 flex items-center justify-center p-4 md:p-12 relative overflow-hidden pb-32 md:pb-12" ref={containerRef}>
          <div className="shadow-2xl shadow-black ring-1 ring-white/10">
            <Stage 
              width={template.size_w} 
              height={template.size_h} 
              scaleX={stageScale} 
              scaleY={stageScale}
              ref={stageRef}
            >
              <Layer>
                {/* Background */}
                <CanvasImage 
                  url={ASSETS.find(a => a.id === config.background_id)?.image_url} 
                  x={0} y={0} width={template.size_w} height={template.size_h} 
                />

                {/* Effects */}
                {config.effects.filter(e => e.enabled).map(eff => (
                  <CanvasImage 
                    key={eff.asset_id}
                    url={ASSETS.find(a => a.id === eff.asset_id)?.image_url}
                    x={0} y={0} width={template.size_w} height={template.size_h}
                    opacity={0.5}
                  />
                ))}

                {/* Character */}
                {selectedChar && (
                  <Group
                    x={config.character.position.x}
                    y={config.character.position.y}
                    scaleX={config.character.scale}
                    scaleY={config.character.scale}
                    offsetX={250} // Mock center
                    offsetY={300} // Mock center
                  >
                    <CanvasImage 
                      url={selectedChar.base_image_url}
                      x={0} y={0} width={500} height={600}
                    />
                    {/* Expression Overlay */}
                    {config.character.expression_id && (
                      <CanvasImage 
                        url={ASSETS.find(a => a.id === config.character.expression_id)?.image_url}
                        x={(selectedChar.face_anchor.center_x - 0.5) * 500}
                        y={(selectedChar.face_anchor.center_y - 0.5) * 600}
                        width={selectedChar.face_anchor.radius * 1000}
                        height={selectedChar.face_anchor.radius * 1000}
                        offsetX={selectedChar.face_anchor.radius * 500}
                        offsetY={selectedChar.face_anchor.radius * 500}
                      />
                    )}
                  </Group>
                )}

                {/* Frame */}
                {config.frame_id && (
                  <CanvasImage 
                    url={ASSETS.find(a => a.id === config.frame_id)?.image_url}
                    x={0} y={0} width={template.size_w} height={template.size_h}
                  />
                )}

                {/* Text */}
                {config.text.map(t => (
                  <KonvaText 
                    key={t.id}
                    text={t.content}
                    x={t.position.x}
                    y={t.position.y}
                    fontSize={t.fontSize}
                    fontFamily={t.fontFamily}
                    fill={t.color}
                    align="center"
                    width={template.size_w}
                    offsetX={template.size_w / 2}
                  />
                ))}

                {/* Watermark for Free Users */}
                {user?.plan === 'free' && (
                  <Group x={template.size_w - 220} y={template.size_h - 60}>
                    <Rect width={200} height={40} fill="black" opacity={0.5} cornerRadius={5} />
                    <KonvaText text="VTuber Studio" x={10} y={10} fill="white" fontSize={20} fontStyle="bold" />
                  </Group>
                )}
              </Layer>
            </Stage>
          </div>

          {/* Canvas Controls Overlay */}
          <div className="absolute bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-zinc-900/80 backdrop-blur-xl border border-white/10 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl z-10">
             <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest border-r border-white/10 pr-3 md:pr-4">
                <Maximize className="w-3 h-3 md:w-3.5 md:h-3.5" />
                {Math.round(stageScale * 100)}%
             </div>
             <div className="flex gap-2 md:gap-4">
                <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors"><Move className="w-4 h-4 md:w-[18px] md:h-[18px]" /></button>
                <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors"><Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" /></button>
                <button className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors text-red-500"><Trash2 className="w-4 h-4 md:w-[18px] md:h-[18px]" /></button>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
    >
      <div className={`p-3 rounded-xl transition-all ${active ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}
