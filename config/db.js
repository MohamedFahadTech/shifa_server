const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/shifa_laundry");
		console.log("MongoDB connected has been successfully connected");
	} catch (error) {
		console.error("MongoDB connection failed : ", error);
		process.exit(1);
	}
};

module.exports = connectDB;