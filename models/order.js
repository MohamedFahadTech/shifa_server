const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    items: [{
        id: String,
        name: String,
        desc: String,
        price: Number,
        qty: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    orderDate: { type: Date, default: Date.now },
    // In a real app, you'd link this to a User ID
    // customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);