/* ***********************************
 * Review Model
 * Handles all database interactions for vehicle reviews
 *********************************** */
const pool = require("../database/")

/* ***************************
 * Add a new review
 * ************************** */
async function addReview(review_text, review_rating, inv_id, account_id) {
    try {
        const sql =
            "INSERT INTO public.review (review_text, review_rating, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *"
        return await pool.query(sql, [review_text, review_rating, inv_id, account_id])
    } catch (error) {
        console.error("addReview error: " + error)
        return null
    }
}

/* ***************************
 * Get all reviews for a specific vehicle
 * Joins with account table to get reviewer name
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
    try {
        const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
      FROM public.review AS r 
      JOIN public.account AS a ON r.account_id = a.account_id 
      WHERE r.inv_id = $1 
      ORDER BY r.review_date DESC`
        const data = await pool.query(sql, [inv_id])
        return data.rows
    } catch (error) {
        console.error("getReviewsByInventoryId error: " + error)
        return []
    }
}

/* ***************************
 * Get all reviews by a specific account
 * Joins with inventory table to get vehicle info
 * ************************** */
async function getReviewsByAccountId(account_id) {
    try {
        const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
      FROM public.review AS r 
      JOIN public.inventory AS i ON r.inv_id = i.inv_id 
      WHERE r.account_id = $1 
      ORDER BY r.review_date DESC`
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        console.error("getReviewsByAccountId error: " + error)
        return []
    }
}

/* ***************************
 * Get a single review by review_id
 * ************************** */
async function getReviewById(review_id) {
    try {
        const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
      FROM public.review AS r 
      JOIN public.inventory AS i ON r.inv_id = i.inv_id 
      WHERE r.review_id = $1`
        const data = await pool.query(sql, [review_id])
        return data.rows[0]
    } catch (error) {
        console.error("getReviewById error: " + error)
        return null
    }
}

/* ***************************
 * Update an existing review
 * ************************** */
async function updateReview(review_id, review_text, review_rating) {
    try {
        const sql =
            "UPDATE public.review SET review_text = $1, review_rating = $2 WHERE review_id = $3 RETURNING *"
        const data = await pool.query(sql, [review_text, review_rating, review_id])
        return data.rows[0]
    } catch (error) {
        console.error("updateReview error: " + error)
        return null
    }
}

/* ***************************
 * Delete a review
 * ************************** */
async function deleteReview(review_id) {
    try {
        const sql = "DELETE FROM public.review WHERE review_id = $1"
        const data = await pool.query(sql, [review_id])
        return data.rowCount
    } catch (error) {
        console.error("deleteReview error: " + error)
        return null
    }
}

/* ***************************
 * Get average rating for a vehicle
 * ************************** */
async function getAverageRating(inv_id) {
    try {
        const sql =
            "SELECT ROUND(AVG(review_rating), 1) AS avg_rating, COUNT(*) AS review_count FROM public.review WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("getAverageRating error: " + error)
        return { avg_rating: null, review_count: 0 }
    }
}

/* ***************************
 * Check if user already reviewed a vehicle
 * ************************** */
async function checkExistingReview(inv_id, account_id) {
    try {
        const sql =
            "SELECT review_id FROM public.review WHERE inv_id = $1 AND account_id = $2"
        const data = await pool.query(sql, [inv_id, account_id])
        return data.rowCount > 0
    } catch (error) {
        console.error("checkExistingReview error: " + error)
        return false
    }
}

module.exports = {
    addReview,
    getReviewsByInventoryId,
    getReviewsByAccountId,
    getReviewById,
    updateReview,
    deleteReview,
    getAverageRating,
    checkExistingReview,
}
