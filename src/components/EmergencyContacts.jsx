import React, { useState } from 'react';
import { EMERGENCY_CONTACTS } from '../data/emergencyContacts';
import { PhoneCall, ShieldAlert, Truck, Hospital, Building2, HeartHandshake, Search, Copy, Check, Volume2 } from 'lucide-react';

export default function EmergencyContacts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedNumber, setCopiedNumber] = useState(null);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-red-500" />;
      case 'TruckMedical': return <Truck className="w-6 h-6 text-blue-400" />;
      case 'Hospital': return <Hospital className="w-6 h-6 text-emerald-400" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-amber-400" />;
      case 'HeartHandshake': default: return <HeartHandshake className="w-6 h-6 text-orange-400" />;
    }
  };

  const handleCopy = (number) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleSpeakNumber = (name, number) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${name}, संपर्क क्रमांक ${number}`);
      utterance.lang = 'mr-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-zinc-950 rounded-3xl p-6 text-white border-2 border-red-600 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-red-950 border border-red-500 text-red-200 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black mb-3">
            <PhoneCall className="w-4 h-4 text-red-400 animate-pulse" />
            <span>विभाग २: महत्त्वाचे संपर्क व हेल्पलाइन क्रमांक</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
            २४×७ आपत्कालीन संपर्क डिरेक्टरी
          </h2>
          <p className="text-base text-zinc-300 mt-2 font-medium">
            शासकीय आणीबाणी सेवा, फिरती रुग्णालये, पालखी मुक्कामाची आरोग्य केंद्रे व पोलीस नियंत्रण कक्ष थेट कॉल करा.
          </p>

          {/* Quick 108 Emergency Card */}
          <div className="mt-5 inline-flex items-center space-x-4 bg-red-950 border-2 border-red-500 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white sos-btn-big">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-sm font-bold text-red-200">आपत्कालीन मोफत रुग्णवाहिका</span>
              <a href="tel:108" className="text-2xl sm:text-3xl font-black text-white hover:underline">
                डायल करा: १०८ (108)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 shadow-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="रुग्णालय किंवा पोलीस ठाणे शोधा..."
            className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-bold bg-black text-white rounded-xl border-2 border-zinc-700 outline-none focus:border-orange-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition border-2 ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white border-orange-400 shadow-lg'
                : 'bg-black text-zinc-300 border-zinc-800'
            }`}
          >
            सर्व संपर्क ({EMERGENCY_CONTACTS.reduce((acc, c) => acc + c.contacts.length, 0)})
          </button>
          {EMERGENCY_CONTACTS.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition border-2 ${
                selectedCategory === cat.category
                  ? 'bg-orange-600 text-white border-orange-400 shadow-lg'
                  : 'bg-black text-zinc-300 border-zinc-800'
              }`}
            >
              {cat.category.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Categorized List */}
      <div className="space-y-8">
        {EMERGENCY_CONTACTS.map((section, sectionIdx) => {
          if (selectedCategory !== 'all' && selectedCategory !== section.category) return null;

          const filteredContacts = section.contacts.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.number.includes(searchQuery)
          );

          if (filteredContacts.length === 0) return null;

          return (
            <div key={sectionIdx} className="space-y-4">
              {/* Category Title */}
              <div className="flex items-center space-x-3 border-b-2 border-orange-600 pb-2">
                <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  {getCategoryIcon(section.icon)}
                </div>
                <h3 className="text-xl font-black text-white">
                  {section.category}
                </h3>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredContacts.map((contact, cIdx) => (
                  <div
                    key={cIdx}
                    className="glass-card rounded-3xl p-5 border-2 border-zinc-800 hover:border-orange-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-black text-base sm:text-lg text-white leading-snug">
                          {contact.name}
                        </h4>
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-zinc-800 text-amber-400 border border-zinc-700 uppercase">
                          {contact.type}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-300 mt-2">
                        {contact.desc}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSpeakNumber(contact.name, contact.number)}
                          className="p-2 text-zinc-400 hover:text-amber-400 rounded-xl hover:bg-zinc-800 transition border border-zinc-800"
                          title="क्रमांक ऐका"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleCopy(contact.number)}
                          className="p-2 text-zinc-400 hover:text-amber-400 rounded-xl hover:bg-zinc-800 transition border border-zinc-800"
                          title="नंबर कॉपी करा"
                        >
                          {copiedNumber === contact.number ? (
                            <Check className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Direct Call Button - LARGE TOUCH TARGET */}
                      <a
                        href={`tel:${contact.number}`}
                        className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-2xl text-sm sm:text-base font-black shadow-lg transition active:scale-95 border border-emerald-400"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>कॉल: {contact.number}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
