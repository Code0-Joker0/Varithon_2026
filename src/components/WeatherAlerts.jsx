import React, { useState } from 'react';
import { PALKHI_ROUTES } from '../data/palkhiRoutes';
import PalkhiTimeline from './PalkhiTimeline';
import { Sun, CloudRain, Cloud, CloudLightning, Wind, Droplets, AlertTriangle, ShieldCheck, MapPin, Search, Info } from 'lucide-react';

export default function WeatherAlerts() {
  const [selectedRouteKey, setSelectedRouteKey] = useState('dnyaneshwar');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const currentRoute = PALKHI_ROUTES[selectedRouteKey];

  const filteredHalts = currentRoute.halts.filter(halt => {
    const matchesSearch = halt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          halt.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || halt.warningLevel === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getWeatherIcon = (type) => {
    switch (type) {
      case 'sunny': return <Sun className="w-10 h-10 text-amber-400 animate-spin-slow" />;
      case 'rainy': return <CloudRain className="w-10 h-10 text-blue-400 animate-bounce" />;
      case 'thunder': return <CloudLightning className="w-10 h-10 text-purple-400 animate-pulse" />;
      case 'cloudy': default: return <Cloud className="w-10 h-10 text-zinc-400" />;
    }
  };

  const getWarningBadge = (level) => {
    switch (level) {
      case 'severe':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-red-950 text-red-200 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-red-500 animate-pulse">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>अतिदक्षतेचा इशारा</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center space-x-1.5 bg-amber-950 text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-amber-500">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>सतर्कतेचा इशारा</span>
          </span>
        );
      case 'safe': default:
        return (
          <span className="inline-flex items-center space-x-1.5 bg-emerald-950 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-emerald-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>हवामान अनुकूल</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Route Switcher & Large Header */}
      <div className="bg-zinc-950 rounded-3xl p-6 text-white border-2 border-orange-600 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-orange-950 text-orange-300 border border-orange-600 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black mb-3">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>विभाग १: हवामान अंदाज व पालखी मार्ग इशारे</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wide">
            पालखी मुक्काम ठिकाणांचे हवामान
          </h2>
          <p className="text-base text-zinc-300 mt-2 font-medium">
            आळंदी व देहू ते पंढरपूर मार्गावरील सर्व मुक्कामाच्या ठिकाणांचे हवामान, तापमान व तातडीचे प्रशासकीय इशारे.
          </p>

          {/* Route Toggle Tabs */}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedRouteKey('dnyaneshwar')}
              className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-black transition-all shadow-lg border-2 ${
                selectedRouteKey === 'dnyaneshwar'
                  ? 'bg-orange-600 text-white border-amber-300 scale-105'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-orange-500'
              }`}
            >
              🚩 संत ज्ञानेश्वर महाराज पालखी (आळंदी)
            </button>
            <button
              onClick={() => setSelectedRouteKey('tukaram')}
              className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-black transition-all shadow-lg border-2 ${
                selectedRouteKey === 'tukaram'
                  ? 'bg-orange-600 text-white border-amber-300 scale-105'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-orange-500'
              }`}
            >
              🚩 संत तुकाराम महाराज पालखी (देहू)
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Palkhi Route Visual Timeline Component */}
      <PalkhiTimeline onSelectHalt={(haltId) => setSearchQuery(haltId)} />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900 p-4 rounded-2xl border-2 border-zinc-800 shadow-md">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="मुक्काम किंवा जिल्हा शोधा..."
            className="w-full pl-10 pr-4 py-3 text-sm sm:text-base font-bold bg-black text-white rounded-xl border-2 border-zinc-700 outline-none focus:border-orange-500"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-sm font-black text-zinc-400 whitespace-nowrap">इशारे:</span>
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition border-2 ${
              filterSeverity === 'all'
                ? 'bg-orange-600 text-white border-orange-400'
                : 'bg-black text-zinc-300 border-zinc-800'
            }`}
          >
            सर्व
          </button>
          <button
            onClick={() => setFilterSeverity('severe')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition border-2 ${
              filterSeverity === 'severe'
                ? 'bg-red-600 text-white border-red-400'
                : 'bg-red-950/60 text-red-300 border-red-900'
            }`}
          >
            अतिदक्षता
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition border-2 ${
              filterSeverity === 'warning'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-amber-950/60 text-amber-300 border-amber-900'
            }`}
          >
            सतर्कता
          </button>
        </div>
      </div>

      {/* Halt Station Weather Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHalts.map((halt) => (
          <div
            key={halt.id}
            className="glass-card rounded-3xl p-6 border-2 border-zinc-800 hover:border-orange-500 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-amber-400 bg-zinc-900 px-3 py-1 rounded-xl border border-zinc-700">
                  {halt.day}
                </span>
                {getWarningBadge(halt.warningLevel)}
              </div>

              {/* Station Title */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    {halt.name}
                  </h3>
                  <p className="text-sm font-bold text-zinc-400 mt-0.5">
                    जिल्हा: {halt.district}
                  </p>
                </div>
                <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
                  {getWeatherIcon(halt.weatherType)}
                </div>
              </div>

              {/* Temperature & Stats Grid - EXTRA LARGE NUMBERS */}
              <div className="mt-5 bg-black p-4 rounded-2xl grid grid-cols-3 gap-2 text-center border-2 border-zinc-800">
                <div>
                  <span className="block text-xs font-bold text-zinc-400">तापमान</span>
                  <span className="text-2xl sm:text-3xl font-black text-orange-400">
                    {halt.temp}°C
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-400">आर्द्रता</span>
                  <span className="text-lg sm:text-xl font-black text-white">
                    {halt.humidity}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-400">पाऊस</span>
                  <span className="text-lg sm:text-xl font-black text-blue-400">
                    {halt.rainChance}
                  </span>
                </div>
              </div>

              {/* Weather Condition Text */}
              <p className="mt-4 text-sm font-extrabold text-amber-300 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block animate-pulse" />
                वातावरण: {halt.condition}
              </p>

              {/* Warning Alert Box */}
              {halt.warningMessage && (
                <div className={`mt-4 p-4 rounded-2xl text-xs sm:text-sm font-bold ${
                  halt.warningLevel === 'severe'
                    ? 'bg-red-950 text-red-200 border-2 border-red-600'
                    : 'bg-amber-950 text-amber-200 border-2 border-amber-600'
                }`}>
                  <div className="font-black text-sm flex items-center gap-1.5 mb-1 text-white">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    इशारा:
                  </div>
                  {halt.warningMessage}
                </div>
              )}
            </div>

            {/* Imp Note Footer */}
            <div className="mt-5 pt-3 border-t border-zinc-800 text-xs sm:text-sm font-semibold text-zinc-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>{halt.impNote}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
