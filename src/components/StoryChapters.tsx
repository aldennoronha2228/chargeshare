import React, { useState } from 'react';
import { ArrowRight, MapPin, CalendarCheck, Zap } from 'lucide-react';
import type { ChargerVisualState } from '../three/ChargerModel';
import type { ChargerListing } from '../data/demoChargers';

interface ChapterConnectSectionProps {
  chargers: ChargerListing[];
  selectedChargerIndex: number;
  onSelectNode: (index: number, charger: ChargerListing) => void;
  onExploreClick: () => void;
}

/**
 * CHAPTER 2 — CONNECT
 * Framed so the central/right 3D viewport remains open, allowing the user to watch
 * the 3D camera pull back into the miniature neighbourhood block with animated electric-lime paths.
 */
export const ChapterConnectSection: React.FC<ChapterConnectSectionProps> = ({
  chargers,
  selectedChargerIndex,
  onSelectNode,
  onExploreClick,
}) => {
  const activeCharger = chargers[selectedChargerIndex] || chargers[0];

  return (
    <section
      id="chapter-connect"
      aria-labelledby="chapter-connect-heading"
      className="relative z-10 min-h-[88vh] flex flex-col justify-between px-4 sm:px-8 pt-16 pb-28 lg:pt-24 lg:pb-32 pointer-events-none"
    >
      <div className="max-w-[1360px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-auto">
        {/* Left 5 Columns: Chapter 02 Editorial Narrative */}
        <div className="lg:col-span-5 bg-[#10281D]/92 border border-[#2E5E47] rounded p-6 sm:p-8 text-[#F6F3E9] space-y-5 pointer-events-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-[#D8F36A]">
            CHAPTER 02 · CONNECT
          </div>

          <h2
            id="chapter-connect-heading"
            className="font-display font-bold text-white tracking-tight leading-[1.06] text-balance"
            style={{ fontSize: 'clamp(1.95rem, 3.2vw, 2.9rem)' }}
          >
            Thousands of private chargers. One connected neighbourhood grid.
          </h2>

          <p className="text-sm sm:text-base text-[#D0DFD7] leading-relaxed">
            As you look across any Indian residential neighbourhood, scores of 3.3 kW and 7.4 kW home
            wallboxes sit idle for up to 20 hours a day. ChargeShare turns individual driveways and
            apartment stilt bays into reservable community infrastructure—without waiting for new
            commercial land or street transformers.
          </p>

          {/* Interactive 3D Neighbourhood Node Selector */}
          <div className="pt-3 border-t border-[#26503B] space-y-2.5">
            <div className="text-[11px] font-mono uppercase text-[#D8F36A]">
              Inspect 3D Neighbourhood Nodes (Click to Highlight in 3D Scene)
            </div>
            <div className="flex flex-wrap gap-2">
              {chargers.slice(0, 5).map((c, idx) => {
                const isSelected = idx === selectedChargerIndex;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectNode(idx, c)}
                    className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#D8F36A] text-[#173D2C] border-[#D8F36A] font-bold'
                        : 'bg-[#173D2C] text-[#E2ECE7] border-[#36654E] hover:border-[#D8F36A]'
                    }`}
                  >
                    0{idx + 1}. {c.locality.split(',')[0]} ({c.powerKw}kW)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Highlighted Node Readout */}
          <div className="p-3.5 bg-[#173D2C] border border-[#36654E] rounded flex items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-bold text-white font-display">{activeCharger.title}</div>
              <div className="text-[#B5C7BD]">
                {activeCharger.locality}, {activeCharger.city} · {activeCharger.connector}
              </div>
            </div>
            <div className="text-right font-mono shrink-0">
              <div className="text-base font-bold text-[#D8F36A]">₹{activeCharger.pricePerKwh}/kWh</div>
              <div className="text-[11px] text-[#C6D6CE]">{activeCharger.distanceKm} km away</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#173D2C] bg-[#D8F36A] rounded hover:bg-[#c9e854] transition-colors cursor-pointer"
          >
            Search All Neighbourhood Chargers
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right 7 Columns left open so the pulled-back 3D Neighbourhood & Animated Lime Lines are visible */}
        <div className="lg:col-span-7 hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
};

interface ChapterBookAndChargeSectionProps {
  chargerState: ChargerVisualState;
  onSelectStepState: (state: ChargerVisualState) => void;
  onExploreChargers: () => void;
}

/**
 * CHAPTER 4 — BOOK AND CHARGE
 * Interactive 3-step sequence synced with the 3D Charger and Driveway scene.
 */
export const ChapterBookAndChargeSection: React.FC<ChapterBookAndChargeSectionProps> = ({
  chargerState,
  onSelectStepState,
  onExploreChargers,
}) => {
  const [activeStep, setActiveStep] = useState<number>(3);

  const steps = [
    {
      num: '01',
      title: 'Find a suitable charger.',
      desc: 'Filter nearby residential driveways and apartment stilt bays by connector type (Type 2 AC, 15A Socket, Bharat AC001, CCS2), power rating, cable length, and per-kWh tariff.',
      state: 'standby' as ChargerVisualState,
      badge: '3D State: Standby · Pin Visible',
      icon: MapPin,
    },
    {
      num: '02',
      title: 'Reserve an available slot.',
      desc: 'Pick a daytime or overnight window that fits your routine. Once the host confirms your slot, the bay is locked for your vehicle and gate entry notes are shared.',
      state: 'reserved' as ChargerVisualState,
      badge: '3D State: Reserved · Bay Locked',
      icon: CalendarCheck,
    },
    {
      num: '03',
      title: 'Arrive and charge.',
      desc: 'Pull into the private driveway, plug in the Type 2 connector, and draw power. You pay for the energy delivered according to the host’s transparent per-kWh rate.',
      state: 'charging' as ChargerVisualState,
      badge: '3D State: Active 7.4 kW Current Flow',
      icon: Zap,
    },
  ];

  const handleStepClick = (stepIndex: number, state: ChargerVisualState) => {
    setActiveStep(stepIndex);
    onSelectStepState(state);
  };

  return (
    <section
      id="how-it-works"
      aria-labelledby="chapter-book-heading"
      className="scroll-mt-20 relative z-10 min-h-[88vh] flex flex-col justify-center px-4 sm:px-8 pt-16 pb-28 lg:pt-24 lg:pb-32 pointer-events-none"
    >
      <div className="max-w-[1360px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 5 Columns: 3-Step Interactive Sequence */}
        <div className="lg:col-span-5 bg-[#F6F3E9] text-[#22251F] border-2 border-[#22251F] rounded p-6 sm:p-7 space-y-5 pointer-events-auto">
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-[#173D2C] font-semibold">
              CHAPTER 04 · BOOK AND CHARGE
            </div>
            <h2
              id="chapter-book-heading"
              className="font-display font-bold text-[#22251F] tracking-tight text-balance"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.65rem)' }}
            >
              From street search to active charge in three steps.
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4F46]">
              Select any step below to inspect the corresponding state on the 3D driveway wallbox.
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((s, idx) => {
              const stepNum = idx + 1;
              const isSelected = activeStep === stepNum;
              const IconComp = s.icon;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => handleStepClick(stepNum, s.state)}
                  className={`w-full text-left p-4 rounded border transition-colors cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[#173D2C] text-[#F6F3E9] border-[#22251F]'
                      : 'bg-white text-[#22251F] border-[#D8D5CA] hover:border-[#22251F]'
                  }`}
                >
                  <span
                    className={`font-mono text-lg font-bold tabular-nums shrink-0 mt-0.5 ${
                      isSelected ? 'text-[#D8F36A]' : 'text-[#173D2C]'
                    }`}
                  >
                    {s.num}.
                  </span>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-base font-bold font-display ${
                          isSelected ? 'text-white' : 'text-[#22251F]'
                        }`}
                      >
                        {s.title}
                      </h3>
                      <IconComp
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#D8F36A]' : 'text-[#173D2C]'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isSelected ? 'text-[#D0DFD7]' : 'text-[#4A4F46]'
                      }`}
                    >
                      {s.desc}
                    </p>
                    <div
                      className={`pt-1 text-[11px] font-mono ${
                        isSelected ? 'text-[#D8F36A]' : 'text-[#173D2C]'
                      }`}
                    >
                      {s.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#D8D5CA] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-mono text-[#4A4F46]">
              Current 3D Wallbox Mode: <strong className="uppercase text-[#173D2C]">{chargerState}</strong>
            </span>
            <button
              type="button"
              onClick={onExploreChargers}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#173D2C] bg-[#D8F36A] border border-[#173D2C] rounded hover:bg-[#c9e854] transition-colors cursor-pointer"
            >
              Find Your Charger
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 7 Columns left open so the zoomed-in 3D Wallbox & EV Charging Port remain unobstructed */}
        <div className="lg:col-span-7 hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
};
