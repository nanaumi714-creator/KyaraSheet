import React from 'react';
import { motion } from 'motion/react';
import { Plus, Settings, Trash2, Edit3, User as UserIcon, Sparkles, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { useApp } from '../store';
import { Project } from '../types';

interface DashboardProps {
  onAddCharacter: () => void;
  onNewProject: () => void;
  onEditProject: (project: Project) => void;
}

export default function Dashboard({ onAddCharacter, onNewProject, onEditProject }: DashboardProps) {
  const { user, characters, projects, deleteProject } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-12 md:space-y-16">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400 mb-2">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span>AI Background Generation Enabled</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">Dashboard</h1>
          <p className="text-sm text-zinc-400 font-mono">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddCharacter}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-white/10 transition-all text-sm font-medium shadow-lg shadow-black/50"
          >
            <UserIcon className="w-4 h-4" />
            キャラ登録
          </button>
          <button
            onClick={onNewProject}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            <Plus className="w-4 h-4" />
            新規作成
          </button>
        </div>
      </header>

      {/* Characters */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <UserIcon className="w-5 h-5 text-zinc-400" />
            登録キャラクター
          </h2>
          <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">{characters.length} CHARACTERS</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {characters.map((char) => (
            <motion.div
              key={char.id}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative aspect-[3/4] bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden shadow-xl"
            >
              <img
                src={char.base_image_url}
                alt={char.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                <p className="font-bold text-sm truncate">{char.name}</p>
                <p className="text-[10px] text-zinc-400 font-mono mt-1">ID: {char.id.slice(0, 6)}</p>
              </div>
            </motion.div>
          ))}
          {characters.length === 0 && (
            <button
              onClick={onAddCharacter}
              className="aspect-[3/4] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-3">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">キャラを追加</span>
            </button>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
            <LayoutTemplate className="w-5 h-5 text-zinc-400" />
            最近のプロジェクト
          </h2>
          <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">{projects.length} PROJECTS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden group hover:border-white/20 transition-colors shadow-xl"
            >
              <div className="aspect-video bg-zinc-950 relative overflow-hidden">
                 {/* Preview placeholder - In a real app, this would be a generated thumbnail */}
                 {proj.config.custom_background_url || proj.config.background_id ? (
                   <img 
                     src={proj.config.custom_background_url || "https://picsum.photos/seed/vtuber/800/450"} 
                     className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                     alt="Project Preview"
                   />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-zinc-800">
                      <ImageIcon className="w-12 h-12" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              </div>
              <div className="p-5 flex items-center justify-between relative bg-zinc-900/80 backdrop-blur-md border-t border-white/5">
                <div>
                  <h3 className="font-bold truncate max-w-[200px] text-zinc-100">{proj.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">{new Date(proj.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditProject(proj)}
                    className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    title="編集"
                  >
                    <Edit3 className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                    title="削除"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-3xl bg-zinc-900/20">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center mb-4 shadow-lg">
                <LayoutTemplate className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-2">プロジェクトがありません</h3>
              <p className="text-sm text-zinc-500 max-w-sm mb-6">
                テンプレートを選んで、最初の告知画像を作成しましょう。AI背景生成も利用できます。
              </p>
              <button
                onClick={onNewProject}
                className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                最初の画像を作る
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
