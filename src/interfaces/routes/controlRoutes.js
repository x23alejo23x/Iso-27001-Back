const express = require("express");
const ControlController = require("../controllers/ControlController");
const ControlService = require("../../application/control/ControlService");
const ControlRepository = require("../../infrastructure/repositories/ControlRepository");

const router = express.Router();
const controlRepository = new ControlRepository();
const controlService = new ControlService(controlRepository);
const controlController = new ControlController(controlService);

router.get("/", (req, res) => controlController.getAll(req, res));
module.exports = router;
