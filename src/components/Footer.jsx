import React from 'react';
import { PhoneCall, QrCode, ShieldAlert, Heart, MapPin } from 'lucide-react';

export default function Footer({ onOpenQR, setActiveTab }) {
  return (
    <footer className="mt-16 bg-slate-900 text-white border-t border-slate-800 pb-20 sm:pb-8 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Portal Branding */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🚩</span>
              <div>
                <h3 className="text-lg font-bold text-amber-400">
                  वारकरी सेवा पोर्टल (Pandharpur Wari 2026)
                </h3>
                <p className="text-xs text-slate-400">
                  पालखी सोहळा २४×७ आपत्कालीन व वारकरी साहाय्यता मंच
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              आळंदी व देहू ते पंढरपूर मार्गावरील सर्व वारकरी भाविकांसाठी हवामान इशारे, शासकीय आपत्कालीन संपर्क, आरोग्य केंद्रे, पोलीस ठाणे पत्ते व बिन-औषधी प्रथमोपचार मार्गदर्शन एकाच ठिकाणी.
            </p>
            <div className="text-xs text-amber-300 font-semibold italic">
              ॥ विठ्ठल विठ्ठल जय हरी विठ्ठल ॥ ज्ञानोबा माउली तुकाराम ॥
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              मुख्य विभाग
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => setActiveTab('weather')} className="hover:text-amber-400 transition">
                  १. हवामान अंदाज व इशारे
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contacts')} className="hover:text-amber-400 transition">
                  २. आणीबाणी व हेल्पलाइन संपर्क
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('directory')} className="hover:text-amber-400 transition">
                  ३. आरोग्य केंद्र व पोलीस ठाणे पत्ते
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('health')} className="hover:text-amber-400 transition">
                  ४. बिन-औषधी प्रथमोपचार व आहार
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: QR Code & Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              QR कोड व शेअरिंग
            </h4>
            <button
              onClick={onOpenQR}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md transition"
            >
              <QrCode className="w-4 h-4" />
              <span>QR कोड पोस्टर डाऊनलोड</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              पालखी तळ किंवा दिंडी परिसरात लावण्यासाठी मोफत QR कोड प्रिंट करा.
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 वारकरी सेवा पोर्टल. जनहितासाठी व वारकरी सेवेसाठी समर्पित.</p>
          <div className="flex items-center space-x-1">
            <span>महाराष्ट्राची समृद्ध वारकरी परंपरा</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>

      {/* Sticky Mobile SOS Emergency Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-red-600/50 p-2.5 sm:hidden shadow-2xl flex items-center justify-around">
        <a
          href="tel:108"
          className="flex-1 mr-2 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-xl text-xs font-extrabold shadow sos-btn"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>रुग्णवाहिका: १०८</span>
        </a>

        <a
          href="tel:112"
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-xl text-xs font-extrabold shadow"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>पोलीस: ११२</span>
        </a>

        <button
          onClick={onOpenQR}
          className="ml-2 p-2 bg-amber-500 text-slate-900 rounded-xl text-xs font-bold"
          title="QR कोड"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
}
