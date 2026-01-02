const mongoose = require("mongoose");

/* OPTION SCHEMA */
const optionSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);

/* SERVICE SCHEMA */
const serviceSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true // Wash, Iron, Wash & Iron
        },
        options: [optionSchema]
    },
    { _id: false }
);

/* FABRIC SCHEMA */
const fabricSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true // Silk, Cotton
        },
        services: [serviceSchema]
    },
    { _id: false }
);

/* MAIN CATEGORY SCHEMA */
const serviceCategorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
            trim: true // Shirt, Pant, Saree
        },

        fabrics: [fabricSchema],

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Service", serviceCategorySchema);