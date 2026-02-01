"use client"

import { useState, useEffect, useCallback } from "react"

// ========================================
// CONFIGURACIÓN - EDITAR AQUÍ
// ========================================
const TARGET_DATE = new Date("2026-02-01T00:00:00-03:00")
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=80"

// Galería con frases personalizables - EDITAR LAS FRASES AQUÍ
const GALLERY_ITEMS = [
  {
    image: "/foto1.jpeg",
    phrase: "Noche fallida de disfraces",
  },
  {
    image: "/foto2.jpeg",
    phrase: "Uno de nuestros superclasicos adentro", // ← EDITAR
  },
  {
    image: "/foto3.jpeg",
    phrase: "Una de nuestras cenitas en RD", // ← EDITAR
  },
  {
    image: "/foto4.jpeg",
    phrase: "Cuando nos preparabamos para salir despues de la playa", // ← EDITAR
  },
  {
    image: "/foto5.jpeg",
    phrase: "Otra mas", // ← EDITAR
  },
  {
    image: "/foto10.jpeg",
    phrase: "El atardecer hermoso en RD", // ← EDITAR
  },
  {
    image: "/foto7.jpeg",
    phrase: "Uno de los primeros dias de nuestro mejor viaje", // ← EDITAR
  },
  {
    image: "/foto8.jpeg",
    phrase: "Disfrutando de la pile", // ← EDITAR
  },
  {
    image: "/foto11.jpeg",
    phrase: "Otra del atardecer", // ← EDITAR
  },
  {
    image: "/foto15.jpeg",
    phrase: "La ultima del atardecer te juro", // ← EDITAR
  },
  {
    image: "/foto20.jpeg",
    phrase: "Nuestro primer partido en el Monu", // ← EDITAR
  },
  {
    image: "/foto21.jpeg",
    phrase: "Fotito en el club"
  },
  {
    image: "/foto22.jpeg",
    phrase: "Otraa jeje"
  },
  {
    image: "/foto23.jpeg",
    phrase: "Un cumpleañitos tuyo en 2024"
  },
]

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface Vale {
  id: string
  hint: string
  icon: string
  title: string
  description: string
  detailsType: "info" | "options"
  details?: string
  options?: string[]
  emoji: string
  color: string
}

const vales: Vale[] = [
  {
    id: "vale1",
    hint: "Una noche con emocion, gritos y abrazos...",
    icon: "soccer",
    title: "Noche de estadio: Atlético de Madrid",
    description: "Partido juntos del Atletico de Madrid",
    detailsType: "info",
    details: "Partido del Atletico de Madrid (Entrada confirmada). Fecha: Sin confirmar todavia",
    emoji: "⚽",
    color: "#c8102e", // Rojo Atlético
  },
  {
    id: "vale2",
    hint: "Una noche solo para nosotros...",
    icon: "wine",
    title: "Cena romántica a elección",
    description: "Vale por una cena romántica a elección (hoy cumpleaños o en Benidorm)",
    detailsType: "options",
    options: ["Hoy a la noche", "En Benidorm"],
    emoji: "🍷",
    color: "#722F37", // Vino
  },
]

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

function SoccerIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  )
}

function WineIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 22h8" />
      <path d="M12 22v-7" />
      <path d="M8 2h8l-1 8a5 5 0 0 1-6 0L8 2Z" />
    </svg>
  )
}

function HeartIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function SparkleIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  )
}

function GiftIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <rect x="5" y="12" width="14" height="9" rx="1" />
      <path d="M12 8v13" />
      <path d="M7.5 8c0-1.5 1.5-3 3-3s2 1.5 1.5 3" />
      <path d="M16.5 8c0-1.5-1.5-3-3-3s-2 1.5-1.5 3" />
    </svg>
  )
}

// Componente de Vale con carga progresiva reveladora
function ValeCard({ vale, index }: { vale: Vale; index: number }) {
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const IconComponent = vale.icon === "soccer" ? SoccerIcon : WineIcon

  const handleReveal = () => {
    if (revealed || isRevealing) return
    setIsRevealing(true)
    setProgress(0)
  }

  useEffect(() => {
    if (!isRevealing) return

    const duration = 2500 // 2.5 segundos de carga
    const interval = 30
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            setRevealed(true)
            setIsRevealing(false)
          }, 300)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isRevealing])

  // Estado sin revelar - Tarjeta misteriosa elegante
  if (!revealed && !isRevealing) {
    return (
      <article
        className="relative overflow-hidden rounded-3xl cursor-pointer group"
        onClick={handleReveal}
        style={{
          background: `linear-gradient(135deg, ${vale.color}15 0%, ${vale.color}08 50%, ${vale.color}15 100%)`,
          border: `2px solid ${vale.color}30`,
        }}
      >
        {/* Efecto de brillo */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${vale.color}20 50%, transparent 70%)`,
            animation: "shimmer 2s infinite",
          }}
        />

        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 text-4xl">{vale.emoji}</div>
          <div className="absolute bottom-4 right-4 text-4xl">{vale.emoji}</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20">{vale.emoji}</div>
        </div>

        <div className="relative p-8 text-center">
          {/* Número de vale */}
          <div
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: `${vale.color}20`, color: vale.color }}
          >
            {index + 1}
          </div>

          {/* Icono de regalo */}
          <div
            className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${vale.color}30 0%, ${vale.color}10 100%)`,
              boxShadow: `0 8px 32px ${vale.color}20`,
            }}
          >
            <GiftIcon className="w-10 h-10" style={{ color: vale.color }} />
          </div>

          {/* Pista */}
          <p className="text-muted-foreground italic mb-4 text-lg font-light">
            &ldquo;{vale.hint}&rdquo;
          </p>

          {/* Botón de revelar */}
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 group-hover:scale-105"
            style={{
              backgroundColor: vale.color,
              color: "white",
              boxShadow: `0 4px 20px ${vale.color}40`,
            }}
          >
            <SparkleIcon className="w-4 h-4" />
            <span>Toca para revelar</span>
            <SparkleIcon className="w-4 h-4" />
          </div>

          {/* Estrellas decorativas */}
          <div className="absolute top-6 left-6">
            <SparkleIcon className="w-3 h-3 text-amber-400 animate-pulse" />
          </div>
          <div className="absolute bottom-8 left-8">
            <SparkleIcon className="w-2 h-2 text-amber-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </article>
    )
  }

  // Estado revelando - Animación de carga progresiva
  if (isRevealing) {
    return (
      <article
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: `linear-gradient(135deg, ${vale.color}20 0%, ${vale.color}10 100%)`,
          border: `2px solid ${vale.color}40`,
        }}
      >
        {/* Efecto de partículas */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-float"
              style={{
                backgroundColor: vale.color,
                opacity: 0.3,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative p-10 text-center">
          {/* Emoji animado */}
          <div
            className="text-7xl mb-6 animate-bounce"
            style={{ animationDuration: "1s" }}
          >
            {vale.emoji}
          </div>

          {/* Texto de revelación */}
          <p className="text-xl font-light mb-6" style={{ color: vale.color }}>
            Revelando tu regalo...
          </p>

          {/* Barra de progreso elegante */}
          <div className="relative w-full max-w-xs mx-auto">
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: `${vale.color}20` }}
            >
              <div
                className="h-full rounded-full transition-all duration-100 ease-out"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${vale.color} 0%, ${vale.color}dd 50%, ${vale.color} 100%)`,
                  boxShadow: `0 0 20px ${vale.color}60`,
                }}
              />
            </div>
            {/* Porcentaje */}
            <p
              className="mt-3 text-2xl font-bold tabular-nums"
              style={{ color: vale.color }}
            >
              {Math.round(progress)}%
            </p>
          </div>

          {/* Sparkles animados */}
          <div className="flex justify-center gap-4 mt-6">
            <SparkleIcon className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
            <SparkleIcon className="w-6 h-6 text-amber-300 animate-pulse" />
            <SparkleIcon className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
          </div>
        </div>
      </article>
    )
  }

  // Estado revelado - Tarjeta premium
  return (
    <article
      className="relative overflow-hidden rounded-3xl animate-in zoom-in-95 fade-in duration-500"
      style={{
        background: `linear-gradient(135deg, white 0%, ${vale.color}08 100%)`,
        border: `2px solid ${vale.color}30`,
        boxShadow: `0 20px 60px ${vale.color}15`,
      }}
    >
      {/* Banner decorativo superior */}
      <div
        className="h-2"
        style={{
          background: `linear-gradient(90deg, ${vale.color} 0%, ${vale.color}aa 50%, ${vale.color} 100%)`,
        }}
      />

      {/* Confeti decorativo */}
      <div className="absolute top-4 left-4">
        <span className="text-2xl animate-bounce" style={{ animationDelay: "0.1s" }}>🎉</span>
      </div>
      <div className="absolute top-4 right-4">
        <span className="text-2xl animate-bounce" style={{ animationDelay: "0.3s" }}>✨</span>
      </div>

      <div className="p-8">
        {/* Header del vale */}
        <div className="text-center mb-6">
          {/* Emoji grande */}
          <div className="text-6xl mb-4">{vale.emoji}</div>

          {/* Badge "VALE" */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
            style={{
              backgroundColor: `${vale.color}15`,
              color: vale.color,
              border: `1px solid ${vale.color}30`,
            }}
          >
            <GiftIcon className="w-3 h-3" />
            Vale #{index + 1}
          </div>

          {/* Título */}
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: vale.color }}
          >
            {vale.title}
          </h3>

          {/* Descripción */}
          <p className="text-muted-foreground text-base">{vale.description}</p>
        </div>

        {/* Línea decorativa */}
        <div className="flex items-center justify-center gap-4 my-6">
          <span className="flex-1 h-px" style={{ backgroundColor: `${vale.color}30` }} />
          <HeartIcon className="w-4 h-4" style={{ color: vale.color }} />
          <span className="flex-1 h-px" style={{ backgroundColor: `${vale.color}30` }} />
        </div>

        {/* Detalles o opciones */}
        {vale.detailsType === "info" ? (
          <>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 px-6 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: showDetails ? `${vale.color}15` : vale.color,
                color: showDetails ? vale.color : "white",
                border: `2px solid ${vale.color}`,
              }}
            >
              {showDetails ? "✓ Detalles vistos" : "Ver detalles del regalo"}
            </button>
            {showDetails && (
              <div
                className="mt-4 p-5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300"
                style={{
                  backgroundColor: `${vale.color}08`,
                  border: `1px solid ${vale.color}20`,
                }}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: vale.color }} />
                  <div>
                    <p className="font-semibold" style={{ color: vale.color }}>Partido del Atlético de Madrid</p>
                    <p className="text-muted-foreground mt-1">✅ Entrada confirmada</p>
                    <p className="text-muted-foreground mt-1 italic">📅 Fecha: Sin confirmar todavia</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 px-6 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: showDetails ? `${vale.color}15` : vale.color,
                color: showDetails ? vale.color : "white",
                border: `2px solid ${vale.color}`,
              }}
            >
              {showDetails ? "Cerrar opciones" : "Elegir cuándo canjearlo"}
            </button>
            {showDetails && vale.options && (
              <div className="mt-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {vale.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(option)}
                    className="p-4 rounded-xl text-center text-base font-medium transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      backgroundColor: selectedOption === option ? `${vale.color}15` : "white",
                      border: `2px solid ${selectedOption === option ? vale.color : `${vale.color}30`}`,
                      color: selectedOption === option ? vale.color : "inherit",
                    }}
                  >
                    {option}
                    {selectedOption === option && " ✓"}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Sello de validez */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Vale válido • Hecho con amor 💕
          </p>
        </div>
      </div>
    </article>
  )
}

function GalleryModal({
  item,
  onClose,
}: {
  item: { image: string; phrase: string } | null
  onClose: () => void
}) {
  if (!item) return null

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/20 hover:scale-110 transition-all"
        aria-label="Cerrar"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="max-w-lg w-full animate-in zoom-in-90 duration-300" onClick={(e) => e.stopPropagation()}>
        {/* Imagen */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={item.image || "/placeholder.svg"}
            alt="Foto ampliada"
            className="w-full aspect-[4/5] object-cover"
          />
          {/* Overlay gradient para la frase */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16">
            <p className="text-white text-lg font-light italic text-center leading-relaxed">
              &ldquo;{item.phrase}&rdquo;
            </p>
          </div>
        </div>

        {/* Corazón decorativo */}
        <div className="text-center mt-4">
          <HeartIcon className="w-6 h-6 text-rose-400 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function BirthdayPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [canUnlock, setCanUnlock] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{ image: string; phrase: string } | null>(null)
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())

  const calculateTimeLeft = useCallback(() => {
    const now = new Date()
    const diff = TARGET_DATE.getTime() - now.getTime()

    if (diff <= 0) {
      setCanUnlock(true)
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  useEffect(() => {
    if (!isUnlocked) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [isUnlocked])

  const handleUnlock = () => {
    if (canUnlock) {
      setIsUnlocked(true)
    }
  }

  const pad = (n: number) => n.toString().padStart(2, "0")

  return (
    <>
      {/* Pantalla de bloqueo */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-6 transition-all duration-700 ${isUnlocked ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
          }`}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-3xl sm:text-4xl font-light tracking-wide mb-8 drop-shadow-lg text-balance">
            Feliz cumpleaños mi amor
          </h1>

          <div className="flex justify-center gap-3 mb-4" aria-live="polite">
            {[
              { value: timeLeft.days, label: "Días" },
              { value: timeLeft.hours, label: "Horas" },
              { value: timeLeft.minutes, label: "Min" },
              { value: timeLeft.seconds, label: "Seg" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center bg-white/15 backdrop-blur-md px-4 py-3 rounded-xl min-w-[70px]"
              >
                <span className="text-2xl sm:text-3xl font-semibold">{pad(item.value)}</span>
                <span className="text-xs uppercase tracking-wider opacity-90">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-base opacity-85 italic mb-8">
            {canUnlock ? "¡Ya es tu día!" : "Falta poquito..."}
          </p>

          <button
            onClick={handleUnlock}
            disabled={!canUnlock}
            className={`px-8 py-3 rounded-full text-base font-medium transition-all min-w-[180px] ${canUnlock
              ? "bg-accent text-white shadow-lg hover:bg-primary hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              : "bg-white/20 cursor-not-allowed shadow-none"
              }`}
          >
            Abrir regalo
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <main
        className={`min-h-screen transition-opacity duration-700 delay-300 ${isUnlocked ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        {/* Header mejorado */}
        <header className="relative text-center py-16 px-6 overflow-hidden">
          {/* Fondo con gradiente premium */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-100 via-rose-50 to-background" />

          {/* Partículas decorativas */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <HeartIcon
                key={i}
                className="absolute w-4 h-4 text-rose-200 animate-float"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="relative">
            {/* Badge de celebración */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
              <span className="text-xl">🎂</span>
              <span className="text-sm font-medium text-primary">¡Feliz Cumpleaños!</span>
              <span className="text-xl">🎉</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-light text-primary mb-3 text-balance">
              Mi amor
            </h1>
            <p className="text-lg text-muted-foreground italic font-light">Esto recién empieza. Quiero que este dia y este año sea uno que recuerdes para toda tu vida y espero que este regalo te guste mucho. Te amo cada dia mas</p>

            <div className="flex items-center justify-center gap-4 mt-8">
              <span className="w-20 h-px bg-gradient-to-r from-transparent to-rose-300" />
              <HeartIcon className="w-5 h-5 text-accent animate-pulse" />
              <span className="w-20 h-px bg-gradient-to-l from-transparent to-rose-300" />
            </div>
          </div>
        </header>

        {/* Galería mejorada con frases */}
        <section className="py-16 px-6 bg-gradient-to-b from-background via-rose-50/30 to-background">
          <h2
            id="gallery-title"
            data-animate
            className={`text-2xl font-light text-primary text-center mb-3 transition-all duration-600 ${visibleElements.has("gallery-title")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
              }`}
          >
            Estos son algunos de nuestros momentos favoritos juntos
          </h2>
          <p
            id="gallery-subtitle"
            data-animate
            className={`text-center text-muted-foreground mb-10 transition-all duration-600 ${visibleElements.has("gallery-subtitle")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
              }`}
            style={{ transitionDelay: "100ms" }}
          >
            Toca cada foto para ver un mensaje ✨
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {GALLERY_ITEMS.map((item, i) => (
              <button
                key={i}
                id={`gallery-item-${i}`}
                data-animate
                onClick={() => setSelectedItem(item)}
                className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent/50 ${visibleElements.has(`gallery-item-${i}`)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
                  }`}
                style={{
                  transitionDelay: `${i * 80}ms`,
                }}
                aria-label={`Ver foto ${i + 1}`}
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={`Momento ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay con indicador */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-0 right-0 text-center">
                    <span className="text-white text-xs font-medium px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                      Ver mensaje 💌
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Vales mejorados */}
        <section className="py-16 px-6">
          <div className="max-w-xl mx-auto">
            <h2
              id="vales-title"
              data-animate
              className={`text-2xl font-light text-primary text-center mb-3 transition-all duration-600 ${visibleElements.has("vales-title")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
                }`}
            >
              Tus regalos especiales
            </h2>
            <p
              id="vales-subtitle"
              data-animate
              className={`text-center text-muted-foreground mb-10 transition-all duration-600 ${visibleElements.has("vales-subtitle")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
                }`}
              style={{ transitionDelay: "100ms" }}
            >
              Toca cada tarjeta para revelar tu sorpresa 🎁
            </p>

            <div className="flex flex-col gap-6">
              {vales.map((vale, i) => (
                <div
                  key={vale.id}
                  id={`vale-${i}`}
                  data-animate
                  className={`transition-all duration-600 ${visibleElements.has(`vale-${i}`)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                    }`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  <ValeCard vale={vale} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer mejorado */}
        <footer className="text-center py-16 px-6 bg-gradient-to-t from-rose-100 to-background">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <HeartIcon
                key={i}
                className="w-4 h-4 text-accent animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-muted-foreground">
            Hecho con todo mi amor para vos
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            💕 Feliz cumpleaños 💕
          </p>
        </footer>
      </main>

      {/* Modal de galería mejorado */}
      <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Estilos para animaciones */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
