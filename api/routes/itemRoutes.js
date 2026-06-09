const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const auth = require("../middleware/auth");

router.get("/", auth, itemController.getItems);
router.post("/", auth, itemController.createItem);

module.exports = router;