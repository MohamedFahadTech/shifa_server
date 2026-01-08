const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config({ quiet: true });

// Import Models
const user = require("./models/user");
const service = require("./models/service");
const order = require("./models/Order"); // This variable is named 'order'

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// Database Connection
connectDB();

// ---------------------------------------------------------------------------------------------------------

// User Login
app.post("/user/login", async (req, res) => {
    const { email, password } = req.body;
    const userExist = await user.findOne({ phone: email });

    if (userExist) {
        if (userExist.password === password) {
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
                user: userData 
            });
        } else {
            return res.json({ message: 'Password does not match', success: false });
        }
    } else {
        return res.json({ message: 'User not found', success: false });
    }
});

// User Signup
app.post("/user/signup", async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        if (!name || !email || !password || !phone || !address) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const userExist = await user.findOne({ $or: [{ email }, { phone }] });
        if (userExist) {
            return res.json({ success: false, message: "User already exists" });
        }

        const newUser = new user({ name, email, password, phone, address });
        await newUser.save();

        return res.json({ success: true, message: "Signup successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// ---------------------------------------------------------------------------------------------------------

// GET all services
app.get("/services", async (req, res) => {
    try {
        const services = await service.find();
        res.json({ success: true, data: services });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch services" });
    }
});

// GET all customers
app.get("/users", async (req, res) => {
    try {
        const customers = await user.find({ role: "user" });
        res.json({ success: true, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching customers" });
    }
});

// ---------------------------------------------------------------------------------------------------------

// CREATE Order
app.post("/orders", async (req, res) => {
    try {
        console.log("Incoming Order Data:", req.body); 

        // Important: Using 'order' because that is how you required it at the top
        const newOrder = new order({
            userId: req.body.userId,
            phoneNo: req.body.phoneNo, 
            items: req.body.items,
            totalAmount: req.body.totalAmount,
            pickup: {
                address: req.body.pickup.address,
                pickupDate: req.body.pickup.pickupDate,
                pickupSlot: req.body.pickup.pickupSlot
            },
            payment: {
                method: req.body.payment.method
            }
        });

        const savedOrder = await newOrder.save();
        console.log("Order Saved Successfully:", savedOrder._id);
        res.status(201).json({ success: true, message: "Order placed successfully!", data: savedOrder });
        
    } catch (err) {
        // This will print the specific validation error in your terminal
        console.error("Database Save Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Fetch Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------------------------------------------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
// GET orders by phone number (USER SIDE)
app.get("/orders/user/:phoneNo", async (req, res) => {
  try {
    const { phoneNo } = req.params;

    const userOrders = await order
      .find({ phoneNo })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: userOrders
    });

  } catch (error) {
    console.error("User Orders Fetch Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
