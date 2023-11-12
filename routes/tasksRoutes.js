const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

// import check auth middleware
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/add", checkAuth, TaskController.createTask);
router.post("/add", checkAuth, TaskController.createTaskSave);
router.post("/remove", checkAuth, TaskController.removeTask);
router.get("/edit/:id", checkAuth, TaskController.updateTask);
router.post("/edit", checkAuth, TaskController.updateTaskPost);
router.get("/dashboard", checkAuth, TaskController.dashboard);
router.get("/", TaskController.showTasks);

module.exports = router;
