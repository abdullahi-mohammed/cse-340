/* ***********************************
 * Review Controller
 * Handles all review-related requests
 *********************************** */
const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 * Build the add review view
 * ************************** */
reviewCont.buildAddReview = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const vehicle = await invModel.getInventoryById(inv_id)
    if (!vehicle) {
        req.flash("message warning", "Vehicle not found.")
        return res.redirect("/")
    }
    const vehicleTitle = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
    res.render("./review/add-review", {
        title: "Review " + vehicleTitle,
        nav,
        errors: null,
        inv_id,
        inv_make: vehicle.inv_make,
        inv_model: vehicle.inv_model,
        inv_year: vehicle.inv_year,
        review_text: "",
        review_rating: "",
    })
}

/* ***************************
 * Process new review submission
 * ************************** */
reviewCont.addReview = async function (req, res, next) {
    const { review_text, review_rating, inv_id } = req.body
    const account_id = res.locals.accountData.account_id
    const nav = await utilities.getNav()

    // Check if user already reviewed this vehicle
    const existingReview = await reviewModel.checkExistingReview(inv_id, account_id)
    if (existingReview) {
        req.flash("message warning", "You have already reviewed this vehicle. You can edit your existing review from your account.")
        return res.redirect(`/inv/detail/${inv_id}`)
    }

    const result = await reviewModel.addReview(review_text, parseInt(review_rating), parseInt(inv_id), account_id)

    if (result) {
        req.flash("message success", "Your review was successfully added!")
        res.redirect(`/inv/detail/${inv_id}`)
    } else {
        const vehicle = await invModel.getInventoryById(inv_id)
        const vehicleTitle = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
        req.flash("message warning", "Sorry, the review could not be added.")
        res.status(501).render("./review/add-review", {
            title: "Review " + vehicleTitle,
            nav,
            errors: null,
            inv_id,
            inv_make: vehicle.inv_make,
            inv_model: vehicle.inv_model,
            inv_year: vehicle.inv_year,
            review_text,
            review_rating,
        })
    }
}

/* ***************************
 * Build edit review view
 * ************************** */
reviewCont.buildEditReview = async function (req, res, next) {
    const review_id = parseInt(req.params.review_id)
    const nav = await utilities.getNav()
    const review = await reviewModel.getReviewById(review_id)

    if (!review) {
        req.flash("message warning", "Review not found.")
        return res.redirect("/account/")
    }

    // Only the review author can edit their review
    if (review.account_id !== res.locals.accountData.account_id) {
        req.flash("message warning", "You are not authorized to edit this review.")
        return res.redirect("/account/")
    }

    const vehicleTitle = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
    res.render("./review/edit-review", {
        title: "Edit Review - " + vehicleTitle,
        nav,
        errors: null,
        review_id: review.review_id,
        review_text: review.review_text,
        review_rating: review.review_rating,
        inv_make: review.inv_make,
        inv_model: review.inv_model,
        inv_year: review.inv_year,
    })
}

/* ***************************
 * Process review update
 * ************************** */
reviewCont.updateReview = async function (req, res, next) {
    const { review_id, review_text, review_rating } = req.body
    const nav = await utilities.getNav()

    // Verify ownership
    const review = await reviewModel.getReviewById(parseInt(review_id))
    if (!review || review.account_id !== res.locals.accountData.account_id) {
        req.flash("message warning", "You are not authorized to edit this review.")
        return res.redirect("/account/")
    }

    const updateResult = await reviewModel.updateReview(
        parseInt(review_id),
        review_text,
        parseInt(review_rating)
    )

    if (updateResult) {
        req.flash("message success", "Your review was successfully updated.")
        res.redirect("/account/")
    } else {
        const vehicleTitle = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
        req.flash("message warning", "Sorry, the update failed.")
        res.status(501).render("./review/edit-review", {
            title: "Edit Review - " + vehicleTitle,
            nav,
            errors: null,
            review_id,
            review_text,
            review_rating,
            inv_make: review.inv_make,
            inv_model: review.inv_model,
            inv_year: review.inv_year,
        })
    }
}

/* ***************************
 * Build delete review confirmation view
 * ************************** */
reviewCont.buildDeleteReview = async function (req, res, next) {
    const review_id = parseInt(req.params.review_id)
    const nav = await utilities.getNav()
    const review = await reviewModel.getReviewById(review_id)

    if (!review) {
        req.flash("message warning", "Review not found.")
        return res.redirect("/account/")
    }

    // Only the review author can delete their review
    if (review.account_id !== res.locals.accountData.account_id) {
        req.flash("message warning", "You are not authorized to delete this review.")
        return res.redirect("/account/")
    }

    const vehicleTitle = `${review.inv_year} ${review.inv_make} ${review.inv_model}`
    res.render("./review/delete-review", {
        title: "Delete Review - " + vehicleTitle,
        nav,
        errors: null,
        review_id: review.review_id,
        review_text: review.review_text,
        review_rating: review.review_rating,
        inv_make: review.inv_make,
        inv_model: review.inv_model,
        inv_year: review.inv_year,
    })
}

/* ***************************
 * Process review deletion
 * ************************** */
reviewCont.deleteReview = async function (req, res, next) {
    const review_id = parseInt(req.body.review_id)

    // Verify ownership
    const review = await reviewModel.getReviewById(review_id)
    if (!review || review.account_id !== res.locals.accountData.account_id) {
        req.flash("message warning", "You are not authorized to delete this review.")
        return res.redirect("/account/")
    }

    const deleteResult = await reviewModel.deleteReview(review_id)

    if (deleteResult) {
        req.flash("message success", "Your review was successfully deleted.")
        res.redirect("/account/")
    } else {
        req.flash("message warning", "Sorry, the deletion failed.")
        res.redirect(`/review/delete/${review_id}`)
    }
}

module.exports = reviewCont
