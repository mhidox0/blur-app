import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLocalStorage } from './useLocalStorage';

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentPlayers, setRecentPlayers] = useLocalStorage('blur_recent_players', []);

  // Simulating for now since Supabase requires actual DB setup
  const createSession = async (players) => {
    setLoading(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1-$2');
      const newSession = {
        id: crypto.randomUUID(),
        code,
        host_id: 'local_host',
        players: players.map(name => ({ id: crypto.randomUUID(), name, score: 0 })),
        mode: 'mix'
      };
      
      // Save for local persistence
      setRecentPlayers(players);
      setSession(newSession);
      setLoading(false);
      return newSession;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  const joinSession = async (code, playerName) => {
    setLoading(true);
    // Simulating join
    setTimeout(() => {
      setSession({
        id: crypto.randomUUID(),
        code,
        players: [{ id: crypto.randomUUID(), name: playerName, score: 0 }]
      });
      setLoading(false);
    }, 1000);
  };

  return {
    session,
    loading,
    error,
    recentPlayers,
    createSession,
    joinSession
  };
}
