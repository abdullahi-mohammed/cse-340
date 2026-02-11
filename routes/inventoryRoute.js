const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory details by inv_id view
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetail));

// Error Route
router.get("/broken", utilities.handleErrors(invController.throwError))

module.exports = router;