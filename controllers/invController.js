const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}


// Build inventory by classification view

invCont.buildByClassificationId = async (req, res, next) => {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)

    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("../views/inventory/classification.ejs", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

module.exports = invCont