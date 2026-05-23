// src/server.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { PORT } = require("./config/env");
const prisma = require("./infrastructure/database/prisma");
const path = require("path"); // 👈 Agregado para resolver rutas absolutas de forma segura

// Rutas usando path.resolve (Mapeado exacto según tu árbol de archivos)
const authRoutes = require(
  path.resolve(__dirname, "interfaces/routes/authRoutes"),
);
const adminRoutes = require(
  path.resolve(__dirname, "interfaces/routes/adminRoutes"),
);
const controlRoutes = require(
  path.resolve(__dirname, "interfaces/routes/controlRoutes"),
);
const seguimientoRoutes = require(
  path.resolve(__dirname, "interfaces/routes/seguimientoRoutes"),
);
const evidenciaRoutes = require(
  path.resolve(__dirname, "interfaces/routes/evidenciaRoutes"),
);
const dashboardRoutes = require(
  path.resolve(__dirname, "interfaces/routes/dashboardroutes"),
); // Con "r" minúscula como en tu foto
const catalogRoutes = require(
  path.resolve(__dirname, "interfaces/routes/catalogRoutes"),
);
const analisisIARoutes = require(
  path.resolve(__dirname, "interfaces/routes/analisisIARoutes"),
);

const app = express();

app.use(cors());
app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/controles", controlRoutes);
app.use("/api/seguimiento", seguimientoRoutes);
app.use("/api/evidencias", evidenciaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/ia", analisisIARoutes);

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "OK", database: "connected" });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "disconnected",
      error: error.message,
    });
  }
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Ruta ${req.method} ${req.path} no encontrada` });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📄 Swagger en http://localhost:${PORT}/api-docs`);
});
