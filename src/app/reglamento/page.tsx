"use client";
import { useState } from "react";

const SECCIONES = [
  {
    id: 1,
    titulo: "I. Comunicación y Canales Oficiales",
    contenido: [
      "Discord: Canal principal de contacto. Se asignarán roles por equipo. Jugadores sin ROL no podrán interactuar en los canales del servidor.",
      "WhatsApp: Grupo exclusivo para Capitanes y Sub-capitanes para coordinar encuentros y transmisiones.",
      "Staff Responsable: Tora y Joshepo están a cargo de la administración y cumplimiento del reglamento.",
      "Streaming: Los streamers oficiales tienen la facultad de tomar decisiones ante negligencias detectadas durante las partidas en vivo."
    ]
  },
  {
    id: 2,
    titulo: "II. Inscripción y Gestión de Roster",
    contenido: [
      "Registro Oficial: Se realiza exclusivamente a través de este portal (reemplaza formularios externos).",
      "Datos Obligatorios: Nombre del equipo (no ofensivo), ID de juego, Discord ID, RUN (Chile) o DNI (Extranjeros) y Logo en PNG sin fondo.",
      "Cambios de Nombre: Cualquier cambio de IGN debe informarse con antelación vía WhatsApp. No avisar conlleva sanciones.",
      "Nacionalidades: Roster mayoritariamente Chileno/Argentino. Máximo 5 extranjeros totales en el equipo y máximo 3 en partida simultáneamente.",
      "Tamaño del Equipo: Hasta 10 jugadores por equipo."
    ]
  },
  {
    id: 3,
    titulo: "III. Especificaciones Técnicas",
    contenido: [
      "Plataformas: Nintendo Switch y móviles Android/iOS.",
      "Servidor: Obligatorio SA-02. Jugadores extranjeros deben acomodarse a este servidor; no se permiten cambios.",
      "Estadio: Randomizado vía ruleta antes de cada combate (Modo Veto) entre Rayquaza, Groudon y Kyogre - Modo Torneo.",
      "Pokémon: Todos disponibles excepto Mega Evoluciones (Charizard, Lucario, Mewtwo, Gyarados).",
      "Baneos Automáticos: Pokémon lanzados durante el mes en curso de la liga quedan baneados por toda la temporada.",
      "Desbalance: El baneo de otros Pokémon se sujetará a votación con los capitanes si afectan el equilibrio del juego."
    ]
  },
  {
    id: 4,
    titulo: "IV. Formato de Combate y Horarios",
    contenido: [
      "Fase Regular: Modo Ronda Robin (todos contra todos en su división). Series BO3 (mejor de 3).",
      "Playoffs (4ta Semana): Entre los 3 mejores de Diamante y el 1ro de Perla. Series BO5.",
      "Calendario: 2 encuentros semanales. Perla (Lunes y Miércoles) | Diamante (Martes y Jueves).",
      "Horarios: Definidos por tómbola/suerte. Los equipos deben tener disponibilidad completa; no se eligen ni cambian horarios.",
      "Salas: Deben ser creadas por los streamers oficiales. La posición se determina vía Challonge (equipo superior parte)."
    ]
  },
  {
    id: 5,
    titulo: "V. Normas de Partida y Sanciones",
    contenido: [
      "Puntualidad: 10 minutos de espera máximo. A los 5 min, el equipo presente gana 1 punto. A los 10 min, gana el match completo.",
      "Conexión: 1 reinicio permitido por encuentro (máximo hasta el minuto 1:00 de partida) respetando la selección inicial. Requiere prueba visual (foto/video).",
      "Canales de Voz: Solo 5 personas permitidas en el canal durante la partida. La presencia de externos resulta en derrota inmediata.",
      "Conductas Antideportivas: Prohibido bailar, hostigar o flamear. Castigos van desde pérdida de puntos hasta expulsión.",
      "Abandono: Prohibido rendirse o abandonar antes de los 10 min de partida bajo pena de sanción.",
      "Streaming Personal: ESTRICTAMENTE PROHIBIDO transmitir en vivo (Discord, Twitch, TikTok, etc.). Se permite difundir grabaciones 1 hora después del stream oficial."
    ]
  }
];

export default function Reglamento() {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <div className="min-h-screen pt-6 pb-20 px-6 max-w-4xl mx-auto">
      <header className="mb-12 border-b border-unite-blue/30 pb-8">
        <h1 className="text-6xl font-black italic mb-2 uppercase tracking-tighter text-white">
          BASES Y <span className="text-unite-blue">REGLAS</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">
          Asociación Platinum • Temporada 5 "Diamante y Perla"
        </p>
      </header>

      <div className="space-y-6">
        {SECCIONES.map((seccion) => (
          <article 
            key={seccion.id}
            className={`group border transition-all duration-300 ${
              activeId === seccion.id ? "border-unite-accent bg-unite-accent/5 shadow-[0_0_30px_rgba(255,183,0,0.1)]" : "border-white/10 bg-black/40 hover:border-white/20"
            }`}
          >
            <button
              onClick={() => setActiveId(activeId === seccion.id ? null : seccion.id)}
              className="w-full p-6 text-left flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-mono font-bold ${activeId === seccion.id ? "text-unite-accent" : "text-gray-600"}`}>
                  0{seccion.id}
                </span>
                <span className={`text-xl font-black italic uppercase tracking-tight transition-colors ${
                  activeId === seccion.id ? "text-unite-accent" : "text-white group-hover:text-unite-blue"
                }`}>
                  {seccion.titulo}
                </span>
              </div>
              <span className={`text-2xl transition-transform duration-300 ${activeId === seccion.id ? "rotate-45 text-unite-accent" : "text-gray-500"}`}>
                +
              </span>
            </button>

            {activeId === seccion.id && (
              <div className="px-10 pb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="h-px bg-white/10 mb-6" />
                <ul className="grid grid-cols-1 gap-5">
                  {seccion.contenido.map((item, idx) => (
                    <li key={idx} className="flex gap-4 text-gray-300 text-[15px] leading-relaxed">
                      <div className="mt-2 h-1.5 w-1.5 rounded-full bg-unite-blue shrink-0" />
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="mt-16 p-8 bg-black/60 border-l-4 border-unite-accent italic text-gray-400 text-sm leading-relaxed">
        "El reglamento queda sujeto a cambios de ser necesarios por futuras actualizaciones del juego. Los capitanes serán notificados oportunamente. Ante dudas no cubiertas, Joshepo y Tora se reservan el derecho de realizar las modificaciones pertinentes."
      </div>
    </div>
  );
}