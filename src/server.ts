import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = 3001;

interface Query {
  name?: string;
  username?: string;
  age?: number;
}

const model: {
  currentUser: {
    name: string;
    age: number;
    mail: string;
  } | null;
} = {
  currentUser: null,
};

let users = [
  {
    _id: 0,
    name: 'Dieter',
    age: 34,
    mail: 'awesomeDieter1337@gmail.com',
    username: 'Dietonator',
    password: '1234',
  },
  {
    _id: 1,
    name: 'Friedhelm',
    age: 12,
    mail: 'BigAndJuicy1234@gmail.com',
    username: 'Historylover13',
    password: '1234',
  },
  {
    _id: 2,
    name: 'Julius',
    age: 70,
    mail: 'etTuBrutus2021@gmail.com',
    username: 'RealJuliusCaesar',
    password: '1234',
  },
  {
    _id: 3,
    name: 'Engelbert',
    age: 23,
    mail: 'hellsAngel23@gmail.com',
    username: 'Engels',
    password: '1234',
  },
  {
    _id: 4,
    name: 'Grunhilde',
    age: 99,
    mail: 'awesomeHilda42@gmail.com',
    username: 'OldButGold',
    password: '1234',
  },
  {
    _id: 5,
    name: 'Waldtraut',
    age: 67,
    mail: 'Waldi420@gmail.com',
    username: 'Forestdares',
    password: '1234',
  },
];

app.post('/api/logout', (_req, res) => {
  if (!model.currentUser) {
    res.send('Already logged out!');
  } else {
    res.send(`Goodbye ${model.currentUser.name}`);
    model.currentUser = null;
  }
});

app.get('/api/me', (_req, res) => {
  res.send(model.currentUser);
});

app.post('/api/login', (req, res) => {
  const userLogin = req.body;

  const foundUser = users.find(
    (user) =>
      user.username === userLogin.username &&
      user.password === userLogin.password
  );
  if (foundUser) {
    model.currentUser = {
      name: foundUser.name,
      age: foundUser.age,
      mail: foundUser.mail,
    };
    res.send(`Herzlich Willkommen ${foundUser.name}`);
  } else {
    res.status(403).send('Ooops, wrong username or password.');
  }
});

app.post('/api/users/', (request, response) => {
  // find matching users
  const { name, username, age, mail, password } = request.body;

  if (!(name && username && age && mail && password)) {
    response.status(400).send('Insufficient data to create a user.');
    return;
  }

  const isAlreadyInDB = users.some(
    (user) => user.mail === mail || user.username === username
  );
  if (isAlreadyInDB) {
    response.status(409).send('This User is availalbe.');
    return;
  }

  const newUser = {
    _id: generateId(),
    name,
    age,
    mail,
    username,
    password,
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
  const foundUsers = filterUsersFlex(request.query);

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
  const { name, username, age: ageStr } = query;

  const age = Number(ageStr);
  return users.filter(
    (user) =>
      (name || age || username) &&
      (!name || user.name.toLowerCase() === name) &&
      (!age || user.age === age) &&
      (!username || user.username.toLowerCase() === username)
  );
}

function filterUsersFlex(query: Query) {
  const { name, username, age: ageStr } = query;

  const age = Number(ageStr);
  return users.filter(
    (user) =>
      (name || age || username) &&
      (!name || user.name.toLowerCase().includes(name)) &&
      (!age || user.age === age) &&
      (!username || user.username.toLowerCase().includes(username))
  );
}

function generateId() {
  return new Date().getTime();
}
