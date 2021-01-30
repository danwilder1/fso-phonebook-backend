require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
var morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("post-req-body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return null;
});

app.use(
  morgan(
    "METHOD: :method\nURL: :url\nSTATUS: :status\n" +
      "RESPONSE CONTENT LENGTH: :res[content-length]\n" +
      "RESPONSE TIME: :response-time ms\nREQUEST BODY [POST]: :post-req-body\n"
  )
);

app.get("/api/info", (request, response) => {
  Person.count({}).then((count) => {
    const info = `<p>Phonebook has info for ${count} people</p>`;
    const date = `<p>${new Date()}</p>`;

    response.send(info + date);
  });
});

app.get("/api/people", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/people/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/people/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/people", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "name missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

// Unknown Endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Error Handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
