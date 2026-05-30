# Historial Financiero Mensual

Aplicación web para llevar un historial de ingresos y gastos mensuales. Construida con React + TypeScript + Supabase.

## Stack

- **Frontend:** React 19, TypeScript, Vite, TailwindCSS, Recharts
- **Backend:** Supabase (Auth + PostgreSQL + RLS)
- **Despliegue:** Vercel / Netlify

## Requisitos

- Node.js 18+
- Una cuenta en [Supabase](https://supabase.com) (plan gratuito)
- Una cuenta en [Vercel](https://vercel.com) o [Netlify](https://netlify.com)

## Setup Local

### 1. Clonar e instalar dependencias

```bash
cd historial-financiero
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/migrations/00001_create_tables.sql`
3. Ve a **Authentication > Providers** y habilita _Email + Password_ (y opcionalmente _Google_)
4. Ve a **Project Settings > API** y copia tu `URL` y `anon key`

### 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

## Despliegue en Vercel

### Opción 1: Deploy con Git

1. Sube el proyecto a un repositorio de GitHub
2. En [Vercel](https://vercel.com/new), importa el repositorio
3. Configura las variables de entorno (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. El framework se detectará automáticamente como Vite
5. Haz clic en **Deploy**

> **Importante:** Si usas _Client-Side Routing_ con React Router, agrega un archivo `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Opción 2: Deploy con CLI

```bash
npm i -g vercel
vercel
```

## Despliegue en Netlify

1. Sube el proyecto a GitHub
2. En [Netlify](https://app.netlify.com), importa desde Git
3. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Agrega un archivo `public/_redirects` con: `/* /index.html 200`

## Uso

1. Regístrate o inicia sesión
2. Selecciona un mes/año para ver tu historial
3. Agrega, edita o elimina transacciones
4. Visualiza KPIs y gráficos de resumen
5. Filtra por categoría

## Licencia

MIT
