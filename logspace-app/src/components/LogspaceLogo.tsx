interface Props {
  size?: number;
  color?: string;
  className?: string;
}

export default function LogspaceLogo({ size = 28, color = "currentColor", className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logspace"
    >
      {/* Outer chat bubble — open gap at top-right */}
      <path
        d="
          M 72 14
          L 22 14
          Q 10 14 10 26
          L 10 62
          Q 10 74 22 74
          L 36 74
          L 36 88
          Q 36 91 39 89
          L 58 74
          L 72 74
          Q 84 74 84 62
          L 84 36
        "
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Top-right curl — the open end */}
      <path
        d="M 72 14 Q 84 14 84 26 L 84 36"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Line 1 */}
      <line
        x1="30" y1="40"
        x2="64" y2="40"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Line 2 — shorter */}
      <line
        x1="30" y1="56"
        x2="54" y2="56"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}
