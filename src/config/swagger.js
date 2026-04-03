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
      //  URL de producción:
      // {
      //   url: 'https://dominio.com/api',
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
  apis: ['./src/interfaces/routes/*.js', './src/domain/entities/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;