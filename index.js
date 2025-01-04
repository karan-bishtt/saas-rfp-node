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
const { getMessage } = require("./lang");
const { formDataMiddleware } = require("./middleware/multer");

const app = express();
// Adding template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware -----------------------------------------------
app.use(cors());
app.use(express.json());
// Adding static file
app.use(express.static("assets"));
// Routes ---------------------------------------------------

// Template Routes ------------------
app.use("/", publicRoutes);
app.use("/admin", privateRouteAdmin);

// API ROUTES ----------------------
app.use("/api", formDataMiddleware, AuthRoute);

app.use("/api/admin", verifyToken, adminTenantVerification, AdminRoute);

app.use(
  "/api/manager",
  verifyToken,
  formDataMiddleware,
  managerTenantVerification,
  managerRoute
);

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
  "/api/super-admin",
  verifyToken,
  formDataMiddleware,
  superAdminTenantVerification,
  superAdminRoute
);

// Error Handler --------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(400)
    .json({ status: false, message: getMessage("error.somethingWentWrong") });
});

// Port -----------------------------------------------------
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
