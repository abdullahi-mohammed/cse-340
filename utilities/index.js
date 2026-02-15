const jwt = require("jsonwebtoken");
const invModel = require("../models/inventory-model")
const Util = {}

/* Construct the nav HTML unordered list */

Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += `<li><a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a></li>`

    })
    list += "</ul>"
    return list
}

//  Build the select list of classification items
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications();
    let classificationList = `<select name="classification_id" `;
    classificationList += `id="classificationList" `;
    classificationList += `required>`;
    classificationList += `<option value=''>Choose a Classification</option>`;
    data.rows.forEach((row) => {
        classificationList += `<option value="${row.classification_id}"`;
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += ` selected `;
        }
        classificationList += `>${row.classification_name}</option>`;
    });
    classificationList += `</select>`;
    return classificationList;
};


/* Build the classification view HTML */
Util.buildClassificationGrid = async function (data) {
    let grid

    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += `<a href="/inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`
            grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`
            grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`
            grid += `</a>`
            grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
            grid += '</li>'
        })
        grid += '</ul>'

    } else {
        grid = "<p class='notice'>Sorry, no matching vehicles could be found.</p>"
    }

    return grid
}

//  Build the inventory view HTML
Util.buildSingleVehicleDisplay = async function (data) {
    let grid = '<section id="vehicle-display">'
    grid += `<div>`
    grid += '<section class="imagePrice">'
    grid += `<img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">`
    grid += '</section>'
    grid += '<section class="vehicleDetail">'
    grid += "<h3> " + data.inv_make + " " + data.inv_model + " Details</h3>"
    grid += '<ul id="vehicle-details">'
    grid +=
        "<li><h4>Price: $" +
        new Intl.NumberFormat("en-US").format(data.inv_price) +
        "</h4></li>"
    grid += "<li><h4>Description:</h4> " + data.inv_description + "</li>"
    grid += "<li><h4>Color:</h4> " + data.inv_color + "</li>"
    grid +=
        "<li><h4>Miles:</h4> " +
        new Intl.NumberFormat("en-US").format(data.inv_miles) +
        "</li>"
    grid += "</ul>"
    grid += "</section>"
    grid += `</div>`
    return grid
}

Util.buildErrorMessage = async function (error) {
    let message;
    message = `<div id="error-page">`;
    message += `<h2 id = "error-heading">${error.message}</h2>`;
    message += `<div id="error-container">`;
    message += `<img src="images/site/error.jpg" width="600" height="400" loading="lazy" alt="Cartoon Image of car crash" id="error-img">`;
    message += `</div>`;
    message += `</div>`;
    message += `<div id="error-overlay">`;
    message += `</div>`;
    return message;
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ***************************
 * Build review list HTML for a vehicle detail page
 * ************************** */
Util.buildReviewList = function (reviews) {
    let html = ""
    if (reviews.length > 0) {
        html += '<ul class="review-list">'
        reviews.forEach((review) => {
            let stars = ""
            for (let i = 1; i <= 5; i++) {
                stars += `<span class="star ${i <= review.review_rating ? "filled" : ""}">&#9733;</span>`
            }
            const reviewDate = new Date(review.review_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            const screenName = review.account_firstname.charAt(0) + review.account_lastname
            html += "<li class='review-item'>"
            html += `<div class="review-header">`
            html += `<strong class="review-author">${screenName}</strong>`
            html += `<span class="review-stars">${stars}</span>`
            html += `<span class="review-date">${reviewDate}</span>`
            html += `</div>`
            html += `<p class="review-text">${review.review_text}</p>`
            html += "</li>"
        })
        html += "</ul>"
    } else {
        html += '<p class="notice">No reviews yet. Be the first to review this vehicle!</p>'
    }
    return html
}

/* ***************************
 * Build user's review list HTML for account management
 * ************************** */
Util.buildAccountReviewList = function (reviews) {
    let html = ""
    if (reviews.length > 0) {
        html += '<table class="account-reviews-table">'
        html += "<thead><tr><th>Vehicle</th><th>Rating</th><th>Date</th><th>Actions</th></tr></thead>"
        html += "<tbody>"
        reviews.forEach((review) => {
            let stars = ""
            for (let i = 1; i <= 5; i++) {
                stars += `<span class="star ${i <= review.review_rating ? "filled" : ""}">&#9733;</span>`
            }
            const reviewDate = new Date(review.review_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
            html += "<tr>"
            html += `<td>${review.inv_year} ${review.inv_make} ${review.inv_model}</td>`
            html += `<td>${stars}</td>`
            html += `<td>${reviewDate}</td>`
            html += `<td class="review-actions">`
            html += `<a href="/review/edit/${review.review_id}" class="btn-edit" title="Edit review">Edit</a> | `
            html += `<a href="/review/delete/${review.review_id}" class="btn-delete" title="Delete review">Delete</a>`
            html += `</td>`
            html += "</tr>"
        })
        html += "</tbody></table>"
    } else {
        html += "<p>You haven't written any reviews yet.</p>"
    }
    return html
}



/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET ||
            "b53faaaf114c87cc0fdb8660cef6d5133cf5069cdf7566f75e8d002550c760119db0d1edfaed6475f89016829ccdac57855f40afc7f0d7f0cc1be301f785bc47",
            function (err, accountData) {
                if (err) {
                    req.flash("message warning", "Please log in.");
                    res.clearCookie("jwt");
                    console.error(err);

                    return res.redirect("/account/login");
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            }
        );
    } else {
        next();
    }
};

/* ****************************************
 * Check if user is logged in
 **************************************** */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        return next();
    }
    req.flash("message warning", "Please log in to continue.");
    return res.redirect("/account/login");
};


//   Check if Employee or Admin level authorization
Util.checkAuthorized = (req, res, next) => {
    Util.checkLogin(req, res, () => {
        if (
            res.locals.accountData.account_type == "Employee" ||
            res.locals.accountData.account_type == "Admin"
        ) {
            next();
        } else {
            req.flash(
                "notice",
                "Unauthorized. You do not have permission to access the page."
            );
            return res.redirect("/account/login");
        }
    });
};

/* ****************************************
 * Assignment 5 task2
 **************************************** */
Util.checkAccountType = (req, res, next) => {
    if (!res.locals.accountData) {
        req.flash(
            "message warning",
            "Please log in with an Employee or Admin account to continue."
        );
        return res.redirect("/account/login")
    }
    if (res.locals.accountData.account_type == "Employee" ||
        res.locals.accountData.account_type == "Admin") {
        next()
    }
    else {
        req.flash(
            "message warning",
            "Unauthorized. Employee or Admin access is required."
        );
        return res.redirect("/account/login")
    }
}

module.exports = Util