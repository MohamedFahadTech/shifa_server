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
			enum: ["user", "admin"],
			default: "user",
		},

		addresses: {
			type: String,
		},

		isActive: {
			type: Boolean,
			default: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);