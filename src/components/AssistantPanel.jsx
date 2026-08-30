import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Mic, MicOff, Send, Sparkles, X, AlertTriangle,
  Loader2, Volume2, VolumeX, MicOff as MicDenied,
} from 'lucide-react';
import EmergencyContacts from './EmergencyContacts';
import LocationDirectory from './LocationDirectory';
import PalkhiTimeline from './PalkhiTimeline';
import { useVarithonQuery } from '../hooks/useVarithonQuery';

// ── Feature detection (module level, runs once) ──────────────────────────────
const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition || null)
    : null;

const hasTTS =
  typeof window !== 'undefined' && 'speechSynthesis' in window;

// ── TTS helpers ───────────────────────────────────────────────────────────────
/**
 * Pick the best available voice: prefer mr-IN, fall back to hi-IN / hi,
 * then any available voice rather than nothing.
 */
function pickVoice() {
  if (!hasTTS) return null;
  const voices = window.speechSynthesis.getVoices();
  console.log('[Varithon TTS] getVoices() returned', voices.length, 'voices:', voices.map(v => `${v.name} (${v.lang})`));
  const picked =
    voices.find((v) => v.lang.startsWith('mr')) ||
    voices.find((v) => v.lang.startsWith('hi')) ||
    voices[0] ||
    null;
  console.log('[Varithon TTS] pickVoice() selected:', picked ? `${picked.name} (${picked.lang})` : 'NONE — no voices available');
  return picked;
}

function speak(text, onEnd) {
  if (!hasTTS || !text) {
    console.log('[Varithon TTS] speak() skipped: hasTTS=', hasTTS, 'text length=', text?.length);
    return;
  }
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  const voice = pickVoice();
  if (voice) utt.voice = voice;
  utt.lang = voice?.lang || 'mr-IN';
  utt.rate = 0.9;
  if (onEnd) utt.onend = onEnd;
  console.log('[Varithon TTS] speechSynthesis.speak() called | voice=', voice?.name ?? 'browser-default', '| lang=', utt.lang, '| text[:60]=', text.slice(0, 60));
  window.speechSynthesis.speak(utt);
}

function stopSpeaking() {
  if (hasTTS) window.speechSynthesis.cancel();
}

// Short fixed phrases spoken when the user taps the speaker icon
// on a static-category result (not the full component content).
const STATIC_SUMMARIES = {
  emergency: 'आपत्कालीन संपर्क दाखवत आहे. कृपया स्क्रीनवरील माहिती पाहा.',
  hospital:  'आरोग्य केंद्र व पोलीस ठाणे पत्ते दाखवत आहे.',
  vari_facts: 'पालखी मार्ग व थांबे दाखवत आहे.',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AssistantPanel() {
  const [inputText, setInputText]         = useState('');
  const [isListening, setIsListening]     = useState(false);
  const [micDenied, setMicDenied]         = useState(false);
  const [isSpeaking, setIsSpeaking]       = useState(false);
  const [backendDown, setBackendDown]     = useState(false); // true if /health check fails
  const recognitionRef                    = useRef(null);
  const { loading, result, submitQuery, clearResult } = useVarithonQuery();

  // ── Backend health check on mount ──
  // Gives the backend 2.5 s to respond; marks it as down if it fails or times out.
  // This gracefully handles the GitHub Pages deployment where the backend is
  // only reachable from devices on the private Tailscale network.
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    fetch(`${BACKEND_URL}/health`, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error('non-ok'); })
      .catch(() => setBackendDown(true))
      .finally(() => clearTimeout(timeout));

    return () => { controller.abort(); clearTimeout(timeout); };
  }, []);

  // Voices load async in some browsers; force a re-render when they arrive
  // so pickVoice() can find mr/hi voices that weren't present at mount.
  const [, forceUpdate] = useState(0);
  const [ttsVoicesReady, setTtsVoicesReady] = useState(
    // Some browsers (Firefox) populate getVoices() synchronously on first call
    hasTTS && window.speechSynthesis.getVoices().length > 0
  );

  useEffect(() => {
    if (!hasTTS) return;
    const handler = () => {
      const count = window.speechSynthesis.getVoices().length;
      console.log('[Varithon TTS] voiceschanged fired —', count, 'voices now available');
      setTtsVoicesReady(count > 0);
      forceUpdate((n) => n + 1);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', handler);
  }, []);

  // Auto-speak when a new LLM result arrives
  useEffect(() => {
    if (result?.category === 'llm' && result.message) {
      setIsSpeaking(true);
      speak(result.message, () => setIsSpeaking(false));
    }
    // If a non-llm result arrives while speaking, stop.
    if (result && result.category !== 'llm') {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [result]);

  // ── STT ───────────────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) return;
    setMicDenied(false);

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = 'mr-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Populate input only — user must press submit themselves.
      setInputText(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setMicDenied(true);
      }
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    stopSpeaking();
    setIsSpeaking(false);
    submitQuery(inputText);
  };

  const handleClear = () => {
    setInputText('');
    stopSpeaking();
    setIsSpeaking(false);
    clearResult();
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleStaticSpeak = (category) => {
    stopSpeaking();
    setIsSpeaking(true);
    speak(STATIC_SUMMARIES[category] || '', () => setIsSpeaking(false));
  };

  // ── Result renderer ───────────────────────────────────────────────────────
  const renderResult = () => {
    if (!result) return null;
    const { category, message } = result;

    // Static categories: render existing component + small speaker button
    if (category === 'emergency' || category === 'hospital' || category === 'vari_facts') {
      const Component =
        category === 'emergency' ? EmergencyContacts :
        category === 'hospital'  ? LocationDirectory :
                                   PalkhiTimeline;

      return (
        <div className="space-y-3">
          {/* Speaker shortcut for static results */}
          {hasTTS && (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleStaticSpeak(category)}
                disabled={isSpeaking}
                className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-orange-500 text-zinc-300 hover:text-orange-400 px-4 py-2 rounded-xl text-sm font-black transition disabled:opacity-50"
                title="थोडक्यात ऐका"
              >
                <Volume2 className="w-4 h-4" />
                <span>थोडक्यात ऐका</span>
              </button>
              {isSpeaking && (
                <button
                  onClick={handleStopSpeaking}
                  className="flex items-center space-x-2 bg-red-950 hover:bg-red-900 border border-red-600 text-red-300 px-4 py-2 rounded-xl text-sm font-black transition"
                  title="बंद करा"
                >
                  <VolumeX className="w-4 h-4" />
                  <span>बंद करा</span>
                </button>
              )}
            </div>
          )}
          <Component />
        </div>
      );
    }

    if (category === 'llm') {
      return (
        <div className="bg-zinc-950 border-2 border-orange-500/70 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-black text-base">वारी सहाय्यकाचे उत्तर</span>
            </div>

            {/* TTS controls for LLM answer */}
            {hasTTS && (
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <button
                    onClick={handleStopSpeaking}
                    className="flex items-center space-x-2 bg-red-950 hover:bg-red-900 border border-red-600 text-red-300 px-3 py-1.5 rounded-xl text-sm font-black transition"
                    title="बंद करा"
                  >
                    <VolumeX className="w-4 h-4" />
                    <span className="hidden sm:inline">बंद करा</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsSpeaking(true);
                      speak(message, () => setIsSpeaking(false));
                    }}
                    className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-orange-500 text-zinc-300 hover:text-orange-400 px-3 py-1.5 rounded-xl text-sm font-black transition"
                    title="पुन्हा ऐका"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span className="hidden sm:inline">पुन्हा ऐका</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-white font-bold text-lg leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>
      );
    }

    // error / unexpected
    return (
      <div className="bg-zinc-950 border-2 border-red-600 rounded-3xl p-6 space-y-3 shadow-2xl flex items-start space-x-4">
        <AlertTriangle className="w-8 h-8 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-black text-red-300 text-base">त्रुटी आली</p>
          <p className="text-zinc-300 font-semibold mt-1">{message}</p>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Panel card ───────────────────────────────────────────────────── */}
      <div className="bg-black/90 backdrop-blur-xl border-2 border-orange-500/70 p-5 rounded-3xl shadow-2xl space-y-4">

        {/* Header row */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-orange-950 border border-orange-500 rounded-2xl">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h2 className="font-black text-xl text-white">वारी एआय सहाय्यक</h2>
            <p className="text-sm font-bold text-zinc-400">
              मराठीत प्रश्न विचारा — बोलून किंवा लिहून
            </p>
          </div>
          {result && (
            <button
              onClick={handleClear}
              className="ml-auto p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-zinc-800 transition border border-zinc-800"
              title="उत्तर बंद करा"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Input row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="उदा. जवळचा दवाखाना कुठे आहे? / विठ्ठलाबद्दल सांग"
            disabled={loading || isListening || backendDown}
            className="flex-1 bg-black text-white font-bold text-base placeholder:text-zinc-600 px-5 py-3.5 rounded-2xl border-2 border-zinc-700 outline-none focus:border-orange-500 transition disabled:opacity-60"
          />

          {/* Mic button — hidden entirely if API unsupported */}
          {SpeechRecognitionAPI && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={loading}
              className={`p-3.5 rounded-2xl border-2 font-black transition active:scale-95 shrink-0 ${
                isListening
                  ? 'bg-red-600 border-red-400 text-white animate-pulse'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400'
              } disabled:opacity-50`}
              title={isListening ? 'थांबवा' : 'बोला (मराठी)'}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !inputText.trim() || backendDown}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3.5 rounded-2xl font-black text-base shadow-lg transition active:scale-95 border-2 border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Send className="w-5 h-5" />}
            <span className="hidden sm:inline">
              {loading ? 'विचारत आहे...' : 'विचारा'}
            </span>
          </button>
        </form>

        {/* Listening status */}
        {isListening && (
          <p className="text-sm font-black text-red-400 animate-pulse flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span>ऐकत आहे... बोलणे पूर्ण झाल्यावर इनपुटमध्ये दिसेल</span>
          </p>
        )}

        {/* Mic permission denied — inline, non-blocking */}
        {micDenied && (
          <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3">
            <MicDenied className="w-5 h-5 text-zinc-500 shrink-0" />
            <p className="text-sm font-bold text-zinc-400">
              मायक्रोफोनची परवानगी नाकारली गेली. कृपया टाइप करून प्रश्न विचारा.
            </p>
          </div>
        )}

        {/* Backend unavailable notice — shown when /health check fails or times out */}
        {backendDown && (
          <div className="flex items-start space-x-3 bg-amber-950/60 border border-amber-700 rounded-2xl px-4 py-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-amber-300">AI सहाय्यक सध्या उपलब्ध नाही</p>
              <p className="text-xs font-bold text-amber-500 mt-0.5">
                बॅकएंड सर्व्हर पोहोचत नाही. इतर सर्व विभाग (आपत्कालीन संपर्क, पत्ते, पालखी माहिती) पूर्णपणे कार्यरत आहेत.
              </p>
            </div>
          </div>
        )}

        {/* TTS voices unavailable — shown when speechSynthesis exists but OS has no voices */}
        {hasTTS && !ttsVoicesReady && (
          <div className="flex items-center space-x-2 bg-zinc-900/70 border border-zinc-800 rounded-2xl px-4 py-2.5">
            <VolumeX className="w-4 h-4 text-zinc-600 shrink-0" />
            <p className="text-xs font-bold text-zinc-500">
              आवाज आउटपुट उपलब्ध नाही (OS मध्ये TTS व्हॉइस नाही — उत्तर स्क्रीनवर दिसेल)
            </p>
          </div>
        )}
      </div>

      {/* ── Result area ──────────────────────────────────────────────────── */}
      {result && (
        <div className="animate-fadeIn">
          {renderResult()}
        </div>
      )}
    </div>
  );
}
