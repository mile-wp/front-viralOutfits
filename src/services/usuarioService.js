import { apiFetch, getJson, USE_MOCK } from './api';

// GET /usuarios/me -> UsuarioResponseDTO
export const getUsuarioActual = (token) => getJson('user.json', '/usuarios/me', { token });

// POST /auth/login con LoginRequestDTO { email, contrasena } -> LoginResponseDTO { mensaje, token, usuario }
// En modo mock se simula un login exitoso con el usuario de /data/user.json
export const login = async (credenciales) => {
  if (!USE_MOCK) return apiFetch('/auth/login', { method: 'POST', body: credenciales });
  const usuario = await getUsuarioActual();
  return { mensaje: 'Login exitoso', token: 'mock-token', usuario };
};

// POST /auth/registro con UsuarioRequestDTO { nombre, apellido, email, contrasena, ... } -> UsuarioResponseDTO
export const registrar = async (usuario) => {
  if (!USE_MOCK) return apiFetch('/auth/registro', { method: 'POST', body: usuario });
  const actual = await getUsuarioActual();
  return { ...actual, nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, rol: 'CLIENTE' };
};
