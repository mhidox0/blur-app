import { useState } from 'react';
import NeonButton from '../ui/NeonButton';

export default function JoinForm({ onJoin, loading, defaultName = '' }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState(defaultName || '');

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="CODE À 6 CHIFFRES"
          value={code}
          onChange={handleCodeChange}
          className="bg-blur-surface border border-white/20 rounded-xl px-4 py-4 text-center font-display tracking-[0.2em] text-3xl text-blur-cyan outline-none focus:border-blur-cyan transition-colors shadow-inner uppercase"
          maxLength={7}
        />
        <input
          type="text"
          placeholder="Ton pseudo ?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-blur-surface border border-white/20 rounded-xl px-4 py-4 text-center font-sans text-xl outline-none focus:border-blur-cyan transition-colors text-white shadow-inner"
          maxLength={15}
        />
      </div>
      <NeonButton type="submit" variant="cyan" className="py-4 text-xl mt-4" disabled={code.length < 7 || !name.trim() || loading}>
        {loading ? 'CONNEXION...' : 'REJOINDRE'}
      </NeonButton>
    </form>
  );
}
