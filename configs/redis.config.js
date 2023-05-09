const redis = require('redis');


let redisClient;

(async () => {
    redisClient = redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT);
    redisClient.on("error", (error) => {
        console.log(`Error ${error}`);
    });
    await redisClient.connect();
})();

module.exports = redisClient;