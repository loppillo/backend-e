// Este enum es solo una referencia en el código.
// Si usas "tipo_usuario" desde la base de datos, puedes mapearlo así:
export enum Role {
  ADMIN = 'admin',        // Si en la base de datos tienes tipo = 'admin'
  PROFESOR = 'profesor',   // Si tienes tipo = 'profesor'
  ALUMNO = 'alumno',      // Si tienes tipo = 'alumno'
  // Agrega aquí otros valores según los registros de tu tabla tipo_usuario
}