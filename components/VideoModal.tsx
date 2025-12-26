import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';

interface VideoModalProps {
  videoId: string | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ videoId, onClose }) => {
  const [isReady, setIsReady] = useState(false);

  // 延遲 100ms 顯示 iframe，確保組件已經完全掛載到 DOM
  useEffect(() => {
    if (videoId) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [videoId]);

  if (!videoId) return null;

  // 確保只取得 11 位元 ID
  const cleanId = videoId.includes('v=') 
    ? videoId.split('v=')[1].split('&')[0] 
    : videoId.split('/').pop()?.split('?')[0] || videoId;

  // 建立參數物件，避免拼錯字串
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',           // 必須靜音才能自動播放
    rel: '0',            // 不顯示推薦影片
    modestbranding: '1', // 隱藏 YouTube Logo
    enablejsapi: '1',    // 啟用 JS API 支援
    origin: window.location.origin // 重要：告訴 YouTube 請求來源
  });

  const videoSrc = `https://www.youtube.com/embed/${cleanId}?${params.toString()}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* 關閉按鈕 */}
        <div className="absolute top-4 right-4 z-20">
          <button onClick={onClose} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="text-yellow-500" size={28} />
            <h3 className="text-2xl font-bold text-white">恭喜中獎！專屬影片...</h3>
          </div>

          <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl">
            {isReady ? (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={videoSrc}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                載入中...
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-8 py-4 bg-white text-black font-extrabold rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
          >
            看完影片，領取獎品
          </button>
        </div>
      </div>
    </div>
  );
};