interface LogoTileProps {
  name: string;
  size?: number;
  color?: string;
}

const TILE_COLORS = [
  "#FF4D7A", "#8B5CF6", "#10B981", "#3B82F6",
  "#EC4899", "#F97316", "#14B8A6", "#22C55E",
  "#A855F7", "#0EA5E9", "#F59E0B", "#6366F1",
];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return TILE_COLORS[Math.abs(hash) % TILE_COLORS.length] ?? "#FF4D7A";
}

export function LogoTile({ name, size = 40, color }: LogoTileProps) {
  const bg = color ?? colorForName(name);
  const initials = name
    .split(/[\s(\-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      style={{
        width: size, height: size, borderRadius: Math.round(size * 0.28),
        background: bg, display: "flex", alignItems: "center", justifyContent: "center",
        flex: "none", color: "#fff", fontWeight: 800,
        fontSize: size <= 32 ? 11 : size <= 48 ? 14 : 18,
        letterSpacing: "-0.02em", userSelect: "none",
      }}
    >
      {initials || (name[0]?.toUpperCase() ?? "?")}
    </div>
  );
}
