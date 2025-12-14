import React, { useState, useEffect } from 'react';
import { fetchWeeklyTrends } from './services/gemini';
import { SearchState } from './types';
import TrendCard from './components/TrendCard';
import SourceList from './components/SourceList';
import TrendAnalysis from './components/TrendAnalysis';
import { 
  Activity, 
  RefreshCw, 
  Search, 
  TrendingUp, 
  Youtube, 
  BarChart3, 
  AlertCircle,
  ChevronDown,
  ListFilter,
  FileText,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [limit, setLimit] = useState<number>(10);
  const [includeAnalysis, setIncludeAnalysis] = useState<boolean>(false);
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    data: null,
    error: null,
  });

  const handleFetchTrends = async () => {
    setSearchState({ isLoading: true, data: null, error: null });
    try {
      const data = await fetchWeeklyTrends(limit, includeAnalysis);
      setSearchState({ isLoading: false, data, error: null });
    } catch (err: any) {
      setSearchState({ 
        isLoading: false, 
        data: null, 
        error: err.message || "Something went wrong. Please check your API key and try again." 
      });
    }
  };

  // Initial load
  useEffect(() => {
    handleFetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = searchState.data?.parsedTrends.map(item => ({
    name: item.title.substring(0, 15) + '...',
    score: item.viralityScore,
    fullTitle: item.title
  })) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-600 to-red-500 p-2.5 rounded-lg shadow-lg shadow-red-900/20">
              <Youtube className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden sm:block">
                MarketPulse AI
              </h1>
              <h1 className="text-2xl font-bold text-white sm:hidden">
                MarketPulse
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide hidden sm:block">YOUTUBE INVESTMENT & TECH FEED</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Analysis Toggle */}
            <button
              onClick={() => setIncludeAnalysis(!includeAnalysis)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                includeAnalysis 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
              title="Generate a 300-500 word market analysis in English and Chinese based on your selected count"
            >
              <FileText className="w-5 h-5" />
              <span className="hidden md:inline">Deep Analysis</span>
            </button>

            {/* Limit Selector */}
            <div className="relative group hidden xs:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ListFilter className="h-5 w-5 text-slate-500" />
              </div>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={searchState.isLoading}
                className="appearance-none bg-slate-900 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl block w-full pl-10 pr-9 py-3 hover:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                <option value={6}>6 Items</option>
                <option value={10}>10 Items</option>
                <option value={20}>20 Items</option>
                <option value={30}>30 Items</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            <button
              onClick={handleFetchTrends}
              disabled={searchState.isLoading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-base font-bold transition-all transform active:scale-95 ${
                searchState.isLoading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/40'
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${searchState.isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{searchState.isLoading ? 'Scanning...' : 'Scan Now'}</span>
              <span className="sm:hidden">{searchState.isLoading ? '...' : 'Scan'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Welcome State */}
        {!searchState.data && !searchState.isLoading && !searchState.error && (
          <div className="text-center py-20">
            <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-slate-900 mb-6 border border-slate-800 shadow-xl">
              <Search className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-200">Ready to Scan YouTube</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto text-lg">
              Click the scan button to have Gemini AI find this week's hottest investment and technology videos and channel insights.
            </p>
          </div>
        )}

        {/* Error State */}
        {searchState.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-2xl mx-auto mt-10">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400">Scan Failed</h3>
            <p className="text-red-200/70 mt-2 text-base">{searchState.error}</p>
            <button 
              onClick={handleFetchTrends}
              className="mt-8 px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-base font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading State */}
        {searchState.isLoading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Youtube className="w-8 h-8 text-red-400/50" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-300">Scanning YouTube Data...</p>
              <p className="text-base text-slate-500 mt-2">
                {includeAnalysis 
                  ? `Generating bilingual market report for top ${limit} items (300-500 words)...` 
                  : `Finding the top ${limit} investment & tech videos...`}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {searchState.data && !searchState.isLoading && (
          <div className="space-y-12 animate-fade-in">
            
            {/* Stats / Heatmap */}
            <section>
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <BarChart3 className="w-7 h-7 mr-3 text-red-400" />
                  Virality Heatmap
                </h2>
                {searchState.data.dateRange && (
                  <div className="flex items-center bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                    <span>Data Range: <span className="text-slate-200 font-medium">{searchState.data.dateRange}</span></span>
                  </div>
                )}
              </div>
              
              <div className="h-72 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      hide={true} 
                      domain={[0, 100]} 
                    />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#ef4444' : entry.score > 60 ? '#f59e0b' : '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Detailed Analysis Section (if available) */}
            {searchState.data.analysis && (
              <TrendAnalysis analysis={searchState.data.analysis} />
            )}

            {/* Content Feed */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="w-7 h-7 mr-3 text-emerald-400" />
                  Trending on YouTube This Week
                </h2>
                <span className="px-3 py-1 bg-slate-800 rounded-full text-sm font-medium text-slate-400 border border-slate-700">
                  {searchState.data.parsedTrends.length} stories
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {searchState.data.parsedTrends.map((item) => (
                  <TrendCard key={item.id} item={item} />
                ))}
              </div>

              {/* Fallback if parsing failed but we have text */}
              {searchState.data.parsedTrends.length === 0 && (
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                  <pre className="whitespace-pre-wrap font-sans text-slate-300">
                    {searchState.data.rawText}
                  </pre>
                </div>
              )}
            </section>

            {/* Sources */}
            <SourceList sources={searchState.data.sources} />

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
