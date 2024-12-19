export const DatabaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthsync',
  },
  redshift: {
    host: process.env.REDSHIFT_HOST,
    port: parseInt(process.env.REDSHIFT_PORT) || 5432,
    database: process.env.REDSHIFT_DB || 'healthsync',
    username: process.env.REDSHIFT_USER,
    password: process.env.REDSHIFT_PASSWORD,
  },
};
