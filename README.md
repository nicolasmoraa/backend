🛒 Ecommerce Backend - Proyecto Final

Este proyecto implementa el backend de un ecommerce utilizando Node.js, Express y MongoDB Atlas, aplicando conceptos avanzados de arquitectura, seguridad y manejo de usuarios.

🚀 Tecnologías usadas

Node.js + Express

MongoDB Atlas + Mongoose

Handlebars (para vistas)

Socket.io (para actualización en tiempo real)

JWT (JSON Web Tokens) para autenticación

Bcrypt para encriptación de contraseñas

Nodemailer para recuperación de contraseñas

📂 Estructura del proyecto
/backend
 ├── /config        # Conexión a MongoDB y configuración
 ├── /controllers   # Lógica de negocio
 ├── /dao           # DAOs (acceso a datos)
 ├── /dto           # DTOs para transferir datos
 ├── /middleware    # Middlewares de auth y roles
 ├── /models        # Modelos de Mongoose
 ├── /repositories  # Repositories (interfaz con DAOs)
 ├── /routes        # Rutas Express (products, carts, sessions, etc.)
 ├── /views         # Vistas con Handlebars
 ├── app.js         # Servidor principal
 └── package.json

⚙️ Variables de entorno

Crear un archivo .env en la raíz del proyecto con los siguientes valores (ejemplo):

PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/ecommerce
JWT_SECRET=miclaveultrasecreta
GMAIL_USER=tuemail@gmail.com
GMAIL_PASS=contraseña_app


Incluí también un archivo .env.example en el repo con solo los nombres de las variables.

▶️ Ejecución del proyecto

Instalar dependencias:

npm install


Levantar el servidor:

node app.js


El servidor correrá en:
http://localhost:8080

📌 Endpoints principales
Productos /api/products

GET /api/products → Listar productos con paginación, filtros y ordenamiento.

POST /api/products → Crear producto (solo admin).

PUT /api/products/:pid → Actualizar producto (solo admin).

DELETE /api/products/:pid → Eliminar producto (solo admin).

Carritos /api/carts

POST /api/carts → Crear carrito.

GET /api/carts/:cid → Ver carrito (populate con productos).

POST /api/carts/:cid/products/:pid → Agregar producto.

PUT /api/carts/:cid/products/:pid → Actualizar cantidad.

DELETE /api/carts/:cid/products/:pid → Eliminar producto.

Sesiones /api/sessions

POST /register → Registro de usuario (con hash bcrypt).

POST /login → Login de usuario (devuelve JWT).

GET /current → Devuelve usuario actual (validando JWT + DTO).

Recuperación de contraseña

POST /forgot-password → Envía mail con link de reseteo.

POST /reset-password/:token → Permite cambiar contraseña (expira a la hora).

👤 Roles y Autorización

admin → puede crear, editar y eliminar productos.

user → puede manejar su carrito y realizar compras.

📝 Notas

La carpeta node_modules no está incluida en el repositorio.

El proyecto sigue una arquitectura profesional basada en DAO, Repository, DTO y Middlewares.

imagen docker: https://hub.docker.com/repository/docker/nicoyonico/backend-react/general
