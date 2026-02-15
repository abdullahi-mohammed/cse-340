/* ***********************************
 * Review Routes
 * Handles all review-related routing
 *********************************** */
const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require("../utilities/review-validation")

/* ***************************
 * Route to build the add review view
 * Requires login
 * ************************** */
router.get(
    "/add/:inv_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildAddReview)
)

/* ***************************
 * Route to process new review submission
 * Requires login + validation
 * ************************** */
router.post(
    "/add",
    utilities.checkLogin,
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.addReview)
)

/* ***************************
 * Route to build the edit review view
 * Requires login
 * ************************** */
router.get(
    "/edit/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildEditReview)
)

/* ***************************
 * Route to process review update
 * Requires login + validation
 * ************************** */
router.post(
    "/update",
    utilities.checkLogin,
    reviewValidate.editReviewRules(),
    reviewValidate.checkEditReviewData,
    utilities.handleErrors(reviewController.updateReview)
)

/* ***************************
 * Route to build the delete review confirmation view
 * Requires login
 * ************************** */
router.get(
    "/delete/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.buildDeleteReview)
)

/* ***************************
 * Route to process review deletion
 * Requires login
 * ************************** */
router.post(
    "/delete",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router
