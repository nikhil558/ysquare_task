const { parse, format } = require("date-fns");

function validateBody(request, response, next) {
  var keys = Object.keys(request.body);
  var allOkay = true;
  for (var key of keys) {
    if (key === "id") {
      if (isNaN(request.body[key]) || typeof request.body[key] !== "number") {
        response.status(400);
        response.send("Invalid Id");
        allOkay = false;
        break;
      }
    } else if (key === "status") {
      if (
        !["TO DO", "IN PROGRESS", "DONE"].some((i) => i === request.body[key])
      ) {
        response.status(400);
        response.send("Invalid Todo Status");
        allOkay = false;
        break;
      }
    } else if (key === "category") {
      if (!["WORK", "HOME", "LEARNING"].some((i) => i === request.body[key])) {
        response.status(400);
        response.send("Invalid Todo Category");
        allOkay = false;
        break;
      }
    } else if (key === "priority") {
      if (!["HIGH", "MEDIUM", "LOW"].some((i) => i === request.body[key])) {
        response.status(400);
        response.send("Invalid Todo Priority");
        allOkay = false;
        break;
      }
    } else if (key === "dueDate") {
      var a = parse(request.body[key], "yyyy-MM-dd", new Date());
      if (a instanceof Date && !isNaN(a) === false) {
        response.status(400);
        response.send("Invalid Due Date");
        allOkay = false;
        break;
      }
    } else if (key === "todo") {
      continue;
    } else {
      response.status(400);
      response.send(`"${key}" is not a valid field`);
      allOkay = false;
      break;
    }
  }
  if (allOkay) {
    next();
  }
}

function validateQuery(request, response, next) {
  var keys = Object.keys(request.query);
  var allOkay = true;
  for (var key of keys) {
    if (key === "id") {
      if (isNaN(request.query[key]) || typeof request.query[key] !== "number") {
        response.status(400);
        response.send("Invalid Id");
        allOkay = false;
        break;
      }
    } else if (key === "status") {
      if (
        !["TO DO", "IN PROGRESS", "DONE"].some((i) => i === request.query[key])
      ) {
        response.status(400);
        response.send("Invalid Todo Status");
        allOkay = false;
        break;
      }
    } else if (key === "category") {
      if (!["WORK", "HOME", "LEARNING"].some((i) => i === request.query[key])) {
        response.status(400);
        response.send("Invalid Todo Category");
        allOkay = false;
        break;
      }
    } else if (key === "priority") {
      if (!["HIGH", "MEDIUM", "LOW"].some((i) => i === request.query[key])) {
        response.status(400);
        response.send("Invalid Todo Priority");
        allOkay = false;
        break;
      }
    } else if (key === "date") {
      var a = parse(request.query[key], "yyyy-MM-dd", new Date());
      if (a instanceof Date && !isNaN(a) === false) {
        response.status(400);
        response.send("Invalid Due Date");
        allOkay = false;
        break;
      }
    }
  }
  if (allOkay) {
    next();
  }
}

function validateParams(request, response, next) {
  var key = Object.keys(request.params)[0];
  if (isNaN(request.params[key])) {
    response.status(400);
    response.send("Invalid Id");
  } else {
    next();
  }
}
// function validateEntry(request, response, next) {
//   var object;
//   if (request.query.length !== 0) {
//     object = request.query;
//   } else {
//     object = request.body;
//   }
//   console.log(request.body.length === 0, request.query, object);
//   var keys = Object.keys(object);
//   var allOkay = true;
//   for (var key of keys) {
//     if (key === "id") {
//       if (isNaN(object[key]) || typeof object[key] !== "number") {
//         response.status(400);
//         response.send("Invalid Id");
//         allOkay = false;
//         break;
//       }
//     } else if (key === "status") {
//       if (!["TO DO", "IN PROGRESS", "DONE"].some((i) => i === object[key])) {
//         response.status(400);
//         response.send("Invalid Todo Status");
//         allOkay = false;
//         break;
//       }
//     } else if (key === "category") {
//       if (!["WORK", "HOME", "LEARNING"].some((i) => i === object[key])) {
//         response.status(400);
//         response.send("Invalid Todo Category");
//         allOkay = false;
//         break;
//       }
//     } else if (key === "priority") {
//       if (!["HIGH", "MEDIUM", "LOW"].some((i) => i === object[key])) {
//         response.status(400);
//         response.send("Invalid Todo Priority");
//         allOkay = false;
//         break;
//       }
//     } else if (key === "dueDate" || key === "date") {
//       var a = parse(object[key], "yyyy-MM-dd", new Date());
//       if (a instanceof Date && !isNaN(a) === false) {
//         response.status(400);
//         response.send("Invalid Due Date");
//         allOkay = false;
//         break;
//       }
//     }
//   }
//   if (allOkay) {
//     next();
//   }
// }
module.exports = { validateBody, validateQuery, validateParams };
