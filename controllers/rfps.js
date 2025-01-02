// This file is used to get the RFPs from the database
const { createAuditLog } = require("../helpers/audit_log");
const { RFP_STATUS } = require("../helpers/constant");
const { getMessage } = require("../lang");
const db = require("../models/index");
const { createRfpsValidator } = require("../validators/rfps");
const Rfps = db.Rfps;
const RfpVendors = db.RfpVendors;
const Users = db.Users;
const VendorDetails = db.VendorDetails;
const Categories = db.Category;

// This method is used to get the rfp
const getRfp = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const rfps = await Rfps.findAll({
      attributes: [
        "id",
        "admin_id",
        "item_name",
        "item_description",
        "quantity",
        "last_date",
        "minimum_price",
        "maximum_price",
        "created_at",
        "updated_at",
        "status",
      ],
      include: [
        {
          model: RfpVendors,
          as: "vendorsForRfp",
          attributes: [
            "vendor_id",
            "rfp_id",
            "item_price",
            "total_cost",
            "status",
          ],
        },
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      where: { tenant_id: tenant_id },
    });

    const response = {
      status: true,
      rfps: rfps.map((rfp) => ({
        id: rfp.id,
        admin_id: rfp.admin_id,
        item_name: rfp.item_name,
        item_description: rfp.item_description,
        quantity: rfp.quantity,
        last_date: rfp.last_date,
        status: rfp.status,
        minimum_price: rfp.minimum_price,
        maximum_price: rfp.maximum_price,
        category: { id: rfp.category.id, name: rfp.category.name },
        created_at: rfp.created_at,
        updated_at: rfp.updated_at,
        vendors: rfp.vendorsForRfp.map((vendor) => ({
          vendor_id: vendor.vendor_id,
          item_price: vendor.item_price,
          total_cost: vendor.total_cost,
          status: vendor.status,
        })),
      })),
    };
    return res.json(response);
  } catch (error) {
    console.error("Error fetching RFPs with vendor details:", error);
    return res
      .status(400)
      .json({ status: true, message: getMessage("rfps.fetchingrfpsData") });
  }
};

// This method is used to give the rfp quotes
const getRfpQuotes = async (req, res) => {
  const { rfp_id, tenant_id } = req.query;
  try {
    if (!rfp_id) {
      return res.status(400).json({
        status: false,
        message: getMessage("rfps.rfpIdRequired"),
      });
    }
    const vendorQuotes = await RfpVendors.findAll({
      where: { rfp_id: rfp_id, tenant_id: tenant_id },
      include: [
        {
          model: Users,
          as: "vendor",
          // Assuming these are the correct attributes in Users
          attributes: ["name", "email", "mobile"],
        },
      ],
      attributes: ["vendor_id", "item_price", "total_cost"],
    });

    // Format the response as needed
    const response = {
      status: true,
      quotes: vendorQuotes.map((quote) => ({
        vendor_id: quote.vendor_id,
        name: quote.vendor.name,
        item_price: quote.item_price,
        total_cost: quote.total_cost,
        email: quote.vendor.email,
        mobile: quote.vendor.mobile,
      })),
    };

    return res.json(response);
  } catch (error) {
    console.error("Error fetching vendor quotes:", error);
    return res.status(400).json({
      status: false,
      message: getMessage("rfps.getRfpQuotesFetchError"),
    });
  }
};

// This method is used to close the rfp
const closeRfp = async (req, res) => {
  const { rfp_id, tenant_id } = req.body;
  const user = req.user;
  try {
    if (!rfp_id) {
      return res.status(400).json({
        status: false,
        message: getMessage("rfps.rfpIdRequired"),
      });
    }

    const valid_rfp = await Rfps.findOne({
      where: { id: rfp_id, tenant_id: tenant_id },
    });

    if (!valid_rfp) {
      return res.status(400).json({
        status: false,
        message: getMessage("rfps.rfpNotFound"),
      });
    } else {
      if (valid_rfp.status === RFP_STATUS.closed) {
        return res.status(400).json({
          status: false,
          message: getMessage("rfps.rfpAlreadyClosed"),
        });
      } else if (valid_rfp.status === RFP_STATUS.applied) {
        return res.status(400).json({
          status: false,
          message: getMessage("rfps.rfpAlreadyApplied"),
        });
      }
    }
    await valid_rfp.update({ status: RFP_STATUS.closed });
    createAuditLog({
      user_id: user.id,
      resource_type: "RFP",
      resource_id: result[0].id,
      action: "close",
      changes: req.body || req.params,
      tenant_id,
    });
    return res.json({
      status: true,
      message: getMessage("rfps.closeRfpSuccessfully").replace(
        "{}",
        valid_rfp.name
      ),
    });
  } catch (error) {
    console.error("Error updating vendor statuses:", error);
    return res.status(400).json({
      status: false,
      message: getMessage("rfps.closeRfpError"),
    });
  }
};

// This method is used to create the rfp
const createRfp = async (req, res) => {
  try {
    const user = req.user;
    const { error, value } = createRfpsValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        response: "error",
        error: error.details[0].message,
      });
    }
    let {
      item_name,
      item_description,
      quantity,
      last_date,
      minimum_price,
      maximum_price,
      category,
      vendors,
      tenant_id,
    } = value;
    let vendorIds = vendors;

    const vendorsObject = await Users.findAll({
      where: {
        id: vendorIds,
        roles: "vendor",
        tenant_id: tenant_id,
      },
    });

    if (!vendorsObject || vendorsObject.length === 0) {
      return res.status(400).json({
        status: false,
        message: getMessage("rfps.vendorNotFound"),
      });
    } else if (vendorsObject.length !== vendorIds.length) {
      return res.status(400).json({
        status: false,
        message: getMessage("rfps.vendorIdsNotFound"),
      });
    }

    // Validate categories for the tenant
    const isCategoryPresent = await Categories.findOne({
      where: {
        id: category,
        tenant_id,
      },
    });

    if (!isCategoryPresent) {
      return res.status(400).json({
        status: false,
        error: getMessage("rfps.invalidCategoryForTenant"),
      });
    }

    // Proceed with further logic if validation passes

    const rfp = new Rfps({
      item_name,
      item_description,
      quantity,
      last_date,
      minimum_price,
      maximum_price,
      category_id: category,
      admin_id: user.id,
      tenant_id: tenant_id,
    });
    await rfp.save();

    const rfpVendorsData = vendorIds.map((vendorId) => ({
      vendor_id: vendorId,
      rfp_id: rfp.id,
      status: "open",
      tenant_id: tenant_id,
    }));

    await RfpVendors.bulkCreate(rfpVendorsData);

    // Log the creation
    createAuditLog({
      user_id: user.id,
      resource_type: "RFP",
      resource_id: rfp.id,
      action: "create",
      changes: req.body || req.params,
      tenant_id,
    });

    return res.status(200).json({
      status: true,
      message: getMessage("rfps.rfpCreated"),
    });
  } catch (error) {
    console.error("Error creating RFP:", error);
    return res
      .status(400)
      .json({ status: false, message: getMessage("failedCreateRfp") });
  }
};

module.exports = { getRfp, getRfpQuotes, closeRfp, createRfp };
