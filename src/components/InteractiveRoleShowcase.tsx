import React, { useState } from 'react';
import { Check, X, Zap, Calendar, Sliders, ArrowUpRight } from 'lucide-react';
import type { ChargerListing, HostBookingRequest } from '../data/demoChargers';
import { INITIAL_HOST_REQUESTS } from '../data/demoChargers';

interface InteractiveRoleShowcaseProps {
  chargers: ChargerListing[];
  onJumpToCharger: (charger: ChargerListing) => void;
  onOpenHostModal: () => void;
}

const EV_PROFILES = [
  { name: 'Tata Nexon EV (40.5 kWh)', capacityKwh: 40.5, maxAcKw: 7.2 },
  { name: 'MG ZS EV (50.3 kWh)', capacityKwh: 50.3, maxAcKw: 7.4 },
  { name: 'BYD Atto 3 (60.5 kWh)', capacityKwh: 60.5, maxAcKw: 7.4 },
  { name: 'Tata Tiago EV (24.0 kWh)', capacityKwh: 24.0, maxAcKw: 3.3 },
  { name: 'Ather 450X (3.7 kWh 2W)', capacityKwh: 3.7, maxAcKw: 3.3 },
];

export const InteractiveRoleShowcase: React.FC<InteractiveRoleShowcaseProps> = ({
  chargers,
  onJumpToCharger,
  onOpenHostModal,
}) => {
  const [activeMode, setActiveMode] = useState<'driver' | 'host'>('driver');

  // Driver interactive state
  const [selectedEvIndex, setSelectedEvIndex] = useState(0);
  const [targetKwhNeed, setTargetKwhNeed] = useState(24);

  // Host interactive state
  const [hostRequests, setHostRequests] = useState<HostBookingRequest[]>(INITIAL_HOST_REQUESTS);
  const [hostTariffInr, setHostTariffInr] = useState(15);
  const [weekdayDaytimeOpen, setWeekdayDaytimeOpen] = useState(true);
  const [overnightOpen, setOvernightOpen] = useState(true);
  const [requireFirstTimeApproval, setRequireFirstTimeApproval] = useState(true);

  const selectedEv = EV_PROFILES[selectedEvIndex] || EV_PROFILES[0];

  const handleRequestStatus = (id: string, newStatus: 'approved' | 'declined') => {
    setHostRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const approvedProceedsTotal = hostRequests
    .filter((r) => r.status === 'approved')
    .reduce((acc, r) => acc + r.estimatedProceedsInr, 0);

  return (
    <section
      id="marketplace-in-action"
      aria-labelledby="role-showcase-heading"
      className="relative z-10 py-16 lg:py-24 border-b border-[#D8D5CA] bg-[#EDE8D8]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Header + Segmented Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#173D2C] mb-2">
              DUAL PERSPECTIVES · DRIVER &amp; HOST WORKSPACE
            </div>
            <h2
              id="role-showcase-heading"
              className="font-display font-bold text-[#22251F] tracking-tight text-balance"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.75rem)' }}
            >
              Experience both perspectives of the network.
            </h2>
          </div>

          {/* Functional Segmented Control */}
          <div
            role="tablist"
            aria-label="Switch between Driver and Host views"
            className="inline-flex p-1 bg-[#F6F3E9] border border-[#22251F] rounded self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === 'driver'}
              onClick={() => setActiveMode('driver')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeMode === 'driver'
                  ? 'bg-[#173D2C] text-[#D8F36A]'
                  : 'text-[#22251F] hover:bg-[#E4DFCE]'
              }`}
            >
              Find a charger
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeMode === 'host'}
              onClick={() => setActiveMode('host')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeMode === 'host'
                  ? 'bg-[#173D2C] text-[#D8F36A]'
                  : 'text-[#22251F] hover:bg-[#E4DFCE]'
              }`}
            >
              Host a charger
            </button>
          </div>
        </div>

        {/* Mode Content Panel */}
        {activeMode === 'driver' ? (
          <div className="bg-white border border-[#22251F] rounded p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 5 Cols: Driver Session Planner */}
              <div className="lg:col-span-5 space-y-5 bg-[#F6F3E9] border border-[#D8D5CA] rounded p-5">
                <div>
                  <span className="text-xs font-mono uppercase text-[#173D2C] font-semibold">
                    DRIVER SESSION PLANNER
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#22251F] mt-1">
                    Compare active charging time & cost before you book.
                  </h3>
                  <p className="text-xs text-[#565A52] mt-1">
                    Select your EV and required energy top-up to see exact charging duration and total cost
                    across sample residential hosts.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="driver-ev-select"
                    className="block text-xs font-medium text-[#22251F] mb-1.5"
                  >
                    1. Select Your Electric Vehicle
                  </label>
                  <select
                    id="driver-ev-select"
                    value={selectedEvIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      setSelectedEvIndex(idx);
                      const profile = EV_PROFILES[idx];
                      if (profile && profile.capacityKwh < targetKwhNeed) {
                        setTargetKwhNeed(Math.max(3, Math.round(profile.capacityKwh * 0.8)));
                      }
                    }}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
                  >
                    {EV_PROFILES.map((ev, i) => (
                      <option key={ev.name} value={i}>
                        {ev.name} (Max AC intake: {ev.maxAcKw} kW)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label htmlFor="driver-kwh-range" className="font-medium text-[#22251F]">
                      2. Energy Top-Up Needed
                    </label>
                    <span className="font-mono font-bold text-[#173D2C] tabular-nums">
                      {targetKwhNeed} kWh (~{Math.round((targetKwhNeed / selectedEv.capacityKwh) * 100)}% battery)
                    </span>
                  </div>
                  <input
                    id="driver-kwh-range"
                    type="range"
                    min={3}
                    max={Math.ceil(selectedEv.capacityKwh)}
                    value={targetKwhNeed}
                    onChange={(e) => setTargetKwhNeed(Number(e.target.value))}
                    className="w-full accent-[#173D2C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#6E736A] mt-1">
                    <span>3 kWh</span>
                    <span>{Math.ceil(selectedEv.capacityKwh)} kWh capacity</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-[#D8D5CA] rounded text-xs space-y-1.5">
                  <div className="font-semibold text-[#22251F]">
                    Parked Window vs. Active Draw Principle
                  </div>
                  <p className="text-[#4A4F46] leading-relaxed">
                    Even if you reserve an overnight driveway slot from 21:00 to 07:00, your session cost is
                    calculated on the <strong>{targetKwhNeed} kWh</strong> delivered—never an hourly parking fine.
                  </p>
                </div>
              </div>

              {/* Right 7 Cols: Live Matching Chargers Comparison Table */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono uppercase tracking-wider text-[#22251F] font-semibold">
                    Matching Neighbourhood Chargers for {targetKwhNeed} kWh Top-Up
                  </h4>
                  <span className="text-xs text-[#565A52] font-mono">DEMO COMPARISON</span>
                </div>

                <div className="divide-y divide-[#D8D5CA] border border-[#D8D5CA] rounded overflow-hidden">
                  {chargers.slice(0, 4).map((charger) => {
                    const effectiveKw = Math.min(charger.powerKw, selectedEv.maxAcKw);
                    const estHours = (targetKwhNeed / effectiveKw).toFixed(1);
                    const totalCostInr = Math.round(targetKwhNeed * charger.pricePerKwh);

                    return (
                      <div
                        key={charger.id}
                        className="p-4 bg-white hover:bg-[#F6F3E9] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-[#565A52]">
                            <span className="font-medium text-[#173D2C]">{charger.city}</span>
                            <span aria-hidden="true">·</span>
                            <span>{charger.locality}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{charger.connector}</span>
                          </div>
                          <div className="text-base font-bold font-display text-[#22251F]">
                            {charger.title}
                          </div>
                          <div className="text-xs text-[#565A52] font-mono tabular-nums">
                            Est. active draw: ~{estHours} hrs at {effectiveKw.toFixed(1)} kW ·{' '}
                            {charger.availabilityLabel}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                          <div className="text-right">
                            <span className="text-lg font-bold font-mono tabular-nums text-[#173D2C]">
                              ₹{totalCostInr.toLocaleString('en-IN')}
                            </span>
                            <span className="block text-[11px] font-mono text-[#565A52]">
                              (₹{charger.pricePerKwh}/kWh)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onJumpToCharger(charger)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#173D2C] bg-[#D8F36A] border border-[#173D2C] rounded hover:bg-[#c9e854] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Select & Reserve
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Host View: Interactive Listing & Request Management Console */
          <div className="bg-[#173D2C] text-[#F6F3E9] border border-[#22251F] rounded p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left 5 Cols: Host Availability & Tariff Controls */}
              <div className="lg:col-span-5 bg-[#123123] border border-[#2E5E47] rounded p-5 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#D8F36A]">
                      HOST CONTROL DESK (DEMO)
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mt-1">
                      12th Main Bungalow Wallbox
                    </h3>
                    <p className="text-xs text-[#B5C7BD]">
                      Exicom 7.4 kW Type 2 AC · Indiranagar, Bengaluru
                    </p>
                  </div>
                  <Sliders className="w-5 h-5 text-[#D8F36A] shrink-0" />
                </div>

                {/* Per-kWh Tariff Control */}
                <div className="pt-3 border-t border-[#26503C]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <label htmlFor="host-demo-tariff" className="text-[#E2ECE7] font-medium">
                      Your Listed Energy Tariff
                    </label>
                    <span className="text-base font-bold font-mono tabular-nums text-[#D8F36A]">
                      ₹{hostTariffInr}/kWh
                    </span>
                  </div>
                  <input
                    id="host-demo-tariff"
                    type="range"
                    min={10}
                    max={24}
                    value={hostTariffInr}
                    onChange={(e) => setHostTariffInr(Number(e.target.value))}
                    className="w-full cs-slider"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#9AB5A7] mt-1">
                    <span>₹10/kWh</span>
                    <span>Suggested local band: ₹13–₹17/kWh</span>
                    <span>₹24/kWh</span>
                  </div>
                </div>

                {/* Operating Schedule Toggles */}
                <div className="pt-3 border-t border-[#26503C] space-y-3 text-xs">
                  <div className="font-mono uppercase text-[#D8F36A] text-[11px]">
                    Active Sharing Windows
                  </div>

                  <label className="flex items-center justify-between p-2.5 rounded bg-[#173D2C] border border-[#2E5E47] cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">
                        Weekday Daytime (09:00 – 18:00)
                      </span>
                      <span className="text-[#B5C7BD] text-[11px]">
                        While your own car is away at office
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={weekdayDaytimeOpen}
                      onChange={(e) => setWeekdayDaytimeOpen(e.target.checked)}
                      className="w-4 h-4 accent-[#D8F36A]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded bg-[#173D2C] border border-[#2E5E47] cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">
                        Overnight Bay (21:30 – 07:00)
                      </span>
                      <span className="text-[#B5C7BD] text-[11px]">
                        Open on Tue, Thu & Sun nights
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={overnightOpen}
                      onChange={(e) => setOvernightOpen(e.target.checked)}
                      className="w-4 h-4 accent-[#D8F36A]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded bg-[#173D2C] border border-[#2E5E47] cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">
                        Require Manual Host Approval
                      </span>
                      <span className="text-[#B5C7BD] text-[11px]">
                        Review every neighbour request before confirming gate code
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={requireFirstTimeApproval}
                      onChange={(e) => setRequireFirstTimeApproval(e.target.checked)}
                      className="w-4 h-4 accent-[#D8F36A]"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={onOpenHostModal}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#173D2C] bg-[#D8F36A] rounded hover:bg-[#c9e854] transition-colors cursor-pointer"
                >
                  List Your Own Charger
                </button>
              </div>

              {/* Right 7 Cols: Incoming Neighbour Reservation Queue */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#2E5E47]">
                  <div>
                    <h4 className="text-base font-bold font-display text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#D8F36A]" />
                      Neighbour Booking Requests & Upcoming Slots
                    </h4>
                    <p className="text-xs text-[#B5C7BD] mt-0.5">
                      Approve or decline sample requests below to see how host proceeds update.
                    </p>
                  </div>
                  <div className="bg-[#123123] border border-[#2E5E47] px-3.5 py-2 rounded text-right">
                    <span className="block text-[10px] font-mono uppercase text-[#B5C7BD]">
                      APPROVED QUEUE PROCEEDS
                    </span>
                    <span className="text-lg font-bold font-mono tabular-nums text-[#D8F36A]">
                      ₹{approvedProceedsTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {hostRequests.map((req) => {
                    const dynamicProceeds = Math.round(req.batteryNeedKwh * hostTariffInr * 0.88);
                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded bg-[#123123] border border-[#2E5E47] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-white">{req.driverName}</span>
                            <span aria-hidden="true" className="text-[#688B7A]">·</span>
                            <span className="text-[#D0DFD7]">{req.vehicleModel}</span>
                          </div>
                          <div className="text-xs font-mono text-[#D8F36A]">
                            {req.requestedWindow} · ~{req.batteryNeedKwh} kWh requested
                          </div>
                          {req.recurringLabel && (
                            <div className="text-[11px] text-[#B5C7BD]">{req.recurringLabel}</div>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <div className="text-right mr-2">
                            <div className="text-sm font-bold font-mono tabular-nums text-white">
                              Est. ₹{dynamicProceeds}
                            </div>
                            <div className="text-[10px] font-mono uppercase text-[#A8C0B4]">
                              {req.status === 'approved'
                                ? 'Approved'
                                : req.status === 'declined'
                                ? 'Declined'
                                : 'Awaiting Host'}
                            </div>
                          </div>

                          {req.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRequestStatus(req.id, 'approved')}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#173D2C] bg-[#D8F36A] rounded hover:bg-[#c9e854] transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Approve Request
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRequestStatus(req.id, 'declined')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#E2ECE7] bg-transparent border border-[#3E6E57] rounded hover:bg-[#1E4633] transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                Decline
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setHostRequests((prev) =>
                                  prev.map((r) =>
                                    r.id === req.id ? { ...r, status: 'pending' } : r
                                  )
                                )
                              }
                              className="px-2.5 py-1 text-[11px] font-mono text-[#B5C7BD] underline underline-offset-4 hover:text-white cursor-pointer"
                            >
                              Change ({req.status})
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
