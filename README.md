TKOH Bookstore - Frontend
Este repositorio contiene el código fuente del frontend para TKOH Bookstore, una aplicación web moderna (SPA) de gestión de librerías. Está construida con React (Vite) y TypeScript, y diseñada para consumir la API de backend tkoh-bookstore-api.

Este proyecto es un panel de administración y gestión (dashboard) que incluye autenticación, gestión de catálogos, control de usuarios basado en roles y un sistema de mensajería en tiempo real.

🔗 Repositorio del Backend: Esta aplicación está diseñada para funcionar con su API correspondiente: tkoh-bookstore-api

🚀 Características Principales
Este frontend implementa un conjunto completo de características de gestión:

Flujo de Autenticación Completo:

Registro de nuevos usuarios.

Inicio de sesión seguro con JSON Web Tokens (JWT).

Persistencia de sesión (el usuario permanece logueado al recargar).

Flujo de recuperación de contraseña en 2 pasos (solicitud de OTP por SMS y reseteo).

Gestión de Perfil de Usuario:

Los usuarios pueden ver y actualizar su propia información de perfil.

Los usuarios pueden cambiar su propia contraseña (requiere contraseña actual).

Control de Acceso Basado en Roles (RBAC):

El enrutamiento está protegido (ProtectedRoute.tsx).

La interfaz de usuario se adapta dinámicamente, ocultando/mostrando elementos (como enlaces del Sidebar o botones de CRUD) según los roles y permisos del usuario (OWNER, ADMIN, VENDEDOR, USUARIO).

Panel de Administración (Admin/Owner):

Gestión de Usuarios: CRUD completo para todos los usuarios del sistema.

Asignación de Roles: Interfaz para asignar o revocar roles a los usuarios.

Visor de Auditoría: Una página dedicada (/admin/logs) para ver el LogActividadController y auditar las acciones del sistema.

Gestión de Catálogo (CRUD):

Módulos CRUD completos con tablas, filtros y modales para:

Libros (/libros)

Categorías (/categorias)

Editoriales (/editoriales)

Gestión de Tareas:

Módulo para que los ADMIN/OWNER asignen tareas (/tareas).

Vista de "Mis Tareas" para que los VENDEDOR vean y actualicen sus tareas asignadas.

Sistema de Mensajería (Chat):

Interfaz de chat (/chat) en tiempo real.

Utiliza STOMP y SockJS para conectarse al endpoint /ws del backend.

Lista las conversaciones del usuario y permite enviar/recibir mensajes en vivo.

Notificaciones en Tiempo Real:

Un ícono de "campana" en el Header que muestra notificaciones push recibidas vía WebSocket.

Carga el historial de notificaciones y permite marcarlas como leídas o eliminarlas.

UI Moderna:

Construido con Tailwind CSS y Shadcn/UI.

Soporte completo para Modo Claro / Modo Oscuro.

🛠️ Stack Tecnológico
Este proyecto utiliza un stack de herramientas moderno del ecosistema de React.

Framework: React 19

Bundler: Vite

Lenguaje: TypeScript

Estilos: Tailwind CSS (con tailwindcss-animate)

Componentes de UI: Shadcn/UI (Primitivos de Radix UI)

Gestión de Estado (API): TanStack Query v5 (React Query)

Gestión de Estado (Global): Zustand v5

Manejo de Formularios: React Hook Form v7

Validación de Esquemas: Zod

Cliente HTTP: Axios (con interceptores para JWT y manejo de errores 401)

Enrutamiento: React Router v7

WebSockets: @stomp/stompjs y sockjs-client

Iconos: Lucide React

Notificaciones (Toast): React Toastify

📁 Estructura del Proyecto
El proyecto sigue una arquitectura modular (o feature-sliced) para mantener una clara separación de responsabilidades.

/src
├── modules/ # Módulos de la aplicación (páginas y componentes)
│ ├── admin/ # Panel de Admins (UserTable, AssignRolesDialog...)
│ ├── auditoria/ # Página y tabla de Logs
│ ├── auth/ # Páginas de Login, Register, ForgotPassword
│ ├── categoria/ # CRUD de Categorías
│ ├── chat/ # Componentes de Chat (SalaDeChat, ConversacionList)
│ ├── editorial/ # CRUD de Editoriales
│ ├── libro/ # CRUD de Libros
│ ├── profile/ # Página de "Mi Perfil"
│ └── tarea/ # CRUD de Tareas
│
├── services/ # Lógica de comunicación con la API
│ ├── api.ts # Configuración central de Axios e interceptores
│ ├── auth/ # authStore.ts (Zustand)
│ ├── admin/ # userApi.ts (Hooks de React Query)
│ ├── auditoria/ # logApi.ts (Hooks de React Query)
│ ├── categoria/ # categoriaApi.ts (Hooks de React Query)
│ │ ... (y así para cada módulo de la API)
│ └── types/ # Tipos de TypeScript y esquemas de Zod
│ ├── simple/ # DTOs simples para listas
│ ├── detail/ # DTOs detallados
│ └── ... (esquemas de creación/actualización)
│
├── shared/ # Elementos compartidos en toda la app
│ ├── stores/ # Stores globales de Zustand (theme, notificaciones)
│ └── ui/ # Componentes Shadcn/UI (Button, Card, Dialog, etc.)
│
├── routes/ # Configuración de enrutamiento
│ ├── AppRoutes.tsx # Definición de todas las rutas
│ └── ProtectedRoute.tsx # Lógica de rutas protegidas por rol
│
├── layouts/ # Estructuras de página (Layouts)
│ ├── MainLayout.tsx # Layout del dashboard (con Sidebar)
│ ├── AuthLayout.tsx # Layout público (para Login/Home)
│ └── includes/ # Componentes de layout (Header, Footer, Sidebar)
│
└── contexts/ # Contextos de React
└── StompContext.tsx # Proveedor de conexión WebSocket
📦 Instalación y Ejecución

1. Requisitos Previos
   Node.js (v18 o superior)

npm (o yarn / pnpm)

Importante: Una instancia del backend tkoh-bookstore-api debe estar en ejecución.

2. Clonar el Repositorio
   Bash

git clone https://github.com/lionelpastranamk500/tkoh-bookstore.git
cd tkoh-bookstore 3. Instalar Dependencias
Bash

npm install 4. Configurar Variables de Entorno
Crea un archivo .env en la raíz del proyecto. Este archivo es necesario para que la aplicación sepa dónde encontrar la API.

Fragmento de código

# La URL base de tu backend Spring Boot

VITE_API_BASE_URL=http://localhost:8080 5. Ejecutar el Servidor de Desarrollo
Bash

npm run dev
La aplicación estará disponible en http://localhost:5173 (o el puerto que Vite indique).

6. Build de Producción
   Para compilar la aplicación para producción, ejecuta:

Bash

npm run build
Esto generará los archivos estáticos optimizados en la carpeta /dist.
