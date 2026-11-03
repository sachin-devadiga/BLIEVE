"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Hero background video with automatic audio.
 *
 * Browsers only allow autoplay while muted, so the clip starts silent. An
 * IntersectionObserver then owns the sound:
 *   - hero scrolled out of view  -> audio mutes automatically
 *   - hero back in view          -> audio turns back on automatically
 *
 * If the browser blocks unmuting (no user gesture yet), it falls back to
 * silent and the button stays available; after the first click the browser
 * grants permission and the auto-on behaviour works from then on.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const applyMuted = useCallback((next: boolean) => {
    const el = videoRef.current;
    setMuted(next);
    if (!el) return;

    el.muted = next;
    if (next) return;

    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        // Sound blocked without a user gesture — revert to silent autoplay.
        el.muted = true;
        setMuted(true);
        const retry = el.play();
        if (retry && typeof retry.catch === "function") retry.catch(() => {});
      });
    }
  }, []);

  // Mute when the hero leaves the viewport, unmute when it returns.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        applyMuted(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [applyMuted]);

  const toggleSound = () => applyMuted(!muted);

  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Readability overlay so white text stays legible over the footage */}
      <div
        className="absolute inset-0 bg-navy/55 dark:bg-[#080F24]/70 pointer-events-none"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? "Turn video sound on" : "Mute video sound"}
        className="absolute bottom-8 right-4 sm:right-6 lg:right-8 z-20 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors"
      >
        {muted ? (
          <Volume2 size={16} aria-hidden="true" />
        ) : (
          <VolumeX size={16} aria-hidden="true" />
        )}
        {muted ? "Sound on" : "Mute"}
      </button>
    </>
  );
}
