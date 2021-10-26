import express from 'express';

const app = express();
const port = 3001;

const users = [
  {
    name: 'Dieter',
    age: '34',
    mail: 'awesomeDieter1337@gmail.com',
  },
  {
    name: 'Friedhelm',
    age: '34',
    mail: 'awesomeDieter1337@gmail.com',
  },
  {
    name: 'Julius',
    age: '34',
    mail: 'awesomeDieter1337@gmail.com',
  },
  {
    name: 'Engelbert',
    age: '34',
    mail: 'awesomeDieter1337@gmail.com',
  },
  {
    name: 'Grunhilde',
    age: '34',
    mail: 'awesomeDieter1337@gmail.com',
  },
  {
    name: 'Waldtraut',
    age: '34',
    mail: 'awesomeDieter1337@gmail.com',
  },
];

app.get('/api/users/:name', (request, response) => {
  const user = users.find(
    (user) => user.name.toLowerCase() === request.params.name
  );
  user
    ? response.send(user)
    : response.status(404).send({
        message: 'User not found!',
      });
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
