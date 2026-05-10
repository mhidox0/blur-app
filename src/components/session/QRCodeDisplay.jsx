import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ url, code }) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 glass-panel rounded-2xl mx-auto w-fit">
      <div className="bg-white p-4 rounded-xl">
        <QRCodeSVG value={url} size={200} fgColor="#0A0A0F" bgColor="#FFFFFF" />
      </div>
      <div className="text-center">
        <p className="text-white/50 text-sm mb-1 uppercase tracking-widest">Code de session</p>
        <p className="font-display text-4xl neon-text-cyan tracking-widest">{code}</p>
      </div>
    </div>
  );
}
