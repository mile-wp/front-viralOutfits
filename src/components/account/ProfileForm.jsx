import { useState } from 'react';
import FormField from '../ui/FormField';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { limpiarErrores, validarEmail, validarTexto } from '../../utils/validation';

const GENEROS = [
  { value: '', label: 'Prefiero no decirlo' },
  { value: 'FEMENINO', label: 'Femenino' },
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'OTRO', label: 'Otro' },
];

// Edición de datos según UsuarioUpdateDTO { nombre, apellido, email, genero }
const ProfileForm = ({ usuario }) => {
  const [form, setForm] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    genero: usuario.genero ?? '',
  });
  const [errores, setErrores] = useState({});
  const [guardado, setGuardado] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrores((err) => ({ ...err, [e.target.name]: null }));
    setGuardado(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevos = limpiarErrores({
      nombre: validarTexto(form.nombre, 'nombre'),
      apellido: validarTexto(form.apellido, 'apellido'),
      email: validarEmail(form.email),
    });
    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) setGuardado(true);
  };

  const campo = (name) => ({ name, value: form[name], onChange: handleChange, error: errores[name] });

  return (
    <form className="account-panel" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <FormField label="Nombre" required {...campo('nombre')} />
        <FormField label="Apellido" required {...campo('apellido')} />
      </div>
      <FormField label="Email" type="email" required {...campo('email')} />
      <Select label="Género" options={GENEROS} {...campo('genero')} />
      <div className="account-panel__actions">
        <Button type="submit" variant="dark">
          Guardar cambios
        </Button>
        {guardado && <p className="account-panel__ok">Tus datos se actualizaron.</p>}
      </div>
    </form>
  );
};

export default ProfileForm;
