// Validaciones de formularios alineadas con las del back (@Email, @Size, @Pattern "[^<>]*")

export const esEmail = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());

export const tieneCaracteresProhibidos = (valor) => /[<>]/.test(valor);

export const MIN_CONTRASENA = 6;

export const requerido = (valor, mensaje = 'Este campo es obligatorio') =>
  !String(valor ?? '').trim() ? mensaje : null;

export const validarTexto = (valor, campo) => {
  if (!String(valor ?? '').trim()) return `Ingresá tu ${campo}`;
  if (tieneCaracteresProhibidos(valor)) return `El ${campo} no puede contener < o >`;
  return null;
};

export const validarEmail = (valor) => {
  if (!valor.trim()) return 'Ingresá tu email';
  if (!esEmail(valor)) return 'El email no tiene un formato válido';
  return null;
};

// Devuelve solo los campos con error
export const limpiarErrores = (errores) =>
  Object.fromEntries(Object.entries(errores).filter(([, msg]) => Boolean(msg)));
