const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app = express();
app.use(express.json());
let db = null;
const initializeDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "new.db"),
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

const dbObjToResponse = (dbObject) => ({
  username: dbObject.username,
  email: dbObject.email,
  password: dbObject.password,
});

//Resister Api

app.post("/register/", async (request, response) => {
  const { username, email, password } = request.body;
  const dbUser = await db.get(
    `Select * From User where username = "${username}";`
  );
  if (dbUser === undefined) {
    if (password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.run(`
        INSERT INTO User 
        (username,email,password )
        VALUES
        ("${username}","${email}","${hashedPassword}");
        `);
      response.status(200);
      response.send("User created successfully");
    } else {
      response.status(400);
      response.send("Password is too short");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

//Login Api

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const dbUser = await db.get(
    `Select * From User where username = "${username}";`
  );
  if (dbUser !== undefined) {
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatch) {
      let jwtToken = jwt.sign(username, "MY_SECRET_KEY");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  } else {
    response.status(400);
    response.send("Invalid user");
  }
});

//Authenticate User

function authenticateToken(request, response, next) {
  let jwtToken;

  const authorization = request.headers["authorization"];
  if (authorization !== undefined) {
    jwtToken = authorization.split(" ")[1];
  }

  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_KEY", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload;
        next();
      }
    });
  }
}

// GET User Data

app.get("/users/", authenticateToken, async (request, response) => {
  const query = `
    SELECT
    *
    FROM
    User;`;
  const UserObj = await db.all(query);
  response.send(UserObj.map((each) => dbObjToResponse(each)));
});

// Delete Users

app.delete("/delete/", async (request, response) => {
  const query = `
    DELETE FROM User;`;
  const deleteUsers = await db.run(query);
  response.send("Users Removed");
});
