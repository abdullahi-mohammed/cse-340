const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require("../utilities/");
const invChecks = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build inventory details by inv_id view
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetail));

// Error Route
router.get("/broken", utilities.handleErrors(invController.throwError))

//Build Management View Route
router.get("/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagementView))

/* ****************************************
 * Build add-classification View Route
 * Assignment 4, Task 2
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
    "/newClassification",
    utilities.checkAccountType,
    utilities.handleErrors(invController.newClassificationView)
)


/* ****************************************
 * Process add-classification Route
 * Assignment 4, Task 2
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post(
    "/addClassification",
    utilities.checkAccountType,
    invChecks.classificationRule(),
    invChecks.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

/* ****************************************
 * Build add-vehicle View Route
 * Assignment 4, Task 3
 * checkAccountType added Unit 5, Assignment 5, Task 2
  **************************************** */
router.get(
    "/newVehicle",
    utilities.checkAccountType,
    utilities.handleErrors(invController.newInventoryView)
)

/* ****************************************
 * Process add-vehicle Route
 * Assignment 4, Task 3
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post(
    "/addInventory",
    utilities.checkAccountType,
    invChecks.newInventoryRules(),
    invChecks.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

/* ****************************************
 * Get vehicles for AJAX Route
 * Unit 5, Select inv item activity
 **************************************** */
router.get(
    "/getInventory/:classification_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON)
)

/* ****************************************
 * Deliver the edit inventory view
 * Unit 5, Update Step 1 Activity
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
    "/edit/:inv_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.editInvItemView)
)

/* ****************************************
 * Process the edit inventory request
 * Unit 5, Update Step 2 Activity
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post(
    "/update",
    utilities.checkAccountType,
    invChecks.newInventoryRules(),
    invChecks.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

/* ****************************************
 * Deliver the delete confirmation view
 * Unit 5, Delete Activity
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.get(
    "/delete/:inv_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteView)
)

/* ****************************************
 * Process the delete inventory request
 * Unit 5, Delete Activity
 * checkAccountType added Unit 5, Assignment 5, Task 2
 **************************************** */
router.post("/delete",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteItem)
)

module.exports = router;