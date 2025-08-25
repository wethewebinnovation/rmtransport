import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import customerRoutes from "./routes/customers.js";
import productRoutes from "./routes/products.js";
import lorryRoutes from "./routes/lorries.js";
import driverRoutes from "./routes/drivers.js";
import settingsRoutes from "./routes/settings.js";
import lrBillRoutes from "./routes/lrBills.js"; // ensure this file is implemented later
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/lorries", lorryRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/lrBills", lrBillRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
