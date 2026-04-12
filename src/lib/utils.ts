export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).map(x => {
    if (typeof x === 'string') return x;
    if (typeof x === 'object' && x !== null) {
      if (Array.isArray(x)) return x.filter(Boolean).join(' ');
      return Object.keys(x).filter(k => x[k]).join(' ');
    }
    return '';
  }).join(' ').replace(/\s+/g, ' ').trim();
}

/** Relative time in English for dashboard labels (e.g. "2 hours ago"). */
export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
