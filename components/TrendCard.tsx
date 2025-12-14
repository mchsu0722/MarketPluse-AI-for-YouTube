import React from 'react';
import { TrendItem } from '../types';
import { TrendingUp, DollarSign, Cpu, Zap, Hash } from 'lucide-react';

interface TrendCardProps {
  item: TrendItem;
}

const TrendCard: React.FC<TrendCardProps> = ({ item }) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'investment': return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'crypto': return <DollarSign className="w-5 h-5 text-yellow-400" />;
      case 'technology': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'ai': return <Zap className="w-5 h-5 text-purple-400" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    if (score >= 75) return 'bg-orange-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-500 transition-all duration-300 backdrop-blur-sm group relative overflow-hidden">
      
      {/* Background Gradient Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-colors"></div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
          {getCategoryIcon(item.category)}
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">{item.category}</span>
        </div>
        <div className="flex items-center space-x-2" title="Virality Score">
           <div className="text-xs text-slate-400 font-mono">HEAT</div>
           <div className={`text-xs font-bold text-white px-2 py-1 rounded-md ${getScoreColor(item.viralityScore)}`}>
             {item.viralityScore}
           </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-300 transition-colors">
        {item.title}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {item.tags.map((tag, idx) => (
          <span key={idx} className="flex items-center text-xs text-slate-500 bg-slate-900/30 px-2 py-1 rounded border border-slate-800">
            <Hash className="w-3 h-3 mr-1 opacity-50" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrendCard;
