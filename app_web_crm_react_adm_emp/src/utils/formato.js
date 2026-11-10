export const soles = (n) => 'S/ ' + Number(n).toFixed(2);

// "2026-11-10 15:00:00" (hora de la tienda) → "martes 10 de noviembre, 15:00"
export function fechaEntrega(texto) {
  const [dia, hora] = String(texto).replace('T', ' ').split(' ');
  const [a, m, d] = dia.split('-').map(Number);
  const nombre = new Date(a, m - 1, d).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  return `${nombre}, ${hora.slice(0, 5)}`;
}

// Fecha ISO del servidor → "12:35" en hora de Perú
export const hora = (iso) =>
  new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });

// Mínimo para el <input type="datetime-local">: mañana a las 08:00
export function minimoEntrega() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T08:00`;
}