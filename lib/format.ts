export const fmtDay = (d: string) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${d}T12:00:00`));
