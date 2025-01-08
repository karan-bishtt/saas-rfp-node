require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Importing role middleware
const {
  adminTenantVerification,
  vendorTenantVerification,
  managerTenantVerification,
  accountantTenantVerification,
  superAdminTenantVerification,
  roleRouteVerification,
} = require("./middleware/rolesTenantVerification");

// Importing JWT helper
const { verifyToken } = require("./helpers/jwt_helper");

// Routes
const AuthRoute = require("./routes/auth");
const AdminRoute = require("./routes/admin");
const vendorRoute = require("./routes/vendor");
const accountRoute = require("./routes/accountant");
const managerRoute = require("./routes/manager");
const superAdminRoute = require("./routes/superAdmin");
const publicRoutes = require("./routes/publicRoutes");
const privateRouteAdmin = require("./routes/privateRouteAdmin");
const privateRouteManager = require("./routes/privateRouteManager");
const privateRouteAccountant = require("./routes/privateRouteAccountant");
const privateRouteVendor = require("./routes/privateRouteVendor");
const privateRouteSuperUser = require("./routes/privateRouteSuperUser");

const { getMessage } = require("./lang");
const { formDataMiddleware } = require("./middleware/multer");
const {
  authenticateCookieToken,
  nonAuthenticateRoutes,
} = require("./middleware/CookieVerification");
const cookieParser = require("cookie-parser");
const { logout } = require("./controllers/auth");

const app = express();

// Middleware -----------------------------------------------
// Use cookie-parser
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Adding static file
app.use(express.static(path.join(__dirname, "assets")));
app.locals.staticPath = (file) => `/${file}`;
// Adding template engine ----------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes ---------------------------------------------------

// Template Routes ------------------
app.post("/logout", verifyToken, logout);

app.use(
  "/admin",
  authenticateCookieToken,
  roleRouteVerification,
  privateRouteAdmin
);

app.use(
  "/manager",
  authenticateCookieToken,
  roleRouteVerification,
  privateRouteManager
);

app.use(
  "/accountant",
  authenticateCookieToken,
  roleRouteVerification,
  privateRouteAccountant
);

app.use(
  "/vendor",
  authenticateCookieToken,
  roleRouteVerification,
  privateRouteVendor
);

app.use(
  "/super_admin",
  authenticateCookieToken,
  roleRouteVerification,
  privateRouteSuperUser
);

// API ROUTES ----------------------
app.use("/api/admin", verifyToken, adminTenantVerification, AdminRoute);

app.use("/api/manager", verifyToken, managerTenantVerification, managerRoute);

app.use(
  "/api/accountant",
  verifyToken,
  formDataMiddleware,
  accountantTenantVerification,
  accountRoute
);

app.use(
  "/api/vendor",
  verifyToken,
  formDataMiddleware,
  vendorTenantVerification,
  vendorRoute
);

app.use(
  "/api/super_admin",
  verifyToken,
  formDataMiddleware,
  superAdminTenantVerification,
  superAdminRoute
);

app.use("/api", formDataMiddleware, AuthRoute);

app.use("/", nonAuthenticateRoutes, publicRoutes);

// Error Handler --------------------------------------------
app.use((err, req, res, next) => {
  return res.redirect("/");
});

// Port -----------------------------------------------------
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
