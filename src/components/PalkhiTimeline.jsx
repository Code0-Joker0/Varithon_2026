import React, { useState } from 'react';
import { PALKHI_ROUTES } from '../data/palkhiRoutes';
import { MapPin, Compass } from 'lucide-react';

export default function PalkhiTimeline({ onSelectHalt }) {
  const [selectedRoute, setSelectedRoute] = useState('dnyaneshwar');
  const route = PALKHI_ROUTES[selectedRoute];

  return (
    <div className="bg-zinc-950 rounded-3xl p-6 border-2 border-zinc-800 shadow-2xl space-y-6">
      {/* Timeline Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-orange-950 text-orange-300 border border-orange-600 px-3.5 py-1.5 rounded-full text-xs font-black mb-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>पालखी सोहळा मार्गक्रम नकाशा (Timeline Map)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {route.name}
          </h3>
          <p className="text-sm font-bold text-zinc-400 mt-1">
            एकूण अंतर: {route.totalKm} कि.मी. | {route.origin} ते {route.destination}
          </p>
        </div>

        {/* Route Selector Buttons */}
        <div className="flex items-center space-x-2 bg-black p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setSelectedRoute('dnyaneshwar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              selectedRoute === 'dnyaneshwar'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            माउली पालखी (आळंदी)
          </button>
          <button
            onClick={() => setSelectedRoute('tukaram')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
              selectedRoute === 'tukaram'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            तुकोबाराय पालखी (देहू)
          </button>
        </div>
      </div>

      {/* Horizontal / Scrollable Timeline Step Nodes */}
      <div className="relative overflow-x-auto pb-4 pt-2">
        {/* Connecting Line */}
        <div className="absolute top-11 left-6 right-6 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 z-0 rounded-full" />

        <div className="flex items-start space-x-6 min-w-max px-4 relative z-10">
          {route.halts.map((halt, idx) => {
            const isSevere = halt.warningLevel === 'severe';
            const isWarning = halt.warningLevel === 'warning';

            return (
              <div
                key={halt.id}
                onClick={() => onSelectHalt && onSelectHalt(halt.id)}
                className="flex flex-col items-center cursor-pointer group w-40 text-center"
              >
                {/* Node Dot */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-xl transition-transform group-hover:scale-110 border-2 ${
                    idx === 0 || idx === route.halts.length - 1
                      ? 'bg-red-600 text-white border-amber-300 ring-4 ring-red-950'
                      : isSevere
                      ? 'bg-red-600 text-white border-red-400 ring-4 ring-red-950'
                      : isWarning
                      ? 'bg-amber-500 text-black border-amber-300 ring-4 ring-amber-950'
                      : 'bg-orange-600 text-white border-orange-300 ring-4 ring-orange-950'
                  }`}
                >
                  {idx === 0 ? '🚩' : idx === route.halts.length - 1 ? '🚩' : idx + 1}
                </div>

                {/* Day Badge */}
                <span className="mt-2 text-xs font-black px-2.5 py-0.5 rounded-full bg-black text-amber-400 border border-zinc-800">
                  {halt.day.split('-')[0]}
                </span>

                {/* Station Name */}
                <h4 className="mt-1 font-black text-sm text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {halt.name.split('(')[0]}
                </h4>

                {/* Temp & Warning */}
                <div className="mt-1 text-xs font-black text-orange-400">
                  {halt.temp}°C
                </div>

                {/* Warning Indicator */}
                {isSevere && (
                  <span className="mt-1 text-[10px] font-black text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-600">
                    उष्माघात
                  </span>
                )}
                {isWarning && (
                  <span className="mt-1 text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-600">
                    सतर्कता
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
