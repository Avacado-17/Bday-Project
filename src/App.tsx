import React, { useState, useEffect, useRef } from 'react';
import moonSunflowerBg from './assets/images/moon_sunflower_bg_1791123860176.jpg';
import { confettiEngine } from './utils/confettiSystem';

const HARDCODED_MESSAGE =
  "Happy Birthday mini princess 😊😊, glad to see you finally turn 17 (physically and mentally not so much 😝😝😝). I promise to always be your one and only bully 😝 as well as supporter cuz well, you told me to be that. Although we fight and bully each other a lot but you'll always be my shortie 😼😼 and yes little munchkin you can't ragebait me either 🤗 cuz you don't have the right braincells for that. You're pretty(dumb) and autistic but that's okay cuz I settled for you nevertheless and you said I shouldn't even think about leaving or not dealing with you sooo 🤷🤷 ig win win situation here 😘. Even tho you hate me I don't care cuz everyone knows I'm tayammi's favourite 😂😂😂 so back off 😃. But yea I pray to Allah that youre successful and wealthy in all forms in your life inshallah and for GODS SAKE PLEASE TAKE CARE OF YOURSELF YOU WEAKLING. You look like you'll collapse the second you walk out and we'll collect you in shards 😂😂. Idiot. Happy birthday again and have an amazing day chamchi 💕💕. Byeee love you 🫶✨";
const HARDCODED_AUTHOR = 'Avacado';

export default function App() {
  const [soundEnabled] = useState(true);

  // Single Envelope Note State
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const letterBlockRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Keep confetti engine updated with the excluded letter block bounds
  useEffect(() => {
    confettiEngine.setExclusionElement(letterBlockRef.current);
  });

  // Play gentle warm synthesized audio chime using Web Audio API
  const playChime = (type: 'seal' | 'open' | 'confetti' | 'wish') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      if (type === 'seal') {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.65);
      } else if (type === 'open') {
        // Delicate parchment paper rustle & soft bell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'confetti' || type === 'wish') {
        const notesFreq = [523.25, 659.25, 783.99, 1046.50];
        notesFreq.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.14, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.55);
        });
      }
    } catch {
      // AudioContext could fail gracefully if autoplay blocked
    }
  };

  // Continuous Golden & Celebration Confetti Shower on Mount
  useEffect(() => {
    if (canvasRef.current) {
      confettiEngine.init(canvasRef.current);
    }
    return () => {
      confettiEngine.cleanup();
    };
  }, []);

  const handleTossConfetti = (e?: React.MouseEvent) => {
    playChime('confetti');
    if (e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      confettiEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    } else {
      confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.35, 80);
    }
  };

  const handleToggleEnvelope = () => {
    if (!isEnvelopeOpen) {
      playChime('open');
      setIsEnvelopeOpen(true);
      setIsSealed(false);
      // Joyful celebratory burst when opening the note envelope
      confettiEngine.burst(window.innerWidth * 0.5, window.innerHeight * 0.5, 75);
    } else {
      playChime('seal');
      setIsEnvelopeOpen(false);
      setIsSealed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-amber-50 relative overflow-x-hidden selection:bg-amber-400 selection:text-black">
      {/* Celestial Moon & Sunflower Background Wallpaper */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url(${moonSunflowerBg})` }}
      >
        {/* Soft atmospheric overlay keeping the background artwork bright, vivid and clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/45" />
      </div>

      {/* Celebration Confetti Shower Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      />

      {/* Main Container */}
      <main className="relative z-10 max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col items-center">
        
        {/* Main Heading with Contrasting Glowing Gold Typography */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
          HAPPY BIRTHDAY PRINCESS.
        </h1>

        {/* Centerpiece Container with Transparent Styling */}
        <div 
          style={{ backgroundColor: 'transparent' }}
          className="w-full mt-8 max-w-2xl bg-transparent p-2 sm:p-4"
        >
          
          <div className="flex flex-col items-center justify-center w-full">
            <div className="w-full">
              
              {/* Envelope Container with Tailwind Hover Animations */}
              <div
                onClick={handleToggleEnvelope}
                className={`relative w-full rounded-2xl md:rounded-3xl transition-all duration-500 ease-out cursor-pointer ${
                  !isEnvelopeOpen 
                    ? 'transform hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] shadow-[0_0_20px_rgba(0,0,0,0.6)] border-2 border-amber-400/60 hover:border-amber-300 bg-transparent group' 
                    : 'shadow-[0_0_30px_rgba(0,0,0,0.6)] border-2 border-amber-400/60 hover:border-amber-300 bg-transparent group'
                }`}
              >
                
                {/* ENVELOPE CLOSED FORM */}
                {!isEnvelopeOpen && (
                  <div 
                    ref={letterBlockRef}
                    style={{ backgroundColor: 'transparent' }}
                    className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 sm:p-8 min-h-[300px] flex flex-col justify-between bg-transparent text-amber-100"
                  >
                    
                    {/* Top Envelope Flap Fold Look */}
                    <div 
                      style={{ backgroundColor: 'transparent' }}
                      className="absolute top-0 left-0 right-0 h-28 bg-transparent border-b-2 border-amber-400/50 shadow-xs [clip-path:polygon(0_0,100%_0,50%_100%)] transition-transform duration-500 group-hover:scale-y-105" 
                    />

                    {/* Addressing Lines on Front of Envelope */}
                    <div className="relative z-10 pt-2 border-t border-amber-400/40 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-xs">
                      <div>
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Recipient</p>
                        <p className="font-semibold text-amber-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">Reda</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Sender</p>
                        <p className="italic text-amber-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">{HARDCODED_AUTHOR}</p>
                      </div>
                    </div>

                  </div>
                )}

                {/* ENVELOPE OPENED FORM (Letter Revealed with Smooth Transition) */}
                {isEnvelopeOpen && (
                  <div 
                    ref={letterBlockRef}
                    style={{ backgroundColor: 'transparent' }}
                    className="p-5 sm:p-7 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-400 relative z-10 bg-transparent text-amber-100 rounded-2xl md:rounded-3xl"
                  >
                    
                    {/* Letter Parchment Container Displaying Hardcoded Message */}
                    <div 
                      style={{ backgroundColor: 'transparent' }}
                      className="relative rounded-2xl bg-black/35 backdrop-blur-[2px] p-5 sm:p-7 border border-amber-400/50 shadow-xs select-none"
                    >
                      <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        {HARDCODED_MESSAGE}
                      </p>

                      {/* Small, Elegant Handwritten-Style Date Stamp & Signature */}
                      <div className="mt-6 pt-4 border-t border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          {/* Vintage Postmark Stamp Badge */}
                          <div className="w-8 h-8 rounded-full border border-dashed border-amber-400/80 flex flex-col items-center justify-center p-0.5 text-center rotate-[-5deg] bg-black/40 shadow-2xs">
                            <span className="text-[6.5px] uppercase font-bold tracking-widest text-amber-300 leading-none">OCT</span>
                            <span className="text-[11px] font-bold text-amber-200 leading-none my-0.5">07</span>
                            <span className="text-[6.5px] text-amber-300/90 leading-none">2026</span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-300/90 drop-shadow-sm">Special Day</span>
                            <span className="font-['Caveat',cursive] text-lg sm:text-xl text-amber-200 font-semibold leading-tight tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                              07 October 2026
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center font-['Caveat',cursive] text-lg sm:text-xl text-amber-300 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                          <span>— {HARDCODED_AUTHOR}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
