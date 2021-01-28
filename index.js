const express = require("express");
const app = express();

// Hardcoded values for now
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  console.log(request.headers);
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  console.log(request.headers);

  const info = `<p>Phonebook has info for ${persons.length} people</p>`;
  const date = `<p>${new Date()}</p>`;

  response.send(info + date);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
