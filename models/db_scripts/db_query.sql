-- NOTE: RUN THIS COMMAND AFTER CREATING A DATABASE NAMED `rfpsaasdb`

-- Create Tenant Table 
CREATE TABLE `tenants` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `status` ENUM('active', 'closed') NOT NULL DEFAULT 'active',
    `name` VARCHAR(191) NOT NULL
);

-- Create Category Table
CREATE TABLE `category` ( -- Updated to match plural table name for consistency
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `status` TINYINT NOT NULL DEFAULT 1,
    `tenant_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `tenants.id` type
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

-- Create Users Table
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL, -- Updated to UNSIGNED
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL,
    `roles` ENUM('vendor', 'admin', 'manager', 'accountant', 'super_admin') NULL,
    `mobile` VARCHAR(10) NULL,
    `otp` INT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    `tenant_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `tenants.id` type
    CONSTRAINT `fk_users_tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

-- Create Vendor Details Table
CREATE TABLE `vendor_details` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `vendor_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `users.id` type
    `no_of_employees` VARCHAR(191) NOT NULL,
    `last_three_year_revenue` VARCHAR(191) NOT NULL,
    `gst_no` VARCHAR(191) NOT NULL,
    `pancard_no` VARCHAR(191) NOT NULL,
    `created_at` DATETIME NULL,
    `updated_at` DATETIME NULL,
    CONSTRAINT `fk_vendor_details_vendor_id` FOREIGN KEY (`vendor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Create Accountants Table
CREATE TABLE `accountants` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `licence_number` VARCHAR(100) NOT NULL,
    `accountant_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `users.id` type
    FOREIGN KEY (`accountant_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- Create RFP Table
CREATE TABLE `rfps` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `admin_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `users.id` type
    `item_name` VARCHAR(191) NOT NULL,
    `item_description` TEXT NOT NULL,
    `quantity` INT NOT NULL,
    `last_date` DATE NOT NULL,
    `minimum_price` DOUBLE(8, 2) NOT NULL,
    `status` ENUM('open', 'closed', 'applied') NOT NULL DEFAULT 'open',
    `maximum_price` DOUBLE(8, 2) NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `category.id` type
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `tenant_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `tenants.id` type
    FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);

-- Create RFP Vendors Table
CREATE TABLE `rfp_vendors` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
    `vendor_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `users.id` type
    `rfp_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `rfps.id` type
    `item_price` DOUBLE(8, 2) DEFAULT NULL,
    `total_cost` DOUBLE(8, 2) DEFAULT NULL,
    `status` ENUM('open', 'closed', 'applied') NOT NULL DEFAULT 'open',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `tenant_id` BIGINT UNSIGNED NOT NULL, -- Updated to match `tenants.id` type
    FOREIGN KEY (`vendor_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`rfp_id`) REFERENCES `rfps`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
);


-- Create a rfp vendor category table
CREATE TABLE `vendor_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `vendor_id` BIGINT UNSIGNED NOT NULL,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendor_id` (`vendor_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `fk_vendor_categories_vendor_id` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_details` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_vendor_categories_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create a rfp audit log
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(50) NOT NULL,
    changes TEXT NULL, -- To store JSON of what was changed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    tenant_id BIGINT UNSIGNED NOT NULL
);
