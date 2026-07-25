import React, { useState } from 'react';
import { HEALTH_GUIDELINES, DIET_NUTRITION_TIPS } from '../data/healthGuide';
import { HeartPulse, Thermometer, Footprints, Activity, Sun, Utensils, AlertOctagon, CheckCircle2, XCircle, Volume2, Search, PhoneCall } from 'lucide-react';

export default function HealthGuidelines() {
  const [activeGuideId, setActiveGuideId] = useState(HEALTH_GUIDELINES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getGuideIcon = (iconName) => {
    switch (iconName) {
      case 'Thermometer': return <Thermometer className="w-7 h-7 text-red-500" />;
      case 'Footprints': return <Footprints className="w-7 h-7 text-orange-500" />;
      case 'Activity': return <Activity className="w-7 h-7 text-blue-400" />;
      case 'Sun': return <Sun className="w-7 h-7 text-amber-400" />;
      case 'Utensils': default: return <Utensils className="w-7 h-7 text-emerald-400" />;
    }
  };

  const handleSpeechReadout = (guide) => {
    if (!('speechSynthesis' in window)) {
      alert('तुमच्या ब्राऊजरमध्ये आवाज ऐकण्याची सुविधा उपलब्ध नाही.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${guide.title}. प्रथमोपचार: ${guide.doSteps.join('. ')}. काय करू नये: ${guide.dontSteps.join('. ')}. ${guide.whenToSeeDoctor}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'mr-IN';
    utterance.rate = 0.85; // Slightly slower for senior pilgrims

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const filteredGuidelines = HEALTH_GUIDELINES.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeGuide = HEALTH_GUIDELINES.find(g => g.id === activeGuideId) || HEALTH_GUIDELINES[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-950 rounded-3xl p-6 text-white border-2 border-emerald-600 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-950 border border-emerald-500 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black mb-3">
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>विभाग ४: आरोग्य मार्गदर्शक व प्रथमोपचार</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
            बिन-औषधी प्रथमोपचार व आहार मार्गदर्शक
          </h2>
          <p className="text-base text-zinc-300 mt-2 font-medium">
            लांब पल्ल्याच्या पायी चालीमुळे ताप, थकवा, पायाला फोड किंवा स्नायू दुखावल्यास सुरक्षित घरगुती व बिन-औषधी उपाय.
          </p>
        </div>
      </div>

      {/* Strict Caution & Disclaimer Alert */}
      <div className="bg-amber-950 border-2 border-amber-500 rounded-2xl p-5 flex items-start space-x-4 text-white shadow-lg">
        <AlertOctagon className="w-7 h-7 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="text-sm sm:text-base">
          <h4 className="font-black text-amber-300 text-base sm:text-lg">
            ⚠️ अत्यंत महत्त्वाची वैद्यकीय सूचना (No Medicines Prescribed)
          </h4>
          <p className="mt-1 font-bold leading-relaxed text-zinc-200">
            या पोर्टलवर <strong className="text-amber-300 underline">कोणत्याही औषधांचे किंवा गोळ्यांचे नाव दिलेले नाही</strong>. स्वतःच्या मनाने कोणतेही औषध घेणे टाळा.
            त्रास जास्त असल्यास पालखीसोबत असणाऱ्या <strong className="text-red-400">१०८ फिरत्या रुग्णवाहिकेला</strong> किंवा मुक्कामाच्या ठिकाणी मोफत <strong className="text-emerald-400">शासकीय आरोग्य केंद्राला</strong> दाखवा.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="लक्षण शोधा... (उदा. ताप, पाय दुखणे, फोड, उष्माघात, पित्त)..."
          className="w-full pl-12 pr-4 py-3.5 text-base sm:text-lg font-bold bg-black text-white rounded-2xl border-2 border-zinc-700 outline-none focus:border-emerald-500 shadow-md"
        />
      </div>

      {/* Main Layout: Selector Column + Detailed Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Symptom List Pills */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400 px-1">
            लक्षणानुसार बिन-औषधी उपाय निवडा:
          </h3>
          {filteredGuidelines.map((guide) => {
            const isSelected = guide.id === activeGuideId;
            return (
              <button
                key={guide.id}
                onClick={() => {
                  setActiveGuideId(guide.id);
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                }}
                className={`w-full text-left p-4 rounded-2xl transition-all border-2 flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-xl scale-[1.02]'
                    : 'bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-black/30' : 'bg-black'}`}>
                    {getGuideIcon(guide.icon)}
                  </div>
                  <div>
                    <h4 className="font-black text-base leading-snug">
                      {guide.title.split('(')[0]}
                    </h4>
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-200' : 'text-zinc-400'}`}>
                      विभाग: {guide.category}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Detailed First Aid Guide */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-6 border-2 border-zinc-800 shadow-xl space-y-6">
            {/* Title & Audio Readout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-zinc-800 pb-5">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-black rounded-2xl border border-zinc-800">
                  {getGuideIcon(activeGuide.icon)}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {activeGuide.title}
                  </h3>
                  <p className="text-sm font-semibold text-zinc-300 mt-1">
                    {activeGuide.summary}
                  </p>
                </div>
              </div>

              {/* Speech Audio Button - LARGE TOUCH TARGET */}
              <button
                onClick={() => handleSpeechReadout(activeGuide)}
                className={`inline-flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition shadow-lg border-2 ${
                  isSpeaking
                    ? 'bg-red-600 text-white border-red-400 animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400'
                }`}
              >
                <Volume2 className="w-5 h-5 text-amber-300" />
                <span>{isSpeaking ? 'आवाज थांबवा' : 'मराठीत ऐका (Voice)'}</span>
              </button>
            </div>

            {/* Do's List */}
            <div className="bg-emerald-950/60 border-2 border-emerald-600 rounded-2xl p-5 space-y-3 text-white">
              <h4 className="font-black text-emerald-300 text-base sm:text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                काय करावे? (सुरक्षित बिन-औषधी प्रथमोपचार)
              </h4>
              <ul className="space-y-3">
                {activeGuide.doSteps.map((step, idx) => (
                  <li key={idx} className="text-sm sm:text-base font-bold text-zinc-100 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts List */}
            <div className="bg-rose-950/60 border-2 border-rose-600 rounded-2xl p-5 space-y-3 text-white">
              <h4 className="font-black text-rose-300 text-base sm:text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                काय करू नये? (खबरदारी)
              </h4>
              <ul className="space-y-3">
                {activeGuide.dontSteps.map((step, idx) => (
                  <li key={idx} className="text-sm sm:text-base font-bold text-zinc-100 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to see doctor */}
            <div className="bg-zinc-900 border-2 border-zinc-700 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white">
              <div className="flex items-center space-x-3">
                <HeartPulse className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <span className="font-black text-amber-400 block text-base">वैद्यकीय सल्ला कधी घ्यावा?</span>
                  <span className="font-bold text-zinc-200">{activeGuide.whenToSeeDoctor}</span>
                </div>
              </div>
              <a
                href="tel:108"
                className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2.5 rounded-xl text-sm flex-shrink-0 shadow border border-red-400"
              >
                कॉल १०८
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dietary & Nutrition Section */}
      <div className="bg-zinc-950 rounded-3xl p-6 border-2 border-zinc-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-4 border-b-2 border-zinc-800 pb-4">
          <div className="p-3 bg-black rounded-2xl border border-zinc-800">
            <Utensils className="w-7 h-7 text-orange-500" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {DIET_NUTRITION_TIPS.title}
            </h3>
            <p className="text-sm font-semibold text-zinc-400">
              {DIET_NUTRITION_TIPS.subtitle}
            </p>
          </div>
        </div>

        {/* Recommended Foods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIET_NUTRITION_TIPS.hydrationFoods.map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 p-5 rounded-2xl border-2 border-zinc-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-black text-base text-amber-400">
                  {item.name}
                </h4>
                <span className="text-xs font-black bg-black text-orange-400 px-3 py-1 rounded-full border border-orange-500">
                  {item.time}
                </span>
              </div>
              <p className="text-sm font-semibold text-zinc-200">
                {item.benefit}
              </p>
            </div>
          ))}
        </div>

        {/* Avoid List */}
        <div className="bg-rose-950/60 p-5 rounded-2xl border-2 border-rose-600">
          <h4 className="font-black text-sm text-rose-300 mb-3 uppercase tracking-wide">
            🚫 चालताना टाळावयाचे अन्नपदार्थ:
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {DIET_NUTRITION_TIPS.avoidList.map((avoidItem, aIdx) => (
              <span
                key={aIdx}
                className="bg-black text-rose-300 text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border border-rose-500 font-extrabold"
              >
                ✕ {avoidItem}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
