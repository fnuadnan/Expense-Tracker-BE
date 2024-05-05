"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const expenses_1 = __importDefault(require("./routes/expenses"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// database connection
if (!process.env.DB) {
    console.error("FATAL ERROR: DB is not defined.");
    process.exit(1);
}
mongoose_1.default
    .connect(process.env.DB)
    .then(() => console.log("Connecting to MongoDB..."))
    .catch((err) => console.log("Could not connect to MongoDB...", err));
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//routes
app.use("/api/expenses/", expenses_1.default);
// listenner
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listenning to port ${port}`));
