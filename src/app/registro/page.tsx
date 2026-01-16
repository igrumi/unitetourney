"use client";
import { useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase"; // Asegúrate de haber creado este archivo
import { useRouter } from "next/navigation";

interface Jugador {
  nombre: string;
  apellido: string;
  rut: string;
  username: string;
  playerId: string;
  nacionalidad: string;
}

export default function Registro() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para evitar doble clic

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [nuevoJugador, setNuevoJugador] = useState<Jugador>({
    nombre: "",
    apellido: "",
    rut: "",
    username: "",
    playerId: "",
    nacionalidad: "",
  });

  // --- LÓGICA DE SUPABASE ---
  const finalizarRegistro = async () => {
    if (!teamName || jugadores.length < 5) {
      alert("Por favor, ingresa el nombre del equipo y al menos 5 jugadores.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Insertar el Equipo
      const { data: teamData, error: teamError } = await supabase
        .from("Team")
        .insert([
          {
            name: teamName,
            logo_url: logoPreview,
          },
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // 2. Preparar los Jugadores incluyendo la columna is_captain
      const jugadoresParaInsertar = jugadores.map((j, index) => ({
        team_id: teamData.id,
        username: j.username,
        ign_code: j.playerId,
        irl_name: j.nombre,
        irl_lastname: j.apellido,
        rut: j.rut,
        nationality: j.nacionalidad,
        order_index: index,
        is_substitute: index >= 5, // Automático: del 6 al 10 son suplentes
        is_captain: index === 0, // Automático: el primero de la lista es capitán
      }));

      // 3. Insertar Jugadores
      const { error: playersError } = await supabase
        .from("Player")
        .insert(jugadoresParaInsertar);

      if (playersError) throw playersError;

      alert("¡Registro exitoso! Tu equipo ha sido inscrito.");
      router.push("/equipos");
    } catch (error: any) {
      alert("Error en el registro: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  // --------------------------

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const abrirModalParaEdicion = (index: number) => {
    setEditIndex(index);
    setNuevoJugador(jugadores[index]);
    setIsModalOpen(true);
  };

  const abrirModalParaNuevo = () => {
    setEditIndex(null);
    setNuevoJugador({
      nombre: "",
      apellido: "",
      rut: "",
      username: "",
      playerId: "",
      nacionalidad: "",
    });
    setIsModalOpen(true);
  };

  const guardarJugador = () => {
    if (editIndex !== null) {
      const nuevosJugadores = [...jugadores];
      nuevosJugadores[editIndex] = nuevoJugador;
      setJugadores(nuevosJugadores);
    } else {
      if (jugadores.length < 10) {
        setJugadores([...jugadores, nuevoJugador]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen pt-20 px-6 max-w-4xl mx-auto mb-20">
      <h2 className="text-4xl font-black italic mb-10 tracking-tighter uppercase text-white">
        Registro de Equipo
      </h2>

      <div className="space-y-8 bg-unite-dark border border-white/10 p-8 rounded-lg">
        {/* SECCIÓN LOGO Y NOMBRE */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Logo del Equipo
            </label>
            <div className="relative w-32 h-32 bg-black border-2 border-dashed border-white/20 rounded-md flex items-center justify-center overflow-hidden group">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600 text-[10px] text-center px-2 italic">
                  PNG / JPG
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-unite-blue">
              Nombre del Equipo
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 outline-none focus:border-unite-blue transition text-xl font-bold italic text-white"
              placeholder="EJ: PLATINUM KINGS"
            />
          </div>
        </div>

        {/* LISTA DE JUGADORES */}
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Roster ({jugadores.length}/10)
              </label>
              <p className="text-[9px] text-unite-blue mt-1">
                Primeros 5: Titulares | Resto: Suplentes
              </p>
            </div>
            {jugadores.length < 10 && (
              <button
                onClick={abrirModalParaNuevo}
                className="bg-unite-accent text-xs font-bold px-6 py-2 rounded-sm hover:bg-unite-blue transition cursor-pointer text-white"
              >
                + AÑADIR JUGADOR
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jugadores.map((j, index) => {
              const esTitular = index < 5;
              return (
                <div
                  key={index}
                  className={`bg-white/5 border p-4 rounded-sm flex justify-between items-center group transition ${
                    esTitular
                      ? "border-white/10"
                      : "border-dashed border-white/5 opacity-80"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold italic text-white tracking-tight">
                        {j.username.toUpperCase()}
                      </p>
                      <span
                        className={`text-[8px] px-2 py-0.5 font-black uppercase rounded-full ${
                          esTitular
                            ? "bg-unite-blue text-white"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {esTitular ? "Titular" : "Suplente"}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      {j.nombre} {j.apellido} | {j.nacionalidad}
                    </p>
                  </div>
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => abrirModalParaEdicion(index)}
                      className="text-unite-blue hover:text-white text-[10px] font-bold uppercase underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        setJugadores(jugadores.filter((_, i) => i !== index))
                      }
                      className="text-red-500 hover:text-white text-[10px] font-bold uppercase underline"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTÓN DE ENVÍO CONECTADO A SUPABASE */}
        <button
          onClick={finalizarRegistro}
          disabled={isSubmitting}
          className={`w-full bg-white text-black py-5 font-black italic transition uppercase tracking-[0.2em] mt-10 shadow-lg ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-unite-blue hover:text-white cursor-pointer"
          }`}
        >
          {isSubmitting ? "REGISTRANDO..." : "Enviar Inscripción a Revisión"}
        </button>
      </div>

      {/* MODAL (sin cambios significativos en UI, solo manejo de estados) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-unite-dark border border-unite-accent/30 w-full max-w-md p-8 rounded-sm shadow-2xl">
            <h3 className="text-xl font-black italic mb-6 text-white border-b border-white/10 pb-2">
              {editIndex !== null ? "EDITAR JUGADOR" : "NUEVO JUGADOR"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">
                  NOMBRE
                </label>
                <input
                  value={nuevoJugador.nombre}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white"
                  onChange={(e) =>
                    setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })
                  }
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">
                  APELLIDO
                </label>
                <input
                  value={nuevoJugador.apellido}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white"
                  onChange={(e) =>
                    setNuevoJugador({
                      ...nuevoJugador,
                      apellido: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block text-unite-blue">
                  RUT
                </label>
                <input
                  value={nuevoJugador.rut}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white"
                  onChange={(e) =>
                    setNuevoJugador({ ...nuevoJugador, rut: e.target.value })
                  }
                />
              </div>
              <div className="col-span-1">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block text-white">
                  NACIONALIDAD
                </label>
                <input
                  value={nuevoJugador.nacionalidad}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white"
                  onChange={(e) =>
                    setNuevoJugador({
                      ...nuevoJugador,
                      nacionalidad: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block text-white">
                  USERNAME (IN-GAME)
                </label>
                <input
                  value={nuevoJugador.username}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white"
                  onChange={(e) =>
                    setNuevoJugador({
                      ...nuevoJugador,
                      username: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block text-unite-blue">
                  PLAYER ID (POKÉMON UNITE)
                </label>
                <input
                  value={nuevoJugador.playerId}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white"
                  onChange={(e) =>
                    setNuevoJugador({
                      ...nuevoJugador,
                      playerId: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-white/10 py-3 text-xs font-bold hover:bg-red-500 transition text-white"
              >
                CANCELAR
              </button>
              <button
                onClick={guardarJugador}
                className="flex-1 bg-unite-blue text-white py-3 text-xs font-bold hover:bg-white hover:text-black transition uppercase italic"
              >
                {editIndex !== null ? "Guardar Cambios" : "Añadir al Roster"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
