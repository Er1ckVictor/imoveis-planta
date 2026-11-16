import { site } from '@/lib/site';

export function BrandMark({ strokeWidth = 4 }: { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      <rect x="6" y="6" width="52" height="52" />
      <path d="M6 34 H34 V6 M34 46 V58 M46 34 H58" />
    </svg>
  );
}

export function Brand() {
  return (
    <a className="brand" href="#" aria-label={`${site.name}, início`}>
      <BrandMark />
      {site.brand}
    </a>
  );
}
