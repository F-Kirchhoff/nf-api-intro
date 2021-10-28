import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDatabase, getUserCollection } from './utils/database';

dotenv.config();

if (!process.env.SUPER_SECRET_API_KEY || !process.env.SUPER_SECRET_DB_USER) {
  throw new Error('.env file not populated');
}

// Implement Sever Routing
const app = express();
app.use(express.json());
app.use(cookieParser());
const port = 3001;

app.get('/api/logout', (req, res) => {
  if (!req.cookies.username) {
    res.send('Already logged out!');
    return;
  }
  const { username } = req.cookies;
  res.setHeader('Set-Cookie', `username=`);
  console.log(req.cookies);
  res.send(`Goodbye ${username}`);
});

app.get('/api/me', async (req, res) => {
  const { username } = req.cookies;
  const userCollection = getUserCollection();

  const currentUser = await userCollection.findOne({
    username: username,
  });

  currentUser
    ? res.send(currentUser)
    : res.status(404).send('Nobody is logged in!');
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const userCollection = getUserCollection();

  const foundUser = await userCollection.findOne({
    username: username,
    password: password,
  });

  foundUser
    ? res
        .setHeader('Set-Cookie', `username=${foundUser.username}`)
        .send(`Herzlich Willkommen ${foundUser.name}`)
    : res.status(403).send('Ooops, wrong username or password.');
});

app.post('/api/users/', async (request, response) => {
  const { name, username, age, mail, password } = request.body;

  if (!(name && username && age && mail && password)) {
    response.status(400).send('Insufficient data to create a user.');
    return;
  }
  const userCollection = getUserCollection();

  const foundUser = await userCollection.find({ username: username }).toArray();

  if (foundUser.length > 0) {
    response.status(501).send('Username already in use.');
    return;
  }

  const newUser = {
    name,
    age,
    mail,
    username,
    password,
  };

  userCollection.insertOne(newUser);

  response.send(request.body);
});

app.delete('/api/users/', async (req, res) => {
  // find matching users
  const { username } = req.query;

  const userCollection = getUserCollection();

  userCollection.deleteOne({ username: username });
  res.send(`Success`);
});

app.get('/api/users/', async (req, res) => {
  // filter the users for all possible queries, if specified
  const { name, username, age } = req.query;

  const userCollection = getUserCollection();

  const foundUsers = await userCollection
    .find({
      $or: [{ username: username }, { name: name }, { age: Number(age) }],
    })
    .toArray();

  foundUsers.length !== 0
    ? res.send(foundUsers)
    : res.status(404).send('No matching user found.');
});
app.get('/api/users/all', async (_request, response) => {
  // filter the users for all possible queries, if specified
  const userCollection = getUserCollection();

  const allUsers = await userCollection.find().toArray();
  response.send(allUsers);
});
app.get('/', (_req, res) => {
  res.send('Hello World!');
});

// ###########################################
// start connection with database and start server
// ###########################################

connectDatabase(
  `mongodb+srv://${process.env.SUPER_SECRET_DB_USER}:${process.env.SUPER_SECRET_API_KEY}@pier1.vjjm9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
