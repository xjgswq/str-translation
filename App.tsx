
import React, { useState, useCallback, useRef } from 'react';
import { SubtitleItem, TranslationMode, TranslationProgress } from './types';
import { parseSRT, generateSRT } from './services/srtParser';
import { GeminiTranslator } from './services/geminiService';

const App: React.FC = () => {
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [mode, setMode] = useState<TranslationMode>('bilingual');
  const [progress, setProgress] = useState<TranslationProgress>({
    total: 0,
    completed: 0,
    currentChunk: 0,
    totalChunks: 0
  });

  // Quick Preview State
  const [previewInput, setPreviewInput] = useState('');
  const [previewOutput, setPreviewOutput] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseSRT(content);
      setSubtitles(parsed);
      setProgress({
        total: parsed.length,
        completed: 0,
        currentChunk: 0,
        totalChunks: Math.ceil(parsed.length / 20)
      });
    };
    reader.readAsText(file);
  };

  const startTranslation = async () => {
    if (subtitles.length === 0 || isTranslating) return;

    setIsTranslating(true);
    const translator = new GeminiTranslator();

    try {
      await translator.translateBatch(subtitles, (batch) => {
        setSubtitles(prev => prev.map(item => {
          const match = batch.find(b => b.index === item.index);
          if (match) {
            return { ...item, translatedText: match.text, status: 'completed' };
          }
          return item;
        }));
        
        setProgress(prev => ({
          ...prev,
          completed: Math.min(prev.completed + batch.length, prev.total),
          currentChunk: prev.currentChunk + 1
        }));
      });
    } catch (error) {
      console.error(error);
      alert("翻译过程中出现错误，请检查网络或 API Key 状态。");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleQuickPreview = async () => {
    if (!previewInput.trim() || isPreviewLoading) return;
    setIsPreviewLoading(true);
    const translator = new GeminiTranslator();
    try {
      const result = await translator.translateSingle(previewInput);
      setPreviewOutput(result);
    } catch (error) {
      setPreviewOutput("翻译出错，请稍后再试。");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleDownload = () => {
    const content = generateSRT(subtitles, mode);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode === 'bilingual' ? '[双语]' : '[纯中]'}_${fileName}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 space-y-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-closed-captioning text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">SubTrans Pro</h1>
            <p className="text-slate-400 text-sm">智能 AI 字幕翻译 • 追求信达雅</p>
          </div>
        </div>

        {subtitles.length > 0 && (
          <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button 
              onClick={() => setMode('bilingual')}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${mode === 'bilingual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              中英双语
            </button>
            <button 
              onClick={() => setMode('chinese-only')}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${mode === 'chinese-only' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              纯中文
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        
        {/* Left Panel: Upload and Quick Preview */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Upload Card */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-6 backdrop-blur-sm">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">上传字幕文件 (.srt)</label>
              <div 
                onClick={() => !isTranslating && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all group ${
                  isTranslating ? 'border-slate-700 cursor-not-allowed opacity-50' : 'border-slate-600 cursor-pointer hover:border-blue-500 hover:bg-blue-500/5'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".srt" 
                  className="hidden" 
                  disabled={isTranslating}
                />
                <i className={`fas fa-file-upload text-3xl mb-3 block ${isTranslating ? 'text-slate-600' : 'text-slate-500 group-hover:text-blue-500'}`}></i>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 truncate px-2 font-medium">
                  {fileName ? fileName : '点击或拖拽文件'}
                </p>
              </div>
            </div>

            {subtitles.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">总计片段:</span>
                  <span className="font-medium text-white">{subtitles.length}</span>
                </div>
                
                {isTranslating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-400 font-medium animate-pulse">正在精修翻译中...</span>
                      <span className="text-slate-400">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    disabled={isTranslating || subtitles.length === 0}
                    onClick={startTranslation}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    {isTranslating ? (
                      <><i className="fas fa-circle-notch fa-spin"></i> 处理中</>
                    ) : (
                      <><i className="fas fa-magic"></i> 开始智能翻译</>
                    )}
                  </button>
                  
                  {progress.completed === progress.total && progress.total > 0 && (
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-download"></i> 下载结果
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Preview Card */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 space-y-4 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
              <i className="fas fa-bolt text-yellow-500"></i> 快速试译预览
            </h3>
            <div className="space-y-3">
              <textarea
                value={previewInput}
                onChange={(e) => setPreviewInput(e.target.value)}
                placeholder="在此输入一段英文，测试“信达雅”翻译效果..."
                className="w-full h-24 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
              />
              <button
                onClick={handleQuickPreview}
                disabled={!previewInput.trim() || isPreviewLoading}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isPreviewLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-language"></i>}
                即时翻译测试
              </button>
              {previewOutput && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-tighter">翻译结果：</p>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {previewOutput}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Preview List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
            <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <i className="fas fa-list-ul text-blue-500"></i> 字幕列表预览
            </h2>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {subtitles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 bg-slate-800/10 border border-dashed border-slate-700 rounded-3xl text-slate-500">
                <i className="fas fa-keyboard text-5xl mb-4 opacity-5"></i>
                <p className="font-medium">等待上传 SRT 文件进行解析...</p>
              </div>
            ) : (
              subtitles.map((sub) => (
                <div 
                  key={sub.index} 
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    sub.translatedText ? 'bg-slate-800/80 border-slate-600' : 'bg-slate-800/20 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-700/50 rounded text-slate-400">
                      #{sub.index}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {sub.startTime} → {sub.endTime}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      {sub.originalText}
                    </p>
                    {sub.translatedText ? (
                      <p className="text-base text-white font-medium border-l-2 border-blue-500 pl-3 py-1">
                        {sub.translatedText}
                      </p>
                    ) : (
                      <div className="flex gap-1.5 mt-2">
                        <div className="h-2 w-16 bg-slate-700/30 animate-pulse rounded"></div>
                        <div className="h-2 w-24 bg-slate-700/30 animate-pulse rounded"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default App;
