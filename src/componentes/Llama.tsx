/**
 * La mascota de la app.
 *
 * Es un SVG y no una imagen: pesa nada, se ve nítida en cualquier pantalla y
 * los colores salen de la misma paleta que el resto (`currentColor` y tokens).
 */
export type Humor = 'feliz' | 'pensando' | 'dormida'

export function Llama({ humor = 'feliz', className = '' }: { humor?: Humor; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Llamita, la asistente de cocina"
    >
      <defs>
        <linearGradient id="lana" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF8F1" />
          <stop offset="100%" stopColor="#F6E7D8" />
        </linearGradient>
      </defs>

      {/* Sombra en el piso */}
      <ellipse cx="100" cy="186" rx="46" ry="7" fill="#EADFD3" opacity="0.6" />

      {/* Patas */}
      {[72, 92, 112, 132].map((x) => (
        <rect key={x} x={x} y="150" width="13" height="36" rx="6.5" fill="#F0DFCE" />
      ))}

      {/* Cuerpo lanudo */}
      <g fill="url(#lana)" stroke="#E7D5C3" strokeWidth="2.5">
        <ellipse cx="100" cy="140" rx="54" ry="36" />
        <circle cx="62" cy="132" r="17" />
        <circle cx="138" cy="132" r="17" />
        <circle cx="80" cy="115" r="16" />
        <circle cx="120" cy="115" r="16" />
      </g>

      {/* Mantita: el toque de color */}
      <path
        d="M70 138 q30 14 60 0 l-4 20 q-26 11 -52 0 z"
        fill="var(--color-lila-300)"
        opacity="0.85"
      />
      <path d="M70 146 q30 13 60 0" stroke="var(--color-rosa-300)" strokeWidth="3" fill="none" />

      {/* Cuello */}
      <rect x="88" y="66" width="24" height="60" rx="12" fill="#F6E7D8" stroke="#E7D5C3" strokeWidth="2.5" />

      {/* Orejas */}
      <g stroke="#E7D5C3" strokeWidth="2.5">
        <path d="M82 40 q-5 -20 4 -24 q9 4 6 24 z" fill="#F6E7D8" />
        <path d="M118 40 q5 -20 -4 -24 q-9 4 -6 24 z" fill="#F6E7D8" />
      </g>

      {/* Cabeza */}
      <ellipse cx="100" cy="56" rx="27" ry="25" fill="url(#lana)" stroke="#E7D5C3" strokeWidth="2.5" />
      {/* Flequillo */}
      <path d="M76 46 q10 -14 24 -13 q14 -1 24 13 q-24 8 -48 0 z" fill="#FFF8F1" stroke="#E7D5C3" strokeWidth="2" />
      {/* Hocico */}
      <ellipse cx="100" cy="66" rx="16" ry="13" fill="#FBEDE1" stroke="#E7D5C3" strokeWidth="2" />
      <path d="M96 64 q4 4 8 0" stroke="#C9B3A0" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Ojos, según el humor */}
      {humor === 'dormida' ? (
        <g stroke="#4A423C" strokeWidth="2.8" fill="none" strokeLinecap="round">
          <path d="M84 52 q5 5 10 0" />
          <path d="M106 52 q5 5 10 0" />
        </g>
      ) : humor === 'pensando' ? (
        <g fill="#4A423C">
          <circle cx="89" cy="52" r="3.4" />
          <circle cx="111" cy="50" r="3.4" />
        </g>
      ) : (
        <g fill="#4A423C">
          <circle cx="89" cy="52" r="3.6" />
          <circle cx="111" cy="52" r="3.6" />
          <circle cx="90.4" cy="50.8" r="1.2" fill="#FFF" />
          <circle cx="112.4" cy="50.8" r="1.2" fill="#FFF" />
        </g>
      )}

      {/* Cachetes */}
      <ellipse cx="78" cy="61" rx="6" ry="4" fill="var(--color-rosa-300)" opacity="0.55" />
      <ellipse cx="122" cy="61" rx="6" ry="4" fill="var(--color-rosa-300)" opacity="0.55" />

      {humor === 'dormida' && (
        <text x="136" y="36" fontSize="18" fill="var(--color-lila-300)" fontWeight="bold">
          z
        </text>
      )}
    </svg>
  )
}
