/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Timer, Zap, ChevronRight } from 'lucide-react';

interface FlashSaleHeaderProps {
  onSeeAllClick?: () => void;
}

export default function FlashSaleHeader({ onSeeAllClick }: FlashSaleHeaderProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Restart to keep demo ticking
          return { hours: 4, minutes: 30, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const padZero = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-rose-950/40 bg-gradient-to-r from-[#120B0F] via-[#10101C] to-[#0A0A0F] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 shadow-[0_0_20px_rgba(220,38,38,0.07)]">
      {/* Label and Countdown group */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-center space-x-2 text-rose-500">
          <Zap className="h-5 w-5 fill-rose-500 animate-pulse text-rose-500" />
          <h2 className="font-display text-lg font-black uppercase tracking-wider sm:text-xl">
            Flash Deal Specials
          </h2>
        </div>

        {/* Timer UI blocks */}
        <div className="flex items-center space-x-2">
          <Timer className="h-4 w-4 text-gray-400" />
          <span className="text-xs uppercase tracking-wider text-gray-400 font-medium mr-1">Ends in:</span>
          
          <div className="flex items-center space-x-1">
            <span className="flex h-8 w-9 items-center justify-center rounded bg-rose-600 font-mono text-sm font-bold text-white shadow-md">
              {padZero(timeLeft.hours)}
            </span>
            <span className="text-rose-500 font-bold">:</span>
            <span className="flex h-8 w-9 items-center justify-center rounded bg-rose-600 font-mono text-sm font-bold text-white shadow-md">
              {padZero(timeLeft.minutes)}
            </span>
            <span className="text-rose-500 font-bold">:</span>
            <span className="flex h-8 w-9 items-center justify-center rounded bg-rose-600 font-mono text-sm font-bold text-white shadow-md">
              {padZero(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Button link */}
      {onSeeAllClick && (
        <button
          onClick={onSeeAllClick}
          className="inline-flex items-center justify-start text-xs font-semibold uppercase tracking-wider text-[#0066FF] hover:text-white transition duration-300 gap-1 cursor-pointer group"
        >
          <span>Explore Flash catalog</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
}
export function StockProgressBar({ stock, originalCount = 20 }: { stock: number; originalCount?: number }) {
  const stockRatio = Math.min((stock / originalCount) * 100, 100);
  const colorClass = stock <= 4 ? 'bg-rose-500' : 'bg-amber-500';

  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span>Available: <strong className="text-gray-200">{stock} items</strong></span>
        <span>Claimed: {Math.round(100 - stockRatio)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-500`}
          style={{ width: `${Math.max(stockRatio, 5)}%` }}
        />
      </div>
    </div>
  );
}
