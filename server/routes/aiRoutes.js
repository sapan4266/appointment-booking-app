const express = require("express");

const {
  generateHealthGuidance
} = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", generateHealthGuidance);

module.exports = router;