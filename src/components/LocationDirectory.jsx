import React, { useState } from 'react';
import { HALT_LOCATIONS_DIRECTORY } from '../data/locationDirectory';
import { MapPin, Navigation, Hospital, Shield, Landmark, Droplets, PhoneCall, Clock, Search } from 'lucide-react';

export default function LocationDirectory() {
  const [selectedHalt, setSelectedHalt] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getFacilityIcon = (type) => {
    switch (type) {
      case 'Hospital': return <Hospital className="w-6 h-6 text-emerald-400" />;
      case 'Police': return <Shield className="w-6 h-6 text-blue-400" />;
      case 'Govt': return <Landmark className="w-6 h-6 text-amber-400" />;
      case 'Sanitation': default: return <Droplets className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getFacilityBadge = (type) => {
    switch (type) {
      case 'Hospital': return <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-xs font-black px-3 py-1 rounded-full">आरोग्य केंद्र</span>;
      case 'Police': return <span className="bg-blue-950 text-blue-300 border border-blue-600 text-xs font-black px-3 py-1 rounded-full">पोलीस ठाणे</span>;
      case 'Govt': return <span className="bg-amber-950 text-amber-300 border border-amber-600 text-xs font-black px-3 py-1 rounded-full">शासकीय कार्यालय</span>;
      case 'Sanitation': default: return <span className="bg-cyan-950 text-cyan-300 border border-cyan-600 text-xs font-black px-3 py-1 rounded-full">पाणी व स्वच्छता</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-zinc-950 rounded-3xl p-6 text-white border-2 border-orange-600 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-orange-950 border border-orange-600 text-orange-300 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black mb-3">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>विभाग ३: मुक्काम ठिकाण पत्ते व नेव्हिगेशन</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
            आरोग्य केंद्रे, पोलीस ठाणे व शासकीय पत्ते
          </h2>
          <p className="text-base text-zinc-300 mt-2 font-medium">
            प्रत्येक पालखी मुक्कामाच्या ठिकाणातील रुग्णालये, पोलीस स्टेशन व मदत केंद्रांचे अचूक पत्ते व गुगल मॅप्स दिशानिर्देश.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="पत्ता किंवा रुग्णालय शोधा..."
              className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-bold bg-black text-white rounded-xl border-2 border-zinc-700 outline-none focus:border-orange-500"
            />
          </div>

          {/* Facility Type Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-sm font-black text-zinc-400 whitespace-nowrap">प्रकार:</span>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition border-2 ${
                selectedType === 'all' ? 'bg-orange-600 text-white border-orange-400' : 'bg-black text-zinc-300 border-zinc-800'
              }`}
            >
              सर्व
            </button>
            <button
              onClick={() => setSelectedType('Hospital')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition border-2 ${
                selectedType === 'Hospital' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-black text-emerald-300 border-zinc-800'
              }`}
            >
              आरोग्य केंद्र
            </button>
            <button
              onClick={() => setSelectedType('Police')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition border-2 ${
                selectedType === 'Police' ? 'bg-blue-600 text-white border-blue-400' : 'bg-black text-blue-300 border-zinc-800'
              }`}
            >
              पोलीस ठाणे
            </button>
            <button
              onClick={() => setSelectedType('Govt')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition border-2 ${
                selectedType === 'Govt' ? 'bg-amber-600 text-white border-amber-400' : 'bg-black text-amber-300 border-zinc-800'
              }`}
            >
              शासकीय
            </button>
          </div>
        </div>

        {/* Halt Station Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-3 border-t border-zinc-800 pb-1">
          <span className="text-sm font-black text-amber-400 whitespace-nowrap flex items-center gap-1">
            <MapPin className="w-4 h-4 text-orange-500" /> मुक्काम:
          </span>
          <button
            onClick={() => setSelectedHalt('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition border-2 ${
              selectedHalt === 'all'
                ? 'bg-amber-500 text-black border-amber-300 shadow-md'
                : 'bg-black text-zinc-300 border-zinc-800'
            }`}
          >
            सर्व मुक्काम ({HALT_LOCATIONS_DIRECTORY.length})
          </button>
          {HALT_LOCATIONS_DIRECTORY.map((halt) => (
            <button
              key={halt.haltId}
              onClick={() => setSelectedHalt(halt.haltId)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition border-2 ${
                selectedHalt === halt.haltId
                  ? 'bg-amber-500 text-black border-amber-300 shadow-md'
                  : 'bg-black text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {halt.haltName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="space-y-6">
        {HALT_LOCATIONS_DIRECTORY.map((halt) => {
          if (selectedHalt !== 'all' && selectedHalt !== halt.haltId) return null;

          const filteredFacilities = halt.facilities.filter((f) => {
            const matchesType = selectedType === 'all' || f.type === selectedType;
            const matchesQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 f.address.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesQuery;
          });

          if (filteredFacilities.length === 0) return null;

          return (
            <div key={halt.haltId} className="space-y-4">
              {/* Halt Station Subheader */}
              <div className="flex items-center space-x-3 border-b-2 border-orange-600 pb-2">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 inline-block animate-pulse" />
                <h3 className="text-xl font-black text-white">
                  {halt.haltName} ({halt.district} जिल्हा)
                </h3>
              </div>

              {/* Facility Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredFacilities.map((facility, fIdx) => (
                  <div
                    key={fIdx}
                    className="glass-card rounded-3xl p-5 border-2 border-zinc-800 hover:border-orange-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-black rounded-2xl border border-zinc-800">
                            {getFacilityIcon(facility.type)}
                          </div>
                          <div>
                            <h4 className="font-black text-base sm:text-lg text-white leading-snug">
                              {facility.name}
                            </h4>
                          </div>
                        </div>
                        {getFacilityBadge(facility.type)}
                      </div>

                      {/* Address */}
                      <p className="mt-4 text-sm font-semibold text-zinc-200 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{facility.address}</span>
                      </p>

                      {/* Timing */}
                      <p className="mt-2 text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>वेळ: {facility.timing}</span>
                      </p>
                    </div>

                    {/* Bottom Action Buttons - LARGE TOUCH TARGET */}
                    <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                      {facility.contact ? (
                        <a
                          href={`tel:${facility.contact}`}
                          className="inline-flex items-center space-x-2 text-sm font-black text-emerald-400 hover:underline"
                        >
                          <PhoneCall className="w-4 h-4 text-emerald-400" />
                          <span>{facility.contact}</span>
                        </a>
                      ) : <div />}

                      {/* Maps Navigation Button */}
                      <a
                        href={facility.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-lg transition active:scale-95 border border-orange-400"
                      >
                        <Navigation className="w-4 h-4 text-amber-300" />
                        <span>नकाशा व दिशा (Google Maps)</span>
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
