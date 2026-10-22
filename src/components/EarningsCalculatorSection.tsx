import React, { useState } from 'react';
import { Calculator, ArrowRight, Info } from 'lucide-react';
import { calculateHostEarnings } from '../utils/marketplaceLogic';

interface EarningsCalculatorSectionProps {
  onOpenHostModal: () => void;
}

export const EarningsCalculatorSection: React.FC<EarningsCalculatorSectionProps> = ({
  onOpenHostModal,
}) => {
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(5);
  const [kwhPerSession, setKwhPerSession] = useState<number>(24);
  const [pricePerKwhInr, setPricePerKwhInr] = useState<number>(15);
  const [commissionPercent, setCommissionPercent] = useState<number>(12);

  const breakdown = calculateHostEarnings({
    sessionsPerWeek,
    kwhPerSession,
    pricePerKwhInr,
    commissionPercent,
  });

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="relative z-10 scroll-mt-20 py-16 lg:py-24 border-y border-[#2E5E47] bg-[#173D2C]/95 text-[#F6F3E9]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 7 Columns: Editorial Context + 4 Interactive Sliders & Numeric Inputs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#D8F36A]">
                CHAPTER 05 · SHARE YOUR CHARGER · ILLUSTRATIVE HOST CALCULATOR
              </div>
              <h2
                id="calculator-heading"
                className="font-display font-bold text-white tracking-tight text-balance"
                style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.85rem)' }}
              >
                See what your driveway charger could generate.
              </h2>
              <p className="text-sm sm:text-base text-[#D0DFD7] max-w-[60ch] leading-relaxed">
                Adjust sessions per week, average energy delivered, per-kWh tariff, and an illustrative
                marketplace commission below. All figures update immediately.
              </p>
            </div>

            {/* Interactive Controls Panel */}
            <div className="bg-[#123123] border border-[#2E5E47] rounded p-5 sm:p-7 space-y-6">
              {/* Control 1: Charging sessions per week */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <label
                    htmlFor="calc-sessions-week"
                    className="text-sm font-semibold text-white"
                  >
                    1. Charging sessions per week
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="calc-sessions-week-num"
                      aria-label="Charging sessions per week numeric input"
                      type="number"
                      min={1}
                      max={28}
                      value={sessionsPerWeek}
                      onChange={(e) =>
                        setSessionsPerWeek(Math.min(28, Math.max(0, Number(e.target.value))))
                      }
                      className="w-16 px-2 py-1 text-right font-mono font-bold text-sm text-[#D8F36A] bg-[#173D2C] border border-[#3A6E56] rounded tabular-nums"
                    />
                    <span className="text-xs font-mono text-[#B5C7BD]">/ wk</span>
                  </div>
                </div>
                <input
                  id="calc-sessions-week"
                  type="range"
                  min={1}
                  max={28}
                  step={1}
                  value={sessionsPerWeek}
                  onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                  className="w-full cs-slider"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#9AB5A7] mt-1">
                  <span>1 session/wk (Occasional)</span>
                  <span>7 sessions/wk (1 daily)</span>
                  <span>28 sessions/wk</span>
                </div>
              </div>

              {/* Control 2: Average energy delivered per session (kWh) */}
              <div className="pt-4 border-t border-[#234B38]">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <label
                    htmlFor="calc-kwh-session"
                    className="text-sm font-semibold text-white"
                  >
                    2. Average energy delivered per session (kWh)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="calc-kwh-session-num"
                      aria-label="Average kWh per session numeric input"
                      type="number"
                      min={3}
                      max={80}
                      value={kwhPerSession}
                      onChange={(e) =>
                        setKwhPerSession(Math.min(80, Math.max(1, Number(e.target.value))))
                      }
                      className="w-16 px-2 py-1 text-right font-mono font-bold text-sm text-[#D8F36A] bg-[#173D2C] border border-[#3A6E56] rounded tabular-nums"
                    />
                    <span className="text-xs font-mono text-[#B5C7BD]">kWh</span>
                  </div>
                </div>
                <input
                  id="calc-kwh-session"
                  type="range"
                  min={3}
                  max={80}
                  step={1}
                  value={kwhPerSession}
                  onChange={(e) => setKwhPerSession(Number(e.target.value))}
                  className="w-full cs-slider"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#9AB5A7] mt-1">
                  <span>3 kWh (2-Wheeler)</span>
                  <span>24 kWh (~3.5 hrs on 7.4 kW)</span>
                  <span>80 kWh (Full SUV)</span>
                </div>
              </div>

              {/* Control 3: Price per kWh in INR */}
              <div className="pt-4 border-t border-[#234B38]">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <label
                    htmlFor="calc-price-kwh"
                    className="text-sm font-semibold text-white"
                  >
                    3. Price per kWh in INR (₹)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-[#D8F36A]">₹</span>
                    <input
                      id="calc-price-kwh-num"
                      aria-label="Price per kWh in INR numeric input"
                      type="number"
                      min={6}
                      max={35}
                      value={pricePerKwhInr}
                      onChange={(e) =>
                        setPricePerKwhInr(Math.min(35, Math.max(1, Number(e.target.value))))
                      }
                      className="w-16 px-2 py-1 text-right font-mono font-bold text-sm text-[#D8F36A] bg-[#173D2C] border border-[#3A6E56] rounded tabular-nums"
                    />
                    <span className="text-xs font-mono text-[#B5C7BD]">/ kWh</span>
                  </div>
                </div>
                <input
                  id="calc-price-kwh"
                  type="range"
                  min={6}
                  max={35}
                  step={1}
                  value={pricePerKwhInr}
                  onChange={(e) => setPricePerKwhInr(Number(e.target.value))}
                  className="w-full cs-slider"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#9AB5A7] mt-1">
                  <span>₹6/kWh</span>
                  <span>₹15/kWh (Typical residential host rate)</span>
                  <span>₹35/kWh</span>
                </div>
              </div>

              {/* Control 4: Illustrative platform commission (%) */}
              <div className="pt-4 border-t border-[#234B38]">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <label
                    htmlFor="calc-commission"
                    className="text-sm font-semibold text-white"
                  >
                    4. Illustrative platform commission (%)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="calc-commission-num"
                      aria-label="Illustrative platform commission percentage numeric input"
                      type="number"
                      min={0}
                      max={25}
                      value={commissionPercent}
                      onChange={(e) =>
                        setCommissionPercent(Math.min(25, Math.max(0, Number(e.target.value))))
                      }
                      className="w-16 px-2 py-1 text-right font-mono font-bold text-sm text-[#D8F36A] bg-[#173D2C] border border-[#3A6E56] rounded tabular-nums"
                    />
                    <span className="text-xs font-mono text-[#B5C7BD]">%</span>
                  </div>
                </div>
                <input
                  id="calc-commission"
                  type="range"
                  min={0}
                  max={25}
                  step={1}
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(Number(e.target.value))}
                  className="w-full cs-slider"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#9AB5A7] mt-1">
                  <span>0%</span>
                  <span>12% (Illustrative model parameter)</span>
                  <span>25%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Live Financial Output Card + Formula Transparency + CTA */}
          <div className="lg:col-span-5 bg-[#F6F3E9] text-[#22251F] border border-[#22251F] rounded p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8D5CA]">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#173D2C]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#173D2C] font-semibold">
                  ILLUSTRATIVE ESTIMATE SUMMARY
                </span>
              </div>
              <span className="text-xs font-mono text-[#565A52] tabular-nums">
                {breakdown.weeklyKwhDelivered} kWh / wk
              </span>
            </div>

            {/* Primary Output: Illustrative Monthly Host Proceeds */}
            <div className="bg-[#173D2C] text-[#F6F3E9] p-5 rounded border border-[#22251F]">
              <div className="text-xs font-mono uppercase tracking-wider text-[#D8F36A]">
                Illustrative Monthly Host Proceeds
              </div>
              <div
                data-testid="monthly-host-proceeds"
                className="text-4xl sm:text-5xl font-bold font-mono tabular-nums text-white mt-2"
              >
                ₹{breakdown.monthlyHostProceedsInr.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#C6D6CE] mt-2 font-mono tabular-nums">
                Monthly Gross (₹{breakdown.monthlyGrossInr.toLocaleString('en-IN')}) × (1 − {commissionPercent}% illustrative commission)
              </div>
            </div>

            {/* Exact Formula Rows */}
            <dl className="divide-y divide-[#D8D5CA] text-sm">
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-[#4A4F46]">
                  Weekly gross booking value
                  <span className="block text-[11px] font-mono text-[#6E736A]">
                    {sessionsPerWeek} sessions × {kwhPerSession} kWh × ₹{pricePerKwhInr}
                  </span>
                </dt>
                <dd
                  data-testid="weekly-gross-value"
                  className="font-mono font-bold text-base text-[#22251F] tabular-nums"
                >
                  ₹{breakdown.weeklyGrossInr.toLocaleString('en-IN')}
                </dd>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-[#4A4F46]">
                  Monthly gross booking value
                  <span className="block text-[11px] font-mono text-[#6E736A]">
                    Weekly gross × 52 ÷ 12 weeks/month
                  </span>
                </dt>
                <dd
                  data-testid="monthly-gross-value"
                  className="font-mono font-bold text-base text-[#22251F] tabular-nums"
                >
                  ₹{breakdown.monthlyGrossInr.toLocaleString('en-IN')}
                </dd>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-[#4A4F46]">
                  Illustrative platform commission ({commissionPercent}%)
                  <span className="block text-[11px] font-mono text-[#6E736A]">
                    Configurable marketplace fee simulation
                  </span>
                </dt>
                <dd className="font-mono font-medium text-sm text-[#565A52] tabular-nums">
                  −₹{breakdown.monthlyCommissionInr.toLocaleString('en-IN')}
                </dd>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="font-semibold text-[#173D2C]">
                  Annualized gross proceeds projection
                </dt>
                <dd className="font-mono font-bold text-base text-[#173D2C] tabular-nums">
                  ₹{breakdown.annualHostProceedsInr.toLocaleString('en-IN')} / yr
                </dd>
              </div>
            </dl>

            {/* Mandatory Disclosure Notice */}
            <div className="p-3.5 bg-[#EDE8D8] border border-[#D8D5CA] rounded text-xs text-[#3D423A] space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-[#22251F]">
                <Info className="w-3.5 h-3.5 text-[#173D2C] shrink-0" />
                <span>Important Illustrative Estimate Disclosure</span>
              </div>
              <p>
                Figures shown above are <strong>illustrative estimates only</strong> and do not represent
                guaranteed earnings. Your actual proceeds depend on local driver demand, your state DISCOM
                domestic or EV electricity tariff, applicable taxes, cancellations or refunds, and routine
                equipment maintenance. The commission rate is an adjustable illustration rather than a fixed
                binding policy.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenHostModal}
              className="w-full py-3.5 px-6 text-sm font-semibold text-[#173D2C] bg-[#D8F36A] border border-[#173D2C] rounded hover:bg-[#c9e854] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              List Your Charger
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
