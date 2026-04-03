# ISO 27001 Controls API

API RESTful para la gestión y seguimiento de controles de seguridad basados en ISO 27001. Desarrollada con Node.js, Express, Prisma y PostgreSQL (compatible con Supabase). Sigue una arquitectura limpia (Clean Architecture) que separa las capas de dominio, aplicación, infraestructura e interfaces.

## 🚀 Características

- Autenticación de usuarios .
- CRUD de controles, empresas, roles y estados.
- Seguimiento de cumplimiento de controles por empresa.
- Subida y gestión de evidencias.
- Documentación interactiva con Swagger UI.
- Base de datos PostgreSQL (funciona con Supabase, AWS RDS o local).
- Arquitectura limpia y modular.

## 🛠️ Tecnologías

- **Node.js** + **Express** – servidor web.
- **Prisma ORM** – acceso y modelado de datos.
- **PostgreSQL** – base de datos (compatible con Supabase).
- **bcrypt** – hashing de contraseñas.
- **Swagger (swagger-ui-express, swagger-jsdoc)** – documentación interactiva.
- **Nodemon** – recarga en desarrollo.

## 📁 Estructura del proyecto

src/
├── application/ # Servicios de aplicación (casos de uso orquestados)
├── config/ # Configuraciones (env, swagger)
├── domain/ # Entidades, repositorios abstractos y casos de uso puros
├── infrastructure/ # Implementaciones concretas (Prisma, repositorios)
├── interfaces/ # Controladores, rutas, middlewares
└── server.js # Punto de entrada


