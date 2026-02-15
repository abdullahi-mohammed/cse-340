/* ***********************************
 * Review Validation
 * Server-side validation for review data
 *********************************** */
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* ***************************
 * Review Data Validation Rules
 * ************************** */
validate.reviewRules = () => {
    return [
        body("review_text")
            .trim()
            .isLength({ min: 10 })
            .withMessage("Review must be at least 10 characters long."),

        body("review_rating")
            .trim()
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5."),

        body("inv_id")
            .trim()
            .isInt({ no_symbols: true })
            .withMessage("Invalid vehicle.")
            .custom(async (inv_id) => {
                const valid = await invModel.isClassificationValid(inv_id)
                // We just need inv_id to be a valid integer; 
                // the controller will verify the vehicle exists
            }),
    ]
}

/* ***************************
 * Check review data and return errors or continue
 * ************************** */
validate.checkReviewData = async (req, res, next) => {
    const { review_text, review_rating, inv_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const invData = await invModel.getInventoryById(parseInt(inv_id))
        const vehicleTitle = invData
            ? `${invData.inv_year} ${invData.inv_make} ${invData.inv_model}`
            : "Vehicle"
        res.render("review/add-review", {
            errors,
            title: "Review " + vehicleTitle,
            nav,
            inv_id,
            inv_make: invData ? invData.inv_make : "",
            inv_model: invData ? invData.inv_model : "",
            inv_year: invData ? invData.inv_year : "",
            review_text,
            review_rating,
        })
        return
    }
    next()
}

/* ***************************
 * Check edit review data and return errors or continue
 * ************************** */
validate.checkEditReviewData = async (req, res, next) => {
    const { review_id, review_text, review_rating } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const reviewModel = require("../models/review-model")
        const review = await reviewModel.getReviewById(parseInt(review_id))
        res.render("review/edit-review", {
            errors,
            title: "Edit Review - " + (review ? `${review.inv_year} ${review.inv_make} ${review.inv_model}` : "Vehicle"),
            nav,
            review_id,
            review_text,
            review_rating,
            inv_make: review ? review.inv_make : "",
            inv_model: review ? review.inv_model : "",
            inv_year: review ? review.inv_year : "",
        })
        return
    }
    next()
}

/* ***************************
 * Edit review validation rules (no inv_id needed)
 * ************************** */
validate.editReviewRules = () => {
    return [
        body("review_text")
            .trim()
            .isLength({ min: 10 })
            .withMessage("Review must be at least 10 characters long."),

        body("review_rating")
            .trim()
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5."),
    ]
}

module.exports = validate
