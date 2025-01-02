const { getMessage } = require("../lang");
const db = require("../models/index"); // Import Category model
const XLSX = require("xlsx");
const {
  createCategoryValidator,
  updateCategoryValidator,
} = require("../validators/category");
const { createAuditLog } = require("../helpers/audit_log");
const Categories = db.Category; // Destructure Category model from db object
const Tenants = db.Tenants; // Destructure Tenants model from db object

// This method is used to fetch, create, update, and delete categories
const categoriesMethod = async (req, res) => {
  const { id, tenant_id } = req.query; // Extract ID from request parameters
  const admin = req.user;
  if (req.method == "GET") {
    try {
      if (id) {
        // Fetch a single category by ID
        const category = await Categories.findOne({
          where: { id: id, tenant_id: tenant_id },
        });
        if (!category) {
          return res.status(400).json({
            status: false,
            message: getMessage("category.notFound"),
          });
        }
        return res.json({
          status: true,
          data: {
            category: {
              id: category.id,
              name: category.name,
              status: category.status,
            },
          },
        });
      } else {
        // Fetch all categories if no ID is provided
        const categoriesList = await Categories.findAll({
          attributes: ["id", "name", "status"],
          where: { tenant_id },
        });

        const categoriesData = {};
        categoriesList.forEach((cat) => {
          categoriesData[cat.id] = {
            id: cat.id,
            name: cat.name,
            status: cat.status,
          };
        });

        res.json({
          status: true,
          data: { categories: categoriesData },
        });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(400).json({
        status: false,
        message: getMessage("error.somethingWentWrong"),
      });
    }
  } else if (req.method == "POST") {
    try {
      const { error, value } = createCategoryValidator.validate(req.body);
      if (error) {
        return res.status(400).json({
          status: true,
          message: error.details[0].message,
        });
      }
      const { name, tenant_id } = value;

      const isTenant = await Tenants.findOne({ where: { id: tenant_id } });
      if (!isTenant) {
        return res.status(400).json({
          status: false,
          message: getMessage("category.invalidTenant"),
        });
      }

      const isCategory = await Categories.findOne({
        where: { name, tenant_id },
      });
      if (isCategory) {
        return res.status(400).json({
          status: false,
          message: getMessage("category.alreadyExists"),
        });
      }

      const category = new Categories({ name, tenant_id });
      await category.save();

      // Log the creation
      createAuditLog({
        user_id: admin.id,
        resource_type: "Category",
        resource_id: category.id,
        action: "create",
        changes: value,
        tenant_id,
      });

      res.json({
        status: true,
        message: getMessage("category.created"),
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: getMessage("category.failedCreate"),
      });
    }
  } else if (req.method == "PUT") {
    try {
      const { error, value } = updateCategoryValidator.validate(req.body);
      const { id, name, tenant_id } = value;
      if (error) {
        return res.status(400).json({
          status: false,
          message: error.details[0].message,
        });
      }
      const category = await Categories.findOne({ where: { id, tenant_id } });
      if (!category) {
        return res.status(400).json({
          status: false,
          message: getMessage("category.notFound"),
        });
      }
      category.name = name;
      await category.save();

      // Log the creation
      createAuditLog({
        user_id: admin.id,
        resource_type: "Category",
        resource_id: category.id,
        action: "update",
        changes: value,
        tenant_id,
      });
      res.json({
        status: true,
        message: getMessage("category.updated"),
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: getMessage("category.failedUpdate"),
      });
    }
  } else {
    try {
      if (!id) {
        return res.status(400).json({
          status: false,
          message: getMessage("category.invalidId"),
        });
      }
      const category = await Categories.findOne({ where: { id, tenant_id } });
      if (!category) {
        return res.status(400).json({
          status: false,
          message: getMessage("category.notFound"),
        });
      }

      const catId = category.id;
      // deleting the category
      await category.destroy();

      // Log the creation
      createAuditLog({
        user_id: admin.id,
        resource_type: "Category",
        resource_id: catId,
        action: "destroy",
        changes: req.body || req.query,
        tenant_id,
      });

      res.json({
        status: true,
        message: getMessage("category.deleted"),
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: getMessage("category.failedDelete"),
      });
    }
  }
};

// This method is used to upload categories from an Excel file
const uploadCategoriesFromExcel = async (req, res) => {
  try {
    const user = req.user;
    tenant_id = user.tenant_id;
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: getMessage("category.noFileToUpload"),
      });
    }

    // Read the Excel file as buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    // Convert the sheet to a 2D array
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      header: 1,
    });

    // Skip the first row (header)
    const rows = sheetData.slice(1); // Remove the first row

    // Validate and prepare data
    const categoriesToInsert = [];
    for (const row of rows) {
      const [name] = row; // Assuming the first column is the category name
      if (name) {
        categoriesToInsert.push({ name, tenant_id });
      }
    }

    if (categoriesToInsert.length === 0) {
      return res.status(400).json({
        status: false,
        message: getMessage("category.noDataToUpload"),
      });
    }

    // Process categoriesToInsert as needed

    // Bulk insert or update if already exists
    await Categories.bulkCreate(categoriesToInsert, {
      // Columns to update if duplicate is foundF
      updateOnDuplicate: ["name"],
    });

    // Log the creation
    createAuditLog({
      user_id: user.id,
      resource_type: "Category",
      resource_id: 1,
      action: "bulkCreate Excel",
      changes: categoriesToInsert,
      tenant_id,
    });

    res.json({
      status: true,
      message: getMessage("category.uploaded"),
    });
  } catch (error) {
    console.error("Error uploading categories:", error);
    res.status(400).json({
      status: false,
      message: getMessage("category.failedToUploadCategories"),
    });
  }
};

module.exports = { categoriesMethod, uploadCategoriesFromExcel };
