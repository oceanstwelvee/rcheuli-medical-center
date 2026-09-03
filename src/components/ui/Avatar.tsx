// PLACEHOLDER — заменяется через админку (загрузка фото врача в Supabase Storage).
// Letter-avatar: first letter of the doctor's name on a colored circle.
const PALETTE = [
  "#E4A13A", // dark yellow
  "#D9736A", // light red
  "#4A7A6E",
  "#5B6EA8",
  "#A8734F",
  "#7A8C4A",
];

function colorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({
  name,
  photoUrl,
  size = 96,
}: {
  name: string;
  photoUrl?: string | null;
  size?: number;
}) {
  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const letter = name.trim().charAt(0).toUpperCase() || "?";
  const bg = colorForName(name || "?");

  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.4,
      }}
      aria-hidden
    >
      {letter}
    </div>
  );
}
