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

//  Build vehicle detail view
invCont.buildDetail = async function (req, res, next) {
    console.log(req.params);

    const invId = req.params.invId
    let vehicle = await invModel.getInventoryById(invId)
    const htmlData = await utilities.buildSingleVehicleDisplay(vehicle)
    let nav = await utilities.getNav()
    const vehicleTitle = vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model
    res.render("./inventory/detail", {
        title: vehicleTitle,
        nav,
        message: null,
        htmlData,
    })
}

// Process intentional error
invCont.throwError = async function (req, res) {
    throw new Error("I am an intentional error")
}

module.exports = invCont