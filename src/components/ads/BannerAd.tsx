"use client";

import React, { useEffect, useRef, useState } from "react";

export default function BannerAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !adRef.current) return;

    const container = adRef.current;
    // Clear any previous ad content
    container.innerHTML = "";

    // Native Banner Ad
    const nativeScript = document.createElement("script");
    nativeScript.async = true;
    nativeScript.setAttribute("data-cfasync", "false");
    nativeScript.src = "https://pl29751518.effectivecpmnetwork.com/0259af392380d6ba0996f552f6831a6f/invoke.js";
    
    const nativeDiv = document.createElement("div");
    nativeDiv.id = "container-0259af392380d6ba0996f552f6831a6f";

    container.appendChild(nativeDiv);
    container.appendChild(nativeScript);

    // Standard Banner Ad (728x90)
    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.innerHTML = `
      atOptions = {
        'key' : '511428db5bc1f6b439946cfdcdf2a9e2',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const scriptLoad = document.createElement("script");
    scriptLoad.type = "text/javascript";
    scriptLoad.src = "https://www.highperformanceformat.com/511428db5bc1f6b439946cfdcdf2a9e2/invoke.js";

    container.appendChild(scriptConfig);
    container.appendChild(scriptLoad);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, [isMounted]);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 my-2">
      <div
        ref={adRef}
        className="w-full max-w-[728px] min-h-[90px] flex items-center justify-center rounded-xl overflow-hidden"
      />
    </div>
  );
}
