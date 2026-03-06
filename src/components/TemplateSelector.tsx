import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Check, ChevronRight } from 'lucide-react';
import { USE_CASES, MOODS, TEMPLATES } from '../constants';
import { Template, UseCase, Mood } from '../types';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
  onCancel: () => void;
}

export default function TemplateSelector({ onSelect, onCancel }: TemplateSelectorProps) {
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const filteredTemplates = TEMPLATES.filter(t => 
    (!useCase || t.use_case === useCase) && 
    (!mood || t.mood === mood)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">テンプレート選択</h1>
        <button onClick={onCancel} className="p-2 hover:bg-zinc-800 rounded-full">
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 md:gap-12">
        {/* Sidebar Filters */}
        <aside className="space-y-8 md:space-y-10">
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">用途を選ぶ</h3>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.id}
                  onClick={() => setUseCase(uc.id)}
                  className={`flex-none px-4 py-2 md:py-3 rounded-xl text-left transition-all border text-sm md:text-base whitespace-nowrap ${
                    useCase === uc.id 
                      ? 'bg-white text-black border-white' 
                      : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {uc.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">ムードを選ぶ</h3>
            <div className="flex flex-row lg:flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`flex-none px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all border whitespace-nowrap ${
                    mood === m.id 
                      ? `${m.color} text-white border-transparent ring-2 ring-white ring-offset-2 ring-offset-zinc-950` 
                      : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>

          {(useCase || mood) && (
            <button 
              onClick={() => { setUseCase(null); setMood(null); }}
              className="text-sm text-zinc-500 hover:text-white underline"
            >
              フィルターをリセット
            </button>
          )}
        </aside>

        {/* Template Grid */}
        <main className="space-y-8">
          <div className="flex items-center justify-between">
             <p className="text-zinc-500">{filteredTemplates.length} 件のテンプレートが見つかりました</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTemplates.map((temp) => (
              <motion.div
                key={temp.id}
                whileHover={{ y: -8 }}
                onClick={() => onSelect(temp)}
                className="group cursor-pointer bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                   {/* Mock Preview */}
                   <div className={`absolute inset-0 opacity-20 ${MOODS.find(m => m.id === temp.mood)?.color}`}></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                         <p className="text-2xl font-bold tracking-tighter uppercase opacity-50">{temp.use_case}</p>
                         <p className="text-sm font-medium opacity-30">{temp.size_w} x {temp.size_h}</p>
                      </div>
                   </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-xl">
                          <ChevronRight className="w-8 h-8" />
                       </div>
                    </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                   <div>
                      <h4 className="font-bold text-lg">{temp.name}</h4>
                      <div className="flex gap-2 mt-1">
                         <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
                           {temp.use_case}
                         </span>
                         <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white ${MOODS.find(m => m.id === temp.mood)?.color}`}>
                           {temp.mood}
                         </span>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
