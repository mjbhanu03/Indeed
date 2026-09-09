const express = require("express");
const db = require("./Config/db");
const env = require("dotenv");
const cors = require("cors")  
const auth = require("./Module/Auth/Routes/auth.routes");
const user = require("./Module/User/Routes/user.routes");
const jobs = require("./Module/Jobs/Routes/job.routes");
const applications = require("./Module/Application/Routes/application.routes");
const admin = require("./Module/Admin/Routes/admin.routes");
const { checkToken, checkAPIKey, decryption } = require("./Common/Middleware/middleware");
const controller = require("./Module/Application/Controller/application.controller");
const {upload} = require("./Common/Middleware/upload");

const app = express();
env.config();
app.use(
  "/uploads/resume_documents",
  express.static("uploads/resume_documents")
);
app.use(
  "/uploads/cover_letter_documents",
  express.static("uploads/cover_letter_documents")
);

app.use(cors({origin: "*", credentials: true}));
app.use(express.text());
app.use(express.json());

app.get("/db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1");

        res.json({
            success: true,
            message: "Backend connected to MySQL",
            database: rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});
app.use(checkAPIKey);
app.use(checkToken);
app.use(decryption)

app.use("/auth/v1", auth);
app.use("/user/v1", user);
app.use("/jobs/v1", jobs);
app.use("/applications/v1", applications);
app.use("/admin/v1", admin);
try {
  app.listen(process.env.PORT);
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
} catch (error) {
  console.log(error);
}

