const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		phone: {
			type: String,
			required: true,
			unique: true,
			match: [/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"],
		},

		email: {
			type: String,
			lowercase: true,
			trim: true,
		},

		password: {
			type: String,
			minlength: 6,
		},

		role: {
			type: String,
			enum: ["user", "admin", "delivery"],
			default: "user",
		},

		addresses: [
			{
				label: { type: String, default: "Home" },
				addressLine: { type: String, required: true },
				area: String,
				city: { type: String, default: "Chennai" },
				pincode: String,
				isDefault: { type: Boolean, default: false },
			}
		],

		isActive: {
			type: Boolean,
			default: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

