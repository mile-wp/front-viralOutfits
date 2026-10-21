// Íconos SVG inline (trazo 1.75, heredan el color del texto)

const Svg = ({ size = 18, children, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const IconSearch = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const IconUser = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </Svg>
);

export const IconBag = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 13H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const IconArrowUpRight = (p) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Svg>
);

export const IconArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </Svg>
);

export const IconArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M20 12H4" />
    <path d="m10 6-6 6 6 6" />
  </Svg>
);

export const IconEye = (p) => (
  <Svg {...p}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

export const IconEyeOff = (p) => (
  <Svg {...p}>
    <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.7 3.6M6.6 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m2 2 20 20" />
  </Svg>
);

export const IconLock = (p) => (
  <Svg {...p}>
    <rect x="4" y="11" width="16" height="10" rx="1" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);

export const IconTruck = (p) => (
  <Svg {...p}>
    <path d="M2 6h12v10H2z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="6.5" cy="18" r="1.8" />
    <circle cx="17.5" cy="18" r="1.8" />
  </Svg>
);

export const IconCard = (p) => (
  <Svg {...p}>
    <rect x="2" y="5" width="20" height="14" rx="1" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
  </Svg>
);

export const IconRefresh = (p) => (
  <Svg {...p}>
    <path d="M21 4v6h-6" />
    <path d="M3 20v-6h6" />
    <path d="M20 10a8 8 0 0 0-14.3-3.7L3 9M4 14a8 8 0 0 0 14.3 3.7L21 15" />
  </Svg>
);

export const IconShield = (p) => (
  <Svg {...p}>
    <path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const IconChevronDown = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const IconMenu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const IconClose = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const IconTrash = (p) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M9 7V4h6v3" />
  </Svg>
);

export const IconPlus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const IconMinus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const IconCheck = (p) => (
  <Svg {...p}>
    <path d="m5 12 5 5 9-10" />
  </Svg>
);

export const IconFilter = (p) => (
  <Svg {...p}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </Svg>
);

export const IconPackage = (p) => (
  <Svg {...p}>
    <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
    <path d="m3 7.5 9 4.5 9-4.5M12 12v9" />
  </Svg>
);

export const IconMapPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </Svg>
);

export const IconLogout = (p) => (
  <Svg {...p}>
    <path d="M15 4h4v16h-4" />
    <path d="M10 8l-4 4 4 4" />
    <path d="M6 12h10" />
  </Svg>
);

export const IconChat = (p) => (
  <Svg {...p}>
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </Svg>
);

export const IconStore = (p) => (
  <Svg {...p}>
    <path d="M3 9 5 4h14l2 5" />
    <path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0V9Z" />
    <path d="M5 13v7h14v-7" />
  </Svg>
);

export const IconBank = (p) => (
  <Svg {...p}>
    <path d="M3 10 12 4l9 6" />
    <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
    <path d="M3 20h18" />
  </Svg>
);

export const IconWallet = (p) => (
  <Svg {...p}>
    <path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H3V7Z" />
    <path d="M3 7l12-3v3" />
    <circle cx="16.5" cy="13.5" r="1.2" />
  </Svg>
);
