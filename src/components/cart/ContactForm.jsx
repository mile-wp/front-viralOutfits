import FormField from '../ui/FormField';

// Datos de contacto del comprador. Recibe el estado del formulario desde la página.
const ContactForm = ({ values, errors, onChange }) => {
  const campo = (name) => ({ name, value: values[name], onChange, error: errors[name] });

  return (
    <div className="checkout-fields">
      <FormField label="Email" type="email" autoComplete="email" placeholder="tu@email.com" required {...campo('email')} />
      <div className="form-row">
        <FormField label="Nombre" autoComplete="given-name" required {...campo('nombre')} />
        <FormField label="Apellido" autoComplete="family-name" required {...campo('apellido')} />
      </div>
      <div className="form-row">
        <FormField label="Teléfono" type="tel" autoComplete="tel" placeholder="11 5555-5555" required {...campo('telefono')} />
        <FormField label="DNI" inputMode="numeric" placeholder="Sin puntos" required {...campo('dni')} />
      </div>
    </div>
  );
};

export default ContactForm;
