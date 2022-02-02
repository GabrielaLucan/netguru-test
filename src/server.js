import express from "express";
import bodyParser from "body-parser";
import redis from 'redis';
import bluebird from 'bluebird';
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

import { authFactory, AuthError } from "./services/auth.js";
import setupRoutes from './routes.js'
import initMongoose from "./config/mongoose.js";
import { JWT_SECRET, OMDB_API_KEY } from './config/index.js';

const PORT = 3000;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

if (!OMDB_API_KEY) {
  throw new Error("Missing OMDB_API_KEY env var. Set it and restart the server");
}

export const redisClient = redis.createClient({ host: 'redis-server', port: 6379 });

const auth = authFactory(JWT_SECRET);
const app = express();

app.use(bodyParser.json());

app.post("/auth", (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid payload" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "invalid payload" });
  }

  try {
    const token = auth(username, password);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    next(error);
  }
});

app.use((error, _, res, __) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

initMongoose()
  .then(() => {
    console.log('Connected to database');

    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((mongoErr) => {
    console.log('error when connection to database: ', mongoErr);
  });


setupRoutes(app);
export default app;
