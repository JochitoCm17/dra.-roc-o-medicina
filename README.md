# Dra. Rocío Medicina

Crea una landing page médica en español para el consultorio de la Dra. Rocío. Stack: React, Tailwind, shadcn/ui, lucide-react, framer-motion. Estilo: limpio y cálido, fondo #F3F8F7, tinta #0B2E3A, acento teal #127C82, detalle coral #E8714A. Tipografías: Fraunces (títulos) y Manrope (texto). Secciones en orden: (1) navbar flotante con blur y botón "Agendar cita"; (2) hero con título, subtítulo, dos CTAs y tarjeta "Atención inmediata disponible" que calcula abierto/cerrado según el horario; (3) bento grid de servicios (una tarjeta grande oscura y cuatro claras); (4) perfil de la Dra. Rocío con credenciales, filosofía y cifras; (5) formulario de cita (nombre, fecha, hora, servicio, mensaje) cuyo botón "Agendar Cita" abre en pestaña nueva wa.me con el mensaje estructurado, más botón a Cal.com. Sin backend ni base de datos; (6) ubicación con mapa embebido, horarios con el día actual resaltado y botones Maps/Waze/Llamar; (7) footer con enlaces, aviso legal y botón flotante de WhatsApp solo en móvil. Todos los datos (teléfono, dirección, horarios, credenciales) viven en un único archivo src/config.ts. Respeta prefers-reduced-motion

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9a46c7b3-9681-4fe8-8384-3b3ff9d5f37d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
