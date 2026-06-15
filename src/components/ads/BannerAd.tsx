"use client";

import React, { useEffect, useRef, useState } from "react";

export default function BannerAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const adKey = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  import Script from "next/script";

  // inside component return block, after container div
  {adKey && (
    <>
      <Script id={`adsterra-${adKey}`} strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: `
        var atOptions = {
          'key' : '${adKey}',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      ` }} />
      <Script src={`//www.highperformanceformat.com/${adKey}/invoke.js`} strategy="lazyOnload" />
    </>
  )}

  return (
    <div className="w-full flex justify-center py-4 my-2">
      <div 
        ref={adRef}
        className="w-full max-w-[728px] h-[90px] flex items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-xs text-zinc-400 dark:text-zinc-500 font-medium"
      >
        {!adKey ? (
          <div className="text-center">
            <span className="block font-bold uppercase tracking-wider text-[10px] text-zinc-400 mb-1">Sponsored Ad</span>
            <span>Banner Ad Placeholder (728x90)</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
