const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const { parse, format } = require("date-fns");
const { validateBody, validateQuery, validateParams } = require("./test");
app = express();
app.use(express.json());
let db = null;
const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "todoApplication.db"),
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (err) {
    console.log("DB Error: " + err.message);
  }
};
initializeDatabaseAndServer();

const toTodoResponseObject = (dbItem) => ({
  id: dbItem.id,
  todo: dbItem.todo,
  priority: dbItem.priority,
  status: dbItem.status,
  category: dbItem.category,
  dueDate: dbItem.due_date,
});

// function checks validation

// get all todos

app.get("/todos/", validateQuery, async (request, response) => {
  const {
    status = "",
    priority = "",
    search_q = "",
    category = "",
  } = request.query;
  const allTodos = await db.all(`
    SELECT
    *
    FROM
    todo
    WHERE 
    status like "%${status}%" 
    and priority like "%${priority}%"
    and todo like "%${search_q}%"
    and category like "%${category}%";`);
  response.send(allTodos.map((item) => toTodoResponseObject(item)));
});

// get todos with id
app.get("/todos/:todoId/", validateParams, async (request, response) => {
  const todoId = request.params.todoId;
  const getTodo = await db.get(`
    SELECT
    *
    FROM
    todo
    WHERE id = "${todoId}";
    `);
  response.send(toTodoResponseObject(getTodo));
});

// get todos with same duedate at /agenda/
app.get("/agenda/", validateQuery, async (request, response) => {
  const { date } = request.query;
  const getAgenda = await db.all(`
    SELECT
    *
    FROM
    todo
    WHERE due_date = "${format(new Date(date), "yyyy-MM-dd")}";
    `);
  if (getAgenda.length === 0) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    response.send(getAgenda.map((item) => toTodoResponseObject(item)));
    console.log(getAgenda);
  }
});

// create a new todo post method api

app.post("/todos/", validateBody, async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  await db.run(`
    Insert into
    todo
    (id, todo, priority, status, category, due_date)
    values
    (${id}, "${todo}", "${priority}", "${status}", "${category}", "${dueDate}");
    `);
  response.send("Todo Successfully Added");
});

// update todo with id
app.put(
  "/todos/:todoId/",
  validateParams,
  validateBody,
  async (request, response) => {
    const todoId = request.params.todoId;
    var key = Object.keys(request.body)[0];
    if (key === "dueDate") {
      key = "due_date";
    }
    const value = Object.values(request.body)[0];
    await db.run(`
      UPDATE
      todo
      SET
      ${key} = "${value}"
      WHERE
      id = ${todoId};
      `);
    if (key === "due_date") {
      key = "Due Date";
    }
    const resp = `${key} Updated`;
    response.send(resp[0].toUpperCase() + resp.slice(1));
  }
);

// delete todo with id
app.delete("/todos/:todoId/", validateParams, async (request, response) => {
  const todoId = request.params.todoId;
  await db.run(`
    DELETE FROM todo
    WHERE id = ${todoId};
    `);
  response.send("Todo Deleted");
});

module.exports = app;
