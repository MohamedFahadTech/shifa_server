const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// ---------------------------------------------------------------------------------------------------------

const app = express();

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}));

require("dotenv").config({ quiet: true });
const user = require("./models/user");
const service = require("./models/service");
const order = require("./models/Order");



// ---------------------------------------------------------------------------------------------------------

connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);

// ---------------------------------------------------------------------------------------------------------

// For user login

app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;
    const userExist = await user.findOne({ phone: email });

    if (userExist) {
        if (userExist.password === password) {
            // Create a user object without the password
            const userData = {
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                phone: userExist.phone,
                role: userExist.role,
                address: userExist.addresses
            };

            return res.json({ 
                message: 'Login successful', 
                success: true, 
                user: userData // Send user data back
            });
        } else {
            return res.json({ message: 'Password does not match', success: false });
        }
    } else {
        return res.json({ message: 'User not found', success: false });
    }
});
// ---------------------------------------------------------------------------------------------------------

app.post("/user/signup", async (req, res) => {

	try {

		const { name, email, password, phone, address } = req.body;

		// Validation
		if (!name || !email || !password || !phone || !address) {
			return res.json({
				success: false,
				message: "All fields are required",
			});
		}

		// Check existing user
		const userExist = await user.findOne({
			$or: [{ email }, { phone }],
		});

		if (userExist) {
			return res.json({
				success: false,
				message: "User already exists",
			});
		}

		// Create user
		const newUser = new user({
			name,
			email,
			password,
			phone,
			address,
		});

		await newUser.save();

		return res.json({
			success: true,
			message: "Signup successful",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
});

// ---------------------------------------------------------------------------------------------------------
// GET all service categories (Shirt, Pant, Saree)
app.get("/services", async (req, res) => {
	try {
		const services = await service.find();
		res.json({ success: true, data: services });
	} catch (error) {
		res.status(500).json({ success: false, message: "Failed to fetch services" });
	}
});

// Add this to your Express server file
app.get("/users", async (req, res) => {
    try {
        // Find all users with role 'user'
        const customers = await user.find({ role: "user" });
        res.json({ success: true, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching customers" });
    }
});


// Replace your existing /orders route with this:
app.post("/orders", async (req, res) => {
    try {
        // 1. Log the data to see what React is sending
        console.log("Order Received:", req.body);

        const { userId, items, totalAmount, pickup, payment } = req.body;

        // 2. Validate mandatory fields before saving
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // 3. Create the document matching your Schema
        const newOrder = new order({
            userId,
            items,
            totalAmount,
            pickup: {
                address: pickup.address,
                pickupDate: pickup.pickupDate,
                pickupSlot: pickup.pickupSlot
            },
            payment: {
                method: payment.method,
                status: "Pending" // Default as per schema
            }
        });

        await newOrder.save();
        res.status(201).json({ success: true, orderId: newOrder._id });
        
    } catch (error) {
        // 4. LOG THE ACTUAL ERROR TO THE TERMINAL
        console.error("Mongoose Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});