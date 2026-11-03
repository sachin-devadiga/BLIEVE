"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export default function TypingEffect({
  words,
  speed = 100,
  deleteSpeed = 50,
  pauseDuration = 2000,
}: {
  words: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      setText(currentWord.substring(0, text.length - 1));
      if (text.length === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      setText(currentWord.substring(0, text.length + 1));
      if (text.length === currentWord.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    }
  }, [text, wordIndex, isDeleting, words, pauseDuration]);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, deleteSpeed, speed, mounted]);

  if (!mounted) {
    return <span className="inline-block">{words[0]}</span>;
  }

  return (
    <span className="inline-block">
      {text}
      <span className="animate-pulse text-orange">|</span>
    </span>
  );
}
