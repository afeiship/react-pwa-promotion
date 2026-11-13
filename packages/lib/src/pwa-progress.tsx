import { useEffect, useState } from 'react';
import { CLASS_NAME } from './constants';

// Fake progress bar pinned to the top edge of the prompt. On activate it jumps
// to 20%, then creeps asymptotically towards 90% and never reaches 100% — the
// page reload makes the whole prompt vanish before it "finishes".
export default function PwaProgress({ active }: { active: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    setProgress(20);
    const timer = setInterval(() => {
      setProgress((p) => Math.min(90, p + Math.max(0.4, (90 - p) * 0.1)));
    }, 250);
    return () => clearInterval(timer);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className={`${CLASS_NAME}__progress`}
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}
