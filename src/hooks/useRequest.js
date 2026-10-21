import { useEffect, useState } from 'react';

// Ejecuta una función de servicio (que devuelve una promesa) y expone { data, error, cargando }.
// `request` debe ser una función estable (las de /services lo son).
export function useRequest(request, arg) {
  const [estado, setEstado] = useState({ listo: false, arg: undefined, data: null, error: null });

  useEffect(() => {
    let activo = true;
    request(arg).then(
      (data) => {
        if (activo) setEstado({ listo: true, arg, data, error: null });
      },
      (err) => {
        if (activo) setEstado({ listo: true, arg, data: null, error: err.message });
      }
    );
    return () => {
      activo = false;
    };
  }, [request, arg]);

  const cargando = !estado.listo || estado.arg !== arg;
  return {
    data: cargando ? null : estado.data,
    error: cargando ? null : estado.error,
    cargando,
  };
}
