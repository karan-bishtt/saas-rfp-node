const { response } = require("express");
const db = require("../models/index");
const XLSX = require("xlsx");
const { getMessage } = require("../lang");
const { approveUserStatusValidator } = require("../validators/common");
const { sendMails } = require("../helpers/mailer");
const { ROLES, USERSTATUS } = require("../helpers/constant");
const Users = db.Users;
const VendorDetails = db.VendorDetails;
const Category = db.Category;

// This method is used to get the vendors
const getVendors = async (req, res) => {
  try {
    const user = req.user;
    const { tenant_id } = req.query || user.tenant_id;
    const vendors = await Users.findAll({
      attributes: ["id", "name", "email", "mobile", "status"],
      include: [
        {
          model: VendorDetails, // Make sure you've imported VendorDetails at the top if it's in a different file
          as: "vendorDetails",
          attributes: ["no_of_employees", "last_three_year_revenue"],
          include: [
            {
              model: Category,
              as: "categories",
              attributes: ["id", "name"],
              //   exclude the join table attribute
              through: { attributes: [] },
            },
          ],
        },
      ],
      where: {
        roles: "vendor",
        tenant_id: tenant_id,
      },
    });
    const result = vendors.map((vendor) => {
      // Extract vendor details if they exist; otherwise, set default values
      const details = vendor.vendorDetails ? vendor.vendorDetails[0] : null; // Assuming it's a one-to-one relationship for simplicity
      const categories =
        details?.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })) || [];

      return {
        name: vendor.name,
        email: vendor.email,
        mobile: vendor.mobile,
        revenue: details ? details.last_three_year_revenue : "N/A", // Change 'revenue' to 'last_three_year_revenue' as per model
        category: categories,
        no_of_employees: details ? details.no_of_employees : "N/A",
        user_id: vendor.id,
        status: vendor.status,
      };
    });
    res.json({
      status: true,
      data: { vendors: result },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(400).json({
      status: false,
      message: getMessage("vendor.errorFetchingVendors"),
    });
  }
};

// This method is used to approve the vendor
const approveVendor = async (req, res) => {
  try {
    const { error, value } = approveUserStatusValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }
    const { user_id, status, tenant_id } = value;

    // Check if user is present in the database
    const user = await Users.findOne({
      where: { id: user_id, tenant_id: tenant_id, roles: ROLES.vendor },
    });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: getMessage("common.userNotFound"),
      });
    } else if (user.status == USERSTATUS.approved) {
      return res.status(400).json({
        status: false,
        message: getMessage("vendor.alreadyApproved"),
      });
    }
    // updating the user status
    user.status = status;
    await user.save();
    let name = user.name || user.email;
    // Sending mail
    if (status === USERSTATUS.approved) {
      const email = user.email;
      sendMails(
        email,
        "Registration Request Approved",
        `Hi ${name}, \n Your registration request has been approved. please click on the link ${process.env.LOGIN_URL} for login.`
      );
    }

    res.json({
      status: true,
      message: getMessage("vendor.approveSuccess"),
      user_id: user.id,
    });
  } catch {
    res.status(400).json({
      status: false,
      message: getMessage("vendor.approveFailed"),
    });
  }
};

// This method is used to get the vendors in excel
const getVendorsInExcel = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const vendors = await Users.findAll({
      attributes: ["id", "name", "email", "mobile", "status"],
      include: [
        {
          model: VendorDetails, // Make sure you've imported VendorDetails at the top if it's in a different file
          as: "vendorDetails",
          attributes: ["no_of_employees", "last_three_year_revenue"],
          include: [
            {
              model: Category,
              as: "categories",
              attributes: ["id", "name"],
              //   exclude the join table attribute
              through: { attributes: [] },
            },
          ],
        },
      ],
      where: {
        roles: "vendor",
        tenant_id: tenant_id,
      },
    });

    const vendorData = vendors.map((vendor) => {
      const details = vendor.vendorDetails ? vendor.vendorDetails[0] : null;
      const categories =
        details?.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })) || [];

      return {
        Name: vendor.name,
        Email: vendor.email,
        Mobile: vendor.mobile,
        Revenue: details ? details.last_three_year_revenue : "N/A",
        Categories: categories,
        Employees: details ? details.no_of_employees : "N/A",
        Status: details ? details.status : "N/A",
      };
    });

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(vendorData);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendors");

    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    console.log("Excel Buffer Size:", excelBuffer.length);

    // Set response headers for file download
    res.setHeader("Content-Disposition", 'attachment; filename="vendors.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Send the file to the client
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({
      status: false,
      message: getMessage("vendor.errorExcelGeneration"),
    });
  }
};

module.exports = { getVendors, approveVendor, getVendorsInExcel };
