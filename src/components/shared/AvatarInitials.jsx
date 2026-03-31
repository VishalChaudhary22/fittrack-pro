export default function AvatarInitials({ initials, color, size = 40, borderWidth = 2 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `${borderWidth}px solid ${color}60`,
      background: `${color}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700, fontSize: size * 0.35,
      color: color,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}
