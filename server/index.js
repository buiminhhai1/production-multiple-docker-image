const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const cors = require('cors');
const { Pool } = require('pg');
const { postgres, redis: keys} = require('./keys');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const pgClient = new Pool({
  user: postgres.pgUser,
  host: postgres.pgHost,
  database: postgres.pgDatabase,
  password: postgres.pgPassword,
  port: postgres.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

(async () => {
  await pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log('Not found table ne',err));
})();
// Redis Client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();


// Express route handlers
app.get('/', (req, res) => {
  res.send('Hello')
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

const findFib = number => {
  if (number < 2) {
    return 1;
  }
  return findFib(number - 1) + findFib(number - 2);
}

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }
  const valueCal = findFib(index);
  redisClient.hset('values', index, valueCal);
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, () => console.log('app listening at port 5000'));