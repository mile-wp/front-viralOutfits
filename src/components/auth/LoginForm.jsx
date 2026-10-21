import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../ui/FormField';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { IconArrowUpRight, IconLock } from '../ui/Icons';
import { login } from '../../services/usuarioService';
import { limpiarErrores, requerido, validarEmail } from '../../utils/validation';

// Campos según LoginRequestDTO { email, contrasena }
const LoginForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', contrasena: '', recordarme: true });
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrores((err) => ({ ...err, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = limpiarErrores({
      email: validarEmail(form.email),
      contrasena: requerido(form.contrasena, 'Ingresá tu contraseña'),
    });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await login({ email: form.email.trim(), contrasena: form.contrasena });
      navigate('/mi-cuenta');
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message });
      setEnviando(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Tu email"
        required
        value={form.email}
        onChange={handleChange}
        error={errores.email}
      />
      <FormField
        label="Contraseña"
        name="contrasena"
        type="password"
        autoComplete="current-password"
        placeholder="Tu contraseña"
        required
        value={form.contrasena}
        onChange={handleChange}
        error={errores.contrasena}
      />

      <div className="auth-form__row">
        <Checkbox name="recordarme" checked={form.recordarme} onChange={handleChange}>
          Recordarme
        </Checkbox>
        <button
          type="button"
          className="link"
          onClick={() => setAviso({ tipo: 'info', texto: 'Te vamos a mandar un link para recuperarla al email que ingreses.' })}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {aviso && (
        <p className={`auth-form__notice ${aviso.tipo === 'error' ? 'auth-form__notice--error' : ''}`} role="status">
          {aviso.texto}
        </p>
      )}

      <Button type="submit" full arrow disabled={enviando}>
        {enviando ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>

      <p className="auth-form__switch">
        ¿Todavía no tenés cuenta?
        <Link to="/registro">
          Creá tu cuenta <IconArrowUpRight size={12} />
        </Link>
      </p>
      <p className="auth-form__secure">
        <IconLock size={12} /> Tus datos viajan encriptados.
      </p>
    </form>
  );
};

export default LoginForm;
