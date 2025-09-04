# Task Tracker CLI

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)  
![License](https://img.shields.io/badge/License-MIT-blue.svg)  
![Status](https://img.shields.io/badge/Status-Active-success) 

link to the project: https://roadmap.sh/projects/task-tracker
  

A simple **Command Line Interface (CLI)** application to manage your daily tasks.  
With this tool, you can **add, update, delete, and track tasks** using only your terminal.  
All tasks are stored locally in a JSON file, so no external database is required.  

---

## Features
- ✅ Add new tasks  
- ✏️ Update existing tasks  
- ❌ Delete tasks  
- 🚀 Mark tasks as **in progress**  
- ✔️ Mark tasks as **done**  
- 📋 List all tasks  
- 🔍 Filter tasks by status: **todo, in-progress, done**  
- 📂 Tasks are persisted in a local `tasks.json` file  

---

## Task Properties
Each task has the following properties:
- `id` → Unique identifier  
- `description` → Short description of the task  
- `status` → `todo | in-progress | done`  
- `createdAt` → Date and time when the task was created  
- `updatedAt` → Date and time when the task was last updated  

---

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd task-tracker 
   ```
2. Initialize Node.js project (if not already): 
```bash
npm init -y
```
3. Make the CLI executable:
- Add this line at the top of `task-cli.js`:
```javascript
#!/usr/bin/env node
```
4. Link the CLI globally:
```bash
npm link
```
5. Run the CLI:
```bash
task-cli
```
---
## Usage
```bash
task-cli add "New Task" # Add a new task.

task-cli update <id> "Updated Task" # Update an existing task.

task-cli delete <id> # Delete a task.

task-cli list # List all tasks.

task-cli mark-in-progress <id> # Mark a task as in-progress.

task-cli mark-done <id> #Mark a task as done.
```
---
### List Task by status
```bash
task-cli list todo #List all tasks with 
task-cli list in-progress #List all tasks with 
task-cli list done #List all tasks with 
```
---
### Example Output
```bash
$ task-cli add "Learn Node.js"
# Task added successfully (ID: 2)

$ task-cli list
# Tasks:
# [1] Buy groceries | done | Created: 2025-09-04T08:00:00Z
# [2] Learn Node.js | todo | Created: 2025-09-04T08:05:00Z
```
---
## License
This project is licensed under the *MIT License*.