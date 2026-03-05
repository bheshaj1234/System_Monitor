const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'System Monitor API',
      version: '1.0.0',
      description: 'API documentation for the System Monitor application',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local development server',
        }
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;          
