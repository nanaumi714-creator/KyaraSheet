import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Image as ImageIcon, Zap, Clock } from 'lucide-react';
import { useApp } from '../store';

interface LandingPageProps {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const { setUser } = useApp();

  const handleMockLogin = () => {
    setUser({ id: 'user_1', email: 'nanaumi.714@gmail.com', plan: 'free' });
    onLogin();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            VTuber告知画像スタジオ
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            自分のキャラクターを、自分の意図で、5分で動かせる。
            配信告知やサムネイル作成を圧倒的に効率化。
          </p>
          <button
            onClick={handleMockLogin}
            className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-xl shadow-white/10"
          >
            今すぐ無料で始める
          </button>
        </motion.div>

        {/* Floating Elements Mockup */}
        <div className="mt-12 md:mt-20 relative h-[250px] md:h-[400px] w-full max-w-4xl mx-auto border border-white/10 rounded-2xl bg-zinc-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
           <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Sparkles className="w-32 h-32 md:w-48 md:h-48 text-white animate-pulse" />
           </div>
           <div className="absolute top-4 left-4 md:top-10 md:left-10 p-2 md:p-4 bg-zinc-800 rounded-xl border border-white/10 shadow-lg rotate-[-5deg] scale-75 md:scale-100">
              <div className="w-24 h-32 md:w-32 md:h-40 bg-zinc-700 rounded-lg mb-2"></div>
              <div className="h-3 md:h-4 w-16 md:w-20 bg-zinc-600 rounded"></div>
           </div>
           <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 p-2 md:p-4 bg-zinc-800 rounded-xl border border-white/10 shadow-lg rotate-[5deg] scale-75 md:scale-100">
              <div className="w-32 h-20 md:w-48 md:h-28 bg-zinc-700 rounded-lg mb-2"></div>
              <div className="h-3 md:h-4 w-24 md:w-32 bg-zinc-600 rounded"></div>
           </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-white border border-white/10">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold">爆速作成</h3>
          <p className="text-zinc-400">テンプレートを選んでテキストを打つだけ。5分でプロ級の告知画像が完成します。</p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-white border border-white/10">
            <ImageIcon size={24} />
          </div>
          <h3 className="text-xl font-bold">表情オーバーレイ</h3>
          <p className="text-zinc-400">1枚の立ち絵から、笑顔や驚き顔など8種類の表情をAIが自然に合成します。</p>
        </div>
        <div className="space-y-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-white border border-white/10">
            <Clock size={24} />
          </div>
          <h3 className="text-xl font-bold">一貫した品質</h3>
          <p className="text-zinc-400">専属イラストレーター監修の素材で、常にハイクオリティなビジュアルを維持できます。</p>
        </div>
      </section>
    </div>
  );
}
