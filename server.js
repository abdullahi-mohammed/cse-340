/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const utilites = require("./utilities")

/* ***********************
 * Routes
 *************************/
app.use(static)
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
// Index Route
app.get("/", utilites.handleErrors(baseController.buildHome))
//Inventory Routes
app.use("/inv", require("./routes/inventoryRoute"))

app.use(async (req, res, next) => {
  next({ status: 404, message: `Sorry, we appear to have lost that page.` })
})

/* ***********************
 * Express Error Handler
 * Place after all other middlewares
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilites.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message} `)
  if (err.status == 404) {
    message = err.message
  } else {
    message = 'oh no! There was a crash. Maybe try a different route.'
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
