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
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session")
const flash = require("connect-flash")

/* ***********************
 * Middleware
 *************************/
// app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Session middleware (required by connect-flash)
app.use(session({
  secret: process.env.SESSION_SECRET || "super-secret-key",
  resave: false,
  saveUninitialized: true,
}))


// JWT middleware
app.use(utilites.checkJWTToken);

// Flash messages
app.use(flash())

// Make flash messages available to all views via express-messages
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

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
app.use("/account", require("./routes/accountRoute"))

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
