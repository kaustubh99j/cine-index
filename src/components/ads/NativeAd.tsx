"use client";

import React, { useEffect, useRef, useState } from "react";

export default function NativeAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const adKey = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !adKey || !adRef.current) return;

    adRef.current.innerHTML = "";

    const container = adRef.current;
    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const scriptLoad = document.createElement("script");
    scriptLoad.type = "text/javascript";
    scriptLoad.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    container.appendChild(scriptConfig);
    container.appendChild(scriptLoad);
  }, [isMounted, adKey]);

  return (
    <div className="w-full flex justify-center py-4 my-2">
      <div 
        ref={adRef}
        className="w-full max-w-[300px] h-[250px] flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-xs text-zinc-400 dark:text-zinc-500 font-medium"
      >
        {!adKey ? (
          <div className="text-center">
            <span className="block font-bold uppercase tracking-wider text-[10px] text-zinc-400 mb-1">Sponsored Ad</span>
            <span>Native Ad Placeholder (300x250)</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
