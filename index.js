require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
var morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("post-data", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return null;
});
app.use(
  morgan(
    "METHOD: :method\nURL: :url\nSTATUS: :status\n" +
      "RESPONSE CONTENT LENGTH: :res[content-length]\n" +
      "RESPONSE TIME: :response-time ms\nPOST DATA: :post-data\n"
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

app.get("/api/people/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

// not implemented yet
app.delete("/api/people/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
