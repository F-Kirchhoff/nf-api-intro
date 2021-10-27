import express from 'express';

const app = express();
app.use(express.json());
const port = 3001;

interface Query {
  name?: string;
  nickname?: string;
  age?: number;
}

let users = [
  {
    _id: 0,
    name: 'Dieter',
    age: 34,
    mail: 'awesomeDieter1337@gmail.com',
    nickname: 'Dietonator',
  },
  {
    _id: 1,
    name: 'Friedhelm',
    age: 34,
    mail: 'awesomeDieter1337@gmail.com',
    nickname: 'Historylover13',
  },
  {
    _id: 2,
    name: 'Julius',
    age: 34,
    mail: 'awesomeDieter1337@gmail.com',
    nickname: 'test',
  },
  {
    _id: 3,
    name: 'Engelbert',
    age: 34,
    mail: 'awesomeDieter1337@gmail.com',
    nickname: 'Engels',
  },
  {
    _id: 4,
    name: 'Grunhilde',
    age: 34,
    mail: 'awesomeDieter1337@gmail.com',
    nickname: 'OldButHot',
  },
  {
    _id: 5,
    name: 'Waldtraut',
    age: 34,
    mail: 'awesomeDieter1337@gmail.com',
    nickname: 'Forestdares',
  },
];
app.post('/api/users/', (request, response) => {
  // find matching users
  const { name, nickname, age, mail } = request.body;
  const newUser = {
    _id: new Date().getTime(),
    name,
    nickname,
    mail,
    age,
  };

  users = [...users, newUser];

  response.send(request.body);
});

app.delete('/api/users/', (request, response) => {
  // find matching users
  const foundUsers = filterUsers(request.query);
  // get their ids
  const foundUserIds = foundUsers.map((user) => user._id);
  // remove user if id is in the found Users IDs
  users = users.filter((user) => !foundUserIds.includes(user._id));
  // send a response
  response.send(`Deleted user IDs: ${foundUserIds}`);
});

app.get('/api/users/', (request, response) => {
  // filter the users for all possible queries, if specified
  const foundUsers = filterUsers(request.query);

  foundUsers.length !== 0
    ? response.send(foundUsers)
    : response.status(404).send('No matching user found.');
});
app.get('/api/users/all', (_request, response) => {
  // filter the users for all possible queries, if specified
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

function filterUsers(query: Query) {
  const { name, nickname, age: ageStr } = query;

  const age = Number(ageStr);
  return users.filter(
    (user) =>
      (name || age || nickname) &&
      (!name || user.name.toLowerCase() === name) &&
      (!age || user.age === age) &&
      (!nickname || user.nickname.toLowerCase() === nickname)
  );
}
