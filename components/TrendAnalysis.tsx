import React from 'react';
import { BookOpen } from 'lucide-react';

interface TrendAnalysisProps {
  analysis?: {
    en: string;
    zh: string;
  };
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-6 mb-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
      
      <div className="flex items-center mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg mr-3">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Market Trend Analysis</h3>
          <p className="text-sm text-slate-400">AI-generated summary of the Top 10 hottest topics</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3 border-b border-indigo-500/20 pb-2">
            English Report
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {analysis.en}
          </p>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-3 border-b border-emerald-500/20 pb-2">
            市場趨勢分析 (繁體中文)
          </h4>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium">
            {analysis.zh}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;
