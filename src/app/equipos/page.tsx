"use client";
import { useState, useEffect } from "react";
import { X, Users, Globe, Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Equipos() {
  const [equipos, setEquipos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<any | null>(
    null
  );

  // FUNCIÓN PARA OBTENER DATOS DE SUPABASE
  const cargarEquipos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Team")
      .select(
        `
      *,
      players: Player!Player_team_id_fkey(*) 
    `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando equipos:", error);
    } else {
      setEquipos(data || []);
    }
    setLoading(false);
  };

  // CARGAR AL ENTRAR A LA PÁGINA
  useEffect(() => {
    cargarEquipos();
  }, []);

  useEffect(() => {
  if (equipoSeleccionado) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
}, [equipoSeleccionado]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">
          Cargando Roster Oficial...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 max-w-7xl mx-auto mb-20">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">
            Equipos Inscritos
          </h2>
          <p className="text-gray-500 text-sm tracking-widest uppercase mt-2">
            Temporada 5 • Roster Oficial
          </p>
        </div>
        <span className="text-unite-blue font-bold text-xs bg-unite-blue/10 px-3 py-1 rounded-full">
          {equipos.length} EQUIPOS REGISTRADOS
        </span>
      </header>

      {/* GRID DE EQUIPOS DESDE DB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipos.length === 0 ? (
          <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-lg">
            <p className="text-gray-600 italic">
              Aún no hay equipos inscritos. ¡Sé el primero!
            </p>
          </div>
        ) : (
          equipos.map((equipo) => {
            // Buscamos al capitán (order_index 0 o el que definas)
            const capitan = equipo.players?.find(
              (p: any) => p.order_index === 0
            );

            return (
              <div
                key={equipo.id}
                className="bg-unite-dark border border-white/10 p-6 rounded-sm hover:border-unite-blue/50 transition-all group cursor-pointer relative"
                onClick={() => setEquipoSeleccionado(equipo)}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-20 h-20 bg-black/50 border border-white/5 rounded-md p-2 flex items-center justify-center">
                    <img
                      src={equipo.logo_url || "/logo-torneo.png"}
                      alt={equipo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic text-white group-hover:text-unite-blue transition-colors uppercase">
                      {equipo.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase flex items-center gap-1">
                      <Users size={10} /> Capitán:{" "}
                      <span className="text-gray-300">
                        {capitan?.username || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="text-[10px] text-unite-accent font-bold uppercase flex items-center gap-1">
                    <Globe size={10} /> {capitan?.nationality || "Global"}
                  </span>
                  <span className="text-[10px] text-gray-600 uppercase italic font-bold">
                    Ver Roster +
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE DETALLES REFINADO */}
      {/* MODAL DE DETALLES REFINADO - Versión Flotante para Celular */}
      {equipoSeleccionado && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4 sm:p-6">
          {/* Ajustes de dimensiones:
      - w-[95%] y max-h-[85vh] para que no choque con las barras del navegador móvil.
      - flex flex-col para separar el header del contenido scrolleable.
    */}
          <div className="bg-unite-dark border border-white/10 w-[95%] max-w-2xl rounded-lg relative shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* Botón Cerrar - bg-black/40 para visibilidad y z-index alto */}
            <button
              onClick={() => setEquipoSeleccionado(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all z-[130] bg-black/40 backdrop-blur-sm"
            >
              <X size={20} />
            </button>

            {/* Header del Modal - shrink-0 evita que el header se achique al hacer scroll */}
            <div className="shrink-0 relative p-6 md:p-8 border-b border-white/10 bg-linear-to-r from-unite-blue/10 to-transparent">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Logo */}
                <div className="w-20 h-20 md:w-28 md:h-28 bg-black/60 p-4 border border-white/10 rounded-sm flex items-center justify-center shrink-0">
                  <img
                    src={equipoSeleccionado.logo_url || "/logo-torneo.png"}
                    className="max-w-full max-h-full object-contain"
                    alt="Logo Equipo"
                  />
                </div>

                {/* Texto del Equipo - pr-10 reserva espacio para la X en desktop */}
                <div className="text-center md:text-left md:pr-12 w-full">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight break-words">
                    {equipoSeleccionado.name}
                  </h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                    <span className="text-[9px] md:text-[10px] font-bold text-unite-blue uppercase tracking-widest bg-unite-blue/10 px-2 py-1">
                      {equipoSeleccionado.players?.find(
                        (p: any) => p.is_captain
                      )?.nationality || "Nacionalidad"}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest py-1">
                      Inscrito el:{" "}
                      {new Date(
                        equipoSeleccionado.created_at
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cuerpo del Modal - overflow-y-auto permite el scroll solo en esta sección */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-black/10">
              <div className="flex items-center gap-2 mb-6">
                <Trophy size={16} className="text-unite-accent" />
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                  Roster Oficial
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipoSeleccionado.players
                  ?.sort((a: any, b: any) => a.order_index - b.order_index)
                  .map((jugador: any) => {
                    const esTitular = jugador.order_index < 5;
                    const esCapitan = jugador.order_index === 0;

                    return (
                      <div
                        key={jugador.id}
                        className={`p-4 flex justify-between items-center border rounded-sm ${
                          esCapitan
                            ? "border-unite-accent/50 bg-unite-accent/5"
                            : "border-white/5 bg-black/20"
                        }`}
                      >
                        <div>
                          <p className="font-black italic text-sm md:text-base tracking-tight text-white">
                            {jugador.username.toUpperCase()}
                          </p>
                          <p className="text-[10px] text-gray-600 font-mono">
                            ID: {jugador.ign_code}
                          </p>
                        </div>
                        <span
                          className={`text-[9px] px-3 py-1 font-black uppercase tracking-tighter ${
                            esCapitan
                              ? "bg-unite-accent text-white"
                              : esTitular
                              ? "bg-unite-blue text-white"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {esCapitan
                            ? "Capitán"
                            : esTitular
                            ? "Titular"
                            : "Suplente"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
