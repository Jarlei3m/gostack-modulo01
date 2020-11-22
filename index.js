const express = require('express');

const server = express();

server.use(express.json());

// Query Params = ?teste=1
// Route params = /users/1
// Request Body = { "nome": "Diego", "email": "diego@rocketseat.com" }

// localhost:3000/teste

// CRUD - create, read, update, delete

const users = [ 'Diego', 'Robson', 'Victor'];

server.use((req, res, next) => {
  console.time('Request')
  console.log(`Método: ${req.method}, url: ${req.url}`);

  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "username is required" });
  }

  return next();
};

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if(!user) {
    return res.status(400).json({ error: "User does not exists!"});
  }

  req.user = user
  return next();
};

server.get('/users', (req, res) => {
  return res.json(users)
});

server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
})

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users)
})

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  return res.json(users);
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);