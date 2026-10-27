'use client';

import { useState } from 'react';

// Formulario de contacto. De momento es una demostración: no envía nada (el envío real llega con el correo de Brevo).
export default function ContactForm() {
  const [msg, setMsg] = useState<{ text: string; error: boolean }>({ text: '', error: false });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const bad = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')].find((x) =>
      x instanceof HTMLInputElement && x.type === 'checkbox' ? !x.checked : !x.value.trim() || (x instanceof HTMLInputElement && x.type === 'email' && !/^\S+@\S+\.\S+$/.test(x.value)),
    );
    if (bad) {
      setMsg({ text: 'Revisa los campos obligatorios.', error: true });
      bad.focus();
      return;
    }
    setMsg({ text: 'Gracias. En la web real te responderíamos al correo que has indicado.', error: false });
    form.reset();
  }

  return (
    <form className="cf" id="cf" noValidate onSubmit={onSubmit}>
      <div className="cf-f"><label htmlFor="cfn">Tu nombre</label><input id="cfn" name="nombre" autoComplete="name" required /></div>
      <div className="cf-f"><label htmlFor="cfe">Tu correo electrónico</label><input id="cfe" name="email" type="email" autoComplete="email" spellCheck={false} required /></div>
      <div className="cf-f"><label htmlFor="cfa">Asunto</label><input id="cfa" name="asunto" required /></div>
      <div className="cf-f"><label htmlFor="cfm">Tu mensaje</label><textarea id="cfm" name="mensaje" rows={6} required /></div>
      <div className="cf-hp" aria-hidden="true"><label>Web<input name="web" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="cf-c"><input type="checkbox" name="privacidad" required /><span>He leído y acepto la <a className="link" href="/politica-de-privacidad" target="_blank" rel="noopener">política de privacidad</a>.</span></label>
      <p className="cf-m" id="cfmsg" role="status" data-err={msg.error ? '1' : undefined}>{msg.text}</p>
      <button className="btn primary" type="submit">Enviar mensaje</button>
      <p className="muted" style={{ fontSize: '.85rem' }}>Es una demostración: no se envía ni se guarda nada.</p>
    </form>
  );
}
