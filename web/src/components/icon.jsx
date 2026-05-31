const paths = {
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  back: <path d="M15 18l-6-6 6-6" />,
  share: (
    <>
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M5 13v6h14v-6" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="M8 11l4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </>
  ),
  check: <path d="M5 12l4 4 9-10" />,
  sparkle: <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />,
  refresh: (
    <>
      <path d="M4 11a8 8 0 0 1 14-5l2 2" />
      <path d="M20 5v4h-4" />
      <path d="M20 13a8 8 0 0 1-14 5l-2-2" />
      <path d="M4 19v-4h4" />
    </>
  ),
};

export function Icon({ name, size = 20, className, stroke = 1.6 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
