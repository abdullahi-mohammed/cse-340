const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  New Classification Data Validation Rules
 * ********************************* */

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid name is required.")
      .isWhitelisted("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
      .withMessage(
        "Classification must contain alphabetic characters only (A-Z, a-z), with no spaces."
      ),
  ];
};

/* **********************************
 *  New Inventory Data Validation Rules
 * ********************************* */

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Classification is required.")
      .bail(),

    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Vehicle Make required.")
      .bail()
      .isLength({ min: 3, max: 50 })
      .withMessage("Vehicle Make must be at least 3 characters (max 50)"),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Vehicle Model required.")
      .bail()
      .isLength({ min: 3, max: 50 })
      .withMessage("Vehicle Model must be at least 3 characters (max 50)"),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description required."),

    body("inv_image").trim().notEmpty().withMessage("Image Path required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail Path required."),

    body("inv_price")
      .trim()
      .notEmpty()
      .withMessage("Price is required.")
      .bail()
      .isNumeric()
      .withMessage("Price must be a valid number.")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("Price must be positive whole number. (digits only)")
      .isLength({ max: 9 })
      .withMessage("Price cannot exceed 9 digits. (digits only)"),

    body("inv_year")
      .trim()
      .notEmpty()
      .withMessage("Year is required.")
      .bail()
      .isNumeric()
      .withMessage("Year must be a valid number.")
      .bail()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .withMessage("Miles are required.")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("Miles must be positive integer. (digits only)"),

    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

// Validate the New Inventory Data meets criteria
validate.checkNewInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      let nav = await utilities.getNav();
      const classList = await utilities.buildClassificationList(
        classification_id
      );
      res.render("./inventory/add-inventory", {
        errors,
        title: "Add New Inventory",
        nav,
        classList,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      });
      return;
    } catch (err) {
      console.error("Error rendering page:", err);
      res.status(500).send("Server error while rendering the page.");
    }
  }
  next();
};

// Validate the Edit Inventory Data meets criteria
validate.checkEditInventoryData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    try {
      let nav = await utilities.getNav();
      const classList = await utilities.buildClassificationList(
        classification_id
      );
      const invName = `Edit: ${inv_make} ${inv_model}`;
      res.render("./inventory/edit-inventory", {
        errors,
        title: invName,
        nav,
        classList,
        classification_id,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
      });
      return;
    } catch (err) {
      console.error("Error rendering page:", err);
      res.status(500).send("Server error while rendering the page.");
    }
  }
  next();
};

module.exports = validate;
