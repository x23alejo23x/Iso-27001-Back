const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');        // + NUEVA LÍNEA
const swaggerSpec = require('./config/swagger');        // + NUEVA LÍNEA
const { PORT } = require("./config/env");
const prisma = require("./infrastructure/database/prisma");
const authRoutes = require("./interfaces/routes/authRoutes");
const controlRoutes = require("./interfaces/routes/controlRoutes");
const seguimientoRoutes = require("./interfaces/routes/seguimientoRoutes");
const catalogRoutes = require("./interfaces/routes/catalogRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// + NUEVA LÍNEA: Servir documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/controles", controlRoutes);
app.use("/api/seguimiento", seguimientoRoutes);
app.use("/api/catalog", catalogRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "OK", database: "connected" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "ERROR",
        database: "disconnected",
        error: error.message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📄 Documentación Swagger en http://localhost:${PORT}/api-docs`); // + NUEVA LÍNEA
});