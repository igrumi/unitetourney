import Link from "next/link";

export default function Home() {
  return (
    <main className=""> 
      {/* HERO SECTION */}
      <section className="pt-12 pb-24 px-6 text-center bg-linear-to-b from-unite-accent/20 to-transparent -mt-12">
        <h1 className="text-7xl font-black italic tracking-tighter mb-4">
          Asociación <span className="text-unite-blue">Platinum</span>
        </h1>
        <p className="text-gray-400 tracking-[0.3em] uppercase text-sm mb-10">
          5ta Temporada "Diamante y Perla"
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/registro">
            <button className="bg-white text-black px-8 py-3 font-bold hover:bg-unite-blue hover:text-white transition cursor-pointer">
              INSCRIBIR EQUIPO
            </button>
          </Link>
          <Link href="/reglamento">
            <button className="border border-white/20 px-8 py-3 font-bold hover:bg-white/5 transition cursor-pointer">
              REGLAMENTO
            </button>
          </Link>
        </div>
      </section>

      {/* INFORMACIÓN CLAVE - Datos actualizados del reglamento */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
        <div className="glass-card p-8">
          <p className="text-unite-blue text-xs font-bold mb-2 uppercase">Inicio de Temporada</p>
          <h3 className="text-2xl font-bold italic uppercase">Febrero 2026</h3>
          <p className="text-gray-500 text-sm mt-2">Término estimado: Marzo 2026</p>
        </div>
        <div className="glass-card p-8 border-t-2 border-t-unite-accent">
          <p className="text-unite-accent text-xs font-bold mb-2 uppercase">Horarios de Partida</p>
          <h3 className="text-2xl font-bold italic uppercase">21:00 - 23:00 HRS</h3>
          <p className="text-gray-500 text-sm mt-2">Días según tu serie (Diamante/Perla)</p>
        </div>
        <div className="glass-card p-8">
          <p className="text-unite-blue text-xs font-bold mb-2 uppercase">Capacidad</p>
          <h3 className="text-2xl font-bold italic uppercase">16 Equipos Máx.</h3>
          <p className="text-gray-500 text-sm mt-2">Divididos en Serie A y Serie B</p>
        </div>
      </section>

      {/* REGLAS RAPIDAS - Basadas fielmente en el PDF */}
      <section className="max-w-3xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-8 italic border-l-4 border-unite-accent pl-4 uppercase">
          Reglas Generales
        </h2>
        <ul className="space-y-6 text-gray-300">
          <li className="flex gap-4">
            <span className="text-unite-accent font-bold font-mono text-xl">01</span>
            <p>
              <strong>Comunicación Oficial:</strong> Es obligatorio el uso de Discord para coordinar encuentros y roles. El Staff usará WhatsApp solo para capitanes.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="text-unite-accent font-bold font-mono text-xl">02</span>
            <p>
              <strong>Baneos de Temporada:</strong> No se permiten Mega-Evoluciones ni Pokémon lanzados durante el mes en curso de la liga.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="text-unite-accent font-bold font-mono text-xl">03</span>
            <p>
              <strong>Fair Play:</strong> Prohibido "bailar" al rival o tener conductas antideportivas. Sanciones incluyen pérdida de puntos o expulsión.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="text-unite-accent font-bold font-mono text-xl">04</span>
            <p>
              <strong>Puntualidad:</strong> Máximo 10 minutos de espera. Transcurridos los primeros 5, se da un punto al equipo presente.
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
}