import React from 'react';
import { GroundingChunk } from '../types';
import { ExternalLink, Globe, Youtube } from 'lucide-react';

interface SourceListProps {
  sources: GroundingChunk[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (sources.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-8">
      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
        <Globe className="w-4 h-4 mr-2" />
        Verified Sources
      </h4>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((source, idx) => {
          if (!source.web) return null;
          
          const isYoutube = source.web.uri.includes('youtube.com') || source.web.uri.includes('youtu.be');
          const hostname = new URL(source.web.uri).hostname.replace('www.', '');

          return (
            <a 
              key={idx} 
              href={source.web.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50 hover:border-indigo-500/30 group"
            >
              {isYoutube ? (
                <Youtube className="w-4 h-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
              ) : (
                <ExternalLink className="w-4 h-4 text-slate-500 mt-1 mr-3 flex-shrink-0 group-hover:text-indigo-400" />
              )}
              
              <div className="overflow-hidden">
                <p className="text-sm text-slate-300 font-medium truncate group-hover:text-white transition-colors">
                  {source.web.title}
                </p>
                <p className="text-xs text-slate-500 truncate mt-1">
                  {hostname}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SourceList;
