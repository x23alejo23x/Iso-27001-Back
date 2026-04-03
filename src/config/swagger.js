const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Controles ISO 27001',
      version: '1.0.0',
      description: 'Documentación interactiva de la API para seguimiento de controles de seguridad',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo',
      },
      // Cuando despliegues, agrega la URL de producción:
      // {
      //   url: 'https://tudominio.com/api',
      //   description: 'Servidor de producción',
      // }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/interfaces/routes/*.js', './src/domain/entities/*.js'], // Rutas donde buscar comentarios
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;