/**
 * Line icons — single consistent stroke system (1.6px, round caps). Kept as
 * inline SVG so there is no icon-font dependency and each mark can be tuned.
 */
type IconProps = React.SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const Icon = {
  Chat: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H9l-4 3.5V15H6.5" />
      <path d="M8 8h8M8 11h5" />
    </Svg>
  ),
  Gauge: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M12 15l3.5-4" />
      <circle cx="12" cy="15" r="1" />
    </Svg>
  ),
  Calendar: (p: IconProps) => (
    <Svg {...p}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4M9 13h2M9 16h6" />
    </Svg>
  ),
  Spark: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5 13.4 11l2.6 1-2.6 1L12 15.5 10.6 13 8 12l2.6-1z" />
    </Svg>
  ),
  Doc: (p: IconProps) => (
    <Svg {...p}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 15h6M9 9h2" />
    </Svg>
  ),
  Users: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 7a3 3 0 0 1 0 6M17 20a5.5 5.5 0 0 0-2.5-4.6" />
    </Svg>
  ),
  Megaphone: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l7 4V5L7 9H5a1 1 0 0 0-1 1Z" />
      <path d="M18 8a5 5 0 0 1 0 8" />
    </Svg>
  ),
  Globe: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" />
    </Svg>
  ),
  Kanban: (p: IconProps) => (
    <Svg {...p}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 4v9M15 4v6" />
    </Svg>
  ),
  Flow: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="4" width="6" height="5" rx="1.2" />
      <rect x="15" y="15" width="6" height="5" rx="1.2" />
      <path d="M6 9v4a2 2 0 0 0 2 2h7" />
    </Svg>
  ),
  Cap: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 4 3 8l9 4 9-4-9-4Z" />
      <path d="M7 10.5V14c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-3.5M21 8v4.5" />
    </Svg>
  ),
  Prototype: (p: IconProps) => (
    <Svg {...p}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 3v4h6V3M8 12h5M8 15h8" />
    </Svg>
  ),
  Check: (p: IconProps) => (
    <Svg {...p}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </Svg>
  ),
  Arrow: (p: IconProps) => (
    <Svg {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  ),
  Shield: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 3 5 6v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  Lock: (p: IconProps) => (
    <Svg {...p}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
    </Svg>
  ),
  Mail: (p: IconProps) => (
    <Svg {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Svg>
  ),
  Clock: (p: IconProps) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </Svg>
  ),
  Plus: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  ),
  ChevronDown: (p: IconProps) => (
    <Svg {...p}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  ),
  Menu: (p: IconProps) => (
    <Svg {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  ),
  Upload: (p: IconProps) => (
    <Svg {...p}>
      <path d="M12 16V5M8 9l4-4 4 4" />
      <path d="M5 15v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" />
    </Svg>
  ),
};

export type IconName = keyof typeof Icon;
