# Valencia Cakes

Sistema web para la gestión de una repostería artesanal. Permite administrar clientes, productos, proveedores y pedidos mediante una interfaz web conectada a una API REST y una base de datos PostgreSQL.

## 1. Características principales

- Gestión de clientes (crear, editar, consultar y eliminar)
- Gestión de productos (crear, editar, consultar y eliminar)
- Gestión de proveedores (crear, editar, consultar y eliminar)
- Registro y consulta de pedidos.
- Creación manual de pedidos.
- Edición de pedidos y sus productos.
- Consulta del detalle de cada pedido.
- Cancelación de pedidos, solo cuando están en estado "pendiente".
- Búsqueda y filtrado de pedidos.
- Registro de anticipos y cálculo de saldos.
- Autenticación mediante tokens JWT.
- Protección de contraseñas mediante bcrypt.
- Interfaz web desarrollada con React.
- API REST desarrollada con Node.js y Express.
- Persistencia de información mediante PostgreSQL.
- Pruebas automatizadas para el backend y el frontend.

## 2. Tecnologías utilizadas

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
- `jsonwebtoken`
- `bcrypt`
- Multer
- Jest
- Nodemon

### Herramientas
- Git
- Visual Studio Code
- PostgreSQL
- pgAdmin

## 3. Requisitos previos

Antes de instalar el proyecto, asegúrate de tener:

- Node.js y npm instalados.
- PostgreSQL instalado y funcionando.
- pgAdmin, recomendado para administrar la base de datos.
- Git instalado.
- Un editor de código, como Visual Studio Code.

## 4. Instalación del proyecto

### 4.1. Clonar el repositorio

Abre PowerShell y ejecuta:

git clone https://github.com/astridydaniel716-collab/sistemavalenciacakes.git
cd sistemavalenciacakes

### 4.2. Instalar las dependencias del backend

Desde la raíz del proyecto:

cd backend
npm install

### 4.3. Instalar las dependencias del frontend

Abre una segunda terminal en la raíz del proyecto y ejecuta:

cd frontend
npm install

## 5. Configuración del backend

### 5.1. Crear el archivo de entorno

Desde la raíz del repositorio, ejecuta:

Copy-Item backend/.env.example backend/.env


Si ya existe `backend/.env`, no ejecutes el comando anterior, para evitar sobrescribir tu configuración.

### 5.2. Configurar las variables de entorno

Abre `backend/.env` y configura los datos de conexión de PostgreSQL.

Ejemplo:

env
DB_HOST=localhost
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contrasena_postgres
DB_NAME=sistemavalenciacakes_demo
DB_PORT=5432
PORT=3330
JWT_SECRET=coloca_aqui_una_clave_secreta


Sustituye los valores de ejemplo por los correspondientes a tu instalación.

- `DB_HOST`: servidor de PostgreSQL.
- `DB_USER`: usuario de PostgreSQL.
- `DB_PASSWORD`: contraseña de ese usuario.
- `DB_NAME`: nombre de la base de datos.
- `DB_PORT`: puerto de PostgreSQL.
- `PORT`: puerto del backend.
- `JWT_SECRET`: clave utilizada para firmar los tokens de autenticación.

No publiques el archivo `.env` ni compartas credenciales reales.

## 6. Configuración de la base de datos

El proyecto utiliza PostgreSQL para almacenar la información de usuarios, clientes, productos, proveedores y pedidos.

### 6.1. Crear la base de datos de demostración

En pgAdmin:

1. Conéctate a tu servidor PostgreSQL.
2. Haz clic derecho en **Databases**.
3. Selecciona **Create → Database**.
4. Escribe `sistemavalenciacakes_demo` como nombre.
5. Guarda los cambios.

### 6.2. Crear las tablas y cargar los datos de prueba

En el repositorio está disponible el archivo:

database/create_tables.sql

Para ejecutarlo:

1. Selecciona la base de datos `sistemavalenciacakes_demo`.
2. Abre **Tools → Query Tool**.
3. Abre el archivo `database/create_tables.sql`.
4. Ejecuta las instrucciones SQL.
5. Comprueba que se hayan creado las tablas y los registros de demostración.

Entre las tablas principales se encuentran:

- `usuarios`
- `clientes`
- `productos`
- `proveedores`
- `pedidos`
- `detalle_pedido`

La estructura definitiva depende del contenido del archivo SQL del proyecto.

El archivo SQL preparado para la entrega debe contener datos ficticios y no debe incluir información personal de clientes o proveedores.

## 7. Usuario de prueba

Las credenciales previstas para la demostración local son:

- **Usuario:** `admin_demo`
- **Contraseña:** `DemoValencia2026!`

Estas credenciales solo funcionarán si el usuario de demostración se encuentra creado en la base de datos y su contraseña es compatible con el mecanismo de autenticación implementado.

Si el usuario no existe después de ejecutar el archivo SQL, revisa el proceso de inicialización de usuarios del proyecto antes de continuar.

No utilices estas credenciales en producción.

## 8. Ejecución del proyecto

El backend y el frontend se ejecutan en terminales independientes.

### 8.1. Iniciar el backend

En una terminal de PowerShell:

cd backend
npm run dev

El backend utilizará el puerto configurado en `PORT`, cuyo valor de ejemplo es `3330`.

### 8.2. Iniciar el frontend

Abre otra terminal desde la raíz del repositorio:

cd frontend
npm start

La aplicación estará disponible normalmente en:

http://localhost:3000

Si el navegador no se abre automáticamente, ingresa la dirección manualmente.

### 8.3. Iniciar sesión

Ingresa las credenciales del usuario de demostración.

Si la autenticación es correcta, podrás acceder a los módulos habilitados para ese usuario.

## 9. Pruebas automatizadas

El proyecto cuenta con pruebas automatizadas para el backend y el frontend.

### 9.1. Pruebas del backend

Desde la carpeta `backend`:

npm test

### 9.2. Pruebas del frontend

Desde la carpeta `frontend`:

npm.cmd test -- --watchAll=false --coverage


## 10. Demostración funcional

Para demostrar el funcionamiento completo del sistema, utiliza la base de datos de demostración y sigue estos pasos.

### 10.1. Acceso al sistema

1. Inicia PostgreSQL.
2. Inicia el backend.
3. Inicia el frontend.
4. Ingresa con el usuario de prueba.
5. Comprueba que puedes acceder a los módulos correspondientes.

### 10.2. Gestión de clientes

1. Abre el módulo de clientes.
2. Registra un cliente de prueba.
3. Consulta el registro en el listado.
4. Edita uno de sus datos.
5. Comprueba que el cambio se refleja en la interfaz.

### 10.3. Gestión de proveedores

1. Abre el módulo de proveedores.
2. Registra un proveedor ficticio.
3. Consulta su información.
4. Edita uno de sus datos.
5. Verifica que el cambio se refleje en el listado.

### 10.4. Gestión de productos

1. Abre el módulo de productos.
2. Registra un producto de prueba.
3. Consulta el producto creado.
4. Modifica uno de sus datos.
5. Comprueba que el sistema muestre la información actualizada.

### 10.5. Gestión de pedidos

1. Abre el módulo de pedidos.
2. Crea un pedido manual.
3. Selecciona un cliente.
4. Agrega productos y cantidades.
5. Agrega la imagen de referencia de ser necesario.
6. Comprueba el cálculo del total.
7. Registra el anticipo y verifica el saldo.
8. Guarda el pedido.
9. Consulta su detalle. Puedes descargarlo en formato PDF.
10. Edita el pedido y comprueba los cambios.

Realiza estas operaciones según los campos y las acciones disponibles en la interfaz.

### 10.6. Verificar la persistencia de los datos

Para comprobar que la información queda guardada:

1. Crea o modifica un registro de prueba.
2. Comprueba que aparezca actualizado en la aplicación.
3. Cierra sesión.
4. Vuelve a iniciar sesión.
5. Consulta el registro y verifica que los cambios continúan presentes.
6. Si es necesario, consulta la tabla correspondiente en pgAdmin para comprobar la información almacenada.

La persistencia debe comprobarse con los registros realmente guardados en PostgreSQL, no únicamente con los datos visibles temporalmente en la interfaz.

## 11. Estructura del proyecto

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
│   ├── build/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── database/
│   └── create_tables.sql
├── .gitignore
└── README.md

Esta estructura representa la organización prevista del repositorio. Si alguna carpeta no existe en tu versión actual, ajusta el esquema para que coincida con los archivos reales.

## 12. Seguridad

- No publiques credenciales reales.
- No incluyas el archivo `.env` en el repositorio.
- No publiques bases de datos con información personal.
- Configura `JWT_SECRET` mediante variables de entorno.
- Utiliza contraseñas seguras para las instalaciones reales.
- Reserva las credenciales de demostración para pruebas locales.
- Verifica que el archivo SQL de demostración no contenga datos sensibles.

## 13. Estado del proyecto

Valencia Cakes es una aplicación web orientada a la gestión de una repostería artesanal.

El proyecto integra una interfaz en React, un backend con Node.js y Express, y una base de datos PostgreSQL.

Para validar una instalación nueva, sigue las instrucciones desde la clonación del repositorio hasta el inicio de sesión y la ejecución de las pruebas.