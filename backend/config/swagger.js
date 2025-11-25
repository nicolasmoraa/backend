import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "Documentación del módulo Users",
    },
  },
  apis: ["./routes/users.router.js"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);
export { swaggerUi };