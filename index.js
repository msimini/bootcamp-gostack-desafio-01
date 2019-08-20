const express = require("express");

const server = express();

server.use(express.json());

let projects = [];
let qntRequest = 0;

server.use((req, res, next) => {
  qntRequest += 1;
  console.log(`Requests Number: ${qntRequest}`);
  return next();
});

function checkExists(req, res, next) {
  const project = projects.find(el => el.id == req.params.id);
  if (!project) {
    return res.status(400).json("Invalid Id");
  }
  req.project = project;
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  res.json({ message: "Project added" });
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.put("/projects/:id", checkExists, (req, res) => {
  const { title } = req.body;
  req.project.title = title;
  res.json({ message: "Title Changed" });
});

server.delete("/projects/:id", checkExists, (req, res) => {
  const { id } = req.params;
  projects = projects.filter(el => el.id !== id);
  res.json({ message: "Project Deleted" });
});

server.post("/projects/:id/tasks", checkExists, (req, res) => {
  const { title } = req.body;
  req.project.tasks.push(title);
  res.json({ message: "Task added" });
});

server.listen(3000);
