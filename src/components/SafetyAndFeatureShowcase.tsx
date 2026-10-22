import React, { useState } from 'react';
import { ShieldAlert, PlugZap, FileText, MessageSquareWarning, Clock, CheckCircle2 } from 'lucide-react';

export const SafetyAndFeatureShowcase: React.FC = () => {
  const [selectedLedgerFilter, setSelectedLedgerFilter] = useState<'all' | 'completed' | 'upcoming'>('all');

  const sampleLedger = [
    {
      id: 'SES-804',
      date: '20 Oct 2026',
      location: '12th Main Bungalow Driveway, Indiranagar',
      connector: 'Type 2 AC · 7.4 kW',
      energyKwh: 26.4,
      rateInr: 14,
      totalInr: 370,
      status: 'completed' as const,
    },
    {
      id: 'SES-819',
      date: '22 Oct 2026',
      location: 'Palm Grove Stilt Bay #B04, Koramangala',
      connector: 'Type 2 AC · 11.0 kW',
      energyKwh: 31.0,
      rateInr: 16,
      totalInr: 496,
      status: 'upcoming' as const,
    },
    {
      id: 'SES-792',
      date: '15 Oct 2026',
      location: 'Jayanagar 4th Block Carport',
      connector: '15A Socket · 3.3 kW',
      energyKwh: 14.5,
      rateInr: 12,
      totalInr: 174,
      status: 'completed' as const,
    },
  ];

  const visibleLedger = sampleLedger.filter(
    (item) => selectedLedgerFilter === 'all' || item.status === selectedLedgerFilter
  );

  return (
    <>
      {/* H. Safety and Trust Section */}
      <section
        id="safety"
        aria-labelledby="safety-heading"
        className="relative z-10 scroll-mt-20 py-16 lg:py-24 border-b border-[#D8D5CA] bg-[#F6F3E9]"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          {/* Top Editorial Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#D8D5CA]">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#173D2C]">
                CHAPTER 06 · TRUST AND SAFETY
              </div>
              <h2
                id="safety-heading"
                className="font-display font-bold text-[#22251F] tracking-tight text-balance"
                style={{ fontSize: 'clamp(1.85rem, 3vw, 2.75rem)' }}
              >
                Practical ground rules for electrical and driveway trust.
              </h2>
            </div>
            <div className="lg:col-span-7 flex flex-col justify-end">
              <p className="text-base text-[#3D423A] leading-relaxed">
                Sharing a private EV charger involves high-load electrical equipment and access to residential
                property. ChargeShare structures every listing around transparent technical specifications,
                explicit driveway rules, and mutual accountability between neighbours.
              </p>
            </div>
          </div>

          {/* 6-Part Editorial Ledger Matrix (Dividers & Typography, Not Identical Floating Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:gap-px bg-[#D8D5CA] border-b border-[#D8D5CA]">
            <div className="bg-[#F6F3E9] p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#173D2C]">
                <span>01 / ELECTRICAL READINESS</span>
                <PlugZap className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#22251F]">
                Safe installation & load assessment
              </h3>
              <p className="text-sm text-[#4A4F46] leading-relaxed">
                Hosts are responsible for ensuring their wallbox or 15A industrial socket runs on an
                appropriately rated circuit with dedicated MCB/RCCB protection, proper earthing, and
                sanctioned DISCOM load. Equipment and wiring must be inspected by a qualified electrician.
              </p>
            </div>

            <div className="bg-[#F6F3E9] p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#173D2C]">
                <span>02 / CONNECTOR CLARITY</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#22251F]">
                Exact connector & cable specs
              </h3>
              <p className="text-sm text-[#4A4F46] leading-relaxed">
                Every listing specifies its exact connector standard (Type 2 AC, Bharat AC001, 15A 3-Pin, or
                CCS2 DC), maximum continuous kW output, tethered cable length in meters, and vehicle bay
                clearance before a driver requests a slot.
              </p>
            </div>

            <div className="bg-[#F6F3E9] p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#173D2C]">
                <span>03 / PROPERTY ACCESS</span>
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#22251F]">
                Operating hours & gate protocol
              </h3>
              <p className="text-sm text-[#4A4F46] leading-relaxed">
                Hosts define exact entry windows, security guard check-in instructions, and whether a first-time
                neighbour meet-up is required. Drivers only receive gate access details after a reservation
                window is confirmed.
              </p>
            </div>

            <div className="bg-[#F6F3E9] p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#173D2C]">
                <span>04 / TRANSPARENT PRICING</span>
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#22251F]">
                Upfront tariffs & cancellation rules
              </h3>
              <p className="text-sm text-[#4A4F46] leading-relaxed">
                Per-kWh rates and estimated session totals are shown prior to booking. Both drivers and hosts
                follow clear slot cancellation windows so driveways are never blocked unexpectedly.
              </p>
            </div>

            <div className="bg-[#F6F3E9] p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#173D2C]">
                <span>05 / ACCOUNTABILITY</span>
                <MessageSquareWarning className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#22251F]">
                Session ratings & issue reporting
              </h3>
              <p className="text-sm text-[#4A4F46] leading-relaxed">
                After a session, drivers and hosts rate punctuality, cable care, and bay accuracy. Listings or
                accounts reported for unsafe wiring, inaccurate specs, or missed slots can be flagged for
                marketplace review.
              </p>
            </div>

            <div className="bg-[#EDE8D8] p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#22251F]">
                <span>06 / MVP SCOPE NOTICE</span>
                <ShieldAlert className="w-4 h-4 text-[#173D2C]" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#22251F]">
                What you should verify independently
              </h3>
              <p className="text-sm text-[#3D423A] leading-relaxed">
                This preview demonstrates peer-to-peer discovery and scheduling. ChargeShare does not provide
                third-party property insurance or physical on-site electrical certification in this MVP;
                hosts and drivers must verify site suitability and Society/RWA permissions directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* I. Designed Feature Showcase — Varied Editorial Composition */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="relative z-10 py-16 lg:py-24 border-b border-[#D8D5CA] bg-white"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-[#173D2C] mb-2">
              07. DESIGNED FOR REAL WORLD USAGE
            </div>
            <h2
              id="features-heading"
              className="font-display font-bold text-[#22251F] tracking-tight text-balance"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.75rem)' }}
            >
              Everything needed to coordinate neighbourhood charging—without enterprise bloat.
            </h2>
          </div>

          {/* Asymmetric Bento / Editorial Showcase (8 Cols + 4 Cols, then 5 Cols + 7 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Showcase Block 1 (7 Cols): Interactive Booking History & Energy Ledger Preview */}
            <div className="lg:col-span-7 bg-[#F6F3E9] border border-[#22251F] rounded p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-[#173D2C] font-semibold">
                    TRANSPARENT SESSION LEDGER
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#22251F] mt-1">
                    Booking history & per-kWh session receipts
                  </h3>
                </div>

                {/* Interactive Filter Buttons for the Ledger Preview */}
                <div className="inline-flex p-1 bg-white border border-[#D8D5CA] rounded self-start">
                  {(['all', 'completed', 'upcoming'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSelectedLedgerFilter(tab)}
                      className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors cursor-pointer ${
                        selectedLedgerFilter === tab
                          ? 'bg-[#173D2C] text-[#D8F36A]'
                          : 'text-[#565A52] hover:text-[#22251F]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#D8D5CA] rounded overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#D8D5CA] bg-[#EDE8D8] font-mono text-[11px] uppercase text-[#4A4F46]">
                      <th className="py-2.5 px-3.5">Session</th>
                      <th className="py-2.5 px-3.5">Driveway Location</th>
                      <th className="py-2.5 px-3.5">Energy</th>
                      <th className="py-2.5 px-3.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE9DF]">
                    {visibleLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-[#F6F3E9]">
                        <td className="py-3 px-3.5 font-mono tabular-nums">
                          <span className="font-semibold text-[#22251F] block">{row.id}</span>
                          <span className="text-[#6E736A]">{row.date}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="font-semibold text-[#22251F] block">{row.location}</span>
                          <span className="text-[#565A52] font-mono">{row.connector}</span>
                        </td>
                        <td className="py-3 px-3.5 font-mono tabular-nums text-[#22251F]">
                          {row.energyKwh.toFixed(1)} kWh @ ₹{row.rateInr}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono tabular-nums font-bold text-[#173D2C]">
                          ₹{row.totalInr}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[#565A52]">
                Both drivers and hosts see a clear record of reserved time slots, agreed per-kWh rates, and
                session status across one-off and recurring weekly bookings.
              </p>
            </div>

            {/* Showcase Block 2 (5 Cols): Connector & Hardware Compatibility Matrix */}
            <div className="lg:col-span-5 bg-[#173D2C] text-[#F6F3E9] border border-[#22251F] rounded p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-[#D8F36A]">
                  INDIAN EV HARDWARE STANDARDS
                </span>
                <h3 className="text-xl font-bold font-display text-white mt-1">
                  From 3.3 kW scooter sockets to 22 kW three-phase wallboxes.
                </h3>
                <p className="text-xs text-[#C6D6CE] mt-2 leading-relaxed">
                  Filter accurately so you never arrive at a driveway with an incompatible plug.
                </p>
              </div>

              <div className="divide-y divide-[#2B5641] border-t border-b border-[#2B5641] text-xs">
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-white font-display">Type 2 AC (IEC 62196)</div>
                    <div className="text-[#B5C7BD]">Tata Nexon/Curvv, MG ZS/Windsor, BYD, Hyundai</div>
                  </div>
                  <span className="font-mono text-[#D8F36A] shrink-0">7.4 – 22 kW</span>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-white font-display">15A / 16A 3-Pin Industrial Box</div>
                    <div className="text-[#B5C7BD]">Ather, Ola, Chetak, Tiago EV, MG Comet portable</div>
                  </div>
                  <span className="font-mono text-[#D8F36A] shrink-0">3.3 kW</span>
                </div>
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-white font-display">Bharat AC001 / CCS2</div>
                    <div className="text-[#B5C7BD]">Society common bays & high-load residential units</div>
                  </div>
                  <span className="font-mono text-[#D8F36A] shrink-0">3.3 – 22 kW</span>
                </div>
              </div>

              <div className="text-xs text-[#D0DFD7] font-mono">
                Every listing displays tethered cable length (4.0m – 6.5m) or Bring-Your-Own-Cable status.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
