/** Conjunto de ícones de traço (cor herdada). Uso: <Icon name="pin" /> */
export type IconName = "home" | "grid" | "receipt" | "chat" | "area" | "bed" | "bath" | "car" | "pin" | "calendar" | "arrow" | "phone" | "mail" | "clock" | "user" | "key" | "tag" | "chart" | "search" | "doc" | "link" | "shield" | "chev-l" | "chev-r" | "check" | "layers";

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <symbol id="i-home" viewBox="0 0 24 24"><path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/></symbol>
    <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16v11H10l-6 4zM8 9.5h8M8 12.5h5"/></symbol>
    <symbol id="i-area" viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></symbol>
    <symbol id="i-bed" viewBox="0 0 24 24"><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3M6.5 13a1.8 1.8 0 1 0 0-.1"/></symbol>
    <symbol id="i-bath" viewBox="0 0 24 24"><path d="M4 12h16v2.5a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 14.5zM6 12V6.5a2.5 2.5 0 0 1 5 0M7.5 19l-1 2M16.5 19l1 2"/></symbol>
    <symbol id="i-car" viewBox="0 0 24 24"><path d="M5 15l1.6-5.5A2 2 0 0 1 8.5 8h7a2 2 0 0 1 1.9 1.5L19 15M4 15h16v3.5H4zM6.5 18.5V20M17.5 18.5V20M7.5 16.7h.01M16.5 16.7h.01"/></symbol>
    <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h3"/></symbol>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M7 17L17 7M8.5 7H17v8.5"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h3.5l2 5-2.4 1.5a11 11 0 0 0 5.4 5.4L15 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></symbol>
    <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></symbol>
    <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/></symbol>
    <symbol id="i-key" viewBox="0 0 24 24"><circle cx="8" cy="15.5" r="4"/><path d="M11 12.5L20 3.5M16.5 7l3 3M14.5 9l2 2"/></symbol>
    <symbol id="i-tag" viewBox="0 0 24 24"><path d="M3.5 12.5V4h8.5l9 9-8.5 8.5z"/><circle cx="8" cy="8.5" r="1.4"/></symbol>
    <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 20h16M7 16.5v-5M12 16.5v-9M17 16.5v-7"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/></symbol>
    <symbol id="i-doc" viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM14.5 3v4.5H19M9 12h7M9 16h7"/></symbol>
    <symbol id="i-link" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-8.5 8.5M18 14v6H4V6h6"/></symbol>
    <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.7-3.4 7.9-8 9-4.6-1.1-8-4.3-8-9V6z"/><path d="M8.8 12l2.3 2.3 4.2-4.6"/></symbol>
    <symbol id="i-chev-l" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></symbol>
    <symbol id="i-chev-r" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></symbol>
    <symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5M3 16.5l9 5 9-5"/></symbol>
    </svg>
  );
}

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={`i ${className}`.trim()} aria-hidden="true" focusable="false">
      <use href={`#i-${name}`} />
    </svg>
  );
}
