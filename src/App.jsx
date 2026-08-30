import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QRGeneratorModal from './components/QRGeneratorModal';
import SirenModal from './components/SirenModal';
import WeatherAlerts from './components/WeatherAlerts';
import EmergencyContacts from './components/EmergencyContacts';
import LocationDirectory from './components/LocationDirectory';
import HealthGuidelines from './components/HealthGuidelines';
import PalkhiTimeline from './components/PalkhiTimeline';
import AssistantPanel from './components/AssistantPanel';
import Footer from './components/Footer';
import divGhatBg from './assets/div_ghat_bg.jpg';

import { Sun, PhoneCall, MapPin, HeartPulse, ArrowLeft, Siren, Sparkles, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode] = useState(true);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSirenModalOpen, setIsSirenModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('mr'); // kept for potential future use

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // 4 Large Circles data
  const mainCategories = [
    {
      id: 'weather',
      title: '१. हवामान व इशारे',
      desc: 'पालखी मार्गाचे हवामान व वादळ इशारे',
      icon: <Sun className="w-16 h-16 text-amber-400" />,
      circleBg: 'bg-gradient-to-b from-amber-500/60 via-black/95 to-black border-amber-400',
      badgeBg: 'bg-amber-400 text-black',
    },
    {
      id: 'contacts',
      title: '२. आणीबाणी संपर्क',
      desc: '१०८ रुग्णवाहिका व हेल्पलाइन',
      icon: <PhoneCall className="w-16 h-16 text-red-400" />,
      circleBg: 'bg-gradient-to-b from-red-600/60 via-black/95 to-black border-red-500',
      badgeBg: 'bg-red-500 text-white',
    },
    {
      id: 'directory',
      title: '३. केंद्र व ठाणे पत्ते',
      desc: 'आरोग्य केंद्र व पोलीस ठाणे पत्ते',
      icon: <MapPin className="w-16 h-16 text-orange-400" />,
      circleBg: 'bg-gradient-to-b from-orange-500/60 via-black/95 to-black border-orange-500',
      badgeBg: 'bg-orange-500 text-white',
    },
    {
      id: 'health',
      title: '४. प्रथमोपचार व आहार',
      desc: 'फोड, थकावट व घरगुती उपाय',
      icon: <HeartPulse className="w-16 h-16 text-emerald-400" />,
      circleBg: 'bg-gradient-to-b from-emerald-500/60 via-black/95 to-black border-emerald-400',
      badgeBg: 'bg-emerald-400 text-black',
    },
    {
      id: 'assistant',
      title: '५. एआय सहाय्यक',
      desc: 'मराठीत प्रश्न विचारा — बोलून किंवा लिहून',
      icon: <Bot className="w-16 h-16 text-violet-400" />,
      circleBg: 'bg-gradient-to-b from-violet-600/60 via-black/95 to-black border-violet-500',
      badgeBg: 'bg-violet-500 text-white',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-black text-white selection:bg-orange-500 selection:text-white relative">
      
      {/* 1. SHOW DIV GHAT BACKGROUND ONLY ON HOME SCREEN. WHEN ANY OPTION IS OPENED, BACKGROUND IS PURE SOLID BLACK */}
      {activeTab === 'home' && (
        <>
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-500"
            style={{ backgroundImage: `url(${divGhatBg})` }}
          />
          <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/45 via-black/35 to-black/75 pointer-events-none" />
        </>
      )}

      {/* 2. ALL PORTAL CONTENT FLOATING RELATIVE Z-10 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Header */}
        <Navbar 
          onOpenQR={() => setIsQRModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Container */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
          
          {/* Quick Emergency Distress Action Banner */}
          <div className="bg-black/95 border-2 border-red-600 p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center space-x-4 text-center sm:text-left">
              <div className="p-3.5 bg-red-600 rounded-2xl hidden xs:block">
                <Siren className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-xl sm:text-2xl text-white">
                  गर्दीत आपत्कालीन प्रसंगी मदत हवी आहे का?
                </h4>
                <p className="text-base sm:text-lg font-bold text-zinc-300">
                  बेशुद्धी किंवा गर्दीत ताटातूट झाल्यास लाल शिट्टीचा गजर वाजवा.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSirenModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 rounded-2xl text-lg font-black shadow-xl transition active:scale-95 border-2 border-red-400"
            >
              <Siren className="w-6 h-6 text-amber-300" />
              <span>🚨 गर्दित मदत / SOS शिट्टी</span>
            </button>
          </div>

          {/* VIEW 1: HOME MENU WITH 4 LARGE CIRCLES FLOATING ON DIV GHAT BACKGROUND */}
          {activeTab === 'home' && (
            <div className="space-y-8 py-4 animate-fadeIn">
              {/* Center Floating Glass Hero Card (LayoutForge Style) */}
              <div className="bg-black/90 backdrop-blur-xl border-2 border-orange-500/70 p-6 sm:p-8 rounded-3xl text-center space-y-3 shadow-2xl max-w-4xl mx-auto">
                <div className="inline-flex items-center space-x-2 bg-orange-950/90 border border-orange-500 text-amber-300 px-6 py-2 rounded-full text-lg font-black shadow-xl">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                  <span>॥ जाता पंढरीसी सुख वाटे जीवा ॥ वारकरी मदत केंद्र</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                  पालखी सोहळा २४×७ मदत व सेवा पोर्टल
                </h2>
                <p className="text-lg sm:text-xl font-bold text-zinc-200 max-w-2xl mx-auto">
                  हवामान अंदाज, आपत्कालीन १०८ हेल्पलाइन, आरोग्य केंद्र पत्ते व प्रथमोपचार माहिती — किंवा खालील बटणावर टाचून एआय सहाय्यकाला थेट प्रश्न विचारा:
                </p>

                {/* ── AI Assistant CTA — primary homepage entry point ── */}
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl text-xl font-black shadow-2xl transition active:scale-95 border-2 border-violet-400 w-full sm:w-auto"
                >
                  <Bot className="w-7 h-7 text-violet-200" />
                  <span>🎙️ एआय सहाय्यकाला विचारा</span>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </button>
              </div>

              {/* THE 4 NEAT & CLEAN LARGE CIRCLES FLOATING ON STILL BACKGROUND */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {mainCategories.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="floating-glass-card p-6 flex flex-col items-center justify-between text-center space-y-6 cursor-pointer active:scale-95 group"
                  >
                    {/* Huge 132px Circle with Symbol */}
                    <div className={`w-32 h-32 rounded-full ${item.circleBg} border-4 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-1.5">
                      <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-base font-bold text-zinc-300">
                        {item.desc}
                      </p>
                    </div>

                    {/* Clean Button Tag */}
                    <span className={`px-6 py-2.5 rounded-xl text-base font-black ${item.badgeBg} shadow-lg`}>
                      पहा →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: SPECIFIC SECTION VIEW ON PURE SOLID BLACK BACKGROUND WITH "BACK TO MAIN MENU" BUTTON */}
          {activeTab !== 'home' && (
            <div className="space-y-6 animate-fadeIn bg-black p-2 rounded-3xl border border-zinc-800">
              {/* Top Back Navigation Button - EXTRA LARGE FONT FOR OLDER PILGRIMS */}
              <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-2xl border-2 border-orange-500 shadow-2xl">
                <button
                  onClick={() => setActiveTab('home')}
                  className="flex items-center space-x-3 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-black text-lg sm:text-xl shadow-lg transition active:scale-95 border-2 border-amber-300"
                >
                  <ArrowLeft className="w-6 h-6 text-amber-300" />
                  <span>🔙 मुख्य ४ पर्यायांकडे मागे जा</span>
                </button>

                <span className="text-base sm:text-lg font-black text-amber-400 hidden sm:inline">
                  ॥ विठ्ठल जय हरी ॥
                </span>
              </div>

              {/* Render Selected Feature */}
              {activeTab === 'weather' && <WeatherAlerts />}
              {activeTab === 'contacts' && <EmergencyContacts />}
              {activeTab === 'directory' && <LocationDirectory />}
              {activeTab === 'health' && <HealthGuidelines />}
              {activeTab === 'palkhi' && <PalkhiTimeline />}
              {activeTab === 'assistant' && <AssistantPanel />}
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer 
          onOpenQR={() => setIsQRModalOpen(true)}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Printable QR Code Modal */}
      <QRGeneratorModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      {/* Emergency Crowd Siren Modal */}
      <SirenModal
        isOpen={isSirenModalOpen}
        onClose={() => setIsSirenModalOpen(false)}
      />
    </div>
  );
}
