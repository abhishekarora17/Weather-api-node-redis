// cache/redisClient.js
require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.on('error', (err) => console.error(' Redis Client Error:', err));

(async () => {
  await client.connect();
})();
client.on('connect', () => {
  console.log('Connected to Redis');
});
client.on('ready', () => {
  console.log('Redis client is ready');
});
client.on('end', () => {
  console.log('Redis client disconnected');
});
client.on('reconnecting', () => {
  console.log('Redis client reconnecting');
});
client.on('error', (err) => {
  console.error('Redis client error:', err);
});
client.on('warning', (warning) => {
  console.warn('Redis client warning:', warning);
});
client.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
});

module.exports = client;
