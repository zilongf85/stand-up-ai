import React, { useState } from 'react';
import { playAudio } from '../services/geminiService';

interface OutputStageProps {
  text: string;
  audioBase64?: string;
  isLoading: boolean;
  sources?: { uri: string; title: string }[];
}

export const OutputStage: React.FC<OutputStageProps> = ({ text, audioBase64, isLoading, sources }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (audioBase64) {
      setIsPlaying(true);
      await playAudio(audioBase64);
      // Simple timeout to reset state since we don't have exact duration without decoding first
      // In a full app, we'd use the onended event from the audio source
      setTimeout(() => setIsPlaying(false), 5000); 
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 animate-pulse">
        <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p>正在写段子...</p>
        <p className="text-xs mt-2">正在连接幽默细胞...</p>
      </div>
    );
  }

  if (!text) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-600">
        <div className="text-6xl mb-4">🎙️</div>
        <h3 className="text-xl font-bold mb-2">舞台已就绪</h3>
        <p className="text-center max-w-xs">选择一个风格，输入主题，然后点击生成开始表演。</p>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="prose prose-invert prose-lg max-w-none">
             {text.split('\n').map((line, i) => (
               <p key={i} className={`mb-4 ${line.startsWith('(') ? 'text-slate-400 italic text-base' : 'text-slate-100 font-medium'}`}>
                 {line}
               </p>
             ))}
          </div>
        </div>

        {sources && sources.length > 0 && (
          <div className="mt-6 border-t border-slate-700 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">风格研究来源</h4>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs bg-slate-800 text-blue-400 px-2 py-1 rounded hover:bg-slate-700 truncate max-w-[200px]"
                >
                  {source.title || source.uri}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {audioBase64 && (
        <div className="mt-6 flex justify-center sticky bottom-0 pt-4 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`
              flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transform transition-all
              ${isPlaying 
                ? 'bg-slate-700 text-slate-400 scale-95' 
                : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:scale-105 hover:shadow-red-500/25'}
            `}
          >
            {isPlaying ? (
              <>
                <span>正在表演...</span>
                <span className="flex gap-1 h-3 items-end">
                   <span className="w-1 bg-current animate-bounce h-full"></span>
                   <span className="w-1 bg-current animate-bounce h-2 delay-75"></span>
                   <span className="w-1 bg-current animate-bounce h-full delay-150"></span>
                </span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                开始表演
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
