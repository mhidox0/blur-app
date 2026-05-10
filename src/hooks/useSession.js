import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const EMOJIS = ['🦊','🐺','🦁','🐯','🦒','🦓','🦄','🐉','🦖','🐙','🦈','🐊','🦅','🦉','🦇','🦋','🐌','🐛','🐞','🐝','🐢','🐍','🦎','🦂','🦀','🦑','🐡','🐠','🐟','🐬','🐳','🐋', '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐸', '🐵', '🙈', '🙉', '🙊'];

function generateEmoji(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % EMOJIS.length;
  return EMOJIS[index];
}

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Local identity
  const [localPlayerName, setLocalPlayerName] = useState(() => localStorage.getItem('blur_local_player_name') || '');
  const [isHost, setIsHost] = useState(() => localStorage.getItem('blur_local_is_host') === 'true');

  useEffect(() => {
    if (!session?.code) return;

    const channel = supabase
      .channel(`public:sessions:code=eq.${session.code}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `code=eq.${session.code}` }, (payload) => {
        setSession(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.code]);

  const saveLocalPlayer = (name, host) => {
    localStorage.setItem('blur_local_player_name', name);
    localStorage.setItem('blur_local_is_host', host ? 'true' : 'false');
    setLocalPlayerName(name);
    setIsHost(host);
  };

  const createSession = async (hostName) => {
    setLoading(true);
    setError(null);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString().replace(/(\d{3})(\d{3})/, '$1-$2');
      const hostPlayer = {
        id: crypto.randomUUID(),
        name: hostName,
        emoji: generateEmoji(hostName),
        is_host: true
      };

      const { data, error } = await supabase
        .from('sessions')
        .insert([{ code, players: [hostPlayer], status: 'waiting' }])
        .select()
        .single();

      if (error) throw error;
      
      saveLocalPlayer(hostName, true);
      setSession(data);
      return data;
    } catch (err) {
      console.error(err);
      setError("Impossible de créer la session.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (code, playerName) => {
    setLoading(true);
    setError(null);
    try {
      const { data: sessionData, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .single();

      if (fetchError || !sessionData) throw new Error("Session introuvable");

      // Check if player already exists
      const existingPlayer = sessionData.players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
      
      if (!existingPlayer) {
        const newPlayer = {
          id: crypto.randomUUID(),
          name: playerName,
          emoji: generateEmoji(playerName),
          is_host: false
        };

        const updatedPlayers = [...sessionData.players, newPlayer];

        const { data: updatedSession, error: updateError } = await supabase
          .from('sessions')
          .update({ players: updatedPlayers })
          .eq('code', code)
          .select()
          .single();

        if (updateError) throw updateError;
        
        saveLocalPlayer(playerName, false);
        setSession(updatedSession);
        return updatedSession;
      } else {
        // Resume as existing player
        saveLocalPlayer(existingPlayer.name, existingPlayer.is_host);
        setSession(sessionData);
        return sessionData;
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur de connexion");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (code) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .single();
        
      if (data) setSession(data);
      return data;
    } catch(err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (code, status) => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update({ status })
        .eq('code', code)
        .select()
        .single();
      if (!error && data) setSession(data);
    } catch(err) {
      console.error(err);
    }
  };

  return {
    session,
    loading,
    error,
    localPlayerName,
    isHost,
    createSession,
    joinSession,
    loadSession,
    updateSessionStatus
  };
}
