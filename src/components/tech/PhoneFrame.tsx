import type { ReactNode } from 'react';

/** Status-bar glyphs drawn in SVG so the frame reads like a real handset. */
const StatusIcons = ({ color }: { color: string }) => (
  <div className="flex items-center gap-[5px]" aria-hidden>
    <svg width="17" height="11" viewBox="0 0 17 11" fill={color}>
      <rect x="0" y="7" width="3" height="4" rx="1" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M1.2 4a9 9 0 0 1 12.6 0M3.6 6.5a5.5 5.5 0 0 1 7.8 0" />
      <circle cx="7.5" cy="9.2" r="1.2" fill={color} stroke="none" />
    </svg>
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke={color} strokeOpacity=".45" />
      <rect x="2" y="2" width="15" height="8" rx="2" fill={color} />
      <path d="M23 4v4" stroke={color} strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </div>
);

type PhoneFrameProps = {
  children: ReactNode;
  /** Colour of the status bar text and icons, to suit what's under it. */
  statusTone?: 'light' | 'dark';
  screenClassName?: string;
};

/** A modern handset: rounded bezel, side buttons, dynamic island, status bar and home indicator. */
export const PhoneFrame = ({ children, statusTone = 'light', screenClassName = '' }: PhoneFrameProps) => {
  const ink = statusTone === 'light' ? '#ffffff' : '#0b0f14';
  return (
    <div className="relative mx-auto w-[300px] max-w-full">
      {/* Side buttons */}
      <span aria-hidden className="absolute -left-[3px] top-[118px] h-8 w-[3px] rounded-l bg-[#2a2d33]" />
      <span aria-hidden className="absolute -left-[3px] top-[166px] h-14 w-[3px] rounded-l bg-[#2a2d33]" />
      <span aria-hidden className="absolute -left-[3px] top-[230px] h-14 w-[3px] rounded-l bg-[#2a2d33]" />
      <span aria-hidden className="absolute -right-[3px] top-[190px] h-20 w-[3px] rounded-r bg-[#2a2d33]" />

      <div className="rounded-[52px] bg-gradient-to-b from-[#3a3d44] via-[#1b1d22] to-[#2b2e35] p-[3px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.85),0_30px_60px_-30px_rgba(0,0,0,0.6)]">
        <div className="rounded-[49px] bg-black p-[9px]">
          <div className={`relative h-[610px] overflow-hidden rounded-[40px] ${screenClassName}`}>
            {children}

            {/* Status bar and dynamic island sit above the app */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[46px] items-center justify-between px-7 pt-1">
              <span className="text-[14px] font-semibold tracking-tight" style={{ color: ink }}>9:41</span>
              <StatusIcons color={ink} />
            </div>
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-[11px] z-40 h-[27px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[7px] left-1/2 z-40 h-[5px] w-[110px] -translate-x-1/2 rounded-full"
              style={{ backgroundColor: statusTone === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.75)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/** Small print under a demo, so sample data is never mistaken for live figures. */
export const DemoNote = ({ children = 'Illustrative demo · sample data' }: { children?: ReactNode }) => (
  <p className="mt-5 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-white/35">{children}</p>
);
