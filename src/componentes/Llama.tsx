import { useEffect, useRef, useState } from 'react'

/**
 * La mascota de la app.
 *
 * Es un SVG y no una imagen: pesa nada, se ve nítida en cualquier tamaño y
 * los colores salen de la misma paleta que el resto.
 *
 * Las animaciones viven en index.css (`.llama-*`). Son de reposo y lentas a
 * propósito: respira, parpadea, mueve las orejas y la cola. Tiene que sentirse
 * viva de reojo, no pedir atención.
 */
export type Humor = 'feliz' | 'pensando' | 'dormida'

interface Props {
  humor?: Humor
  className?: string
  /** Si es true, se le puede tocar y pega un saltito. */
  interactiva?: boolean
}

export function Llama({ humor = 'feliz', className = '', interactiva = false }: Props) {
  const [saltando, setSaltando] = useState(false)
  const temporizador = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(temporizador.current), [])

  const saltar = () => {
    if (saltando) return
    setSaltando(true)
    temporizador.current = setTimeout(() => setSaltando(false), 700)
  }

  const dibujo = (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <linearGradient id="llama-lana" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFAF4" />
          <stop offset="100%" stopColor="#F2DFCC" />
        </linearGradient>
        <linearGradient id="llama-cara" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDF3E9" />
          <stop offset="100%" stopColor="#F3E0CD" />
        </linearGradient>
      </defs>

      {/* Todo el dibujo baja y se achica un poco para dejarle aire al gorro,
          que es alto y si no se cortaba contra el borde de arriba. */}
      <g transform="translate(0 12) scale(0.9)">
      {/* La sombra queda fuera del grupo que flota, así el salto se nota. */}
      <ellipse cx="100" cy="188" rx="44" ry="6" fill="#E4D6C6" opacity="0.55" />

      <g className={`llama-flotar ${saltando ? 'llama-salto' : ''}`}>
        {/* Cola, detrás de todo */}
        <g className="llama-cola">
          <path d="M52 124 q-14 4 -16 16 q8 -4 14 -2 z" fill="#EFDCC9" stroke="#E0CBB5" strokeWidth="2" />
          <circle cx="52" cy="124" r="9" fill="url(#llama-lana)" stroke="#E0CBB5" strokeWidth="2" />
        </g>

        {/* Patas con pezuñas */}
        {[70, 89, 111, 130].map((x) => (
          <g key={x}>
            <rect x={x} y="146" width="14" height="40" rx="7" fill="#EFDCC9" stroke="#E0CBB5" strokeWidth="1.5" />
            <rect x={x} y="176" width="14" height="10" rx="5" fill="#D9C3AC" />
          </g>
        ))}

        {/* Cuerpo lanudo: varios bollos para que se lea la lana */}
        <g className="llama-cuerpo">
          <g fill="url(#llama-lana)" stroke="#E0CBB5" strokeWidth="2.5">
            <ellipse cx="100" cy="137" rx="51" ry="33" />
            <circle cx="60" cy="130" r="16" />
            <circle cx="140" cy="130" r="16" />
            <circle cx="78" cy="112" r="15" />
            <circle cx="100" cy="107" r="15" />
            <circle cx="122" cy="112" r="15" />
          </g>
          {/* Mantita andina: el golpe de color */}
          <path d="M70 134 q30 15 60 0 l-5 23 q-25 11 -50 0 z" fill="var(--color-lila-300)" opacity="0.9" />
          <path d="M69 142 q31 14 62 0" stroke="var(--color-rosa-300)" strokeWidth="3.5" fill="none" />
          <path d="M67 150 q33 14 66 0" stroke="var(--color-salvia-200)" strokeWidth="2.5" fill="none" />
          <path
            d="M74 157 l4 5 l4 -5 M92 160 l4 5 l4 -5 M110 160 l4 5 l4 -5"
            stroke="var(--color-rosa-300)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Cuello y cabeza se mueven juntos */}
        <g className="llama-cabeza">
          <path
            d="M88 120 q-2 -35 2 -52 q10 -6 20 0 q4 17 2 52 z"
            fill="url(#llama-lana)"
            stroke="#E0CBB5"
            strokeWidth="2.5"
          />

          <ellipse cx="100" cy="52" rx="27" ry="25" fill="url(#llama-cara)" stroke="#E0CBB5" strokeWidth="2.5" />

          {/* Flequillo */}
          <path
            d="M74 44 q6 -18 26 -17 q20 -1 26 17 q-13 -7 -26 -6 q-13 -1 -26 6 z"
            fill="#FFFAF4"
            stroke="#E0CBB5"
            strokeWidth="2"
          />
          <path d="M92 30 q4 6 2 12 M108 30 q-4 6 -2 12" stroke="#E7D5C3" strokeWidth="1.5" fill="none" />

          {/* Gorro de chef. Va después de la cabeza y del flequillo para
              apoyarse encima; las orejas asoman a los costados. */}
          <g>
            <circle cx="88" cy="10" r="11.5" fill="#FFFCF8" stroke="#E0CBB5" strokeWidth="2" />
            <circle cx="112" cy="10" r="11.5" fill="#FFFCF8" stroke="#E0CBB5" strokeWidth="2" />
            <circle cx="100" cy="2" r="13" fill="#FFFCF8" stroke="#E0CBB5" strokeWidth="2" />
            {/* Relleno sin borde: funde los tres bollos en una sola nube */}
            <circle cx="100" cy="9" r="13" fill="#FFFCF8" />
            <rect x="80" y="17" width="40" height="11" rx="5.5" fill="#FFF8F1" stroke="#E0CBB5" strokeWidth="2" />
            <path d="M83 22.5 h34" stroke="var(--color-salvia-200)" strokeWidth="2.2" strokeLinecap="round" />
          </g>

          {/* Orejas. Van después del gorro y abiertas hacia los costados:
              si quedan detrás, el gorro se las come. */}
          <g className="llama-oreja-izq">
            <path d="M86 32 Q76 18 73 3 Q85 14 94 28 Z" fill="#EFDCC9" stroke="#E0CBB5" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M85 28 Q79 19 77 10 Q83 18 89 26 Z" fill="var(--color-rosa-100)" />
          </g>
          <g className="llama-oreja-der">
            <path d="M114 32 Q124 18 127 3 Q115 14 106 28 Z" fill="#EFDCC9" stroke="#E0CBB5" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M115 28 Q121 19 123 10 Q117 18 111 26 Z" fill="var(--color-rosa-100)" />
          </g>

          {/* Hocico */}
          <ellipse cx="100" cy="63" rx="16.5" ry="13" fill="#FBEFE4" stroke="#E0CBB5" strokeWidth="2" />
          <ellipse cx="95" cy="58" rx="1.8" ry="1.3" fill="#C4AC96" />
          <ellipse cx="105" cy="58" rx="1.8" ry="1.3" fill="#C4AC96" />
          <path
            d={humor === 'feliz' ? 'M94 64 q6 6 12 0' : 'M95 65 q5 3 10 0'}
            stroke="#C09A80"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Ojos */}
          {humor === 'dormida' ? (
            <g stroke="#4A423C" strokeWidth="2.8" fill="none" strokeLinecap="round">
              <path d="M83 46 q6 6 12 0" />
              <path d="M105 46 q6 6 12 0" />
            </g>
          ) : (
            <>
              <g className="llama-ojo">
                <ellipse cx="89" cy="46" rx="4.2" ry="4.6" fill="#4A423C" />
                <circle cx="90.6" cy="44.4" r="1.5" fill="#FFF" />
              </g>
              <g className="llama-ojo">
                <ellipse cx="111" cy="46" rx="4.2" ry="4.6" fill="#4A423C" />
                <circle cx="112.6" cy="44.4" r="1.5" fill="#FFF" />
              </g>
              {/* Pestañas */}
              <path
                d="M83 40 l-3 -3 M89 38.5 l0 -3.5 M117 40 l3 -3 M111 38.5 l0 -3.5"
                stroke="#4A423C"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Cachetes */}
          <ellipse cx="77" cy="57" rx="6.5" ry="4.5" fill="var(--color-rosa-300)" opacity="0.5" />
          <ellipse cx="123" cy="57" rx="6.5" ry="4.5" fill="var(--color-rosa-300)" opacity="0.5" />

          {/* Florcita prendida en el gorro */}
          <g transform="translate(111 22.5)">
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="0" cy="-3.2" rx="2.1" ry="3.2" fill="var(--color-rosa-300)" transform={`rotate(${a})`} />
            ))}
            <circle r="1.8" fill="var(--color-durazno-300)" />
          </g>
        </g>

        {/* Dormida: los zzz suben en fila */}
        {humor === 'dormida' && (
          <g fill="var(--color-lila-300)" fontWeight="bold" fontSize="15">
            <text className="llama-zzz" x="134" y="34">z</text>
            <text className="llama-zzz llama-zzz-2" x="143" y="27">z</text>
            <text className="llama-zzz llama-zzz-3" x="153" y="20">z</text>
          </g>
        )}

        {/* Pensando: los puntitos de "está por decir algo" */}
        {humor === 'pensando' && (
          <g fill="var(--color-lila-300)">
            <circle className="llama-zzz" cx="136" cy="33" r="2.6" />
            <circle className="llama-zzz llama-zzz-2" cx="145" cy="27" r="3.4" />
            <circle className="llama-zzz llama-zzz-3" cx="155" cy="20" r="4.2" />
          </g>
        )}
      </g>
      </g>
    </svg>
  )

  if (!interactiva) {
    return (
      <div className={`llama ${className}`} role="img" aria-label="Llamachef, la asistente de cocina">
        {dibujo}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={saltar}
      className={`llama cursor-pointer ${className}`}
      aria-label="Llamachef, la asistente de cocina. Tocala para saludarla."
    >
      {dibujo}
    </button>
  )
}
