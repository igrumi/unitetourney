// src/utils/formatters.ts

/**
 * Valida si un RUT chileno es matemáticamente correcto (Módulo 11)
 */
export const validarRut = (rut: string): boolean => {
  const limpio = rut.replace(/[^0-9kK]/g, "");
  
  // Un RUT chileno real tiene entre 8 y 9 caracteres (cuerpo + DV)
  // Si tiene más de 9 o menos de 8, es inválido de entrada.
  if (limpio.length < 8 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dvRecibido = limpio.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperadoNum = 11 - (suma % 11);
  let dvEsperado = dvEsperadoNum === 11 ? "0" : dvEsperadoNum === 10 ? "K" : dvEsperadoNum.toString();

  return dvRecibido === dvEsperado;
};

/**
 * Formatea un RUT chileno (ej: 123456789 -> 12.345.678-9)
 */
export const formatearRut = (rut: string): string => {
  let actual = rut.replace(/[^0-9kK]/g, "");
  if (actual.length < 2) return actual.toUpperCase();
  const dv = actual.slice(-1).toUpperCase();
  let rutNumerico = actual.slice(0, -1);
  let resultado = "";
  while (rutNumerico.length > 3) {
    resultado = "." + rutNumerico.slice(-3) + resultado;
    rutNumerico = rutNumerico.slice(0, -3);
  }

  return rutNumerico + resultado + "-" + dv;
};

/**
 * Formatea el Player ID de Pokémon Unite (ej: 22QYH2A -> #22QYH2A)
 */
export const formatearPlayerId = (id: string): string => {
  let cleaned = id.replace(/#/g, "").toUpperCase();
  if (cleaned.length === 0) return "";
  return `#${cleaned.slice(0, 7)}`;
};

export const PAISES_LATAM = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "México", "Perú", "Uruguay"
];

/**
 * Traduce errores técnicos de la base de datos a mensajes amigables.
 */
export const supabaseErrorTranslator = (message: string): string => {
  if (message.includes('Player_rut_key')) {
    return "Este RUT ya se encuentra inscrito en el torneo.";
  }
  if (message.includes('Player_username_key')) {
    return "Uno de los nombres de usuario (IGN) ya está registrado en otro equipo.";
  }
  if (message.includes('Team_name_key')) {
    return "Ya existe un equipo registrado con ese nombre.";
  }
  if (message.includes('ign_code')) {
    return "El Player ID ingresado ya está en uso.";
  }
  
  // Mensaje por defecto para errores desconocidos
  return "Hubo un problema al procesar el registro. Por favor, inténtalo de nuevo.";
};