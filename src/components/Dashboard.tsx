import React from 'react';
import { motion } from 'motion/react';
import { Plus, Settings, Trash2, Edit3, User as UserIcon } from 'lucide-react';
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ダッシュボード</h1>
          <p className="text-sm text-zinc-400">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddCharacter}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/10 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            キャラ登録
          </button>
          <button
            onClick={onNewProject}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            新規作成
          </button>
        </div>
      </header>

      {/* Characters */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          登録キャラクター
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {characters.map((char) => (
            <motion.div
              key={char.id}
              whileHover={{ y: -5 }}
              className="group relative aspect-square bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden"
            >
              <img
                src={char.base_image_url}
                alt={char.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
                <p className="font-bold text-sm truncate">{char.name}</p>
              </div>
            </motion.div>
          ))}
          {characters.length === 0 && (
            <button
              onClick={onAddCharacter}
              className="aspect-square border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-white/30 transition-all"
            >
              <Plus className="w-8 h-8" />
              <span className="mt-2 text-sm">キャラを追加</span>
            </button>
          )}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          最近のプロジェクト
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden group"
            >
              <div className="aspect-video bg-zinc-800 relative">
                 {/* Preview placeholder */}
                 <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                    Preview
                 </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold truncate max-w-[200px]">{proj.title}</h3>
                  <p className="text-xs text-zinc-500">{new Date(proj.updated_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditProject(proj)}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <Edit3 className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-500"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
              <p className="text-zinc-500">プロジェクトがまだありません。</p>
              <button
                onClick={onNewProject}
                className="mt-4 text-white font-bold underline"
              >
                最初の告知画像を作る
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
