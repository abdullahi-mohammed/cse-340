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

// // build the inventory management page
// router.get(
//     "/",
//     // utilities.checkAuthorized,
//     utilities.handleErrors(invController.buildManagement)
// );

// // build the add classification page
// router.get(
//     "/add-classification",
//     // utilities.checkAuthorized,
//     utilities.handleErrors(invController.buildAddClassification)
// );

// // build the add inventory page
// router.get(
//     "/add-inventory",
//     // utilities.checkAuthorized,
//     utilities.handleErrors(invController.buildAddInventory)
// );

// // build the inventory list
// router.get(
//     "/getInventory/:classification_id",
//     utilities.handleErrors(invController.getInventoryJSON)
// );

// // build the edit inventory page
// router.get(
//     "/edit/:inv_id",
//     // utilities.checkAuthorized,
//     utilities.handleErrors(invController.buildEditInventory)
// );

// // build the delete inventory confirmation
// router.get("/delete/:inv_id", utilities.checkAuthorized, utilities.handleErrors(invController.buildDeleteInventory)
// );

// // add a new classification
// router.post(
//     "/add-classification",
//     // utilities.checkAuthorized,
//     invValidate.classificationRules(),
//     invValidate.checkClassificationData,
//     utilities.handleErrors(invController.addClassification)
// );

// // add new inventory
// router.post(
//     "/add-inventory",
//     invValidate.inventoryRules(),
//     invValidate.checkNewInventoryData,
//     utilities.handleErrors(invController.addInventory)
// );

// // update inventory
// router.post(
//     "/edit-inventory",
//     invValidate.inventoryRules(),
//     invValidate.checkEditInventoryData,
//     utilities.handleErrors(invController.editInventory)
// );

// // delete inventory
// router.post("/delete", utilities.handleErrors(invController.deleteInventory));

module.exports = router;