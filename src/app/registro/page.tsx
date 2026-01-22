"use client";
import { useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabase"; // Asegúrate de haber creado este archivo
import { useRouter } from "next/navigation";
import {
  validarRut,
  formatearRut,
  formatearPlayerId,
  PAISES_LATAM,
  supabaseErrorTranslator,
} from "@/utils/formatters";
import { toast } from "sonner";

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
  const [rutError, setRutError] = useState(false);
  const [idError, setIdError] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [indexConErrorDB, setIndexConErrorDB] = useState<number | null>(null);
  const [nuevoJugador, setNuevoJugador] = useState<Jugador>({
    nombre: "",
    apellido: "",
    rut: "",
    username: "",
    playerId: "",
    nacionalidad: "",
  });

  const handleRutBlur = (valor: string) => {
    const formateado = formatearRut(valor);
    const esValido = validarRut(formateado);

    setNuevoJugador({ ...nuevoJugador, rut: formateado });
    setRutError(!esValido && valor.length > 0); // Solo marcar error si escribió algo
  };

  // Función para manejar la validación del Player ID al salir del campo
  const handleIdBlur = (valor: string) => {
    const formateado = formatearPlayerId(valor);
    // Un ID válido debe tener el '#' y 7 caracteres después (Total 8)
    const esValido = formateado.length === 8;

    setNuevoJugador({ ...nuevoJugador, playerId: formateado });
    setIdError(!esValido && valor.length > 0);
  };

  const validarYGuardar = () => {
    const { nombre, apellido, username, rut, playerId, nacionalidad } =
      nuevoJugador;

    // 1. Validaciones de largo comunes
    if (nombre.length > 20 || apellido.length > 20) {
      toast.error("Nombre y Apellido no deben superar los 20 caracteres.");
      return;
    }
    if (username.length > 12) {
      toast.error("El Username no debe superar los 12 caracteres.");
      return;
    }

    // 2. Validación de RUT solo si es Chileno
    if (nacionalidad === "Chile") {
      if (!validarRut(rut)) {
        setRutError(true);
        toast.error("El RUT ingresado no es válido. Por favor, revísalo.");
        return;
      }
    } else {
      // Si no es Chile, solo verificamos que no esté vacío
      if (rut.trim().length < 5) {
        toast.error("Por favor ingresa un número de documento válido.");
        return;
      }
    }

    // 3. Validación de Player ID
    if (playerId.length !== 8) {
      setIdError(true);
      toast.error("El Player ID debe tener el formato # + 7 caracteres.");
      return;
    }

    if (editIndex !== null) {
      toast.success(`Datos de ${username} actualizados correctamente`);
    } else {
      toast.success(`${username} añadido al roster`);
    }
    guardarJugador();
  };

  // --- LÓGICA DE SUPABASE ---
  const finalizarRegistro = async () => {
    // 1. Validaciones previas básicas (Nombre de equipo y cantidad mínima)
    if (!teamName) {
      toast.warning("Nombre de equipo faltante", {
        description:
          "Debes asignar un nombre a tu equipo antes de registrarlo.",
      });
      return;
    }

    if (jugadores.length < 5) {
      toast.warning("Roster incompleto", {
        description: "Necesitas al menos 5 jugadores para participar.",
      });
      return;
    }

    // 2. VALIDACIÓN DETALLADA POR JUGADOR (Feedback específico)
    // Recorremos el roster para encontrar errores antes de enviar a Supabase
    for (const j of jugadores) {
      // Validar RUT si la nacionalidad es Chile
      if (j.nacionalidad === "Chile" && !validarRut(j.rut)) {
        toast.error(`Error en Jugador: ${j.username}`, {
          description: `El RUT (${j.rut}) no es válido. Por favor, corrígelo.`,
        });
        return; // Detiene la ejecución completa
      }

      // Validar Player ID (formato # + 7 caracteres)
      if (j.playerId.length !== 8) {
        toast.error(`Error en Jugador: ${j.username}`, {
          description: `El Player ID debe tener el formato # + 7 caracteres.`,
        });
        return; // Detiene la ejecución completa
      }
    }

    // 3. PROCESO DE REGISTRO (Si todas las validaciones previas pasaron)
    setIsSubmitting(true);
    const loadingToast = toast.loading("Procesando inscripción única...");

    try {
      // --- NUEVA VALIDACIÓN PRE-VUELO ---
      // Extraemos todos los RUTs y Usernames para consultar de una sola vez
      const rutsAValidar = jugadores.map((j) => j.rut);
      const usersAValidar = jugadores.map((j) => j.username);

      const { data: existentes, error: errorCheck } = await supabase
        .from("Player")
        .select("rut, username")
        .or(
          `rut.in.(${rutsAValidar.join(",")}),username.in.(${usersAValidar.join(",")})`,
        );

      if (errorCheck) throw errorCheck;

      if (existentes && existentes.length > 0) {
        // Si hay duplicados, encontramos el índice del primer culpable en nuestra lista local
        const duplicado = existentes[0];
        const idxCulpable = jugadores.findIndex(
          (j) =>
            j.rut === duplicado.rut ||
            j.username.toLowerCase() === duplicado.username.toLowerCase(),
        );

        if (idxCulpable !== -1) {
          setIndexConErrorDB(idxCulpable);
          const campo =
            jugadores[idxCulpable].rut === duplicado.rut ? "RUT" : "Username";

          toast.error(`Conflicto de datos`, {
            id: loadingToast,
            description: `${campo} de ${jugadores[idxCulpable].username} ya está registrado.`,
          });
          setIsSubmitting(false);
          return; // Detenemos el proceso aquí
        }
      }
      // --- FIN VALIDACIÓN PRE-VUELO ---

      // Si pasamos la validación, procedemos con la RPC
      toast.loading("Enviando inscripción...", { id: loadingToast });

      const jugadoresFormateados = jugadores.map((j, index) => ({
        username: j.username,
        ign_code: j.playerId,
        irl_name: j.nombre,
        irl_lastname: j.apellido,
        rut: j.rut,
        nationality: j.nacionalidad,
        order_index: index,
        is_substitute: index >= 5,
        is_captain: index === 0,
      }));

      const { error: rpcError } = await supabase.rpc(
        "registrar_equipo_completo",
        {
          p_team_name: teamName,
          p_logo_url: logoPreview,
          p_players: jugadoresFormateados,
        },
      );

      if (rpcError) throw rpcError;

      toast.success("¡Equipo registrado exitosamente!", { id: loadingToast });
      router.push("/equipos");
    } catch (error: any) {
      const mensajeAmigable = supabaseErrorTranslator(error.message);
      toast.error("Error en el servidor", {
        id: loadingToast,
        description: mensajeAmigable,
      });
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
      nacionalidad: "Chile",
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

              // 1. Error de formato (Frontend)
              const tieneErrorFormato =
                (j.nacionalidad === "Chile" && !validarRut(j.rut)) ||
                j.playerId.length !== 8;

              // 2. Error de duplicado (Backend/DB)
              const esDuplicadoEnDB = indexConErrorDB === index;
              const mostrarError = tieneErrorFormato || esDuplicadoEnDB;

              return (
                <div
                  key={index}
                  className={`bg-white/5 border p-4 rounded-sm flex justify-between items-center group transition-all duration-300 ${
                    mostrarError
                      ? "border-red-600 bg-red-950/20 shadow-[0_0_20px_rgba(220,38,38,0.3)] ring-1 ring-red-600"
                      : esTitular
                        ? "border-white/10"
                        : "border-dashed border-white/5 opacity-80"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-bold italic tracking-tight ${mostrarError ? "text-red-500 underline decoration-dotted" : "text-white"}`}
                      >
                        {j.username.toUpperCase()}
                      </p>

                      {/* BADGE DE ERROR CON ANIMACIÓN FUERTE */}
                      {mostrarError && (
                        <span className="text-[7px] bg-red-600 text-white px-2 py-0.5 font-black uppercase rounded-sm animate-bounce shadow-sm">
                          {esDuplicadoEnDB
                            ? "⚠️ YA REGISTRADO"
                            : "⚠️ DATOS INVÁLIDOS"}
                        </span>
                      )}

                      <span
                        className={`text-[8px] px-2 py-0.5 font-black uppercase rounded-full ${
                          mostrarError
                            ? "bg-red-900/40 text-red-500 border border-red-500/30"
                            : esTitular
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
                      onClick={() => {
                        setIndexConErrorDB(null); // Limpiar error al editar
                        abrirModalParaEdicion(index);
                      }}
                      className={`${mostrarError ? "text-white" : "text-unite-blue"} hover:underline text-[10px] font-bold uppercase`}
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
            <h3 className="text-xl font-black italic mb-6 text-white border-b border-white/10 pb-2 uppercase">
              {editIndex !== null ? "Editar Jugador" : "Nuevo Jugador"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* NOMBRE */}
              <div className="col-span-1">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block uppercase">
                  Nombre ({nuevoJugador.nombre.length}/20)
                </label>
                <input
                  maxLength={20}
                  value={nuevoJugador.nombre}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white"
                  onChange={(e) =>
                    setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })
                  }
                />
              </div>

              {/* APELLIDO */}
              <div className="col-span-1">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block uppercase">
                  Apellido ({nuevoJugador.apellido.length}/20)
                </label>
                <input
                  maxLength={20}
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

              {/* RUT CON FORMATEO AL SALIR */}
              <div className="col-span-1">
                <label
                  className={`text-[10px] font-bold mb-1 block transition-colors ${
                    rutError ? "text-red-500" : "text-unite-blue"
                  }`}
                >
                  {nuevoJugador.nacionalidad === "Chile"
                    ? "RUT (CHILE)"
                    : "DOCUMENTO / DNI"}
                </label>
                <input
                  placeholder={
                    nuevoJugador.nacionalidad === "Chile"
                      ? "204965269"
                      : "Nº Documento"
                  }
                  value={nuevoJugador.rut}
                  maxLength={nuevoJugador.nacionalidad === "Chile" ? 12 : 20} // LIMITADOR CLAVE
                  onChange={(e) =>
                    setNuevoJugador({ ...nuevoJugador, rut: e.target.value })
                  }
                  onBlur={(e) => {
                    if (nuevoJugador.nacionalidad === "Chile") {
                      handleRutBlur(e.target.value);
                    } else {
                      setRutError(false);
                    }
                  }}
                  className={`w-full bg-black border p-2 text-sm outline-none transition-all ${
                    rutError
                      ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                      : "border-white/10 focus:border-unite-accent"
                  } text-white`}
                />
              </div>

              {/* NACIONALIDAD - DROPDOWN */}
              <div className="col-span-1">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">
                  NACIONALIDAD
                </label>
                <select
                  value={nuevoJugador.nacionalidad}
                  className="w-full bg-black border border-white/10 p-2 text-sm outline-none focus:border-unite-accent text-white cursor-pointer"
                  onChange={(e) => {
                    const selectedCountry = e.target.value;
                    setNuevoJugador({
                      ...nuevoJugador,
                      nacionalidad: selectedCountry,
                      rut: "", // Limpiamos el RUT/DNI para evitar conflictos de formato
                    });
                    setRutError(false); // Reseteamos el error visual al cambiar de país
                  }}
                >
                  {PAISES_LATAM.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>

              {/* USERNAME */}
              <div className="col-span-2">
                <label className="text-[10px] text-gray-500 font-bold mb-1 block">
                  USERNAME ({nuevoJugador.username.length}/12)
                </label>
                <input
                  maxLength={12}
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

              {/* PLAYER ID CON FORMATEO AL SALIR */}
              <div className="col-span-2">
                <label
                  className={`text-[10px] font-bold mb-1 block transition-colors ${idError ? "text-red-500" : "text-unite-blue"}`}
                >
                  PLAYER ID{" "}
                  {idError ? "(DEBE TENER 7 CARACTERES)" : "(POKÉMON UNITE)"}
                </label>
                <input
                  placeholder="22QYH2A"
                  value={nuevoJugador.playerId}
                  onBlur={(e) => handleIdBlur(e.target.value)}
                  onChange={(e) =>
                    setNuevoJugador({
                      ...nuevoJugador,
                      playerId: e.target.value,
                    })
                  }
                  className={`w-full bg-black border p-2 text-sm outline-none transition-all ${
                    idError
                      ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                      : "border-white/10 focus:border-unite-accent"
                  } text-white uppercase`}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border border-white/10 py-3 text-xs font-bold hover:bg-red-500 transition text-white uppercase"
              >
                Cancelar
              </button>
              <button
                onClick={validarYGuardar}
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
