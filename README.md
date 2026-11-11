# femtenis.cl

Sitio del medio femtenis.cl: noticias, historias, ranking y calendario del tenis femenino chileno.

- **Contenido:** [Sanity](https://www.sanity.io) (carpeta `studio/`). El equipo edita en el Studio.
- **Sitio:** [Next.js](https://nextjs.org) con exportación estática (carpeta `web/`). Todo el HTML se genera al construir.
- **Publicación:** [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) sirviendo solo archivos estáticos. Cada vez que se publica algo en Sanity, un webhook reconstruye el sitio.

```
femtenis-cl/
├─ studio/          Sanity Studio: esquema de contenidos (modelo de datos)
├─ web/             Sitio Next.js (salida estática en web/out)
├─ seed/demo.ndjson Datos de ejemplo (sirven para el modo demo y para poblar Sanity)
└─ .github/         Reconstrucción automática cada lunes
```

## Costos

Todo cabe en los planes gratuitos:

| Servicio | Plan gratis | Qué usamos |
| --- | --- | --- |
| Cloudflare Workers | Las visitas a archivos estáticos son gratis e ilimitadas | El sitio completo es estático |
| Cloudflare Workers Builds | 3.000 minutos de build al mes, 1 build a la vez | Un build demora pocos minutos |
| Sanity | 20 usuarias, 10.000 documentos, 2 datasets públicos, 2 webhooks | 1 dataset y 1 webhook |
| GitHub Actions | Minutos gratis en repositorios públicos y privados | 1 llamada por semana |

---

## Paso a paso

Necesitas cuentas gratuitas en **GitHub**, **Sanity** y **Cloudflare**, y **Node.js 22** en tu computador (`node -v` debe mostrar `v22…`; si no lo tienes, instálalo desde [nodejs.org](https://nodejs.org)).

Todos los comandos se escriben en la Terminal, partiendo desde la carpeta del proyecto:

```bash
cd ~/Desktop/"SITIO WEB"/femtenis-cl
```

### 1. Ver el sitio en tu computador (modo demo)

Sin conectar Sanity, el sitio usa los datos de ejemplo y muestra una franja verde que dice "Modo demo".

```bash
cd web
npm install
npm run dev
```

Abre <http://localhost:3000>. Para detenerlo: `Ctrl + C`.

Para probar la versión estática final, como quedará publicada:

```bash
npm run build      # genera web/out
npx serve out      # sirve esa carpeta en http://localhost:3000
```

### 2. Subir el proyecto a GitHub

1. En GitHub, crea un repositorio vacío llamado `femtenis-cl` (privado o público, **sin** README ni .gitignore).
2. En la Terminal, desde la carpeta del proyecto:

```bash
git init -b main
git add .
git commit -m "Sitio femtenis.cl: Next.js + Sanity + Cloudflare"
git remote add origin https://github.com/TU_USUARIO/femtenis-cl.git
git push -u origin main
```

El archivo `.gitignore` ya excluye `node_modules`, las carpetas de build y los archivos `.env` con tus datos.

### 3. Crear el proyecto en Sanity

1. Entra a [sanity.io/manage](https://www.sanity.io/manage) e inicia sesión.
2. Crea un proyecto nuevo llamado **femtenis**, con un dataset llamado **production**. En el plan gratuito los datasets son públicos: cualquiera puede leer lo **publicado** por la API, pero no los borradores. Para un medio eso está bien.
3. Copia el **Project ID** (lo ves en la portada del proyecto).
4. Crea el archivo de configuración del Studio:

```bash
cd studio
cp .env.example .env
```

Abre `studio/.env` y reemplaza `tu_project_id` por tu Project ID.

### 4. Instalar el Studio y cargar los datos de ejemplo

```bash
cd studio
npm install
npx sanity login     # abre el navegador para iniciar sesión
npm run seed         # carga los 45 documentos de ejemplo en el dataset production
npm run dev          # abre el Studio en http://localhost:3333
```

Los datos de ejemplo vienen del wireframe y la maqueta (jugadoras, torneos, artículos con textos entre corchetes). Reemplázalos o bórralos desde el Studio cuando cargues el contenido real.

### 5. Publicar el Studio para el equipo

```bash
npm run deploy
```

Queda en `https://femtenis.sanity.studio` (si el nombre está tomado, el comando te pide otro). Para sumar editoras: [sanity.io/manage](https://www.sanity.io/manage) → tu proyecto → **Members** → **Invite**.

### 6. Conectar el sitio a Sanity

```bash
cd web
cp .env.example .env.local
```

En `web/.env.local` completa `NEXT_PUBLIC_SANITY_PROJECT_ID` con tu Project ID. Vuelve a correr `npm run dev`: la franja de "Modo demo" desaparece y el sitio lee el contenido de Sanity.

### 7. Publicar el sitio en Cloudflare

1. En el [panel de Cloudflare](https://dash.cloudflare.com): **Workers & Pages** → **Create** → importa un repositorio de Git y conecta tu cuenta de GitHub.
2. Elige el repositorio `femtenis-cl` y configura:
   - **Root directory / Path:** `web`
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
   - **Variables de build:**
     - `NEXT_PUBLIC_SANITY_PROJECT_ID` = tu Project ID
     - `NEXT_PUBLIC_SANITY_DATASET` = `production`
     - `NEXT_PUBLIC_SITE_URL` = `https://femtenis.cl`
3. Guarda y despliega. El sitio queda en `https://femtenis-cl.<tu-cuenta>.workers.dev`.

Desde ahora, cada `git push` a `main` vuelve a publicar el sitio.

### 8. Republicar automáticamente al publicar en Sanity

Como el sitio es estático, hay que reconstruirlo cuando cambia el contenido:

1. **Cloudflare:** tu Worker → **Settings** → **Builds** → **Deploy Hooks** → crea uno para la rama `main` y copia la URL.
2. **Sanity:** [sanity.io/manage](https://www.sanity.io/manage) → tu proyecto → **API** → **Webhooks** → **Create webhook**:
   - **URL:** la del Deploy Hook
   - **Dataset:** `production`
   - **Trigger on:** Create, Update y Delete
   - **HTTP method:** POST
   - Deja vacíos el filtro y la proyección.

Desde ahora, cada vez que alguien publique en el Studio el sitio se actualiza solo en unos minutos.

### 9. Reconstrucción semanal (opcional, recomendado)

"En cancha esta semana" y el calendario dependen de la fecha del build. El archivo `.github/workflows/reconstruir-semanal.yml` reconstruye el sitio cada lunes aunque nadie publique. Para activarlo:

GitHub → tu repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
- **Name:** `CLOUDFLARE_DEPLOY_HOOK`
- **Value:** la misma URL del Deploy Hook

### 10. Conectar el dominio femtenis.cl

1. Agrega `femtenis.cl` a tu cuenta de Cloudflare (**Add a domain**). Cloudflare te dará dos servidores de nombres.
2. En [NIC Chile](https://www.nic.cl), cambia los servidores de nombres del dominio por los de Cloudflare. El cambio puede tardar algunas horas.
3. En tu Worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain** → `femtenis.cl` (y `www.femtenis.cl` si quieres).

---

## Día a día

- **Publicar una nota:** Studio → Artículos → crear → completar → **Publish**. El sitio se actualiza solo.
- **Portada:** Studio → Portada. Elige el artículo destacado, el perfil del mes, las jugadoras del carrusel y el partido destacado. Si dejas algo vacío, el sitio usa el contenido más reciente.
- **Ranking:** cada lunes, crea una fila de **Ranking semanal** por jugadora. La variación se calcula sola comparando con la semana anterior.
- **Torneos y partidos:** crea el torneo, sus **Participaciones** (quién está inscrita) y los **Partidos** cuando se publique el cuadro.

## Notas técnicas

- **Modo demo:** sin `NEXT_PUBLIC_SANITY_PROJECT_ID`, `web/src/sanity/fetch.ts` evalúa las mismas consultas GROQ sobre `seed/demo.ndjson` con `groq-js`.
- **Filtros:** los filtros de Actualidad y Las tenistas cambian la URL (`?jugadora=`, `?por=`, `?formato=`). Como el sitio es estático, el filtrado ocurre en el navegador; el HTML inicial trae el listado completo, así que los buscadores lo indexan igual.
- **Imágenes:** se sirven desde el CDN de Sanity con `srcset` y formato automático (`web/src/components/Img.tsx`).
- **Estilos:** `web/src/app/globals.css` contiene los tokens del Design System y los componentes de la maqueta. Tailwind v4 queda disponible para utilidades.
- **Accesibilidad:** un solo `h1` por página, headings solo para contenido, landmarks (`header`, `nav`, `main`, `footer`), enlace "Saltar al contenido" y fechas en `<time>`.
- **Tipos:** `npm run typecheck` en `web/` revisa TypeScript. El build no se detiene por errores de tipos, para que una publicación nunca quede bloqueada.
