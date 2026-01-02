const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// ---------------------------------------------------------------------------------------------------------

const app = express();

app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}));

require("dotenv").config();
const user = require("./models/user");

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

	const userExist = await user.findOne({ email: email });

	if (userExist) {

		if (userExist.password === password) {
			return res.json({ message: 'Login successful', success: true })
		}
		else {
			return res.json({ message: 'Password does not match', success: false })
		}
	}
	else {
		return res.json({ message: 'User not found', success: false })
	}
})

// ---------------------------------------------------------------------------------------------------------

