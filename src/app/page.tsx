import Link from "next/link";

export default function Home() {
  return (
    <main className=""> 
    
      {/* HERO SECTION - Ajustamos el padding superior y negativo para que suba */}
      <section className="pt-12 pb-24 px-6 text-center bg-linear-to-b from-unite-accent/20 to-transparent -mt-12">
        {/* El -mt-12 ayuda a que el color suba y se mezcle con la Navbar */}
        <h1 className="text-7xl font-black italic tracking-tighter mb-4">
          Asociación <span className="text-unite-blue">Platinum</span>
        </h1>
        <p className="text-gray-400 tracking-[0.3em] uppercase text-sm mb-10">
          Liga 5ta Temporada
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/registro">
            <button className="bg-white text-black px-8 py-3 font-bold hover:bg-unite-blue hover:text-white transition cursor-pointer">
              INSCRIBIR EQUIPO
            </button>
          </Link>
          <button className="border border-white/20 px-8 py-3 font-bold hover:bg-white/5 transition cursor-pointer">
            REGLAMENTO
          </button>
        </div>
      </section>

      {/* INFORMACIÓN CLAVE */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-12">
        <div className="glass-card p-8">
          <p className="text-unite-blue text-xs font-bold mb-2">FECHA</p>
          <h3 className="text-2xl font-bold italic">25 ENERO</h3>
          <p className="text-gray-500 text-sm mt-2">18:00 UTC-5</p>
        </div>
        <div className="glass-card p-8 border-t-2 border-t-unite-accent">
          <p className="text-unite-accent text-xs font-bold mb-2">FORMATO</p>
          <h3 className="text-2xl font-bold italic">5 VS 5</h3>
          <p className="text-gray-500 text-sm mt-2">Posicionamiento por puntaje</p>
        </div>
        <div className="glass-card p-8">
          <p className="text-unite-blue text-xs font-bold mb-2">PREMIO</p>
          <h3 className="text-2xl font-bold italic">Felicitaciones</h3>
          <p className="text-gray-500 text-sm mt-2">Para el equipo ganador</p>
        </div>
      </section>

      {/* REGLAS RAPIDAS */}
      <section className="max-w-3xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-8 italic border-l-4 border-unite-accent pl-4">
          REGLAS GENERALES
        </h2>
        <ul className="space-y-6 text-gray-300">
          <li className="flex gap-4">
            <span className="text-unite-accent font-bold font-mono">01</span>
            <p>
              Es obligatorio que todos los miembros estén en el servidor de
              Discord oficial para coordinar las partidas.
            </p>
          </li>
          <li className="flex gap-4">
            <span className="text-unite-accent font-bold font-mono">02</span>
            <p>
              No se permiten Pokémon que hayan sido lanzados hace menos de 1
              semana (Periodo de gracia).
            </p>
          </li>
          <li className="flex gap-4">
            <span className="text-unite-accent font-bold font-mono">03</span>
            <p>
              Cada equipo tiene un máximo de 10 minutos de espera. Pasado ese
              tiempo, se declara victoria por W.O.
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
}
