# Gestion de reactivos

Pasos para dev

1.  CLonar el repositorio
2.  Instalar dependencias
3.  Crear los archivos .env basados en el .env.template
4.  Correr el proyecto `npm run dev`

## Entornos y builds

| Comando             | Archivo .env       | Uso                                                 |
| ------------------- | ------------------ | --------------------------------------------------- |
| `npm run dev`       | `.env.development` | Desarrollo local (usa el proxy de `vite.config.ts`) |
| `npm run build:dev` | `.env.staging`     | Build para el servidor de desarrollo                |
| `npm run build`     | `.env.production`  | Build para el servidor de producción                |

La URL de la API se configura en `VITE_API_URL` de cada archivo. Vite la
incrusta en el bundle al momento del build (se puede verificar buscando la
URL en `dist/assets/*.js`).
