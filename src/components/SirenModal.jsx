import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, X, PhoneCall, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';

export default function SirenModal({ isOpen, onClose }) {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startSiren();
    } else {
      stopSiren();
    }

    return () => stopSiren();
  }, [isOpen]);

  const startSiren = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      setIsPlayingSound(true);
      const audioCtx = audioCtxRef.current;

      const playBeep = () => {
        if (!audioCtx || audioCtx.state === 'closed') return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch siren (A5)
        osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3); // Sweep down

        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      };

      playBeep();
      intervalRef.current = setInterval(playBeep, 600);
    } catch (e) {
      console.error('Audio siren error:', e);
    }
  };

  const stopSiren = () => {
    setIsPlayingSound(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-pulse">
      <div className="bg-red-600 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-300 relative text-center space-y-5">
        {/* Close Button */}
        <button
          onClick={() => {
            stopSiren();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Flashing Beacon Header */}
        <div className="w-20 h-20 mx-auto bg-amber-300 text-red-700 rounded-full flex items-center justify-center shadow-2xl sos-btn">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-amber-300">
            🚨 तातडीची मदत हवी आहे! 🚨
          </h2>
          <p className="text-sm font-bold text-red-100 mt-2 leading-relaxed">
            कृपया जवळील वारकरी, पोलीस किंवा स्वयंसेवकांनी या भाविकाला तात्काळ सहकार्य करावे!
          </p>
        </div>

        {/* Large Marathi Help Card */}
        <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-inner space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
            आपत्कालीन संदेश (Distress Alert)
          </span>
          <p className="text-lg font-black text-slate-900">
            "मी गर्दीत अडकलो आहे / माझी प्रकृती अस्वस्थ आहे. मला वैद्यकीय किंवा सुरक्षेची मदत हवी आहे."
          </p>
        </div>

        {/* Sound Toggle Button */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={isPlayingSound ? stopSiren : startSiren}
            className="flex items-center space-x-2 bg-amber-300 hover:bg-amber-400 text-red-900 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow transition"
          >
            {isPlayingSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingSound ? 'शिट्टीचा आवाज बंद करा' : 'शिट्टीचा आवाज सुरू करा'}</span>
          </button>

          {/* Direct Call 108 */}
          <a
            href="tel:108"
            className="flex items-center space-x-2 bg-white text-red-700 hover:bg-red-50 font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow transition"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>कॉल १०८</span>
          </a>
        </div>
      </div>
    </div>
  );
}
