import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Lobby from './pages/Lobby';
import SessionWait from './pages/SessionWait';
import GamesMenu from './pages/GamesMenu';
import Settings from './pages/Settings';
import PageTransition from './components/ui/PageTransition';

import Picolo from './games/questions/Picolo';
import TruthOrShot from './games/questions/TruthOrShot';
import NeverHaveIEver from './games/questions/NeverHaveIEver';
import MostLikelyTo from './games/questions/MostLikelyTo';
import WouldYouRather from './games/questions/WouldYouRather';
import Palmier from './games/cards/Palmier';
import BlackjackDrink from './games/cards/BlackjackDrink';
import PMU from './games/cards/PMU';
import BusDriver from './games/cards/BusDriver';
import HigherOrLower from './games/cards/HigherOrLower';
import SnapDrink from './games/cards/SnapDrink';
import SpeedTap from './games/skill/SpeedTap';
import Dice from './games/skill/Dice';
import RussianRoulette from './games/skill/RussianRoulette';
import Categories from './games/group/Categories';
import RimeBattle from './games/group/RimeBattle';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/lobby" element={<PageTransition><Lobby /></PageTransition>} />
        <Route path="/session/:id" element={<PageTransition><SessionWait /></PageTransition>} />
        <Route path="/games" element={<PageTransition><GamesMenu /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />

        <Route path="/games/picolo" element={<PageTransition><Picolo /></PageTransition>} />
        <Route path="/games/truth-or-shot" element={<PageTransition><TruthOrShot /></PageTransition>} />
        <Route path="/games/never-have-i-ever" element={<PageTransition><NeverHaveIEver /></PageTransition>} />
        <Route path="/games/most-likely-to" element={<PageTransition><MostLikelyTo /></PageTransition>} />
        <Route path="/games/would-you-rather" element={<PageTransition><WouldYouRather /></PageTransition>} />

        <Route path="/games/palmier" element={<PageTransition><Palmier /></PageTransition>} />
        <Route path="/games/blackjack" element={<PageTransition><BlackjackDrink /></PageTransition>} />
        <Route path="/games/pmu" element={<PageTransition><PMU /></PageTransition>} />
        <Route path="/games/bus-driver" element={<PageTransition><BusDriver /></PageTransition>} />
        <Route path="/games/higher-or-lower" element={<PageTransition><HigherOrLower /></PageTransition>} />
        <Route path="/games/snap-drink" element={<PageTransition><SnapDrink /></PageTransition>} />

        <Route path="/games/speed-tap" element={<PageTransition><SpeedTap /></PageTransition>} />
        <Route path="/games/dice" element={<PageTransition><Dice /></PageTransition>} />
        <Route path="/games/russian-roulette" element={<PageTransition><RussianRoulette /></PageTransition>} />

        <Route path="/games/categories" element={<PageTransition><Categories /></PageTransition>} />
        <Route path="/games/rime-battle" element={<PageTransition><RimeBattle /></PageTransition>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
