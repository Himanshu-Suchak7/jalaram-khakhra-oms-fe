import {z} from "zod";

export const createUserSchema = z.object({
    name: z.string({required_error: "Name is required"})
        .min(3, "Name must be at least 3 characters"),

    phone_number: z.string({required_error: "Phone number is required"})
        .min(8)
        .max(20),

    role: z.enum(["ADMIN", "USER"]),

    password: z.string({required_error: "Password is required"})
        .min(6),
});

export const createBusinessSchema = z.object({
    business_name: z
        .string()
        .trim()
        .min(1, "Business Name is required")
        .min(3, "Business Name must be at least 3 characters"),

    business_address: z
        .string()
        .trim()
        .min(1, "Business Address is required")
        .min(3, "Business Address must be at least 3 characters"),

    business_phone_number: z
        .string()
        .trim()
        .min(1, "Phone Number is required")
        .regex(/^[0-9]+$/, "Phone Number must contain only digits")
        .min(10, "Phone Number must be at least 10 digits")
        .max(13, "Phone Number must be at most 13 digits"),

    business_email: z
        .string()
        .trim()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),

    gst_number: z
        .string()
        .optional()
        .or(z.literal("")),

    upi_id: z
        .string()
        .trim()
        .min(1, "UPI ID is required")
        .min(5, "UPI ID must be at least 5 characters")
        .max(50, "UPI ID is too long"),

    upi_qr_image: z.union([
        z.string().min(1, "UPI QR Code is required"),
        z.instanceof(File),
    ]),
    tax_rate: z.coerce
        .number({ required_error: "Tax rate is required" })
        .min(0, "Tax rate cannot be negative")
        .max(100, "Tax rate cannot exceed 100%"),
    shipping_rate: z.coerce
        .number({ required_error: "Shipping rate is required" })
        .min(0, "Shipping rate cannot be negative")
        .max(100, "Shipping rate cannot exceed 100%"),
});

export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .min(3, "Name must be at least 3 characters"),

    phone_number: z
        .string()
        .trim()
        .regex(/^[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(13, "Phone number must be at most 13 digits"),

    email: z
        .string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),

    profile_picture: z.union([
        z.string(),
        z.instanceof(File),
    ]).optional(),
});

export const productSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Product Name is required")
        .min(3, "Product Name must be at least 3 characters"),

    price: z.coerce
        .number({required_error: "Price is required"})
        .min(0, "Price cannot be negative"),

    cost_price_per_kg: z.coerce
        .number()
        .min(0, "Cost price cannot be negative")
        .optional(),

    image: z.union([
        z.string(),
        z.instanceof(File),
    ]).optional(),
});

export const customerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Customer Name is required")
        .min(3, "Customer Name must be at least 3 characters"),

    phone_number: z
        .string()
        .trim()
        .regex(/^[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(13, "Phone number must be at most 13 digits"),

    address: z
        .string()
        .trim()
        .min(1, "Address is required")
        .min(3, "Address must be at least 3 characters"),

    city: z
        .string()
        .trim()
        .min(1, "City is required")
        .min(2, "City must be at least 2 characters"),
});

export const addStockSchema = z.object({
    quantity_kg: z.coerce
        .number({ required_error: "Quantity is required" })
        .positive("Quantity must be greater than 0")
        .max(100000, "Quantity too large"),
});

export const updateMinStockSchema = z.object({
    min_stock_kg: z.coerce
        .number({ required_error: "Min stock is required" })
        .min(0, "Min stock cannot be negative")
        .max(100000, "Value too large"),
});
