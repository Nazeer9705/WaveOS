import React from 'react';
import { Sparkles, Check } from 'lucide-react';

interface ViewPremiumProps {
  onToast: (msg: string, type?: 's' | 'i' | 'e' | 'w') => void;
}

export const ViewPremium: React.FC<ViewPremiumProps> = ({ onToast }) => {
  const plans = [
    {
      name: 'Solo Plan',
      badge: 'Individual',
      price: '$9.99',
      features: [
        'Ad-free continuous play',
        'Unlimited queue additions',
        'Standard 320kbps MP3 audio',
        'Standard sleep timers',
        'Audio equalizers preset'
      ],
      pop: false,
    },
    {
      name: 'Wave Pro',
      badge: 'Professional',
      price: '$14.99',
      features: [
        'Full FLAC Lossless quality',
        'Dynamic Gemini Mood AI',
        'Full dashboard analytics',
        'Playback speed regulators',
        'Crossfade transitions (2s)',
        'Unlimited custom uploads',
        'Priority client support'
      ],
      pop: true,
    },
    {
      name: 'Wave Family',
      badge: 'Family Collective',
      price: '$19.99',
      features: [
        'Up to 6 unique member seats',
        'Lossless quality audio streams',
        'Kids explicit filtering toggles',
        'Family mix dynamic blending',
        'Shared collaborative queues'
      ],
      pop: false,
    }
  ];

  const handleSubscribe = (name: string, price: string) => {
    onToast(`⭐ subscription activated for ${name} at ${price}/mo! (Demo Mode)`, 's');
  };

  return (
    <div className="view-container max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-10 animate-in fade-in duration-300">
      {/* Premium Hero Title */}
      <div className="text-center py-10 sm:py-12 bg-gradient-to-br from-b2 via-b2 to-b4 border border-white/5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-[-50px] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-p/20 blur-[60px] pointer-events-none" />
        <div className="text-5xl mb-4 text-center">⭐</div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit tracking-tight">Go Ultra</h2>
        <p className="text-xs sm:text-sm text-t2 leading-relaxed max-w-[420px] mx-auto mt-2">
          Unlock the complete WaveOS music catalog. Experience high fidelity lossless audio, AI curation, and complete metrics.
        </p>
      </div>

      {/* Pricing Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <div
            key={idx}
            className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl relative bg-b2 ${
              p.pop 
                ? 'border-2 border-p/50 bg-p/5' 
                : 'border border-white/5 hover:border-white/10'
            }`}
          >
            {p.pop && (
              <span className="absolute top-[-1px] left-1/2 -translate-x-1/2 text-[9px] font-black uppercase text-white bg-gradient-to-r from-p to-c px-4 py-1.5 rounded-b-xl tracking-wider">
                MOST POPULAR
              </span>
            )}

            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold text-p2 tracking-wider uppercase block">{p.badge}</span>
                <h4 className="text-lg font-black text-white font-outfit mt-1">{p.name}</h4>
              </div>

              <div className="font-outfit text-3xl font-black text-white">
                {p.price}<span className="text-xs text-t3 font-medium">/mo</span>
              </div>

              {/* Feature list */}
              <ul className="space-y-2.5 pt-2 border-t border-white/5">
                {p.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2.5 text-xs text-t2">
                    <Check size={11} className="text-gr shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSubscribe(p.name, p.price)}
                className={`w-full py-3.5 rounded-xl text-xs font-black font-outfit transition-all cursor-pointer ${
                  p.pop
                    ? 'bg-gradient-to-r from-p to-c text-white shadow-lg shadow-p/20 hover:opacity-90'
                    : 'bg-white/5 hover:bg-white/10 text-t2 hover:text-white border border-white/5 hover:border-white/10'
                }`}
              >
                Get {p.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
