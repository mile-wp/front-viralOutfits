import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../ui/FormField';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { IconArrowUpRight } from '../ui/Icons';
import { registrar } from '../../services/usuarioService';
import { limpiarErrores, MIN_CONTRASENA, validarEmail, validarTexto } from '../../utils/validation';

// Campos según UsuarioRequestDTO { nombre, apellido, email, contrasena } (+ confirmación y términos solo del front)
const VACIO = { nombre: '', apellido: '', email: '', contrasena: '', confirmar: '', terminos: false, novedades: false };

const validar = (form) =>
  limpiarErrores({
    nombre: validarTexto(form.nombre, 'nombre'),
    apellido: validarTexto(form.apellido, 'apellido'),
    email: validarEmail(form.email),
    contrasena:
      form.contrasena.length < MIN_CONTRASENA ? `Usá al menos ${MIN_CONTRASENA} caracteres` : null,
    confirmar: form.confirmar !== form.contrasena ? 'Las contraseñas no coinciden' : null,
    terminos: !form.terminos ? 'Tenés que aceptar los términos para crear la cuenta' : null,
  });

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrores((err) => ({ ...err, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await registrar({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        contrasena: form.contrasena,
      });
      navigate('/mi-cuenta');
    } catch (err) {
      setErrorServidor(err.message);
      setEnviando(false);
    }
  };

  const campo = (name) => ({ name, value: form[name], onChange: handleChange, error: errores[name] });

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <FormField label="Nombre" placeholder="Tu nombre" autoComplete="given-name" required {...campo('nombre')} />
        <FormField label="Apellido" placeholder="Tu apellido" autoComplete="family-name" required {...campo('apellido')} />
      </div>
      <FormField label="Email" type="email" placeholder="Tu email" autoComplete="email" required {...campo('email')} />
      <FormField
        label="Contraseña"
        type="password"
        placeholder="Creá una contraseña"
        autoComplete="new-password"
        hint={`Usá al menos ${MIN_CONTRASENA} caracteres.`}
        required
        {...campo('contrasena')}
      />
      <FormField
        label="Confirmar contraseña"
        type="password"
        placeholder="Repetí tu contraseña"
        autoComplete="new-password"
        required
        {...campo('confirmar')}
      />

      <Checkbox name="terminos" checked={form.terminos} onChange={handleChange} error={errores.terminos}>
        Acepto los términos y condiciones y la política de privacidad. *
      </Checkbox>
      <Checkbox name="novedades" checked={form.novedades} onChange={handleChange}>
        Quiero recibir novedades y acceso anticipado a los próximos drops.
      </Checkbox>

      {errorServidor && <p className="auth-form__notice auth-form__notice--error">{errorServidor}</p>}

      <Button type="submit" full arrow disabled={enviando}>
        {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>

      <p className="auth-form__switch">
        ¿Ya tenés cuenta?
        <Link to="/login">
          Iniciá sesión <IconArrowUpRight size={12} />
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
