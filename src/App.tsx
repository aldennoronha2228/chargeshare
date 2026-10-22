/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DEMO_CHARGERS, type ChargerListing } from './data/demoChargers';
import type { ChargerFilterCriteria } from './utils/marketplaceLogic';
import { ORDERED_CHAPTERS, type StoryChapterId } from './three/ScrollSceneController';
import type { ChargerVisualState } from './three/ChargerModel';
import { Navbar } from './components/Navbar';
import { HeroScene } from './components/HeroScene';
import { ChapterConnectSection, ChapterBookAndChargeSection } from './components/StoryChapters';
import { DiscoverySection, type ConfirmedDemoBooking } from './components/DiscoverySection';
import { InteractiveRoleShowcase } from './components/InteractiveRoleShowcase';
import { EarningsCalculatorSection } from './components/EarningsCalculatorSection';
import { SafetyAndFeatureShowcase } from './components/SafetyAndFeatureShowcase';
import { IndiaMobilityAndConversion } from './components/IndiaMobilityAndConversion';
import {
  HostOnboardingModal,
  SignInAndBookingsModal,
  InfoPolicyModal,
} from './components/InteractiveModals';

const DEFAULT_FILTERS: ChargerFilterCriteria = {
  searchQuery: '',
  city: 'All Cities',
  connector: 'All Connectors',
  maxPricePerKwh: 25,
  minPowerKw: 0,
  maxDistanceKm: 10,
  availableNowOnly: false,
};

const CHAPTER_SECTION_IDS: Record<StoryChapterId, string> = {
  discover: 'chapter-discover',
  connect: 'chapter-connect',
  find: 'discover',
  book: 'how-it-works',
  share: 'calculator',
  safety: 'safety',
  conversion: 'chapter-conversion',
};

const CHARGER_STATE_CYCLE: ChargerVisualState[] = ['charging', 'standby', 'reserved'];

export default function App() {
  const [chargers, setChargers] = useState<ChargerListing[]>(DEMO_CHARGERS);
  const [selectedCharger, setSelectedCharger] = useState<ChargerListing>(DEMO_CHARGERS[0]);
  const [selectedChargerIndex, setSelectedChargerIndex] = useState<number>(0);
  const [filterCriteria, setFilterCriteria] = useState<ChargerFilterCriteria>(DEFAULT_FILTERS);
  const [confirmedBookings, setConfirmedBookings] = useState<ConfirmedDemoBooking[]>([]);

  // 3D Stage & Narrative Chapter State
  const [activeChapter, setActiveChapter] = useState<StoryChapterId>('discover');
  const [chargerState, setChargerState] = useState<ChargerVisualState>('charging');

  // Modal states
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [infoModalTopic, setInfoModalTopic] = useState<'support' | 'terms' | null>(null);

  // Sync activeChapter with scroll position across the 7 narrative sections
  useEffect(() => {
    const handleScroll = () => {
      const viewportTriggerY = window.innerHeight * 0.45;
      let detectedChapter: StoryChapterId = 'discover';

      for (const ch of ORDERED_CHAPTERS) {
        const el = document.getElementById(CHAPTER_SECTION_IDS[ch]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportTriggerY) {
            detectedChapter = ch;
          }
        }
      }

      setActiveChapter((prev: StoryChapterId) =>
        prev !== detectedChapter ? detectedChapter : prev
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectChapter = useCallback((chapter: StoryChapterId) => {
    setActiveChapter(chapter);
    const targetId = CHAPTER_SECTION_IDS[chapter];
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleCycleChargerState = useCallback((nextState?: ChargerVisualState) => {
    if (nextState) {
      setChargerState(nextState);
      return;
    }
    setChargerState((prev: ChargerVisualState) => {
      const idx = CHARGER_STATE_CYCLE.indexOf(prev);
      return CHARGER_STATE_CYCLE[(idx + 1) % CHARGER_STATE_CYCLE.length];
    });
  }, []);

  const scrollToDiscover = () => {
    setActiveChapter('find');
    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectAndScrollCharger = (charger: ChargerListing) => {
    setSelectedCharger(charger);
    const foundIdx = chargers.findIndex((c) => c.id === charger.id);
    if (foundIdx >= 0) {
      setSelectedChargerIndex(foundIdx % 5);
    }
    setFilterCriteria(DEFAULT_FILTERS);
    scrollToDiscover();
  };

  const handleSelectChargerInDiscovery = (charger: ChargerListing) => {
    setSelectedCharger(charger);
    const foundIdx = chargers.findIndex((c) => c.id === charger.id);
    if (foundIdx >= 0) {
      setSelectedChargerIndex(foundIdx % 5);
    }
  };

  const handleSelectNodeInConnect = (index: number, charger: ChargerListing) => {
    setSelectedChargerIndex(index);
    setSelectedCharger(charger);
  };

  const handleConfirmDemoBooking = (booking: ConfirmedDemoBooking) => {
    setConfirmedBookings((prev) => [booking, ...prev]);
    setChargerState('reserved');
    setChargers((prev) =>
      prev.map((c) => {
        if (c.id !== booking.chargerId) return c;
        return {
          ...c,
          completedSessions: c.completedSessions + 1,
        };
      })
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    setConfirmedBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
  };

  const handleAddHostListing = (newCharger: ChargerListing) => {
    setChargers((prev) => [newCharger, ...prev]);
    setSelectedCharger(newCharger);
    setSelectedChargerIndex(0);
    setFilterCriteria(DEFAULT_FILTERS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#173D2C] text-[#22251F]">
      {/* Persistent Top Bar Navigation */}
      <Navbar
        onExploreChargers={scrollToDiscover}
        onOpenHostModal={() => setHostModalOpen(true)}
        onOpenSignInModal={() => setSignInModalOpen(true)}
        activeReservationCount={confirmedBookings.length}
      />

      <main className="flex-1 relative">
        {/* CHAPTER 1 — DISCOVER (Full-Screen 3D Scene + Persistent WebGL Canvas + Unified 3D Dock) */}
        <HeroScene
          activeChapter={activeChapter}
          chargerState={chargerState}
          selectedChargerIndex={selectedChargerIndex}
          onSelectChapter={handleSelectChapter}
          onCycleChargerState={handleCycleChargerState}
          onFindChargerClick={scrollToDiscover}
          onBecomeHostClick={() => setHostModalOpen(true)}
        />

        {/* CHAPTER 2 — CONNECT (3D Neighbourhood Pull-Back & Shared Charging Network) */}
        <ChapterConnectSection
          chargers={chargers}
          selectedChargerIndex={selectedChargerIndex}
          onSelectNode={handleSelectNodeInConnect}
          onExploreClick={scrollToDiscover}
        />

        {/* CHAPTER 3 — FIND YOUR CHARGER (Interactive Charger Discovery Interface) */}
        <DiscoverySection
          chargers={chargers}
          selectedCharger={selectedCharger}
          onSelectCharger={handleSelectChargerInDiscovery}
          filterCriteria={filterCriteria}
          onUpdateFilter={(updater) => setFilterCriteria((prev) => updater(prev))}
          onResetFilters={() => setFilterCriteria(DEFAULT_FILTERS)}
          onConfirmDemoBooking={handleConfirmDemoBooking}
          confirmedBookings={confirmedBookings}
        />

        {/* CHAPTER 4 — BOOK AND CHARGE (3-Step Interactive Sequence Synced with 3D Stage) */}
        <ChapterBookAndChargeSection
          chargerState={chargerState}
          onSelectStepState={(state) => setChargerState(state)}
          onExploreChargers={scrollToDiscover}
        />

        {/* Interactive Dual-Perspective Workspace (Driver vs Host Simulation) */}
        <InteractiveRoleShowcase
          chargers={chargers}
          onJumpToCharger={handleSelectAndScrollCharger}
          onOpenHostModal={() => setHostModalOpen(true)}
        />

        {/* CHAPTER 5 — SHARE YOUR CHARGER (Host Perspective + Live Earnings Calculator) */}
        <EarningsCalculatorSection onOpenHostModal={() => setHostModalOpen(true)} />

        {/* CHAPTER 6 — TRUST AND SAFETY (Readable Editorial Verification & Capabilities) */}
        <SafetyAndFeatureShowcase />

        {/* CHAPTER 7 — FINAL CONVERSION & FOOTER */}
        <IndiaMobilityAndConversion
          onExploreChargers={scrollToDiscover}
          onOpenHostModal={() => setHostModalOpen(true)}
          onOpenInfoModal={(topic) => setInfoModalTopic(topic)}
        />
      </main>

      {/* Interactive Modals */}
      <HostOnboardingModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        onAddHostListing={handleAddHostListing}
      />

      <SignInAndBookingsModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        confirmedBookings={confirmedBookings}
        onCancelBooking={handleCancelBooking}
      />

      <InfoPolicyModal topic={infoModalTopic} onClose={() => setInfoModalTopic(null)} />
    </div>
  );
}
