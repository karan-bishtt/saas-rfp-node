// This file is used to get the RFPs from the database
const { getMessage } = require("../lang");
const db = require("../models/index");
const { applyRfpValidator } = require("../validators/rfpVendors");
const Rfps = db.Rfps;
const RfpVendors = db.RfpVendors;
const Users = db.Users;
const Category = db.Category;

// This api is used to get the vendor's rfp details with vendor details
const getRfpVendor = async (req, res) => {
  const vendor_id = req.user.id;
  const { tenant_id } = req.query;
  try {
    const rfpsData = await RfpVendors.findAll({
      attributes: ["id", "vendor_id", "item_price", "total_cost", "status"],
      include: [
        {
          model: Rfps,
          as: "rfp",
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
              model: Category,
              as: "category",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      where: { tenant_id, vendor_id },
    });

    const response = {
      status: true,
      rfps: rfpsData.map((rfpVendor) => {
        const rfp = rfpVendor.rfp;
        const categories = rfp?.category
          ? [{ id: rfp.category.id, name: rfp.category.name }]
          : [];

        return {
          id: rfp?.id || null,
          admin_id: rfp?.admin_id || null,
          item_name: rfp?.item_name || null,
          item_description: rfp?.item_description || null,
          quantity: rfp?.quantity || null,
          last_date: rfp?.last_date || null,
          minimum_price: rfp?.minimum_price || null,
          maximum_price: rfp?.maximum_price || null,
          category: categories,
          created_at: rfp?.created_at || null,
          updated_at: rfp?.updated_at || null,
          vendor_id: rfpVendor.vendor_id || null,
          rfp_id: rfp?.id || null,
          item_price: rfpVendor.item_price || null,
          total_cost: rfpVendor.total_cost || null,
          status: rfpVendor.status || null,
        };
      }),
    };

    return res.json(response);
  } catch (error) {
    console.error("Error fetching RFPs with vendor details:", error);
    return res
      .status(400)
      .json({ status: false, message: getMessage("error.failedToFetchData") });
  }
};

// This api is used to apply for the RFP
const applyRfp = async (req, res) => {
  try {
    const vendor = req.user;
    const { error, value } = applyRfpValidator.validate(req.body);

    if (error) {
      return res.status(400).json({
        response: "error",
        error: error.details[0].message,
      });
    }

    const { item_price, total_cost, rfp_id, tenant_id } = value;
    const rfpVendor = await RfpVendors.findOne({
      where: {
        rfp_id: rfp_id,
        status: "closed",
        vendor_id: vendor.id,
        tenant_id: tenant_id,
      },
      include: [
        {
          model: Rfps,
          as: "rfp",
        },
      ],
    });

    if (!rfpVendor || rfpVendor.length === 0) {
      return res.status(400).json({
        status: false,
        message: getMessage("rfpVendor.rfpNotFound"),
      });
    } else if (rfpVendor.rfp.status != "open") {
      return res.status(400).json({
        status: false,
        message: getMessage("rfpVendor.rfpNotOpen"),
      });
    } else if (
      item_price < rfpVendor.rfp.min_price ||
      item_price > rfpVendor.rfp.max_price
    ) {
      return res.status(400).json({
        status: false,
        message: getMessage("rfpVendor.invalidPrice"),
      });
    }
    rfpVendor.update({
      item_price,
      total_cost,
      status: "applied",
    });
    return res.json({
      status: true,
      message: getMessage("rfpVendor.appliedForRfp"),
    });
  } catch (error) {
    console.error("Error applying RFP:", error);
    return res.status(400).json({
      status: false,
      message: getMessage("rfpVendor.failedToApplyRfp"),
    });
  }
};

module.exports = {
  getRfpVendor, // Get RFPs with vendor details
  applyRfp, // Apply for an RFP
};
