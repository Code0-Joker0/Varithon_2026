import React from 'react';
import { QrCode, PhoneCall, Sparkles, MapPin, AlertTriangle } from 'lucide-react';

export default function Navbar({ 
  onOpenQR, 
  activeTab, 
  setActiveTab,
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-black border-b-2 border-orange-600 shadow-2xl">
      {/* Top Spiritual Saffron Banner */}
      <div className="saffron-gradient text-white text-sm sm:text-base py-2 px-4 text-center font-extrabold flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
          <span className="tracking-wide">॥ ज्ञानोबा माउली तुकाराम ॥ वारकरी सेवा पोर्टल</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <a href="tel:108" className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg animate-pulse">
            <PhoneCall className="w-4 h-4" />
            <span>आपत्कालीन रुग्णवाहिका: १०८</span>
          </a>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between bg-black">
        {/* Brand Logo & Large Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('weather')}>
          <div className="w-12 h-12 rounded-2xl bg-orange-600 border-2 border-amber-400 p-1 flex items-center justify-center text-2xl shadow-lg">
            🚩
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-1.5">
              वारकरी सेवा पोर्टल
            </h1>
            <p className="text-xs sm:text-sm text-amber-400 flex items-center gap-1 font-extrabold">
              <MapPin className="w-3.5 h-3.5 text-orange-500 inline" />
              आळंदी - देहू ते पंढरपूर पालखी सोहळा मदत
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Google Translate Widget — replaces the previous non-functional select */}
          <div id="google_translate_element" />

          {/* QR Portal Generator Button */}
          <button
            onClick={onOpenQR}
            className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-4 py-2 rounded-xl text-sm font-black border border-amber-300 shadow-lg active:scale-95"
            title="QR कोड जनरेट व शेअर करा"
          >
            <QrCode className="w-5 h-5 text-amber-300" />
            <span className="hidden xs:inline">QR कोड</span>
          </button>
        </div>
      </div>
    </header>
  );
}
