// Aviso breve en la esquina (usa el elemento #toast del layout).
let timer: ReturnType<typeof setTimeout> | undefined;

export function toast(message: string) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(timer);
  el.textContent = message;
  el.style.pointerEvents = 'none';
  el.classList.add('on');
  timer = setTimeout(() => el.classList.remove('on'), 4000);
}
