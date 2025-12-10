# Sistema de Gestión de Préstamos - Frontend

Aplicación web desarrollada con React + Vite para la gestión de préstamos de equipos.

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Git

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/leyson2/gestion-prestamo-front.git
cd gestion-prestamo-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Ajusta la URL según tu configuración del backend.

### 4. Ejecutar la aplicación en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## Características

- ✅ Registro de préstamos de equipos
- ✅ Visualización de lista de préstamos con filtros
- ✅ Actualización de estado de préstamos
- ✅ Eliminación de préstamos
- ✅ Vista detallada de cada préstamo
- ✅ Cambio de estado con comentarios obligatorios para devoluciones
- ✅ Validaciones de formulario
- ✅ Alertas interactivas con SweetAlert2

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── LoanForm.jsx    # Formulario de registro
│   ├── LoanList.jsx    # Lista de préstamos
│   ├── StatusModal.jsx # Modal de actualización
│   └── LoanDetailModal.jsx # Modal de detalles
├── services/           # Servicios de API
│   ├── loanService.js
│   └── equipmentService.js
└── assets/            # Recursos estáticos
```

## Tecnologías Utilizadas

- **React 19** - Librería de UI
- **Vite** - Build tool y dev server
- **SweetAlert2** - Alertas y modales interactivos
- **CSS3** - Estilos personalizados

## Conexión con el Backend

Asegúrate de que el backend esté corriendo en la URL especificada en `VITE_API_BASE_URL`. El frontend consume los siguientes endpoints:

- `GET /api/prestamos/` - Obtener todos los préstamos
- `POST /api/prestamos/` - Crear un préstamo
- `GET /api/prestamos/{id}/` - Obtener un préstamo
- `PUT /api/prestamos/{id}/` - Actualizar préstamo completo
- `PATCH /api/prestamos/cambiar-estado/{id}` - Cambiar estado del préstamo
- `DELETE /api/prestamos/{id}/` - Eliminar préstamo
- `GET /api/equipos/` - Obtener lista de equipos


