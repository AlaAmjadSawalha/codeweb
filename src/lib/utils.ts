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
