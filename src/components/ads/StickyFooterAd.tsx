"use client";

import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function StickyFooterAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const adKey = process.env.NEXT_PUBLIC_ADSTERRA_STICKY_KEY;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !adKey || !adRef.current || isDismissed) return;

    adRef.current.innerHTML = "";

    const container = adRef.current;
    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const scriptLoad = document.createElement("script");
    scriptLoad.type = "text/javascript";
    scriptLoad.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    container.appendChild(scriptConfig);
    container.appendChild(scriptLoad);
  }, [isMounted, adKey, isDismissed]);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] w-full flex justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 p-2 shadow-2xl animate-slide-up">
      <div className="relative w-full max-w-[320px] h-[50px] flex items-center justify-center">
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-md border border-zinc-700/50 transition-colors z-[91] cursor-pointer"
          aria-label="Close Ad"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Ad container */}
        <div 
          ref={adRef}
          className="w-[320px] h-[50px] flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-850 bg-zinc-50 dark:bg-zinc-900/40 text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold rounded-lg"
        >
          {!adKey ? (
            <span>Sticky Footer Ad (320x50)</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
