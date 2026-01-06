const mongoose = require("mongoose");

/* ORDER ITEM (CART ITEM) */
const orderItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true, // Shirt, Pant, Saree
      trim: true
    },

    fabric: {
      type: String,
      required: true, // Cotton, Silk
      trim: true
    },

    serviceMode: {
      type: String,
      enum: ["Wash", "Iron", "Wash & Iron"],
      required: true
    },

    washQuality: {
      type: String,
      enum: ["Normal", "Premium"],
      default: "Normal"
    },

    ironQuality: {
      type: String,
      enum: ["Normal", "Steam"],
      default: "Normal"
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

/* MAIN ORDER SCHEMA */
const orderSchema = new mongoose.Schema(
  {
    /* USER INFO */
    userId: {
      type: String,
      required: true
    },

    /* ITEMS */
    items: {
      type: [orderItemSchema],
      required: true
    },

    /* PRICE SUMMARY */
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    /* ORDER STATUS */
    status: {
      type: String,
      enum: [
        "Pending",
        "Pickup Scheduled",
        "Picked Up",
        "Washing",
        "Ironing",
        "Ready",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    },

    /* PICKUP DETAILS */
    pickup: {
      address: {
        type: String,
        required: true
      },
      pickupDate: {
        type: Date
      },
      pickupSlot: {
        type: String // Morning / Evening
      }
    },

    /* DELIVERY DETAILS */
    delivery: {
      expectedDate: {
        type: Date
      }
    },

    /* PAYMENT */
    payment: {
      method: {
        type: String,
        enum: ["COD", "UPI", "Card"],
        default: "COD"
      },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
      },
      transactionId: {
        type: String
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
