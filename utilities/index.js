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

/* Build the classification view HTML */
Util.buildClassificationGrid = async function (data) {
    let grid

    if (data.length > 0) {
        grid = '<ul id="inv-display"'
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

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util