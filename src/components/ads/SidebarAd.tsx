"use client";

import React, { useEffect, useRef, useState } from "react";

export default function SidebarAd() {
  const adRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !adRef.current) return;

    const container = adRef.current;
    container.innerHTML = "";

    // Native Banner Ad (reused for sidebar)
    const nativeScript = document.createElement("script");
    nativeScript.async = true;
    nativeScript.setAttribute("data-cfasync", "false");
    nativeScript.src = "https://pl29751518.effectivecpmnetwork.com/0259af392380d6ba0996f552f6831a6f/invoke.js";

    const nativeDiv = document.createElement("div");
    nativeDiv.id = "container-0259af392380d6ba0996f552f6831a6f-sidebar";

    container.appendChild(nativeDiv);
    container.appendChild(nativeScript);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, [isMounted]);

  return (
    <div className="w-full flex justify-center py-4 my-2">
      <div
        ref={adRef}
        className="w-[160px] min-h-[300px] flex items-center justify-center rounded-xl overflow-hidden"
      />
    </div>
  );
}
