import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Configuración de swagger-jsdoc
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Documentación API  - Proyecto Web III",
        version: "1.0.0",
        description:
            "Documentación de las rutas de la API para gestion de aulas en la UTN",
    },
    servers: [
        {
            url: "http://localhost:4000/api",
        },
        {
            url: "https://proyectowebiii.onrender.com/api",
        },
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
  
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.route.js", "./Auth/*route.js"], // aquí busca los comentarios JSDoc
};

const spec = swaggerJSDoc(options);

const serve = swaggerUi.serve;

const setup = swaggerUi.setup(spec, {
    swaggerOptions: {
        docExpansion: "none",
    }
});

export default { setup, serve };