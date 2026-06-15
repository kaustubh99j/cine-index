"use client";

import React, { useEffect, useRef, useState } from "react";

export default function SidebarAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const adKey = process.env.NEXT_PUBLIC_ADSTERRA_SIDEBAR_KEY;

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
        'height' : 600,
        'width' : 160,
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
        className="w-[160px] h-[600px] flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-xs text-zinc-400 dark:text-zinc-500 font-medium"
      >
        {!adKey ? (
          <div className="text-center p-4">
            <span className="block font-bold uppercase tracking-wider text-[10px] text-zinc-400 mb-2">Ad</span>
            <span>Sidebar Ad Placeholder (160x600)</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
