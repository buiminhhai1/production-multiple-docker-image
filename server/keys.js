 const redis = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT
};
 const postgres = {
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT
};

module.exports = {
  redis,
  postgres
}