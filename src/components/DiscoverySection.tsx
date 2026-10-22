import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  RotateCcw,
  Navigation,
  Info,
} from 'lucide-react';
import type { ChargerListing, ConnectorType, IndianCity } from '../data/demoChargers';
import {
  filterChargers,
  validateReservationForm,
  type ChargerFilterCriteria,
} from '../utils/marketplaceLogic';
import { ChargerThumbPlate } from './EditorialIllustrations';

export interface ConfirmedDemoBooking {
  bookingId: string;
  chargerId: string;
  chargerTitle: string;
  locality: string;
  city: string;
  slotWindow: string;
  driverName: string;
  vehicleModel: string;
  estimatedKwh: number;
  estimatedTotalInr: number;
}

interface DiscoverySectionProps {
  chargers: ChargerListing[];
  selectedCharger: ChargerListing;
  onSelectCharger: (charger: ChargerListing) => void;
  filterCriteria: ChargerFilterCriteria;
  onUpdateFilter: (updater: (prev: ChargerFilterCriteria) => ChargerFilterCriteria) => void;
  onResetFilters: () => void;
  onConfirmDemoBooking: (booking: ConfirmedDemoBooking) => void;
  confirmedBookings: ConfirmedDemoBooking[];
}

const CITIES: IndianCity[] = [
  'All Cities',
  'Bengaluru',
  'Pune',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
];

const CONNECTORS: (ConnectorType | 'All Connectors')[] = [
  'All Connectors',
  'Type 2 AC',
  'Bharat AC001',
  '15A 3-Pin Socket',
  'CCS2 DC',
];

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  chargers,
  selectedCharger,
  onSelectCharger,
  filterCriteria,
  onUpdateFilter,
  onResetFilters,
  onConfirmDemoBooking,
  confirmedBookings,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    selectedCharger.slots.find((s) => s.available)?.id || selectedCharger.slots[0]?.id || ''
  );
  const [driverName, setDriverName] = useState('');
  const [vehicleModel, setVehicleModel] = useState('Tata Nexon EV');
  const [contactPhone, setContactPhone] = useState('');
  const [estimatedKwh, setEstimatedKwh] = useState<number>(24);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingSuccessBanner, setBookingSuccessBanner] = useState<ConfirmedDemoBooking | null>(null);
  const [mapZoomed, setMapZoomed] = useState(false);

  const filteredList = filterChargers(chargers, filterCriteria);

  // Sync slot when charger changes
  const activeCharger =
    filteredList.find((c) => c.id === selectedCharger.id) ||
    filteredList[0] ||
    selectedCharger;

  const handleChargerClick = (charger: ChargerListing) => {
    onSelectCharger(charger);
    const firstOpen = charger.slots.find((s) => s.available)?.id || charger.slots[0]?.id || '';
    setSelectedSlotId(firstOpen);
    setFormErrors({});
    setBookingSuccessBanner(null);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateReservationForm({
      driverName,
      vehicleModel,
      contactPhone,
      slotId: selectedSlotId,
      estimatedKwh,
    });

    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    const chosenSlot =
      activeCharger.slots.find((s) => s.id === selectedSlotId) || activeCharger.slots[0];

    const newBooking: ConfirmedDemoBooking = {
      bookingId: `CS-${Math.floor(1000 + Math.random() * 9000)}`,
      chargerId: activeCharger.id,
      chargerTitle: activeCharger.title,
      locality: activeCharger.locality,
      city: activeCharger.city,
      slotWindow: chosenSlot ? `${chosenSlot.label} (${chosenSlot.window})` : 'Standard Slot',
      driverName: driverName.trim(),
      vehicleModel: vehicleModel.trim(),
      estimatedKwh,
      estimatedTotalInr: Math.round(estimatedKwh * activeCharger.pricePerKwh),
    };

    setFormErrors({});
    setBookingSuccessBanner(newBooking);
    onConfirmDemoBooking(newBooking);
  };

  const hasMapApiKey = Boolean(import.meta.env.VITE_MAP_TILES_API_KEY);

  return (
    <section
      id="discover"
      aria-labelledby="discover-heading"
      className="relative z-10 scroll-mt-20 py-16 lg:py-24 border-y border-[#D8D5CA] bg-[#F6F3E9]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#173D2C] mb-2">
              CHAPTER 03 · FIND YOUR CHARGER (DEMO MARKETPLACE)
            </div>
            <h2
              id="discover-heading"
              className="font-display font-bold text-[#22251F] tracking-tight text-balance"
              style={{ fontSize: 'clamp(1.85rem, 3vw, 2.75rem)' }}
            >
              Explore reservable private chargers across Indian neighbourhoods.
            </h2>
          </div>
          <p className="text-sm text-[#4A4F46] max-w-[52ch]">
            Filter sample residential driveways and apartment stilt bays by connector type, power output,
            and per-kWh tariff. Click any pin or listing to inspect access notes and test a slot reservation.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white border border-[#22251F] rounded p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-4">
              <label
                htmlFor="discovery-search-input"
                className="block text-xs font-mono uppercase text-[#565A52] mb-1.5"
              >
                City, Locality, or EV Model
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#565A52] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="discovery-search-input"
                  type="text"
                  value={filterCriteria.searchQuery}
                  onChange={(e) =>
                    onUpdateFilter((prev) => ({ ...prev, searchQuery: e.target.value }))
                  }
                  placeholder="e.g., Indiranagar, Koregaon Park, Nexon..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
                />
              </div>
            </div>

            {/* City Select */}
            <div className="md:col-span-2">
              <label
                htmlFor="discovery-city-select"
                className="block text-xs font-mono uppercase text-[#565A52] mb-1.5"
              >
                City
              </label>
              <select
                id="discovery-city-select"
                value={filterCriteria.city}
                onChange={(e) =>
                  onUpdateFilter((prev) => ({
                    ...prev,
                    city: e.target.value as IndianCity,
                  }))
                }
                className="w-full px-3 py-2 text-sm bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Connector Select */}
            <div className="md:col-span-2">
              <label
                htmlFor="discovery-connector-select"
                className="block text-xs font-mono uppercase text-[#565A52] mb-1.5"
              >
                Connector Type
              </label>
              <select
                id="discovery-connector-select"
                value={filterCriteria.connector}
                onChange={(e) =>
                  onUpdateFilter((prev) => ({
                    ...prev,
                    connector: e.target.value as ConnectorType | 'All Connectors',
                  }))
                }
                className="w-full px-3 py-2 text-sm bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
              >
                {CONNECTORS.map((conn) => (
                  <option key={conn} value={conn}>
                    {conn}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Price Select */}
            <div className="md:col-span-2">
              <label
                htmlFor="discovery-price-select"
                className="block text-xs font-mono uppercase text-[#565A52] mb-1.5"
              >
                Max Tariff (₹/kWh)
              </label>
              <select
                id="discovery-price-select"
                value={filterCriteria.maxPricePerKwh}
                onChange={(e) =>
                  onUpdateFilter((prev) => ({
                    ...prev,
                    maxPricePerKwh: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 text-sm bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
              >
                <option value={25}>Up to ₹25/kWh</option>
                <option value={18}>Up to ₹18/kWh</option>
                <option value={15}>Up to ₹15/kWh</option>
                <option value={14}>Up to ₹14/kWh</option>
              </select>
            </div>

            {/* Power & Distance Filter */}
            <div className="md:col-span-2">
              <label
                htmlFor="discovery-power-select"
                className="block text-xs font-mono uppercase text-[#565A52] mb-1.5"
              >
                Min Power Output
              </label>
              <select
                id="discovery-power-select"
                value={filterCriteria.minPowerKw}
                onChange={(e) =>
                  onUpdateFilter((prev) => ({
                    ...prev,
                    minPowerKw: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 text-sm bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
              >
                <option value={0}>Any Power (3.3 kW+)</option>
                <option value={7}>7.4 kW Fast AC+</option>
                <option value={11}>11 kW 3-Phase+</option>
              </select>
            </div>
          </div>

          {/* Secondary Filter Bar: Distance, Availability Toggle, Result Count & Reset */}
          <div className="mt-4 pt-3.5 border-t border-[#ECE9DF] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none font-medium text-[#22251F]">
                <input
                  type="checkbox"
                  checked={filterCriteria.availableNowOnly}
                  onChange={(e) =>
                    onUpdateFilter((prev) => ({
                      ...prev,
                      availableNowOnly: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#173D2C] rounded"
                />
                <span>Available today only</span>
              </label>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#565A52]" />
                <label htmlFor="discovery-distance-select" className="text-[#565A52]">
                  Radius:
                </label>
                <select
                  id="discovery-distance-select"
                  value={filterCriteria.maxDistanceKm}
                  onChange={(e) =>
                    onUpdateFilter((prev) => ({
                      ...prev,
                      maxDistanceKm: Number(e.target.value),
                    }))
                  }
                  className="bg-transparent font-medium text-[#173D2C] underline underline-offset-4 focus:outline-none cursor-pointer"
                >
                  <option value={10}>Within 10 km</option>
                  <option value={3}>Within 3 km</option>
                  <option value={2}>Within 2 km</option>
                  <option value={1.5}>Within 1.5 km</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[#565A52] tabular-nums">
                Showing {filteredList.length} of {chargers.length} sample chargers
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setBookingSuccessBanner(null);
                }}
                className="inline-flex items-center gap-1.5 text-[#173D2C] font-semibold hover:underline underline-offset-4 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main 12-Column Discovery Workspace: Map + Listings + Detail Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Columns: Interactive Neighbourhood Coordinate Map + Filtered Listings */}
          <div className="lg:col-span-7 space-y-5">
            {/* Interactive Neighbourhood Map Viewport */}
            <div className="border border-[#22251F] rounded overflow-hidden bg-[#173D2C] text-[#F6F3E9]">
              {/* Top Map Status Bar */}
              <div className="px-4 py-2.5 bg-[#123123] border-b border-[#2B5641] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-[#D8F36A]" />
                  <span className="font-mono text-[#E2ECE7]">
                    {filterCriteria.city === 'All Cities'
                      ? 'INDIA METRO NEIGHBOURHOOD GRID (DEMO VIEW)'
                      : `${filterCriteria.city.toUpperCase()} NEIGHBOURHOOD GRID`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#A8C0B4] hidden sm:inline">
                    {hasMapApiKey
                      ? 'Vector Tile Key Configured'
                      : 'Interactive Coordinate Preview (Set VITE_MAP_TILES_API_KEY for live tiles)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMapZoomed((z) => !z)}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#1E4A35] hover:bg-[#285E45] text-[#D8F36A] rounded border border-[#3B6E56] cursor-pointer whitespace-nowrap"
                  >
                    {mapZoomed ? 'Zoom Out (1x)' : 'Zoom In (1.25x)'}
                  </button>
                </div>
              </div>

              {/* Interactive SVG Map Surface with Real Button Pins */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#163829]">
                <svg
                  viewBox="0 0 800 360"
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    mapZoomed ? 'scale-125' : 'scale-100'
                  }`}
                  aria-hidden="true"
                >
                  {/* Topographic / Street Block Vector Geometry */}
                  <rect width="800" height="360" fill="#163829" />
                  {/* Green Park Zones */}
                  <rect x="60" y="36" width="170" height="110" rx="6" fill="#1E4735" />
                  <rect x="520" y="190" width="210" height="130" rx="6" fill="#1E4735" />
                  {/* Coordinate Grid */}
                  <g stroke="#285440" strokeWidth="1">
                    <line x1="0" y1="90" x2="800" y2="90" />
                    <line x1="0" y1="180" x2="800" y2="180" />
                    <line x1="0" y1="270" x2="800" y2="270" />
                    <line x1="160" y1="0" x2="160" y2="360" />
                    <line x1="320" y1="0" x2="320" y2="360" />
                    <line x1="480" y1="0" x2="480" y2="360" />
                    <line x1="640" y1="0" x2="640" y2="360" />
                  </g>
                  {/* Arterial Neighbourhood Roads */}
                  <path
                    d="M 0 140 Q 260 135, 440 185 T 800 155"
                    stroke="#2E5E47"
                    strokeWidth="12"
                    fill="none"
                  />
                  <path
                    d="M 240 0 L 295 360"
                    stroke="#2E5E47"
                    strokeWidth="10"
                    fill="none"
                  />
                  <path
                    d="M 560 0 L 490 360"
                    stroke="#27523E"
                    strokeWidth="8"
                    fill="none"
                  />
                  <path
                    d="M 90 360 L 690 20"
                    stroke="#27523E"
                    strokeWidth="6"
                    strokeDasharray="8 6"
                    fill="none"
                  />
                </svg>

                {/* Interactive HTML Button Markers Positioned by Coordinate */}
                {filteredList.map((charger) => {
                  const isSelected = activeCharger.id === charger.id;
                  return (
                    <button
                      key={charger.id}
                      type="button"
                      onClick={() => handleChargerClick(charger)}
                      style={{
                        left: `${charger.mapPosition.x}%`,
                        top: `${charger.mapPosition.y}%`,
                      }}
                      aria-label={`Select ${charger.title} in ${charger.locality}, ₹${charger.pricePerKwh} per kWh`}
                      className={`-translate-x-1/2 -translate-y-1/2 absolute px-2.5 py-1 rounded text-xs font-mono font-semibold transition-transform cursor-pointer whitespace-nowrap border ${
                        isSelected
                          ? 'z-20 bg-[#D8F36A] text-[#173D2C] border-[#22251F] scale-110 shadow-md'
                          : 'z-10 bg-[#F6F3E9] text-[#22251F] border-[#173D2C] hover:scale-105'
                      }`}
                    >
                      ₹{charger.pricePerKwh} · {charger.powerKw}kW
                    </button>
                  );
                })}

                {/* Bottom Map Legend & Coordinate Footer */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[#C6D6CE] pointer-events-none">
                  <span>
                    Selected: {activeCharger.coordinates.lat}, {activeCharger.coordinates.lng}
                  </span>
                  <span>Click any marker to inspect driveway bay</span>
                </div>
              </div>
            </div>

            {/* Filtered Charger Cards List */}
            {filteredList.length === 0 ? (
              <div className="bg-white border border-[#D8D5CA] rounded p-8 text-center space-y-3">
                <p className="text-base font-semibold text-[#22251F]">
                  No sample chargers match your current filter combination.
                </p>
                <p className="text-sm text-[#565A52]">
                  Try broadening your maximum tariff, power output, or searching across all Indian cities.
                </p>
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-[#173D2C] bg-[#D8F36A] border border-[#173D2C] rounded cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredList.map((charger) => {
                  const isSelected = activeCharger.id === charger.id;
                  return (
                    <article
                      key={charger.id}
                      className={`border rounded overflow-hidden transition-colors flex flex-col justify-between bg-white ${
                        isSelected
                          ? 'border-[#173D2C] ring-2 ring-[#173D2C]'
                          : 'border-[#D8D5CA] hover:border-[#22251F]'
                      }`}
                    >
                      <div>
                        <div className="h-32 w-full bg-[#173D2C] overflow-hidden border-b border-[#D8D5CA]">
                          <ChargerThumbPlate
                            theme={charger.visualTheme}
                            powerKw={charger.powerKw}
                            connector={charger.connector}
                          />
                        </div>
                        <div className="p-4">
                          {/* Quiet unboxed metadata line */}
                          <div className="flex items-center gap-1.5 text-xs text-[#565A52]">
                            <span>{charger.city}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{charger.distanceKm} km</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-0.5 text-[#22251F] font-medium tabular-nums">
                              <Star className="w-3 h-3 fill-[#173D2C] text-[#173D2C]" />
                              {charger.rating.toFixed(1)} ({charger.reviewCount})
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#22251F] font-display mt-1 leading-snug">
                            {charger.title}
                          </h3>
                          <p className="text-xs text-[#565A52] mt-0.5">{charger.locality}</p>

                          <div className="mt-3 pt-3 border-t border-[#ECE9DF] flex items-baseline justify-between">
                            <div>
                              <span className="text-lg font-bold font-mono tabular-nums text-[#173D2C]">
                                ₹{charger.pricePerKwh}
                              </span>
                              <span className="text-xs text-[#565A52]">/kWh</span>
                            </div>
                            <span className="text-xs font-mono text-[#22251F]">
                              {charger.powerKw.toFixed(1)} kW · {charger.connector}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-2.5 bg-[#F6F3E9] border-t border-[#ECE9DF] flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium text-[#173D2C] truncate">
                          {charger.availabilityLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleChargerClick(charger)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-[#173D2C] text-[#D8F36A]'
                              : 'bg-white text-[#22251F] border border-[#22251F] hover:bg-[#EDE8D8]'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'View Details'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right 5 Columns: Selected Charger Detail & Demo Slot Reservation Panel */}
          <div className="lg:col-span-5 bg-white border border-[#22251F] rounded p-5 sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#D8D5CA]">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[#173D2C]">
                  SELECTED CHARGER · {activeCharger.city.toUpperCase()}
                </div>
                <h3 className="text-xl font-bold font-display text-[#22251F] mt-1">
                  {activeCharger.title}
                </h3>
                <p className="text-xs text-[#565A52] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#173D2C] shrink-0" />
                  <span>
                    {activeCharger.locality} ({activeCharger.addressCue})
                  </span>
                </p>
              </div>
              <div className="text-right shrink-0 bg-[#F6F3E9] border border-[#D8D5CA] px-3 py-2 rounded">
                <div className="text-xl font-bold font-mono tabular-nums text-[#173D2C]">
                  ₹{activeCharger.pricePerKwh}
                  <span className="text-xs font-normal text-[#565A52]">/kWh</span>
                </div>
                <div className="text-[11px] font-mono text-[#22251F]">
                  {activeCharger.powerKw.toFixed(1)} kW
                </div>
              </div>
            </div>

            {/* Technical & Access Specifications */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 border-b border-[#D8D5CA] text-xs">
              <div>
                <dt className="text-[#6E736A] font-mono uppercase text-[10px]">Hardware & Connector</dt>
                <dd className="font-semibold text-[#22251F] mt-0.5">
                  {activeCharger.connector} ({activeCharger.hardwareModel})
                </dd>
              </div>
              <div>
                <dt className="text-[#6E736A] font-mono uppercase text-[10px]">Parking & Cable</dt>
                <dd className="font-semibold text-[#22251F] mt-0.5">
                  {activeCharger.parkingType} · {activeCharger.cableLengthMeters}m cable
                </dd>
              </div>
              <div>
                <dt className="text-[#6E736A] font-mono uppercase text-[10px]">Host & Track Record</dt>
                <dd className="font-semibold text-[#22251F] mt-0.5">
                  {activeCharger.hostName} · {activeCharger.completedSessions} demo sessions
                </dd>
              </div>
              <div>
                <dt className="text-[#6E736A] font-mono uppercase text-[10px]">Operating Hours</dt>
                <dd className="font-semibold text-[#22251F] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#173D2C]" />
                  {activeCharger.operatingHours}
                </dd>
              </div>
            </dl>

            {/* Access Instructions & Compatible EVs */}
            <div className="py-3.5 border-b border-[#D8D5CA] space-y-2 text-xs">
              <p className="text-[#3D423A] leading-relaxed">
                <strong className="text-[#22251F]">Driveway Access Note:</strong>{' '}
                {activeCharger.accessNotes}
              </p>
              <p className="text-[#565A52]">
                <strong className="text-[#22251F]">Tested Compatible EVs:</strong>{' '}
                {activeCharger.compatibleVehicles.join(' · ')}
              </p>
            </div>

            {/* Interactive Slot Reservation Form (Demo Mode) */}
            <form onSubmit={handleBookingSubmit} noValidate className="pt-4 space-y-4">
              <div>
                <span className="block text-xs font-mono uppercase text-[#22251F] font-semibold mb-2">
                  1. Select a Charging Window
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {activeCharger.slots.map((slot) => {
                    const isSlotChosen = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full px-3.5 py-2.5 text-left text-xs rounded border flex items-center justify-between transition-colors ${
                          !slot.available
                            ? 'bg-[#F2F0E8] border-[#E0DDD3] text-[#8C8F87] cursor-not-allowed'
                            : isSlotChosen
                            ? 'bg-[#173D2C] text-[#F6F3E9] border-[#173D2C] font-semibold cursor-pointer'
                            : 'bg-[#F6F3E9] text-[#22251F] border-[#D8D5CA] hover:border-[#22251F] cursor-pointer'
                        }`}
                      >
                        <span>{slot.label}</span>
                        <span className="font-mono tabular-nums">
                          {slot.window} {!slot.available && '(Booked)'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {formErrors.slotId && (
                  <p className="text-xs text-[#B42318] mt-1">{formErrors.slotId}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="booking-driver-name"
                    className="block text-xs font-medium text-[#22251F] mb-1"
                  >
                    Driver Name
                  </label>
                  <input
                    id="booking-driver-name"
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="e.g., Siddharth Menon"
                    className="w-full px-3 py-2 text-xs bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
                  />
                  {formErrors.driverName && (
                    <p className="text-[11px] text-[#B42318] mt-1">{formErrors.driverName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs font-medium text-[#22251F] mb-1"
                  >
                    10-Digit Mobile (India)
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g., 98450 12345"
                    className="w-full px-3 py-2 text-xs bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
                  />
                  {formErrors.contactPhone && (
                    <p className="text-[11px] text-[#B42318] mt-1">{formErrors.contactPhone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="booking-vehicle-model"
                    className="block text-xs font-medium text-[#22251F] mb-1"
                  >
                    Your EV Model
                  </label>
                  <input
                    id="booking-vehicle-model"
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g., Tata Nexon EV"
                    className="w-full px-3 py-2 text-xs bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
                  />
                  {formErrors.vehicleModel && (
                    <p className="text-[11px] text-[#B42318] mt-1">{formErrors.vehicleModel}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-kwh"
                    className="block text-xs font-medium text-[#22251F] mb-1"
                  >
                    Est. Energy Needed (kWh)
                  </label>
                  <input
                    id="booking-kwh"
                    type="number"
                    min={2}
                    max={100}
                    value={estimatedKwh}
                    onChange={(e) => setEstimatedKwh(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-[#F6F3E9] border border-[#D8D5CA] rounded text-[#22251F] focus:outline-none focus:border-[#173D2C]"
                  />
                  {formErrors.estimatedKwh && (
                    <p className="text-[11px] text-[#B42318] mt-1">{formErrors.estimatedKwh}</p>
                  )}
                </div>
              </div>

              {/* Transparent Estimate Breakdown */}
              <div className="bg-[#F6F3E9] border border-[#D8D5CA] p-3 rounded flex items-center justify-between text-xs">
                <div>
                  <span className="font-medium text-[#22251F]">
                    Estimated Session Value ({estimatedKwh || 0} kWh × ₹{activeCharger.pricePerKwh})
                  </span>
                  <p className="text-[11px] text-[#565A52]">
                    Demo simulation · No live payment charged
                  </p>
                </div>
                <span className="text-base font-bold font-mono tabular-nums text-[#173D2C]">
                  ₹{Math.max(0, Math.round((estimatedKwh || 0) * activeCharger.pricePerKwh)).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-semibold text-[#173D2C] bg-[#D8F36A] border border-[#173D2C] rounded hover:bg-[#c9e854] transition-colors cursor-pointer"
              >
                Request Demo Slot Reservation
              </button>
            </form>

            {/* Immediate Confirmation Feedback */}
            {bookingSuccessBanner && (
              <div
                role="status"
                className="mt-4 p-3.5 bg-[#173D2C] text-[#F6F3E9] rounded border border-[#22251F] text-xs space-y-1.5"
              >
                <div className="flex items-center gap-2 font-semibold text-[#D8F36A]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Demo Reservation Logged ({bookingSuccessBanner.bookingId})
                  </span>
                </div>
                <p className="text-[#E2ECE7]">
                  Reserved <strong>{bookingSuccessBanner.slotWindow}</strong> at{' '}
                  <strong>{bookingSuccessBanner.chargerTitle}</strong> for{' '}
                  {bookingSuccessBanner.driverName} ({bookingSuccessBanner.vehicleModel}).
                </p>
                <p className="text-[11px] text-[#B5C7BD] flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    This is a client-side MVP demonstration; no hardware session or payment gateway was triggered.
                  </span>
                </p>
              </div>
            )}

            {confirmedBookings.length > 0 && !bookingSuccessBanner && (
              <div className="mt-3 pt-3 border-t border-[#ECE9DF] text-xs text-[#565A52] flex items-center justify-between">
                <span>Active demo reservations in this session:</span>
                <span className="font-mono font-semibold text-[#173D2C]">
                  {confirmedBookings.length} booked
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
