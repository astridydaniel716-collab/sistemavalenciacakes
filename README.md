# Valencia Cakes

Sistema web para la gestión de una repostería artesanal. El proyecto permite administrar clientes, productos y pedidos, incluyendo pedidos registrados manualmente y pedidos provenientes de la página web.

## Características principales

- Gestión de clientes.
- Gestión de productos.
- Registro y consulta de pedidos.
- Creación manual de pedidos.
- Edición de pedidos y sus productos.
- Consulta del detalle de cada pedido.
- Cancelación de pedidos pendientes.
- Búsqueda y filtrado de pedidos.
- Registro de anticipos y cálculo de saldos.
- Autenticación mediante tokens JWT.
- Interfaz desarrollada con React.
- API REST desarrollada con Node.js y Express.
- Pruebas automatizadas para el backend y el frontend.

## Tecnologías utilizadas

### Frontend
- React
- React Router
- JavaScript
- CSS
- Jest y React Testing Library

### Backend
- Node.js
- Express
- PostgreSQL
- `pg`
- JSON Web Token (`jsonwebtoken`)
- `bcrypt`
- Multer
- Jest

## Requisitos previos

Antes de ejecutar el proyecto, instala:

- Node.js y npm.
- PostgreSQL.
- Git.
- Un editor de código, como Visual Studio Code.

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/astridydaniel716-collab/sistemavalenciacakes.git
cd sistemavalenciacakes
```

Instala las dependencias del backend:

```bash
cd backend
npm install
```

Instala las dependencias del frontend en una segunda terminal:

```bash
cd frontend
npm install
```

## Configuración del backend

Dentro de la carpeta `backend`, crea un archivo llamado `.env` a partir de `.env.example`.

En PowerShell, desde la raíz del proyecto, puedes ejecutar:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edita `backend/.env` y configura los valores correspondientes a tu instalación de PostgreSQL:

```env
DB_HOST=localhost
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contrasena_postgres
DB_NAME=sistemavalenciacakes
DB_PORT=5432
PORT=3330
JWT_SECRET=tu_clave_secreta
```

Reemplaza los valores de ejemplo por los datos de tu entorno. Utiliza una clave secreta segura para JWT.

**Importante:** no publiques el archivo `.env` ni compartas contraseñas o claves secretas.

## Base de datos

El proyecto utiliza PostgreSQL.

1. Instala y ejecuta PostgreSQL.
2. Crea una base de datos llamada `sistemavalenciacakes`, o utiliza el nombre que configures en `DB_NAME`.
3. Configura el usuario, la contraseña, el host y el puerto en `backend/.env`.
4. Asegúrate de que las tablas requeridas por la aplicación estén creadas antes de ejecutar el sistema.

El procedimiento de creación de tablas debe seguir el esquema de base de datos utilizado por el proyecto.

## Ejecución del proyecto

### Iniciar el backend

Desde una terminal:

```powershell
cd backend
npm run dev
```

El servidor utiliza el puerto `3330` por defecto, salvo que se configure otro valor en `PORT`.

También puedes ejecutar el backend en modo normal con:

```powershell
npm start
```

### Iniciar el frontend

En otra terminal:

```powershell
cd frontend
npm start
```

El frontend de React se abrirá normalmente en:

http://localhost:3000

## Pruebas automatizadas

### Backend

Desde la carpeta `backend`:

```bash
npm test
```

### Frontend

Desde la carpeta `frontend`:

```bash
npm test
```

Para generar una compilación de producción del frontend:

```bash
npm run build
```

## Estructura del proyecto

```text
sistemavalenciacakes/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── test/
│   ├── uploads/
│   ├── .env.example
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## Seguridad

- No incluyas credenciales reales en el repositorio.
- Configura `JWT_SECRET` mediante variables de entorno.
- Mantén las dependencias actualizadas.
- No utilices credenciales de desarrollo en un entorno de producción.

## Estado del proyecto

Proyecto en desarrollo. Las funcionalidades y las pruebas se actualizan a medida que avanza su implementación.