// Error "esperado": lleva el código HTTP y un mensaje que sí se le muestra al usuario
export class AppError extends Error {
  constructor(estado, mensaje) {
    super(mensaje);
    this.estado = estado;
  }
}
