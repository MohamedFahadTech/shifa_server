const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
	{
		orderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
			required: true
		},

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},

		deliveryBoyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},

		address: {
			type: String,
			required: true
		},

		phoneNo: {
			type: String,
			required: true
		},

		pickupDate: {
			type: Date,
			required: true
		},

		pickupSlot: {
			type: String,
			enum: ["Morning", "Evening"],
			required: true
		},

		status: {
			type: String,
			enum: [
				"Assigned",
				"Out for Pickup",
				"Picked Up",
				"Failed"
			],
			default: "Assigned"
		},

		notes: {
			type: String
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);