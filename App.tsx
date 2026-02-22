
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PanoramaViewer from './components/PanoramaViewer';
import TourUI from './components/TourUI';
import { INITIAL_SCENES } from './constants';
import { Scene, Hotspot } from './types';
import { Loader2 } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/df0t4iky4/image/upload/v1769001206/Logo_oitghp.png';
const BG_VIDEO_URL = 'https://res.cloudinary.com/df0t4iky4/video/upload/v1769002605/Terra_Loop_hczhld.mov';
const BG_MUSIC_URL = 'https://res.cloudinary.com/df0t4iky4/video/upload/v1769001166/musica_fundo_i3fggq.mp3';

const App: React.FC = () => {
  const [currentSceneId, setCurrentSceneId] = useState(INITIAL_SCENES[0].id);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fov, setFov] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentScene = INITIAL_SCENES.find(s => s.id === currentSceneId) || INITIAL_SCENES[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hasStarted && audioRef.current) {
      audioRef.current.play().catch(err => console.warn("Audio playback delayed:", err));
    }
  }, [hasStarted]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newState = !isMuted;
      audioRef.current.muted = newState;
      setIsMuted(newState);
    }
  }, [isMuted]);

  const changeScene = useCallback((sceneId: string) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSceneId(sceneId);
      setIsTransitioning(false);
    }, 1000);
  }, [isTransitioning]);

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    if (hotspot.targetSceneId) {
      changeScene(hotspot.targetSceneId);
    }
  }, [changeScene]);

  const handleStart = () => {
    setHasStarted(true);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center p-12 text-center">
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full scale-150 animate-pulse" />
          <Loader2 className="text-blue-500 animate-spin relative" size={80} strokeWidth={1} />
        </div>
        <h2 className="text-white text-4xl font-black tracking-[1em] mb-8 translate-x-[0.5em]">CARREGANDO</h2>
        <div className="w-80 h-[1px] bg-white/10 rounded-full overflow-hidden relative">
          <div className="h-full bg-blue-500 absolute inset-0 animate-[loading_3s_ease-in-out_infinite] shadow-[0_0_15px_#3b82f6]" />
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="h-screen w-screen bg-[#020202] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        >
          <source src={BG_VIDEO_URL} type="video/quicktime" />
          <source src={BG_VIDEO_URL.replace('.mov', '.mp4')} type="video/mp4" />
        </video>

        {/* Overlay para contraste sem desfoque */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Ambient Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        </div>

        <div className="z-10 flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-1000 ease-out">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 group-hover:bg-blue-500/10 transition-colors duration-1000" />
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="w-64 md:w-80 relative transition-transform duration-700 hover:scale-105"
            />
          </div>

          <button
            onClick={handleStart}
            className="
              group relative px-12 py-4 bg-transparent text-white font-black tracking-[0.4em] uppercase text-sm
              border border-white/20 rounded-full overflow-hidden transition-all duration-500
              hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]
              bg-white/5
            "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
              INICIAR
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className={`relative h-[100dvh] w-screen overflow-hidden bg-black select-none transition-opacity duration-1000 ${isTransitioning ? 'opacity-40' : 'opacity-100'}`}>
      <audio ref={audioRef} src={BG_MUSIC_URL} loop />
      
      <PanoramaViewer 
        currentScene={currentScene} 
        onHotspotClick={handleHotspotClick}
        autoRotate={autoRotate && !isTransitioning}
        fov={fov}
      />
      
      <TourUI 
        currentScene={currentScene}
        scenes={INITIAL_SCENES}
        onSceneChange={changeScene}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        fov={fov}
        onFovChange={setFov}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {isTransitioning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl pointer-events-none z-[200] animate-in fade-in duration-700" />
      )}

      <style>{`
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        canvas { 
          touch-action: none; 
          cursor: crosshair; 
        }
        canvas:active { cursor: grabbing; }
      `}</style>
    </main>
  );
};

export default App;
