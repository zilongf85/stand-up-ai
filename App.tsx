import React, { useState, useRef } from 'react';
import { ComedianProfile } from './types';
import { PRESET_COMEDIANS, INITIAL_KNOWLEDGE_PLACEHOLDER, KNOWLEDGE_PRESETS } from './constants';
import { ProfileSelector } from './components/ProfileSelector';
import { OutputStage } from './components/OutputStage';
import { generateComedyRoutine, generateSpeech } from './services/geminiService';

export default function App() {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(PRESET_COMEDIANS[0].id);
  const [customComedianName, setCustomComedianName] = useState('');
  const [topic, setTopic] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'knowledge'>('create');
  
  // Output State
  const [generatedText, setGeneratedText] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState<string | undefined>(undefined);
  const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    setGeneratedText('');
    setGeneratedAudio(undefined);
    setSources([]);

    try {
      const profile = PRESET_COMEDIANS.find(p => p.id === selectedProfileId)!;
      
      // 1. Generate Text
      const result = await generateComedyRoutine(
        topic, 
        profile, 
        customComedianName, 
        knowledgeBase,
        true // Always allow search for grounding if needed
      );

      setGeneratedText(result.text);
      setSources(result.sources);

      // 2. Generate Audio (TTS)
      if (result.text) {
         const audioData = await generateSpeech(result.text);
         if (audioData) {
            setGeneratedAudio(audioData);
         }
      }

    } catch (error) {
      console.error(error);
      setGeneratedText("出错了。AI 也有怯场的时候。请检查你的 API Key。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setKnowledgeBase((prev) => {
        // If empty, just set it. If not empty, append with new lines.
        return prev ? `${prev}\n\n--- Imported File: ${file.name} ---\n\n${text}` : text;
      });
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white overflow-hidden spotlight">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center font-bold text-white shadow-[0_0_10px_red]">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight">StandUp<span className="text-red-500">.ai</span></h1>
        </div>
        <div className="ml-auto flex gap-4 text-sm font-medium">
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-slate-400 hover:text-white transition-colors">
             计费信息
           </a>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Controls */}
        <div className="w-80 md:w-96 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button 
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'create' ? 'text-red-500 border-b-2 border-red-500 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
            >
              🎭 创作室
            </button>
            <button 
              onClick={() => setActiveTab('knowledge')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'knowledge' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-slate-800/50' : 'text-slate-400 hover:text-white'}`}
            >
              🧠 大脑 / 资料库
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            
            {activeTab === 'create' ? (
              <div className="space-y-6">
                 {/* Topic Input */}
                 <div>
                  <label className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                    今天想吐槽点什么？
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="例如：航空餐，约会软件，时间的概念，早高峰..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none h-24 transition-all"
                  />
                </div>

                {/* Profile Selector */}
                <ProfileSelector 
                  selectedId={selectedProfileId}
                  onSelect={setSelectedProfileId}
                  customName={customComedianName}
                  setCustomName={setCustomComedianName}
                />
              </div>
            ) : (
              <div className="space-y-4 h-full flex flex-col">
                <div className="bg-emerald-900/20 border border-emerald-800/50 p-3 rounded-lg text-emerald-300 text-xs">
                  <span className="font-bold block mb-1">知识注入:</span>
                  在此粘贴具体的逐字稿、喜剧理论或个人风格笔记。AI 写作时将优先参考这些内容。
                </div>

                {/* File Upload & Clear Controls */}
                <div className="flex gap-2">
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept=".txt,.md,.json"
                   />
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="flex-1 flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-lg transition-colors"
                   >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                     </svg>
                     导入文本文件 (.txt/.md)
                   </button>
                   <button 
                     onClick={() => setKnowledgeBase('')}
                     className="px-3 bg-slate-800 border border-slate-700 hover:bg-red-900/50 hover:text-red-400 hover:border-red-900 text-slate-300 text-xs py-2 rounded-lg transition-colors"
                     title="清空"
                   >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>
                
                {/* Knowledge Presets */}
                <div className="flex flex-wrap gap-2">
                  {KNOWLEDGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setKnowledgeBase(prev => prev ? prev + "\n\n" + preset.content : preset.content)}
                      className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-1.5 rounded hover:bg-emerald-900/50 hover:text-emerald-200 transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  placeholder={INITIAL_KNOWLEDGE_PLACEHOLDER}
                  className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm font-mono text-slate-300 placeholder-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none transition-all"
                />
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-4 border-t border-slate-800 bg-slate-900">
            <button
              onClick={handleGenerate}
              disabled={!topic || isGenerating}
              className={`
                w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all
                ${!topic || isGenerating 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 hover:scale-[1.02]'}
              `}
            >
              {isGenerating ? '正在创作与排练...' : '生成段子'}
            </button>
          </div>
        </div>

        {/* Main Content: Stage */}
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-900 to-[#1a1212] relative flex flex-col p-6 overflow-hidden">
           {/* Decorative curtains/lights */}
           <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-0"></div>
           
           <div className="flex-1 z-10 max-w-4xl mx-auto w-full h-full">
             <OutputStage 
               text={generatedText}
               audioBase64={generatedAudio}
               isLoading={isGenerating}
               sources={sources}
             />
           </div>
        </div>

      </main>
    </div>
  );
}