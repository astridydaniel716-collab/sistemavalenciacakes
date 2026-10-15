# Valencia Cakes

Sistema web para la gestión de una repostería artesanal. Permite administrar clientes, productos, proveedores y pedidos registrados manualmente.

El proyecto está desarrollado con React, Node.js, Express y PostgreSQL. Está diseñado para facilitar la gestión de la información de Valencia Cakes mediante una interfaz web y una API REST.

## Características principales

- Gestión de clientes.
- Gestión de productos.
- Gestión de proveedores.
- Registro y consulta de pedidos.
- Creación manual de pedidos.
- Edición de pedidos y sus productos.
- Consulta del detalle de cada pedido.
- Cancelación de pedidos pendientes.
- Búsqueda y filtrado de pedidos.
- Registro de anticipos y cálculo de saldos.
- Autenticación mediante tokens JWT.
- Cifrado de contraseñas mediante bcrypt.
- Interfaz desarrollada con React.
- API REST desarrollada con Node.js y Express.
- Persistencia de datos mediante PostgreSQL.
- Pruebas automatizadas para el backend y el frontend.

## Tecnologías utilizadas

### Frontend

- React
- React Router
- JavaScript
- CSS
- Jest
- React Testing Library

### Backend

- Node.js
- Express
- PostgreSQL
- `pg`
- JSON Web Token (`jsonwebtoken`)
- `bcrypt`
- Multer
- Jest
- Nodemon para el desarrollo

## Requisitos previos

Antes de ejecutar el proyecto, instala:

- Node.js y npm.
- PostgreSQL.
- pgAdmin, recomendado para administrar la base de datos.
- Git.
- Un editor de código, como Visual Studio Code.

## Instalación del proyecto

### 1. Clonar el repositorio

Desde PowerShell o una terminal, ejecuta:

```bash
git clone https://github.com/astridydaniel716-collab/sistemavalenciacakes.git
cd sistemavalenciacakes
```

### 2. Instalar las dependencias

Instala las dependencias del backend:

```powershell
cd backend
npm install
```

Para instalar las dependencias del frontend, abre otra terminal desde la raíz del proyecto y ejecuta:

```powershell
cd frontend
npm install
```

## Configuración del backend

### 1. Crear el archivo de entorno

Desde la raíz del proyecto, crea el archivo `.env` a partir de `.env.example`:

```powershell
Copy-Item backend/.env.example backend/.env
```

Si el archivo `.env` ya existe, no ejecutes este comando para evitar sobrescribir tu configuración local.

### 2. Configurar las variables

Abre `backend/.env` y configura los datos de conexión correspondientes a tu instalación de PostgreSQL.

Ejemplo para la base de datos de demostración:

```env
DB_HOST=localhost
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contrasena_postgres
DB_NAME=sistemavalenciacakes_demo
DB_PORT=5432
PORT=3330
JWT_SECRET=coloca_aqui_una_clave_secreta
```

Reemplaza los valores de ejemplo por los de tu entorno. Utiliza una clave secreta adecuada para JWT.

El nombre `sistemavalenciacakes_demo` corresponde a la base de datos de demostración descrita en la siguiente sección. Si utilizas otra base de datos, ajusta `DB_NAME` según corresponda.

## Base de datos

El proyecto utiliza PostgreSQL para almacenar la información de usuarios, clientes, productos, proveedores y pedidos.

### 1. Crear la base de datos de demostración

En pgAdmin:

1. Conéctate a tu servidor PostgreSQL.
2. Haz clic derecho en **Databases**.
3. Selecciona **Create → Database**.
4. Asigna el nombre `sistemavalenciacakes_demo`.
5. Guarda los cambios.

### 2. Crear las tablas y cargar datos de prueba

En la raíz del repositorio debe existir esta estructura:

```text
database/
└── create_tables.sql
```

El archivo `database/create_tables.sql` contiene las instrucciones SQL para crear las tablas necesarias y cargar datos ficticios de demostración.

Para ejecutarlo:

1. Selecciona la base de datos `sistemavalenciacakes_demo` en pgAdmin.
2. Abre **Tools → Query Tool**.
3. Abre el archivo `database/create_tables.sql`.
4. Ejecuta todas las instrucciones.
5. Comprueba que se hayan creado las siguientes tablas:

   - `usuarios`
   - `clientes`
   - `productos`
   - `proveedores`
   - `pedidos`
   - `detalle_pedido`

El archivo de demostración incluye registros ficticios para facilitar las primeras pruebas de la aplicación.

**Importante:** ejecuta este archivo únicamente sobre una base de datos nueva y vacía. No lo ejecutes sobre una base de datos que contenga información de trabajo.

El archivo SQL original de trabajo puede contener datos personales y no debe publicarse en el repositorio. Utiliza exclusivamente el archivo de demostración preparado para la entrega.


## 3 Credenciales locales de demostración:

- **Usuario:** `admin_demo`
- **Contraseña:** `DemoValencia2026!`

Estas credenciales son exclusivamente para pruebas locales y no deben utilizarse en producción.

## Ejecución del proyecto

El sistema se ejecuta mediante dos procesos independientes: backend y frontend.

### 1. Iniciar el backend

Abre una terminal y ejecuta:

```powershell
cd backend
npm run dev
```

### 2. Iniciar el frontend

Abre una segunda terminal y ejecuta:

```powershell
cd frontend
npm start
```

La aplicación de React se abrirá normalmente en:

`http://localhost:3000`

Si el navegador no se abre automáticamente, ingresa esa dirección manualmente.

### 3. Iniciar sesión

Utiliza las credenciales del administrador de prueba creado en el paso de configuración de la base de datos:

- Usuario: `admin_demo`
- Contraseña: `DemoValencia2026!`

Una vez iniciada la sesión, podrás acceder a los módulos disponibles en la aplicación.

## Pruebas automatizadas

El proyecto dispone de pruebas automatizadas para el backend y el frontend.

### Backend

Desde la carpeta `backend`:

```powershell
npm test
```

### Frontend

Desde la carpeta `frontend`:

```powershell
npm.cmd test -- --watchAll=false --coverage
```

## Verificación funcional

Durante la preparación de esta entrega se realizaron las siguientes comprobaciones manuales con la base de datos de demostración:

- Conexión del backend con PostgreSQL.
- Creación de un usuario administrador mediante la API.
- Inicio de sesión exitoso y generación de un token JWT.
- Acceso a la interfaz web.
- Apertura de los módulos disponibles.
- Visualización de productos, clientes y pedidos de prueba.
- Creación y edición de un cliente de prueba.
- Conservación de los cambios después de recargar el navegador y volver a iniciar sesión.

Estas comprobaciones se realizaron localmente. Se recomienda repetirlas en un equipo limpio para validar las instrucciones de instalación de principio a fin.

## Estado de las funcionalidades

### Funcionalidades implementadas

- Gestión de clientes, productos y proveedores.
- Registro y consulta de pedidos.
- Creación manual y edición de pedidos.
- Consulta del detalle de los pedidos.
- Manejo de anticipos y saldos.
- Autenticación mediante JWT.
- Conexión con PostgreSQL.
- Interfaz de administración con React.
- API REST con Node.js y Express.

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
├── database/
│   └── create_tables.sql
├── .gitignore
└── README.md
```

## Seguridad

- No incluyas credenciales reales en el repositorio.
- No publiques archivos `.env`.
- No incluyas copias de la base de datos real ni datos personales de clientes o proveedores.
- Configura `JWT_SECRET` mediante variables de entorno.
- No utilices las credenciales de demostración en un entorno de producción.
- Utiliza una contraseña segura para las instalaciones reales.

## Consideraciones finales

La aplicación se encuentra en desarrollo y las funcionalidades deben validarse de acuerdo con los requisitos del proyecto.

Para que otra persona pueda ejecutarla, es necesario disponer de Node.js, PostgreSQL, las dependencias instaladas, las variables de entorno configuradas y la base de datos preparada.

La base de demostración permite realizar las pruebas iniciales sin utilizar información real del negocio.
