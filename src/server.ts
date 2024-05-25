import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import { createNewUser, signIn } from "./handlers/user";
import { body } from "express-validator";
import { handleInputErrors } from "./modules/middleware";

const app = express();
app.use(cors());
app.use(morgan("dev"));
// allows the client to send request in json
app.use(express.json());
// allows the client to send query strings
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.json({ data: { age: 5 } });
  // res.status(200);
  // res.json({
  //   message: "success",
  //   data: {
  //     age: 31,
  //     role: "software developer",
  //   },
  // });
});

app.use("/api", protect, router);

app.post(
  "/user",
  [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
  ],
  handleInputErrors,
  createNewUser,
);

app.post("/signin", signIn);

// catch errors thrown from our routes that do not belong to a sub router
app.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ message: err.message });
  } else if (err.type === "input") {
    res.status(400).json({ message: err.message });
  } else {
    res.status(500).json({ message: err.message });
  }
});

// catch uncaught exceptions [synchronous] not thrown from our routes
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// catch unhandled promise rejections not thrown from our routes
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
});

export default app;
