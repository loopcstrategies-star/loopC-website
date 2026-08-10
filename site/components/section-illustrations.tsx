/** Abstract SVG section art — same connected-systems language as the hero. */

import type { ReactNode } from "react";

type ArtProps = { className?: string };

export function PossibilitiesArt({ className = "" }: ArtProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="possBlob" x1="80" y1="40" x2="420" y2="520" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14b8a6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#0f766e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="possStroke" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#5eead4" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <ellipse cx="240" cy="280" rx="200" ry="220" fill="url(#possBlob)" />
      <circle cx="240" cy="280" r="88" stroke="rgba(45,212,191,0.2)" strokeWidth="1" />
      <circle cx="240" cy="280" r="48" stroke="rgba(45,212,191,0.35)" strokeWidth="1.5" />
      <circle cx="240" cy="280" r="18" fill="url(#possStroke)" opacity="0.9" />

      {[
        { x: 240, y: 96, label: "Ops" },
        { x: 380, y: 200, label: "CX" },
        { x: 380, y: 360, label: "Data" },
        { x: 240, y: 464, label: "AI" },
        { x: 100, y: 360, label: "Auto" },
        { x: 100, y: 200, label: "Apps" },
      ].map((n) => (
        <g key={n.label}>
          <line
            x1="240"
            y1="280"
            x2={n.x}
            y2={n.y}
            stroke="rgba(94,234,212,0.35)"
            strokeWidth="1.25"
            strokeDasharray="4 5"
          />
          <rect
            x={n.x - 36}
            y={n.y - 18}
            width="72"
            height="36"
            rx="10"
            fill="rgba(15,23,42,0.78)"
            stroke="rgba(45,212,191,0.45)"
            strokeWidth="1.25"
          />
          <text
            x={n.x}
            y={n.y + 4}
            textAnchor="middle"
            fill="#99f6e4"
            fontSize="11"
            fontFamily="system-ui,sans-serif"
            fontWeight="700"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function PathForkArt({ className = "" }: ArtProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 640 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="forkLine" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#14b8a6" />
          <stop offset="1" stopColor="#5eead4" />
        </linearGradient>
      </defs>
      {/* Stem */}
      <path
        d="M80 110 H220"
        stroke="url(#forkLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="80" cy="110" r="10" fill="#0f766e" stroke="#5eead4" strokeWidth="2" />
      <text x="80" y="148" textAnchor="middle" fill="#0f766e" fontSize="11" fontFamily="system-ui,sans-serif" fontWeight="700">
        Need
      </text>
      {/* Split */}
      <path
        d="M220 110 C280 110 300 50 360 50 H520"
        stroke="url(#forkLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M220 110 C280 110 300 170 360 170 H520"
        stroke="url(#forkLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="220" cy="110" r="7" fill="#14b8a6" />
      {/* ERP end */}
      <rect x="520" y="28" width="100" height="44" rx="12" fill="rgba(15,118,110,0.12)" stroke="#0d9488" strokeWidth="1.5" />
      <text x="570" y="55" textAnchor="middle" fill="#0f766e" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="700">
        ERP
      </text>
      {/* Custom end */}
      <rect x="520" y="148" width="100" height="44" rx="12" fill="rgba(15,23,42,0.06)" stroke="#64748b" strokeWidth="1.5" />
      <text x="570" y="175" textAnchor="middle" fill="#334155" fontSize="13" fontFamily="system-ui,sans-serif" fontWeight="700">
        Custom
      </text>
    </svg>
  );
}

export function WorkflowArt({ className = "" }: ArtProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="wfPanel" x1="40" y1="40" x2="380" y2="440" gradientUnits="userSpaceOnUse">
          <stop stopColor="#134e4a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="36" y="48" width="348" height="384" rx="28" fill="url(#wfPanel)" stroke="rgba(45,212,191,0.25)" strokeWidth="1.5" />
      <rect x="64" y="88" width="160" height="14" rx="4" fill="rgba(94,234,212,0.35)" />
      <rect x="64" y="118" width="240" height="8" rx="3" fill="rgba(148,163,184,0.25)" />
      <rect x="64" y="138" width="200" height="8" rx="3" fill="rgba(148,163,184,0.18)" />

      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(64 ${180 + i * 52})`}>
          <circle cx="12" cy="12" r="12" stroke="#2dd4bf" strokeWidth="1.5" fill="rgba(45,212,191,0.12)" />
          <text x="12" y="16" textAnchor="middle" fill="#5eead4" fontSize="10" fontFamily="system-ui,sans-serif" fontWeight="700">
            {String(i + 1).padStart(2, "0")}
          </text>
          <rect x="36" y="4" width="180" height="8" rx="3" fill="rgba(226,232,240,0.22)" />
          <rect x="36" y="18" width="120" height="6" rx="2" fill="rgba(148,163,184,0.2)" />
          {i < 3 ? (
            <line x1="12" y1="26" x2="12" y2="52" stroke="rgba(45,212,191,0.35)" strokeWidth="1.5" />
          ) : null}
        </g>
      ))}

      <circle cx="340" cy="120" r="28" stroke="rgba(45,212,191,0.4)" strokeWidth="1" fill="none" />
      <circle cx="340" cy="120" r="12" fill="#14b8a6" opacity="0.7" />
      <circle cx="300" cy="380" r="4" fill="#5eead4" opacity="0.6" />
      <circle cx="330" cy="400" r="3" fill="#99f6e4" opacity="0.45" />
    </svg>
  );
}

export function TrustPartnerArt({ className = "" }: ArtProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 480 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="trustBlob" x1="60" y1="40" x2="420" y2="380" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14b8a6" stopOpacity="0.18" />
          <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <ellipse cx="240" cy="210" rx="190" ry="160" fill="url(#trustBlob)" />
      {/* Layered planes echoing hero */}
      <rect x="90" y="100" width="220" height="140" rx="20" fill="rgba(15,23,42,0.06)" stroke="rgba(15,118,110,0.35)" strokeWidth="1.5" transform="rotate(-6 200 170)" />
      <rect x="140" y="130" width="240" height="150" rx="20" fill="rgba(255,255,255,0.85)" stroke="rgba(13,148,136,0.45)" strokeWidth="1.5" />
      <rect x="168" y="158" width="100" height="10" rx="3" fill="rgba(15,118,110,0.45)" />
      <rect x="168" y="182" width="180" height="7" rx="2" fill="rgba(100,116,139,0.25)" />
      <rect x="168" y="200" width="150" height="7" rx="2" fill="rgba(100,116,139,0.18)" />
      <rect x="168" y="230" width="72" height="28" rx="14" fill="#0d9488" opacity="0.85" />
      <circle cx="360" cy="120" r="36" stroke="#14b8a6" strokeWidth="1.5" fill="rgba(20,184,166,0.1)" />
      <circle cx="360" cy="120" r="14" fill="#14b8a6" opacity="0.65" />
      <path d="M100 320 C160 280 220 340 280 300 C320 275 360 310 400 290" stroke="rgba(13,148,136,0.4)" strokeWidth="1.5" strokeDasharray="5 6" />
    </svg>
  );
}

const possibilityMarks: Record<string, ReactNode> = {
  "Business Management": (
    <path d="M4 6h12v10H4V6zm2 2v2h2V8H6zm4 0v2h2V8h-2zM6 12v2h8v-2H6z" fill="currentColor" />
  ),
  "Customer Platforms": (
    <path d="M10 3a3 3 0 110 6 3 3 0 010-6zM4 15c0-2.5 2.5-4 6-4s6 1.5 6 4v1H4v-1z" fill="currentColor" />
  ),
  "Internal Systems": (
    <path d="M3 5h6v6H3V5zm8 0h6v3h-6V5zm0 5h6v6h-6v-6zM3 13h6v3H3v-3z" fill="currentColor" />
  ),
  Automation: (
    <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2zm-5 9l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2zm10 1l.8 1.6L18 15l-1.6.8L15 17.5l-.8-1.7L12.5 15l1.7-.8L15 12.5z" fill="currentColor" />
  ),
  Dashboards: (
    <path d="M3 3h6v8H3V3zm8 0h6v5h-6V3zM3 13h6v4H3v-4zm8 3h6v4h-6v-4zm0-6h6v4h-6V10z" fill="currentColor" />
  ),
  "AI-Powered Applications": (
    <path d="M10 2c3 0 5.5 2 5.5 5.5 0 2-1 3.5-2.5 4.5V14H7v-2c-1.5-1-2.5-2.5-2.5-4.5C4.5 4 7 2 10 2zm-2 14h4v2H8v-2z" fill="currentColor" />
  ),
};

export function PossibilityMark({ title }: { title: string }) {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" aria-hidden>
      {possibilityMarks[title] ?? (
        <circle cx="10" cy="10" r="4" fill="currentColor" />
      )}
    </svg>
  );
}

const whyMarks = [
  // Business First
  <path key="0" d="M10 2l2 4 4 .5-3 3 .8 4.5L10 12l-3.8 2.2.8-4.5-3-3L10 2z" fill="currentColor" />,
  // One Team
  <path key="1" d="M7 8a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm6 0a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM3 15c0-2 2-3.5 4-3.5s4 1.5 4 3.5v1H3v-1zm10 0c0-1 .4-1.8 1-2.4.6.3 1.3.4 2 .4 2 0 4 1.5 4 3.5v1h-7v-1z" fill="currentColor" />,
  // Built Around You
  <path key="2" d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 3v4l3 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />,
  // Quality
  <path key="3" d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  // Scalable
  <path key="4" d="M3 15V9h4v6H3zm5 0V5h4v10H8zm5 0V3h4v12h-4z" fill="currentColor" />,
  // Support
  <path key="5" d="M10 3c-3 0-5.5 2-5.5 5v2H3v4h4v-4H5.5V8c0-2.2 1.8-3.5 4.5-3.5S14.5 5.8 14.5 8v2H13v4h4v-4h-1.5V8c0-3-2.5-5-5.5-5z" fill="currentColor" />,
];

export function WhyMark({ index }: { index: number }) {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" aria-hidden>
      {whyMarks[index] ?? <circle cx="10" cy="10" r="4" fill="currentColor" />}
    </svg>
  );
}
