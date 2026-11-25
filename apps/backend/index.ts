import "./config/loadEnv";
import express from "express";
import workspaceRouter from "./router/workspace.router";
import projectRouter   from "./router/project.router";
import taskRouter      from  "./router/task.router";
import membershipRouter from "./router/membership.router"
import taskcommentRouter from "./router/taskcomment.router"
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api",workspaceRouter);
app.use("/api",projectRouter);
app.use("/api",taskRouter);
app.use("/api", membershipRouter);
app.use("/api", taskcommentRouter);

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});