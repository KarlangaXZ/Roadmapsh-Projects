#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON
const filePath = path.join(__dirname, "tasks.json");

// Función para leer tareas
function readTasks() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    // Si el archivo está corrupto, lo reseteamos
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
}

// Función para guardar tareas
function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Generar un ID único (basado en max id)
function generateId(tasks) {
  return tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}

// --- Comandos --- //
const args = process.argv.slice(2);
const command = args[0];

// Ejecutar comandos
switch (command) {
  case "add": {
    const description = args[1];
    if (!description) {
      console.log("Error: Debes proporcionar una descripción");
      process.exit(1);
    }
    const tasks = readTasks();
    const newTask = {
      id: generateId(tasks),
      description,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
    break;
  }

  case "update": {
    const id = parseInt(args[1]);
    const newDescription = args[2];
    if (!id || !newDescription) {
      console.log("Usage: task-cli update <id> <new description>");
      process.exit(1);
    }
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
      console.log("Error: Task not found");
      process.exit(1);
    }
    task.description = newDescription;
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} updated successfully`);
    break;
  }

  case "delete": {
    const id = parseInt(args[1]);
    if (!id) {
      console.log("Usage: task-cli delete <id>");
      process.exit(1);
    }
    let tasks = readTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    if (tasks.length === initialLength) {
      console.log("Error: Task not found");
      process.exit(1);
    }
    saveTasks(tasks);
    console.log(`Task ${id} deleted successfully`);
    break;
  }

  case "mark-in-progress":
  case "mark-done": {
    const id = parseInt(args[1]);
    if (!id) {
      console.log(`Usage: task-cli ${command} <id>`);
      process.exit(1);
    }
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
      console.log("Error: Task not found");
      process.exit(1);
    }
    task.status = command === "mark-done" ? "done" : "in-progress";
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`Task ${id} marked as ${task.status}`);
    break;
  }

  case "list": {
    const filter = args[1]; // todo | done | in-progress
    let tasks = readTasks();
    if (filter) {
      tasks = tasks.filter(t => t.status === filter);
    }
    if (tasks.length === 0) {
      console.log("No tasks found.");
      break;
    }
    tasks.forEach(t => {
      console.log(
        `[${t.id}] ${t.description} | ${t.status} | Created: ${t.createdAt}`
      );
    });
    break;
  }

  default:
    console.log(`Unknown command: ${command}`);
    console.log("Available commands:");
    console.log("  add <description>");
    console.log("  update <id> <new description>");
    console.log("  delete <id>");
    console.log("  mark-in-progress <id>");
    console.log("  mark-done <id>");
    console.log("  list [todo|in-progress|done]");
    break;
}
