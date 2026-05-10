import { useState } from 'react';
import NeonButton from '../ui/NeonButton';

export default function JoinForm({ onJoin }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length >= 6 && name.trim()) {
      onJoin(code, name);
    }
  };

  const handleCodeChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) {
      val = val.slice(0, 3) + '-' + val.slice(3, 6);
    }
    setCode(val);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <input
        type="text"
        placeholder="CODE À 6 CHIFFRES"
        value={code}
        onChange={handleCodeChange}
        className="bg-blur-surface border border-white/20 rounded-xl px-4 py-3 text-center font-display tracking-[0.2em] text-2xl text-blur-cyan outline-none focus:border-blur-cyan transition-colors"
        maxLength={7}
      />
      <input
        type="text"
        placeholder="Ton pseudo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-blur-surface border border-white/20 rounded-xl px-4 py-3 text-center font-sans outline-none focus:border-blur-purple transition-colors"
        maxLength={15}
      />
      <NeonButton type="submit" variant="cyan" disabled={code.length < 7 || !name.trim()}>
        REJOINDRE
      </NeonButton>
    </form>
  );
}
