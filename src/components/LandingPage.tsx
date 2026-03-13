import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Image as ImageIcon, Zap, Clock, Wand2 } from 'lucide-react';
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
          <p className="text-lg md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            自分のキャラクターを、自分の意図で、5分で動かせる。<br className="hidden md:block" />
            AI背景生成と表情合成で、配信告知を圧倒的に効率化。
          </p>
          <button
            onClick={handleMockLogin}
            className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 mx-auto"
          >
            <Wand2 className="w-5 h-5" />
            今すぐ無料で始める
          </button>
        </motion.div>

        {/* Floating Elements Mockup */}
        <div className="mt-16 md:mt-24 relative h-[300px] md:h-[500px] w-full max-w-5xl mx-auto border border-white/10 rounded-3xl bg-zinc-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
           <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Sparkles className="w-32 h-32 md:w-48 md:h-48 text-white animate-pulse" />
           </div>
           
           {/* Mock UI Elements */}
           <div className="absolute top-0 left-0 w-full h-12 border-b border-white/10 bg-zinc-900/80 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
           </div>
           
           <div className="absolute top-20 left-4 md:top-24 md:left-12 p-3 md:p-5 bg-zinc-800/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl rotate-[-4deg] hover:rotate-0 transition-transform duration-500 group">
              <div className="w-32 h-40 md:w-48 md:h-64 bg-zinc-700 rounded-xl mb-3 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="h-3 md:h-4 w-20 md:w-28 bg-zinc-600 rounded-full mb-2"></div>
              <div className="h-2 md:h-3 w-16 md:w-20 bg-zinc-600/50 rounded-full"></div>
           </div>
           
           <div className="absolute bottom-10 right-4 md:bottom-16 md:right-12 p-3 md:p-5 bg-zinc-800/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl rotate-[6deg] hover:rotate-0 transition-transform duration-500 group z-10">
              <div className="w-40 h-24 md:w-64 md:h-36 bg-zinc-700 rounded-xl mb-3 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="h-3 md:h-4 w-24 md:w-32 bg-zinc-600 rounded-full mb-2"></div>
              <div className="h-2 md:h-3 w-16 md:w-24 bg-zinc-600/50 rounded-full"></div>
           </div>
           
           {/* Center "AI" badge */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-white text-black font-bold rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center gap-2 z-20">
             <Sparkles className="w-5 h-5 text-yellow-500" />
             AI Backgrounds
           </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">圧倒的な制作体験</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">最新のAI技術と直感的なUIで、あなたのクリエイティビティを加速させます。</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-5 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors">
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold">爆速作成</h3>
            <p className="text-zinc-400 leading-relaxed">テンプレートを選んでテキストを打つだけ。5分でプロ級の告知画像が完成します。もうデザインで悩む時間はありません。</p>
          </div>
          <div className="space-y-5 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Wand2 size={120} />
            </div>
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg relative z-10">
              <Sparkles size={28} className="text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold relative z-10">AI背景生成</h3>
            <p className="text-zinc-400 leading-relaxed relative z-10">「夜のサイバーパンク」など、テキストを打ち込むだけで配信にぴったりの背景をAIが即座に生成。素材探しの手間がゼロに。</p>
          </div>
          <div className="space-y-5 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors">
            <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg">
              <ImageIcon size={28} />
            </div>
            <h3 className="text-xl font-bold">表情オーバーレイ</h3>
            <p className="text-zinc-400 leading-relaxed">1枚の立ち絵から、笑顔や驚き顔など様々な表情を自然に合成。配信の雰囲気に合わせてキャラクターの感情を表現できます。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
