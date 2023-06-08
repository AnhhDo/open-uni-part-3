const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("returnInfo", (request, response) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :returnInfo"
  )
);

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
  {
    id: 5,
    name: "Anh Do",
    number: "123-456-789",
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get("/api/persons", (request, response) => {
  response.status(200).json(persons);
});

app.get("/info", (request, response) => {
  const time = new Date().toString();
  const lengthOfPersons = persons.length;
  response.send(
    `<p>Phonebook has info for ${lengthOfPersons} people <br> ${time}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    //respone message
    return response.status(404);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const generateNewID = () => {
  const maxId = persons.length * 20;
  const ID = Math.random() * maxId;
  return ID;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    response.status(400).json({
      error: "Name is missing",
    });
  }
  if (!body.number) {
    response.status(400).json({
      error: "Number is missing",
    });
  }

  const findName = persons.find(({ name }) => name === body.name);

  if (findName) {
    response.status(400).json({
      error: "Name must be unique",
    });
  }
  const person = {
    id: generateNewID(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.status(201).json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
