# 🧪 FarmaSecure - Frontend Web App

[![Vue.js Version](https://img.shields.io/badge/Vue.js-3.5.13-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-002130?style=for-the-badge&logo=lucide&logoColor=white)](https://lucide.dev/)

FarmaSecure Frontend es una aplicación web SPA (Single Page Application) moderna, elegante y de alto rendimiento diseñada en **Vue 3** y **Vite**, estilizada con **Tailwind CSS**. Sirve como interfaz administrativa para los colaboradores de FarmaSecure.

---

## 🎨 Aestética y Diseño Premium

*   **Dark Mode & Glassmorphism**: Fondo en tonos cian oscuro (`#001f29` / `#002130`) con efectos de desenfoque y bordes traslúcidos para un acabado de alta gama.
*   **Diseño Reactivo y Animado**: Transiciones fluidas integrando micro-animaciones en hover y efectos de entrada (`animate-in fade-in`).
*   **Google Fonts & Typography**: Uso de tipografías modernas y contrastes ajustados para asegurar la legibilidad del personal médico.
*   **Iconografía Consistente**: Todo el ecosistema visual está potenciado por la biblioteca `lucide-vue-next`.

---

## 🚀 Módulos del Sistema

1.  **Consola de Acceso (Login)**: Formulario estricto con validaciones en tiempo real conectado a Oracle DB.
2.  **Dashboard / Panel**: Estadísticas resumidas rápidas, reportes del día y listado de últimas ventas del POS (exclusivo Administrador/Auditor).
3.  **Catálogo de Inventario (Medicamentos)**: Buscador inteligente de stock por código, nombre o laboratorio.
4.  **Directorio de Pacientes (Clientes)**: Registro de fichas fiscales de facturación e historiales médicos.
5.  **Punto de Venta (POS)**: Carrito de compras automatizado con control interactivo de cantidades, descuentos por ítem y generación rápida de comprobantes.
6.  **Nómina de Personal (Empleados)**: Gestión del staff médico y comercial, cargos autorizados e historiales de salario.
7.  **Trazabilidad (Auditoría)**: Visualizador inmutable de logs en tiempo real para rastreo forense (quién, cuándo y qué se modificó).
8.  **Mi Perfil**: Sección privada para que cada colaborador consulte sus datos y actualice su contraseña obligatoria de primer ingreso (`admin123`).

---

## 📁 Estructura del Código

```bash
FarmaSource_front/
├── src/
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes Vue estructurados por vistas
│   │   ├── AuditView.vue
│   │   ├── ClientsView.vue
│   │   ├── DashboardView.vue
│   │   ├── EmployeesView.vue
│   │   ├── LoginView.vue
│   │   ├── ProductsView.vue
│   │   ├── ProfileView.vue      # Panel de cambio de contraseña
│   │   ├── SalesPOSView.vue
│   │   ├── Sidebar.vue          # Navegación reactiva al rol
│   │   ├── Topbar.vue           # Muestra el nombre real del usuario y avatar
│   │   └── UsersRolesView.vue
│   ├── store.ts         # Estado global de la aplicación (Vue Reactive Store)
│   ├── types.ts         # Interfaces y modelos de TypeScript
│   ├── main.ts          # Inicialización de la aplicación
│   └── style.css        # Hoja de estilos global y utilidades de Tailwind
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🏁 Instalación y Configuración

### 1. Requisitos Previos
*   **Node.js** v18 o superior.
*   **FarmaSecure Backend** corriendo en `http://localhost:3001`.

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Lanzar Servidor de Desarrollo
```bash
npm run dev
```
La aplicación se abrirá automáticamente en: `http://localhost:3000`.

### 4. Compilar para Producción
```bash
npm run build
```
Vite empaquetará la aplicación web optimizada, minificada y lista para desplegar en la carpeta `/dist`.
