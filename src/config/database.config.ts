export const DatabaseConfig = {
  mongodb: {
    uri: process.env.MONGODB_URI,
  },
  redshift: {
    host: process.env.REDSHIFT_HOST,
    port: parseInt(process.env.REDSHIFT_PORT) || 5432,
    database: process.env.REDSHIFT_DB || 'healthsync-metrics',
    username: process.env.REDSHIFT_USER,
    password: process.env.REDSHIFT_PASSWORD,
  },
};
