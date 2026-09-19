const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

const PORT = 5000;
const FILE = "./tasks.json";

// Middleware
app.use(cors());
app.use(express.json());


// ===============================
// GET ALL TASKS
// ===============================

app.get("/api/tasks", (req, res) => {

    const tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    res.json(tasks);
});


// ===============================
// ADD TASK
// ===============================

app.post("/api/tasks", (req, res) => {

    const tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const newTask = {

        id: Date.now(),

        name: req.body.name,

        priority: req.body.priority,

        completed: false
    };

    tasks.push(newTask);

    fs.writeFileSync(
        FILE,
        JSON.stringify(tasks, null, 2)
    );

    res.status(201).json(newTask);
});


// ===============================
// DELETE TASK
// ===============================

app.delete("/api/tasks/:id", (req, res) => {

    let tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const id = Number(req.params.id);

    tasks = tasks.filter(
        task => task.id !== id
    );

    fs.writeFileSync(
        FILE,
        JSON.stringify(tasks, null, 2)
    );

    res.json({
        message: "Task deleted successfully"
    });
});


// ===============================
// EDIT TASK
// ===============================

app.put("/api/tasks/:id", (req, res) => {

    const tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const id = Number(req.params.id);

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    task.name = req.body.name;
    task.priority = req.body.priority;

    fs.writeFileSync(
        FILE,
        JSON.stringify(tasks, null, 2)
    );

    res.json(task);
});


// ===============================
// COMPLETE / UNDO TASK
// ===============================

app.patch("/api/tasks/:id", (req, res) => {

    const tasks = JSON.parse(
        fs.readFileSync(FILE, "utf8")
    );

    const id = Number(req.params.id);

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    task.completed = !task.completed;

    fs.writeFileSync(
        FILE,
        JSON.stringify(tasks, null, 2)
    );

    res.json(task);
});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});