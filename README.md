# Portafolio — Santiago Fajardo

Portafolio personal one-page con experiencias 3D, animaciones al scroll y capturas automáticas de proyectos. SSG estático construido con Astro.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | [Astro 5](https://astro.build) (SSG, Content Collections, View Transitions) |
| 3D | [React Three Fiber](https://r3f.docs.pmnd.rs) + [Drei](https://github.com/pmndrs/drei) + [Postprocessing](https://github.com/pmndrs/react-postprocessing) (Bloom) |
| Animaciones | [GSAP](https://gsap.com) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com) + CSS custom properties |
| UI | React 19 (islas en Astro) |
| Imágenes | [Microlink API](https://microlink.io) (`embed=screenshot.url`) + sharp |
| Fuentes | Space Grotesk + JetBrains Mono (Google Fonts) |
| Paquete | pnpm |

## Animaciones

- **Scroll**: nativo + GSAP ScrollTrigger para reveals al entrar al viewport
- **Hero 3D**: torus knot central con seguimiento de mouse, shapes orbitando con Float, partículas, Bloom
- **Contacto 3D**: anillo + partículas, render pausado cuando no está en viewport
- **Cards**: tilt 3D con glare al hover (RAF-throttled), shimmer con translateX

## Rendimiento

- Chunks separados: `three` (r3f), `R3F` (fiber + drei + postprocessing)
- `AdaptiveDpr` + `AdaptiveEvents` en escenas 3D — bajan calidad en hardware lento
- Escenas 3D se pausan con `IntersectionObserver` cuando no están en viewport
- `inlineStylesheets: always` — CSS crítico inlineado
- Optimización de imágenes con sharp

## Proyectos

Los proyectos se definen en `src/content/projects/` como archivos MDX con schema:
- `title`, `description`, `tech[]`, `type` (visual/technical/mixed)
- `liveUrl`, `repoUrl`, `image` (opcional — Microlink embed)

Las capturas de pantalla se generan via Microlink API en tiempo real desde el navegador, no en build.

## Scripts

```bash
pnpm dev       # desarrollo
pnpm build     # build SSG → dist/
pnpm preview   # servidor local del build
```
